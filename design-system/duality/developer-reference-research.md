# Developer portfolio scalability research

User requested analysis of creative portfolios with large project catalogs. This
file records research; application components were not changed during this task.

## Current implementation

At 1620x990, the Developer document measured 10,004px tall. Its six .exhibit
sections measured approximately 1,115px each (Quiet Head: 1,113px). ProjectScene
is repeated for every record, so adding work adds another full scene and repeats
scroll masks, artwork, description and CTA. The six-item gallery alone occupies
about 6,688px. Preview artwork for three projects is a typographic study rather
than a real product screenshot, so the screen allocation overemphasizes those
studies relative to evidence of the product. Totals/intro text are hard-coded to
six in several places, which would also need a data-driven count in a rebuild.

## References

- Dennis Snellenberg: https://www.dennissnellenberg.com/work — current official
  page lists 11 selected development projects, Design/Development filters, list
  and grid controls, and a separate Archive entry displaying 66. A desktop list
  screenshot and scroll pass were inspected. The selected/full archive split is
  particularly relevant to long-term growth of a personal portfolio.
- Locomotive: https://locomotive.ca/en/work — official catalog displays 46 projects
  and categories with counts (Branding, Digital, Experience, E-commerce, Content).
  Desktop inspection showed a compact multi-column project index. This studio is
  a reference for organizing volume, not for copying agency content or scale.
- Aristide Benoist: https://aristidebenoist.com/folio-v1 — official project markup
  exposes an ordinal /30 collection. The live page rendered a cinematic central
  project presentation with a rail of preview thumbnails and a Projects control.
  The reference is direct navigation between works without forcing every work
  into the main document's vertical flow. This is the legacy route inspected,
  not a claim about every version of his portfolio.
- Brittany Chiang: https://brittanychiang.com/archive — official archive provides
  a compact project table with year, project and stack information. Reviewed via
  page content rather than interactive screenshot; valuable for archive structure,
  not the primary visual direction of DUALITY.
- Lusion: https://lusion.co/projects/ — official catalog contains 19 projects with
  discipline metadata. The screenshot attempt remained on the loading view, so
  no interaction or completed visual-layout claim is made from that capture.

## Recommended direction for DUALITY

A single interactive work index: compact project rows alongside one large sticky
preview. Hover and keyboard focus update the preview; clicking a row opens the
project's details. A short summary/category stays available without hover. Mobile
gets direct tap-to-open rows with small previews, avoiding a two-tap dependency.
Use cobalt, ice, expressive typography and rounded preview surfaces to retain
the Developer world's identity. No conventional repetitive card wall is required.

All six current records belong in the index from day one. At larger catalog sizes,
add meaningful category filters and search rather than additional cinematic
sections. At most two curated highlights could precede the full index if there is
strong real product imagery. Keep details and future case studies on demand.
Do not add pagination or virtualization for six records. For much larger datasets,
evaluate those against actual load and navigation requirements.

## Skill findings

ui-ux-pro-max `portfolio creative developer --domain product` matched Portfolio /
Personal, recommending Motion-Driven + Minimalism & Swiss Style and artistic brand
interpretation. The initial combined filtering query had no match; the explicit
`filter --domain ux` retry matched Chip Collection Reflow: wrap filter controls
instead of clipping labels. Existing rules require keyboard access and touch
alternatives to hover, which constrain the preview design above. The architectural
recommendation is a design synthesis of the inspected references and local page,
not a database-prescribed layout.
