(library (sph-info chinese)
  (export chinese-routes)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph-info processor)
    (sph list)
    (sph other)
    (sph process)
    (sph web app http)
    (sxml simple))

  (define program-dependencies (list "hanzi-tools-cli"))

  (define (uglifyjs-string->port path-hanzi-tools a port)
    (execute-with-pipes
      (l (input output) (begin-thread (display a input) (close-port input))
        (begin-first (port->port output port) (close-port output)))
      path-hanzi-tools (list "--simplify") #t #t #f))

  (define (hanzi-tools-cli path-uglifyjs source target)
    (execute-and-check-result path-uglifyjs "--beautify" "--output" target source))

  (define (chinese-routes)
    (let*
      ( (program-path (program-paths-f program-dependencies))
        (path-hanzi-tools (program-path "hanzi-tools-cli")))
      (processor-routes "chinese text conversions" "/chinese"
        (and path-hanzi-tools
          ; ("hanzi" "pinyin")
          ; ("pinyin" "hanzi")
          (list "traditional" "simplified"
            (q (text-to-text)) null
            #f #f
            (l (request input-text client)
              (display (scm-format-port (open-input-string input-text)) client))))))))
