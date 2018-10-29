(library (sph-info helper)
  (export
    shtml-layout)
  (import
    (sph)
    (sph web shtml))

  (define* (shtml-layout v content)
    (let
      ( (head (v (q head))) (top (v (q top))) (bottom (v (q bottom)))
        (title (v (q title))) (body-class (v (q body-class))) (css (v (q css) null)) (js (v (q js) null)))
      (qq
        (html
          (head (title (unquote title)) (unquote-splicing (map shtml-include-css css))
            (meta (@ (name "viewport") (content "width=device-width,initial-scale=1")))
            (unquote head))
          (body (unquote (if body-class (qq (@ (class (unquote body-class)))) null))
            (unquote (if top (qq (div (@ (class top)) (unquote top))) null))
            (unquote (if content (qq (div (@ (class middle)) (unquote content))) null))
            (unquote (if bottom (qq (div (@ (class bottom)) (unquote bottom))) null))
            (unquote-splicing (map shtml-include-javascript js))))))))
