# Portfolio Website — Pages & Routing

## Route Map

| URL | Page | Notes |
|---|---|---|
| `/` | Redirect to `/CV` | Home is unused; CV is the real landing page |
| `/CV` | CV Page | Default landing page |
| `/Projects` | Projects Grid | Lists all published projects |
| `/Projects/Get/{id}` | Project Detail | Full project page, `id` is an integer |

---

## Page: CV (`/CV`)

**Title:** `Curriculum Vitae - Youri Schuurmans`

**Layout:**
- Full-width `<h1>` heading (name), centered
- Circular profile photo, centered
- Two-column row below:
  - Left column (col-sm-6, text-right aligned): Experience section → About Me section
  - Right column (col-sm-6, border-left): Education section → Skills section → Contact section

**On load behavior:**
- Animate all skill bars from 0 to their target width over 2000ms

---

## Page: Projects Grid (`/Projects`)

**Title:** `Projects - Youri Schuurmans`

**Layout:**
- h2 heading "Projects"
- Full-width container with Masonry grid
- Grid columns: lg=4 per row, sm=3, xs=2, xxs=1
- Each card: image thumbnail, date, title (h2), short description

**On load behavior:**
- Initialize Masonry on `$(document).ready` and `$(window).load`
- Project cards have hover zoom effect (1.05x scale)

**Filtering:**
- Only projects with `shown = true` appear for public visitors
- Unpublished projects shown with gray background when logged in as admin

---

## Page: Project Detail (`/Projects/Get/{id}`)

**Title:** `Project - Youri Schuurmans`

**Layout:**
- If project has visuals: Camera.js carousel at top
- Below carousel (or at top if no visuals): content block
  - Date (small italic text)
  - Title (h2)
  - Short content (h4)
  - Full content (paragraph, HTML-rendered)

**On load behavior:**
- If visuals exist, initialize Camera.js carousel:
  - Height: 56% viewport
  - Effect: simpleFade
  - Auto-rotate: every 12 seconds
  - Show thumbnails: true
  - Pagination dots: false

---

## Browser / PWA Config

- `manifest.json`: app name "Youri", display standalone, theme #ffffff, bg #ffffff, icons 192x192 and 512x512
- `browserconfig.xml`: Windows tile color #2d89ef, image mstile-150x150.png
- Meta theme-color: `#ffffff`
- Safari pinned tab color: `#5bbad5`
