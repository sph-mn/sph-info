(library (sph-info units)
  (export
    units-routes)
  (import
    (guile)
    (ice-9 regex)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph hashtable)
    (sph io)
    (sph io read-write)
    (sph json)
    (sph list)
    (sph log)
    (sph other)
    (sph process)
    (sph string)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web html)
    (sph web shtml)
    (only (srfi srfi-1) drop-right))

  (define-as unit-prefixes list
    "yotta" "zetta"
    "exa" "peta"
    "tera" "giga"
    "mega" "myria"
    "kilo" "hecto"
    "deca" "deka"
    "deci" "centi"
    "milli" "micro"
    "nano" "pico"
    "femto" "atto"
    "zepto" "yocto"
    "quarter" "semi"
    "demi" "hemi" "half" "double" "triple" "treble" "kibi" "mebi" "gibi" "tebi" "pebi" "exbi")

  (define-as units-exclude list
    "shankh" "padm"
    "neel" "kharab"
    "arab" "crore"
    "lakh" "vigintillion"
    "novemdecillion" "octodecillion"
    "septendecillion" "sexdecillion"
    "quindecillion" "quattuordecillion"
    "tredecillion" "duodecillion"
    "undecillion" "decillion"
    "noventillion" "nonillion"
    "octillion" "septillion"
    "sextillion" "quintillion"
    "quadrillion" "trillion"
    "billion" "longdecilliard"
    "longnoventilliard" "longnonilliard"
    "longoctilliard" "longseptilliard"
    "longsextilliard" "longquintilliard"
    "longquadrilliard" "longtrilliard"
    "longbilliard" "longmilliard"
    "decilliard" "noventilliard"
    "nonilliard" "octilliard"
    "septilliard" "sextilliard"
    "quintilliard" "quadrilliard"
    "trilliard" "billiard"
    "milliard" "longvigintillion"
    "longnovemdecillion" "longoctodecillion"
    "longseptdecillion" "longsexdecillion"
    "longquindecillion" "longquattuordecillion"
    "longtredecillion" "longduodecillion"
    "longundecillion" "longdecillion"
    "longnoventillion" "longnonillion"
    "longoctillion" "longseptillion"
    "longsextillion" "longquintillion"
    "longquadrillion" "longtrillion"
    "longbillion" "googol"
    "centillion" "shortvigintillion"
    "shortnovemdecillion" "shortoctodecillion"
    "shortseptendecillion" "shortsexdecillion"
    "shortquindecillion" "shortquattuordecillion"
    "shorttredecillion" "shortduodecillion"
    "shortundecillion" "shortdecillion"
    "shortnoventillion" "shortnonillion"
    "shortoctillion" "shortseptillion"
    "shortsextillion" "shortquintillion"
    "shortquadrillion" "shorttrillion"
    "shortbillion" "million"
    "thousand" "hundred"
    "ninety" "eighty"
    "seventy" "sixty"
    "fifty" "forty"
    "thirty" "twenty"
    "nineteen" "eighteen"
    "seventeen" "sixteen"
    "fifteen" "fourteen"
    "thirteen" "twelve"
    "eleven" "ten"
    "nine" "eight"
    "seven" "six"
    "quintuple" "five" "quadruple" "four" "triple" "three" "couple" "double" "two" "one")

  (define (units-exclude-set)
    (let (result (ht-create-string)) (map (l (a) (ht-set! result a #t)) units-exclude) result))

  (define units-path-prefix "/usr/share/units/")
  (define path-units (search-env-path-one "units"))
  (define regexp-alphanumeric (make-regexp "^[a-zA-Z]+$"))
  (define regexp-numeric (make-regexp "^[0-9\\.eE, ]+$"))
  (define (valid-unit-name? a) (regexp-exec regexp-alphanumeric a))
  (define (valid-unit-value? a) (regexp-exec regexp-numeric a))

  (define (units-names-other)
    (let ((regexp-line (make-regexp "^[a-z]+ ")) (exclude (units-exclude-set)))
      (call-with-input-file (string-append units-path-prefix "definitions.units")
        (l (port)
          (port-lines-fold
            (l (line r)
              (let (a (regexp-exec regexp-line line))
                (if a
                  (let (a (string-trim-right (match:substring a)))
                    (if (ht-contains? exclude a) r (pair a r)))
                  r)))
            (list) port)))))

  (define (units-names-currencies)
    (let ((regexp-line (make-regexp "^[a-zA-Z]+ ")))
      (call-with-input-file (string-append units-path-prefix "currency.units")
        (l (port)
          (port-lines-fold
            (l (line r)
              (let (a (regexp-exec regexp-line line))
                (if a (pair (string-trim-right (match:substring a)) r) r)))
            (list) port)))))

  (define units-names-all (delete-duplicates (append (units-names-other) (units-names-currencies))))

  (define (display-dependency-errors)
    (if (not path-units)
      (log-message (log-message (q error) (string-append "missing dependency units")))))

  (define (units-suggest a)
    (let*
      ( (prefix (any (l (b) (and (string-prefix? b a) b)) unit-prefixes))
        (a-without-prefix (if prefix (string-drop-prefix prefix a) a))
        (found-names
          (list-sort-with-accessor < string-length
            (filter (l (b) (string-prefix? a-without-prefix b)) units-names-all))))
      (if prefix (map (l (a) (string-append prefix a)) found-names) found-names)))

  (define (units-convert value from to) "-> converted factor"
    (drop-right
      (string-split
        (execute->string path-units "--compact"
          (string-append
            (if (and (string? value) (string-null? value)) from
              (string-append (number->string value) " " from)))
          to)
        #\newline)
      1))

  (define (units-get-arguments request c)
    "request procedure:{from to from-value to-value -> any} -> any"
    ; todo: strip path, get arguments
    (let (a (swa-http-request-path request))
      (let
        ( (from (alist-ref a "from")) (to (alist-ref a "to"))
          (from-value (alist-ref a "from-value")) (to-value (alist-ref a "to-value")))
        (c (and from (valid-unit-name? from) from) (and to (valid-unit-name? to) to)
          (and from-value (valid-unit-value? from-value) from-value)
          (and to-value (valid-unit-value? to-value) to-value)))))

  (define (units-convert-respond request)
    (let*
      ( (data (swa-http-request-data request)) (path (ht-ref-q data path))
        (route (ht-ref-q data route)))
      (respond-type (q json)
        (scm->json-string
          (or
            (apply
              (l* (from to #:optional (value ""))
                (let (value (if (string-null? value) value (string->number value)))
                  (if (and value (string-match "[a-z]+" from) (string-match "[a-z]+" to))
                    (units-convert value from to) (list))))
              (string-split
                (html-uri-decode (string-drop-prefix (string-append (route-path route) "/") path))
                #\/))
            null)))))

  (define (units-suggest-respond request)
    (let (name (last (string-split (ht-ref-q (swa-http-request-data request) path) #\/)))
      (respond-type (q json)
        (scm->json-string (if (valid-unit-name? name) (units-suggest name) null)))))

  (define (units-respond request) (display-dependency-errors)
    (sph-info-request-bind request (swa-env data route time-start routes)
      (units-get-arguments request
        (l (from to from-value to-value)
          (let (title "converter between units")
            (respond-shtml
              (shtml-layout
                (list (qq (h1 (unquote title)))
                  (qq
                    (div (@ (class "sph-info-units"))
                      (p (@ (class "small-font"))
                        "supports more than 1500 units including currencies." (br)
                        "enter a value in any of the value fields, press enter, and the other value updates automatically.")
                      (label (@ (class units)) "from "
                        (select (@ (id unit-to) (data-selected (unquote (or to "")))) (option ""))
                        " to "
                        (select (@ (id unit-from) (data-selected (unquote (or from ""))))
                          (option "")))
                      (label (@ (class values))
                        (input (@ (id value-from) (value (unquote (or from-value "")))))
                        (span (@ (class unit-from)) (unquote (or from "")))
                        (input (@ (id value-to) (value (unquote (or to-value "")))))
                        (span (@ (class unit-to)) (unquote (or to "")))))))
                #:title title
                #:css (client-static swa-env (q css) (list-q default units))
                #:js (client-static swa-env (q js) (list-q default units)) #:links default-links)
              (cache-headers time-start)))))))

  (display-dependency-errors)

  (define units-routes
    (if path-units
      (list (route-new "/units/suggest" #f units-suggest-respond)
        (route-new "/units" "units" units-respond)
        (route-new "/units" #f units-convert-respond))
      null)))
