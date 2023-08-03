(module.define "sph-info.color"
  (l () (declare current-color current-color-modified current-selection)
    (define selection-as-input
      (object colors (array)
        initialize
        (l (set-color-f) (define container (document.getElementById "selection-as-input"))
          (set selection-as-input.container container selection-as-input.set-color set-color-f))
        add
        (l (color) (if (selection-as-input.colors.includes color) return)
          (if (not selection-as-input.colors.length)
            (set selection-as-input.container.style.display "block"))
          (selection-as-input.colors.push color) (define button (document.createElement "div"))
          (set button.style.backgroundColor color button.innerHTML color)
          (button.addEventListener "click" (l () (selection-as-input.set-color color)))
          (selection-as-input.container.appendChild button))))
    (define (string-space->comma a) (a.replace (make-regexp "\\s+" "g") ","))
    (define inputs
      (object input-rgb
        (object value->color (l (a) (tinycolor a)) color->value (l (a) (a.toRgbString))) input-hex
        (object value->color (l (a) (tinycolor a)) color->value (l (a) (a.toHexString))) input-hsl
        (object value->color (l (a) (tinycolor a)) color->value (l (a) (a.toHslString)))))
    (define (update-multi-preview create-colors name) (define colors (create-colors))
      (if (< 1 colors.length) (colors.shift))
      (_.times colors.length
        (l (index) (define color (get colors index))
          (define input-id (+ "input_" name "_value_" index))
          (define preview (document.querySelector (+ "." name " .preview[for=" input-id "] .area")))
          (define value (document.getElementById input-id))
          (set value.value (color.toHexString) preview.style.backgroundColor (color.toHexString)))))
    (define names-modifications (array "hue" "brightness" "lightness" "saturation"))
    (define (initialize-modifications)
      (_.each names-modifications
        (l (name) (define control (document.getElementById (+ "input_" name)))
          (control.addEventListener "change" (l (event) (update))))))
    (define (update-modifications) (set current-color-modified (current-color.clone))
      (_.each names-modifications
        (l (name) (define control (document.getElementById (+ "input_" name)))
          (define value (document.getElementById (+ "input_" name "_value"))
            preview (document.querySelector (+ ".control." name " .preview .area"))
            control-value (parseInt control.value 10))
          (declare method-and-value)
          (switch name ("hue" (set method-and-value (array "spin" control-value)) break)
            ("lightness"
              (set method-and-value
                (array (if* (<= 0 control-value) "lighten" "darken") (Math.abs control-value)))
              break)
            ("brightness" (set method-and-value (array "brighten" control-value)) break)
            ("saturation"
              (set method-and-value
                (array (if* (<= 0 control-value) "saturate" "desaturate") (Math.abs control-value)))
              break))
          ((get current-color-modified (get method-and-value 0)) (get method-and-value 1))
          (define color
            ((get (current-color.clone) (get method-and-value 0)) (get method-and-value 1)))
          (set value.value (color.toHexString) preview.style.backgroundColor (color.toHexString))))
      (define preview-current-color (document.querySelector ".modification > .preview .area"))
      (set preview-current-color.style.backgroundColor (current-color-modified.toHexString))
      (define preview-current-color-modified
        (document.getElementById "input_modified_preview_value"))
      (set preview-current-color-modified.value (current-color-modified.toHexString)))
    (define names-clone-preview (array "complement" "greyscale"))
    (define names-noclone-preview
      (array "triad" "splitcomplement" "tetrad" "analogous" "monochromatic"))
    (define (update-alternatives)
      (_.each names-clone-preview
        (l (name)
          (update-multi-preview (l () (array ((get (current-color-modified.clone) name)))) name)))
      (_.each names-noclone-preview
        (l (name) (update-multi-preview (l () ((get current-color-modified name))) name))))
    (define (update current-input)
      (if (not current-input) (set current-input inputs.input-hex.element))
      (update-inputs current-input) (update-preview) (update-modifications) (update-alternatives))
    (define (update-event-handler event) (update event.target))
    (define (update-preview) (define element (document.querySelector ".conversion .preview .area"))
      (set element.style.backgroundColor inputs.input-hex.element.value))
    (define (inputs-initialize-select-on-click)
      (define inputs-all
        (document.querySelectorAll ".modification input:not([type=number]), .alternatives input"))
      (_.each inputs-all
        (l (input)
          (input.addEventListener "click"
            (l (event) (set current-selection input.value)
              (selection-as-input.add current-selection) (input.select event))))))
    (define (inputs-initialize) (inputs-initialize-select-on-click)
      (_.map inputs
        (l (value key) (define element (document.getElementById key))
          (set (get inputs key "element") element)
          (element.addEventListener "keyup" update-event-handler)
          (element.addEventListener "change" update-event-handler)))
      (initialize-modifications)
      (set inputs.input-hex.element.value (chain toHexString (tinycolor "#538cc6")))
      (update inputs.input-hex.element))
    (define (update-inputs leading) (define input (get inputs leading.id))
      (set current-color (input.value->color leading.value)
        current-color-modified (current-color.clone))
      (_.each inputs
        (l (value key)
          (if (not (= leading.id key))
            (let (input (get inputs key))
              (set input.element.value (input.color->value current-color)))))))
    (inputs-initialize)
    (selection-as-input.initialize
      (l (color) (set inputs.input-hex.element.value color) (update inputs.input-hex.element)))))
