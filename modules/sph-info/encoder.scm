(library (sph-info encoder)
  (export
    encoder-routes)
  (import
    (guile)
    (rnrs bytevectors)
    (sph)
    (sph-info helper)
    (sph-info processor)
    (sph alist)
    (sph base91)
    (sph hashtable)
    (sph io)
    (sph web app client)
    (sph web app http))

  #;(ht-create "encode-base64"
    (l (path-input path-output options)
      (file->file path-input path-output
        #:copy base64-encode-port #:input-binary #t #:output-binary #f))
    "decode-base64"
    (l (path-input path-output options)
      (file->file path-input path-output
        #:copy base64-decode-port #:input-binary #t #:output-binary #f))
    "encode-base91" "decode-base91"
    (l (path-input path-output options)
      (call-with-output-file path-output
        (l (out) (bytevector->file (base91-decode (file->string path-input)) path-output)))))

  (define (processor-respond-f input-output-config file-f file-name-f text-f)
    (l (request)
      (case (swa-http-request-method request)
        ( (get)
          (let (swa-env (swa-http-request-swa-env request))
            (respond-shtml
              (shtml-layout (list (file->download-form) " or " (text->text-form)) #:title
                (route-title (ht-ref-q (swa-http-request-data request) route)) #:css
                (client-static swa-env (q css) (list-q default processor)) #:js
                (client-static swa-env (q js) (list-q default processor))))))
        ( (post)
          (let (is-text (alist-ref (swa-http-request-query request) "text"))
            (if is-text (text->text request text-f) (file->download request file-f file-name-f))))
        (else (respond 405)))))

  ; url: /converter/from/to
  ; data entry: file, text, number, custom
  ; input type select: select, suggest select
  ; response format: file, text
  ; number converts two values
  ; groups
  ;   formatter (js, css, perl, xml, html, scheme, json, sql, c, sxml, sc)
  ;   documents (pandoc formats)
  ;   units (units formats)
  ;   minifier (js, css, html)
  ;   syntax (json-xml, sxml-json, sxml-xml, sc-c, coffee-js, sjs-js)
  ;   binary-to-text (base64, base91)
  ;   text (lowercase, remove double newlines, newlines to comma, comma to newlines, remove line comments, randomise lines)

  (define processor-io-config
    (list
      (list "data" "base91"
        (q (file text)) (q (file text))
        null
        (l (source-path target-path options)
          (call-with-output-file target-path
            (l (port) (display (base91-encode (file->bytevector source-path)) port)) #:binary #t))
        (l (file-name options) (string-append file-name ".base91"))
        (l (input-text client) (display (base91-encode (string->utf8 input-text)) client)))
      (list "base91" "data"
        (q (file text)) (q (file text))
        null
        (l (source-path target-path options)
          (call-with-output-file target-path
            (l (port) (display (base91-encode (file->bytevector source-path)) port)) #:binary #t))
        (l (file-name options) (string-append file-name ".base91"))
        (l (input-text client) (display (base91-encode (string->utf8 input-text)) client)))))

  (define (processor-io-config->select-fields a) (map-apply (l from to)))

  (define (processor-respond-f io-config)
    (let
      (l (request)
        (let (path (tail (string-split (ht-ref-q (swa-http-request-data request) path) #\/)))
          (apply
            (l* (#:optional from to #:rest rest)
              (case (swa-http-request-method request)
                ( (get)
                  (let (swa-env (swa-http-request-swa-env request))
                    (respond-shtml
                      (shtml-layout (list (file->download-form) " or " (text->text-form)) #:title
                        (route-title (ht-ref-q (swa-http-request-data request) route)) #:css
                        (client-static swa-env (q css) (list-q default processor)) #:js
                        (client-static swa-env (q js) (list-q default processor))))))
                ( (post)
                  (let (is-text (alist-ref (swa-http-request-query request) "text"))
                    (if is-text (text->text request text-f)
                      (file->download request file-f file-name-f))))
                (else (respond 405))))
            path)))))

  (define encoder-routes
    (list
      (route-new "/converter" "data format converter" (converter-respond-f processor-io-config)))))
