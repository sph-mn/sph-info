(library (ytilitu http minifier)
  (export
    minifier-routes)
  (import
    (sph)
    (sph hashtable)
    (sph list)
    (sph other)
    (sph process)
    (ytilitu file-processor))

  (define dependencies
    (file-processor-dependencies
      (list-q ("uglifyjs" "javascript") ("csstidy" "css") ("minify" "html" "json"))))

  (define name->proc
    (file-processor-name->processor-proc
      (l (paths-program)
        (ht-create "javascript"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "uglifyjs") "--mangle"
              "--screw-ie8" (cli-option "output" path-output) path-input))
          "css"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "csstidy") path-input
              (cli-option "template" "highest") (cli-option "silent" "true") path-output))
          "html"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "minify") (cli-option "type" "html")
              (cli-option "output" path-output) path-input))
          "json"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "minify") (cli-option "type" "json")
              (cli-option "output" path-output) path-input))))
      dependencies))

  (define (title-map a) (string-append "online " a " code minifier"))

  (define name->extension
    (let (table (ht-create "css" #t "html" #t "json" #t "javascript" "js"))
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
          (list #:form-options (list #:input-text? #t)
            #:description (string-append "minify/optimise code. " file-processor-description))))
      default))

  (define minifier-routes
    (file-processor-create-routes "/minifier" "minified"
      name->proc dependencies #:name->options name->options)))
