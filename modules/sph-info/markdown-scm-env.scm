(define-module (sph-info markdown-scm-env))

(import (srfi srfi-1) (srfi srfi-2)
  (sph) (sph filesystem)
  (sph time string) (sph time)
  (ice-9 i18n) (sph lang scheme)
  (sph libmagic) (sph list)
   (sph module)
  (sph string) (sph tree)
  (sph vector) (sph web publish helper) (sph web publish shtml) (sph web shtml))

(export sph-info-audio-playlist sph-info-audio-playlist-reverse
  sph-info-software-list sph-info-software-list-grouped sph-info-test-io)

(define (audio-playlist-file-title a)
  (remove-filename-extension (basename a) (list ".flac" ".wav" ".ogg" ".mp3")))

(define* (audio-playlist-shtml url title #:optional (attributes null))
  "string string -> sxml
   sxml for an html <object> tag"
  (qq
    (label (unquote (if title (list (q div) title) ""))
      (audio
        (@ (src (unquote url)) (preload "none") (controls "controls") (unquote-splicing attributes))
        ""))))

(define (sph-info-audio-playlist-content directory paths) "accepts file paths like link-files"
  (let*
    ( (content-dir (ensure-trailing-slash (dirname (dirname directory))))
      (paths (append-map (l (a) (filesystem-glob (string-append content-dir a))) paths)))
    (filter-map
      (l (a)
        (and (not (directory? a))
          (let (relative-path (string-append "/" (string-drop-prefix content-dir a)))
            (audio-playlist-shtml relative-path (audio-playlist-file-title relative-path)
              (list (list (q type) (or (first-or-false (file->mime-types a)) "")))))))
      paths)))

(define (sph-info-audio-playlist-shtml content)
  (qq
    (div (@ (class "audio-playlist")) (unquote-splicing content)
      (script
        "if(!window._audio_playlist_initialized){window._audio_playlist_initialized=true;const audios=document.querySelectorAll(\"audio\");function stopOtherAudios(current){audios.forEach(a=>{if(a!==current){a.pause();a.currentTime=0;}});}audios.forEach((a,i)=>{a.addEventListener(\"play\",()=>stopOtherAudios(a));a.addEventListener(\"ended\",()=>{const n=audios[i+1];if(n)n.play();});});}"))))

(define (sph-info-audio-playlist directory . paths) "accepts file paths like link-files"
  (sph-info-audio-playlist-shtml (sph-info-audio-playlist-content directory paths)))

(define (sph-info-audio-playlist-reverse directory . paths)
  (sph-info-audio-playlist-shtml (reverse (sph-info-audio-playlist-content directory paths))))

(define (test-io module-name test-name)
  "display a formatted textual representation of input and output for one test from a (sph test) test module.
   example: (sph-info-test-test-io (q (test module sph lang sc)) (q sc->c))"
  (or
    (and-let*
      ( (path
          (module-name->load-path-and-path module-name ".scm" %load-path (l (load-path path) path)))
        (test-lambda
          (tree-extract
            (l (a)
              (and (list? a) (not (null? a)) (eq? (q test-execute-procedures-lambda) (first a)) a))
            (file->datums path)))
        (test-io
          (tail
            (tree-extract (l (a) (and (list? a) (not (null? a)) (eq? test-name (first a)) a))
              test-lambda))))
      (list (q pre)
        (string-join
          (map-slice 2
            (l (in out)
              (string-append
                (if (list? in) (string-join (map any->string-write in) " ") (any->string-write in))
                "\n->\n" (string-trim-both (any->string out))))
            test-io)
          "\n\n")))
    "_"))

(define-syntax-rule (sph-info-test-io directory module-name test-name)
  (test-io (quote module-name) (quote test-name)))

(define (software-list-grouped-shtml heading-level csv-list)
  (map-apply
    (l (group-name . group-values)
      (shtml-section heading-level group-name
        (map
          (l (a)
            (apply
              (l* (name url #:optional (license "") (description ""))
                (pair (q div)
                  (interleave
                    (append (list (shtml-link url name))
                      (remove string-null? (list license description)))
                    " | ")))
              (tail (vector->list a))))
          group-values)))
    (group csv-list vector-first)))

(define (software-list-shtml csv-list) "(vector ...) -> shtml"
  (map
    (l (a)
      (apply
        (l* (name url #:optional (license "") (description ""))
          (pair (q div)
            (interleave
              (append (list (shtml-link url name)) (remove string-null? (list license description)))
              " | ")))
        (vector->list a)))
    csv-list))

(define (sph-info-software-list-grouped directory heading-level path)
  (vector path
    (software-list-grouped-shtml heading-level (swp-csv->list (string-append directory path)))))

(define (sph-info-software-list directory path)
  (software-list-shtml (swp-csv->list (string-append directory path))))
