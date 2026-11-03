# Typography and color refinement

Implemented 2026-10-30 following `color-typography-audit.md`. These rules refine
the currently active selector, Developer project index and Photography grid.

## Typography roles

- Archivo variable 400–800: shared identity, display and body. Developer uses
  sans-serif weight contrast instead of Georgia Italic in its hero, section
  headings, contact, empty results and mobile preview initials.
- JetBrains Mono 400–500: annotations, navigation, project/photo counts and small
  functional controls. Informative labels are 12 px minimum in the active views.
- Newsreader Italic 400–500: photographic titles and expressive fragments,
  including the selector's Photographer identity and the image viewer title.
- Normal descriptions use 16 px; the mobile photographic heading's supporting
  phrase uses 14 px. Tight tracking is reserved for larger compositions.

All three use locally hosted WOFF2 through next/font/local. Their total source
size is 112,364 bytes. Archivo and the mono are preloaded; Newsreader is requested
when used. License notices and source references are in public/fonts/README.md.

## Color roles

Preserve navy/cobalt/ice and warm paper/brown/cream. Centralize active paper,
ink, muted, selected, border and viewer roles in app/typography.css. Copper for
small informative foregrounds/focus uses #A4442A; #D66744 remains a decorative
accent. Photo captions have a stronger dark gradient to improve separation
from bright images. This does not establish a universal contrast guarantee for
arbitrary future photographs.

## Responsive refinements

Small screens use a 44 px icon control with the existing accessible destination
name for switching worlds. Keep a readable world label beside the logo. Gallery
heading metadata has its own row; allow instructions and discipline names to
wrap instead of shrinking type. Keep the proportional grid and image viewer.

## Validation

Production build (including TypeScript) and scoped ESLint passed. Reviewed
rendered desktop/mobile captures after font substitution. Automated browser
checks cover widths 320, 375, 768, 1280 and 1620, active metadata size, header
bounds, project filtering/search/dialog focus, photo viewer keyboard navigation,
touch interaction and transitions with normal/reduced motion. All passed on the
production build, with no browser errors. A final 320 px Developer refinement
keeps the project count beside the section label, gives the heading its own row
and prevents awkward kicker/name wrapping; inspected again after this change.
The final production build passed after that refinement.
