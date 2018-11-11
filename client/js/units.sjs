(define (sph-info-units-init)
  (define text-update-delay 250
    path-array (window.location.pathname.split "/")
    formats (chain join (_.last path-array 2) "/")
    path (chain join (_.initial path-array 2) "/")
    suggest-path "json/units/suggest"
    convert-path "json/units/convert"
    select2-options
    (object language (object searching (nullary "searching..."))
      placeholder "unit here"
      ajax
      (object url (l (params) (+ web-base-path suggest-path "/" (if* params.term params.term "")))
        data (l (params) #f)
        processResults (l (data) (object results (data.map (l (a) (object text a id a)))))
        dataType "json" delay 250 minimumInputLength 1))
    selects (chain select2 ($ "#unit-from,#unit-to") select2-options)
    inputs ($ "#value-from,#value-to"))
  (define (unit-convert& from to value c) (define xhr (new XMLHttpRequest))
    (xhr.open "get" (encodeURI (+ web-base-path convert-path "/" from "/" to "/" value)))
    (set xhr.onload (nullary (if (= 200 xhr.status) (c (JSON.parse xhr.responseText))))) (xhr.send))
  (define (on-change event)
    (let ((unit-from (chain val (selects.eq 0))) (unit-to (chain val (selects.eq 1))))
      (if (and unit-from unit-to)
        (let*
          ( (input-from (inputs.eq 0)) (input-to (inputs.eq 1)) (value-from (input-from.val))
            (value-to (input-to.val)) (value-from-valid (jQuery.isNumeric value-from))
            (value-to-valid (jQuery.isNumeric value-to)))
          (switch event.target.id
            ("value-from"
              (unit-convert& unit-from unit-to
                value-from (l (result) (input-to.val (get result 0))))
              break)
            ("value-to"
              (if value-to-valid
                (unit-convert& unit-to unit-from
                  value-to (l (result) (input-from.val (get result 0)))))
              break)
            ("unit-from"
              (if value-from
                (unit-convert& unit-from unit-to
                  value-from (l (result) (input-to.val (get result 0)))))
              break)
            ("unit-to"
              (if value-from
                (unit-convert& unit-from unit-to
                  value-from (l (result) (input-to.val (get result 0)))))
              break))))))
  (chain on selects "change" on-change)
  (chain on inputs "keyup" (_.debounce on-change text-update-delay))
  (selects.each
    (l (index a) (define selected (a.getAttribute "data-selected"))
      (and selected
        (chain trigger (chain append (jQuery a) (new Option selected selected #t #t)) "change")))))

(sph-info-units-init)
