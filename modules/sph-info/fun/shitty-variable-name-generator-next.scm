(define-module (sph-info fun shitty-variable-name-generator))

(use-modules (srfi srfi-1) (rnrs io ports)
  (sph) (sph filesystem)
  (sph hashtable) (sph io)
  (sph list) (sph number) (sph other) (sph process) (sph string) (sph vector))

(export svn svn-multiple)
(define-syntax-rule (apply-modification? name) (random-boolean (ht-ref chances (q name))))
(define vowel "aeiou")
(define consonant "bcdfghjklmnpqrstvwxyz")
(define prefix-special "$_")
(define alphabet (string-append vowel consonant))

(define (random-string-from-set len character-string)
  (list->string (map-integers len (l (n) (string-ref-random character-string)))))

(define (create-prefix-random) (random-string-from-set (+ 1 (random 3)) alphabet))

(define (create-prefix-special)
  (list->string (make-list (+ 1 (random 2)) (string-ref-random prefix-special))))

(define (words-prefix a)
  (pair (if (apply-modification? prefix-special) (create-prefix-special) (create-prefix-random)) a))

(define (string-ref-random a) (string-ref a (random (string-length a))))

(define chances
  (ht-create-symbol-q vowel-removal 75
    consonant-removal 10
    uppercase 30
    prefix 2
    prefix-special 2
    shorten-word 35
    spaces-removal 35
    camelcase 75
    leet-transform 1
    insert-special-chars 1 random-case 1 swap-letters 1 reverse-substrings 1 introduce-typos 1))

(define settings (ht-create-symbol-q chance-deviation 1.4 chance-max-init-iterations 20))

(define (update-chances-one)
  (ht-map!
    (l (k v)
      (- 100
        (modulo (round ((if (random-boolean) + -) (ht-ref chances k) (/ (ht-ref chances k) 5))) 100)))
    chances))

(define (update-chances)
  (map-integers (random (ht-ref settings (q chance-max-init-iterations)))
    (l (n) (update-chances-one))))

(define (vowel-indices a) (map-with-index (l (i e) (string-index vowel e)) a))
(define (consonant-indices a) (map-with-index (l (i e) (string-index consonant e)) a))

(define (remove-one-random-vowel a-list)
  (let* ((indices (vowel-indices a-list)) (index-delete (+ 1 (random (- (length indices) 1)))))
    (delete #f (map-with-index (l (i e) (if (= i index-delete) #f e)) a-list))))

(define (remove-one-random-consonant a-list)
  (let* ((indices (consonant-indices a-list)) (index-delete (+ 1 (random (- (length indices) 1)))))
    (delete #f (map-with-index (l (i e) (if (= i index-delete) #f e)) a-list))))

(define (random-vowel-removal a) "string -> string"
  (list->string
    (delete #f
      (map-with-index
        (l (i e) (if (and (> i 0) (string-index vowel e) (apply-modification? vowel-removal)) #f e))
        (remove-one-random-vowel (string->list a))))))

(define (random-consonant-removal a) "string -> string"
  (list->string
    (delete #f
      (map-with-index (l (i e) (if (and (> i 0) (string-index consonant e) (random-boolean)) #f e))
        (remove-one-random-consonant (string->list a))))))

(define (shorten-word a)
  (let loop ((index (- (string-length a) 1)))
    (if (or (random-boolean) (< index (ht-ref settings (q minimum-word-length))))
      (substring a 0 (+ index 1)) (loop (- index 1)))))

(define (random-uppercase a) (if (apply-modification? uppercase) (map string-upcase a) a))

(define (leet-transform a)
  (list->string
    (map
      (lambda (c)
        (case c
          ((#\a #\A) (if (random-boolean) #\4 c))
          ((#\e #\E) (if (random-boolean) #\3 c))
          ((#\i #\I) (if (random-boolean) #\1 c))
          ((#\o #\O) (if (random-boolean) #\0 c))
          ((#\s #\S) (if (random-boolean) #\5 c))
          ((#\t #\T) (if (random-boolean) #\7 c))
          (else c)))
      (string->list a))))

(define special-chars "!@#$%^&*_-+=")

(define (insert-special-chars a)
  (list->string
    (apply append
      (map
        (lambda (c)
          (if (random-boolean)
            (list c (string-ref special-chars (random (string-length special-chars)))) (list c)))
        (string->list a)))))

(define (random-case a)
  (list->string
    (map (lambda (c) (if (random-boolean) (char-upcase c) (char-downcase c))) (string->list a))))

(define (swap-letters a)
  (let ((chars (string->list a)))
    (if (> (length chars) 1)
      (let* ((i (random (length chars))) (j (random (length chars))) (temp (list-ref chars i)))
        (set-car! (list-tail chars i) (list-ref chars j)) (set-car! (list-tail chars j) temp)
        (list->string chars))
      a)))

(define (reverse-substrings a)
  (let* ((chars (string->list a)) (len (length chars)))
    (if (> len 2)
      (let* ((start (random (- len 1))) (end (+ start (random (- len start)))))
        (append (take chars start) (reverse (take (drop chars start) (- end start)))
          (drop chars end)))
      chars)))

(define (reverse-substrings-str a) (list->string (reverse-substrings a)))

(define (introduce-typos a)
  (let ((chars (string->list a)))
    (if (> (length chars) 1)
      (let ((index (random (length chars))))
        (set-car! (list-tail chars index) (string-ref-random alphabet)) (list->string chars))
      a)))

(define (svn-word a) "string -> string"
  (fold (lambda (f a) (f a)) a
    (list (if (apply-modification? shorten-word) shorten-word identity)
      (if (apply-modification? consonant-removal) random-consonant-removal identity)
       (if (apply-modification? vowel-removal) random-vowel-removal identity)
      ; (if (apply-modification? leet-transform) leet-transform identity)
      ;(if (apply-modification? insert-special-chars) insert-special-chars identity)
      ; (if (apply-modification? random-case) random-case identity)
      ; (if (apply-modification? swap-letters) swap-letters identity)
      ; (if (apply-modification? reverse-substrings) reverse-substrings-str identity)
      ; (if (apply-modification? introduce-typos) introduce-typos identity)
      )))

(define (string-join-camelcase a) "list -> string"
  (if (null? a) "" (string-join (pair (first a) (map string-capitalize (tail a))) "")))

(define (string-join-underscore a) "list -> string" (string-join a "_"))

(define (join-words a)
  ( (if (apply-modification? camelcase) string-join-camelcase string-join-underscore)
    (if (apply-modification? prefix) (words-prefix (random-uppercase a)) (random-uppercase a))))

(define (randomly-delete-spaces a)
  (string-delete (l (e) (and (eqv? #\space e) (apply-modification? spaces-removal))) a))

(define (svn words-string)
  (let*
    ( (words-wo-spaces (randomly-delete-spaces words-string))
      (words (delete "" (string-split words-wo-spaces #\space))))
    (if (> (string-count words-wo-spaces #\space) 0) (ht-set! settings (q minimum-word-length) 1)
      (ht-set! settings (q minimum-word-length) 3))
    (join-words (map svn-word words))))

(define (svn-multiple count words) "integer string -> (string ...)"
  (update-chances)
  (let (words (string-trim words))
    (if (string-null? words) #f
      (let*
        ( (acceptable
            (compose
              (l (e)
                (let (words (string-split (string-downcase words) #\space))
                  (or (string-equal? e (string-join words "_"))
                    (string-equal? e (string-join words "")))))
              string-downcase))
          (create-names
            (nullary
              (delete-duplicates (remove acceptable (map-integers count (l (n) (svn words))))))))
        (let loop ((names (create-names)) (limit 10))
          (if (and (< (length names) count) (> limit 0))
            (loop (delete-duplicates (append (create-names) names)) (- limit 1)) names))))))
