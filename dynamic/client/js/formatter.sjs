(module.define "ytilitu.formatter" (unquote "ytilitu.lib.file-processor")
  (nullary
    (define (initialise)
      (chain forEach
        (array "javascript" "css"
          "html" "json"
          "c" "go"
          "sql" "xml" "cpp" "php" "css" "java" "html" "perl" "sxml" "csharp" "scheme" "objective-c")
        (l (a) (ytilitu.lib.file-processor.initialise-form (+ "formatter-" a)))))
    (initialise)))
