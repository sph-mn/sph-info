(module.define "sph-info.formatter" (unquote "sph-info.lib.file-processor")
  (l ()
    (define (initialise)
      (chain forEach
        (array "javascript" "css"
          "html" "json"
          "c" "go"
          "sql" "xml" "cpp" "php" "css" "java" "html" "perl" "sxml" "csharp" "scheme" "objective-c")
        (l (a) (sph-info.lib.file-processor.initialise-form (+ "formatter-" a)))))
    (initialise)))
