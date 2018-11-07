(library (ytilitu)
  (export
    swa-app)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph filesystem)
    (sph hashtable)
    (sph list)
    (sph list other)
    (sph record)
    (sph string)
    (sph time)
    (sph vector)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web shtml)
    (ytilitu file-processor)
    (ytilitu helper)
    (ytilitu http calculator color)
    (ytilitu http converter)
    (ytilitu http encoder)
    (ytilitu http formatter)
    (ytilitu http minifier)
    (ytilitu http other)
    (ytilitu http table)
    (ytilitu http text)
    (ytilitu http time calculator)
    (ytilitu http time calendar)
    (only (srfi srfi-1) drop))

  (define-as client-static-config client-static-config-create
    (default js ("lib/foreign/module") css ("sph" "ytilitu"))
    (time-calculator js
      ( (unquote (alist-q utc-leap-second-table ses-utc-leap-second-table)) "lib/foreign/underscore"
        "lib/foreign/moment" "time/calculator")
      css ("time/calculator"))
    (converter-units js (#f "lib/foreign/jquery" "lib/foreign/select2" "converter/units")
      css (#f "foreign/select2" "converter/units"))
    (table-ascii css ("table")) (time-calendar css ("time/calendar") js ("time/calendar"))
    (calculator-color css (#f "calculator/color")
      js (#f "lib/foreign/underscore" "lib/foreign/tinycolor" "calculator/color"))
    (text-operations css (#f "text/operations") js (#f "text/operations"))
    (file-processor css (#f "file-processor") js (#f "lib/file-processor"))
    (other-dice css (#f "other/dice") js (#f "other/dice"))
    (other-yes-or-no css (#f "other/yes-or-no"))
    (other-rhymes css (#f "other/rhymes") js (#f "other/rhymes")))

  (define (app-init swa-env)
    (ensure-directory-structure (file-processor-path-processed (swa-env-root swa-env)))
    (client-static-compile swa-env client-static-config)
    ;(ht-alist (ht-ref (swa-env-data swa-env) (q client-static)) (inf))
    )

  (define (overview-shtml title)
    (let
      (paths-grouped
        (group
          (fold
            (l (a result)
              (let (path (string-drop-prefix web-basename (route-path a)))
                (if (string-equal? "/" path) result
                  (pair (pair (drop (path->list path) 1) a) result))))
            (list)
            (list-sort-with-accessor string>? route-title (filter (l (a) (route-title a)) routes)))
          (compose first first)))
      (list (qq (h1 (unquote title)))
        (map
          (l (a)
            (shtml-section 0 (first a)
              (pair (q ul)
                (map
                  (l (a)
                    (let*
                      ((path (string-join (pair "" (first a)) "/")) (title (route-title (tail a))))
                      (qq
                        (li
                          (a (@ (href (unquote (string-append web-basename path)))) (unquote title))))))
                  (tail a)))))
          paths-grouped)
        (qq
          (div (@ (id footer) (class "small-font"))
            (div (@ (class left)) (a (@ (href "mailto:sph@posteo.eu")) "contact")))))))

  (define (overview request)
    (respond-shtml
      (shtml-layout (overview-shtml "ytilitu.xyz") #:title
        "ytilitu.xyz" #:body-class
        "start" #:css
        (or (client-static (swa-http-request-swa-env request) (q css) (q (default))) null))))

  (define routes
    (append
      ;minifier-routes formatter-routes text-routes
      encoder-routes other-routes
      converter-routes
      (list (route-new "/calculator/color" "web color calculator" calculator-color-respond)
        (route-new "/time/calendar" "gregorian calendar" time-calendar-respond)
        (route-new "/time/calculator" "time calculator" time-calculator-respond)
        (route-new "/table/ascii" "ascii table" table-ascii-respond) (route-new "/" "start" overview))))

  (define paths (map vector-first routes))

  (define (app-respond request)
    (let*
      ( (path (ensure-trailing-slash (swa-http-request-path request)))
        (route (any (l (a) (and (string-prefix? (route-path a) path) a)) routes)))
      (if route
        (begin
          (swa-http-request-data-set! request
            (ht-create-symbol-q route route time-start (utc-current) routes routes))
          ((route-handler route) request))
        (respond 404))))

  (define swa-app (swa-app-new app-respond #:init app-init)))
