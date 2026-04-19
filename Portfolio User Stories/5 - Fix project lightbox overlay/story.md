# Story 5 — Fix Project Lightbox Overlay

## Status

Solved on 2026-04-19.

## Goal

Fix the project-detail image lightbox so the modal backdrop darkens only the page behind the lightbox, not the displayed image itself, ensure the lightbox controls remain visible and usable, and support smooth keyboard and animated image navigation.

## Current Problem

On project detail pages, clicking a carousel image opens the custom lightbox, but the fade/overlay effect also darkens the image inside the lightbox. The same overlay appears to sit above the image controls, which makes the close button and previous/next navigation inaccessible. In practice, the lightbox can become impossible to close without reloading the page.

## Reproduction

1. Open any project detail page with image visuals at `/projects/{slug}/`.
2. Click a carousel image to open the lightbox.
3. Observe that the displayed image is dimmed together with the page background.
4. Observe that the close button and navigation buttons are obscured or unclickable.

## Scope

- **Project detail template** (`layouts/projects/single.html`): keep the lightbox markup aligned with the intended Bootstrap modal structure and ensure controls live above the displayed media.
- **Lightbox styles** (`static/css/site.css`): correct stacking, backdrop, positioning, and content styling so the backdrop darkens only the surrounding page and not the active image.
- **Lightbox behavior** (`static/js/main.js`): preserve current open-at-clicked-slide behavior while ensuring mouse and keyboard navigation, close interactions, and image transitions work reliably.
- **Inline carousel behavior** (`static/js/main.js`): support left and right arrow-key navigation on the project page when the lightbox is closed.

## Acceptance Criteria

1. Opening a carousel image on `/projects/{slug}/` shows the selected image at normal brightness inside the lightbox while the page behind it is darkened.
2. The close button is visible above the image, remains clickable, and closes the lightbox.
3. Previous and next controls are visible above the image, remain clickable, and navigate between images without the lightbox becoming stuck.
4. While the lightbox is open, pressing the left arrow key shows the previous image and pressing the right arrow key shows the next image.
5. The lightbox also closes when the user presses `Escape` or clicks the modal backdrop outside the lightbox content.
6. The lightbox opens on the image that was clicked and continues to cycle correctly through the available image slides.
7. Switching between images inside the lightbox uses a visible fade transition without leaving both images partially obscured or overlapping in a broken state.
8. On projects with only one image, previous and next controls are hidden and the left/right arrow keys do not cause errors.
9. The fix does not regress the inline project carousel behavior on the page itself.
10. On projects with mixed visuals, previous/next and keyboard navigation include YouTube visuals instead of skipping them.
11. The lightbox close button and previous/next controls use the same dark translucent control box treatment for consistent visibility.
12. On the project page outside the lightbox, pressing the left arrow key shows the previous carousel slide and pressing the right arrow key shows the next slide.
13. The inline carousel arrow-key support does not interfere with the lightbox arrow-key support while the lightbox is open.
14. `hugo --minify` completes with zero errors and zero warnings.

## Implementation Findings

- **Resolved:** Mixed-media projects exposed that the original lightbox only built its navigation set from image elements, so YouTube visuals were omitted from lightbox browsing.
- **Resolved:** Bootstrap's `btn-close-white` filter altered the appearance of the close button so its box did not visually match the previous/next controls.
- **Resolved:** The project page itself did not support left/right keyboard navigation for the inline carousel while the lightbox was closed.

## Out Of Scope

- Replacing the existing carousel with a different gallery implementation.
- Changing thumbnail layout or project page visual design beyond what is required to fix the lightbox bug.
- Adding support for media sources outside the current project visual formats.