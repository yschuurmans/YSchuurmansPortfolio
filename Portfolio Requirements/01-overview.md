# Portfolio Website — Overview

## Purpose
Personal portfolio for Youri Schuurmans. Showcases professional history (CV) and software/game development projects. Publicly readable; content is managed via a private admin interface.

## Current Tech Stack (to be replaced)
| Layer | Technology |
|---|---|
| Language | C# (.NET Framework 4.5.2) |
| Framework | ASP.NET MVC 5.2.3 |
| View engine | Razor (.cshtml) |
| Database | MySQL (via MySql.Data NuGet) |
| Auth | Custom PCAuthLib DLL |
| CSS framework | Bootstrap 3.0.0 |
| Icons | Font Awesome (local) |
| JS utilities | jQuery 1.10.2, jQuery UI, Masonry.js, Camera.js |
| Font | Roboto via Google Fonts |
| Analytics | Microsoft Application Insights |
| Hosting | Windows IIS (inferred from Web.config) |

## Site Version
`v 1.2.3` — displayed in footer.

## Navigation Structure

```
yschuurmans.nl/          → redirects to /CV
yschuurmans.nl/CV        → CV page (default landing page)
yschuurmans.nl/Projects  → Projects grid
yschuurmans.nl/Projects/Get/{id}  → Individual project detail
```

Navbar brand "Youri Schuurmans" links to `/CV`.

## Pages Summary
| Page | Route | Description |
|---|---|---|
| CV | `/CV` | Profile, experience, education, skills, contact |
| Projects | `/Projects` | Masonry grid of all published projects |
| Project Detail | `/Projects/Get/{id}` | Full project page with carousel |

## Admin Pages (not required for recreation as a public site)
| Page | Route |
|---|---|
| CV Edit | `/CV/Edit` |
| Project Edit | `/Projects/Edit?ID={id}` |
| Project Reorder | `/Projects/Reorder` |
| Login | `/Login` |
