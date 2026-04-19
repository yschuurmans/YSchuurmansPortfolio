# Portfolio Website — Data Models

These are the data structures needed to power the website. The current implementation stores everything in MySQL; a recreation can use any storage (JSON files, SQLite, Postgres, headless CMS, etc.).

---

## Entity: Project (Content)

Represents a single portfolio project.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Primary key, used in URL `/Projects/Get/{id}` |
| `title` | string (HTML) | May contain HTML markup |
| `shortContent` | string (HTML) | Brief description shown on card and as h4 on detail page |
| `contentText` | string (HTML) | Full description, rendered on detail page |
| `date` | string | Free-form date string e.g. "Q3 2020", "Since Q2 2016" |
| `shown` | boolean | If false, hidden from public; shown gray to admins |
| `priority` | integer | Display order (lower = shown first) |
| `headerImg` | Visual \| null | The thumbnail shown on the grid card |
| `visuals` | Visual[] | All media shown in the detail page carousel |

The `headerImg` is the first (or designated) visual for the card thumbnail. `visuals` is the full list used in the carousel.

---

## Entity: Visual

A media item attached to a project.

| Field | Type | Notes |
|---|---|---|
| `id` | integer | Primary key |
| `location` | string | Filename (for Photo) or video/GfyCat ID |
| `contentType` | enum | `Photo`, `Video`, `GfyCat` |

**ContentType behavior:**

| Type | `location` value | Thumbnail URL | Embed/Display |
|---|---|---|---|
| `Photo` | UUID filename, e.g. `abc123.png` | `/uploads/{location}` | `<img src="/uploads/{location}">` |
| `Video` | YouTube video ID, e.g. `dQw4w9WgXcQ` | `//img.youtube.com/vi/{location}/default.jpg` | `<iframe src="https://www.youtube.com/embed/{location}">` |
| `GfyCat` | GfyCat ID, e.g. `TameWildGoat` | `https://thumbs.gfycat.com/{location}-size_restricted.gif` | `<iframe src="https://gfycat.com/ifr/{location}">` |

---

## Entity: CVData

A single record representing the CV content. There is only one CV.

| Field | Type | Notes |
|---|---|---|
| `experienceText` | string (HTML) | Work experience entries |
| `educationText` | string (HTML) | Education entries |
| `aboutMeText` | string (HTML) | Personal bio |
| `skills` | dict\<string, int\> | Key = skill name, Value = percentage (0–100) |

**Skills** are stored as a JSON object, e.g.:
```json
{
  "C#": 90,
  ".NET ASP": 80,
  "Java": 80,
  "Python": 75,
  "Unity": 70,
  "JavaScript": 50,
  "PHP": 40
}
```

Skills are displayed sorted descending by value.

---

## Content Rules

- All rich-text fields (`title`, `shortContent`, `contentText`, `experienceText`, `educationText`, `aboutMeText`) may contain arbitrary HTML.
- Content may include `<code>` blocks styled by Google Code Prettify.
- Content may reference images as `<img class="ContentImg">` elements.
- Skills are always an integer percentage (0–100).
- Project `date` is a display string, not a machine-parseable date.
- Project `priority` controls display order; lower number appears first (or implement as a sorted list index).

---

## Storage Recommendation for Static Recreation

For a static or JAMstack recreation, content can be stored as:
- **CV data**: single YAML/JSON file
- **Projects**: one YAML/JSON file per project, or a single projects array file
- **Visuals**: referenced by filename/ID in the project data
- **Uploaded images**: kept in a `/public/uploads/` or `/static/uploads/` directory
