# Portfolio Website — Styling

## Typography

- **Primary font:** Roboto (loaded from Google Fonts: `https://fonts.googleapis.com/css?family=Roboto`)
- **Fallback stack:** "Helvetica Neue", Helvetica, Arial, sans-serif
- Applied globally to `body`

---

## Color Palette

| Element | Color |
|---|---|
| Page background | `#ebf7ff` (`rgba(235,247,255,1)`) |
| Navbar background | `#ccecff` (`rgba(204,236,255,1)`) |
| Navbar link color | `rgba(79,79,79,1)` |
| Navbar link hover bg | `rgba(222,242,255,1)` |
| Navbar active bg | `rgba(240,249,255,1)` |
| Navbar brand color | `rgba(77,77,77,1)` |
| Hamburger border | `#5ca1d6` |
| h1 | `#0047b3` |
| h2 | `#003d99` |
| h3 | `#002966` |
| h4 | `#001433` |
| Skill bar fill | `#6adcfa` |
| Skill bar title bg | `#6adcfa` (with `rgba(0,0,0,0.1)` overlay on the span) |
| Skill bar percent text | `rgba(0,0,0,0.4)` |
| Skill bar track | `#eee` |
| CV right column border | `1px solid #003380` |
| Footer / date text | `#696969` |
| Project card bg | `white` |
| Unpublished card bg | `lightgray` |
| `.noLink` color | `#333` |

---

## Body Layout

```css
body {
  padding-top: 50px;    /* compensates for fixed-top navbar */
  padding-bottom: 20px;
  background-color: #ebf7ff;
}
.body-content {
  padding-left: 15px;
  padding-right: 15px;
}
```

---

## Headings

```css
h1 { color: #0047b3; }
h2 { color: #003d99; }
h3 { color: #002966; }
h4 { color: #001433; }
```

In CV rows, `margin-top: 0` on all headings. `h3` inside CV also has `margin-bottom: 0; font-size: 1.6em`.

---

## Project Cards

```css
.ProjectBlock {
  background-color: white;
  border-radius: 4px;
  margin-bottom: 30px;
  cursor: pointer;
  word-wrap: break-word;
}
.ProjectImage {
  position: relative;
  width: 100%;
  max-height: 200px;
  overflow: hidden;
  border-radius: 4px;
}
.ProjectImage img {
  width: 100%;
  height: auto;
}
.ProjectTextBlock {
  padding: 10px;
}
```

---

## Hover Zoom

```css
.ZoomBlock {
  transition: all 0.4s ease-in-out;  /* all vendor prefixes */
}
.Zoomed {
  transform: scale(1.05);  /* all vendor prefixes */
}
```

---

## Mugshot (Profile Photo)

```css
.mugshot {
  border-radius: 50%;
  max-width: 100%;
  max-height: 200px;
}
```

---

## Skill Bars

```css
.skillbar {
  position: relative;
  display: block;
  margin-bottom: 15px;
  width: 100%;
  background: #eee;
  height: 35px;
  border-radius: 3px;
  transition: 0.4s linear;
  transition-property: width, background-color;
}
.skillbar-title {
  position: absolute;
  top: 0; left: 0;
  font-weight: bold;
  font-size: 13px;
  color: #fff;
  background: #6adcfa;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.skillbar-title span {
  display: block;
  background: rgba(0,0,0,0.1);
  padding: 0 20px;
  height: 35px;
  line-height: 35px;
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}
.skillbar-bar {
  height: 35px;
  width: 0px;         /* animated to data-percent on load */
  background: #6adcfa;
  border-radius: 3px;
}
.skill-bar-percent {
  position: absolute;
  right: 10px; top: 0;
  font-size: 11px;
  height: 35px;
  line-height: 35px;
  color: rgba(0,0,0,0.4);
}
```

---

## CV Right Column Border

```css
.right-col {
  border-left: solid 1px #003380;
}
```

---

## Footer

```css
.footerText {
  font-style: italic;
  font-size: 1em;
  margin-bottom: 0px;
  color: #696969;
}
.pageFooter {
  font-size: 0.9em;
  color: #696969;
}
```

---

## Bootstrap 3 Grid Breakpoints Used

| Class suffix | Breakpoint | Columns (projects) |
|---|---|---|
| `col-lg-3` | ≥1200px | 4 per row |
| `col-sm-4` | ≥768px | 3 per row |
| `col-xs-6` | ≥480px | 2 per row |
| `col-xxs-12` | custom / <480px | 1 per row |

Note: `col-xxs-*` is a custom breakpoint added via Site.css (not in Bootstrap 3 core).

---

## Content Images

```css
.ContentImg {
  max-width: 100%;
}
```

Used for images embedded in project descriptions.

---

## External Stylesheets (loaded in order)
1. `bootstrap.min.css` (Bootstrap 3.0.0)
2. `Site.css` (custom overrides)
3. `font-awesome.min.css` (Font Awesome icon font)
4. `jquery-ui.css` (jQuery UI)
5. `cookieBar.min.css` (cookie consent local)
6. Cookie consent CDN CSS (cookieconsent2 v3.0.3)
7. `camera.css` + `cameraSettingCss.css` (only on project detail pages with visuals)
