(module.define "sph-info.converter" "sph-info.lib.file-processor"
  (l ()
    (define (initialise)
      (chain forEach
        (array "sc-c" "documents"
          "json-xml" "xml-json" "sxml-xml" "xml-sxml" "sescript-javascript" "coffeescript-javascript")
        (l (a) (sph-info.lib.file-processor.initialise-form (+ "converter-" a)))))
    (initialise)))
