# Notes for AI agents working on this codebase

## Important context
- Source-of-truth brief: `.context/attachments/Agyabit_Website_Brief.docx` (Dutch). All copy must stay Dutch unless the brief's "EN toggle (fase 2)" is being implemented.
- Starting template (Nexus Cyber Defense Grid) is in `.context/attachments/Recreate-the-attached-Nexus-Cyber-Defense-Grid-La.zip`. Don't re-extract it into `src/` — the current code is the adapted version.
- Brand palette is locked in two places: `tailwind.config.js` (`bg / primary / accent / ink`) **and** the WebGL fragment shader inside `src/App.jsx` (look for `beamColor` / `smokeColor`). Update both if the palette changes.

## Best practices for this codebase
- Keep sections accessible by anchored `id`s that match the nav (`#diensten`, `#hoe`, `#cases`, `#complexe-projecten`, `#over`, `#contact`). Renaming an ID = updating the nav.
- New cards should get the `glow-card reveal` classes so they pick up the mouse-tracked border glow and intersection-observer fade-in for free.
- Iconify icons are loaded lazily by the web component. Use the `iconify-icon` JSX element with a `class` (not `className`) attribute — the wrapper is HTML, not React.
- Copy length: hero subhead ~25 words max; service cards ~30 words; case cards ~35 words. The visual grid breaks if a card runs much longer than its peers.

## Known edge cases and gotchas
- **WebGL on no-GL devices**: `WebGLBackground` silently no-ops if `canvas.getContext('webgl')` returns null. Don't add a fallback canvas without checking what the brand wants — a plain dark background is fine.
- **`text-metallic` is a soft white→light-blue→primary gradient, not the original "chrome stripe" effect.** The chrome look (with a dark band mid-letter at the background colour) was unreadable in the Agyabit blue palette — the highlights weren't bright enough to compensate. If you reintroduce the dark band, raise the highlight colours well above `#DCE2FF` or the headline will disappear into the background.
- **`iconify-icon` requires `class=` not `className=`.** React will not crash but Tailwind classes will be silently dropped if you write `className`.
- **Cookie banner stores `agyabit_cookie_consent=1` in localStorage.** To re-test the banner, clear that key in DevTools — there is no "withdraw consent" UI yet.
- **`wa.me/`, `mailto:hallo@agyabit.com`, KVK number `00000000`** are all placeholders. Search for these strings before launch.

## Things that look wrong but aren't
- The WebGL canvas sits behind several **overlaying** fixed-position divs (grain, scanlines, vignette, beam SVG, three coloured polygon HUD shapes). They look redundant individually; the effect is cumulative. Don't strip any one of them in isolation.
- `boot-anim-*` classes start the page in a "pre-boot" state and transition once the root `<div>` gains the `app-booted` class (100 ms after mount). If you remove the `setIsBooted(true)` timer, the hero will stay invisible.
- `.reveal` elements are opacity-0 until the IntersectionObserver adds `.active`. Don't `display: none` a section that should appear later — opacity is the right lever.

## Areas requiring extra care
- **`src/App.jsx`** is currently one big file. Resist refactoring it into a tree of components until at least two sections share state or are reused — premature splitting will hurt iteration speed during the design phase.
- **The WebGL shader** is performance-sensitive and runs every frame. If you add another full-screen animated effect, profile first or expect dropped frames on mobile.
- **Complexe Projecten subpage** does not yet exist as a real route; the homepage section is only a teaser. When you build the subpage, the brief calls for a deliberately more formal tone, no WhatsApp button, and a PDF-download CTA — those are tonally different from the rest of the site.
