# Portfolio Website — JavaScript Behaviors

All interactive behaviors that must be reimplemented in the new stack.

---

## 1. Skill Bar Animation (CV Page)

Triggers on page load. Each `.skillbar` element has a `data-percent` attribute (e.g. `"90%"`).

**Implementation:**
```js
$(document).ready(function () {
  $('.skillbar').each(function () {
    $(this).find('.skillbar-bar').animate({
      width: $(this).attr('data-percent')
    }, 2000);
  });
});
```

- Duration: 2000ms
- Easing: default (jQuery `swing`)
- Animates `.skillbar-bar` width from 0 to the `data-percent` value

**Recreation note:** Any CSS animation or JS library that animates a bar from 0% to the target width over ~2 seconds achieves the same effect.

---

## 2. Project Card Hover Zoom

Applies to all `.ZoomBlock` elements (wraps each project card).

**Implementation:**
```js
$(document).ready(function () {
  $('.ZoomBlock').hover(
    function () { $(this).addClass('Zoomed'); },
    function () { $(this).removeClass('Zoomed'); }
  );
});
```

The `.Zoomed` class applies `transform: scale(1.05)`. The transition (0.4s ease-in-out) is defined in CSS on `.ZoomBlock`.

**Recreation note:** Can be done with pure CSS `hover` + `transform: scale(1.05)` — no JS required.

---

## 3. Masonry Grid (Projects Page)

**Library:** Masonry.js (`masonry.pkgd.min.js`)

```js
function Masonize() {
  $('.grid').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });
}

$(document).ready(function () { Masonize(); });
$(window).load(function () { Masonize(); });
```

Initialized twice (on ready and on window load) to handle images that may shift layout after loading.

**Recreation note:** Can be replaced with CSS Grid or any masonry library (e.g. `react-masonry-css`, `vue-masonry`, CSS `columns`).

---

## 4. Camera.js Carousel (Project Detail)

**Library:** Camera.js (bundled with `jquery.easing.1.3.js` and `jquery.mobile.customized.min.js`)

Only loaded when the project has at least one visual.

```js
jQuery(function () {
  jQuery('#camera_wrap_3').camera({
    height: '56%',
    pagination: false,
    thumbnails: true,
    imagePath: '/images/',
    fx: 'simpleFade',
    time: 12000
  });
});
```

**Config explanation:**
- `height: '56%'` — 56% of the container width (aspect ratio ~16:9)
- `pagination: false` — no dot navigation
- `thumbnails: true` — thumbnail strip shown below carousel
- `fx: 'simpleFade'` — crossfade transition between slides
- `time: 12000` — 12 seconds per slide
- `imagePath: '/images/'` — path for Camera.js internal UI assets (loader gif, skins)

**Recreation note:** Replace with any modern carousel/slider (e.g. Swiper.js, Glide.js, Splide, or a native `<details>`/CSS scroll snap approach). Key requirements:
- Thumbnail navigation strip
- Auto-advance every 12 seconds
- Fade transition
- Supports both image and iframe (YouTube/GfyCat) slides
- Height roughly 56% of viewport width

---

## 5. Cookie Consent Banner

**Library:** cookieconsent2 v3.0.3 from cdnjs.cloudflare.com

```js
window.addEventListener("load", function () {
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
```

`static: true` pushes content down (not an overlay). `position: "top"`.

---

## 6. Code Prettify (Project Content)

**Library:** Google Code Prettify (CDN)

```html
<script src="https://cdn.rawgit.com/google/code-prettify/master/loader/run_prettify.js"></script>
```

Auto-formats `<pre class="prettyprint">` blocks in project content HTML. Loaded on every page.

**Recreation note:** Replace with Prism.js, Highlight.js, or equivalent. Any `<code>` blocks in project content HTML should be syntax-highlighted.

---

## 7. Project Card Click Navigation

Cards navigate to project detail on click:
```html
<div onclick="window.location = '/Projects/Get/{id}';">
```

**Recreation note:** Wrap cards in `<a href="/projects/{id}">` tags instead for better accessibility and SEO.

---

## Script Load Order (per `_Layout.cshtml`)

1. `modernizr-2.6.2.js` — HTML5 feature detection (in `<head>`)
2. `jquery-1.10.2.min.js`
3. `jquery-ui.min.js`
4. `bootstrap.min.js`
5. `main.js` — hover zoom behavior
6. `masonry.pkgd.min.js`
7. `jquery.cookieBar.min.js`
8. Google Code Prettify (CDN)
9. Cookie consent CDN script

Page-specific scripts (project detail only):
10. `jquery.mobile.customized.min.js`
11. `jquery.easing.1.3.js`
12. `camera.js`
