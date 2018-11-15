(library (sph-info helper)
  (export
    cache-headers
    default-links
    path-processed
    process-unique-number
    program-paths-f
    respond-shtml
    route->body-class
    route-handler
    route-new
    route-path
    route-title
    shtml-layout
    shtml-text-file-form
    sph-info-request-bind
    swa-env-web-base-path
    top-bar-links)
  (import
    (guile)
    (sph)
    (sph filesystem)
    (sph hashtable)
    (sph io)
    (sph list)
    (sph log)
    (sph other)
    (sph time)
    (sph time string)
    (sph vector)
    (sph web app)
    (sph web app http)
    (sph web http)
    (sph web shtml)
    (sxml simple))

  (define default-links (list (list "/" "start") (list "/other/utilities.html" "utilities")))
  (define (swa-env-web-base-path a) (or (ht-ref-q (swa-env-config a) web-base-path)))

  (define (program-paths-f dependencies) "(string:program-name ...)"
    (let (program-paths (ht-create-string))
      (each
        (l (a)
          (let (path (search-env-path-one a))
            (if path (ht-set! program-paths a path)
              (log-message (q error) (string-append "missing dependency " a)))))
        dependencies)
      (l (name) (ht-ref program-paths name))))

  (define* (respond-shtml shtml #:optional (headers null))
    (respond 200 (pair "content-type:text/html\r\n" headers)
      (l (client) (put-string client "<!doctype html>") (sxml->xml shtml client))))

  (define (shtml-page-mtime mtime) "integer:utc-seconds -> sxml"
    (qq
      (div (@ (class mtime) (title "last modification time of the current page"))
        (unquote (utc->ymd (s->ns mtime))))))

  (define* (shtml-top-bar link-data)
    "((name path) ...) -> shtml
     create a top navigation bar with link to index.html and feed.xml if the files exist"
    (let (links (interleave (map-apply shtml-hyperlink link-data) ", "))
      (if (null? links) null (pair (q nav) links))))

  (define*
    (shtml-layout content #:key (title "") (css null) (js null) head body-class top bottom
      (links default-links)
      mtime)
    (let
      ( (top-bar (and links (shtml-top-bar links)))
        (page-mtime (and mtime (shtml-page-mtime mtime))))
      (qq
        (html
          (head (title (unquote title)) (unquote-splicing (map shtml-include-css css))
            (meta (@ (name "viewport") (content "width=device-width,initial-scale=1")))
            (unquote head))
          (body (unquote (if body-class (qq (@ (class (unquote body-class)))) null))
            (unquote
              (if (or top-bar top)
                (qq (div (@ (class top)) (unquote (or top-bar "")) (unquote (or top "")))) null))
            (unquote
              (if (or mtime content)
                (qq
                  (div (@ (class "middle")) (unquote (or page-mtime "")) (unquote (or content ""))))
                null))
            (unquote (if bottom (qq (div (@ (class bottom)) (unquote bottom))) null))
            (unquote-splicing (map shtml-include-javascript js)))))))

  (define (top-bar-links routes show-prefix hide-suffix web-base-path)
    (fold
      (l (route result)
        (let* ((path (route-path route)) (title (route-title route)))
          (if
            (or (string= "/" path)
              (and (string-prefix? show-prefix path) (not (string-suffix? hide-suffix path))))
            (pair (list (string-append web-base-path path) title) result) result)))
      null routes))

  (define-syntax-rule (sph-info-request-bind request (swa-env data data-keys ...) body ...)
    ; get and bind default commonly needed values from swa-env and optionally get more values
    ; from swa-env.data with data-keys
    (let ((swa-env (swa-http-request-swa-env request)) (data (swa-http-request-data request)))
      (ht-bind data (data-keys ...) body ...)))

  (define process-unique-number (let (a 0) (nullary (set! a (+ 1 a)) a)))
  (define (route-new path title handler) (vector (q route) path title handler))
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
