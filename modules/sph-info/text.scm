(library (sph-info text)
  (export
    text-routes)
  (import
    (rnrs sorting)
    (sph)
    (sph alist)
    (sph hashtable)
    (sph list)
    (sph pattern)
    (sph string)
    (sph vector)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web shtml)
    (ytilitu helper))

  (define operations
    (map (l (a) (pair (string-replace-char a #\- #\space) (string-replace-char a #\- #\_)))
      (list-sort string<?
        (append
          (list "lowercase" "camelcase-to-dashes"
            "remove-hash-commment-lines" "compress-whitespace-horizontal"
            "compress-whitespace-vertical" "randomise-lines")
          (filter-map
            (l (a)
              (let ((a-first (vector-first a)) (a-second (vector-second a)))
                (if (string-equal? a-first a-second) #f (string-append a-first "-to-" a-second))))
            (permutations (vector "commas" "newlines" "spaces") 2))))))

  (define (shtml-operations route)
    (shtml-section 0 (route-title route)
      (qq
        ( (p (@ (class "small-font"))
            "enter text in the text area, select a text processing operation and press apply to transform the text. with some options further description appears when it has been selected.")
          (br) (select (@ (id operations)) (unquote-splicing (shtml-alist->options operations)))
          (button (@ (id apply)) "apply") " "
          (button (@ (id undo)) "undo") (br)
          (div (@ (id description) (class "small-font") (style "display:none")) "") (br)
          (textarea (@ (id text)) "")))))

  (define text-operations-route
    (route-new "/text/operations" "text operations"
      (l (request)
        (ytilitu-request-bind request (swa-env data route routes time-start)
          (respond-html request
            (alist-q body-class "operations"
              title (route-title route)
              css (client-static swa-env (q ytilitu) (q css) (list-q default text-operations))
              js (client-static swa-env (q ytilitu) (q js) (list-q default text-operations))
              nav-one (shtml-nav-one-section routes "/text" "operations"))
            (q ytilitu) (list (list shtml-layout (shtml-operations route)))
            (cache-headers time-start))))))

  (define text-routes (list text-operations-route)))
