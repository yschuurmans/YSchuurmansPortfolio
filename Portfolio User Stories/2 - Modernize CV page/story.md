# Story 2 — Modernize CV Page

## Goal

Refresh the `/cv/` page visually so it looks current and professional, while keeping all
existing content and preserving the established color palette (`#ebf7ff` background,
`#0047b3` / `#003d99` heading blues, `#6adcfa` skill bars).

The page currently uses Bootstrap 3.4.1 with a flat, utilitarian layout. The goal is a
design uplift — not a content change — that a visitor would notice immediately as more
polished.

## Scope

- `yschuurmans-hugo/layouts/_default/baseof.html` — upgrade Bootstrap 3 → Bootstrap 5
- `yschuurmans-hugo/layouts/cv/single.html` (or `_default/single.html`) — redesigned CV template
- `yschuurmans-hugo/static/css/site.css` — updated custom styles
- `yschuurmans-hugo/static/js/main.js` — update skill-bar JS if needed for Bootstrap 5

Out of scope: content changes, projects page, routing, Hugo config.

## Acceptance Criteria

1. **Bootstrap 5 upgrade** — Bootstrap 3.4.1 CDN links replaced with Bootstrap 5.3 CDN
   links (CSS + JS bundle). jQuery is no longer required for Bootstrap; remove jQuery CDN
   link unless used elsewhere (skill-bar animation uses it — keep if needed).

2. **Hero header** — The page opens with a full-width hero band (background `#003d99` or a
   subtle gradient from `#003d99` → `#0047b3`) containing the profile photo (circular,
   border white 3px), name `h1` in white, and the subtitle/tagline in a lighter weight.

3. **Card sections** — Each CV section (Experience, Education, Skills, Contact/About) is
   wrapped in a white `border-radius: 8px` card with a subtle `box-shadow` instead of the
   bare two-column layout.

4. **Skill bars** — Visual style preserved (`#6adcfa` fill, label + percentage), but bars
   animate in with a CSS transition when scrolled into view (Intersection Observer,
   no jQuery required — or retained jQuery if simpler).

5. **Timeline for Experience & Education** — Each entry is preceded by a left-border
   accent line (`3px solid #6adcfa`) giving a timeline feel, replacing the plain `<h3>` /
   `<h4>` rows.

6. **Responsive** — Layout is single-column on mobile (< 768 px) and two-column
   (left: photo + contact + skills, right: experience + education) on ≥ 768 px, using
   Bootstrap 5 grid classes.

7. **Navbar updated** — Navbar uses Bootstrap 5 markup (`navbar-expand-md`,
   `data-bs-toggle`, etc.). Brand and links remain identical in text/target.

8. **No broken CDN links** — All external stylesheet and script `<link>`/`<script>` tags
   resolve (Bootstrap 5, Font Awesome 4.7, Google Fonts Roboto, cookieconsent2 unchanged).

9. **Hugo build passes** — `hugo --minify` completes without errors from the
   `yschuurmans-hugo/` directory.

10. **Content parity** — Every data field present in the current CV (all experience
    entries, education entries, skills, contact details, about text) must appear in the
    modernized page.

## Definition of Done

- All 10 acceptance criteria verified by the tester against a `hugo server` live preview.
- `delivered.md` added to this story folder summarising what was built and any deviations.
