# Story 3 — Project Pages

## Goal

Add full project support to the Hugo site: a Projects grid page listing all projects, and individual project detail pages. Implement two real projects with content, headings, and images. All pages must match the modern design introduced in Story 2 (Bootstrap 5, card style, site palette).

---

## Acceptance Criteria

### AC1 — Hugo content structure for projects
- A `content/projects/` section exists.
- Each project is a Markdown file. Front matter fields: `title`, `date`, `shortContent`, `priority`, `shown`, `headerImg`, and optionally `visuals` (list of image filenames). The full project description lives in the **Markdown body** (below `---`), rendered via `{{ .Content }}` — not as a front matter string.
- At least **two projects** are present with realistic content taken from `Portfolio Requirements/02-content.md`.

### AC2 — Project list page (`/projects/`)
- Route `/projects/` renders a masonry-style grid of project cards.
- Each card shows: header image (or placeholder), date, title (h3 or h4), and short description.
- Cards link to their detail page at `/projects/{slug}/`.
- Page `<title>` is `Projects - Youri Schuurmans`.
- Only projects with `shown: true` in front matter appear.

### AC3 — Project detail page (`/projects/{slug}/`)
- Route `/projects/{slug}/` renders the full project.
- Layout contains: date (small italic), title (h2), short content (h4), full content (rendered HTML/Markdown).
- If the project has `visuals`, a Bootstrap 5 carousel is rendered above the content block showing each image.
- Page `<title>` is `{Project Title} - Youri Schuurmans`.

### AC4 — Modern design on project list page
- Cards use the same `.cv-card` box-shadow and border-radius as Story 2 cards.
- Card hover applies a subtle scale transform (CSS only, no jQuery needed).
- The page has the same navbar (Bootstrap 5, fixed-top) and footer as the CV page.
- "Projects" nav link is marked `active` on this page.
- Background color matches the site palette (`#ebf7ff`).

### AC5 — Modern design on project detail page
- Content block uses the same `.cv-card` style.
- Carousel (if present) uses Bootstrap 5's native carousel component (`data-bs-ride="carousel"`) — **do not add Camera.js**.
- Carousel thumbnails are shown below the main carousel as a strip of clickable thumb images that jump to the relevant slide.
- The page has the correct navbar and footer.

### AC6 — Two seeded projects with images
- **Project 1: Alfam** — Use content from `02-content.md`. Header image and at least one carousel image provided (placeholder PNGs acceptable; real images preferred if available in `static/images/`).
- **Project 2: Predicting Potential Drug Lab Locations** — Use content from `02-content.md`. At minimum a header image. Full `contentText` should be a multi-sentence realistic description.
- Image files are placed in `static/images/projects/` and referenced correctly in front matter.

### AC7 — Hugo routing
- Hugo section list template is used for `/projects/` (e.g. `layouts/projects/list.html`).
- Hugo single template is used for `/projects/{slug}/` (e.g. `layouts/projects/single.html`).
- No 404 errors for either page or their assets.

### AC8 — Responsive layout
- On mobile (< 768 px) the project grid stacks to a single column.
- On tablet (≥ 768 px) the grid shows 2 columns; on desktop (≥ 992 px) 3 columns (Bootstrap 5 `col-md-6 col-lg-4`).
- Project detail page is readable at all breakpoints; carousel is full-width.

### AC9 — Clean Hugo build
- `hugo --minify` (run from `yschuurmans-hugo/`) completes with zero errors and zero warnings.
- No `WARN` lines about missing templates or front matter fields.

### AC10 — Nav active state
- On `/projects/` and `/projects/{slug}/`, the "Projects" nav link has the `active` class.
- On the CV page, "About" remains active.

---

## Scope / Out of Scope

**In scope:**
- `layouts/projects/list.html` — project grid
- `layouts/projects/single.html` — project detail
- `content/projects/*.md` — two project files
- `static/images/projects/` — header and carousel images for both projects
- CSS additions to `static/css/site.css` for project cards and carousel thumbnails
- Nav active-state fix in `layouts/_default/baseof.html` if needed

**Out of scope:**
- Admin/login functionality
- GfyCat or YouTube video embeds (images only for now)
- More than two projects
- Search or filtering

---

## Design Notes

- Follow the palette from `Portfolio Requirements/05-styling.md` and the token table in `CLAUDE.md`.
- Card header images should be `object-fit: cover` with a fixed height (~200px) to keep the grid tidy.
- Use Bootstrap 5 carousel (`id="projectCarousel"`) — **not** Camera.js.
- Thumbnail strip below carousel: small `<img>` elements (approx 80×50 px) that call `bootstrap.Carousel.getInstance(...).to(index)` on click, or use `data-bs-slide-to` attributes.
- Do NOT introduce jQuery; all JS should be vanilla or Bootstrap 5 built-ins.
