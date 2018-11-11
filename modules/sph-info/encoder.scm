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

  ; input type select: select, suggest select
  ; groups
  ;   formatter (js, css, perl, xml, html, scheme, json, sql, c, sxml, sc)
  ;   documents (pandoc formats)
  ;   units (units formats)
  ;   minifier (js, css, html)
  ;   syntax (json-xml, sxml-json, sxml-xml, sc-c, coffee-js, sjs-js)
  ;   binary-to-text (base64, base91)
  ;   text (lowercase, remove double newlines, newlines to comma, comma to newlines, remove line comments, randomise lines)

  (define encoder-routes
    (processor-routes "/binary-text"
      (list "any" "base91"
        (list-q file-to-file text-to-text) null
        (l (source-path target-path options)
          (call-with-output-file target-path
            (l (port) (display (base91-encode (file->bytevector source-path)) port)) #:binary #t))
        (l (file-name options) (string-append file-name ".base91"))
        (l (input-text client) (display (base91-encode (string->utf8 input-text)) client)))
      (list "base91" "any"
        (list-q file-to-file text-to-text) null
        (l (source-path target-path options)
          (call-with-output-file target-path
            (l (port) (display (base91-encode (file->bytevector source-path)) port)) #:binary #t))
        (l (file-name options) (string-append file-name ".base91"))
        (l (input-text client) (display (base91-encode (string->utf8 input-text)) client))))))
