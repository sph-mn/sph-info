(define (sph-info-processor-init)
  (define text-update-delay 250 container (document.querySelector ".sph-info-processor"))
  (define (form-xhr-submit form text c) (define xhr (new XMLHttpRequest))
    (xhr.open "post" (encodeURI form.action))
    (set xhr.onload
      (nullary
        (if (= 200 xhr.status) (c xhr.responseText)
          (alert (+ "background request error " xhr.status)))))
    (xhr.send (new FormData form)))
  (define (init-formats-select container formats path)
    (define select (container.querySelector "select.formats"))
    ; select active options
    (for ((define i 0) (< i select.options.length) (set i (+ 1 i)))
      (let (option (get select.options i)) (if (= formats option.value) (set option.selected #t))))
    ; reload on change
    (chain addEventListener select
      "change"
      (l (event) "remove the last two elements from path and add a new from/to path"
        (set window.location.pathname (+ path "/" event.target.value)))))
  (if (not container) return)
  (define path-array (window.location.pathname.split "/")
    formats (chain join (_.last path-array 2) "/") path (chain join (_.initial path-array 2) "/"))
  (init-formats-select container formats path)
  ; initialise text-to-text forms
  (let (text-forms (container.querySelectorAll "form.text-to-text"))
    (if text-forms
      (text-forms.forEach
        (l (form)
          (define input-text (form.querySelector ".input-text")
            output-text (form.querySelector ".output-text"))
          (input-text.addEventListener "keyup"
            (_.debounce
              (nullary
                (form-xhr-submit form input-text.value
                  (l (response-text) (set output-text.value response-text))))
              text-update-delay))))))
  ; initialise file-to-file forms
  (let (file-forms (document.querySelectorAll "form.file-to-file"))
    (if file-forms
      (file-forms.forEach
        (l (form) (define input-file (form.querySelector ".input-file"))
          (form.addEventListener "submit"
            (l (event)
              (if (not input-file.value)
                (begin (alert "please choose a file first") (event.preventDefault))))))))))

(sph-info-processor-init)
