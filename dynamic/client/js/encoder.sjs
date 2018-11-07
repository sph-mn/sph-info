(module.define "ytilitu.encoder" (array "ytilitu.lib.file_processor")
  (nullary
    (define (initialise)
      (chain forEach
        (array "encode-base64" "encode-base91"
          "decode-base64" "decode-base91" "string-escape" "string-unescape")
        (l (a) (ytilitu.lib.file-processor.initialise-form (+ "encoder-" a)))))
    (initialise)))
