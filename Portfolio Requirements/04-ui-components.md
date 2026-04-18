# Portfolio Website — UI Components

## 1. Navbar

**Behavior:** Fixed to top of page. Bootstrap `navbar-default` style with custom color overrides.

**Structure:**
```
[Youri Schuurmans]          [Curriculum Vitae] [Projects]
(brand link → /CV)          (right-aligned nav items)
```

**Specs:**
- Fixed-top: body has `padding-top: 50px` to compensate
- Background: `#ccecff`
- Font size: 15px
- Brand text color: `rgba(77,77,77,1)`
- Nav link color: `rgba(79,79,79,1)`
- Nav link hover background: `rgba(222,242,255,1)`, color `rgba(51,51,51,1)`
- Active page link background: `rgba(240,249,255,1)`, color `rgba(85,85,85,1)`
- Mobile: hamburger toggle button, collapses to stacked links
- Hamburger border color: `#5ca1d6`, hover background: `#5ca1d6`
- Icon bars color: `#5ca1d6`, hover: `#ccecff`

---

## 2. Profile Photo (CV Page)

- Image file: `foto.jpg`
- CSS class: `.mugshot`
- Shape: circular (`border-radius: 50%`)
- Max width: 100%, max height: 200px
- Centered via Bootstrap `text-center` row

---

## 3. CV Two-Column Layout

**Left column** (`col-sm-6`, text-right):
- "Experience" section (h2 + HTML content)
- "About me" section (h2 + HTML content)

**Right column** (`col-sm-6`):
- Left border: `1px solid #003380`
- "Education" section (h2 + HTML content)
- "Skills" section (h2 + animated skill bars)
- "Contact" section (h2 + contact details with FA icons)

On mobile (below sm breakpoint): columns stack vertically.

---

## 4. Skill Bars

Each skill bar consists of 3 layers:
1. **Background track**: full width, gray (`#eee`), height 35px, border-radius 3px
2. **Filled bar**: starts at 0, animates to `data-percent` width on page load (2000ms)
3. **Title label**: absolutely positioned left, shows skill name in white text on `#6adcfa` background with subtle dark overlay
4. **Percentage text**: absolutely positioned right, `rgba(0,0,0,0.4)` color

**Colors:**
- Bar fill: `#6adcfa` (also used for the title background; original source code uses `#00a8ff` inline — use `#6adcfa` from Site.css)
- Title span: 20px horizontal padding, 35px line-height
- Percent label: 11px font, right 10px

**Skills are sorted descending by percentage.**

---

## 5. Contact Section

Plain paragraph with line breaks. Each line starts with a Font Awesome icon:
- `fa-envelope` — email address
- `fa-globe` — website URL (linked)
- `fa-github` — GitHub URL (linked)
- `fa-linkedin-square` — LinkedIn URL (linked)

---

## 6. Project Card (Projects Grid)

**CSS classes:** `.ProjectBlock`, `.ZoomBlock`

**Structure:**
```
┌─────────────────────┐
│   [Header Image]    │  max-height: 200px, overflow hidden
├─────────────────────┤
│  {date}             │  small italic text (.footerText)
│  {title}            │  h2
│  {short desc}       │  paragraph
└─────────────────────┘
```

**Card styles:**
- Background: white
- Border-radius: 4px
- Margin-bottom: 30px
- Cursor: pointer
- `word-wrap: break-word`
- Unpublished (admin only): `background-color: lightgray`

**Hover effect:**
- `.ZoomBlock` has transition `all 0.4s ease-in-out` (all vendor prefixes)
- On hover: `.Zoomed` class added → `transform: scale(1.05)` (all vendor prefixes)
- On mouse leave: `.Zoomed` removed

**Click:** navigates to `/Projects/Get/{id}` (via `onclick`)

---

## 7. Project Image Thumbnail

**CSS class:** `.ProjectImage`

- Position: relative
- Width: 100%
- Max-height: 200px
- Overflow: hidden
- Border-radius: 4px
- Inner `img`: width 100%, height auto

For YouTube thumbnails: `//img.youtube.com/vi/{videoId}/default.jpg`
For GfyCat thumbnails: `https://thumbs.gfycat.com/{id}-size_restricted.gif`

---

## 8. Masonry Grid (Projects Page)

**Library:** Masonry.js (`masonry.pkgd.min.js`)

**Config:**
```js
$('.grid').masonry({
  itemSelector: '.grid-item',
  columnWidth: '.grid-sizer',
  percentPosition: true
});
```

**Grid sizer element:** `<div class="grid-sizer col-lg-3 col-sm-4 col-xs-6 col-xxs-12">`

Initialized on both `$(document).ready` and `$(window).load`.

---

## 9. Image Carousel (Project Detail)

**Library:** Camera.js

Only rendered if the project has at least 1 visual.

**Config:**
```js
jQuery('#camera_wrap_3').camera({
  height: '56%',
  pagination: false,
  thumbnails: true,
  imagePath: '/images/',
  fx: 'simpleFade',
  time: 12000
});
```

**Outer structure:**
```html
<div class="outer_container">
  <div class="fluid_container">
    <div class="camera_wrap camera_emboss" id="camera_wrap_3">
      <!-- slide divs here -->
    </div>
  </div>
</div>
```

Each slide has `data-thumb` (thumbnail URL) and `data-src` (full image URL).
For YouTube slides: iframe is placed inside the slide div.
For GfyCat slides: iframe positioned absolute within the slide div.

After the carousel: `<div style="clear: both; display: block; height: 30px">`.

---

## 10. Project Detail Content Block

**CSS class:** `.LGProjectBlock` (white bg, border-radius 4px, no padding on outer div)

**Inner structure (.ProjectTextBlock, padding 10px):**
- Date: `<p class="footerText">` (italic, 1em, gray `#696969`)
- Title: `<h2>` (HTML-rendered)
- Short content: `<h4>` (HTML-rendered)
- Line break
- Full content: `<p>` (HTML-rendered, may contain images, code blocks, etc.)

Images inside content: class `.ContentImg` (max-width: 100%)
Code blocks: Google Code Prettify via CDN (`run_prettify.js`)

---

## 11. Footer

```html
<footer class="text-right pageFooter">
  <p>
    © {year} - Youri Schuurmans<br>
    v 1.2.3
  </p>
</footer>
```

**Styles (.pageFooter):**
- Font size: 0.9em
- Color: `#696969`
- Right-aligned

---

## 12. Cookie Consent Banner

**Library:** cookieconsent2 v3.0.3 (from cdnjs.cloudflare.com)

**Config:**
- Position: top, static (pushes content down)
- Popup background: `#edeff5`, text: `#838391`
- Button background: `#4b81e8`
- Message: "This website uses cookies to ensure you get the best experience on our website. By continuing to browse the site you are agreeing to our use of cookies."
- Dismiss button: "Dismiss"
