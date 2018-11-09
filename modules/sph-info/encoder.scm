(library (sph-info encoder)
  (export
    encoder-routes)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph-info processor)
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

  (define (encode-base91-respond request)
    (case (swa-http-request-method request)
      ( (get)
        (let (swa-env (swa-http-request-swa-env request))
          (respond-shtml
            (shtml-layout (file->download-form) #:title
              (route-title (ht-ref-q (swa-http-request-data request) route)) #:css
              (client-static swa-env (q css) (list-q default processor)) #:js
              (client-static swa-env (q js) (list-q default processor)) #:body-class "encode-base91"))))
      ( (post)
        (file->download request
          (l (source-path target-path options)
            (call-with-output-file target-path
              (l (port) (display (base91-encode (file->bytevector source-path)) port)) #:binary #t))
          (l (file-name options) (string-append file-name ".base91"))))
      (else (respond 405))))

  (define encoder-routes (list (route-new "/base91-encode" "base91 encode" encode-base91-respond))))
