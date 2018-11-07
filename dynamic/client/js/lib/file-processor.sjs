(module.define "ytilitu.lib.file_processor"
  (l (exportx)
    (define (xhr-form-result& form text c) (define xhr (new XMLHttpRequest))
      (xhr.open "post" (encodeURI form.action))
      (set xhr.onload (nullary (if (= 200 xhr.status) (c xhr.responseText))))
      (xhr.send (new FormData form)))
    (define (initialise-form container-id display-if-field-text?)
      (define container (document.getElementById container-id)) (if (not container) (return))
      (define input-file-clear (document.querySelector (+ "#" container-id " .input-file-clear")))
      (define input-file (document.querySelector (+ "#" container-id " .input-file"))
        input-text (document.querySelector (+ "#" container-id " .input-text"))
        form (document.querySelector (+ "#" container-id " form")))
      (input-file-clear.addEventListener "click" (nullary (set input-file.value "")))
      (input-text.addEventListener "change" (nullary (set input-file.value "")))
      (form.addEventListener "submit"
        (l (event)
          (if display-if-field-text?
            (begin
              (if input-text.value
                (xhr-form-result& form input-text.value
                  (l (result)
                    (if (= result "failure. syntax or other error.") (alert result)
                      (set input-text.value result)))))
              (event.preventDefault))
            (if (not (or input-file.value input-text.value)) (event.preventDefault))))))
    (exportx (object* initialise-form))))
