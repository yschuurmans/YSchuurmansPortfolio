# Portfolio Website — CLAUDE.md

## Project Overview

Personal portfolio website for Youri Schuurmans (yschuurmans.nl). The site is being rebuilt as a **Hugo static site** from the original ASP.NET MVC 5 / Razor / MySQL implementation.

The live site has three main pages:
- `/` → redirects to `/cv/`
- `/cv/` — two-column CV with experience, education, skills, and contact
- `/projects/` — masonry grid of project cards
- `/projects/{id}/` — individual project detail with image carousel

## Tech Stack

- **Generator**: Hugo (extended, no theme — all templates in `layouts/`)
- **CSS**: Bootstrap 3.4.1 (CDN) + custom `site.css`
- **Icons**: Font Awesome 4.7 (CDN)
- **Fonts**: Roboto via Google Fonts
- **JS**: jQuery 1.12.4, Bootstrap JS, Masonry.js, Camera.js (carousel)
- **Cookies**: cookieconsent2 v3.0.3
- **Hosting**: Cloudflare Pages / Netlify (static `_redirects` file)

## Repository Layout

```
portfoliowebsite/
├── CLAUDE.md                        # This file
├── YSchuurmans/                     # Original ASP.NET source (reference only)
├── Portfolio Requirements/          # Detailed requirement specs (9 files)
├── Portfolio User Stories/          # User story tracking (see below)
└── yschuurmans-hugo/                # Hugo project (created during story 1)
    ├── hugo.toml
    ├── content/
    ├── layouts/
    └── static/
```

## Requirements

All requirements are documented in `Portfolio Requirements/`:

| File | Contents |
|------|----------|
| `01-overview.md` | Site purpose, original tech stack, navigation |
| `02-content.md` | All page content (CV data, projects list, footer) |
| `03-pages-and-routing.md` | Routes, layouts, responsive behaviour |
| `04-ui-components.md` | 12 UI components with markup structure |
| `05-styling.md` | Color palette, typography, Bootstrap breakpoints |
| `06-data-models.md` | Project, Visual, and CVData entity schemas |
| `07-assets.md` | Images, favicon set, icon fonts, PWA manifest |
| `08-javascript-behavior.md` | Skill bars, hover zoom, Masonry, carousel, cookies |
| `09-media-types.md` | Photo / YouTube / GfyCat media handling |

Read the relevant requirement file(s) before implementing any feature.

## Development Commands

```bash
# Run dev server (from the Hugo project root)
hugo server -D
# Visit: http://localhost:1313/

# Build for production
hugo --minify
```

## Dev Server Rules

**The Hugo dev server runs at `http://localhost:1313/` and is managed by the user.**

- Do NOT start a new Hugo server, install Hugo, use Docker, or set up any alternative build environment.
- Use `http://localhost:1313/` as the live preview for verifying changes.
- If `localhost:1313` is not available or not responding, **ask the user to start it** (`hugo server -D` from `yschuurmans-hugo/`) rather than starting it yourself.
- File watching may be unreliable on WSL `/mnt/d/` — if changes don't appear, ask the user to restart the server.

## Development Team

**Always spawn a developer + tester agent team for any development work.**

- **Developer agent**: implements the changes (edits files, writes code)
- **Tester agent**: verifies all acceptance criteria against `http://localhost:1313/` once the developer is done

Use `TeamCreate` (or two `Agent` calls) to run them. The developer signals completion via `SendMessage` to the tester; the tester reports results back to the main conversation.

## User Story Tracking

Stories live in `Portfolio User Stories/`. Each story gets its own numbered folder:

```
Portfolio User Stories/
└── {N} - {short-descriptor}/
    ├── story.md       # Always present — goal, acceptance criteria, scope
    ├── progress.md    # Present while work is in progress
    └── delivered.md   # Added when the story is complete
```

**Lifecycle:**
1. Create `{N} - {short-descriptor}/story.md` when a story is defined
2. Create `progress.md` when work starts — track decisions, blockers, notes
3. Add `delivered.md` when done — summarise what was built and any deviations

## Key Design Decisions

- **No Hugo theme** — templates are written from scratch to match the original pixel-faithfully
- **Content as front matter** — CV data and project data live in Markdown front matter, not a database
- **CDN dependencies** — Bootstrap, Font Awesome, jQuery loaded from CDN (no local copies)
- **GfyCat deprecated** — GfyCat shut down in 2023; projects using it need media migration
- **Root redirect** — `/` → `/cv/` via `static/_redirects` (Cloudflare/Netlify) or meta-refresh fallback

## Style Reference

| Token | Value |
|-------|-------|
| Background | `#ebf7ff` |
| Navbar | `#ccecff` |
| `h1` | `#0047b3` |
| `h2` | `#003d99` |
| `h3` | `#002966` |
| `h4` | `#001433` |
| Skill bar fill | `#6adcfa` |
| Right column border | `1px solid #003380` |
| Body font | Roboto |
