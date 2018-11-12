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
    (sph base64)
    (sph base91)
    (sph hashtable)
    (sph web app client)
    (sph web app http)
    (rename (sph io) (file->file io-file->file)))

  (define encoder-routes
    (processor-routes "binary/text conversions" "/binary-text"
      (list "any" "base64"
        (list-q file-to-file text-to-text) null
        (l (source-path target-path options)
          (io-file->file source-path target-path
            #:copy base64-encode-port #:input-binary #t #:output-binary #f))
        (l (file-name options) (string-append file-name ".base64"))
        (l (input-text client) (display (base64-encode (string->utf8 input-text)) client)))
      (list "base64" "any"
        (list-q file-to-file text-to-file) null
        (l (source-path target-path options)
          (call-with-output-file target-path
            (l (port) (put-bytevector port (base64-decode (file->string source-path))))))
        (l (file-name options) file-name) #f)
      (list "any" "base91"
        (list-q file-to-file text-to-text) null
        (l (source-path target-path options)
          (call-with-output-file target-path
            (l (port) (display (base91-encode (file->bytevector source-path)) port)) #:binary #t))
        (l (file-name options) (string-append file-name ".base91"))
        (l (input-text client) (display (base91-encode (string->utf8 input-text)) client)))
      (list "base91" "any"
        (list-q file-to-file text-to-file) null
        (l (source-path target-path options)
          (call-with-output-file target-path
            (l (port) (bytevector->file (base91-decode (file->string source-path)) target-path))
            #:binary #t))
        (l (file-name options) file-name) #f))))
