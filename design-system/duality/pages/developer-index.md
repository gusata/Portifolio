# Developer / interactive work index

Implements the approved direction from developer-reference-research.md. Replaces
the six repeated ProjectScene sections with one searchable/filterable catalog.
The photography implementation is unchanged.

ProjectIndex derives counts and results from content/duality.ts. Grouping uses
existing disciplines: AI tooling/documentation and document OCR are Tools; other
current products are Products. Search matches name, discipline and description.
No fabricated dates, screenshots or achievements were added.

Desktop shows compact rows beside one sticky preview. Pointer entry and keyboard
focus update the preview; row/preview activation opens existing project details.
The first real product image is the initial preview. Projects without screenshots
retain explicitly labeled typographic studies at the smaller preview scale.
Filtering derives a valid preview immediately without stale previous results.
Zero matches produces a helpful empty state and the persistent reset action.

Mobile uses compact thumbnail rows and one-tap opening; the large preview is
omitted to avoid duplicating every project. Filter controls wrap and the search
input stays at 16px. Browser/keyboard interactions preserve focus on closing the
detail overlay. Reduced motion removes preview entrance transforms.

The opening and about composition were shortened to bring work closer. Existing
cobalt/ice identity and rounded surfaces are retained. No pagination or list
virtualization is added for the current six records.

Validation at 1620x990: total document height changed from 10,004px to 3,410px;
no .exhibit sections remain. Hover preview selected LEIA; keyboard focus selected
Quiet Head; Enter opened details and Escape returned to the exact project row.
Tools returned ClaudeFy/LEIA/Blitz; OCR search returned Blitz; no-match and reset
were verified. At 375px a tap opened Bob directly and no horizontal overflow was
reported. Desktop/mobile/detail screenshots were inspected. No browser errors;
production build, TypeScript and scoped ESLint passed.
