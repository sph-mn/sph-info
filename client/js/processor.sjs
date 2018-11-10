(module.define "sph-info.processor"
  (l (exportx) (define text-update-delay 250)
    (define (xhr-request form text c) (define xhr (new XMLHttpRequest))
      (xhr.open "post" (encodeURI form.action))
      (set xhr.onload
        (nullary
          (if (= 200 xhr.status) (c xhr.responseText)
            (alert (+ "background request error " xhr.status)))))
      (xhr.send (new FormData form)))
    (define (initialise-forms)
      (let*
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
    (initialise-forms) (exportx (object* initialise-forms))))
