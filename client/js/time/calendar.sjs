(module.define "sph-info.time.calendar"
  (l () (define web-base-path "/dynamic/")
    (define year-n-input (document.getElementById "year-n"))
    (define (year-change-event-handler)
      (window.location.assign (+ web-base-path "time/calendar/" year-n-input.value)))
    (year-n-input.addEventListener "change" year-change-event-handler)))
