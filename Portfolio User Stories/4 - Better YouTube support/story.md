# Story 4 — Better YouTube Support

## Goal

The `visuals` front matter field currently accepts YouTube entries in the format `youtube:VIDEO_ID`. This story extends that to also gracefully accept full and shortened YouTube URLs so that authors can paste a URL directly without manually extracting the video ID.

## Formats to support

| Format | Example |
|--------|---------|
| Existing | `youtube:4GEnsHUIj3c` |
| Full URL | `https://www.youtube.com/watch?v=4GEnsHUIj3c&t=16s` |
| Shortened | `https://youtu.be/4GEnsHUIj3c` |

## Scope

- **Hugo template** (`layouts/projects/single.html`): extract the video ID from any of the three formats before rendering the iframe and thumbnail. No change to the rendered output — all three resolve to the same embed and thumbnail URLs.
- **No changes** to `main.js` or `site.css` — the JS already works with the rendered output.

## Acceptance Criteria

1. A visual entry of `youtube:VIDEO_ID` continues to render correctly (no regression).
2. A visual entry of `https://www.youtube.com/watch?v=VIDEO_ID` renders the correct YouTube embed and thumbnail.
3. A visual entry of `https://www.youtube.com/watch?v=VIDEO_ID&t=16s` (with extra query params) renders the correct YouTube embed and thumbnail (timestamp is ignored in the embed — no autoplay workarounds needed).
4. A visual entry of `https://youtu.be/VIDEO_ID` renders the correct YouTube embed and thumbnail.
5. All three formats produce identical HTML output for the same video.
6. Clean Hugo build (`hugo --minify`) with zero errors or warnings.
