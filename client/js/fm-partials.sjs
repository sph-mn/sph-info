(module.define "sph-info.other.fm-partials"
  (l ()
    (define (fm-modulation-index modulator-amplitude modulator-frequency)
      (/ modulator-amplitude modulator-frequency))
    (define (fm-partial-frq-negative n carrier-frequency modulator-frequency)
      (- carrier-frequency (* n modulator-frequency)))
    (define (fm-partial-frq-positive n carrier-frequency modulator-frequency)
      (+ carrier-frequency (* n modulator-frequency)))
    (define (fm-partial-amp n carrier-frequency modulator-amplitude modulator-frequency)
      (besselj n (fm-modulation-index modulator-amplitude modulator-frequency) 30))
    (define (italic a)
      (let (b (document.createElement "span")) (b.setAttribute "style" "font-style:italic")
        (set b.innerHTML a) b))
    (define (get-dom-by-id ids)
      (ids.reduce (l (result id) (set (get result id) (document.getElementById id)) result)
        (object)))
    (define dom
      (object input (get-dom-by-id (array "cfrq" "mfrq" "mamp"))
        result (document.getElementById "result")))
    (define (fm-spectrum-amps cfrq mfrq mamp count) (define result (array))
      (for ((define n 0) (< n count) (set n (+ n 1)))
        (define amp (fm-partial-amp n cfrq mamp mfrq))
        (if (> amp 1/10000) (result.push (array n amp))))
      (return result))
    (define (fm-spectrum cfrq mfrq mamp) (define amps (fm-spectrum-amps cfrq mfrq mamp 60))
      (if (not amps) (return (array)))
      (set negative-amps (chain reverse (if* (get amps 0 0) amps (amps.slice 1))))
      (chain concat
        (negative-amps.map (l (a) (array (fm-partial-frq-negative (get a 0) cfrq mfrq) (get a 1))))
        (amps.map (l (a) (array (fm-partial-frq-positive (get a 0) cfrq mfrq) (get a 1))))))
    (define (update) (set dom.result.innerHTML "")
      (define cfrq (parseFloat dom.input.cfrq.value)
        mfrq (parseFloat dom.input.mfrq.value)
        mamp (parseFloat dom.input.mamp.value)
        spectrum (fm-spectrum cfrq mfrq mamp) frqs (spectrum.map (l (a) (get a 0))))
      (set dom.result.innerHTML
        (+ (+ "carrier frequency: " cfrq) "\n"
          (+ "modulator frequency: " mfrq) "\n"
          (+ "modulator amplitude: " mamp) "\n"
          (+ "modulation index: " (/ mamp mfrq)) "\n"
          (+ "bandwidth: " (- (Math.max.apply null frqs) (Math.min.apply null frqs))) "\n\n"
          (+ "frequency and amplitude\n"
            (chain join (chain map spectrum (l (a) (+ (get a 0) " " (get a 1)))) "\n")))))
    (define input-fields (array dom.input.cfrq dom.input.mfrq dom.input.mamp))
    (input-fields.forEach
      (l (input) (input.addEventListener "keyup" (_.debounce (l (event) (update)) 250))
        (input.addEventListener "change" (_.debounce (l (event) (update)) 250))))))
