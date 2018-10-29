(library (sph-info)
  (export
    swa-app)
  (import
    (guile)
    (rnrs eval)
    (sph)
    (sph-info helper)
    (sph-info svn)
    (sph alist)
    (sph fun german-names)
    (sph fun marketing-bs)
    (sph string)
    (sph time)
    (sph time string)
    (sph web app)
    (sph web app client)
    (sph web app http))

  (define (phrase-generator-responder title url-path generate)
    (let*
      ( (title title)
        (shtml-ui
          (l (ref content)
            (let*
              ( (results (generate)) (li (map (l (a) (list (q li) a)) results))
                (results-shtml (pairs (q ul) (q (@ (class "results"))) li)))
              (qq
                (section (h1 (unquote title)) (unquote results-shtml)
                  (form (@ (action (unquote url-path)) (method get))
                    (input (@ (type submit) (value "more"))))))))))
      (l (request)
        (let (env (swa-http-request-swa-env request))
          (respond-html request
            (alist-q body-class "phrase-generator"
              title title
              css (list "/css/sph.css")
              top (qq (nav (@ (class one)) (a (@ (href (unquote "/"))) "sph.mn"))))
            (q sph-info) (list (list shtml-layout shtml-ui)))))))

  (define respond-german-names
    (phrase-generator-responder "funny german names" "german-names" (nullary (make-german-names 5))))

  (define respond-marketing-bs
    (phrase-generator-responder "buzzword compliant headlines" "bs" (nullary (make-marketing-bs 5))))

  (define (app-respond request)
    (let (path (swa-http-request-path request))
      (string-case (string-drop-prefix "/dynamic" path) ("/svn" (svn-respond request))
        ("/bs" (respond-marketing-bs request)) ("/german-names" (respond-german-names request))
        ("/utc-day-kiloseconds" (respond (utc-elapsed-day-string (utc-current))))
        (else (respond 404)))))

  (define swa-app (swa-create (q sph-info) app-respond)))
