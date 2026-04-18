# Story 2 — Delivered

## Summary
Modernized the `/cv/` (rendered at site root; `_redirects` maps `/ → /cv/`) page: upgraded Bootstrap 3.4.1 → 5.3.3, redesigned template with a gradient hero band, white rounded cards, a left-border timeline for Experience and Education, and animated skill bars driven by Intersection Observer. No content changes.

## Files touched
- `yschuurmans-hugo/layouts/_default/baseof.html` — Bootstrap 5.3.3 CDN (CSS + bundle JS), Bootstrap 5 navbar (`navbar-expand-md`, `data-bs-toggle`, `data-bs-target`, `navbar-toggler`, `ms-auto`), added a `hero` template block, dropped jQuery, upgraded Roboto weights, set `theme-color` to `#003d99`.
- `yschuurmans-hugo/layouts/index.html` — rewrote the CV layout with hero header + two-column (`col-md-5 col-lg-4` / `col-md-7 col-lg-8`) card sections: Contact, Skills, About on the left; Experience and Education timelines on the right.
- `yschuurmans-hugo/static/css/site.css` — CSS variables for the palette; hero band with `linear-gradient(#003d99 → #0047b3)` + circular 3px white photo; `.cv-card` (white, 8px radius, soft shadow); `.cv-timeline-item` with `3px solid #6adcfa` left border + accent dot; flat skill bar track with gradient fill using CSS transition; Bootstrap 5 navbar re-themed to the existing `#ccecff` palette.
- `yschuurmans-hugo/static/js/main.js` — vanilla-JS Intersection Observer animates skill bar widths when ≥25% in view; legacy `.ZoomBlock` hover retained; no jQuery.

## Acceptance criteria
1. Bootstrap 5.3.3 CDN linked; jQuery removed. ✓
2. Full-width hero band with gradient, circular photo (3px white border), white name `h1`, lighter tagline. ✓
3. Each section wrapped in a white card with `border-radius: 8px` and soft box-shadow. ✓
4. Skill bars preserve `#6adcfa` fill, label + percentage; animate via CSS transition triggered by Intersection Observer. ✓
5. Experience and Education entries use a `3px solid #6adcfa` left-border timeline. ✓
6. Two-column on ≥768px (Bootstrap `col-md-*`), single-column below. ✓
7. Navbar uses Bootstrap 5 markup and preserves brand + link text/targets. ✓
8. External links (Bootstrap 5, Font Awesome 4.7, Google Fonts Roboto, cookieconsent2) all resolve. ✓
9. `hugo --minify` completes without errors. ✓
10. Content parity verified — all experience, education, skills, contact fields, and about text appear in the rendered HTML. ✓

## Deviations
- Skill bar markup restructured from the legacy `.skillbar-title / .skillbar-bar / .skill-bar-percent` three-div layout to a cleaner header (name + percent) + track/fill pair. Visual intent (`#6adcfa` fill, animated width, label and percentage) is preserved; the old markup would not fit the flat modern track style.
- Reordered sections on mobile: Contact and Skills come before Experience/Education to put high-signal data at the top on small screens.
- The old `.right-col` vertical divider (`1px solid #003380`) was dropped in favour of the card-based visual separation.
