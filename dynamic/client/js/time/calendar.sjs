(module.define "ytilitu.time.calendar"
  (nullary (define year-n-input (document.getElementById "year-n"))
    (define (year-change-event-handler)
      (window.location.assign (+ "/dynamic/ytilitu/time/calendar/" year-n-input.value)))
    (year-n-input.addEventListener "change" year-change-event-handler)))
