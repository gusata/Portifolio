# Folder-based photography publishing

User requested an easier way to add personal photos. The server page now reads
public/photos/portfolio using lib/photography.ts and passes a serializable library
through PhotographyProvider. Browser components never import filesystem code.

JPG/JPEG, PNG, WebP and AVIF files are discovered recursively, numerically sorted
and measured using Sharp, now an explicit dependency. Titles/alt text derive from
descriptive filenames; leading sequence numbers are removed. Subfolders provide
collection names. Missing/empty folders use the existing demo catalog. Personal
photos replace the entire demo library and automatically disable demo messaging.
Invalid image files are skipped with a server warning. Metadata is read from a
buffer, and Sharp's filename-handle cache is disabled to allow Windows users to
replace/remove images without retained file locks.

The photo layout now supports arbitrary counts: total counters are dynamic,
feature indices are bounded, a single photo hides redundant neighboring prints
and the light study, and larger thumbnail trays scroll within their own bounds.
All images remain accessible from the archive. Current eight-demo curation is
preserved when no personal images exist.

No upload endpoint, database or public write access was introduced. Development
reads the folder on page refresh; production uses the normal rebuild/redeploy
workflow. public/photos/portfolio/COMO-ADICIONAR.md and README document that limit.

Validation used temporary local fixtures: one EXIF-rotated JPG with an accented
filename, then 12 images, uppercase extension, an invalid PNG and a subfolder.
Counts, titles, demo state, last-image viewer access, index count and no mobile
overflow were verified. After removal, the eight-image demo catalog returned.
Temporary fixtures were removed; the personal folder contains only instructions.
