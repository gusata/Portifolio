# DUALITY

## Direction
Swiss minimalism, experimental editorial typography and two spatial identities.
The ui-ux-pro-max design-system search (`portfolio cinematic editorial minimal`,
motion 9, density 2) matched Minimalism & Swiss Style. Apply its negative space,
geometric structure, visible focus and reduced-motion final states. The user's
navy/porcelain, cobalt/ice and copper/sand palettes supersede the generic palette.
The generic Hero/Features/CTA recommendation is unsuitable for this exhibition.

## Motion
Framer Motion is already installed; retain Next.js 16 and React 19.
Selection uses spring tension (145 stiffness, 26 damping), pointer position and
clipped territories. Transitions use cubic [0.76, 0, 0.24, 1], with distinct cover
and reveal phases. Save each world's scroll position. Reduced motion skips the
intro and curtain and renders content directly. Avoid perpetual ambient effects.

## Reference research
These are conceptual references, not vendored components. No new dependencies
or third-party component source were copied; no Pro license is assumed.

- https://skiper-ui.com/v1/skiper35 — hover expansion; Pro CLI requires a license.
- https://www.skiper-ui.com/v1/preview/skiper40 — catalog confirms ExpandOnHover,
  Perspective Carousel, SVG clip path mask and Projects Showcase.
- https://reactbits.dev/text-animations/split-text — character stagger and masks.
- https://www.ui-layouts.com/components/image-reveal — framing and image reveals.
- https://ui.aceternity.com/components/svg-mask-effect — contextual mask concept.
- https://kokonutui.com/ — tactile Motion interaction reference; the requested
  magnet-button documentation URL was unavailable during research.
- https://magicui.design/docs/components/morphing-text — typographic identity.
- https://animate-ui.com/docs/primitives/radix-ui/dialog — functional overlay
  motion with preserved accessibility semantics.

## Content and limits
Preserve ClaudeFy, LEIA, Bob, Formazzi, Quiet Head and Blitz content and URLs.
Bob, Quiet Head and Blitz have local product images. Other project artwork must
remain explicitly identified as visual studies rather than product screenshots.
No verified authorial photography collection was present in public/. Never use
the existing generated hero art as evidence of Gustavo's photographic work.
The photographic exhibition needs original images before final delivery.

## Accessibility and QA
Keep semantic buttons, visible focus, keyboard navigation, Escape dismissal,
dialog focus containment and restoration, scroll locks and touch alternatives.
Use separate mobile composition and honor prefers-reduced-motion.
TypeScript, scoped ESLint and production build pass. Interactive visual QA must
be recorded separately; compilation does not demonstrate visual quality.
