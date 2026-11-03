# Continuous photography grid

Supersedes Contact Room and the curated multi-section presentation following the
user's explicit request to show every photo in an orientation-aware scrolling grid.

PhotoGrid is now the sole photography gallery. Its CSS grid uses metadata-based
row spans, 2/3/4 responsive columns and exact image aspect ratios. Images use
intrinsic width/height with no cover crop. Source/DOM order stays intact; grid
items pack by available row space rather than rebalancing CSS columns on append.
ResizeObserver recalculates row spans when the actual container width changes.
Soft squircle corners and the existing full-screen native dialog are retained.

The first 24 records mount initially, followed by batches of 24 when a sentinel
approaches within 600px of the viewport. A manual Load More action remains as a
keyboard/fallback alternative and focuses the first newly added frame. Next Image
handles lazy loading below the first two frames. No infinite loops/repeated images.
The collection ends explicitly and leaves the contact section reachable.

Automatic folder import still applies to all original photos. Demo imagery is
labeled. The former photo stack, separate highlights, light table and archive
are no longer mounted, avoiding duplicated presentations and image requests.

UI/UX Pro Max's nextjs `image lazy loading` search recommends next/image and
reserving dimensions. Its broad infinite-scroll search did not provide a verified
pagination pattern; batching is an implementation choice with a keyboard fallback.

Validation used 60 temporary images spanning portrait 2:3, landscape 3:2, square
and panoramic proportions. Rendered aspect ratios matched metadata (0.667, 1.5,
1, 2.308). Initial mount count was 24; scrolling reached all 60. Last-frame viewing,
arrow-key navigation, Escape and focus restoration worked without page errors.
375px mobile mounted 24 initially and had no document overflow. Mixed desktop and
mobile screenshots were inspected. All temporary fixtures were removed afterward.
