(library (ytilitu http converter)
  (export
    converter-routes)
  (import
    (guile)
    (ice-9 regex)
    (rnrs io ports)
    (rnrs sorting)
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
    (sph set)
    (sph string)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web html)
    (sph web shtml)
    (sxml simple)
    (ytilitu file-processor)
    (ytilitu helper)
    (only (srfi srfi-1) drop-right))

  (define p (q (ytilitu)))

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

  (define (definitions-exclude)
    (set-create "shankh" "padm"
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
      "quintuple" "five" "quadruple" "four" "triple" "three" "couple" "double" "two" "one"))

  (define units-path-prefix "/usr/share/units/")
  (define path-units (search-env-path-one "units"))

  (define (units-names-definitions)
    (let ((regexp-line (make-regexp "^[a-z]+ ")) (exclude (definitions-exclude)))
      (call-with-input-file (string-append units-path-prefix "definitions.units")
        (l (port)
          (port-lines-fold
            (l (line r)
              (let (a (regexp-exec regexp-line line))
                (if a
                  (let (a (string-trim-right (match:substring a)))
                    (if (set-contains? exclude a) r (pair a r)))
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

  (define units-names-all
    (delete-duplicates (append (units-names-definitions) (units-names-currencies))))

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

  (define units-convert-route
    (route-new "/json/converter/units/convert" #f
      (l (request)
        (let (route (ht-ref-q (swa-http-request-data request) route))
          (respond-type (q json)
            (scm->json-string
              (or
                (apply
                  (l* (from to #:optional (value ""))
                    (let (value (if (string-null? value) value (string->number value)))
                      (if (and value (string-match "[a-z]+" from) (string-match "[a-z]+" to))
                        (units-convert value from to) (list))))
                  (string-split
                    (html-uri-decode
                      (string-drop-prefix (string-append (route-path route) "/")
                        (swa-http-request-path request)))
                    #\/))
                (list))))))))

  (define* (shtml-units #:optional from to from-value to-value)
    (shtml-section 0 "unit converter"
      (qq
        ( (p (@ (class "small-font")) "supports more than 1500 units including currencies."
            (br)
            "enter a value in any of the value fields, press enter, and the other value updates automatically."
            (br)
            " select the units to use by typing their names into the unit fields and selecting it.")
          (br)
          (div
            (input
              (@ (id value-from) (placeholder "value here") (value (unquote (or from-value "")))))
            (select (@ (id unit-from) (data-selected (unquote (or from "")))) (option "")))
          (div "==")
          (div
            (input (@ (id value-to) (placeholder "value here") (value (unquote (or to-value "")))))
            (select (@ (id unit-to) (data-selected (unquote (or to "")))) (option "")))))))

  (define units-suggest-route
    (route-new "/json/converter/units/suggest-names" #f
      (l (request)
        (respond-type (q json)
          (scm->json-string
            (let
              (name
                (string-trim-right
                  (string-drop-prefix
                    (string-append (route-path (ht-ref-q (swa-http-request-data request) route))
                      "/")
                    (swa-http-request-path request))))
              (if (valid-unit-name? name) (units-suggest name) (list))))))))

  (define regexp-alphanumeric (make-regexp "^[a-zA-Z]+$"))
  (define regexp-numeric (make-regexp "^[0-9\\.eE, ]+$"))
  (define (valid-unit-name? a) (regexp-exec regexp-alphanumeric a))
  (define (valid-unit-value? a) (regexp-exec regexp-numeric a))

  (define (units-route-get-arguments request c)
    "request procedure:{from to from-value to-value -> any} -> any"
    (let (a (swa-http-request-query request))
      (let
        ( (from (alist-ref a "from")) (to (alist-ref a "to"))
          (from-value (alist-ref a "from-value")) (to-value (alist-ref a "to-value")))
        (c (and from (valid-unit-name? from) from) (and to (valid-unit-name? to) to)
          (and from-value (valid-unit-value? from-value) from-value)
          (and to-value (valid-unit-value? to-value) to-value)))))

  (define units-route
    (route-new "/converter/units" "units"
      (l (request)
        (ytilitu-request-bind request (swa-env data route time-start routes)
          (units-route-get-arguments request
            (l (from to from-value to-value)
              (respond-shtml
                (shtml-layout (shtml-units from to from-value to-value) #:body-class
                  "units" #:title
                  (string-append "convert units") #:css
                  (client-static swa-env (q css) (list-q default converter-units)) #:js
                  (client-static swa-env (q js) (list-q default converter-units)) #:links
                  (top-bar-links routes "/converter" "units"))
                (cache-headers time-start))))))))

  (define dependencies
    (file-processor-dependencies
      (list-q ("pandoc" "documents") ("ses" "sescript-javascript")
        (#t "xml-sxml") (#t "sxml-xml")
        ("xml-json-converter" "xml-json" "json-xml") ("sc" "sc-c")
        ("coffee-compile-from-to" "coffeescript-javascript"))))

  (define name->proc
    (file-processor-name->processor-proc
      (l (paths-program)
        (ht-create "documents"
          (l (path-input path-output options)
            (alist-bind options (input-type output-type)
              (and input-type output-type
                (contains? document-input-types input-type)
                (contains? document-output-types output-type)
                (execute-and-check-result (ht-ref paths-program "pandoc")
                  (cli-option "from" input-type) (cli-option "to" output-type)
                  (cli-option "output" path-output) path-input))))
          "xml-json"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "xml-json-converter") "--to_json"
              path-input path-output))
          "json-xml"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "xml-json-converter") "--to_xml"
              path-input path-output))
          "xml-sxml"
          (l (path-input path-output options)
            (call-with-output-file path-output
              (l (out) (display (call-with-input-file path-input (l (in) (xml->sxml in))) out))))
          "sxml-xml"
          (l (path-input path-output options)
            (call-with-output-file path-output
              (l (out) (sxml->xml (rw-file->list read path-input) out))))
          "endianess" (l (path-input path-output options) #t)
          "sescript-javascript"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "ses") path-input path-output))
          "sc-c"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "sc") path-input path-output))
          "coffeescript-javascript"
          (l (path-input path-output options)
            (execute-and-check-result (ht-ref paths-program "coffee-compile-from-to") path-input
              path-output))))
      dependencies))

  (define (title-map a) (string-append (string-join (string-split a #\-) " to ") " converter"))

  (define-as document-type->file-name-extension-table ht-create-string
    "asciidoc" "txt"
    "html5" "html"
    "commonmark" "md"
    "markdown" "md"
    "markdown_github" "md"
    "markdown_mmd" "mmd"
    "markdown_phpextra" "md"
    "markdown_strict" "md" "docbook5" "dbk" "docbook" "dbk" "epub3" "epub" "plain" "txt")

  (define (document-type->extension a) (ht-ref document-type->file-name-extension-table a a))

  (define-as document-input-types list
    "asciidoc" "beamer"
    "commonmark" "context"
    "docbook" "docbook5"
    "docx" "dokuwiki"
    "dzslides" "epub"
    "epub3" "fb2"
    "haddock" "html"
    "html5" "icml"
    "latex" "man"
    "markdown" "markdown_github"
    "markdown_mmd" "markdown_phpextra"
    "markdown_strict" "mediawiki"
    "native" "odt"
    "opendocument" "opml"
    "org" "plain" "revealjs" "rst" "rtf" "s5" "slideous" "slidy" "tei" "texinfo" "textile")

  (define-as document-output-types list
    "commonmark" "docbook"
    "docx" "epub"
    "haddock" "html"
    "latex" "markdown"
    "markdown_github" "markdown_mmd"
    "markdown_phpextra" "markdown_strict"
    "mediawiki" "native" "odt" "opml" "org" "rst" "t2t" "textile" "twiki")

  (define file-name-extensions
    (map (l (a) (string-append "." a))
      (delete-duplicates
        (append document-output-types document-input-types
          (vector->list (ht-values document-type->file-name-extension-table))))))

  (define (drop-file-name-extension a)
    (or (any (l (b) (and (string-suffix? b a) (string-drop-suffix b a))) file-name-extensions) a))

  (define name->extensions
    (let
      (table
        (ht-create "xml-json" #t
          "json-xml" #t
          "xml-sxml" #t
          "sxml-xml" #t
          "sc-c" #t
          "coffeescript-javascript" (pair "coffee" "js") "sescript-javascript" (pair "sjs" "js")))
      (l (a)
        (let (value (ht-ref table a))
          (if (and (boolean? value) value)
            (let (r (string-split a #\-)) (pair (first r) (first (tail r)))) value)))))

  (define (name->options a)
    (let ((default (list #:title-map title-map)) (form-options (list #:input-text? #t)))
      (append default
        (string-case a
          ("documents"
            (list #:respond-form-options
              (list #:file-name-map
                (l (a options input-field)
                  (string-append (drop-file-name-extension a) "."
                    (document-type->extension (alist-ref-q options output-type)))))
              #:shtml-section-options
              (list #:description
                (string-append "convert between various document file formats. "
                  file-processor-description)
                #:form-options
                (append
                  (list #:input-types document-input-types #:output-types document-output-types)
                  form-options))))
          (else
            (list #:respond-form-options
              (list #:file-name-map
                (l (input-file-name options input-field)
                  (let (extensions (name->extensions a))
                    (if extensions
                      (string-append
                        (string-drop-suffix-if-exists (string-append "." (first extensions))
                          input-file-name)
                        "." (tail extensions))
                      input-file-name))))
              #:shtml-section-options
              (list #:form-options form-options #:description file-processor-description)))))))

  (if (not path-units)
    (log-message (log-message (q error) (string-append "missing dependency units"))))

  (define converter-routes
    (append (if path-units (list units-route units-suggest-route units-convert-route) (list))
      (file-processor-create-routes "/converter" "converted"
        name->proc dependencies #:name->options name->options))))
