---
name: project-pages-writing
description: "Use when writing or revising new Hugo project pages for the YSchuurmans portfolio. Read the existing project entries, the project-pages story, and the content spec first; then mirror the established voice, front matter, and section structure."
---

# Project Pages Writing

Use this skill when creating a new project page for the Hugo portfolio site.

## What To Read First

Before writing anything, review:

- `Portfolio User Stories/3 - Project pages/story.md`
- `Portfolio Requirements/02-content.md`
- `Portfolio Requirements/03-pages-and-routing.md`
- A few existing project pages in `yschuurmans-hugo/content/projects/`

## Working Pattern

1. Identify the project facts from the source material or user request.
2. Match the existing project-page voice: concise first-person or project-summary prose, concrete details, and no marketing fluff.
3. Use the established Hugo front matter shape:
   - `title`
   - `displayDate`
   - `shortContent`
   - `priority`
   - `shown`
   - `headerImg`
   - `visuals` when images or media exist
4. Write the body as normal Markdown below the front matter.
5. Keep the page structure close to existing entries:
   - opening overview paragraph
   - short detail paragraphs
   - a small number of headings only when they add clarity
   - repository or external link at the end when relevant

## Style Rules

- Keep the tone factual, grounded, and specific.
- Describe what the project did, why it mattered, and what was built.
- Prefer short-to-medium paragraphs over long sectioned essays.
- Reuse the same vocabulary style as the existing pages: project scope, role, responsibilities, implementation, and outcome.
- Avoid invented claims, vague praise, and generic portfolio language.
- If the project has visuals, mention them through front matter rather than embedding them in the Markdown body.

## Layout And Styling Awareness

- Project content should fit the existing Hugo project-page layout rather than describing layout changes.
- Assume the site already renders the page title, date, short summary, content block, and carousel from the templates.
- Keep the content compatible with the modern Bootstrap-based design already used by the site.
- Do not introduce new styling conventions in the Markdown unless the page itself requires a special content block.

## Completion Check

A project page is ready when:

- the front matter fields are complete and valid YAML
- the title and date match the source material
- the summary is short and readable as card text
- the body reads like the existing project pages
- links and media references point to real assets
- the page feels consistent with the current portfolio tone and length

## Example Prompts

- "Write a new project page for X using the existing portfolio voice."
- "Turn these project notes into Hugo front matter and Markdown body."
- "Revise this project page so it matches the current project page style."
