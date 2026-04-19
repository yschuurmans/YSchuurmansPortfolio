# Portfolio Website — Media Types

Projects can have visual media attached. Three types are supported.

---

## Type 1: Photo

**Stored as:** UUID filename in `/uploads/` directory.
**Example:** `cc9a0f89-5938-4fef-9eac-baced6891e6b.png`

**Thumbnail (on grid card):**
```html
<img src="/uploads/{filename}" alt="Project Visual" />
```

**Carousel slide (project detail):**
```html
<div data-thumb="/uploads/{filename}" data-src="/uploads/{filename}">
  <!-- no inner content needed; Camera.js loads the image -->
</div>
```

---

## Type 2: YouTube Video

**Stored as:** YouTube video ID string.
**Example:** `dQw4w9WgXcQ`

**Thumbnail (on grid card):**
```html
<img src="//img.youtube.com/vi/{videoId}/default.jpg" alt="Project Visual" />
```

**Carousel slide (project detail):**
```html
<div data-thumb="//img.youtube.com/vi/{videoId}/0.jpg"
     data-src="//img.youtube.com/vi/{videoId}/default.jpg">
  <iframe width="100%" height="100%"
    src="https://www.youtube.com/embed/{videoId}"
    frameborder="0" allowfullscreen></iframe>
</div>
```

---

## Type 3: GfyCat

**Stored as:** GfyCat ID string.
**Example:** `TameWildGoat`

**Thumbnail (on grid card):**
```html
<img src="https://thumbs.gfycat.com/{id}-size_restricted.gif" />
```

**Carousel slide (project detail):**
```html
<div data-thumb="https://thumbs.gfycat.com/{id}-size_restricted.gif"
     data-src="/images/blank.gif">
  <iframe src="https://gfycat.com/ifr/{id}"
    frameborder="0" scrolling="no"
    width="100%" height="100%"
    style="position:absolute;top:0;left:0;"
    allowfullscreen></iframe>
</div>
```

Note: GfyCat uses `blank.gif` as the `data-src` (Camera.js background) because the actual content is loaded via iframe.

---

## Header Image Logic (Grid Card Thumbnail)

Each project has a designated `headerImg` visual. If no header image is set (null or empty location), no thumbnail is shown on the card — the card just shows the text block.

---

## Recreation Notes

- GfyCat has shut down as of 2023. Projects using GfyCat media may need to be migrated to alternative GIF/video hosts (Imgur, Streamable, direct MP4, etc.).
- YouTube embeds remain functional.
- For a static recreation, all Photo visuals are already available in the `/uploads/` directory.
- If using a modern carousel instead of Camera.js, adapt the slide structure accordingly — the key data points are: thumbnail URL, full media URL (or iframe src for video types).
