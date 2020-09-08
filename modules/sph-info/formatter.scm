(define-module (sph-info formatter))

(use-modules (ice-9 threads) (sph)
  (sph-info helper) (sph-info processor)
  (sph io) (sph lang sc-format)
  (sph lang scheme) (sph lang scm-format)
  (sph list) (sph other)
  (sph process) (sph process create) (sph system reader) (sph web app) (sph web app http))

(export formatter-routes)

(define program-dependencies
  (list "uglifyjs" "csstidy" "perltidy" "json" "clang-format" "sqlformat" "xmllint"))

(define (process-string-via-files swa-env a f port)
  (list-bind (processor-temp-paths swa-env) (source-path target-path target-file-name)
    (string->file a source-path) (and (f source-path target-path) (file->port target-path port))))

(define (sqlformat-string->port path-sqlformat a port)
  (execute-with-pipes
    (l (input output) (begin-thread (display a input) (close-port input))
      (begin-first (port->port output port) (close-port output)))
    path-sqlformat (list "-" "--keywords" "lower" "--reindent") #t #t #f))

(define (json-string->port path-json a port)
  (execute-with-pipes
    (l (input output) (begin-thread (display a input) (close-port input))
      (begin-first (port->port output port) (close-port output)))
    path-json null #t #t #f))

(define (csstidy-string->port path-csstidy request a port)
  (let (swa-env (swa-http-request-swa-env request))
    (list-bind (processor-temp-paths swa-env) (source-path target-path target-file-name)
      (string->file a source-path)
      (execute-and-check-result path-csstidy source-path
        (string-append "--template=" (swa-env-root swa-env) "other/csstidy-template") "--silent=true"
        target-path)
      (file->port target-path port))))

(define (uglifyjs-string->port path-uglifyjs a port)
  (execute-with-pipes
    (l (input output) (begin-thread (display a input) (close-port input))
      (begin-first (port->port output port) (close-port output)))
    path-uglifyjs (list "--beautify") #t #t #f))

(define (xmllint-html-string->port path-xmllint request a port)
  (process-string-via-files (swa-http-request-swa-env request) a
    (l (source-path target-path)
      (execute-and-check-result path-xmllint "--html"
        "--nowarning" "--output" target-path source-path))
    port))

(define (xmllint-string->port path-xmllint request a port)
  (process-string-via-files (swa-http-request-swa-env request) a
    (l (source-path target-path)
      (execute-and-check-result path-xmllint "--nowarning" "--output" target-path source-path))
    port))

(define (perltidy-string->port path-perltidy request a port)
  (execute-with-pipes
    (l (input output) (begin-thread (display a input) (close-port input))
      (begin-first (port->port output port) (close-port output)))
    path-perltidy (list "-l=120" "-ole=unix" "-nolc" "-pt=2" "-sbt=2" "-i=2" "-nbbc" "-st") #t #t #f))

(define (clang-format-string->port path-clang-format request a port)
  (execute-with-pipes
    (l (input output) (begin-thread (display a input) (close-port input))
      (begin-first (port->port output port) (close-port output)))
    path-clang-format
    (list
      "-style={BasedOnStyle: Mozilla, SortIncludes: false, AlignEscapedNewlines: DontAlign, AlignOperands: false, AlignAfterOpenBracket: DontAlign, BreakBeforeBraces: Attach, AlwaysBreakAfterReturnType: None, AlwaysBreakAfterDefinitionReturnType: None, PenaltyReturnTypeOnItsOwnLine: 0, AllowShortFunctionsOnASingleLine: true, AllowShortIfStatementsOnASingleLine: true, AllowShortLoopsOnASingleLine: true, ContinuationIndentWidth: 2, ColumnLimit: 0}")
    #t #t #f))

(define (formatter-routes)
  (let (program-path (program-paths-f program-dependencies))
    (processor-routes "code formatter" "/formatter"
      (and (program-path "clang-format")
        (list "c" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (clang-format-string->port (program-path "clang-format") request input-text client))))
      (and (program-path "csstidy")
        (list "css" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (csstidy-string->port (program-path "csstidy") request input-text client))))
      (and (program-path "xmllint")
        (list "html" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (xmllint-html-string->port (program-path "xmllint") request input-text client))))
      (and (program-path "uglifyjs")
        (list "javascript" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (uglifyjs-string->port (program-path "uglifyjs") input-text client))))
      (and (program-path "json")
        (list "json" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (json-string->port (program-path "json") input-text client))))
      (and (program-path "perltidy")
        (list "perl" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (perltidy-string->port (program-path "perltidy") request input-text client))))
      (list "sc" "formatted"
        (q (text-to-text)) null
        #f #f
        (l (request input-text client)
          (display (sc-format (string->datums input-text read-for-formatting)) client)))
      (list "scheme" "formatted"
        (q (text-to-text)) null
        #f #f
        (l (request input-text client)
          (display (scm-format-port (open-input-string input-text)) client)))
      (and (program-path "sqlformat")
        (list "sql" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (sqlformat-string->port (program-path "sqlformat") input-text client))))
      (list "sxml" "formatted"
        (q (text-to-text)) null
        #f #f
        (l (request input-text client)
          (display (scm-format-port (open-input-string input-text)) client)))
      (and (program-path "xmllint")
        (list "xml" "formatted"
          (q (text-to-text)) null
          #f #f
          (l (request input-text client)
            (xmllint-string->port (program-path "xmllint") request input-text client)))))))
