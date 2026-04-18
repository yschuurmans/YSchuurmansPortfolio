# Story 4 Progress

## Approach

Extract the video ID from all three formats before the existing embed logic runs.
Logic lives entirely in `layouts/projects/single.html` — no JS or CSS changes needed.

### ID extraction logic

| Input | Strategy |
|-------|----------|
| `youtube:ID` | `strings.TrimPrefix "youtube:"` |
| `https://youtu.be/ID` | Strip prefix, take part before `?` |
| `https://www.youtube.com/watch?v=ID&...` | Split query string on `&`, find `v=` param |

Set `$videoId` to the extracted ID (or `""` if not YouTube), then branch on `$videoId`.
