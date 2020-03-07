(module.define "sph-info.other.rhymes"
  (l () (define suggest-path "/dynamic/json/rhymes/suggest/")
    (define (italic a)
      (let (b (document.createElement "span")) (b.setAttribute "style" "font-style:italic")
        (set b.innerHTML a) b))
    (define input-word (document.getElementById "word")
      button-get (document.getElementById "get") result-container (document.getElementById "result"))
    (define (get-rhyming-words& word c) (define xhr (new XMLHttpRequest))
      (xhr.open "get" (encodeURI (+ suggest-path word)))
      (set xhr.onload (l () (if (= 200 xhr.status) (c (JSON.parse xhr.responseText))))) (xhr.send))
    (define (update-rhyming-words) (set result-container.innerHTML "")
      (define word input-word.value)
      (if word
        (if (and word (< word.length 30) (chain test (make-regexp "^[a-zA-Z]+$") word))
          (begin
            (get-rhyming-words& word
              (l (result)
                (if (and (= "object" (typeof result)) result.length)
                  (set result-container.innerHTML (result.join ", "))
                  (begin (set result-container.innerHTML "")
                    (result-container.appendChild (italic "no results")))))))
          (begin (set result-container.innerHTML "")
            (result-container.appendChild (italic "invalid word"))))))
    (input-word.addEventListener "keyup" (_.debounce (l (event) (update-rhyming-words)) 250))))
