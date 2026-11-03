# Photographer portfolio research

Research requested after the Field of Vision implementation. This is an analysis,
not authorization to replace the current UI. No application code changed.

## Direct visual observations

Desktop screenshots and a scroll pass were inspected in headless Edge for:

- Romain Laprade: https://www.romainlaprade.com/ — white archival overview,
  small project thumbnails with clear gaps and a long left-side project index.
  Strong repeated color relationships across otherwise different subjects. This
  demonstrates archival coherence rather than a novel animated control.
- Dennis Swiatkowski: https://www.dennisswiatkowski.com/ — photographs appear
  immediately below compact identity/navigation. Large portrait images share
  rows with landscape images and white gutters. Portrait, travel and details
  create rhythm through their adjacency, without elaborate interface furniture.
- Joshua Kissi: https://www.joshuakissi.com/ — a dark stage with a prominent
  central portrait, adjacent previews, project title, ordinal and a scroll cue.
  The Blackpepper Studio's case study explains the use of image-related background
  colors: https://www.theblackpepperstudio.com/projects/joshua-kissi.
- Quentin de Briey: https://www.quentindebrieystudio.com/photography — compact
  identity/navigation, dense multi-column editorial imagery, varying image
  proportions and printed/editorial artifacts preserved inside photographs.

## Documented experimental reference

Clément Merouani, https://clmt.paris/.
The Communication Arts interview contains direct responses from the designer and
developer: https://www.commarts.com/webpicks/clement-merouani.
It describes magazine-cover packaging that dissolves to enter a photographic
series, continuity into the next series, and an infinite wall as an Index view.
This is evidence of the published design, not confirmation that the live site
still implements every described interaction; its live navigation was unreliable
during this research.

## Interpretation for DUALITY

The current title, four equally prominent modes, coordinates, pan/zoom controls
and inset canvas make navigation mechanics precede the photographic encounter.
Eight generic landscape photos repeated infinitely read as a repeated texture,
not a curated body of work. These are design judgments, not usability-test results.

Recommended direction: begin with a large selected photograph, give visitors one
obvious next gesture, and reveal photography in edited series with deliberate
changes of scale, adjacent pairs and pauses. Preserve original framing. Use a
single signature transition between series; place the canvas behind an Archive
entry, where free exploration has a meaningful role. Skiper components should
serve that sequence rather than appear as a menu of component demonstrations.

## Skill application

ui-ux-pro-max `photography portfolio --domain product` matched Photography Studio:
Motion-Driven + Minimalism & Swiss Style, storytelling / hero-centric composition.
This supports an image-led opening and coherent series. Searches for `primary
action` and `cognitive load` did not return suitable guidance for interface choice
overload; that diagnosis is independent design judgment, not a verified skill
database finding. Existing keyboard, reduced-motion and direct-access alternatives
remain requirements for any future direction.
