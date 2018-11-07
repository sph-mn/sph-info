(module.define "ytilitu.other.rhymes"
  (nullary
    (define input-word (document.getElementById "word")
      button-get (document.getElementById "get") result-container (document.getElementById "result"))
    (define (get-rhyming-words& word c) (define xhr (new XMLHttpRequest))
      (xhr.open "get" (encodeURI (+ "/dynamic/ytilitu/json/other/rhymes/suggest/" word)))
      (set xhr.onload (nullary (if (= 200 xhr.status) (c (JSON.parse xhr.responseText)))))
      (xhr.send))
    (define (update-rhyming-words) (set result-container.innerHTML "")
      (define word input-word.value)
      (if word
        (if (and word (< word.length 30) (chain test (make-regexp "^[a-zA-Z]+$") word))
          (begin
            (get-rhyming-words& word
              (l (result)
                (if (= "object" (typeof result))
                  (setTimeout (nullary (set result-container.innerHTML (result.join ", "))) 100)
                  (set result-container.innerHTML result)))))
          (set result-container.innerHTML "invalid word"))))
    (input-word.addEventListener "keypress"
      (l (event other) (if (and event (= "Enter" event.key)) (update-rhyming-words))))
    (button-get.addEventListener "click" update-rhyming-words)))
