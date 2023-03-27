(define-module (sph-info other))

(use-modules (srfi srfi-1) (ice-9 regex)
  (sph) (sph-info helper)
  (sph alist) (sph hashtable)
  (sph json) (sph list)
  (sph log) (sph other)
  (sph process) (sph string) (sph web app) (sph web app client) (sph web app http) (sph web shtml))

(export other-routes)
(define program-dependencies (list "rhyme"))

(define (shtml-ip route ip)
  (shtml-section 0 (route-title route)
    (if ip (qq ("your ip is " (unquote ip))) (qq ("your ip could not be determined")))))

(define (shtml-dice route)
  (shtml-section 0 (route-title route)
    (qq
      ( (label (div "sides") (input (@ (type number) (value 6) (step 1) (id sides)))
          (button (@ (id roll)) "roll"))
        (br) (br) (div (@ (id result)))))))

(define (shtml-yes-or-no route)
  (shtml-section 0 (route-title route)
    (list (q div) (qq (@ (class "yes-or-no-result"))) (if (= 1 (random 2)) "yes" "no"))))

(define (rhymes-suggest path-rhyme word)
  (let (result (string-split (execute->string path-rhyme "--merged" word) #\newline))
    (if (< (length result) 3) (string-trim (first result) (char-set #\* #\space))
      (filter-map (l (a) (let (a (string-trim a)) (if (string-equal? word a) #f a)))
        (apply append
          (filter-map
            (l (a) (if (string-null? a) #f (string-split (regexp-replace a "[0-9]+: " "") #\,)))
            (tail result)))))))

(define (shtml-rhymes route)
  (shtml-section 0 (route-title route)
    (qq
      ( (div (@ (class small-font))
          "online rhyming dictionary. based on the command-line application \"rhyme\".")
        (br) (input (@ (placeholder "word here") (id "word"))) (br) (br) (div (@ (id result)))))))

(define (shtml-fm-partials route)
  (shtml-section 0 (route-title route)
    (qq
      ( (div (@ (class small-font))
          "calculate frequency modulation sideband frequencies and amplitudes. at most 60 sidebands. sidebands with amplitude < 1/1000 are not listed")
        (br)
        (div (label (div "carrier frequency (hz)") (input (@ (type number) (id "cfrq"))))
          (label (div "modulator frequency (hz)") (input (@ (type number) (id "mfrq"))))
          (label (div "modulator amplitude") (input (@ (type number) (step 0.1) (id "mamp"))))
          (label (div "modulation index") (input (@ (type number) (step 0.1) (value 1) (id "mi")))))
        (br) (pre (@ (id result)))))))

(define ip-route
  (route-new "/ip" "what is my ip?"
    (l (request)
      (sph-info-request-bind request (swa-env data route routes)
        (let (ip (alist-ref (swa-http-request-headers request) "remote_addr"))
          (respond-shtml
            (shtml-layout (shtml-ip route ip) #:body-class
              "ip" #:title
              (route-title route) #:css
              (client-static swa-env (q css) (q (default))) #:links default-links)))))))

(define dice-route
  (route-new "/dice" "custom dice"
    (l (request)
      (sph-info-request-bind request (swa-env data route time-start routes)
        (respond-shtml
          (shtml-layout (shtml-dice route) #:body-class
            "dice" #:title
            (route-title route) #:css
            (client-static swa-env (q css) (q (default dice))) #:js
            (client-static swa-env (q js) (q (default dice))) #:links default-links)
          (cache-headers time-start))))))

(define yes-or-no-route
  (route-new "/yes-or-no" "yes or no?"
    (l (request)
      (sph-info-request-bind request (swa-env data time-start route routes)
        (respond-shtml
          (shtml-layout (shtml-yes-or-no route) #:body-class
            "yes-or-no" #:title
            (route-title route) #:css
            (client-static swa-env (q css) (q (default yes-or-no))) #:links default-links)
          (cache-headers time-start))))))

(define (rhymes-suggest-route path-rhyme)
  (route-new "/json/rhymes/suggest" #f
    (l (request)
      (respond-type (q json)
        (scm->json-string
          (let*
            ( (path (ht-ref-q (swa-http-request-data request) path))
              (word
                (string-drop-prefix
                  (string-append (route-path (ht-ref-q (swa-http-request-data request) route)) "/")
                  path)))
            (if (string-match "^[a-zA-Z]{1,30}$" word) (rhymes-suggest path-rhyme word) (list))))))))

(define rhymes-route
  (route-new "/rhymes" "rhyming words"
    (l (request)
      (sph-info-request-bind request (swa-env data routes route time-start)
        (respond-shtml
          (shtml-layout (shtml-rhymes route) #:body-class
            "rhymes" #:title
            (route-title route) #:css
            (client-static swa-env (q css) (q (default rhymes))) #:js
            (client-static swa-env (q js) (q (default rhymes))) #:links default-links)
          (cache-headers time-start))))))

(define fm-partials-route
  (route-new "/fm-partials" "frequency modulation partials"
    (l (request)
      (sph-info-request-bind request (swa-env data routes route time-start)
        (respond-shtml
          (shtml-layout (shtml-fm-partials route) #:body-class
            "fm-partials" #:title
            (route-title route) #:css
            (client-static swa-env (q css) (q (default fm-partials))) #:js
            (client-static swa-env (q js) (q (default fm-partials))) #:links default-links)
          (cache-headers time-start))))))

(define (other-routes)
  (let* ((program-path (program-paths-f program-dependencies)) (path-rhyme (program-path "rhyme")))
    (append (if path-rhyme (list rhymes-route (rhymes-suggest-route path-rhyme)) null)
      (list ip-route dice-route fm-partials-route yes-or-no-route))))
