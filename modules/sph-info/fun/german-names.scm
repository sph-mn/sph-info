(define-module (sph-info fun german-names))

(use-modules (sph) (sph alist)
  (sph-info fun phrase-generator) (sph hashtable) (sph lang config) (sph list) (sph list other))

(export display-german-names make-german-names sph-info-fun-german-names-description)

(define sph-info-fun-german-names-description
  "create funny german invented names that sound like animal/place/band-names.
   config format see the module (sph fun phrase-generator).
   this config creates too many similar words:
   (w1 \"ppel\" ((\"\" \"s\" \"n\" \"m\" \"f\" \"p\") (\"a\" \"o\" \"ü\"))) (p1 s1 p2 s2)
   (w1 (\"kk\" \"g\" \"gg\") ((\"h\" \"f\" \"m\" \"s\" \"sch\" \"n\" \"g\") (\"a\" \"o\" \"ö\" \"ü\" \"e\"))) ((p1 \"el\") (s1 \"ler\" \"er\") (s2 \"ler\" \"e\" \"er\"))")

(define config
  (q ("affe" ((p1 "n") (s2 "" "n"))
      "alpen" (p1 p2)
      "bacher" (s1)
      "franken" (p1)
      "hosen" (s2)
      "backen" (s2)
      "balg" (s2)
      "beisser" (s2)
      "berg" ((p1 "en") p2 (s1 "er"))
      "bier" (p2)
      "bogen" (p2)
      "otter" (s2)
      "borke" (s2)
      "bratz" ((p1 "en") (p2 "en") (s2 "e" "en"))
      "brei" (s2)
      "brenner" (s1)
      "buben" (s2)
      "burg" ((p1 "en") (p2 "") (s1 "er"))
      "bursch" ((s2 "en"))
      "bürzel" (s2)
      "dach" (p2)
      "docht" (p2)
      "dohle" (s2)
      "donner" (p1 s2)
      "dorfer" (s1)
      "drossel" (s2)
      "drücker" (s2)
      "dödel" (p1 p2 s2)
      "dörfer" (s1)
      "dümpel" (p1 s2)
      "espen" (p1)
      "feld" ((s1 "er") (p2))
      "felsen" (s2)
      "ferkel" (p2)
      "feuer" (p2)
      "fink" (s2)
      "finkel" (p1)
      "franzel" (p1 p2)
      "furt" ((s1 "er"))
      "fürsten" (p1 p2)
      "geier" (s2)
      "geissen" (p1)
      "gügen" (p1)
      "hauser" (s1)
      "heimer" (s1)
      "hinter" (p1 p2)
      "hinkel" (p1 p2)
      "horken" (p1)
      "hopfen" (p1 p2)
      "huber" (s1)
      "husen" (p1)
      "stipper" (s2)
      "häuser" (s1)
      "höcker" (p2)
      "höfer" (s1)
      "hühner" (s2)
      "hült" ((p1 "en") (s1 "er"))
      "ippen" (p1 p2)
      "jauch" ((s2 "e"))
      "knoten" (p1)
      "kunzel" (p1)
      "lach" (p2)
      "leier" (p2)
      "linger" (s1)
      "luder" (s2)
      "lumpen" (s2)
      "länder" (s1)
      "läuse" (s2)
      "möwen" (p1 p2 s2)
      "mürgen" (p1 p2)
      "neppel" (p1 p2)
      "nieder" (p1)
      "ober" (p1)
      "ochsen" (p1 p2 s2)
      "offel" (p1)
      "onkel" (p1)
      "poppel" (p1 p2)
      "popper" (s2)
      "proppen" (s2)
      "ruppel" (p1 p2)
      "saft" (p2)
      "schaufel" (p1)
      "schemmel" (p1 s2)
      "schluchten" (p2)
      "schmeckel" (p1)
      "dick" (p2)
      "schmuck" ((p1 "en" "") p2)
      "schwitzer" (s2)
      "silber" (p1 p2)
      "sippel" (p1 p2 s2)
      "seppel" (p2 s2)
      "sprochsel" (s2)
      "stein" (p2 (s1 "er"))
      "stelz" ((p1 "en") (s2 "e"))
      "stink" ((p1 "en") (p2 "e"))
      "stoffel" (p1)
      "straat" (p1 (s1 "er"))
      "stulz" ((p1 "en") (s1 "er"))
      "stätt" ((p1 "en") (s1 "er"))
      "sumpfel" (p1 p2)
      "suppen" (p2)
      "süffel" (p2)
      "sümpfel" (p1 p2)
      "taler" (s1)
      "trottel" (p2 s2)
      "tümp" ((p1 "el") (s1 "ler") (s2 "ler"))
      "tüten" (s2)
      "ulken" (p1)
      "ummen" (p1)
      "unger" (s1 p1)
      "duft" (p2)
      "pauken" (s2)
      "unter" (p1)
      "uppen" (p1 p2)
      "uter" (s1)
      "walder" (s1)
      "walz" ((s2 "er"))
      "wanz" ((p1 "en") (s2 "e"))
      "wipfel" (s2)
      "wurz" ((p1 "en" "el") s2)
      "wälder" (s1)
      "zapfen" (p2 s2)
      "zipfel" (p1 s2)
      "zipfler" (s2) "zung" ((p2 "en") (s2)) "ült" ((p1 "en") (s1 "er")) "gokkel" (p2 s2))))

(define make-german-names (two-words-getter (load-config config)))
(define (display-german-names count) (each display-line (make-german-names count)))
