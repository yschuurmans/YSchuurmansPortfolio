# YSchuurmans Portfolio Agent Guide

Start here before making changes:

1. Read [CLAUDE.md](CLAUDE.md) for project overview, workflow, and dev-server rules.
2. Read the relevant spec in [Portfolio Requirements](Portfolio%20Requirements/).
3. If the work belongs to an existing story, read the matching folder in [Portfolio User Stories](Portfolio%20User%20Stories/).

## Source Of Truth

- Follow [CLAUDE.md](CLAUDE.md) when it conflicts with other docs about workflow.
- Treat [Portfolio Requirements/](Portfolio%20Requirements/) as the source of truth for product behavior and content.
- Use [YSchuurmans/](YSchuurmans/) only as legacy reference material from the original ASP.NET implementation.

## Working Rules

- Work in [yschuurmans-hugo/](yschuurmans-hugo/); do not add features to the legacy ASP.NET app.
- Do not start a new dev server or Docker stack. The user manages the Hugo server at `http://localhost:1313/`.
- If `localhost:1313` is unavailable, ask the user to start `hugo server -D` from [yschuurmans-hugo/](yschuurmans-hugo/).
- Prefer small, focused edits that preserve the current Bootstrap 5 and vanilla-JS implementation.

## Primary Edit Paths

- CV content: [yschuurmans-hugo/content/_index.md](yschuurmans-hugo/content/_index.md)
- Project content: [yschuurmans-hugo/content/projects/](yschuurmans-hugo/content/projects/)
- Shared shell: [yschuurmans-hugo/layouts/_default/baseof.html](yschuurmans-hugo/layouts/_default/baseof.html)
- CV template: [yschuurmans-hugo/layouts/index.html](yschuurmans-hugo/layouts/index.html)
- Project templates: [yschuurmans-hugo/layouts/projects/](yschuurmans-hugo/layouts/projects/)
- Styles: [yschuurmans-hugo/static/css/site.css](yschuurmans-hugo/static/css/site.css)
- Scripts: [yschuurmans-hugo/static/js/main.js](yschuurmans-hugo/static/js/main.js)
- Redirects and site assets: [yschuurmans-hugo/static/](yschuurmans-hugo/static/)

## Implementation Conventions

- The site is a Hugo static site with hand-written templates; there is no theme and no database.
- Current frontend stack is Bootstrap 5 plus vanilla JavaScript. Do not reintroduce jQuery unless the task explicitly requires it.
- Keep design consistent with Story 2 and Story 3: modern card-based layout, existing palette, existing typography, and existing navbar/footer patterns.
- Store CV and project data in front matter plus Markdown content, matching the existing content structure.

## Known Pitfalls

- [yschuurmans-hugo/README.md](yschuurmans-hugo/README.md) documents Docker workflows, but agent workflow should follow the user-managed Hugo server rule in [CLAUDE.md](CLAUDE.md).
- Requirement docs describe legacy ASP.NET routes such as `/CV` and `/Projects/Get/{id}`. The Hugo site uses lowercase routes such as `/cv/` and `/projects/{slug}/`.
- Requirement docs mention legacy libraries such as Camera.js and jQuery. The current Hugo implementation uses Bootstrap 5 components and vanilla JavaScript instead.
- GfyCat is deprecated. If a task touches old media handling, verify the current Hugo representation before implementing anything from the legacy model docs.

## Requirement Map

- Routing and page structure: [Portfolio Requirements/03-pages-and-routing.md](Portfolio%20Requirements/03-pages-and-routing.md)
- Content and seeded copy: [Portfolio Requirements/02-content.md](Portfolio%20Requirements/02-content.md)
- UI structure: [Portfolio Requirements/04-ui-components.md](Portfolio%20Requirements/04-ui-components.md)
- Styling tokens and layout rules: [Portfolio Requirements/05-styling.md](Portfolio%20Requirements/05-styling.md)
- Data model expectations: [Portfolio Requirements/06-data-models.md](Portfolio%20Requirements/06-data-models.md)
- JS behaviors and legacy interaction references: [Portfolio Requirements/08-javascript-behavior.md](Portfolio%20Requirements/08-javascript-behavior.md)
- Media handling notes: [Portfolio Requirements/09-media-types.md](Portfolio%20Requirements/09-media-types.md)

## Story Workflow

- Story folders live in [Portfolio User Stories/](Portfolio%20User%20Stories/).
- Use `story.md` for scope and acceptance criteria.
- Use `progress.md` while work is in progress.
- Use `delivered.md` to confirm what was actually implemented and any deliberate deviations.
