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

(define* (file->file request f file-name-f #:optional (additional-form-fields null))
  "default-file-name: file name to use for when no file name was send with the form data
   additional-form-fields: names of other fields to get from the form data"
  (and-let*
    ( (data (html-read-multipart-form-data (swa-http-request-client request) #t))
      (data-file (html-multipart-form-data-ref data "file")) (content (tail data-file))
      (file-name
        (false-if-exception
          (basename (alists-ref (first data-file) "content-disposition" "filename"))))
      (options
        (filter-map (l (a) (false-if-exception (tail (html-multipart-form-data-ref data a))))
          additional-form-fields))
      (swa-env (swa-http-request-swa-env request)) (temp-paths (processor-temp-paths swa-env))
      (status
        (list-bind temp-paths (source-path target-path target-file-name)
          (call-with-output-file source-path (l (port) (display content port)) #:binary #t)
          (let (a (f request source-path target-path options))
            (if (file-exists? source-path) (delete-file source-path)) a)))
      (download-path (string-append web-temp-path (third temp-paths)))
      (download-file-name (file-name-f request file-name options)))
    (nginx-respond-file-download download-path download-file-name)))

(define* (text->text request f #:optional (additional-form-fields null))
  (let (client (swa-http-request-client request))
    (and-let*
      ( (data (html-read-multipart-form-data (swa-http-request-client request) #t))
        (data-text (html-multipart-form-data-ref data "text")) (content (tail data-text))
        (options
          (filter-map (l (a) (false-if-exception (tail (html-multipart-form-data-ref data a))))
            additional-form-fields)))
      (respond-type (q text) (l (client) (f request content client))))))

(define* (text->file request f file-name-f #:optional (additional-form-fields null))
  "default-file-name: file name to use for when no file name was send with the form data
   additional-form-fields: names of other fields to get from the form data"
  (and-let*
    ( (data (html-read-multipart-form-data (swa-http-request-client request) #t))
      (data-text (html-multipart-form-data-ref data "text")) (content (tail data-text))
      (options
        (filter-map (l (a) (false-if-exception (tail (html-multipart-form-data-ref data a))))
          additional-form-fields))
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

(define* (file->file-form form-description initial-output)
  (qq
    (form
      (@ (method post) (enctype "multipart/form-data")
        (class "file-to-file") (action "?io=file-to-file"))
      (unquote form-description)
      (label (@ (class file)) (div "select file")
        (input (@ (class input-file) (name file) (type file))))
      (br) (button (@ (type submit)) "download result"))))

(define (text->text-form form-description initial-output)
  (qq
    (form
      (@ (method post) (action "?io=text-to-text")
        (class "text-to-text") (enctype "multipart/form-data"))
      (unquote form-description) (div "insert text")
      (textarea (@ (class input-text) (name text)) "")
      (textarea (@ (class output-text)) (unquote initial-output)))))

(define (text->html-form form-description initial-output)
  (qq
    (form
      (@ (method post) (action "?io=text-to-html")
        (class "text-to-html") (enctype "multipart/form-data"))
      (unquote form-description) (div "insert text")
      (textarea (@ (class input-text) (name text)) "")
      (div (@ (class output-text)) (unquote initial-output)))))

(define (text->file-form form-description initial-output)
  (qq
    (form
      (@ (method post) (action "?io=text-to-file")
        (class "text-to-file") (enctype "multipart/form-data"))
      (unquote form-description) (div "insert text")
      (textarea (@ (class input-text) (name text)) "") (br)
      (button (@ (type submit)) "download result"))))

(define (processor-config->format-select a)
  (qq
    (select (@ (class formats))
      (unquote
        (map-apply
          (l (from to description io-types . rest)
            (let (from-to (filter identity (list from to)))
              (qq
                (option
                  (@ (value (unquote (string-join from-to "/")))
                    (data-io (unquote (string-join (map symbol->string io-types) " "))))
                  (unquote (string-join from-to " to "))))))
          a)))))

(define (swa-http-request-client-set-utf8! a)
  (set-port-encoding! (swa-http-request-client a) "UTF-8"))

(define (processor-respond-f select title description io-types options file-f file-name-f text-f)
  (let
    (forms
      (list (q div) (q (@ (class "sph-info-processor")))
        (if (null? select) "" (qq (label (div "format") (unquote select))))
        (interleave
          (map
            (l (a)
              ( (case a
                  ((file-to-file) file->file-form)
                  ((text-to-text) text->text-form)
                  ((text-to-html) text->html-form)
                  ((text-to-file) text->file-form)
                  (else (raise (q unsupported-io-type))))
                (let (form-description (alist-ref options (q form-description)))
                  (if form-description
                    (qq (div (@ (class "description")) (unquote form-description))) null))
                (or (alist-ref options (q initial-output)) "")))
            io-types)
          (q (div " or ")))))
    (l (request)
      (let (swa-env (swa-http-request-swa-env request))
        (case (swa-http-request-method request)
          ( (get)
            (respond-shtml
              (shtml-layout
                (qq
                  ( (h1 (unquote title))
                    (unquote-splicing
                      (if description (qq ((div (@ (class "description")) (unquote description))))
                        null))
                    (unquote forms)))
                #:title title
                #:css (client-static swa-env (q css) (q (default processor)))
                #:js (client-static swa-env (q js) (q (default processor))))))
          ( (post)
            (let
              ( (is-development (eq? (q development) (ht-ref-q (swa-env-config swa-env) mode)))
                (io (alist-ref (swa-http-request-query request) "io")))
              (if io
                (let
                  (additional-form-fields (or (alist-ref options (q additional-form-fields)) null))
                  (cond
                    ( (string= "file-to-file" io)
                      (file->file request file-f file-name-f additional-form-fields))
                    ( (or (string= "text-to-text" io) (string= "text-to-html" io))
                      (swa-http-request-client-set-utf8! request)
                      (text->text request
                        (l (request input-text client)
                          (or
                            (if is-development (text-f request input-text client)
                              (false-if-exception (text-f request input-text client)))
                            (display "error" client)))
                        additional-form-fields))
                    ( (string= "text-to-file" io) (swa-http-request-client-set-utf8! request)
                      (text->file request file-f file-name-f additional-form-fields))
                    (else (respond 422))))
                (respond 422))))
          (else (respond 405)))))))

(define (processor-routes title prefix . config)
  "create routes for forms and form-handling of input output according to config.
   config:
     (string string ((symbol . symbol) ...) (string ...) procedure procedure procedure) ...
     (from to ((input . output) ...):io-types add-form-fields file-f file-name-f text-f) ...
   route urls: prefix/from/to
   io-types: file file, text text, text file"
  (let*
    ( (config (compact config))
      (select (if (= 1 (length config)) null (processor-config->format-select config))))
    (map-apply
      (l (from to description . rest)
        (let*
          ( (path-elements (filter identity (list prefix from to)))
            (title
              (string-append title
                (if (null? path-elements) ""
                  (string-append " " (string-join (tail path-elements) " to "))))))
          (route-new (string-join path-elements "/") (string-join path-elements " ")
            (apply processor-respond-f select title description rest))))
      config)))
