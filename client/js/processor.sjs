(set sph-info (or window.sph-info (object)))

(set sph-info.processor
  (object container null
    formats null
    text-update-delay 250
    init-formats-select
    (nullary
      (let* ((select (this.container.querySelector "select.formats")))
        (for ((define i 0) (< i select.options.length) (set i (+ 1 i)))
          (let (option (get select.options i))
            (if (= sph-info.processor.formats option.value) (set option.selected #t))))
        (chain addEventListener select
          "change"
          (l (event) "remove the last two elements from path and add a new from/to path"
            (set window.location.pathname (+ sph-info.processor.path "/" event.target.value))))))
    init
    (nullary (set this.container (document.querySelector ".sph-info-processor"))
      (if (not this.container) return)
      (let* ((path-array (window.location.pathname.split "/")))
        (set sph-info.processor.formats (chain join (_.last path-array 2) "/")
          sph-info.processor.path (chain join (_.initial path-array 2) "/")))
      (this.init-formats-select)
      #;(let*
        ( (text-forms (document.querySelectorAll "form.sph-info-processor.text-to-text"))
          (file-forms (document.querySelectorAll "form.sph-info-processor.file-to-download")))
        (console.log text-forms file-forms)
        (if text-forms
          (text-forms.forEach
            (l (form)
              (define input-text (form.querySelector ".input-text")
                output-text (form.querySelector ".output-text"))
              (input-text.addEventListener "keyup"
                (_.debounce
                  (nullary
                    (xhr-request form input-text.value
                      (l (response-text) (set output-text.value response-text))))
                  text-update-delay)))))
        (if file-forms
          (file-forms.forEach
            (l (form) (define input-file (form.querySelector ".input-file"))
              (form.addEventListener "submit"
                (l (event)
                  (if (not input-file.value)
                    (begin (alert "please choose a file first") (event.preventDefault))))))))))
    #;(module.define "sph-info.processor"
      (l (exportx)
        ; reload on select change
        ; process on text change
        ; suggest
        (define (xhr-request form text c) (define xhr (new XMLHttpRequest))
          (xhr.open "post" (encodeURI form.action))
          (set xhr.onload
            (nullary
              (if (= 200 xhr.status) (c xhr.responseText)
                (alert (+ "background request error " xhr.status)))))
          (xhr.send (new FormData form)))
        (define (initialise-forms))
        ;(initialise-forms)
    (exportx (object* initialise-forms))))))

(sph-info.processor.init)
