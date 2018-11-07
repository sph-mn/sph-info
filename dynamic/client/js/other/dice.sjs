(module.define "ytilitu.other.dice"
  (nullary
    (define input-sides (document.getElementById "sides")
      button-roll (document.getElementById "roll")
      result-container (document.getElementById "result"))
    (define (random-integer min max) (+ min (Math.floor (* (Math.random) (- max min)))))
    (define (dice-roll sides)
      ;negative sides do not make much sense, but it is supported
      (if (> sides 0) (random-integer 1 (+ 1 sides)) (if (< sides 0) (random-integer 0 sides) 0)))
    (button-roll.addEventListener "click"
      (nullary (set result-container.innerHTML "")
        (setTimeout
          (nullary (set result-container.innerHTML (dice-roll (parseInt input-sides.value)))) 200)))))
