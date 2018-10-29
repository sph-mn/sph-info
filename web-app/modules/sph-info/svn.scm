(library (sph-info svn)
  (export
    svn-respond)
  (import
    (guile)
    (sph)
    (sph-info helper)
    (sph alist)
    (sph fun shitty-variable-name-generator)
    (sph list)
    (sph list other)
    (sph random-data)
    (sph string)
    (sph web app)
    (sph web app client)
    (sph web app http)
    (sph web html))

  (define svn-respond
    (let*
      ( (slogans
          (list "newbie friendly" "business performance optimised"
            "might increase program efficiency" "highly usable"
            "readability" "it has always worked that way"
            "the only service that fulfills all your variable name needs"
            "write your code in a rich text editor and use all the formatting options" "splendid"
            "ready for the enterprise" "critical variable name solutions from the industry leader"
            "trust only the best" "leverage powerful variable names"
            "become a programming guru" "generate cunning variable names with this simple trick"
            "in russia, variable names you" "typos are no problem because of autocomplete"
            "\"genius!\" - a magazine" "known from tv and radio"
            "the fascination of not knowing" "ignorance is bliss"
            "your colleagues will like you" "be awesome, amazing, and whatnot"
            "disrupts the market"
            "from the cloud, for the cloud, at the cloud, in the cloud. cloud, cloud, cloud"
            "\"when i use a word, it means just what I choose it to mean - neither more nor less\""
            "as used by programmers with 30 years of industry experience"
            "makes programs easier to maintain because guessing is more fun"))
        (result-titles
          (list list "no animals were harmed in the making of these names"
            "get them before they are trademarked" "didn't the intern just use this one?"
            "diversity is good" "why not use several"))
        (examples
          (list "index generator" "input validator"
            "buffer size" "position"
            "array length" "media loader"
            "user name" "account id" "event handler" "error message" "get device name" "settings"))
        (button-text
          (list "save $2" "get rich"
            "calculate" "let the results appear" "do the magic" "choose gate 3" "ask 100 people"))
        (function-name-prefix
          (list "do_" "do"
            "make_" "make"
            "doData" "process"
            "calc_" "reduce_" "flubulate_" "__" "" "" "" "" "" "" "" "" "" "" "" "" ""))
        (next-slogan (list-ref-randomise-cycle slogans))
        (next-button-text (list-ref-randomise-cycle button-text))
        (example-function-name-prefix (list-ref-randomise-cycle function-name-prefix))
        (example-code-string
          (string-join
            (list "function svn0svn1() {" "  var svn2 = svn5;"
              "  for (var svn3 = 0; svn3 < svn4.length; ++svn3) {" "    svn2 += svn4[svn3];"
              "  }" "  return svn2;" "}" "svn1(svn6, 1);" "svn1(svn6, 2, svn7);")
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
          (l (ref content)
            (let*
              ( (words (or (ref (q words)) (list-ref-random examples)))
                (results (or (ref (q results)) null))
                (results-shtml
                  (pairs (q ul) (q (@ (class "results"))) (map (l (a) (list (q li) a)) results)))
                (code-example
                  (if (null? results) ""
                    (let
                      (examples
                        (map svn (randomise (pair (list-ref-random results) (take* 6 examples)))))
                      (qq (div (@ (class code)) (pre (unquote (example-code examples)))))))))
              (qq
                (div (@ (class "svn")) (h1 "shitty variable name generator")
                  (h2 (unquote (next-slogan)))
                  (object
                    (@ (data "/other/images/trollface.png") (width 122.5)
                      (height 100)
                      (title
                        (unquote
                          (list-ref-random
                            (list "do not mind me" "hey buddy" "only valid with this seal")))))
                    "")
                  (form (@ (action "svn") (class input) (method get))
                    (label (div "enter the words that should go into the name and press enter")
                      (input (@ (name words) (type text) (value (unquote words)) (size 40)))
                      (input (@ (type submit) (value (unquote (next-button-text)))))))
                  (unquote results-shtml) (unquote code-example)))))))
      (l (request)
        (let*
          ( (swa-env (swa-http-request-swa-env request)) (query (swa-http-request-query request))
            (words (false-if-exception (html-uri-decode (alist-ref query "words"))))
            (count (false-if-exception (string->number (alist-ref query "count"))))
            (results (and words (svn-multiple (or count 5) words))))
          (respond-html request
            (alist-q body-class "svn"
              css (list "/css/sph.css") title "variable name generator" words words results results)
            (q sph-info) (list (list shtml-layout shtml-ui))))))))
