(library (sph-info)
  (export
    swa-app)
  (import
    (guile)
    (rnrs eval)
    (sph)
    (sph-info file-processor)
    (sph-info helper)
    (sph-info other)
    (sph-info svn)
    (sph-info time calculator)
    (sph alist)
    (sph filesystem)
    (sph fun german-names)
    (sph fun marketing-bs)
    (sph hashtable)
    (sph string)
    (sph time)
    (sph time string)
    (sph vector)
    (sph web app)
    (sph web app client)
    (sph web app http))

  (define css (list "/css/sph.css"))

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
    ;(ht-alist (ht-ref (swa-env-data swa-env) (q client-static)) (inf))
    (ensure-directory-structure (file-processor-path-processed swa-env))
    (client-static-compile swa-env client-static-config))

  (define (phrase-generator-responder title url-path generate)
    (let
      (shtml-ui
        (l (results)
          (let*
            ( (li (map (l (a) (list (q li) a)) results))
              (results-shtml (pairs (q ul) (q (@ (class "results"))) li)))
            (qq
              (section (h1 (unquote title)) (unquote results-shtml)
                (form (@ (action (unquote url-path)) (method get))
                  (input (@ (type submit) (value "more")))))))))
      (nullary
        (respond-shtml
          (shtml-layout (shtml-ui (generate)) #:body-class
            "phrase-generator" #:title
            title #:css css #:top (qq (nav (@ (class one)) (a (@ (href (unquote "/"))) "sph.mn"))))))))

  (define respond-german-names
    (phrase-generator-responder "funny german names" "german-names" (nullary (make-german-names 5))))

  (define respond-marketing-bs
    (phrase-generator-responder "buzzword compliant headlines" "bs" (nullary (make-marketing-bs 5))))

  (define routes
    (debug-log
      (append
        ;minifier-routes formatter-routes text-routes
        ;encoder-routes
        ;converter-routes
        other-routes
        #;(list (route-new "/calculator/color" "web color calculator" calculator-color-respond)
        (route-new "/time/calendar" "gregorian calendar" time-calendar-respond)
        (route-new "/time/calculator" "time calculator" time-calculator-respond)
        (route-new "/table/ascii" "ascii table" table-ascii-respond) (route-new "/" "start" overview)))))

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

  (define (app-respond request)
    (let*
      ( (full-path (swa-http-request-path request))
        (web-base-path (ht-ref-q (swa-env-config (swa-http-request-swa-env request)) web-base-path))
        (path (string-append "/" (string-drop-prefix web-base-path full-path))))
      (debug-log path)
      (string-case path ("/svn" (svn-respond request))
        ("/bs" (respond-marketing-bs)) ("/german-names" (respond-german-names))
        ("/utc-day-kiloseconds" (respond (utc-elapsed-day-string (utc-current))))
        (else
          (and-let* ((route (any (l (a) (and (string-prefix? (route-path a) path) a)) routes)))
            (swa-http-request-data-set! request
              (ht-create-symbol-q route route time-start (utc-current) routes routes))
            ((route-handler route) request))))))

  (define swa-app (swa-app-new app-respond #:init app-init)))
