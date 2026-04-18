# Story 1 — Delivered

## What was built

Full Hugo CV page implementation at `yschuurmans-hugo/`, pixel-faithfully matching the original ASP.NET MVC site.

All 11 acceptance criteria verified against a real Hugo 0.128.0 extended build.

## Files created

| File | Purpose |
|---|---|
| `hugo.toml` | Site config with baseURL, title, disableKinds |
| `content/cv/index.md` | All CV data in front matter (experience, education, skills, contact, about) |
| `layouts/_default/baseof.html` | Base shell: head, CDN links, navbar, footer, cookie consent |
| `layouts/_default/single.html` | CV page template (two-column layout, skill bars, FA icons) |
| `static/css/site.css` | Custom styles matching original (colors, mugshot, skillbar, col-xxs-12 breakpoint) |
| `static/js/main.js` | Hover zoom handler for future Projects page |
| `static/_redirects` | Cloudflare/Netlify redirect: `/` → `/cv/` 301 |
| `static/index.html` | Meta-refresh fallback for root redirect |
| `static/images/foto.jpg` | Profile photo (copied from YSchuurmans/) |
| `static/` favicon set | favicon.ico, 16/32px PNGs, apple-touch-icon, android-chrome, mstile, safari SVG |
| `static/manifest.json` | PWA manifest |
| `static/browserconfig.xml` | IE/Edge tile config |

## Deviations from spec

- **Template path corrected**: `hugo-cv-spec.md` specifies `layouts/cv/single.html` but Hugo's lookup rules for a leaf bundle (kind=page) require `layouts/_default/single.html`. Template was placed at the correct path.
- **`disableKinds` simplified**: Spec-suggested `["taxonomy", "taxonomyTerm"]` triggers a deprecation warning in Hugo 0.128+. Changed to `["taxonomy"]`.

## Known non-blocking items (future stories)

- No `layouts/index.html` — Hugo warns about missing home layout. Harmless because `static/index.html` overrides it, but a trivial template would silence the warning.
