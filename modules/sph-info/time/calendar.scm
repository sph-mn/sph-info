(library (sph-info time calendar)
  (export
    time-calendar-respond)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph hashtable)
    (sph list)
    (sph list other)
    (sph string)
    (sph time)
    (sph time gregorian)
    (sph time stream)
    (sph time string)
    (sph vector)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web shtml)
    (srfi srfi-41)
    (ytilitu helper))

  (define (calendar-dates year) "integer -> (vector:time-date integer:week-number)"
    (stream->list
      (stream-map (l (a) (pair a (utc->week (utc-from-date a))))
        (date-stream (date-new #:year year) (date-new #:year year #:month 12 #:day 31)))))

  (define (calendar-data year)
    (map (l (a) (pair (first a) (group (tail a) tail)))
      (group (calendar-dates year) (l (a) (date-month (first a))))))

  (define (map-year-range year-middle radius proc)
    (let (year-end (+ radius year-middle))
      (let loop ((year (- year-middle radius)))
        (if (<= year year-end) (pair (proc year) (loop (+ 1 year))) (list)))))

  (define (year-input year) (qq (input (@ (id "year-n") (type "number") (value (unquote year))))))
  (define (list-last-index a) (max 0 (- (length a) 1)))

  (define shtml-week-days
    (pairs (q tr) (q (@ (class day-h)))
      (q (td (@ (class week-n)) ""))
      (map (l (a) (list (q td) a)) (list "mo" "tu" "we" "th" "fr" "sa" "su"))))

  (define (shtml-calendar year)
    (let* ((current-time (utc-current)) (current-date (utc->date current-time)))
      (shtml-section 0 (list "gregorian calendar for the year " (year-input year))
        (list
          (qq
            (div
              (a
                (@
                  (href
                    (unquote
                      (string-append web-basename "/time/calendar/" (number->string (- year 1))))))
                "previous")
              "|"
              (a
                (@
                  (href
                    (unquote
                      (string-append web-basename "/time/calendar/" (number->string (+ year 1))))))
                "next")))
          (qq
            (div (@ (id days-n)) "days: "
              (unquote (if (= 0 year) 0 (if (greg-year-leap-year? year) 366 365)))))
          (list-q br)
          (pairs (q div) (q (@ (class months)))
            (map
              (l (month)
                (let (month-number (first month))
                  (pairs (q table) (q (@ (class month)))
                    (pairs (qq (tr (th (@ (colspan 8)) (unquote month-number)))) shtml-week-days
                      (map-with-index
                        (l (index week)
                          (let (week-number (first week))
                            (pairs (q tr) (q (@ (class week)))
                              (pair (qq (td (@ (class "week-n")) (unquote week-number)))
                                (append
                                  (if (= 0 index)
                                    (make-list (- 7 (length (tail week))) (q (td ""))) (list))
                                  (map
                                    (l (day)
                                      (let (day-number (date-day (first day)))
                                        (list (q td)
                                          (if
                                            (and (= year (date-year current-date))
                                              (= day-number (date-day current-date))
                                              (= month-number (date-month current-date)))
                                            (q (@ (class today))) "")
                                          day-number)))
                                    (tail week)))))))
                        (tail month))))))
              (if (= 0 year) (list) (calendar-data year))))
          (list-q br)
          (qq
            (div (@ (class "note-bottom very-small-font subdued"))
              "any year including negative years supported"))
          (if (negative? year)
            (qq
              (div (@ (class "small-font"))
                "calendars for negative years are calculated with a year 0 and without consideration of historical time-keeping errors"))
            "")
          (qq (div (@ (id days-n)) "todays date (utc): " (unquote (utc->ymd current-time))))
          (qq (div (@ (id days-n)) "todays week (utc, iso): " (unquote (utc->week current-time))))))))

  (define (time-calendar-respond request)
    (let*
      ( (swa-env (swa-http-request-swa-env request)) (data (swa-http-request-data request))
        (year
          (match-path (string-drop-prefix web-basename (swa-http-request-path request))
            (("time" "calendar" (? string->number year)) (string->number year))
            (("time" "calendar") (utc-year (utc-current))))))
      (respond-shtml
        (shtml-layout (shtml-calendar year) #:title
          (string-append "gregorian calendar for the year " (number->string year)) #:js
          (client-static swa-env (q js) (list-q default time-calendar)) #:css
          (client-static swa-env (q css) (list-q default time-calendar)) #:links
          (top-bar-links (ht-ref-q data routes) "/time" "/calendar"))))))
