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
    (sph-info processor)
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
    (only (srfi srfi-1) drop-right))

  (define path-pandoc (search-env-path-one "pandoc"))

  (define-as type->file-name-extension-table ht-create-string
    "asciidoc" "txt" "commonmark" "md" "markdown" "md" "markdown_github" "md" "dbk" "docbook" "dbk")

  (define-as input-types list
    "asciidoc" "beamer"
    "commonmark" "context"
    "docbook" "docx"
    "dokuwiki" "dzslides"
    "epub" "haddock"
    "html" "icml"
    "latex" "man"
    "markdown" "markdown_github"
    "mediawiki" "odt"
    "opendocument" "opml"
    "org" "revealjs" "rst" "rtf" "s5" "slideous" "slidy" "tei" "texinfo" "textile")

  (define-as output-types list
    "commonmark" "docbook"
    "docx" "epub"
    ;"pdf"
    "haddock"
    "html" "latex"
    "markdown" "markdown_github"
    "mediawiki" "native" "odt" "opml" "org" "rst" "t2t" "textile" "twiki")

  (define-as text-types list
    "commonmark" "textile"
    "twiki" "html"
    "org" "latex" "texinfo" "markdown" "asciidoc" "markdown_github" "dokuwiki" "mediawiki")

  (define (type->extension a) (ht-ref type->file-name-extension-table a a))

  (define file-name-extensions
    (map (l (a) (string-append "." a))
      (delete-duplicates
        (append output-types input-types (vector->list (ht-values type->file-name-extension-table))))))

  (define (display-dependency-errors)
    (if (not path-pandoc)
      (log-message (log-message (q error) (string-append "missing dependency pandoc")))))

  (define (drop-file-name-extension a)
    (or (any (l (b) (and (string-suffix? b a) (string-drop-suffix b a))) file-name-extensions) a))

  (display-dependency-errors)

  (define documents-routes
    (apply processor-routes "document format conversions"
      "/documents"
      (if path-pandoc
        (compact
          (produce
            (l (a b)
              (if (equal? a b) #f
                (list a b
                  (append (q (file-to-file))
                    (if (contains? text-types a)
                      (list (if (contains? text-types b) (q text-to-text) (q text-to-file))) null))
                  null
                  (l (request source-path target-path options)
                    (execute-and-check-result path-pandoc (cli-option "from" a)
                      (cli-option "to" b) (cli-option "output" target-path) source-path))
                  (l (request file-name options)
                    (string-append (drop-file-name-extension file-name) "." (type->extension b)))
                  (l (request input-text client)
                    (list-bind (processor-temp-paths (swa-http-request-swa-env request))
                      (source-path target-path target-file-name)
                      (string->file input-text source-path)
                      (execute-and-check-result path-pandoc (cli-option "from" a)
                        (cli-option "to" b) (cli-option "output" target-path) source-path)
                      (display (file->string target-path) client))))))
            input-types output-types))
        null))))
