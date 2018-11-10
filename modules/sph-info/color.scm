(library (sph-info color)
  (export
    color-routes)
  (import
    (sph)
    (sph-info helper)
    (sph alist)
    (sph hashtable)
    (sph list)
    (sph string)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web shtml))

  (define* (shtml-input id title #:key (attributes (list)) no-title? (content-after (list)))
    (qq
      (label (@ (for (unquote id)))
        (unquote (if no-title? (list) (qq (div (@ (class title)) (unquote title)))))
        (input (@ (id (unquote id)) (title (unquote title)) (unquote-splicing attributes)))
        (unquote content-after))))

  (define-syntax-rule (list->tag tag a) (pair (q tag) a))

  (define* (shtml-preview #:optional (title "preview"))
    (let (title (if title (qq (div (@ (class title)) (unquote title))) (list)))
      (qq (label (@ (class preview)) (unquote title) (div (@ (class "area")) "")))))

  (define* (shtml-preview-value-content title id)
    (qq
      (label (@ (for (unquote id)) (class name " preview"))
        (unquote (if title (qq (div (@ (class "title")) (unquote title))) ""))
        (div (@ (class "area")) "") (input (@ (id (unquote id)) (title (unquote title)))))))

  (define* (shtml-preview-value name title #:optional count)
    (let (id (string-append "input_" name "_value"))
      (qq
        (div (@ (class (unquote name) " preview"))
          (unquote-splicing
            (if count
              (list (if title (qq (div (@ (class "title")) (unquote title))) "")
                (pairs (q div) (q (@ (class "hbox")))
                  (map-integers count
                    (l (index)
                      (shtml-preview-value-content #f (string-append id "_" (number->string index)))))))
              (list (shtml-preview-value-content title id))))))))

  (define (shtml-calc-inputs)
    (let
      (map-one (l (a) (shtml-input (string-append "input_" a) (string-replace-char a #\_ #\space))))
      (list
        (qq
          ( (div (@ (class conversion))
              (unquote (list->tag div (map map-one (list "rgb" "hex" "hsl"))))
              (unquote (list->tag div (map map-one (list "rgb_css" "hex_css" "hsl_css"))))
              (div (unquote (shtml-preview))))
            (br)
            (div (@ (class "modification"))
              (unquote-splicing
                (map
                  (l (title)
                    (qq
                      (div (@ (class "control " (unquote title)))
                        (unquote
                          (shtml-input (string-append "input_" title) title
                            #:attributes
                            (if (string-equal? "hue" title)
                              (list-q (type number) (value 0)
                                (size 3) (step 10) (min -360) (max 360))
                              (list-q (type number) (value 0) (size 3) (min -100) (max 100)))))
                        (unquote (shtml-preview-value title #f)))))
                  (list "hue" "brightness" "lightness" "saturation")))
              (br) (unquote (shtml-preview-value "modified_preview" "modified")))
            (br)
            (div (@ (class "alternatives"))
              (unquote-splicing
                (map (l (title) (shtml-preview-value title title)) (list "complement" "greyscale")))
              (unquote-splicing
                (let
                  (classes (list "triad" "splitcomplement" "tetrad" "analogous" "monochromatic"))
                  (map (l (class title count) (shtml-preview-value class title count)) classes
                    classes (list 2 2 3 5 5)))))
            (br)
            (label (@ (for "text_display_area")) (div (@ (class title)) (unquote "text results"))
              (textarea (@ (id "text_display_area")) "")))))))

  (define title-color "web color converter and calculator")

  (define (shtml-calc-color)
    (shtml-section 0 title-color
      (list
        (list-q
          (div (@ (class "small-font"))
            "enter a color value into the appropriate field and other values update automatically.")
          (br))
        (shtml-calc-inputs) (list-q br)
        (list-q br)
        #;(q
          (div (@ (class "footer")) "made with "
            (a (@ (href "https://github.com/bgrins/TinyColor") (target "_blank")) "TinyColor"))))))

  (define (color-respond request)
    (sph-info-request-bind request (swa-env data route routes time-start)
      (respond-shtml
        (shtml-layout (shtml-calc-color) #:body-class
          "calc-color" #:title
          (route-title route) #:css
          (client-static swa-env (q css) (list-q default color)) #:js
          (client-static swa-env (q js) (list-q default color)) #:links default-links)
        (cache-headers time-start))))

  (define color-routes (list (route-new "/color" "web color calculator" color-respond))))