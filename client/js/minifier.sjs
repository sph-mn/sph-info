(module.define "ytilitu.minifier" (unquote "ytilitu.lib.file-processor")
  (nullary
    (define (initialise)
      (chain forEach (array "javascript" "css" "html" "json")
        (l (a) (ytilitu.lib.file-processor.initialise-form (+ "minifier-" a)))))
    (initialise)))
