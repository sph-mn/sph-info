(define-module (sph-info swp))

(use-modules (srfi srfi-2) (ice-9 regex)
  (rnrs sorting) (sph)
  (srfi srfi-1) (sph documentation)
  (sph documentation shtml) (sph filesystem)
  (sph hashtable) (sph lang scheme)
  (sph list) (sph string) (sph time) (sph tree) (sph vector) (sph web publish shtml))

(export sph-info-libdoc-update sph-info-music-listings-update)

(define (music-listings-get-descriptions path)
  (and-let* ((lines (and (file-exists? path) (iq-file-lines path))))
    (map-apply
      (l (pattern description . other)
        (vector (make-regexp (string-append "^" pattern)) description))
      lines)))

(define (music-listings-shtml a)
  (pairs (q div) (q (@ (class music-listings)))
    (tree-map-lists-depth
      (l (a depth)
        (let
          (content
            (pair (q ul)
              (map
                (l (a)
                  (if (symbol? (first a)) a
                    (let (description (tail a))
                      (pairs (q li) (first a)
                        (if (string? description)
                          (qq ((span (@ (class d)) " - " (unquote description)))) null)))))
                (tail a))))
          (shtml-section depth (first a) content)))
      (compact (map (l (a) (if (list? a) a (if (pair? a) (list (first a) a) #f))) a)))))

(define music-listings-content
  (let*
    ( (splice-group? (l (a whitelist) (or (>= 1 (length a)) (not (contains? whitelist (first a))))))
      (prepend-group-name
        (l (name entries)
          (map (l (a) (if (string? a) (if (string-prefix? name a) a (string-append name "." a)) a))
            entries)))
      (splice-group (l (a r) (if (null? a) r (append (prepend-group-name (first a) (tail a)) r))))
      (directory-tree-f
        (l (path-prefix blacklist)
          (l (start)
            (list-sort string<?
              (map (l (a) (string-drop-prefix path-prefix a))
                (directory-tree-leaf-directories (remove-trailing-slash start) #:enter?
                  (l (a stat-info) (not (contains? blacklist (basename a))))))))))
      (prepare-groups
        (l (a whitelist)
          (tree-fold-right-depth
            (l (a result depth)
              ((if (and (list? a) (splice-group? a whitelist)) splice-group pair) a result))
            null a)))
      (add-description
        (l (entry config used-descriptions)
          (or
            (any
              (l (a)
                (let (regexp (vector-first a))
                  (if (and (not (ht-ref used-descriptions regexp)) (regexp-exec regexp entry))
                    (begin (ht-set! used-descriptions regexp #t) (pair entry (vector-second a))) #f)))
              config)
            (pair entry #f))))
      (prepare-file-names
        (l (descriptions a)
          (let (used-descriptions (ht-make-eq))
            (prefix-tree-map
              (l (prefix a)
                (pair prefix
                  (map
                    (l (a) (if (string? a) (add-description a descriptions used-descriptions) a)) a)))
              a)))))
    (l (source target descriptions whitelist blacklist)
      (music-listings-shtml
        (prepare-file-names descriptions
          (prepare-groups (directory-prefix-tree source (directory-tree-f source blacklist))
            whitelist))))))

(define sph-info-music-listings-update
  (let*
    ( (directories (list "1" "2" "3" "4"))
      (whitelist
        (list "1" "2"
          "3" "electronic"
          "guitar" "beat" "calm" "noisy" "jazz" "voice" "other" "piano" "orchestra" "rap hiphop"))
      (blacklist (list "0")) (not-alphanumeric-regexp (make-regexp "[^a-z0-9]")))
    (l (music-path descriptions-path target-path)
      (if (not (and (file-exists? music-path) (file-exists? descriptions-path)))
        (raise (list (q music-listings-path-not-accessible) music-path descriptions-path)))
      (let*
        ( (target-path (ensure-trailing-slash target-path))
          (music-path (ensure-trailing-slash music-path))
          (descriptions (music-listings-get-descriptions descriptions-path))
          (source-and-target
            (map
              (l (a)
                (list (string-append music-path a "/")
                  (string-append target-path (regexp-replace a not-alphanumeric-regexp "_")
                    ".shtml")))
              directories)))
        (if (not (file-exists? target-path)) (ensure-directory-structure target-path))
        (map-apply
          (l (source target)
            (let*
              ( (shtml (music-listings-content source target descriptions whitelist blacklist))
                (shtml
                  (shtml-layout shtml #:css
                    (list "/css/sph.css") #:title
                    (string-append "music listing " (string-trim-right (basename source) #\/)))))
              (call-with-output-file target (l (port) (write shtml port)))))
          source-and-target)))))

(define (sph-info-libdoc-update name directory)
  "create documentation overview and documentation pages"
  (let*
    ( (target-dir (ensure-trailing-slash directory)) (relative-dir "")
      (highlights
        (q
          ( (sph base91) (sph cli) (sph io path-pipe-chain)
            (sph lang parser type-signature) (sph lang plcss)
            (sph lang scm-format) (sph libmagic)
            (sph process create) (sph scgi)
            (sph scrypt) (sph server)
            (sph string) (sph test)
            (sph test performance) (sph thread-pool)
            (sph time) (sph time gregorian) (sph time rfc3339) (sph web atom))))
      (other
        (q
          ( (sph alist) (sph install) (sph base64)
            (sph documentation) (sph documentation shtml)
            (sph exception) (sph filesystem)
            (sph filesystem versioning) (sph futures)
            (sph hashtable) (sph io)
            (sph lang config) (sph lang indent-syntax)
            (sph lang itpn) (sph lang parser outline)
            (sph lang scheme) (sph lang scm-format base)
            (sph lang scm-format format) (sph lang scm-format transform)
            (sph list) (sph list other)
            (sph json) (sph log)
            (sph math) (sph module)
            (sph module binding-info) (sph number)
            (sph other) (sph process)
            (sph server base)
            (sph selection) (sph spline-path)
            (sph sql) (sph stream)
            (sph system reader) (sph test base)
            (sph test report) (sph time stream)
            (sph time string) (sph time utc)
            (sph tree) (sph uniform-vector)
            (sph vector) (sph web html) (sph web http) (sph web shtml))))
      (now (ns->s (utc-current)))
      (shtml-layout*
        (l (content title)
          (shtml-layout content #:title
            title #:links
            (list (list "/" "start") (list "/feed.xml" "feed")) #:css
            (list "/css/sph.css") #:mtime now)))
      (get-description
        (l (module-name)
          (and-let* ((a (module-description module-name))) (first (string-split a #\newline)))))
      (get-listing
        (l* (module-name #:key (depth 0) (skip-description-line #t))
          (let* ((depth 0) (content (pair module-name (doc-shtml-library depth module-name))))
            (apply
              (l (name description index bindings)
                (list
                  (and description (not (and skip-description-line (>= 1 (length description))))
                    (shtml-section depth "library description"
                      (if skip-description-line (tail description) description)
                      (q (class "library-description"))))
                  (shtml-section depth "module name"
                    (list (q p) (any->string name)) (q (class "library-name")))
                  (shtml-section depth "exported bindings"
                    (list bindings) (q (class "library-exports")))))
              content))))
      (file-content
        (l (module-name description listing)
          (let*
            ( (name-string (any->string-write module-name))
              (content
                (qq
                  (section (h1 (unquote name-string))
                    (div (unquote (if description (list (q p) description) ""))
                      (unquote
                        (list (q p) "part of " (shtml-hyperlink "../../sph-lib.html" "sph-lib")))
                      (unquote listing))))))
            (shtml-layout* content (string-append "sph-lib " name-string)))))
      (file-name
        (l (module) (string-append (string-join (map symbol->string module) "-") ".shtml")))
      (highlights-and-description (map (l (a) (pair a (get-description a))) highlights))
      (other-and-description (map (l (a) (pair a (get-description a))) other))
      (index-linklist
        (l (name-and-description)
          (map
            (l (a)
              (string-append "* [" (any->string-write (first a))
                "]("
                (string-append relative-dir
                  (string-append (string-join (map symbol->string (first a)) "-") ".html"))
                ")" (if (tail a) (string-append " " (tail a)) "")))
            name-and-description)))
      (index-file-content
        (string-join
          (flatten
            (list "# highlights" (index-linklist highlights-and-description)
              "\n# other" (index-linklist other-and-description)))
          "\n")))
    (each
      (l (a)
        (let*
          ( (module-name (first a))
            (content (file-content module-name (tail a) (get-listing module-name)))
            (target (string-append target-dir (file-name module-name))))
          (call-with-output-file target (l (port) (write content port)))))
      (append highlights-and-description other-and-description))
    (call-with-output-file (string-append target-dir "index.md")
      (l (port) (display index-file-content port)))))
