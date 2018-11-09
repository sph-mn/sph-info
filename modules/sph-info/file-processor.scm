(library (sph-info file-processor)
  (export
    file-processor-create-path
    file-processor-create-routes
    file-processor-create-session-id
    file-processor-dependencies
    file-processor-dependencies->paths-program
    file-processor-description
    file-processor-get-data
    file-processor-name->processor-proc
    file-processor-path-processed
    file-processor-respond-form
    file-processor-respond-proc
    file-processor-shtml-section)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph hashtable)
    (sph list)
    (sph log)
    (sph other)
    (sph record)
    (sph string)
    (sph vector)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web html)
    (sph web shtml))

  (define file-processor-description
    "select and upload a file or enter text into the text box and press run. uploaded files on the server are automatically and securely deleted (3 US DoE compliant passes) after 240 seconds.")

  (define (file-processor-path-processed swa-env)
    (string-append (swa-env-root swa-env)
      (or (ht-ref-q (swa-env-config swa-env) processed-path) "webroot/temp/processed/")))

  (define (file-processor-dependencies->paths-program a)
    (let (r (ht-create)) (each (l (a) (ht-set! r (second a) (first a))) a) r))

  (define (file-processor-name->processor-proc create-table dependencies)
    "procedure:{hashtable:program-name->path}"
    (let (table (create-table (file-processor-dependencies->paths-program dependencies)))
      (letrec ((r (l (a) (let (b (ht-ref table a)) (if (string? b) (r b) b))))) r)))

  (define*
    (file-processor-shtml-section web-base-path route title #:key description (form-options (list)))
    (let (id (string-replace-char (string-drop (route-path route) 1) #\/ #\-))
      (shtml-section 0 title
        (qq
          ( (unquote
              (if description (qq (div (@ (class "small-font")) (unquote description) (br) (br)))
                ""))
            (unquote
              (apply shtml-text-file-form (string-append web-base-path (route-path route))
                form-options))))
        (list (q id) id))))

  (define (file-processor-dependencies config) "((string:program-name ))"
    (map (l (a) (pair (let (a (first a)) (if (string? a) (search-env-path-one a) #t)) a)) config))

  (define (file-processor-create-session-id headers time-start)
    (number->string (process-unique-number) 32))

  (define (file-processor-create-path swa-env session-id name file-name)
    (string-append (file-processor-path-processed swa-env) name "." session-id))

  (define (file-processor-get-data swa-env client alt-file-name)
    (let*
      ( (data (html-read-multipart-form-data client #t))
        (data-file (html-multipart-form-data-ref data "file"))
        (options
          (alist-q swa-env swa-env
            input-type (false-if-exception (tail (html-multipart-form-data-ref data "input-type")))
            output-type (false-if-exception (tail (html-multipart-form-data-ref data "output-type"))))))
      (if (and data-file (tail data-file) (not (string-null? (tail data-file))))
        (vector
          ; content
          (tail data-file)
          ; file-name
          (or
            (false-if-exception
              (basename (alists-ref (first data-file) "content-disposition" "filename")))
            alt-file-name)
          options (q file))
        (let (data-text (html-multipart-form-data-ref data "text"))
          (and data-text (vector (tail data-text) alt-file-name options (q text)))))))

  (define (default-file-name-map a options) a)

  (define*
    (file-processor-respond-form swa-env name request-headers alt-file-name client time-start proc
      #:key
      display?
      display-if-field-text?
      file-name-map)
    "processes either text from a textarea or a file, but not both, and either displays the result or offers a download for it in a new tab.
     must follow a post request with multipart/form-data"
    (let (data (file-processor-get-data swa-env client alt-file-name))
      (or
        (and data
          (let*
            ( (swa-root (swa-env-root swa-env))
              (web-base-path (or (ht-ref-q (swa-env-config swa-env) web-base-path) ""))
              (session-id (file-processor-create-session-id request-headers time-start))
              (path (file-processor-create-path swa-env session-id name (vector-second data)))
              (path-source (string-append path ".source"))
              (path-public (string-append web-base-path path)) (input-field (vector-ref data 3))
              (status
                (begin
                  (call-with-output-file path-source (l (port) (display (vector-first data) port))
                    #:binary #t)
                  (if (swa-config-ref swa-env production)
                    (false-if-exception (proc path-source path (vector-third data)))
                    (proc path-source path (vector-third data))))))
            (if (file-exists? path-source) (delete-file path-source))
            (debug-log
              (and status
                (if (or display-if-field-text? display?)
                  (nginx-respond-file path-public "text/plain")
                  (nginx-respond-file-download path-public
                    (if file-name-map
                      (file-name-map (vector-second data) (vector-third data) (vector-ref data 3))
                      (vector-second data))))))))
        (respond "failure. syntax or other error."))))

  (define*
    (file-processor-respond-proc path-dirname path-basename alt-file-name processor #:key
      (title-map identity)
      (add-css (list))
      (add-js (list))
      (shtml-section-options (list))
      (respond-form-options (list)))
    (let*
      ( (path-dirname-relative path-dirname)
        (name (string-append (string-replace-char path-dirname-relative #\/ #\-) "-" path-basename)))
      (l (request)
        (sph-info-request-bind request (swa-env data time-start route routes)
          (let
            ( (method (swa-http-request-method request))
              (web-base-path (ht-ref-q data web-base-path)))
            (if (equal? (q post) method)
              (apply file-processor-respond-form swa-env
                name (swa-http-request-headers request)
                alt-file-name (swa-http-request-client request)
                time-start processor respond-form-options)
              (let (title (title-map (route-title route)))
                (respond-shtml
                  (shtml-layout
                    (apply file-processor-shtml-section web-base-path
                      route title shtml-section-options)
                    #:title title
                    #:css
                    (append (client-static swa-env (q css) (list-q default file-processor))
                      (if (null? add-css) (list) (list (client-file swa-env (q css) #f add-css))))
                    #:js
                    (append (client-static swa-env (q js) (list-q default file-processor))
                      (list
                        (client-file swa-env (q js)
                          #f (pair (string-append path-dirname-relative ".sjs") add-js))))
                    #:body-class name #:links default-links)
                  (cache-headers time-start)))))))))

  (define*
    (file-processor-create-routes path-prefix alt-file-name name->proc dependencies #:key
      name->options)
    (list-sort-with-accessor (l a (apply > (map string-length a))) route-path
      (apply append
        (map-apply
          (l (path-program name-program . types)
            (if path-program
              (map
                (l (a)
                  (route-new (string-append path-prefix "/" a) a
                    (apply file-processor-respond-proc path-prefix
                      a alt-file-name (name->proc a) (if name->options (name->options a) (list)))))
                types)
              (begin (log-message (q error) (string-append "missing dependency " name-program))
                (list))))
          dependencies)))))
