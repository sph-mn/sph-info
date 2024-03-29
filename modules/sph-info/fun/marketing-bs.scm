(define-module (sph-info fun marketing-bs))

(use-modules (srfi srfi-1) (ice-9 regex)
  (sph) (sph filesystem)
  (sph hashtable) (sph io)
  (sph list) (sph alist)
  (sph list other) (sph number) (sph other) (sph process) (sph string) (sph vector))

(export display-marketing-bs make-marketing-bs)

(define noun
  (vector "silos" "services"
    "findability" "activity monitoring"
    "frameworks" "mediation"
    "orchestration" "bean binding"
    "delivery" "aggregation"
    "transformation" "architecture"
    "association teardown" "technology"
    "marketing" "integration"
    "microservice" "information superhighways"
    "value-add" "mashups"
    "mindshare" "datafication"
    "data mining" "innovation"
    "tooling" "web services"
    "synergies" "strategies"
    "ecosystem" "analytics"
    "return of investment" "master-data management"
    "service buses" "data warehouse"
    "point-to-point channels" "pipelines" "big data" "backporting" "logic" "big data" "provisioning"))

(define synonym-with (list "by" "with" "through" "via"))

(define goal-source
  (list "beat the competition" "become a key market player"
    "control strategic metrics" "disrupt the market"
    "increase sales" "grow your business" "grow shareholder value" "take the lead"))

(define goal (list->vector goal-source))
(define goal-prefix (list->vector (produce (l a (string-join a " ")) goal-source synonym-with)))

(define verb
  (vector "access" "build"
    "create" "deliver"
    "develop" "empower"
    "enable" "extend"
    "facilitate" "harness"
    "improve" "increase"
    "invest into" "kick-start"
    "leverage" "manage"
    "obtain" "offer" "provide" "revolutionize" "streamline" "successfully market" "upgrade"))

(define combinator (vector "and" "by" "by using" "for" "over" "through" "under" "with" "with"))

(define predicative-adjective
  (vector "agility" "alignment"
    "backlogs" "chaining" "competence" "integration" "management" "processing" "rules" "wizard"))

(define adjective
  (vector "cloud" "enterprise-ready"
    "variable" "all"
    "handcrafted" "object-oriented"
    "high-quality" "ground-breaking"
    "mind-boggling" "simple, proven"
    "agile" "highly durable"
    "continuous" "best of breed"
    "hyperlocal" "beautiful"
    "high-volume" "integrated"
    "awesome" "omnichannel"
    "holistic" "game-changing"
    "flexible" "multi-domain"
    "project-driven" "data-driven"
    "deep dive" "disruptive"
    "modern" "connectivity"
    "better" "instant-value"
    "user-oriented" "core"
    "next-generation" "multi-dimensional"
    "rock-solid" "social"
    "seamless" "first-class"
    "lightweight" "full-stack"
    "powerful" "new"
    "best-in-class" "integrated"
    "unmatched" "leading"
    "real-time" "responsive"
    "holistic" "break-through"
    "bullet-proof" "best-of-breed"
    "buzzword compliant" "world-class"
    "business" "business"
    "business" "an enterprise"
    "enterprise" "an enterprise"
    "enterprise" "enterprise"
    "data" "cloud-based"
    "dynamic" "elegant"
    "ultra-fast" "high-throughput"
    "cohesive" "multi-channel"
    "hybrid" "service oriented"
    "enterprise" "multiple" "very complex" "premium" "confident" "embedabble"))

(define (random-choice . a) (list-ref-random a))

(define patterns
  (list->vector
    (let*
      ( (source
        (list (list verb "and" verb noun "to" goal "with" adjective noun)
          (list adjective noun predicative-adjective combinator adjective noun)
          (list verb "your" adjective noun "and" verb adjective noun)
          (list verb noun predicative-adjective "and" verb adjective noun predicative-adjective)
          (list noun noun combinator noun predicative-adjective)))
        (source+goal (map (l (a) (if (eq? verb (first a)) (append a (list "and" goal)) a)) source)))
      (append source source+goal))))

(define (random-vector-ref v) (vector-ref v (max 0 (- (random (vector-length v)) 1))))

(define (get-unused words use-list)
  (let
    loop
    ((a (random-vector-ref words)) (tries 20))
    (if (or (not (contains? use-list a)) (< tries 0)) a
      (loop (random-vector-ref words) (- tries 1)))))

(define words->use-list-name
  (let
    (table
      (alist noun (q noun)
        verb (q verb)
        adjective (q adjective)
        goal-prefix (q goal-prefix)
        goal (q goal) predicative-adjective (q predicative-adjective) combinator (q combinator)))
    (l (words) "vector -> symbol" (alistq-ref table words))))

(define (get-use-list words use-lists) "vector list -> list"
  (or (alist-ref use-lists (words->use-list-name words)) null))

(define (use-list-add words v use-lists)
  (alist-set! use-lists (words->use-list-name words)
    (pair v (alistv-ref use-lists (words->use-list-name words)))))

(define (fix-a-an words)
  (append
    (map-segments 2 (l (a b) (if (and (string-equal? "a" a) (string-match "^[aeiou]" b)) "an" a))
      words)
    (list (last words))))

(define (compress-commas a) "string -> string" (string-replace-string a " ," ","))

(define (create-patterns use-lists c)
  (let
    loop
    ((pattern (random-vector-ref patterns)) (result null) (use-lists use-lists))
    (if (null? pattern)
      (c (compress-commas (string-join (fix-a-an (remove string-null? (reverse result)))))
        use-lists)
      (let
        (words (first pattern))
        (if (string? words) (loop (tail pattern) (pair words result) use-lists)
          (let
            (word (get-unused words (get-use-list words use-lists)))
            (loop (tail pattern) (pair word result) (use-list-add words word use-lists))))))))

(define (make-use-lists)
  (alist-q noun null
    goal-prefix null goal null verb null adjective null predicative-adjective null combinator null))

(define (make-marketing-bs count)
  (let
    loop
    ((n 0) (use-lists (make-use-lists)) (result null))
    (if (> count n)
      (create-patterns use-lists
        (l (pattern use-lists) (loop (+ n 1) use-lists (pair pattern result))))
      result)))

(define (display-marketing-bs count) (each display-line (make-marketing-bs count)))
