(library (sph-info documents)
  (export
    documents-routes)
  (import
    (guile)
    (ice-9 regex)
    (rnrs io ports)
    (rnrs sorting)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph hashtable)
    (sph io)
    (sph io read-write)
    (sph json)
    (sph list)
    (sph log)
    (sph other)
    (sph process)
    (sph set)
    (sph string)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web html)
    (sph web shtml)
    (sxml simple)
    (ytilitu file-processor)
    (ytilitu helper)
    (only (srfi srfi-1) drop-right))

  (define dependencies
    (file-processor-dependencies
      (list-q ("pandoc" "documents") ("ses" "sescript-javascript")
        (#t "xml-sxml") (#t "sxml-xml")
        ("xml-json-converter" "xml-json" "json-xml") ("sc" "sc-c")
        ("coffee-compile-from-to" "coffeescript-javascript"))))

  (define name->proc
    (file-processor-name->processor-proc
      (l (paths-program)
        (ht-create "documents"
          (l (path-input path-output options)
            (alist-bind options (input-type output-type)
              (and input-type output-type
                (contains? document-input-types input-type)
                (contains? document-output-types output-type)
                (execute-and-check-result (ht-ref paths-program "pandoc")
                  (cli-option "from" input-type) (cli-option "to" output-type)
                  (cli-option "output" path-output) path-input))))
          "xml-json"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "xml-json-converter") "--to_json"
              path-input path-output))
          "json-xml"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "xml-json-converter") "--to_xml"
              path-input path-output))
          "xml-sxml"
          (l (path-input path-output options)
            (call-with-output-file path-output
              (l (out) (display (call-with-input-file path-input (l (in) (xml->sxml in))) out))))
          "sxml-xml"
          (l (path-input path-output options)
            (call-with-output-file path-output
              (l (out) (sxml->xml (rw-file->list read path-input) out))))
          "endianess" (l (path-input path-output options) #t)
          "sescript-javascript"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "ses") path-input path-output))
          "sc-c"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "sc") path-input path-output))
          "coffeescript-javascript"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "coffee-compile-from-to") path-input
              path-output))))
      dependencies))

  (define (title-map a) (string-append (string-join (string-split a #\-) " to ") " converter"))

  (define-as document-type->file-name-extension-table ht-create-string
    "asciidoc" "txt"
    "html5" "html"
    "commonmark" "md"
    "markdown" "md"
    "markdown_github" "md"
    "markdown_mmd" "mmd"
    "markdown_phpextra" "md"
    "markdown_strict" "md" "docbook5" "dbk" "docbook" "dbk" "epub3" "epub" "plain" "txt")

  (define (document-type->extension a) (ht-ref document-type->file-name-extension-table a a))

  (define-as document-input-types list
    "asciidoc" "beamer"
    "commonmark" "context"
    "docbook" "docbook5"
    "docx" "dokuwiki"
    "dzslides" "epub"
    "epub3" "fb2"
    "haddock" "html"
    "html5" "icml"
    "latex" "man"
    "markdown" "markdown_github"
    "markdown_mmd" "markdown_phpextra"
    "markdown_strict" "mediawiki"
    "native" "odt"
    "opendocument" "opml"
    "org" "plain" "revealjs" "rst" "rtf" "s5" "slideous" "slidy" "tei" "texinfo" "textile")

  (define-as document-output-types list
    "commonmark" "docbook"
    "docx" "epub"
    "haddock" "html"
    "latex" "markdown"
    "markdown_github" "markdown_mmd"
    "markdown_phpextra" "markdown_strict"
    "mediawiki" "native" "odt" "opml" "org" "rst" "t2t" "textile" "twiki")

  (define file-name-extensions
    (map (l (a) (string-append "." a))
      (delete-duplicates
        (append document-output-types document-input-types
          (vector->list (ht-values document-type->file-name-extension-table))))))

  (define (drop-file-name-extension a)
    (or (any (l (b) (and (string-suffix? b a) (string-drop-suffix b a))) file-name-extensions) a))

  (define name->extensions
    (let
      (table
        (ht-create "xml-json" #t
          "json-xml" #t
          "xml-sxml" #t
          "sxml-xml" #t
          "sc-c" #t
          "coffeescript-javascript" (pair "coffee" "js") "sescript-javascript" (pair "sjs" "js")))
      (l (a)
        (let (value (ht-ref table a))
          (if (and (boolean? value) value)
            (let (r (string-split a #\-)) (pair (first r) (first (tail r)))) value)))))

  (define (name->options a)
    (let ((default (list #:title-map title-map)) (form-options (list #:input-text? #t)))
      (append default
        (string-case a
          ("documents"
            (list #:respond-form-options
              (list #:file-name-map
                (l (a options input-field)
                  (string-append (drop-file-name-extension a) "."
                    (document-type->extension (alist-ref-q options output-type)))))
              #:shtml-section-options
              (list #:description
                (string-append "convert between various document file formats. "
                  file-processor-description)
                #:form-options
                (append
                  (list #:input-types document-input-types #:output-types document-output-types)
                  form-options))))
          (else
            (list #:respond-form-options
              (list #:file-name-map
                (l (input-file-name options input-field)
                  (let (extensions (name->extensions a))
                    (if extensions
                      (string-append
                        (string-drop-suffix-if-exists (string-append "." (first extensions))
                          input-file-name)
                        "." (tail extensions))
                      input-file-name))))
              #:shtml-section-options
              (list #:form-options form-options #:description file-processor-description)))))))

  (define converter-routes
    (file-processor-create-routes "/converter" "converted"
      name->proc dependencies #:name->options name->options)))
