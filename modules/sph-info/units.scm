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

  (define program-dependencies (list "units"))
  (define units-path-prefix "/usr/share/units/")
  (define regexp-alphanumeric (make-regexp "^[a-zA-Z]+$"))
  (define regexp-numeric (make-regexp "^[0-9\\.eE,]+$"))

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

  (define (units-suggest a)
    (let*
      ( (prefix (any (l (b) (and (string-prefix? b a) b)) unit-prefixes))
        (a-without-prefix (if prefix (string-drop-prefix prefix a) a))
        (found-names
          (list-sort-with-accessor < string-length
            (filter (l (b) (string-prefix? a-without-prefix b)) units-names-all))))
      (if prefix (map (l (a) (string-append prefix a)) found-names) found-names)))

  (define (units-convert path-units from to value) "string ... -> converted factor"
    (drop-right
      (string-split (execute->string path-units "--compact" (string-append value " " from) to)
        #\newline)
      1))

  (define (units-suggest-respond request)
    (let (name (last (string-split (ht-ref-q (swa-http-request-data request) path) #\/)))
      (respond-type (q json)
        (scm->json-string (if (valid-unit-name? name) (units-suggest name) null)))))

  (define (units-get-arguments request c)
    "request procedure:{from to from-value to-value -> any} -> any
     keep values as strings to save on parsing issues and pass to shell command"
    (apply
      (l* (#:optional from to from-value to-value)
        (c (and from (valid-unit-name? from) from) (and to (valid-unit-name? to) to)
          (or (and from-value (valid-unit-value? from-value) from-value)
            (and to-value (valid-unit-value? to-value) to-value))
          (alist-ref (swa-http-request-query request) "json")))
      (tail (tail (string-split (ht-ref-q (swa-http-request-data request) path) #\/)))))

  (define (units-respond-f path-units)
    (l (request)
      (units-get-arguments request
        (l (from to value is-json)
          (if is-json
            (respond-type (q json)
              (scm->json-string
                (if (and from to value) (units-convert path-units from to value) null)))
            (let*
              ( (swa-env (swa-http-request-swa-env request)) (data (swa-http-request-data request))
                (title (route-title (ht-ref-q data route))) (time-start (ht-ref-q data time-start)))
              (respond-shtml
                (shtml-layout
                  (list (qq (h1 (unquote title)))
                    (qq
                      (div (@ (class "sph-info-units"))
                        (p (@ (class "small-font"))
                          "convert between more than 1500 units including currencies. currency conversion rates are not current rates."
                          (br)
                          "select units by clicking on the select fields and typing the unit name. change any of the value fields and the other value updates automatically.")
                        (table (tr (th "from") (th "to"))
                          (tr (@ (class units))
                            (td
                              (select (@ (class unit-from) (data-selected (unquote (or from ""))))
                                (option "")))
                            (td
                              (select (@ (class unit-to) (data-selected (unquote (or to ""))))
                                (option ""))))
                          (tr (@ (class values))
                            (td (input (@ (class value-from) (value (unquote (or value ""))))))
                            (td (input (@ (class value-to)))))))))
                  #:title title
                  #:css (client-static swa-env (q css) (list-q default units))
                  #:js (client-static swa-env (q js) (list-q default units)) #:links default-links)
                (cache-headers time-start))))))))

  (define (units-routes)
    (let (program-path (program-paths-f program-dependencies))
      (and (program-path "units")
        (list (route-new "/units/suggest" #f units-suggest-respond)
          (route-new "/units" "unit converter" (units-respond-f (program-path "units"))))))))
