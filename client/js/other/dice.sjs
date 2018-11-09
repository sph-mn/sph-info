(module.define "ytilitu.other.dice"
  (nullary
    (define (div a css-class)
      (let (b (document.createElement "div")) (b.setAttribute "class" css-class)
        (set b.innerHTML a) b))
    (define roll-text (div "roll, roll, roll..." "roll"))
    (define input-sides (document.getElementById "sides")
      button-roll (document.getElementById "roll")
      result-container (document.getElementById "result"))
    (input-sides.addEventListener "change" (_.debounce (nullary (console.log "changed")) 500))
    (define (random-integer min max) (+ min (Math.floor (* (Math.random) (- max min)))))
    (define (dice-roll sides) "negative sides do not make that much sense but are supported"
      (if (> sides 0) (random-integer 1 (+ 1 sides)) (if (< sides 0) (random-integer 0 sides) 0)))
    (button-roll.addEventListener "click"
      (nullary (set result-container.innerHTML "") (result-container.appendChild roll-text)
        (setTimeout
          (nullary (set result-container.innerHTML "")
            (result-container.appendChild (div (dice-roll (parseInt input-sides.value)) "number")))
          700)))))
