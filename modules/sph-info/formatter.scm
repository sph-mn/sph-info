(library (sph-info formatter)
  (export
    formatter-routes)
  (import
    (guile)
    (ice-9 threads)
    (sph)
    (sph-info processor)
    (sph io)
    (sph list)
    (sph other)
    (sph process)
    (sph process create)
    (sph web app)
    (sph web app http))

  (define path-uglifyjs (search-env-path-one "uglifyjs"))
  (define path-csstidy (search-env-path-one "csstidy"))
  (define path-perltidy (search-env-path-one "perltidy"))
  (define path-json (search-env-path-one "json"))
  (define path-clang-format (search-env-path-one "json"))
  (define path-sqlformat (search-env-path-one "sqlformat"))
  (define path-xmllint (search-env-path-one "xmllint"))

  (define (process-string-via-files swa-env a f port)
    (list-bind (processor-temp-paths swa-env) (source-path target-path target-file-name)
      (string->file a source-path) (and (f source-path target-path) (file->port target-path port))))

  (define (sqlformat-string->port a port)
    (execute-with-pipes
      (l (input output) (begin-thread (display a input) (close-port input))
        (begin-first (port->port output port) (close-port output)))
      path-sqlformat (list "-" "--keywords" "lower" "--reindent") #t #t #f))

  (define (json-string->port a port)
    (execute-with-pipes
      (l (input output) (begin-thread (display a input) (close-port input))
        (begin-first (port->port output port) (close-port output)))
      path-json null #t #t #f))

  (define (csstidy-string->port request a port)
    (let (swa-env (swa-http-request-swa-env request))
      (list-bind (processor-temp-paths swa-env) (source-path target-path target-file-name)
        (string->file a source-path)
        (execute-and-check-result path-csstidy source-path
          (string-append "--template=" (swa-env-root swa-env) "other/csstidy-template")
          "--silent=true" target-path)
        (file->port target-path port))))

  (define (uglifyjs-string->port a port)
    (execute-with-pipes
      (l (input output) (begin-thread (display a input) (close-port input))
        (begin-first (port->port output port) (close-port output)))
      path-uglifyjs (list "--beautify") #t #t #f))

  (define (xmllint-html-string->port request a port)
    (process-string-via-files (swa-http-request-swa-env request) a
      (l (source-path target-path)
        (execute-and-check-result path-xmllint "--html"
          "--nowarning" "--output" target-path source-path))
      port))

  (define (xmllint-string->port request a port)
    (process-string-via-files (swa-http-request-swa-env request) a
      (l (source-path target-path)
        (execute-and-check-result path-xmllint "--nowarning" "--output" target-path source-path))
      port))

  (define formatter-routes
    (processor-routes "code formatter" "/formatter"
      (list "sql" "formatted-sql"
        (list-q text-to-text) null
        #f #f (l (request input-text client) (sqlformat-string->port input-text client)))
      (list "json" "formatted-json"
        (list-q text-to-text) null
        #f #f (l (request input-text client) (json-string->port input-text client)))
      (list "css" "formatted-css"
        (list-q text-to-text) null
        #f #f (l (request input-text client) (csstidy-string->port request input-text client)))
      (list "javascript" "formatted-javascript"
        (list-q text-to-text) null
        #f #f (l (request input-text client) (uglifyjs-string->port input-text client)))
      (list "html" "formatted-html"
        (list-q text-to-text) null
        #f #f (l (request input-text client) (xmllint-html-string->port request input-text client)))
      (list "xml" "formatted-xml"
        (list-q text-to-text) null
        #f #f (l (request input-text client) (xmllint-string->port request input-text client)))))

  ;scheme, perl, c, sc, sxml

  (list-q "perl"
    (l (path-input path-output options)
      (execute-and-check-result (ht-ref paths-program "perltidy") "-l=120"
        "-ole=unix" "-nolc"
        "-pt=2" "-sbt=2" "-i=2" "-nbbc" path-input (string-append "-o=" path-output)))
    "xml"
    (l (path-input path-output options)
      (execute-and-check-result (ht-ref paths-program "xmllint") "--output" path-output path-input))
    "html"
    (l (path-input path-output options)
      (execute-and-check-result (ht-ref paths-program "xmllint") "--html"
        "--output" path-output path-input))
    "scheme"
    (l (path-input path-output options)
      (execute-and-check-result (ht-ref paths-program "scm-format")
        (cli-option "output" path-output) path-input))
    "c"
    (l (path-input path-output options)
      (execute-and-check-result (ht-ref paths-program "astyle-to-file")
        (cli-option "astyle-options" (cli-option "mode" "c")) path-input path-output))
    "sxml"))
