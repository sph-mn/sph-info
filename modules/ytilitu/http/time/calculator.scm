(library (ytilitu http time calculator)
  (export
    ses-utc-leap-second-table
    time-calculator-respond)
  (import
    (sph)
    (sph-info helper)
    (sph alist)
    (sph list)
    (sph module)
    (sph number)
    (sph time)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web shtml)
    (ytilitu helper)
    (only (guile) exact->inexact))

  (define* (shtml-input id title #:key (attributes (list)) no-title? (content-after (list)))
    (let (id (string-append "input_" id))
      (qq
        (label (@ (for (unquote id)))
          (unquote (if no-title? (list) (qq (div (@ (class title)) (unquote title)))))
          (input (@ (name (unquote id)) (title (unquote title)) (unquote-splicing attributes)))
          (unquote content-after)))))

  (define integer-regex "[-0-9.]*")

  (define-syntax-rule (optional-attribute name value)
    (if value (list (list (quote name) value)) (list)))

  (define-syntax-rule (attribute name value) (list (quote name) value))

  (define* (shtml-input-number class title #:key min max value (attributes (list)))
    (shtml-input class title
      #:attributes
      (append (qq ((type "number") (pattern (unquote integer-regex)))) (optional-attribute min min)
        (optional-attribute max max) (optional-attribute value value) attributes)))

  (define (shtml-time-entry id title)
    (let* ((time (utc-current)) (time-seconds (ns->s time)) (date (utc->date time)))
      (list (q div) (qq (@ (class "time-entry " (unquote id))))
        (list (q h2) title)
        (list (q div) (q (@ (class "unix-tai-iso hbox")))
          (shtml-input-number "unix" "unix time")
          (shtml-input-number "tai_unix" "tai unix time" #:value time-seconds)
          (shtml-input "iso" "date"))
        (list (q div) (q (@ (class "year-month hbox")))
          (shtml-input-number "year" "year" #:min 0 #:value (date-year date))
          (shtml-input-number "week" "week" #:max 53 #:min 1 #:value (utc->week time))
          (shtml-input-number "month" "month" #:max 12 #:min 1 #:value (date-month date))
          (shtml-input-number "day" "day" #:max 31 #:min 1 #:value (date-day date))
          (shtml-input-number "hour" "hour" #:max 24 #:min 0 #:value (date-hour date))
          (shtml-input-number "minute" "minute" #:max 59 #:min 0 #:value (date-minute date))
          (shtml-input-number "second" "second" #:max 59 #:min 0 #:value (date-second date)) (q (br))
          (shtml-input-number "kilosecond" "kilosecond"
            #:max 86.4
            #:min 0
            #:value
            (exact->inexact (round-to-decimal-places (/ (ns->s (utc-elapsed-day time)) 1000) 2))
            #:attributes (qq ((step 0.01))))))))

  (define (list->table-header . a) (map (l (a) (list (q th) a)) a))

  (define (list->table-data . a)
    (map
      (l (a)
        (if (pair? a) (list (q td) (qq (@ (class (unquote (first a))))) (tail a)) (list (q td) a)))
      a))

  (define title-calculator "time calculator and format converter")

  (define (shtml-calculator)
    (shtml-section 0 title-calculator
      (list
        (q
          (div (@ (class "small-font"))
            (p
              "converts unix timestamps to dates and back or calculates iso week numbers and time differences.")
            (p
              "edit any field and other fields update automatically. all times are in timezone utc+0.")))
        (list-q br) (shtml-time-entry "first" "past")
        (list-q br) (shtml-time-entry "second" "future")
        (list-q br)
        (qq
          (div (@ (class "difference small-font")) (h2 "difference")
            (table
              (tr
                (unquote-splicing
                  (list->table-header "" "years"
                    "weeks" "months" "days" "hours" "minutes" "seconds")))
              (tr (@ (class combined))
                (unquote-splicing
                  (list->table-data "split" (pair "ye" "")
                    (pair "we" "") (pair "mo" "")
                    (pair "da" "") (pair "ho" "") (pair "mi" "") (pair "se" ""))))
              (tr (@ (class separate))
                (unquote-splicing
                  (list->table-data "total" (pair "ye" "")
                    (pair "we" "") (pair "mo" "")
                    (pair "da" "") (pair "ho" "") (pair "mi" "") (pair "se" "")))))))
        #;(q
          (div (@ (class "footer")) "made with "
            (a (@ (href "http://momentjs.com/") (target "_blank")) "Moment.js"))))))

  (import-unexported (srfi srfi-19) leap-second-table)

  (define ses-utc-leap-second-table
    (pair (q array)
      (map (l (a) (qq (array (unquote (first a)) (unquote (tail a))))) leap-second-table)))

  (define (time-calculator-respond request)
    (ytilitu-request-bind request (swa-env data routes)
      (respond-shtml
        (shtml-layout (shtml-calculator) #:title
          title-calculator #:js
          (client-static swa-env (q js) (list-q default time-calculator)) #:css
          (client-static swa-env (q css) (list-q default time-calculator)) #:links
          (top-bar-links routes "/time" "/calculator"))))))
