# Story 1 — First iteration of CV page

## Goal

Recreate the `/cv/` page of yschuurmans.nl as a Hugo static site, pixel-faithfully matching the original ASP.NET MVC implementation.

## Scope

- Scaffold a new Hugo project (`yschuurmans-hugo/`) with no external theme
- Implement the base template (navbar, footer, CDN links, cookie consent)
- Implement the CV page template (two-column layout: experience + about left, education + skills + contact right)
- Animate skill bars on load (jQuery, 2000 ms)
- Copy required static assets (profile photo, favicon set)
- Set up root redirect (`/` → `/cv/`)

## Out of Scope

- Projects page and project detail pages (future stories)
- Admin interface
- Any backend or database

## Acceptance Criteria

- [ ] `hugo server -D` serves the CV at `http://localhost:1313/cv/`
- [ ] Navbar is fixed-top, background `#ccecff`, "About" link is active
- [ ] "Youri Schuurmans" h1 is centered, color `#0047b3`
- [ ] Circular profile photo (max 200 px tall) is centered below h1
- [ ] Left column: 6 experience entries (role h3, company — period h4, description p), right-aligned text
- [ ] Right column: left border `1px solid #003380`, 2 education entries
- [ ] 7 skill bars render and animate from 0 to full width over 2 seconds
- [ ] Contact section shows 4 Font Awesome icons with correct links
- [ ] Footer right-aligned: "© {current year} - Youri Schuurmans" and "v 1.2.3"
- [ ] Cookie consent banner appears at top (static, pushes content down)
- [ ] Page is responsive — columns stack on mobile (custom `col-xxs-12` breakpoint)

## Reference

See `hugo-cv-spec.md` in this folder for the complete, executable implementation specification.
