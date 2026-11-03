# Photography — guided sequence

This override supersedes the Field of Vision opening. The user authorized applying
the recommendations in photographer-reference-research.md.

The public experience now begins with a full-viewport photograph and one obvious
continuation into the editorial sequence. The eight demo images appear once in
that sequence: opening, staggered pair, panorama, three-frame interactive light
study, and a quiet night photograph. The order is an illustrative edit of generic
Unsplash images, not an invented authorial series or record of travel.

Use Joshua Kissi's photographic hierarchy as a conceptual reference, Dennis
Swiatkowski / Quentin de Briey's changes of image scale and adjacency, and the
secondary archive role documented for Clément Merouani. No reference source code
or photographs were copied.

Skiper 52 is integrated into one meaningful three-frame passage. Skiper 47 and
the original infinite canvas live in a collapsed Explore the Archive section,
alongside a direct index. The canvas is loaded dynamically only when requested.
The native full-screen viewer preserves image proportions and keyboard behavior.

New image scenes reveal once as they enter the viewport; reduced motion renders
their final state. Mobile uses a staggered vertical edit. The hero requests a
larger source for its tall cover crop rather than sizing only by viewport width.

Validation: production build, TypeScript and scoped ESLint passed. Browser checks
verified the canvas is absent initially, then mounts on archive expansion; all
eight index entries, both Skiper components, viewer opening/browsing/Escape, and
archive closure work. No page errors or mobile horizontal overflow were observed.
Desktop opening, pair, loaded Skiper passage and mobile opening screenshots were
inspected. All three light-study images decoded successfully; hover selection
was verified independently of click-to-open.
