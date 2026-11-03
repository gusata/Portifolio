# Skiper UI integration

Official registry components are installed as source, not a monolithic npm package.
components.json registers @skiper-ui, and components/skiper-ui/registry-sources.json
records official download URLs and original registry-response SHA-256 hashes.
The official shadcn CLI verified both installed files against the registry before
local adaptation. Preserve the license comments and visible Skiper UI attribution.

| Component | Fit | Decision |
| --- | --- | --- |
| 52 ExpandOnHover | Expanding photographic frames | Installed and integrated as Expand mode |
| 47 Perspective Carousel | Spatial film-strip navigation | Installed and integrated as Film mode |
| 66 SVG Clip Path Mask | Occasional photographic framing | Good future candidate; current custom selector mask retained |
| 80 Projects Showcase | Developer project-to-detail choreography | Pro license required; not installed |
| 18 Image Cursor Trail | Momentary photographic preview | Pro license required; not installed |

Official sources: https://skiper-ui.com/v1/skiper52,
https://skiper-ui.com/v1/skiper47, https://skiper-ui.com/v1/skiper66,
https://skiper-ui.com/v1/skiper80, https://skiper-ui.com/v1/skiper18.

Adaptations retain the registry components' interaction structures while adding
Next Image, semantic buttons, keyboard focus, full-screen viewer callbacks,
scoped navigation controls, responsive dimensions and reduced-motion behavior.
Carousel autoplay is disabled. Swiper supplies keyboard/A11y navigation.
Unused bundled demo assets and Swiper CSS imports were removed from ExpandOnHover.
Dependencies added: swiper, clsx, tailwind-merge. Existing Framer Motion retained.

Eight temporary Unsplash photos are explicitly labeled as demonstration imagery
in the hero, collection and viewer. Their original source URLs and license are
recorded in public/photos/demo/SOURCES.md. Replace content/duality.ts records and
set photographyIsDemo to false when original photography is supplied.

Validation: scoped ESLint, TypeScript and production build passed. Browser checks
opened both installed components, navigated the full-screen viewer, dismissed it
with Escape, switched to exhibition/contact modes and counted all eight frames.
No page errors or mobile document overflow were observed. Desktop and mobile
screenshots were inspected; carousel vertical whitespace was subsequently reduced.
