(library (sph-info processor)
  (export
    file->download
    file->download-form
    text->text
    text->text-form)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph filesystem)
    (sph hashtable)
    (sph other)
    (sph web app)
    (sph web app http)
    (sph web html))

  (define sph-info-processor-description "helpers to process input data from file or textarea")
  (define web-temp-path "/dynamic/temp/")
  (define default-processed-path "webroot/temp/")

  (define* (file->download request f file-name-f #:optional (option-names null))
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
            (let (a (f source-path target-path options))
              (if (file-exists? source-path) (delete-file source-path)) a)))
        (download-path (string-append web-temp-path target-file-name))
        (download-file-name (file-name-f file-name options)))
      (nginx-respond-file-download download-path download-file-name)))

  (define* (file->download-form #:key accept-file-types)
    (let
      (accept
        (if accept-file-types (list-qq (accept (unquote (string-join accept-file-types ",")))) null))
      (qq
        (form
          (@ (method post) (enctype "multipart/form-data")
            (class "sph-info-processor file-to-download"))
          (label (@ (class file)) (div "select file")
            (input (@ (class input-file) (name file) (type file) (unquote-splicing accept))))
          (br) (button (@ (type submit)) "download result")))))

  (define* (text->text request f #:key (option-names null))
    (and-let*
      ( (data (html-read-multipart-form-data (swa-http-request-client request) #t))
        (data-text (html-multipart-form-data-ref data "text")) (content (tail data-text))
        (options
          (filter-map (l (a) (false-if-exception (tail (html-multipart-form-data-ref data a))))
            option-names)))
      (respond-type (q text) (l (client) (f content client)))))

  (define (text->text-form)
    (qq
      (form
        (@ (method post) (action "?text")
          (class "sph-info-processor text-to-text") (enctype "multipart/form-data"))
        (div "insert text") (div (@ (class text)) (textarea (@ (class input-text) (name text)) ""))
        (div (@ (class text)) (textarea (@ (class output-text)) ""))))))
