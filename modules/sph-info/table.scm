(define-module (sph-info table))

(use-modules (sph) (sph-info helper)
  (sph hashtable) (sph list)
  (sph string) (sph web app) (sph web app client) (sph web app http) (sph web shtml))

(export table-routes)

(define (shtml-ascii-table start end header?)
  (pairs (q table) (qq (@ (class "ascii")))
    (if header? (qq (tr (th dec) (th hex) (th ""))) "")
    (let loop ((index start))
      (if (<= index end)
        (let
          (row
            (list (string-drop (any->string-write (integer->char index)) 2)
              (number->string index 10) (number->string index 16)))
          (pair (pair (q tr) (map (l (a) (list (q td) a)) row)) (loop (+ 1 index))))
        (list)))))

(define (shtml-table-ascii route)
  (shtml-section 0 (route-title route)
    (list (list (q p) "name, decimal, hexadecimal") (q (br))
      (let ((step 32) (end 127))
        (let loop ((index 0))
          (if (<= index end)
            (pair (shtml-ascii-table index (min end (+ index step)) #f) (loop (+ 1 step index)))
            (list)))))))

(define (table-ascii-respond request)
  (sph-info-request-bind request (swa-env data route time-start routes)
    (respond-shtml
      (shtml-layout (shtml-table-ascii route) #:title
        (route-title route) #:body-class
        (route->body-class route) #:css
        (client-static swa-env (q css) (q (default table-ascii))) #:links default-links)
      (cache-headers time-start))))

(define table-routes (list (route-new "/ascii" "ascii table" table-ascii-respond)))
