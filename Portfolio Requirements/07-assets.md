# Portfolio Website — Assets

## Profile Photo
| File | Usage |
|---|---|
| `images/foto.jpg` | Circular mugshot on CV page |
| `images/foto_old.jpg` | Archive (not displayed publicly) |

---

## Project Images
All uploaded project images are in `/uploads/`. Filenames are UUIDs.

| Filename | Extension |
|---|---|
| `0b8abf74-c4bd-4c2a-814b-4430ec597749` | .png |
| `1e7b2410-4df6-4eed-8a28-1d7c467e212d` | .png |
| `22898b0e-d3e0-4114-bca3-24d161bcab91` | .png |
| `2c932ae4-e897-41d5-bb1d-8a132f442356` | .png |
| `32426aa0-85a6-421c-b788-393b02ec91fe` | .png |
| `51971ac7-c5cc-4849-9991-7213bf55b5b6` | .png |
| `68050726-a745-4c83-8ed5-e7157d0a9c08` | .png |
| `6ae64f70-0156-446e-ae95-306b2edf347a` | .jpg |
| `6e8d0c24-bd82-42a3-8d0f-8c2054afc07e` | .png |
| `7102dee7-ad8f-4d52-b656-573c08790916` | .png |
| `83602861-24bc-4025-93cb-d34f6d1f8eeb` | .png |
| `8ddddf7f-f203-4319-a2cf-a880ee87157a` | .jpg |
| `97005b79-d17a-4fbb-b940-029a6d2bdf48` | .png |
| `a05fc2d5-611b-48ea-b4fa-bb4d0343bd87` | .png |
| `af231576-234f-46dc-b5d7-b326db6083f0` | .png |
| `b88aa8d7-e212-4aa4-9aa1-1c60abf7d282` | .png |
| `c4f51b21-cce4-4eea-9f6a-d8d122722234` | .png |
| `cc9a0f89-5938-4fef-9eac-baced6891e6b` | .png |
| `e65bd798-cadd-4744-94da-654ee9a8976a` | .png |
| `fe410325-590c-40ea-b92e-4cddbcc9de9e` | .png |

Total: 20 files (18 PNG, 2 JPG). Must be served from `/uploads/` path.

---

## Placeholder / UI Images
| File | Usage |
|---|---|
| `images/NoImg.jpg` | Placeholder when no project image exists |
| `images/blank.gif` | Blank 1×1 GIF used as data-src for GfyCat carousel slides |
| `images/camera-loader.gif` | Loading spinner for Camera.js carousel |
| `images/camera_skins.png` | Camera.js carousel UI skin sprites |

---

## Favicon Set
All favicons are in the root directory.

| File | Usage |
|---|---|
| `favicon.ico` | Default browser favicon |
| `favicon-16x16.png` | 16×16 PNG favicon |
| `favicon-32x32.png` | 32×32 PNG favicon |
| `apple-touch-icon.png` | iOS home screen icon (180×180) |
| `android-chrome-192x192.png` | Android home screen icon |
| `android-chrome-512x512.png` | Android splash screen icon |
| `mstile-150x150.png` | Windows Start menu tile (150×150) |
| `safari-pinned-tab.svg` | Safari pinned tab icon (monochrome SVG) |

**Head meta declarations:**
```html
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" href="/favicon-32x32.png" sizes="32x32">
<link rel="icon" type="image/png" href="/favicon-16x16.png" sizes="16x16">
<link rel="manifest" href="/manifest.json">
<link rel="mask-icon" href="/safari-pinned-tab.svg" color="#5bbad5">
<meta name="theme-color" content="#ffffff">
```

---

## Icon Fonts
**Font Awesome** — used for contact section icons and any icons in rich content.

Icons used in the CV contact section:
- `fa-envelope` (email)
- `fa-globe` (website)
- `fa-github` (GitHub)
- `fa-linkedin-square` (LinkedIn)

The original site loads Font Awesome locally from the `fonts/` directory. It can be replaced with Font Awesome CDN or any equivalent icon library.

---

## Web Fonts
**Roboto** — loaded via Google Fonts:
```html
<link href="https://fonts.googleapis.com/css?family=Roboto" rel="stylesheet">
```

---

## PWA Manifest (`manifest.json`)
```json
{
  "name": "Youri",
  "theme_color": "#ffffff",
  "background_color": "#ffffff",
  "display": "standalone",
  "icons": [
    { "src": "/android-chrome-192x192.png", "sizes": "192x192", "type": "image/png" },
    { "src": "/android-chrome-512x512.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```

---

## Windows Tile (`browserconfig.xml`)
```xml
<browserconfig>
  <msapplication>
    <tile>
      <square150x150logo src="/mstile-150x150.png"/>
      <TileColor>#2d89ef</TileColor>
    </tile>
  </msapplication>
</browserconfig>
```
