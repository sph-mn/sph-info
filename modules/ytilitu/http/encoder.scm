(library (ytilitu http encoder)
  (export
    encoder-routes)
  (import
    (guile)
    (rnrs io ports)
    (sph)
    (sph base64)
    (sph base91)
    (sph hashtable)
    (sph io)
    (sph list)
    (sph string)
    (ytilitu file-processor))

  (define dependencies
    (file-processor-dependencies
      (list-q (#t "encode-base64") (#t "decode-base64")
        (#t "encode-base91") (#t "decode-base91") (#t "string-escape") (#t "string-unescape"))))

  (define name->proc
    (file-processor-name->processor-proc
      (l (paths-program)
        (ht-create "encode-base64"
          (l (path-input path-output options)
            (file->file path-input path-output
              #:copy base64-encode-port #:input-binary #t #:output-binary #f))
          "decode-base64"
          (l (path-input path-output options)
            (file->file path-input path-output
              #:copy base64-decode-port #:input-binary #t #:output-binary #f))
          "string-escape"
          (l (path-input path-output options)
            (call-with-output-file path-output (l (out) (write (file->string path-input) out))))
          "string-unescape"
          (l (path-input path-output options)
            (call-with-output-file path-output
              (l (out) (display (read (file->string path-input)) out))))
          "encode-base91"
          (l (path-input path-output options)
            (call-with-output-file path-output
              (l (out) (display (base91-encode (file->bytevector path-input)) out)) #:binary #t))
          "decode-base91"
          (l (path-input path-output options)
            (call-with-output-file path-output
              (l (out) (bytevector->file (base91-decode (file->string path-input)) path-output))))))
      dependencies))

  (define (title-map a) (string-append "online " (string-join (reverse (string-split a #\-)) " ")))

  (define (name->options a)
    (let
      (default
        (list #:respond-form-options
          (list #:file-name-map
            (l (input-file-name options input-field)
              (string-case a ("encode-base64" (string-append input-file-name ".base64"))
                ("encode-base91" (string-append input-file-name ".base91"))
                ("decode-base64" (string-drop-suffix-if-exists ".base64" input-file-name))
                ("decode-base91" (string-drop-suffix-if-exists ".base91" input-file-name))
                (else input-file-name))))
          #:title-map title-map
          #:shtml-section-options
          (list #:description file-processor-description #:form-options (list #:input-text? #t))))
      default))

  (define encoder-routes
    (file-processor-create-routes "/encoder" "converted"
      name->proc dependencies #:name->options name->options)))
