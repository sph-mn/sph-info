(module.define "sph-info.other.operations"
  (l ()
    (define descriptions
      (object remove-hash-commment-lines "removes all lines that start with a \"#\" character"
        compress-whitespace-vertical "reduces multiple successive newlines"
        compress-whitespace-horizontal "reduces multiple successive spaces and tabs on lines"
        camelcase-to-dashes
        "converts notation like this \"networkMessageAdapter\" to this \"network-message-adapter\""))
    (define (newlines-to-commas a) (a.replace (make-regexp "\\n" "g") ", "))
    (define (commas-to-newlines a) (a.replace (make-regexp ", *" "g") "\\n"))
    (define (commas-to-spaces a) (a.replace (make-regexp ", *" "g") " "))
    (define (spaces-to-commas a) (a.replace (make-regexp " " "g") ", "))
    (define (newlines-to-spaces a) (a.replace (make-regexp "\\n" "g") " "))
    (define (spaces-to-newlines a) (a.replace (make-regexp " " "g") "\n"))
    (define (remove-hash-commment-lines a)
      (chain join
        (chain reduce (a.split "\n")
          (l (r a) (if (and a.length (= "#" (get a 0))) r (begin (r.push a) r))) (array))
        "\n"))
    (define (lowercase a) (a.toLowerCase))
    (define (randomise-lines a)
      (let (lines (a.split "\n"))
        (chain join
          (chain map
            (chain sort (chain map lines (l (a) (array (random-integer 0 lines.length) a)))
              (l (a b) (< (get a 0) (get b 0))))
            (l (a) (get a 1)))
          "\n")))
    (define (compress-whitespace-vertical a) (a.replace (make-regexp "\\n\\n+" "g") "\\n"))
    (define (camelcase-to-dashes a)
      (chain replace (a.replace (make-regexp "(\\s|^)[A-Z]" "g") (l (match) (match.toLowerCase)))
        (make-regexp "[A-Z]" "g") (l (match) (+ "-" (match.toLowerCase)))))
    (define (compress-whitespace-horizontal a)
      (string-join (chain map (a.split "\n") (l (a) (a.replace (make-regexp "( |\\t)+" "g") " ")))
        "\n"))
    (define button-apply (document.getElementById "apply")
      container-description (document.getElementById "description")
      container-description-text (document.getElementById "description-text")
      button-undo (document.getElementById "undo")
      textarea (document.getElementById "text")
      select-operation (document.getElementById "operations") undo-history (array))
    (define (random-integer min max) (+ min (Math.floor (* (Math.random) (- max min)))))
    (define (update-description) (console.log "change")
      (define description (get descriptions select-operation.value))
      (if description
        (begin
          (set container-description.innerHTML description
            container-description.style.display "block"))
        (set container-description.style.display "none")))
    (select-operation.addEventListener "change" update-description)
    (button-undo.addEventListener "click"
      (l () (if undo-history.length (set textarea.value (undo-history.pop)))))
    (button-apply.addEventListener "click"
      (l () (define proc (eval select-operation.value))
        (if proc
          (begin (undo-history.push textarea.value) (set textarea.value (proc textarea.value))))))))
