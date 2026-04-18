# Story 3 — Progress

## Plan
- Create `content/projects/_index.md` with section title.
- Create `content/projects/alfam.md` and `content/projects/drug-lab-prediction.md` with full front matter.
- Create `layouts/projects/list.html` (masonry-style grid).
- Create `layouts/projects/single.html` (Bootstrap 5 carousel + content).
- Add CSS additions for project cards, hover zoom, carousel thumbnails.
- Generate placeholder SVG images for header/visuals.

## Decisions
- Used Bootstrap 5 grid (`col-md-6 col-lg-4`) for the project grid instead of CSS-columns masonry — keeps card heights aligned with `h-100` style and matches AC8's responsive breakpoint requirement exactly.
- Bootstrap 5 carousel + `data-bs-slide-to` thumbnails handle navigation natively; added a tiny vanilla listener in `main.js` (`initProjectCarouselThumbs`) so the thumb `.active` class syncs on slide change.
- Placeholder images are SVG to keep repo small while still rendering meaningfully.

## Files
- content/projects/_index.md
- content/projects/alfam.md
- content/projects/drug-lab-prediction.md
- layouts/projects/list.html
- layouts/projects/single.html
- static/css/site.css (appended Project list / Project detail blocks)
- static/js/main.js (added initProjectCarouselThumbs)
- static/images/projects/{alfam-header,alfam-visual-1,alfam-visual-2,drug-lab-header,drug-lab-visual-1}.svg
