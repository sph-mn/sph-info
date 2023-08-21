(define-module (sph-info documents))

(use-modules (ice-9 regex) (rnrs io ports)
  (rnrs sorting) (sph)
  (sph-info helper) (sph-info processor)
  (sph alist) (sph hashtable)
  (sph io) (sph json)
  (sph list) (sph log)
  (sph other) (sph process)
  (sph string) (sph web app)
  (sph web app client) (sph web app http) (sph web html) (sph web shtml) (sxml simple) (srfi srfi-1))

(export documents-routes)
(define program-dependencies (list "pandoc" "pdflatex"))

(define type->file-name-extension-table
  (ht-create-string "asciidoc" "txt" "commonmark" "md" "markdown" "md" "md" "dbk" "docbook" "dbk"))

(define text-types
  (list "commonmark" "textile"
    "twiki" "html" "man" "org" "latex" "texinfo" "markdown" "asciidoc" "dokuwiki" "mediawiki"))

(define (type->extension a) (ht-ref type->file-name-extension-table a a))

(define (documents-routes)
  (let*
    ( (program-path (program-paths-f program-dependencies))
      (input-types
        (list "commonmark" "docx"
          "dokuwiki" "epub"
          "html" "latex" "man" "markdown" "mediawiki" "odt" "s5" "texinfo" "textile"))
      (output-types
        (compact
          (list "commonmark" "docbook"
            "docx" "epub"
            (and (program-path "pdflatex") "pdf") "html"
            "latex" "markdown" "mediawiki" "odt" "textile")))
      (file-name-extensions
        (map (l (a) (string-append "." a))
          (delete-duplicates
            (append output-types input-types
              (vector->list (ht-values type->file-name-extension-table))))))
      (drop-file-name-extension
        (l (a)
          (or
            (any (l (b) (and (string-suffix? b a) (string-drop-suffix b a))) file-name-extensions) a)))
      (path-pandoc (program-path "pandoc")))
    (if (not path-pandoc) null
      (apply processor-routes "document format conversions"
        "/documents"
        (compact
          (produce
            (l (a b)
              (if (equal? a b) #f
                (list a b #f
                  (append (q (file-to-file))
                    (if (contains? text-types a)
                      (list (if (contains? text-types b) (q text-to-text) (q text-to-file))) null))
                  null
                  (if (string= "pdf" b)
                    (l (request source-path target-path options)
                      (let (target-path-pdf (string-append target-path ".pdf"))
                        (and
                          (execute-and-check-result path-pandoc (cli-option "from" a)
                            (cli-option "to" b) (cli-option "output" target-path-pdf)
                            "-t" "latex" source-path)
                          (rename-file target-path-pdf target-path))))
                    (l (request source-path target-path options)
                      (execute-and-check-result path-pandoc (cli-option "from" a)
                        (cli-option "to" b) (cli-option "output" target-path) source-path)))
                  (l (request file-name options)
                    (string-append (drop-file-name-extension file-name) "." (type->extension b)))
                  (if (string= "pdf" b)
                    (l (request input-text client)
                      (let*-list
                        ( ( (source-path target-path target-file-name)
                            (processor-temp-paths (swa-http-request-swa-env request)))
                          (target-path-pdf (string-append target-path ".pdf")))
                        (string->file input-text source-path)
                        (and
                          (execute-and-check-result path-pandoc "-t"
                            "latex" (cli-option "from" a)
                            (cli-option "to" b) (cli-option "output" target-path-pdf)
                            "-t" "latex" source-path)
                          (begin (rename-file target-path-pdf target-path)
                            (display (file->string target-path) client) #t))))
                    (l (request input-text client)
                      (list-bind (processor-temp-paths (swa-http-request-swa-env request))
                        (source-path target-path target-file-name)
                        (string->file input-text source-path)
                        (execute-and-check-result path-pandoc (cli-option "from" a)
                          (cli-option "to" b) (cli-option "output" target-path) source-path)
                        (display (file->string target-path) client)))))))
            input-types output-types))))))
