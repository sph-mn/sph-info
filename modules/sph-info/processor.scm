(define-module (sph-info processor))

(use-modules (srfi srfi-1) (srfi srfi-2)
  (ice-9 match) (sph)
  (sph-info helper) (sph alist)
  (sph filesystem) (sph hashtable)
  (sph json) (sph list) (sph web app) (sph web app client) (sph web app http) (sph web html))

(export file->file file->file-form
  processor-routes processor-temp-paths text->file text->file-form text->text text->text-form)

(define sph-info-processor-description "helpers to process input data from file or textarea.")
(define web-temp-path "/dynamic/temp/")
(define default-processed-path "webroot/temp/")

(define (processor-temp-paths swa-env)
  (and-let*
    ( (processed-dir
        (string-append (swa-env-root swa-env)
          (ensure-trailing-slash
            (or (ht-ref-q (swa-env-config swa-env) processed-path) default-processed-path))))
      (target-file-name
        (string-append (number->string (current-time) 32) "-"
          (number->string (process-unique-number) 32)))
      (target-path (string-append processed-dir target-file-name))
      (source-path (string-append target-path ".source")))
    (list source-path target-path target-file-name)))

(define* (file->file request f file-name-f #:optional (option-names null))
  "default-file-name: file name to use for when no file name was send with the form data
   option-names: names of other fields to get from the form data"
  (and-let*
    ( (data (html-read-multipart-form-data (swa-http-request-client request) #t))
      (data-file (html-multipart-form-data-ref data "file")) (content (tail data-file))
      (file-name
        (false-if-exception
          (basename (alists-ref (first data-file) "content-disposition" "filename"))))
      (options
        (filter-map (l (a) (false-if-exception (tail (html-multipart-form-data-ref data a))))
          option-names))
      (swa-env (swa-http-request-swa-env request)) (temp-paths (processor-temp-paths swa-env))
      (status
        (list-bind temp-paths (source-path target-path target-file-name)
          (call-with-output-file source-path (l (port) (display content port)) #:binary #t)
          (let (a (f request source-path target-path options))
            (if (file-exists? source-path) (delete-file source-path)) a)))
      (download-path (string-append web-temp-path (third temp-paths)))
      (download-file-name (file-name-f request file-name options)))
    (nginx-respond-file-download download-path download-file-name)))

(define* (file->file-form #:key accept-file-types)
  (let
    (accept
      (if accept-file-types (qq ((accept (unquote (string-join accept-file-types ","))))) null))
    (qq
      (form
        (@ (method post) (enctype "multipart/form-data")
          (class "file-to-file") (action "?io=file-to-file"))
        (label (@ (class file)) (div "select file")
          (input (@ (class input-file) (name file) (type file) (unquote-splicing accept))))
        (br) (button (@ (type submit)) "download result")))))

(define* (text->text request f #:optional (option-names null))
  (and-let*
    ( (data (html-read-multipart-form-data (swa-http-request-client request) #t))
      (data-text (html-multipart-form-data-ref data "text")) (content (tail data-text))
      (options
        (filter-map (l (a) (false-if-exception (tail (html-multipart-form-data-ref data a))))
          option-names)))
    (respond-type (q text) (l (client) (f request content client)))))

(define (text->text-form)
  (qq
    (form
      (@ (method post) (action "?io=text-to-text")
        (class "text-to-text") (enctype "multipart/form-data"))
      (div "insert text") (textarea (@ (class input-text) (name text)) "")
      (textarea (@ (class output-text)) ""))))

(define* (text->file-form)
  (qq
    (form
      (@ (method post) (action "?io=text-to-file")
        (class "text-to-file") (enctype "multipart/form-data"))
      (div "insert text") (textarea (@ (class input-text) (name text)) "")
      (br) (button (@ (type submit)) "download result"))))

(define* (text->file request f file-name-f #:optional (option-names null))
  "default-file-name: file name to use for when no file name was send with the form data
   option-names: names of other fields to get from the form data"
  (and-let*
    ( (data (html-read-multipart-form-data (swa-http-request-client request) #t))
      (data-text (html-multipart-form-data-ref data "text")) (content (tail data-text))
      (options
        (filter-map (l (a) (false-if-exception (tail (html-multipart-form-data-ref data a))))
          option-names))
      (swa-env (swa-http-request-swa-env request))
      (processed-dir
        (string-append (swa-env-root swa-env)
          (ensure-trailing-slash
            (or (ht-ref-q (swa-env-config swa-env) processed-path) default-processed-path))))
      (target-file-name
        (string-append (number->string (current-time) 32) "-"
          (number->string (process-unique-number) 32)))
      (target-path (string-append processed-dir target-file-name))
      (source-path (string-append target-path ".source"))
      (status
        (begin (call-with-output-file source-path (l (port) (display content port)) #:binary #t)
          (let (a (f request source-path target-path options))
            (if (file-exists? source-path) (delete-file source-path)) a)))
      (download-path (string-append web-temp-path target-file-name))
      (download-file-name (file-name-f request "converted" options)))
    (nginx-respond-file-download download-path download-file-name)))

(define (processor-config->format-select a)
  (qq
    (select (@ (class formats))
      (unquote
        (map-apply
          (l (from to io-types . rest)
            (qq
              (option
                (@ (value (unquote (string-append from "/" to)))
                  (data-io (unquote (string-join (map symbol->string io-types) " "))))
                (unquote (string-append from " to " to)))))
          a)))))

(define (processor-respond-f select title io-types options file-f file-name-f text-f)
  (let
    (forms
      (list (q div) (q (@ (class "sph-info-processor")))
        (qq (label (div "format") (unquote select)))
        (interleave
          (map
            (l (a)
              (case a
                ((file-to-file) (file->file-form))
                ((text-to-text) (text->text-form))
                ((text-to-file) (text->file-form))
                (else (raise (q unsupported-io-type)))))
            io-types)
          (q (div " or ")))))
    (l (request)
      (case (swa-http-request-method request)
        ( (get)
          (respond-shtml
            (let (swa-env (swa-http-request-swa-env request))
              (shtml-layout (list (qq (h1 (unquote title))) forms) #:title
                title #:css
                (client-static swa-env (q css) (q (default processor))) #:js
                (client-static swa-env (q js) (q (default processor)))))))
        ( (post)
          (let (io (alist-ref (swa-http-request-query request) "io"))
            (if io
              (cond
                ((string= "file-to-file" io) (file->file request file-f file-name-f options))
                ( (string= "text-to-text" io)
                  (text->text request
                    (l (request input-text client)
                      (or (false-if-exception (text-f request input-text client))
                        (display "error" client)))
                    options))
                ((string= "text-to-file" io) (text->file request file-f file-name-f options))
                (else (respond 422)))
              (respond 422))))
        (else (respond 405))))))

(define (processor-routes title prefix . config)
  "create routes for forms and form-handling of input output according to config.
   config:
     (string string ((symbol . symbol) ...) (string ...) procedure procedure procedure) ...
     (from to ((input . output) ...):io-types add-form-fields file-f file-name-f text-f) ...
   route urls: prefix/from/to
   io-types: file file, text text, text file"
  (let* ((config (compact config)) (select (processor-config->format-select config)))
    (map-apply
      (l (from to . rest)
        (route-new (string-append prefix "/" from "/" to)
          (string-append "convert from " from " to " to)
          (apply processor-respond-f select title rest)))
      config)))
