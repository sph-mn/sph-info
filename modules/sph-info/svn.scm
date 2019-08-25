(library (sph-info svn)
  (export svn-respond)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph fun shitty-variable-name-generator)
    (sph list)
    (sph list other)
    (sph string)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web html))

  (define css (list "/css/sph.css"))
  (define trollface-image "/other/images/trollface.png")

  (define svn-respond
    (let*
      ( (slogans
          (list "for beginners and experienced users alike" "might improve performance"
            "highly usable" "readability"
            "it has always worked that way" "rich text coding is the future"
            "the only service that fulfills all your variable name needs" "splendid"
            "ready for the enterprise" "critical variable name solutions from the industry leader"
            "trust only the best" "become a programming guru"
            "generate cunning variable names with this simple trick" "in russia, variable names you"
            "typos are not a problem because of autocomplete" "the fascination of not knowing"
            "ignorance is bliss" "your colleagues will like you"
            "be awesome, amazing and whatnot" "disrupts the market"
            "from the cloud, for the cloud, at the cloud, in the cloud. cloud, cloud, cloud"
            "\"when i use a word, it means just what I choose it to mean - neither more nor less\""
            "as used by programmers with 30 years of industry experience"
            "makes programs easier to maintain because guessing is more fun"))
        (result-titles
          (list "get them before they are trademarked" "didn't the intern just use this one?"
            "variety is good" "why not use several"))
        (examples
          (list "index generator" "input validator"
            "buffer size" "position"
            "array length" "media loader"
            "submit button" "user name"
            "account id" "event handler" "error message" "get device name" "settings"))
        (button-text
          (list "get rich" "calculate"
            "let the results appear" "do the magic" "choose gate 3" "ask 100 people"))
        (function-name-prefix
          (list "do_" "do"
            "make_" "make"
            "doData" "process"
            "calc_" "reduce_" "flubulate_" "__" "" "" "" "" "" "" "" "" "" "" "" "" ""))
        (next-slogan (list-ref-randomise-cycle slogans))
        (next-result-title (list-ref-randomise-cycle result-titles))
        (next-button-text (list-ref-randomise-cycle button-text))
        (example-function-name-prefix (list-ref-randomise-cycle function-name-prefix))
        (example-code-string
          (string-join
            (list "let svn2 = svn5;" "for (let svn3 = 0; svn3 < svn4.length; ++svn3) {"
              "  svn2 += svn4[svn3];" "}" "svn1(svn6, 1);" "svn1(svn6, 2, svn7);")
            "\n"))
        (example-code
          (l (variable-names)
            (first
              (fold-multiple
                (l (a code index)
                  (list (string-replace-string code (string-append "svn" (number->string index)) a)
                    (+ 1 index)))
                (pair (example-function-name-prefix) variable-names) example-code-string 0))))
        (shtml-ui
          (l (words results)
            (let*
              ( (words (or words (list-ref-random examples))) (results (or results null))
                (results-shtml
                  (if (null? results) null
                    (pairs (q ul) (qq (@ (class "results") (title (unquote (next-result-title)))))
                      (map (l (a) (list (q li) a)) results))))
                #;(code-example
                  (if (null? results) ""
                    (let
                      (examples
                        (map svn (randomise (pair (list-ref-random results) (take* 6 examples)))))
                      (qq (div (@ (class code)) (pre (unquote (example-code examples)))))))))
              (qq
                (div (@ (class "svn")) (h1 "shitty variable name generator")
                  (h2 (unquote (next-slogan)))
                  (object
                    (@ (data (unquote trollface-image)) (width 122.5)
                      (height 100)
                      (title
                        (unquote
                          (list-ref-random
                            (list "dont mind me" "hey buddy" "only valid with this seal")))))
                    "")
                  (form (@ (action "svn") (class input) (method get))
                    (label (div "enter the words that should go into the name and press enter")
                      (input (@ (name words) (type text) (value (unquote words)) (size 40)))
                      (input (@ (type submit) (value (unquote (next-button-text)))))))
                  (unquote results-shtml)))))))
      (l (request)
        (let*
          ( (query (swa-http-request-query request))
            (words (false-if-exception (html-uri-decode (alist-ref query "words"))))
            (count (false-if-exception (string->number (alist-ref query "count"))))
            (results (and words (svn-multiple (or count 8) words))))
          (respond-shtml
            (shtml-layout (shtml-ui words results) #:body-class
              "svn" #:css css #:title "variable name generator")))))))
