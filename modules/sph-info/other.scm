(library (sph-info other)
  (export
    other-routes)
  (import
    (guile)
    (ice-9 regex)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph hashtable)
    (sph json)
    (sph list)
    (sph log)
    (sph other)
    (sph process)
    (sph random-data)
    (sph string)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web shtml))

  (define (shtml-ip route ip)
    (shtml-section 0 (route-title route)
      (if ip (qq ("your ip is: " (unquote ip))) (qq ("your ip could not be determined")))))

  (define (shtml-dice route)
    (shtml-section 0 (route-title route)
      (qq
        ( (label (div "sides") (input (@ (type number) (value 6) (step 1) (id sides)))
            (button (@ (id roll)) "roll"))
          (br) (br) (div (@ (id result)))))))

  (define (shtml-yes-or-no route)
    (shtml-section 0 (route-title route)
      (list (q div) (qq (@ (class "yes-or-no-result"))) (if (= 1 (random 2)) "yes" "no"))))

  (define (other-rhymes-suggest word)
    (let
      (result
        (string-split (execute->string (ht-ref paths-program "rhyme") "--merged" word) #\newline))
      (if (< (length result) 3)
        ; probably an error message
        (string-trim (first result) (char-set #\* #\space))
        (filter-map
          ; filter the input word repeated in the result
          (l (a) (let (a (string-trim a)) (if (string-equal? word a) #f a)))
          (apply append
            (filter-map
              ; filter null and get individual words
              (l (a) (if (string-null? a) #f (string-split (regexp-replace a "[0-9]+: " "") #\,)))
              (tail result)))))))

  (define (shtml-rhymes route)
    (shtml-section 0 (route-title route)
      (qq
        ( (div (@ (class small-font)) "an online rhyming dictionary.") (br)
          (input (@ (placeholder "word here") (id "word"))) (button (@ (id get)) "get rhyming words")
          (br) (br) (div (@ (id result)))))))

  (define other-ip-route
    (route-new "/other/ip" "what is my ip?"
      (l (request)
        (sph-info-request-bind request (swa-env data route routes)
          (let (ip (alist-ref (swa-http-request-headers request) "remote_addr"))
            (respond-shtml
              (shtml-layout (shtml-ip route ip) #:body-class
                "ip" #:title
                (route-title route) #:css
                (client-static swa-env (q css) (list-q default)) #:links
                (top-bar-links routes "/other" "ip" (swa-env-web-base-path swa-env)))))))))

  (define other-dice-route
    (route-new "/other/dice" "custom dice"
      (l (request)
        (sph-info-request-bind request (swa-env data route time-start routes)
          (respond-shtml
            (shtml-layout (shtml-dice route) #:body-class
              "dice" #:title
              (route-title route) #:css
              (client-static swa-env (q css) (list-q default other-dice)) #:js
              (client-static swa-env (q js) (list-q default other-dice)) #:links
              (top-bar-links routes "/other" "dice" (swa-env-web-base-path swa-env)))
            (cache-headers time-start))))))

  (define other-yes-or-no-route
    (route-new "/other/yes-or-no" "yes or no?"
      (l (request)
        (sph-info-request-bind request (swa-env data time-start route routes)
          (respond-shtml
            (shtml-layout (shtml-yes-or-no route) #:body-class
              "yes-or-no" #:title
              (route-title route) #:css
              (client-static swa-env (q css) (list-q default other-yes-or-no)) #:links
              (top-bar-links routes "/other" "yes-or-no" (swa-env-web-base-path swa-env)))
            (cache-headers time-start))))))

  (define paths-program
    (let (r (ht-create))
      (each
        (l (a)
          (let (path (search-env-path-one a))
            (if path (ht-set! r a path)
              (log-message (q error) (string-append "missing dependency " a)))))
        (list "rhyme"))
      r))

  (define other-rhymes-suggest-route
    (route-new "/json/other/rhymes/suggest" #f
      (l (request)
        (respond-type (q json)
          (scm->json-string
            (let
              (word
                (string-drop-prefix
                  (string-append (route-path (ht-ref-q (swa-http-request-data request) route)) "/")
                  (swa-http-request-path request)))
              (if (string-match "^[a-zA-Z]{1,30}$" word) (other-rhymes-suggest word) (list))))))))

  (define other-rhymes-route
    (route-new "/other/rhymes" "rhyming words"
      (l (request)
        (sph-info-request-bind request (swa-env data routes route time-start)
          (respond-shtml
            (shtml-layout (shtml-rhymes route) #:body-class
              "rhymes" #:title
              (route-title route) #:css
              (client-static swa-env (q css) (list-q default other-rhymes)) #:js
              (client-static swa-env (q js) (list-q default other-rhymes)) #:links
              (top-bar-links routes "/other" "rhymes" (swa-env-web-base-path swa-env)))
            (cache-headers time-start))))))

  (define other-routes
    (apply append
      (filter-map
        (l (a) "include only routes whose helper programs are available"
          (if (list? a) (and (every (l (b) (ht-ref paths-program b)) (tail a)) (first a)) (list a)))
        (list other-ip-route (list (list other-rhymes-route other-rhymes-suggest-route) "rhyme")
          other-dice-route other-yes-or-no-route)))))
