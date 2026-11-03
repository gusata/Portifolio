# Out of Frame / Contact Room

Supersedes the guided editorial opening following the user's request for a more
creative rebuild with rounded corners and squircles.

The UI/UX Pro Max query `photography playful editorial` matched Motion-Driven,
spacious storytelling. Apply that guidance through a composed interactive photo
stack rather than a long linear opening. Retain the original warm brand palette.

The selected photograph controls an accompanying paper color. A thumbnail tray,
adjacent prints and an explicit discovery button provide reversible selection.
The main photograph opens the existing native dialog. No autoplay is used.
An irregular four-image contact sheet follows, with Skiper 52 as a rounded light
study. The infinite canvas, Skiper 47 and direct index remain in the secondary
archive. Stock imagery is explicitly identified as demonstration work.

Corners use native `corner-shape: squircle` when supported (observed computed
value: superellipse(2)). A shared normalized SVG curve provides a fallback on
photographic surfaces via .soft-cut. Ordinary rounded corners remain on controls
in older browsers. The Skiper 63 blur/filter method was reviewed, but not installed
or copied: no image-blurring filter or new dependency was needed.

Reference: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/Properties/corner-shape
and https://skiper-ui.com/v1/skiper63.

Validation: build, TypeScript and scoped ESLint passed. Browser checks verified
thumbnail selection, discovery, modal opening/next/Escape, archive loading and
375px mobile without horizontal overflow or page errors. Desktop, mobile and
contact-sheet screenshots were inspected; mobile spacing was subsequently refined.
