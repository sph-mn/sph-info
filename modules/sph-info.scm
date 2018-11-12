(library (sph-info)
  (export
    swa-app)
  (import
    (guile)
    (rnrs eval)
    (sph)
    (sph-info color)
    (sph-info documents)
    (sph-info encoder)
    (sph-info helper)
    (sph-info other)
    (sph-info svn)
    (sph-info table)
    (sph-info time calculator)
    (sph-info time calendar)
    (sph-info units)
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
    (default js ("foreign/module") css ("sph"))
    (time-calculator js
      ( (unquote (alist-q utc-leap-second-table ses-utc-leap-second-table)) "foreign/underscore"
        "foreign/moment" "time/calculator")
      css ("time/calculator"))
    (units js ("foreign/underscore" "foreign/jquery" "foreign/select2" "units")
      css ("foreign/select2" "units"))
    (table-ascii css ("table")) (time-calendar css ("time/calendar") js ("time/calendar"))
    (color css ("color") js ("foreign/underscore" "foreign/tinycolor" "color"))
    (text css ("text") js ("text"))
    (processor css ("processor") js ("foreign/underscore" "processor"))
    (dice css ("dice") js ("foreign/underscore" "dice")) (yes-or-no css ("yes-or-no"))
    (rhymes css ("rhymes") js ("rhymes")))

  (define (app-init swa-env)
    ;(ht-alist (ht-ref (swa-env-data swa-env) (q client-static)) (inf))
    ;(ensure-directory-structure (file-processor-path-processed swa-env))
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
        ;minifier-routes
        ;formatter-routes text-routes
        documents-routes units-routes
        encoder-routes
        ;converter-routes
        ; other-routes
        ;table-routes time-calculator-routes time-calendar-routes color-routes
        )))

  (define paths (map vector-first routes))

  (define (app-respond request)
    (let*
      ( (full-path (swa-http-request-path request))
        (web-base-path (ht-ref-q (swa-env-config (swa-http-request-swa-env request)) web-base-path))
        (path (string-append "/" (string-drop-prefix web-base-path full-path))))
      (string-case path ("/svn" (svn-respond request))
        ("/bs" (respond-marketing-bs)) ("/german-names" (respond-german-names))
        ("/utc-day-kiloseconds" (respond (utc-elapsed-day-string (utc-current))))
        (else
          (or
            (and-let* ((route (any (l (a) (and (string-prefix? (route-path a) path) a)) routes)))
              (swa-http-request-data-set! request
                (ht-create-symbol-q web-base-path web-base-path
                  route route full-path full-path path path time-start (utc-current) routes routes))
              ((route-handler route) request))
            (respond 404))))))

  (define swa-app (swa-app-new app-respond #:init app-init)))
