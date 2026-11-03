# Color and typography audit

Date: 2026-10-30. Review only; no visual implementation changed.

## Evidence

Inspected the local rendered selector, Developer hero/project index, Photography
grid/contact/viewer at 1620 × 990 and the three entry screens at 375 × 812.
Used reduced motion for stable captures. Checked computed CSS, loaded fonts and
Chromium platform font reports. Screenshots and raw computed-style results are
in the temporary `duality-qa` directory, outside the repository.

The fonts actually rendering are Archivo (locally hosted), Georgia Italic and
Courier New. Archivo is not silently falling back to Arial in the tested browser.
Next.js development overlay fonts were excluded from the design assessment.

## Skill research applied

Queried ui-ux-pro-max with:

- `photography portfolio neutral --domain color`: Portfolio/Personal and
  Photography Studio matches favor restrained neutrals and strong text contrast.
  Their generic blue accent / pure black suggestions do not supersede DUALITY's
  deliberately warm photographic world.
- `editorial portfolio contrast --domain typography`: Minimalist Portfolio
  supports Archivo; editorial results support a serif/sans/mono role hierarchy.
  Rejected the all-serif first result as unsuitable for the Developer identity.
- `Archivo editorial --domain typography`: verified Minimalist Portfolio match.
- `text contrast readability --domain ux`: prioritize readable secondary text
  and 4.5:1 contrast for normal text.
- `next/font --stack nextjs`: self-hosted font loading recommended if changed.
  The first broader font-loading query returned unrelated results and was retried.

## Palette findings

The cold/warm distinction is appropriate. Preserve the core colors instead of
introducing a new palette. Photography's warm paper helps establish the gallery
as a distinct world; keep its warmth restrained so photographs dominate.

Contrast calculations for opaque flat-color pairs:

| Pair | Ratio | Assessment |
| --- | --- | --- |
| Developer #F1F2F8 on #142B80 | 11.14:1 | Strong |
| Developer #101629 on #EEF0F7 | 15.78:1 | Strong |
| Photography #392B26 on #F3EEE6 | 11.75:1 | Strong |
| Photography contact #FFF0E4 on #392B26 | 12.17:1 | Strong |
| Copper #D66744 on photography paper #F3EEE6 | 3.09:1 | Decoration/large text only |
| Suggested text copper #A4442A on #F3EEE6 | 5.29:1 | Suitable for normal text |
| Soft white #F1F2F8 on cobalt #4169E1 | 4.34:1 | Avoid for small normal-weight text |
| Steel #8993A8 on Developer paper #EEF0F7 | 2.71:1 | Avoid for informative text |

The last four rows are token-pair usage constraints, not claims that all those
combinations currently appear as body text. The sampled active text on flat
surfaces did not show a clear contrast failure. Automated results for text-bearing
container buttons and the disabled Reset control were excluded: descendants have
their own backgrounds, and disabled controls are exempt from text contrast rules.
Photo overlays need separate image-by-image checking; these ratios do not certify
contrast over every photograph or animation state.

## Typography findings and recommendations

1. Keep Archivo as the shared identity. Its oversized ExtraBold selector title
   works; its regular weight supports the project index without competing with
   screenshots. An additional sans family would add little here.
2. Increase important navigation, instructions, discipline labels and counters
   to 12–13 px. Current desktop metadata is often 9–11 px; mobile gallery metadata
   drops to 7–8 px. Strong color contrast does not compensate for tiny type.
   Keep normal descriptive copy around 16 px with appropriate line height.
3. Replace Courier New with JetBrains Mono for a cleaner technical annotation
   voice. This is an art-direction recommendation, not a claim Courier is broken.
4. Reserve serif expression primarily for Photography. Georgia Italic currently
   appears in both worlds' main statements and section titles, reducing their
   distinction. Keep Developer hero type sans with weight/scale contrast.
5. Consider Newsreader Italic for Photography's expressive words and viewer
   titles. Retaining Georgia is also viable; this has lower priority than size
   and hierarchy. Inspect the actual replacement before committing to it.
6. Loosen tracking in secondary headlines, especially the mobile Photography
   title. Preserve aggressive spacing for selected monumental compositions,
   rather than applying similar tightness to every heading.

Proposed roles: Archivo shared display/body; JetBrains Mono small annotations;
Newsreader Italic photographic emphasis. Keep the system to three families.

## Implementation priorities

1. Improve small text size and mobile header hierarchy.
2. Separate Developer's typographic voice from Photography's serif expression.
3. Refine the mono and optional photographic serif.
4. Centralize semantic color tokens: several old photography styles still
   contain paper/ink variants that are overridden by later stylesheets.
5. Recheck title wrapping, focus outlines, active/hover states and image-caption
   contrast after changes. Current screenshots establish a baseline only.

Official typeface references:

- Archivo: https://github.com/Omnibus-Type/Archivo
- JetBrains Mono: https://github.com/JetBrains/JetBrainsMono
- Newsreader: https://github.com/productiontype/Newsreader

Font substitution and palette refinements above are recommendations; they have
not been installed, visually compared, or applied in this audit.
