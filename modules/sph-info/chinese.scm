(define-module (sph-info chinese))

(use-modules (guile) (ice-9 threads)
  (sph) (sph-info helper)
  (sph-info processor) (sph io)
  (sph string) (sph list)
  (sph other) (sph process) (sph process create) (sph web app http) (sxml simple))

(export chinese-routes)
(define program-dependencies (list "hanzi-convert"))

(define (hanzi-convert-route-f path-hanzi-convert)
  (l (from to description input-limit . options)
    (list from to
      description (q (text-to-text))
      null #f
      #f
      (l (request input-text client)
        (if (and input-limit (< input-limit (string-length input-text)))
          (display
            (string-append "input for this format must be less than " (number->string input-limit)
              " characters")
            client)
          (execute-with-pipes
            (l (input output)
              (begin-thread (display (string-ascii->utf8 input-text) input) (close-port input))
              (begin-first (port->port output client) (close-port output)))
            path-hanzi-convert options #t #t #f))))))

(define (chinese-routes)
  (let*
    ( (program-path (program-paths-f program-dependencies))
      (path-hanzi-convert (program-path "hanzi-convert"))
      (hanzi-convert-route (hanzi-convert-route-f path-hanzi-convert)))
    (if path-hanzi-convert
      (processor-routes "chinese text conversions" "/chinese"
        (hanzi-convert-route "traditional" "simplified" #f #f "--simplify")
        (hanzi-convert-route "marks" "numbers"
          "convert pinyin with tone marks to syllables with suffixed numbers" #f "--numbers")
        (hanzi-convert-route "hanzi" "pinyin" "only accepts simplified characters" 1024 "--pinyin")
        (hanzi-convert-route "pinyin" "hanzi" "experimental" 256 "--hanzi"))
      null)))
