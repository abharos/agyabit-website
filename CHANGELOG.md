# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial Agyabit website scaffold: Vite + React 18 + Tailwind CSS 3, single-page Dutch homepage.
- Homepage sections per brief: Hero, Stat strip, Wat wij doen (3 services), Hoe het werkt (3 steps), Cases (Makelaars / Tandartspraktijken / Rijscholen), Complexe Projecten teaser, Over Agyabit, Contact (Calendly placeholder), Footer.
- WebGL animated background (recolored to electric-blue `#1A1AFF` / `#5C7CFF` palette) carried over from the Nexus template starting point.
- Brand palette tokens in `tailwind.config.js` (`bg`, `primary`, `accent`, `ink`); Inter + Space Grotesk + JetBrains Mono fonts.
- Sticky WhatsApp CTA, basic GDPR cookie banner (localStorage-gated), in-page anchor nav.
- AI-collaboration docs: `CHANGELOG.md`, `ARCHITECTURE.md`, `AGENT_NOTES.md`, `CLAUDE.md`.

### Changed
- Brand palette shifted from electric blue (`#1A1AFF` / `#5C7CFF`) to anthracite-blue (`primary #2F3E5C` / `accent #6B7FA0`). Updated Tailwind tokens, hardcoded hex strings in `src/App.jsx`, WebGL shader `beamColor` / `smokeColor`, `.text-metallic` gradient stops in `src/index.css`, and the `selection:bg-*` class in `index.html`.

### Fixed
- Hero headline (`.text-metallic`) was unreadable: gradient went through the page background colour mid-letter. Replaced with a clean white → light steel → anthracite gradient that stays legible on dark.
- Nav + footer logo glyph (inner dot) had become invisible after the anthracite-blue palette shift — dot and frame fill were the same colour. Replaced with a `LogoMark` component: framed anthracite badge with a white stylised "A" glyph (inline SVG), reused in nav and footer.

### Removed
