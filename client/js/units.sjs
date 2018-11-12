(define (sph-info-units-init)
  (define path-array (window.location.pathname.split "/")
    base-path (chain join (_.first path-array (+ 1 (_.indexOf path-array "units"))) "/")
    text-update-delay 250
    container (jQuery ".sph-info-units")
    select2-options
    (object language (object searching (nullary "searching..."))
      placeholder "unit here"
      ajax
      (object url (l (params) (+ base-path "/suggest" (if* params.term (+ "/" params.term) "")))
        data (l (params) #f)
        processResults (l (data) (object results (data.map (l (a) (object text a id a)))))
        dataType "json" delay text-update-delay minimumInputLength 1))
    unit-from-select (container.find ".units .unit-from")
    unit-to-select (container.find ".units .unit-to"))
  (define (init-unit-selects base-path) (unit-from-select.select2 select2-options)
    (unit-to-select.select2 select2-options)
    ; set on-load value
    (chain forEach (array unit-from-select unit-to-select)
      (l (a) (define selected (a.attr "data-selected"))
        (and selected
          (chain trigger (chain append a (new Option selected selected #t #t)) "change"))))
    ; set change event
    (define (on-change event)
      (define unit-from (unit-from-select.val) unit-to (unit-to-select.val))
      (if (and unit-from unit-to)
        (set window.location.pathname (+ base-path "/" unit-from "/" unit-to))))
    (unit-from-select.on "change" on-change) (unit-to-select.on "change" on-change))
  (define (init-value-inputs)
    (define value-from-input (container.find ".values .value-from")
      value-to-input (container.find ".values .value-to"))
    (define (xhr-convert from to value c) (define xhr (new XMLHttpRequest))
      (xhr.open "get" (encodeURI (+ base-path "/" from "/" to "/" value "?json")))
      (set xhr.onload (nullary (if (= 200 xhr.status) (c (JSON.parse xhr.responseText))))) (xhr.send))
    (define (on-change-f value-input result-input is-from)
      (l (event) (define value (value-input.val) value (and value (jQuery.isNumeric value) value))
        (if (not value) return) (define from (unit-from-select.val) to (unit-to-select.val))
        (xhr-convert (if* is-from from to) (if* is-from to from)
          value (l (result) (result-input.val (get result 0))))))
    (value-from-input.on "keyup"
      (_.debounce (on-change-f value-from-input value-to-input #t) text-update-delay))
    (value-to-input.on "keyup"
      (_.debounce (on-change-f value-to-input value-from-input #f) text-update-delay))
    (value-from-input.trigger "keyup"))
  (init-unit-selects base-path) (init-value-inputs))

(sph-info-units-init)
