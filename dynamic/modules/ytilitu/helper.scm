(library (ytilitu helper)
  (export
    cache-headers
    path-processed
    process-unique-number
    route->body-class
    route-handler
    route-new
    route-path
    route-title
    shtml-text-file-form
    top-bar-links
    web-basename
    ytilitu-request-bind)
  (import
    (guile)
    (sph)
    (sph alist)
    (sph filesystem)
    (sph hashtable)
    (sph io)
    (sph list)
    (sph string)
    (sph time)
    (sph time string)
    (sph vector)
    (sph web app http)
    (sph web http)
    (sph web shtml)
    (sxml simple)
    (only (guile) string-join symbol-append)
    (only (rnrs base) set!))

  (define web-basename "/dynamic/ytilitu")

  (define (top-bar-links routes show-prefix hide-suffix)
    (fold
      (l (route result)
        (let*
          ( (path (route-path route)) (relative-path (string-drop-prefix web-basename path))
            (title (route-title route)))
          (if
            (or (string-equal? "/" relative-path)
              (and (string-prefix? show-prefix relative-path)
                (not (string-suffix? hide-suffix relative-path))))
            (pair (list path title) result) result)))
      null routes))

  (define-syntax-rule (ytilitu-request-bind request (swa-env data data-keys ...) body ...)
    ; get and bind default commonly needed values from swa-env and optionally get more values
    ; from swa-env.data with data-keys
    (let ((swa-env (swa-http-request-swa-env request)) (data (swa-http-request-data request)))
      (ht-bind data (data-keys ...) body ...)))

  (define process-unique-number (let (a 0) (nullary (set! a (+ 1 a)) a)))

  (define (route-new path title handler)
    (vector (q route) (string-append web-basename path) title handler))

  (define route-path (vector-accessor 1))
  (define route-title (vector-accessor 2))
  (define route-handler (vector-accessor 3))

  (define (cache-headers last-mtime)
    (list (http-header-line "last-modified" (http-utc->date last-mtime))
      (http-header-line "cache-control" "max-age=86400")))

  (define (route->body-class a) (string-join (tail (path->list (route-path a))) "-"))

  (define*
    (shtml-text-file-form path #:key input-text? output-text? input-types output-types input output
      (new-tab? #t)
      accepted-file-types)
    (let
      ( (create-type-select
          (l (options name)
            (if options
              (pairs (q select) (qq (@ (name (unquote name)))) (shtml-alist->options options)) "")))
        (attributes
          (append
            (qq
              ( (action (unquote path)) (method post) (accept-charset utf-8)
                (enctype "multipart/form-data")))
            (if new-tab? (list-q (target "_blank")) (list))
            (if (list? accepted-file-types)
              (list (list (q accept) (string-join accepted-file-types ","))) (list)))))
      (qq
        (form (@ (unquote-splicing attributes))
          (unquote
            (if (or input-types output-types)
              (list
                (list (q label) (q (@ (class "type")))
                  "from " (create-type-select input-types "input-type")
                  " to " (create-type-select output-types "output-type"))
                (q (br)))
              ""))
          (label (@ (class file)) (div "select file")
            (input (@ (class input-file) (name file) (type file)))
            (button (@ (class input-file-clear) (type button)) "clear file input"))
          (br) (button (@ (type submit)) "run")
          (unquote
            (if input-text?
              (qq
                (label (@ (class text)) (div "or enter text")
                  (textarea (@ (class input-text) (name text)) (unquote (or input "")))))
              ""))
          (unquote
            (if output-text?
              (qq
                (div (@ (class text))
                  (qq (textarea (@ (class output-text)) (unquote (or output ""))))))
              "")))))))
