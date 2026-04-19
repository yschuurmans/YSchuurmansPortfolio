# Story 6 — Prevent Carousel Advance During Video Playback

## Goal

Ensure the inline project visual carousel on project detail pages does not automatically move to the next visual while the currently active visual is a video that is actively playing, whether that video is a YouTube embed or a local video file.

## Current Problem

Project detail pages use an auto-advancing visual carousel so visitors can browse mixed media without manual input. When the active visual is a video and the visitor starts playback, the carousel must stop advancing until playback is paused, finished, or the visitor intentionally navigates away. At the moment, this behavior is not reliable enough: the carousel can still advance to the next visual while a video is playing, interrupting playback.

This issue applies to both supported video formats on project pages:

- YouTube visuals rendered as embedded iframes
- Local video files rendered with the native HTML5 `video` element

## Reproduction

1. Open a project detail page at `/projects/{slug}/` that has more than one visual and includes a YouTube visual or a local video file.
2. Navigate to the video visual if it is not already active.
3. Start playback.
4. Wait longer than the carousel auto-advance interval.
5. Observe that the carousel must remain on the current visual for as long as the video is still playing.

## Scope

- `static/js/main.js`: make the project carousel reliably suppress timed auto-advance whenever the active slide contains a playing YouTube or local video, and resume normal cycling only when playback is no longer active.
- `layouts/projects/single.html`: keep the project carousel markup and media attributes aligned with whatever hooks are required for reliable playback-state detection.
- Regression coverage for mixed-media carousels so image-only behavior continues to work as it does today.

## Acceptance Criteria

1. On `/projects/{slug}/`, when the active slide contains a local video file and the visitor starts playback, the carousel does not auto-advance to the next visual while that video is still playing.
2. On `/projects/{slug}/`, when the active slide contains a YouTube video and the visitor starts playback, the carousel does not auto-advance to the next visual while that video is still playing.
3. If a playing local video is paused, the carousel is allowed to resume its normal timed cycling behavior.
4. If a local video reaches its end state, the carousel is allowed to resume its normal timed cycling behavior.
5. If a playing YouTube video is paused or ends, the carousel is allowed to resume its normal timed cycling behavior.
6. Manual previous/next controls still work while a video slide is active.
7. Thumbnail navigation still works while a video slide is active.
8. Navigating away from a video slide pauses or stops playback where supported so hidden audio does not continue after the slide is no longer active.
9. Image slides continue to auto-advance normally when no video is actively playing.
10. Projects without any video visuals do not regress.
11. The existing project lightbox behavior is not regressed by the fix.
12. `hugo --minify` completes with zero errors and zero warnings.

## Out Of Scope

- Replacing the existing project carousel implementation.
- Changing thumbnail layout, card layout, or project page styling beyond what is needed to fix playback-driven auto-advance.
- Adding support for new media providers beyond the current image, YouTube, and local video formats.
- Changing lightbox-specific navigation behavior unless required to avoid a direct regression from this fix.

## Implementation Notes

- The current inline carousel logic in `static/js/main.js` already attempts to pause cycling for local videos and YouTube players. This story is specifically about making that behavior reliable for the active slide under real playback conditions.
- Validate the fix against at least one mixed-media project page so both video and non-video visuals are covered.