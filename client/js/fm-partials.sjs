(module.define "sph-info.other.fm-partials"
  (l ()
    (define (fm-modulation-index modulator-amplitude modulator-frequency)
      (/ modulator-amplitude modulator-frequency))
    (define (fm-partial-frq-negative n carrier-frequency modulator-frequency)
      (* (if* (modulo n 2) -1 1) (- carrier-frequency (* n modulator-frequency))))
    (define (fm-partial-frq-positive n carrier-frequency modulator-frequency)
      (+ carrier-frequency (* n modulator-frequency)))
    (define (fm-partial-amp n modulator-amplitude modulator-frequency)
      (besselj n (fm-modulation-index modulator-amplitude modulator-frequency)))
    (define (italic a)
      (let (b (document.createElement "span")) (b.setAttribute "style" "font-style:italic")
        (set b.innerHTML a) b))
    (define (get-dom-by-id ids)
      (ids.reduce (l (result id) (set (get result id) (document.getElementById id)) result)
        (object)))
    (define dom
      (object input (get-dom-by-id (array "cfrq" "mfrq" "mamp" "mi"))
        result (document.getElementById "result")))
    (define (fm-spectrum-amps cfrq mfrq mamp count) "-> [[partial-index, amplitude], ...]"
      (define result (array))
      (for ((define n 0) (< n count) (set n (+ n 1))) (define amp (fm-partial-amp n mamp mfrq))
        (if (> (Math.abs amp) 1/1000) (result.push (array n amp))))
      result)
    (define (fm-spectrum cfrq mfrq mamp) (define amps (fm-spectrum-amps cfrq mfrq mamp 60))
      (if (not amps.length) (return (array)))
      (set negative-amps
        (begin
          (ses-comment "copy array and drop carrier frequency if included with partial-index zero")
          (chain reverse (if* (= 0 (get amps 0 0)) (amps.slice 1) (Array.from amps)))))
      (chain filter
        (chain concat
          (negative-amps.map
            (l (a) (array (fm-partial-frq-negative (get a 0) cfrq mfrq) (get a 1))))
          (amps.map (l (a) (array (fm-partial-frq-positive (get a 0) cfrq mfrq) (get a 1)))))
        (l (a) (not (= 0 (get a 0))))))
    (define (fm-spectrum-merge a) "work in progress"
      (define hash (object)) (a.forEach (l (a) (define key (Math.abs (get a 0))))) a)
    (define (update input) (set dom.result.innerHTML "")
      (define cfrq (parseFloat dom.input.cfrq.value)
        mfrq (parseFloat dom.input.mfrq.value)
        mamp (parseFloat dom.input.mamp.value) mi (parseFloat dom.input.mi.value))
      (if (= input dom.input.mi) (set mamp (chain toFixed (* mi mfrq) 2) dom.input.mamp.value mamp))
      (if (= input dom.input.mamp)
        (set mi (chain toFixed (fm-modulation-index mamp mfrq) 2) dom.input.mi.value mi))
      (if (not (and cfrq mfrq mamp)) (begin (set dom.result.innerHTML "") return))
      (define spectrum (fm-spectrum-merge (fm-spectrum cfrq mfrq mamp))
        frqs (spectrum.map (l (a) (get a 0))))
      (set dom.result.innerHTML
        (+ (+ "modulation index: " (chain toFixed (fm-modulation-index mamp mfrq) 2)) "\n"
          (+ "bandwidth: " (- (Math.max.apply null frqs) (Math.min.apply null frqs))) "\n\n"
          (+ "frequency and amplitude\n"
            (chain join (chain map spectrum (l (a) (+ (get a 0) " " (get a 1)))) "\n")))))
    (define input-fields (array dom.input.cfrq dom.input.mfrq dom.input.mamp dom.input.mi))
    (input-fields.forEach
      (l (input) (input.addEventListener "keyup" (_.debounce (l (event) (update)) 250))
        (input.addEventListener "change" (_.debounce (l (event) (update event.target)) 250))))
    (update)))
