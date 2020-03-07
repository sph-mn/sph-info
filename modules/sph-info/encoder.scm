(define-module (sph-info encoder))

(use-modules (rnrs bytevectors) (sph)
  (sph-info helper) (sph-info processor)
  (rnrs io ports)
  (sph io)
  (sph alist) (sph base64)
  (sph base91) (sph hashtable)
  (sph web app client) (sph web app http) ((sph io) #:select ((file->file . io-file->file))))

(export encoder-routes)

(define encoder-routes
  (processor-routes "binary/text conversions" "/binary-text"
    (list "any" "base64"
      (list-q file-to-file text-to-text) null
      (l (request source-path target-path options)
        (io-file->file source-path target-path
          #:copy base64-encode-port #:input-binary #t #:output-binary #f))
      (l (request file-name options) (string-append file-name ".base64"))
      (l (request input-text client) (false-if-exception (display (base64-encode (string->utf8 input-text)) client))))
    (list "base64" "any"
      (list-q file-to-file text-to-file) null
      (l (request source-path target-path options)
        (call-with-output-file target-path
          (l (port)
            (false-if-exception (put-bytevector port (base64-decode (file->string source-path)))))))
      (l (request file-name options) file-name) #f)
    (list "any" "base91"
      (list-q file-to-file text-to-text) null
      (l (request source-path target-path options)
        (call-with-output-file target-path
          (l (port) (false-if-exception (display (base91-encode (file->bytevector source-path)) port))) #:binary #t))
      (l (request file-name options) (string-append file-name ".base91"))
      (l (request input-text client) (display (base91-encode (string->utf8 input-text)) client)))
    (list "base91" "any"
      (list-q file-to-file text-to-file) null
      (l (request source-path target-path options)
        (call-with-output-file target-path
          (l (port) (false-if-exception (bytevector->file (base91-decode (file->string source-path)) target-path)))
          #:binary #t))
      (l (request file-name options) file-name) #f)))
