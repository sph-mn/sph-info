(module.define "sph-info.time.calculator"
  (l () (ses-comment "internal time format is a moment object")
    (define seconds-day 86400 utc-leap-second-table (unquote utc-leap-second-table))
    (define (truncate-to-decimal-places a n) (if (not n) (return (Math.trunc a)))
      (define factor (Math.pow 10 n)) (/ (Math.trunc (* a factor)) factor))
    (define (leap-second-delta utc-seconds)
      (define (find-leap-seconds index)
        (if (< index utc-leap-second-table.length)
          (if (>= utc-seconds (get utc-leap-second-table index 0))
            (get utc-leap-second-table index 1) (find-leap-seconds (+ 1 index)))
          0))
      (if (< utc-seconds (* (- 1972 1970) 365 seconds-day)) 0 (find-leap-seconds 0)))
    (define (empty-if-nan a) (if (isNaN a) "" a)) (define iso-format-pattern "YYYY-MM-DD HH:mm:ss")
    (define (unix->time a) (moment.utc (* 1000 a)))
    (define (difference-initialise)
      (define state (object input-block-first null input-block-second null))
      (define fields
        (object separate
          (object se (object set (l (a) (truncate-to-decimal-places (a.asSeconds) 2)))
            mi (object set (l (a) (truncate-to-decimal-places (a.asMinutes) 2)))
            ho (object set (l (a) (truncate-to-decimal-places (a.asHours) 2)))
            da (object set (l (a) (truncate-to-decimal-places (a.asDays) 2)))
            mo (object set (l (a) (truncate-to-decimal-places (a.asMonths) 2)))
            we (object set (l (a) (truncate-to-decimal-places (a.asWeeks) 2)))
            ye (object set (l (a) (truncate-to-decimal-places (a.asYears) 2))))
          combined
          (object se (object set (l (a) (a.seconds)))
            mi (object set (l (a) (a.minutes)))
            ho (object set (l (a) (a.hours)))
            da (object set (l (a) (a.days)))
            mo (object set (l (a) (a.months)))
            we (object set (l (a) (a.weeks))) ye (object set (l (a) (a.years))))))
      (define (update) (if (not state.input-block-second) (return))
        (define time-a state.input-block-first.current-time
          time-b state.input-block-second.current-time)
        (_.each fields
          (l (fields type)
            (_.each fields
              (l (data name)
                (set data.element.innerHTML
                  (data.set (moment.duration (time-b.diff time-a "milliseconds")))))))))
      (define (initialise)
        (_.each fields
          (l (fields type)
            (_.each fields
              (l (data name) (set data.element (document.querySelector (+ "." type " ." name))))))))
      (initialise) (set state.update update) state)
    (define (input-block-initialise difference selector) (define state (object current-time null))
      (define inputs
        (object input-unix (object get (l (a) (unix->time a)) set (l (a) (a.unix)))
          input-tai-unix
          (object get
            (l (a) (let (a-tai (parseInt a 10)) (unix->time (- a-tai (leap-second-delta a-tai)))))
            set (l (a) (let (a-unix (a.unix)) (+ a-unix (leap-second-delta a-unix)))))
          input-year
          (object get (l (a) (state.current-time.year a))
            set (l (a) (inputs.input-week.element.setAttribute "max" (a.isoWeeksInYear)) (a.year)))
          input-week
          (object get (l (a) (chain isoWeek (chain isoWeekday state.current-time 1) a))
            set
            (l (a) (define last-week (chain isoWeeksInYear a) week-number (a.isoWeek))
              (if (> week-number last-week) (set week-number last-week)) week-number))
          input-iso
          (object get (l (a) (moment.utc a iso-format-pattern))
            set (l (a) (chain format a iso-format-pattern)))
          input-month
          (object get (l (a) (state.current-time.month (- (parseInt a 10) 1)))
            set (l (a) (+ 1 (a.month))))
          input-day (object get (l (a) (state.current-time.date a)) set (l (a) (a.date)))
          input-hour (object get (l (a) (state.current-time.hour a)) set (l (a) (a.hour)))
          input-minute (object get (l (a) (state.current-time.minute a)) set (l (a) (a.minute)))
          input-second (object get (l (a) (state.current-time.second a)) set (l (a) (a.second)))
          input-kilosecond
          (object get
            (l (a)
              (unix->time
                (+ (chain unix (chain startOf (state.current-time.clone) "day")) (* 1000 a))))
            set
            (l (a)
              (truncate-to-decimal-places
                (/ (- (a.unix) (chain unix (chain startOf (a.clone) "day"))) 1000) 2)))))
      (define (update leading) (if (not leading) (set leading inputs.input-tai-unix.element))
        (define input (get inputs leading.name)) (set state.current-time (input.get leading.value))
        (_.each inputs
          (l (value key)
            (if (not (= leading.name key))
              (let (input (get inputs key))
                (set input.element.value (input.set state.current-time))))))
        (difference.update))
      (define (update-event-handler event) (update event.target))
      (define (initialise selector)
        (_.map inputs
          (l (value key)
            (define element-selector (+ selector " input[name=" key "]")
              element (document.querySelector element-selector))
            (set (get inputs key "element") element)
            (if (not (= "input_week" key))
              (element.addEventListener "keyup" update-event-handler))
            (element.addEventListener "change" update-event-handler)))
        (update))
      (initialise selector) state)
    (define (initialise) (define difference (difference-initialise))
      (set difference.input-block-first (input-block-initialise difference ".time-entry.first"))
      (set difference.input-block-second (input-block-initialise difference ".time-entry.second"))
      (difference.update))
    (initialise)))
