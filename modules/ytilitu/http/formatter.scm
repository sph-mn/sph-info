(library (ytilitu http formatter)
  (export
    formatter-routes)
  (import
    (sph)
    (sph hashtable)
    (sph list)
    (sph alist)
    (sph other)
    (sph process)
    (sph string)
    (sph web app)
    (ytilitu file-processor)
    (only (guile) rename-file))

  (define dependencies
    (file-processor-dependencies
      (list-q ("uglifyjs" "javascript") ("csstidy" "css")
        ("scm-format" "sxml" "scheme") ("perltidy" "perl")
        ("json-to-file" "json") ("php-cs-fixer" "php")
        ("xmllint" "xml" "html") ("astyle-to-file" "c" "cpp" "csharp" "java" "objective-c")
        ("sqlformat" "sql") ("gofmt" "go"))))

  (define name->proc
    (file-processor-name->processor-proc
      (l (paths-program)
        (ht-create "javascript"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "uglifyjs") "--beautify"
              (cli-option "output" path-output) path-input))
          "perl"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "perltidy") "-l=120"
              "-ole=unix" "-nolc"
              "-pt=2" "-sbt=2" "-i=2" "-nbbc" path-input (string-append "-o=" path-output)))
          "css"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "csstidy") path-input
              (cli-option "template"
                (string-append (swa-env-root (alist-ref-q options swa-env))
                  "other/csstidy-template"))
              (cli-option "silent" "true") path-output))
          "xml"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "xmllint") "--output"
              path-output path-input))
          "html"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "xmllint") "--html"
              "--output" path-output path-input))
          "scheme"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "scm-format")
              (cli-option "output" path-output) path-input))
          "json"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "json-to-file") path-output path-input))
          "go"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "gofmt") "-w" path-input)
            (rename-file path-input path-output))
          "sql"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "sqlformat")
              (cli-option "outfile" path-output) (cli-option "keywords" "lower")
              (cli-option "reindent") path-input))
          "c"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "astyle-to-file")
              (cli-option "astyle-options" (cli-option "mode" "c")) path-input path-output))
          "php"
          (l (path-input path-output options)
            (and (execute-and-check-result (ht-ref paths-program "php-cs-fixer") "fix" path-input)
              (rename-file path-input path-output)))
          "csharp"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "astyle-to-file")
              (cli-option "astyle-options" (cli-option "mode" "cs")) path-input path-output))
          "java"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "astyle-to-file")
              (cli-option "astyle-options" (cli-option "mode" "java")) path-input path-output))
          "cpp" "c" "objective-c" "c" "sxml" "scheme"))
      dependencies))

  (define (title-map a) (string-append "online " a " code formatter"))

  (define name->extension
    (let
      (table
        (ht-create "go" #t
          "sql" #t
          "cpp" #t
          "xml" #t
          "php" #t
          "css" #t
          "c" #t
          "java" #t
          "html" #t
          "json" #t
          "perl" "pl" "sxml" #t "csharp" "cs" "scheme" "scm" "javascript" "js" "objective-c" "m"))
      (l (a) (let (value (ht-ref table a)) (if (and (boolean? value) value) a value)))))

  (define (name->options a)
    (let
      (default
        (list #:title-map title-map
          #:respond-form-options
          (list #:file-name-map
            (l (file-name options input-field)
              (if (equal? (q text) input-field)
                (let (extension (name->extension a))
                  (if extension (string-append file-name "." extension) file-name))
                file-name)))
          #:shtml-section-options
          (list #:description
            (append
              (list (string-append "format/beautify/prettyprint code. " file-processor-description))
              (if (string-equal? "php" a)
                (list (qq ((br) "for psr-1 and psr-2 coding standards."))) (list)))
            #:form-options (list #:input-text? #t))))
      default))

  (define formatter-routes
    (file-processor-create-routes "/formatter" "formatted"
      name->proc dependencies #:name->options name->options)))
