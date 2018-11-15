(library (sph-info syntax)
  (export
    syntax-routes)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph-info processor)
    (sph hashtable)
    (sph lang sc)
    (sph lang scheme)
    (sph lang sescript)
    (sph list)
    (sph log)
    (sph other)
    (sph process)
    (sph web app http)
    (sxml simple)
    (rename (sph io) (file->file io-file->file)))

  (define program-dependencies (list "uglifyjs" "clang-format"))

  (define (uglifyjs-beautify path-uglifyjs source target)
    (execute-and-check-result path-uglifyjs "--beautify" "--output" target source))

  (define (clang-format path-clang-format path)
    (execute-and-check-result path-clang-format "-i"
      "-style={BasedOnStyle: Mozilla, SortIncludes: false, AlignEscapedNewlines: DontAlign, AlignOperands: false, AlignAfterOpenBracket: DontAlign, BreakBeforeBraces: Attach, AlwaysBreakAfterReturnType: None, AlwaysBreakAfterDefinitionReturnType: None, PenaltyReturnTypeOnItsOwnLine: 0, AllowShortFunctionsOnASingleLine: true, AllowShortIfStatementsOnASingleLine: true, AllowShortLoopsOnASingleLine: true, ContinuationIndentWidth: 2, ColumnLimit: 0}"
      path))

  (define (syntax-routes)
    (let*
      ( (program-path (program-paths-f program-dependencies))
        (path-uglifyjs (program-path "uglifyjs")) (path-clang-format (program-path "clang-format")))
      (processor-routes "syntax conversions" "/syntax"
        (list "sxml" "xml"
          (list-q file-to-file text-to-text) null
          (l (request source-path target-path options)
            (call-with-output-file target-path
              (l (port) (sxml->xml (pair (q begin) (file->datums source-path)) port))))
          (l (request file-name options) (string-append file-name ".xml"))
          (l (request input-text client) (sxml->xml (string->datums input-text) client)))
        (list "xml" "sxml"
          (list-q file-to-file text-to-text) null
          (l (request source-path target-path options)
            (call-with-output-file target-path
              (l (port) (write (xml->sxml (file->string source-path)) port))))
          (l (request file-name options) (string-append file-name ".sxml"))
          (l (request input-text client) (write (xml->sxml input-text) client)))
        (and path-clang-format
          (list "sc" "c"
            (list-q file-to-file text-to-text) null
            (l (request source-path target-path options)
              (string->file (sc->c (pair (q begin) (file->datums source-path)) null) target-path))
            (l (request file-name options) (string-append file-name ".c"))
            (l (request input-text client)
              (list-bind (processor-temp-paths (swa-http-request-swa-env request))
                (source-path target-path target-file-name)
                (string->file (sc->c (pair (q begin) (string->datums input-text)) null) target-path)
                (clang-format path-clang-format target-path)
                (display (file->string target-path) client)))))
        (and path-uglifyjs
          (list "sescript" "javascript"
            (list-q file-to-file text-to-text) null
            (l (request source-path target-path options)
              (call-with-output-file target-path
                (l (port) (sescript->ecmascript (file->datums source-path) port null))))
            (l (request file-name options) (string-append file-name ".js"))
            (l (request input-text client)
              (list-bind (processor-temp-paths (swa-http-request-swa-env request))
                (source-path target-path target-file-name)
                (call-with-output-file source-path
                  (l (port) (sescript->ecmascript (string->datums input-text) port null)))
                (uglifyjs-beautify path-uglifyjs source-path target-path)
                (display (file->string target-path) client)))))))))
