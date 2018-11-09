(module.define "sph-info.minifier" (unquote "sph-info.lib.file-processor")
  (nullary
    (define (initialise)
      (chain forEach (array "javascript" "css" "html" "json")
        (l (a) (sph-info.lib.file-processor.initialise-form (+ "minifier-" a)))))
    (initialise)))
