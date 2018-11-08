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
    (sph web app http))

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
            title #:css
            (list "/css/sph.css") #:top
            (qq (nav (@ (class one)) (a (@ (href (unquote "/"))) "sph.mn"))))))))

  (define respond-german-names
    (phrase-generator-responder "funny german names" "german-names" (nullary (make-german-names 5))))

  (define respond-marketing-bs
    (phrase-generator-responder "buzzword compliant headlines" "bs" (nullary (make-marketing-bs 5))))

  (define (app-respond request)
    (let (path (swa-http-request-path request))
      (string-case (string-drop-prefix "/dynamic" path) ("/svn" (svn-respond request))
        ("/bs" (respond-marketing-bs)) ("/german-names" (respond-german-names))
        ("/utc-day-kiloseconds" (respond (utc-elapsed-day-string (utc-current))))
        (else (respond 404)))))

  (define swa-app (swa-app-new app-respond)))
