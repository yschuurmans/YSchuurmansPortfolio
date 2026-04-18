# Hugo CV Page — Implementation Specification

Recreate the `/CV` page of yschuurmans.nl as a Hugo static site. This document is a complete, executable specification: follow it top-to-bottom to build a pixel-faithful reproduction.

---

## 1. Prerequisites & Setup

```bash
# Install Hugo (extended version required for SCSS if used later)
# macOS:  brew install hugo
# Linux:  snap install hugo --channel=extended
# Windows: winget install Hugo.Hugo.Extended

# Scaffold the project
hugo new site yschuurmans-hugo
cd yschuurmans-hugo
```

No theme is used — all templates are written from scratch in `layouts/`.

---

## 2. Final Directory Structure

```
yschuurmans-hugo/
├── hugo.toml                        # Site configuration
├── content/
│   └── cv/
│       └── index.md                 # CV page content & structured data
├── layouts/
│   ├── _default/
│   │   └── baseof.html              # Base HTML shell (head, navbar, footer)
│   └── cv/
│       └── single.html              # CV page template
├── static/
│   ├── css/
│   │   └── site.css                 # Custom styles (faithful to original)
│   ├── js/
│   │   └── main.js                  # Skill bar animation + hover zoom
│   └── images/
│       └── foto.jpg                 # Profile photo (copy from YSchuurmans/images/)
└── public/                          # Generated output (git-ignored)
```

---

## 3. `hugo.toml` — Site Configuration

```toml
baseURL = "https://yschuurmans.nl/"
languageCode = "en-us"
title = "Youri Schuurmans"

# Serve CV as the home page by redirecting root to /cv
# (handled via _redirects or server config — see section 9)
```

---

## 4. `content/cv/index.md` — Page Content & Data

All structured CV data lives in the front matter. The page body (`.Content`) is empty — the template renders everything from `.Params`.

```yaml
---
title: "Curriculum Vitae"
layout: "single"

params:
  experience:
    - role: "Software Engineering Consultant"
      company: "Info Support"
      period: "2019–Present"
      description: "Assists clients in resolving business challenges via IT solutions, managing projects from conception through implementation and maintenance."
    - role: "Intern Software Engineer"
      company: "Info Support"
      period: "2019"
      description: 'Created a tool designed to "increase awareness of new technologies and advancements in fields Info Support is interested in" during graduation internship.'
    - role: "Backend Developer"
      company: "Bookerz"
      period: "2018–2019"
      description: "Contributed to diverse development projects serving both external clients and internal organizational needs."
    - role: "Intern Game Developer"
      company: "Blewscreen"
      period: "2017–2018"
      description: "Refined existing projects for release, collaborating on serious games featuring alternative input methods."
    - role: "Freelance Web Developer"
      company: "Bronverbinding"
      period: "2017"
      description: "Developed backend infrastructure for event registration website while coordinating with frontend specialist."
    - role: "Programmer / General IT Support"
      company: "DDC Europe"
      period: "2016–2017"
      description: "Debugged code during PHP 5-to-7 migration while improving future compatibility."

  about: >
    My favourite hobby is discovering things about computers, how we make them do what we do.
    It has always been my ambition to create things for people to use and enjoy.

  education:
    - degree: "HBO-ICT — Software Engineering"
      institution: "Fontys Hogescholen"
      period: "2015–2019"
    - degree: "HAVO — Natuur/Techniek profile"
      institution: "Titus Brandsma Lyceum"
      period: "2008–2015"

  skills:
    - name: "C#"
      percent: 90
    - name: ".NET ASP"
      percent: 80
    - name: "Java"
      percent: 80
    - name: "Python"
      percent: 75
    - name: "Unity"
      percent: 70
    - name: "JavaScript"
      percent: 50
    - name: "PHP"
      percent: 40

  contact:
    name: "Youri Schuurmans"
    email: "yourish@live.nl"
    website: "https://www.yschuurmans.nl"
    website_display: "yschuurmans.nl"
    github: "https://github.com/yschuurmans/"
    github_display: "github.com/yschuurmans"
    linkedin: "https://www.linkedin.com/in/yschuurmans/"
    linkedin_display: "linkedin.com/in/yschuurmans"
---
```

---

## 5. `layouts/_default/baseof.html` — Base Template

This defines the shared HTML shell: `<head>`, navbar, content slot, and footer.

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>{{ block "title" . }}{{ .Title }} - Youri Schuurmans{{ end }}</title>

  <!-- Bootstrap 3 CDN (matches original) -->
  <link rel="stylesheet"
    href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

  <!-- Font Awesome 4 CDN (matches original icon names: fa-envelope etc.) -->
  <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

  <!-- Google Fonts: Roboto -->
  <link rel="stylesheet"
    href="https://fonts.googleapis.com/css?family=Roboto">

  <!-- Custom styles -->
  <link rel="stylesheet" href="/css/site.css">

  <!-- Favicon set -->
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
  <link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
  <link rel="manifest" href="/manifest.json">
  <meta name="theme-color" content="#ffffff">

  <!-- Cookie consent (cookieconsent2 v3.0.3) -->
  <link rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.css">
  <script
    src="https://cdnjs.cloudflare.com/ajax/libs/cookieconsent2/3.0.3/cookieconsent.min.js"></script>
  <script>
    window.addEventListener("load", function() {
      window.cookieconsent.initialise({
        palette: {
          popup: { background: "#edeff5", text: "#838391" },
          button: { background: "#4b81e8" }
        },
        position: "top",
        static: true,
        content: {
          message: "This website uses cookies to ensure you get the best experience on our website. By continuing to browse the site you are agreeing to our use of cookies.",
          dismiss: "Dismiss"
        }
      });
    });
  </script>

  {{ block "head" . }}{{ end }}
</head>
<body>

<!-- Fixed-top navbar -->
<div id="navbarddiv" class="navbar navbar-default navbar-fixed-top">
  <div class="container">
    <div class="navbar-header">
      <button type="button" class="navbar-toggle"
        data-toggle="collapse" data-target=".navbar-collapse">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
      </button>
      <a class="navbar-brand" href="/cv/">Youri Schuurmans</a>
    </div>
    <div class="navbar-collapse collapse">
      <ul class="nav navbar-nav navbar-right">
        <li{{ if eq .RelPermalink "/cv/" }} class="active"{{ end }}>
          <a href="/cv/">Curriculum Vitae</a>
        </li>
        <li{{ if eq .Section "projects" }} class="active"{{ end }}>
          <a href="/projects/">Projects</a>
        </li>
      </ul>
    </div>
  </div>
</div>

<!-- Main content -->
<div class="container body-content">
  {{ block "main" . }}{{ end }}
  <br>
  <footer class="text-right pageFooter">
    <p>
      &copy; {{ now.Year }} - Youri Schuurmans<br>
      v 1.2.3
    </p>
  </footer>
</div>

<!-- Scripts -->
<script src="https://code.jquery.com/jquery-1.12.4.min.js"></script>
<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
<script src="/js/main.js"></script>

{{ block "scripts" . }}{{ end }}

</body>
</html>
```

---

## 6. `layouts/cv/single.html` — CV Page Template

```html
{{ define "main" }}

<script>
  // Skill bar animation — runs inline so bars animate as soon as jQuery loads
  // (moved to "scripts" block below to ensure jQuery is available)
</script>

<h1 class="text-center">Youri Schuurmans</h1>

<div class="row text-center">
  <img src="/images/foto.jpg" class="mugshot" alt="Youri Schuurmans">
</div>

<br>

<div class="row CVRow">

  <!-- LEFT COLUMN: Experience + About Me -->
  <div class="left-col text-right col-sm-6">

    <div class="Experience col-xxs-12">
      <h2>Experience</h2>
      <br>
      {{ range .Params.experience }}
        <h3>{{ .role }}</h3>
        <h4>{{ .company }} &mdash; {{ .period }}</h4>
        <p>{{ .description }}</p>
        <br>
      {{ end }}
    </div>

    <br><br>

    <div class="AboutMe col-xxs-12">
      <h2>About me</h2>
      <br>
      <p>{{ .Params.about }}</p>
    </div>

    <br><br>
  </div>

  <!-- RIGHT COLUMN: Education + Skills + Contact -->
  <div class="right-col col-sm-6">

    <div class="Education col-xxs-12">
      <h2>Education</h2>
      <br>
      {{ range .Params.education }}
        <h3>{{ .degree }}</h3>
        <h4>{{ .institution }} &mdash; {{ .period }}</h4>
        <br>
      {{ end }}
    </div>

    <br><br>

    <div class="Skills col-xxs-12">
      <h2>Skills</h2>
      {{ range .Params.skills }}
        <div class="skillbar clearfix" data-percent="{{ .percent }}%">
          <div class="skillbar-title" style="background: #00a8ff;">
            <span>{{ .name }}</span>
          </div>
          <div class="skillbar-bar" style="background: #00a8ff;"></div>
          <div class="skill-bar-percent">{{ .percent }}%</div>
        </div>
      {{ end }}
    </div>

    <br><br>

    <div class="Contact col-xxs-12">
      <h2>Contact</h2>
      <p>
        {{ .Params.contact.name }}<br>
        <i class="fa fa-envelope" aria-hidden="true"></i>
        {{ .Params.contact.email }}<br>
        <i class="fa fa-globe" aria-hidden="true"></i>
        <a href="{{ .Params.contact.website }}">{{ .Params.contact.website_display }}</a><br>
        <i class="fa fa-github" aria-hidden="true"></i>
        <a href="{{ .Params.contact.github }}">{{ .Params.contact.github_display }}</a><br>
        <i class="fa fa-linkedin-square" aria-hidden="true"></i>
        <a href="{{ .Params.contact.linkedin }}">{{ .Params.contact.linkedin_display }}</a>
      </p>
    </div>

    <br><br>
  </div>

</div>
{{ end }}

{{ define "scripts" }}
<script>
  $(document).ready(function () {
    $('.skillbar').each(function () {
      $(this).find('.skillbar-bar').animate({
        width: $(this).attr('data-percent')
      }, 2000);
    });
  });
</script>
{{ end }}
```

---

## 7. `static/css/site.css` — Custom Styles

Copy verbatim from `YSchuurmans/Content/Site.css`, then add the `col-xxs-12` breakpoint which Bootstrap 3 doesn't include natively:

```css
/* === Paste full contents of YSchuurmans/Content/Site.css here === */

/* Custom breakpoint for col-xxs-12 (Bootstrap 3 doesn't have xxs) */
@media (max-width: 479px) {
  .col-xxs-12 {
    float: none;
    width: 100%;
  }
}
```

**Key values to preserve (for reference/verification):**

| Property | Value |
|---|---|
| `body` background | `#ebf7ff` |
| `body` padding-top | `50px` |
| Navbar background | `#ccecff` |
| `h1` color | `#0047b3` |
| `h2` color | `#003d99` |
| `h3` color | `#002966` |
| `h4` color | `#001433` |
| `.right-col` border-left | `1px solid #003380` |
| `.mugshot` border-radius | `50%`, max-height `200px` |
| `.skillbar-bar` background | `#6adcfa` |
| `.skillbar` height | `35px` |
| `.footerText` color | `#696969`, italic |

---

## 8. `static/js/main.js` — JavaScript

```js
$(document).ready(function () {
  // Project card hover zoom (needed for Projects page, harmless here)
  $('.ZoomBlock').hover(
    function () { $(this).addClass('Zoomed'); },
    function () { $(this).removeClass('Zoomed'); }
  );
});
```

Skill bar animation is inlined in the CV template's `{{ define "scripts" }}` block (see section 6) so it only runs on the CV page.

---

## 9. Assets to Copy

Copy these files from the original `YSchuurmans/` source into `static/`:

| Source path | Destination |
|---|---|
| `YSchuurmans/images/foto.jpg` | `static/images/foto.jpg` |
| `YSchuurmans/favicon.ico` | `static/favicon.ico` |
| `YSchuurmans/favicon-16x16.png` | `static/favicon-16x16.png` |
| `YSchuurmans/favicon-32x32.png` | `static/favicon-32x32.png` |
| `YSchuurmans/apple-touch-icon.png` | `static/apple-touch-icon.png` |
| `YSchuurmans/android-chrome-192x192.png` | `static/android-chrome-192x192.png` |
| `YSchuurmans/android-chrome-512x512.png` | `static/android-chrome-512x512.png` |
| `YSchuurmans/mstile-150x150.png` | `static/mstile-150x150.png` |
| `YSchuurmans/safari-pinned-tab.svg` | `static/safari-pinned-tab.svg` |
| `YSchuurmans/manifest.json` | `static/manifest.json` |
| `YSchuurmans/browserconfig.xml` | `static/browserconfig.xml` |

Font Awesome and Bootstrap are loaded via CDN (see `baseof.html`) — no need to copy font files locally.

---

## 10. Root Redirect (`/` → `/cv/`)

Add a `static/_redirects` file (for Netlify/Cloudflare Pages) or equivalent:

```
/   /cv/   301
```

For other hosts, add a `static/index.html` that meta-redirects:
```html
<!DOCTYPE html>
<html>
<head><meta http-equiv="refresh" content="0; url=/cv/"></head>
</html>
```

Alternatively, set `content/_index.md` to redirect:
```yaml
---
aliases: ["/"]
---
```
and use a `layouts/index.html` that simply redirects.

---

## 11. Running the Dev Server

```bash
# From the project root:
hugo server -D

# Open browser at:
# http://localhost:1313/cv/
```

The `now.Year` in `baseof.html` renders the current year dynamically at build time. In dev mode Hugo also live-reloads on file changes.

---

## 12. Verification Checklist

- [ ] Navbar is fixed-top, light blue (`#ccecff`), "Curriculum Vitae" is active/highlighted
- [ ] "Youri Schuurmans" h1 is centered, blue (`#0047b3`)
- [ ] Profile photo is circular, max 200px tall, centered
- [ ] Left column is right-aligned text
- [ ] 6 experience entries render with h3 (role) + h4 (company — period) + paragraph
- [ ] Right column has a left border (`1px solid #003380`)
- [ ] 7 skill bars render in descending order (C# 90% first, PHP 40% last)
- [ ] Skill bars animate from 0 to full width over 2 seconds on page load
- [ ] Skill bar color is cyan (`#6adcfa` / `#00a8ff`)
- [ ] Contact section shows 4 Font Awesome icons with correct links
- [ ] Footer is right-aligned: "© {year} - Youri Schuurmans" + "v 1.2.3"
- [ ] Cookie consent banner appears at top (static, pushes content down)
- [ ] Page is responsive: columns stack on mobile
- [ ] Google Fonts Roboto is applied to body text
