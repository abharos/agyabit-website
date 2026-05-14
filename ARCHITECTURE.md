# Architecture

## System overview
Marketing website for **Agyabit**, an AI-automation agency for the Dutch SME market. Primary audience: estate agents, healthcare practices, driving schools, investors. The site is a single-page Dutch homepage with anchored sections plus a subpage stub for "Complexe Projecten" (defence / government / critical infrastructure). The MVP is a static SPA — no backend, no CMS yet.

## Tech stack
- **Framework**: React 18 + Vite 5 (SPA).
- **Styling**: Tailwind CSS 3 with extended brand tokens. `Inter` (body), `Space Grotesk` (display), `JetBrains Mono` (mono).
- **Icons**: `iconify-icon` web component, primarily the `solar:` and `ri:` icon sets.
- **Background FX**: WebGL fragment shader (custom fbm noise + beam), SVG path animations, CSS reveal/glow effects.
- **Hosting target**: Vercel or Hetzner (EU); not yet wired.

> Brief preference was Next.js or Astro. We started from a Vite-React template provided by the client; migration to Next.js can happen later once we need SSR / route-based subpages / server actions for the contact form. See `AGENT_NOTES.md`.

## Key components
- `src/main.jsx` — React entry, mounts `<App />`, loads `iconify-icon` and global CSS.
- `src/App.jsx` — All page sections and the `WebGLBackground` component (single-file by design — easy to scan during early iteration).
- `src/index.css` — Tailwind layers + brand-specific custom classes (`text-metallic`, `glow-card`, `reveal`, `boot-anim-*`).
- `tailwind.config.js` — Brand colour tokens (`bg #0D0D1A`, `primary #2F3E5C` anthracite-blue, `accent #6B7FA0` medium anthracite-blue, `ink #E6E8F2`) and font families.
- `index.html` — Document shell, `lang="nl"`, font preconnect, meta description.

## Data flow
Static site, no runtime data flow yet. Future: contact form posts to a serverless endpoint (Vercel function or similar) and Calendly/Cal.com is embedded as an iframe in the contact section.

## External integrations
- **Planned**: Calendly or Cal.com inline embed; mailto fallback to `hallo@agyabit.com`; WhatsApp deep link (`wa.me/`); Google Analytics 4; LinkedIn link.
- **Currently stubbed**: WhatsApp / mail / LinkedIn URLs are placeholders pending real numbers and account.

## Decisions and trade-offs
- **Single-file `App.jsx`** — sections are not yet split into components. Cheap to read end-to-end during design iteration; will split once a section is reused or needs its own state.
- **Vite over Next.js** — accepted the template the client provided rather than rewrite up-front. Re-evaluate when we add: real subpages with their own SEO, contact-form backend, or a CMS.
- **WebGL background kept** — atmospheric beam from the source template was recoloured to brand blue instead of dropped, because the brief asks for a "dark, modern, tech-forward (Vercel / Linear)" feel. Cheap fallback path: replace the canvas with a static gradient if the shader is judged too noisy on the brand.
- **Cookie banner implementation** — minimal localStorage gate; not a full consent-management platform. Acceptable for an MVP, but must be replaced before any non-analytics tracking is added.
