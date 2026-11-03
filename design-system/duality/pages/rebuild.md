# DUALITY — independent rebuild

This page override supersedes the earlier implementation notes in MASTER.md.
The active entry point is components/duality/Experience.tsx; it imports no prior
portfolio components. app/globals.css is a new stylesheet, not an override layer
on the previous design. content/duality.ts preserves the real project records.

The new ui-ux-pro-max query `photography portfolio editorial immersive` selected
an image-focused direction with spacious rhythm, high contrast, Archivo and
spatial transitions. Apply the user's two palettes instead of the generic black
palette. Archivo is hosted locally with its OFL license. Georgia supplies the
quiet photographic/editorial counterpoint. Image optimization uses next/image.

The selector is built around a two-line name, an SVG objectBoundingBox mask,
spring pressure and independent architectural/aperture motifs. Touch layouts
use two full-width rows with real buttons. The intro is session-scoped and
skippable. World navigation has query-string destinations, browser back support
and independent remembered scroll positions. Project scenes use alternating
axis reveals, image-filled title masks, animated numbering and shared artwork
expansion. Dialogs contain keyboard focus, dismiss with Escape and restore focus.

Photography modes and the image viewer consume a typed original-photo catalog.
The catalog remains empty because no verified authorial photographs were supplied.
The public page uses an honest empty collection, never fake photographic work.
The earlier 16 placeholder slots and invented collection categories are not used.

## Verification
Production build, TypeScript and scoped ESLint passed during implementation.
Headless Edge tested desktop world selection and both directions of switching,
project opening and Escape dismissal, 375px touch layout and reduced-motion
intro bypass. Browser checks reported no page errors or horizontal overflow.
Desktop and mobile screenshots were inspected and mobile CTA overlap corrected.
Original photography sharpness, gallery compositions with real images and their
curation remain unverified until the real collection is supplied.
