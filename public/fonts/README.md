# DUALITY font assets

The active interface uses three locally hosted WOFF2 files through
`next/font/local` in `app/layout.tsx`. No Google Fonts requests are made by
visitors. The Latin subsets include Portuguese precomposed accented characters.

| File | Role | Weights/styles |
| --- | --- | --- |
| archivo-latin.woff2 | Shared identity, Developer display and body | Variable 400–800, normal |
| jetbrains-mono-latin.woff2 | Navigation, counters, annotations | Variable 400–500, normal |
| newsreader-italic-latin.woff2 | Photography display accents | Variable 400–500, italic |

Fetched on 2026-10-30 from the official Google Fonts CSS API's Latin WOFF2
resources, using these family specifications:

- https://fonts.googleapis.com/css2?family=Archivo:wght@400..800&display=swap
- https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400..500&display=swap
- https://fonts.googleapis.com/css2?family=Newsreader:ital,wght@1,400..500&display=swap

Each family is licensed under the SIL Open Font License 1.1. The accompanying
`OFL-Archivo.txt`, `OFL-JetBrains-Mono.txt` and `OFL-Newsreader.txt` preserve the
license and copyright notices. Upstream repositories:

- https://github.com/Omnibus-Type/Archivo
- https://github.com/JetBrains/JetBrainsMono
- https://github.com/productiontype/Newsreader

The two older Archivo TTF assets are retained but are no longer referenced by
the active layout or global font-face rules.
