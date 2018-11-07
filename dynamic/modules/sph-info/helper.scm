(library (sph-info helper)
  (export
    respond-shtml
    shtml-layout)
  (import
    (guile)
    (sph)
    (sph io)
    (sph list)
    (sph time)
    (sph time string)
    (sph web app http)
    (sph web shtml)
    (sxml simple))

  (define* (respond-shtml shtml #:optional (headers null))
    (respond 200 (pair "content-type:text/html\r\n" headers)
      (l (client) (put-string client "<!doctype html>") (sxml->xml shtml client))))

  (define (shtml-page-mtime mtime) "integer:utc-seconds -> sxml"
    (qq
      (div (@ (class mtime) (title "last modification time of the current page"))
        (unquote (utc->ymd (s->ns mtime))))))

  (define* (shtml-top-bar link-data)
    "((name path) ...) -> shtml
     create a top navigation bar with link to index.html and feed.xml if the files exist"
    (let (links (interleave (map-apply shtml-hyperlink link-data) ", "))
      (if (null? links) null (pair (q nav) links))))

  (define*
    (shtml-layout content #:key (title "") (css null) (js null) head body-class top bottom links
      mtime)
    (let
      ( (top-bar (and links (shtml-top-bar links)))
        (page-mtime (and mtime (shtml-page-mtime mtime))))
      (qq
        (html
          (head (title (unquote title)) (unquote-splicing (map shtml-include-css css))
            (meta (@ (name "viewport") (content "width=device-width,initial-scale=1")))
            (unquote head))
          (body (unquote (if body-class (qq (@ (class (unquote body-class)))) null))
            (unquote
              (if (or top-bar top)
                (qq (div (@ (class top)) (unquote (or top-bar "")) (unquote (or top "")))) null))
            (unquote
              (if (or mtime content)
                (qq
                  (div (@ (class "middle")) (unquote (or page-mtime "")) (unquote (or content ""))))
                null))
            (unquote (if bottom (qq (div (@ (class bottom)) (unquote bottom))) null))
            (unquote-splicing (map shtml-include-javascript js))))))))
