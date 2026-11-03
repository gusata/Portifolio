# Field of Vision

Photographer-specific override to the DUALITY master system.

The ui-ux-pro-max `photography exhibition immersive` search matched a motion-driven
exhibition with spacious typography and image-first compositions. Keep Archivo /
Georgia and the approved copper, umber and sand identity. The lighter exhibition
surface is an archival-paper neutral; the dark full-screen viewer isolates images.
The `dragging movements` UX search requires visible non-drag alternatives. The
canvas supplies directional buttons and arrow keys, zoom controls and reset; a
linear Index provides direct access to every photo. Native dialog supplies focus
containment, Escape and modal semantics, with explicit return-focus behavior.

## Experience

- Free Roam: an original infinite, virtualized plane. Visible rows/columns are
  computed from the camera; DOM size stays bounded at the allowed zoom levels.
  Coordinates, uneven frame sizes, small rotations and captions make the view
  feel like a photographic light table. No ambient or automatic motion.
- Film Reel: actual installed Skiper 47 Perspective Carousel.
- Light Table: actual installed Skiper 52 ExpandOnHover.
- Index: every original item in stable order without repeated canvas instances.
- Full-screen viewer: directional frame transitions, preserved aspect ratios,
  arrow-key browsing and native dialog focus management.

Skiper 73 Infinite Canvas is Pro-only according to its official documentation:
https://skiper-ui.com/v1/skiper73. Its source was not accessed or copied. The
original components/duality/InfiniteCanvas.tsx uses existing React/Next Image
capabilities and does not add GSAP or another dependency. Skiper attribution is
retained for the installed free components. Generic photos remain labeled as demo.

Wheel scroll continues through the document; Shift+wheel explicitly pans the
canvas. Pointer drag has a movement threshold and suppresses accidental opening.
Touch drag is scoped to the canvas, leaving the rest of the page scrollable.
Reduced motion removes image transition transforms and disables Skiper depth.

Validation: production build, TypeScript and scoped ESLint passed. Desktop and
375px reduced-motion browser checks verified all four views, viewer navigation,
Escape and no mobile overflow. A real pointer drag changed camera coordinates
without opening the viewer; zoom to 80% kept 35 rendered frames. Keyboard Enter
opened a frame, Tab stayed inside the native dialog and Escape returned focus
to that frame. Desktop, mobile and full-screen viewer screenshots were inspected.
