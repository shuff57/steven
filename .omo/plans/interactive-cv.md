# Interactive CV Website — Steven Huff

## TL;DR

> **Quick Summary**: Build a multi-page interactive CV website for Steven Huff (math educator, CS teacher, curriculum developer, tool builder) using a dark chalkboard aesthetic with scroll-driven animations, an interactive project showcase, and subtle math visualizations. All 10 pages of CV content presented interactively across 6 routes.
> 
> **Deliverables**:
> - Multi-page Next.js website with 6 routes (Home, Experience, Projects, Education, Skills, Contact)
> - Dark chalkboard theme with teal accent color, graph-paper textures, chalk-style typography
> - GSAP ScrollTrigger scroll-driven animations on every page
> - Interactive project showcase (bento grid with expandable cards) for D.A.D, O.G.R.E, raSHio, bookSHelf, etc.
> - Animated teaching timeline showing 2015-present career journey with parallel concurrent positions
> - 2 subtle math visualizations (animated trig curve + interactive normal distribution)
> - PDF download button (serves existing CV PDF)
> - Full mobile responsiveness with prefers-reduced-motion support
> - Deployable to Vercel / Cloudflare Pages / GitHub Pages
> 
> **Estimated Effort**: Large (20+ tasks across 5 waves)
> **Parallel Execution**: YES - 5 waves
> **Critical Path**: Task 1 (scaffold) -> Task 2 (data) -> Task 5 (layout) -> Tasks 6-11 (pages) -> Tasks 12-16 (animations) -> Tasks 17-18 (math viz) -> Tasks 19-21 (polish) -> F1-F4 (verification)

---

## Context

### Original Request
Steven wants to turn his 10-page academic CV (PDF) into an interactive webpage. He was unsure what style to pursue, so we researched dozens of examples across terminal-style, game-style, 3D, scroll-animated, and modern portfolio approaches. After reviewing options, he chose a combination of scroll-animated timeline, interactive project showcase, and clean modern micro-interactions.

### Interview Summary
**Key Discussions**:
- **Style**: Scroll-animated timeline + Interactive project showcase + Micro-interactions (NOT game/terminal/3D)
- **Structure**: Multi-page with shared navigation (not a single long-scrolling page)
- **Visual**: Dark mode with accent colors + Math/chalkboard aesthetic (slate grays, chalk whites, graph-paper textures)
- **Ambition**: Go big — WOW factor. No rush, do it right.
- **Audience**: Academic hiring committees, grant reviewers, K-12 administrators, general professional presence
- **Math viz**: 1-2 subtle interactive visualizations (tasteful, not overdone)
- **Maintenance**: AI-assisted — Steven will use Claude/AI tools to update content
- **Content scope**: Full CV — all sections presented interactively
- **PDF**: Serve existing PDF as download (no auto-generation)
- **Hosting**: TBD (build first, deploy later)

**Research Findings**:
- Best animation stack for 2026: Next.js + GSAP ScrollTrigger + Framer Motion (LazyMotion) + Tailwind
- GSAP ScrollTrigger is the industry standard for scroll-synced animations; recently made fully free
- Lenis is the current standard for smooth scrolling (replaced Locomotive Scroll)
- Performance target: < 500kb initial bundle, < 3s load
- Mobile-first with prefers-reduced-motion is non-negotiable
- Always provide a "Download PDF" escape hatch for traditional viewers
- Content in TypeScript data files is best for AI-assisted maintenance

### Metis Review
**Identified Gaps** (all addressed):
- Content architecture: Resolved — TypeScript data files for all CV content
- PDF strategy: Resolved — serve existing PDF, no auto-generation
- Math viz specifics: Resolved — animated trig curve + interactive normal distribution
- Contact approach: Resolved — mailto link only, no form (no backend)
- Animation library conflict: Resolved — strict ownership rules (GSAP for scroll, Motion for transitions)
- Bundle size risk: Resolved — use LazyMotion (~4.6kb) instead of full Motion (~34kb)
- Phone number privacy: Noted as default-applied (see below)
- Route/scroll cleanup: Resolved — mandatory useGSAP hook pattern

---

## Work Objectives

### Core Objective
Transform Steven Huff's 10-page academic CV into a visually stunning, interactive multi-page website with a dark chalkboard aesthetic that impresses academic hiring committees, grant reviewers, and administrators while remaining fully accessible and performant.

### Concrete Deliverables
- Next.js 14+ App Router project with 6 page routes
- Centralized CV data in TypeScript files (easy AI-assisted updates)
- Dark chalkboard design system (CSS custom properties, Tailwind config)
- GSAP ScrollTrigger animations on every page section
- Teaching timeline with parallel lanes for concurrent positions
- Project showcase bento grid with expandable cards
- 2 math visualizations (trig curve animation, interactive normal distribution)
- Shared navigation with active page indicator
- Footer with contact info and PDF download
- Mobile-responsive layouts at 375px and 768px+ breakpoints
- prefers-reduced-motion support throughout
- Print stylesheet for clean printable output

### Definition of Done
- [ ] `npm run build` succeeds with zero errors
- [ ] `npx next lint` passes with zero errors
- [ ] All 6 routes render correctly at 375px and 1280px viewports
- [ ] PDF download works on desktop Chrome and iOS Safari
- [ ] prefers-reduced-motion disables all scroll animations
- [ ] Lighthouse Performance >= 90, Accessibility >= 90
- [ ] All external links from CV (scholarworks, shinyapps, GitHub) open correctly

### Must Have
- All CV content from the PDF is present on the website (nothing omitted)
- Dark chalkboard theme with teal accent color
- Scroll-driven animations using GSAP ScrollTrigger
- Interactive project showcase with expandable descriptions
- Teaching career timeline with visual handling of concurrent positions
- PDF download button in header/nav
- Mobile-responsive at 375px width
- prefers-reduced-motion support
- Keyboard navigable (Tab through all interactive elements)

### Must NOT Have (Guardrails)
- NO backend or database — static site only
- NO contact form — use mailto: link
- NO CMS or admin panel — content lives in TypeScript data files
- NO auto-generated PDF — serve the existing PDF file
- NO blog or content management features
- NO user authentication or accounts
- NO 3D/WebGL environments (too heavy for this use case)
- NO game mechanics or terminal/CLI interactions
- NO more than 2 math visualizations (scope cap)
- NO more than 6 page routes (scope cap)
- NO image asset textures — all textures via CSS/SVG patterns
- NO novel per-section animations — use ONLY the fixed animation vocabulary: fade-in, slide-up, stagger-children, parallax, text-reveal, scale-in
- NO animating the same DOM element with both GSAP and Motion
- NO importing raw gsap except in the centralized config file
- NO full `motion` component — use `LazyMotion` + `m` component only (~4.6kb vs ~34kb)
- NO tablet-specific breakpoint (mobile < 768px, desktop >= 768px only)
- AVOID excessive course descriptions inline — use progressive disclosure (collapsed by default)
- AVOID over-engineering SEO — basic meta tags + OG image only

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (greenfield project)
- **Automated tests**: None (portfolio site — visual QA via Playwright is primary verification)
- **Framework**: N/A
- **Primary QA**: Agent-executed Playwright browser tests + Lighthouse CLI audits

### QA Policy
Every task MUST include agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot at 375px and 1280px
- **Build/Lint**: Use Bash — `npm run build`, `npx next lint`, bundle size check
- **Performance**: Use Bash — Lighthouse CLI audit
- **Accessibility**: Use Playwright — keyboard navigation test, reduced-motion emulation

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — start immediately, all parallel):
├── Task 1: Project scaffolding + tooling config [quick]
├── Task 2: CV data extraction into TypeScript files [unspecified-high]
├── Task 3: Design system (chalkboard theme, tokens, CSS) [visual-engineering]
└── Task 4: Shared animation utilities + GSAP config [quick]

Wave 2 (Layout + Static Pages — after Wave 1, MAX PARALLEL):
├── Task 5: Root layout, navigation, footer [visual-engineering]
├── Task 6: Home / Hero page [visual-engineering]
├── Task 7: Teaching Experience page (timeline) [visual-engineering]
├── Task 8: Projects page (bento grid) [visual-engineering]
├── Task 9: Education & Research page [visual-engineering]
├── Task 10: Skills & Tech page [visual-engineering]
└── Task 11: Contact page + PDF download [visual-engineering]

Wave 3 (Animation Layer — after Wave 2, parallel groups):
├── Task 12: Scroll animation wrappers (GSAP ScrollTrigger) [deep]
├── Task 13: Page route transitions (Framer Motion) [visual-engineering]
├── Task 14: Timeline-specific animations [visual-engineering]
├── Task 15: Project card hover/expand interactions [visual-engineering]
└── Task 16: Hero section entrance animation [visual-engineering]

Wave 4 (Polish & Enhancement — after Wave 3):
├── Task 17: Math visualization #1 — Animated trig curve [deep]
├── Task 18: Math visualization #2 — Interactive normal distribution [deep]
├── Task 19: Mobile responsiveness pass (all pages at 375px) [visual-engineering]
├── Task 20: Accessibility pass (reduced-motion, keyboard nav, contrast) [unspecified-high]
└── Task 21: Performance optimization + print stylesheet [unspecified-high]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Full visual QA via Playwright [unspecified-high]
└── Task F4: Scope fidelity check [deep]

Critical Path: T1 → T5 → T6 → T12 → T16 → T19 → T21 → F1-F4
Parallel Speedup: ~65% faster than sequential
Max Concurrent: 7 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2-4, 5-11 | 1 |
| 2 | — | 5-11 | 1 |
| 3 | — | 5-11 | 1 |
| 4 | — | 12-16 | 1 |
| 5 | 1, 2, 3 | 6-11 | 2 |
| 6 | 5 | 16 | 2 |
| 7 | 5, 2 | 14 | 2 |
| 8 | 5, 2 | 15 | 2 |
| 9 | 5, 2 | — | 2 |
| 10 | 5, 2 | — | 2 |
| 11 | 5, 2 | — | 2 |
| 12 | 4, 5 | 14-16 | 3 |
| 13 | 5 | — | 3 |
| 14 | 12, 7 | — | 3 |
| 15 | 12, 8 | — | 3 |
| 16 | 12, 6 | — | 3 |
| 17 | 12 | — | 4 |
| 18 | 12 | — | 4 |
| 19 | 6-11 | — | 4 |
| 20 | 6-11, 12-16 | — | 4 |
| 21 | 6-11, 12-16 | — | 4 |
| F1-F4 | ALL | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 4 tasks — T1 `quick`, T2 `unspecified-high`, T3 `visual-engineering`, T4 `quick`
- **Wave 2**: 7 tasks — T5-T11 all `visual-engineering`
- **Wave 3**: 5 tasks — T12 `deep`, T13-T16 `visual-engineering`
- **Wave 4**: 5 tasks — T17-T18 `deep`, T19 `visual-engineering`, T20-T21 `unspecified-high`
- **Wave FINAL**: 4 tasks — F1 `oracle`, F2-F3 `unspecified-high`, F4 `deep`

---

## TODOs

> Implementation + verification = ONE task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.


### Wave 1 — Foundation

- [ ] 1. Project Scaffolding + Tooling Configuration

  **What to do**:
  - Initialize Next.js 14+ project with App Router (`npx create-next-app@latest --typescript --tailwind --app --src-dir`)
  - Install dependencies: `gsap`, `@gsap/react`, `lenis`, `framer-motion`
  - Configure `tsconfig.json` with strict mode and path aliases (`@/` for `src/`)
  - Set up Tailwind config with custom chalkboard color palette placeholder (Task 3 will define exact values)
  - Create project directory structure matching the architecture spec:
    ```
    src/app/ (routes), src/components/ui/, src/components/sections/,
    src/components/animations/, src/components/math-viz/,
    src/data/, src/lib/, src/styles/
    ```
  - Add `Curriculum Vitae.pdf` to `public/` directory for download
  - Create `.gitignore`, initialize git repo
  - Verify `npm run dev` starts successfully and `npm run build` completes

  **Must NOT do**:
  - Do NOT configure the chalkboard theme yet (Task 3)
  - Do NOT create any page content or components yet
  - Do NOT install 3D libraries (Three.js, react-three-fiber, Spline)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Standard scaffolding task with well-known tooling
  - **Skills**: [`coding-standards`]
    - `coding-standards`: Ensures TypeScript and project structure follow best practices
  - **Skills Evaluated but Omitted**:
    - `vercel-react-best-practices`: Premature — no React code to optimize yet

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3, 4)
  - **Blocks**: Tasks 5-11 (all pages need the project to exist)
  - **Blocked By**: None (can start immediately)

  **References**:
  - **External References**:
    - Next.js App Router docs: https://nextjs.org/docs/app
    - GSAP React integration: https://gsap.com/resources/React/
  - **Source file**: `Curriculum Vitae.pdf` in project root — copy to `public/`

  **Acceptance Criteria**:
  - [ ] `npm run dev` starts without errors on port 3000
  - [ ] `npm run build` completes with zero errors
  - [ ] All directories exist: `src/app/`, `src/components/`, `src/data/`, `src/lib/`
  - [ ] `public/Curriculum Vitae.pdf` exists and is downloadable
  - [ ] `package.json` contains: next, react, gsap, @gsap/react, lenis, framer-motion, tailwindcss

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Project builds successfully
    Tool: Bash
    Steps:
      1. Run `npm run build`
      2. Assert exit code is 0
      3. Assert `.next/` directory exists with build output
    Expected Result: Build completes with zero errors
    Failure Indicators: Non-zero exit code, TypeScript errors, missing dependencies
    Evidence: .sisyphus/evidence/task-1-build-success.txt

  Scenario: PDF is servable from public directory
    Tool: Bash
    Steps:
      1. Start dev server with `npm run dev &`
      2. Run `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/Curriculum%20Vitae.pdf`
      3. Assert HTTP status is 200
      4. Kill dev server
    Expected Result: PDF returns HTTP 200
    Failure Indicators: 404 or connection refused
    Evidence: .sisyphus/evidence/task-1-pdf-serve.txt
  ```

  **Commit**: YES (group with Wave 1)
  - Message: `feat(scaffold): initialize Next.js project with dependencies and directory structure`
  - Files: `package.json`, `tsconfig.json`, `tailwind.config.ts`, `src/`, `public/`
  - Pre-commit: `npm run build`

- [ ] 2. CV Data Extraction into TypeScript Files

  **What to do**:
  - Read the entire `Curriculum Vitae.pdf` (10 pages) and extract ALL content into structured TypeScript data files
  - Create the following data files with full type definitions:
    - `src/data/experience.ts` — All teaching positions (post-secondary, secondary, primary) with:
      - Institution name, location, date range (start/end), positions held, course descriptions
      - Flag for concurrent positions (e.g., PVHS + Butte + EAP overlap)
      - Status: 'current' | 'past'
    - `src/data/projects.ts` — All tools and related work:
      - D.A.D, O.G.R.E, raSHio, bookSHelf, wiSHlist, shDev, 11Gauge, animated-fill-buttons, Shufflr
      - CS Pathway, Embedded Systems curriculum, Golden State Pathways Grant
      - Each with: title, description, date range, status ('active'|'in-progress'|'concept'), external URL if any
    - `src/data/education.ts` — Degrees, credentials, research topic, thesis link
    - `src/data/skills.ts` — Languages, software, systems, hardware (each as categorized arrays)
    - `src/data/conferences.ts` — All 17+ conference/PD items with title, date, description
    - `src/data/profile.ts` — Name, contact info, research interests, teaching interests
  - Each file must export typed constants (e.g., `export const experiences: Experience[] = [...]`)
  - Preserve ALL content — nothing omitted. Course descriptions should be full text, stored for progressive disclosure.
  - Preserve special characters: raSHio (macron a), CSC-squared (superscript 2)
  - Mark items with no date as `date: null`
  - For the contact info: include email (shuff57@gmail.com). For phone number, include it but add a `// NOTE: personal phone — Steven may want to remove for public site` comment.

  **Must NOT do**:
  - Do NOT create React components — data files only
  - Do NOT omit any CV content (even if it seems minor)
  - Do NOT summarize or shorten course descriptions — store full text
  - Do NOT invent content not in the PDF

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Requires careful, exhaustive extraction from a 10-page PDF with complex structure
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `coding-standards`: Not writing complex code, just data structures

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3, 4)
  - **Blocks**: Tasks 5-11 (all pages consume this data)
  - **Blocked By**: None (reads from PDF, not from project)

  **References**:
  - **Source file**: `Curriculum Vitae.pdf` in project root — THE source of truth for all content
  - **WHY**: Every single data point in these files must come from this PDF. No invention.

  **Acceptance Criteria**:
  - [ ] All 6 data files exist in `src/data/`
  - [ ] TypeScript compiles with zero errors (`npx tsc --noEmit`)
  - [ ] Every CV section is represented (experience, projects, education, skills, conferences, profile)
  - [ ] Course descriptions are full-length (not truncated)
  - [ ] Special characters preserved (macron a in raSHio, superscript in CSC-squared)
  - [ ] All 10+ personal projects listed in `projects.ts`
  - [ ] All 12+ teaching positions listed in `experience.ts`
  - [ ] All 17+ conference/PD items listed in `conferences.ts`

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: All data files compile and export correctly
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit`
      2. Assert zero errors
      3. Run a quick Node script: `node -e "const d = require('./src/data/experience'); console.log(d.experiences.length)"` (or equivalent tsx)
      4. Assert experiences count >= 12
    Expected Result: All files compile, data arrays have expected lengths
    Failure Indicators: TypeScript errors, empty arrays, missing exports
    Evidence: .sisyphus/evidence/task-2-data-compile.txt

  Scenario: No CV content is missing
    Tool: Bash (grep)
    Steps:
      1. Search data files for key terms from CV: 'Pleasant Valley', 'Butte College', 'CSU Chico', 'Anderson Valley', 'San Leandro', 'Clifford Elementary'
      2. Search for all project names: 'D.A.D', 'O.G.R.E', 'raSHio', 'bookSHelf', 'Golden State'
      3. Assert all terms found
    Expected Result: Every institution and project from the CV appears in data files
    Failure Indicators: Any key term not found in any data file
    Evidence: .sisyphus/evidence/task-2-content-completeness.txt
  ```

  **Commit**: YES (group with Wave 1)
  - Message: `feat(data): extract all CV content into typed TypeScript data files`
  - Files: `src/data/*.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 3. Design System — Chalkboard Theme

  **What to do**:
  - Define the complete chalkboard design system in Tailwind config and CSS custom properties:
    - **Color palette**: Slate/charcoal backgrounds (`#1a1a2e`, `#16213e` range), chalk-white text (`#e8e8e8`), teal accent (`#2dd4bf` or similar), muted secondary text, card surface colors
    - **Typography**: Select and configure 2 fonts max:
      - Primary: A clean sans-serif for body text (e.g., Inter or similar)
      - Accent: A serif or chalk-style font for headings (e.g., Playfair Display, or a handwritten style like Caveat for special touches)
    - **Graph-paper texture**: Create a CSS/SVG repeating pattern for subtle grid background (NO image assets)
    - **Chalk-line dividers**: CSS-only decorative dividers that look hand-drawn (dashed borders with slight opacity, or SVG path)
    - **Spacing scale**: Consistent spacing tokens in Tailwind config
    - **Border radius**: Slightly rounded (not sharp, not pill-shaped)
    - **Shadow system**: Subtle dark-mode appropriate shadows
  - Create `src/styles/globals.css` with:
    - CSS custom properties for all design tokens
    - Graph-paper background pattern
    - Base typography styles
    - `@media (prefers-reduced-motion: reduce)` stub (animations added later)
    - `@media print` stub (print styles added in Task 21)
  - Update `tailwind.config.ts` to extend theme with chalkboard tokens
  - Create a `src/styles/chalkboard.css` or equivalent for the specialized chalkboard patterns

  **Must NOT do**:
  - Do NOT use image files for textures (CSS/SVG patterns only)
  - Do NOT load more than 2 custom font families
  - Do NOT create component-level styles yet

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Design system creation requires visual/aesthetic judgment
  - **Skills**: [`coding-standards`]
    - `coding-standards`: Ensures Tailwind config follows best practices
  - **Skills Evaluated but Omitted**:
    - `frontend-ui-ux`: Design system is config-level, not component-level

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 4)
  - **Blocks**: Tasks 5-11 (all pages use the design system)
  - **Blocked By**: None

  **References**:
  - **External References**:
    - Tailwind CSS theme configuration: https://tailwindcss.com/docs/theme
    - CSS repeating patterns (graph paper): https://css-tricks.com/snippets/css/css-grid-background/
    - Google Fonts: https://fonts.google.com/ (for font selection)
  - **WHY**: The chalkboard aesthetic is the visual identity of the entire site. Every subsequent task depends on these tokens.

  **Acceptance Criteria**:
  - [ ] `tailwind.config.ts` extends theme with custom colors, fonts, spacing
  - [ ] `src/styles/globals.css` defines CSS custom properties and base styles
  - [ ] Graph-paper background pattern renders visually (CSS/SVG, no images)
  - [ ] `prefers-reduced-motion` media query stub exists
  - [ ] Print media query stub exists
  - [ ] Only 2 font families loaded
  - [ ] `npm run build` succeeds with theme applied

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Theme renders in browser
    Tool: Playwright
    Steps:
      1. Start dev server
      2. Navigate to http://localhost:3000
      3. Screenshot the page at 1280x800
      4. Assert body background is dark (computed style check: background-color is dark range)
      5. Assert at least one CSS custom property exists (--color-accent or similar)
    Expected Result: Dark background renders with chalkboard colors
    Failure Indicators: White/default background, missing custom properties
    Evidence: .sisyphus/evidence/task-3-theme-render.png

  Scenario: Graph paper pattern visible
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Inspect computed background-image on body or main container
      3. Assert it contains a repeating pattern (linear-gradient or url(data:image/svg+xml))
    Expected Result: Repeating grid pattern in background
    Failure Indicators: Solid color only, no pattern
    Evidence: .sisyphus/evidence/task-3-graph-paper.png
  ```

  **Commit**: YES (group with Wave 1)
  - Message: `feat(design): create chalkboard design system with tokens and graph-paper texture`
  - Files: `tailwind.config.ts`, `src/styles/globals.css`
  - Pre-commit: `npm run build`

- [ ] 4. Shared Animation Utilities + GSAP Config

  **What to do**:
  - Create `src/lib/gsapConfig.ts` with `"use client"` directive:
    - Register GSAP plugins: `gsap.registerPlugin(ScrollTrigger)`
    - Export configured gsap instance
    - This is the ONLY file that imports raw `gsap` — all other files import from here
  - Create `src/lib/lenis.ts` — Lenis + GSAP integration:
    - Lenis drives smooth scroll, GSAP hooks into it via:
      ```
      lenis.on('scroll', ScrollTrigger.update)
      gsap.ticker.add((time) => { lenis.raf(time * 1000) })
      gsap.ticker.lagSmoothing(0)
      ```
    - Export a `LenisProvider` component for the root layout
  - Create `src/components/animations/ScrollReveal.tsx` — a reusable wrapper component:
    - Uses `useGSAP` hook from `@gsap/react`
    - Supports the fixed animation vocabulary: fade-in, slide-up, stagger-children, text-reveal, scale-in
    - Props: `animation: 'fade-in' | 'slide-up' | 'stagger' | 'text-reveal' | 'scale-in'`, `delay?`, `duration?`
    - Respects `prefers-reduced-motion` (if reduced, renders content in final state instantly)
  - Create `src/components/animations/ParallaxLayer.tsx` — parallax scroll effect wrapper
  - Define the animation vocabulary constants (durations, easings, stagger amounts) in a shared config

  **Must NOT do**:
  - Do NOT create page-specific animations yet (Wave 3)
  - Do NOT use full `motion` component — only `LazyMotion` + `m` for transition utilities
  - Do NOT animate anything in this task — just create the utilities

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Configuration and utility creation — well-documented patterns
  - **Skills**: [`coding-standards`]
    - `coding-standards`: Ensures clean, reusable utility patterns
  - **Skills Evaluated but Omitted**:
    - `vercel-react-best-practices`: Animation config is GSAP-specific, not React-general

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2, 3)
  - **Blocks**: Tasks 12-16 (all animation tasks use these utilities)
  - **Blocked By**: None (can be created with placeholder project structure)

  **References**:
  - **External References**:
    - GSAP + React docs: https://gsap.com/resources/React/
    - `@gsap/react` useGSAP hook: https://www.npmjs.com/package/@gsap/react
    - Lenis smooth scroll: https://github.com/darkroomengineering/lenis
    - Lenis + GSAP integration: https://github.com/darkroomengineering/lenis#with-gsap
  - **WHY**: Centralized GSAP config prevents memory leaks on route change. The useGSAP hook auto-cleans ScrollTrigger instances.

  **Acceptance Criteria**:
  - [ ] `src/lib/gsapConfig.ts` exists with `"use client"` and `registerPlugin(ScrollTrigger)`
  - [ ] `src/lib/lenis.ts` exists with Lenis-GSAP integration
  - [ ] `src/components/animations/ScrollReveal.tsx` exists with 5 animation types
  - [ ] `src/components/animations/ParallaxLayer.tsx` exists
  - [ ] No raw `gsap` import appears in any file except `gsapConfig.ts`
  - [ ] `npm run build` succeeds

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: GSAP config imports cleanly
    Tool: Bash
    Steps:
      1. Run `npx tsc --noEmit`
      2. Grep all .tsx/.ts files for `from 'gsap'` or `from "gsap"` — should only appear in gsapConfig.ts
      3. Assert ScrollReveal component exports correctly
    Expected Result: Single GSAP import point, all files compile
    Failure Indicators: Multiple raw gsap imports, TypeScript errors
    Evidence: .sisyphus/evidence/task-4-gsap-config.txt
  ```

  **Commit**: YES (group with Wave 1)
  - Message: `feat(animations): create centralized GSAP config and reusable scroll animation utilities`
  - Files: `src/lib/gsapConfig.ts`, `src/lib/lenis.ts`, `src/components/animations/*.tsx`
  - Pre-commit: `npm run build`

### Wave 2 — Layout + Static Pages

- [ ] 5. Root Layout, Navigation, and Footer

  **What to do**:
  - Create `src/app/layout.tsx` as the root layout:
    - Wrap with LenisProvider (from Task 4)
    - Include `<Navigation />` component at top
    - Include `<Footer />` component at bottom
    - Configure fonts (from Task 3 design system)
    - Set metadata (title: 'Steven Huff | Math Educator & Curriculum Developer', description, OG tags)
  - Create `src/components/ui/Navigation.tsx`:
    - Fixed/sticky top navigation bar with dark chalkboard styling
    - Links to all 6 routes: Home, Experience, Projects, Education, Skills, Contact
    - Active page indicator (underline, highlight, or accent color)
    - 'Download CV' button in nav (links to /Curriculum%20Vitae.pdf)
    - Mobile hamburger menu with slide-out drawer
    - Smooth transition on scroll (slight background opacity change)
  - Create `src/components/ui/Footer.tsx`:
    - Contact info: email (mailto link), phone (tel link)
    - Copyright notice
    - 'Download CV' link
    - Optional social links placeholder (GitHub, LinkedIn)
  - Create placeholder `page.tsx` for each route: `/`, `/experience`, `/projects`, `/education`, `/skills`, `/contact`

  **Must NOT do**:
  - Do NOT build full page content yet (Tasks 6-11)
  - Do NOT add animations to nav yet (Wave 3)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Navigation and layout require visual design judgment and responsive behavior
  - **Skills**: [`coding-standards`, `vercel-react-best-practices`]
    - `coding-standards`: Clean component patterns
    - `vercel-react-best-practices`: Next.js layout patterns and metadata

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (first task — others depend on layout)
  - **Blocks**: Tasks 6-11
  - **Blocked By**: Tasks 1, 2, 3 (needs project, data types, design system)

  **References**:
  - **Pattern References**: Next.js App Router layout docs
  - **API References**: `src/data/profile.ts` (Task 2) for name, contact info in footer
  - **Design References**: `tailwind.config.ts` and `globals.css` (Task 3) for theme tokens

  **Acceptance Criteria**:
  - [ ] Root layout renders with nav, main content area, and footer
  - [ ] All 6 nav links navigate to correct routes
  - [ ] Active page is visually indicated in navigation
  - [ ] 'Download CV' button in nav triggers PDF download
  - [ ] Mobile hamburger menu works at 375px width
  - [ ] `npm run build` succeeds

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Navigation works across all routes
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Click each nav link: Experience, Projects, Education, Skills, Contact
      3. Assert URL changes to /experience, /projects, /education, /skills, /contact
      4. Assert active nav item is visually distinct (check class or aria-current)
    Expected Result: All 6 routes reachable via nav, active state visible
    Evidence: .sisyphus/evidence/task-5-nav-routing.png

  Scenario: Mobile navigation works
    Tool: Playwright
    Steps:
      1. Set viewport to 375x812 (iPhone)
      2. Navigate to http://localhost:3000
      3. Assert hamburger menu icon is visible
      4. Click hamburger icon
      5. Assert nav drawer opens with all 6 links
      6. Click 'Experience' link
      7. Assert navigation occurs and drawer closes
    Expected Result: Mobile nav drawer opens/closes and navigates correctly
    Evidence: .sisyphus/evidence/task-5-mobile-nav.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(layout): add root layout with navigation, footer, and all route placeholders`
  - Files: `src/app/layout.tsx`, `src/components/ui/Navigation.tsx`, `src/components/ui/Footer.tsx`
  - Pre-commit: `npm run build`

- [ ] 6. Home / Hero Page

  **What to do**:
  - Build `src/app/page.tsx` as the landing page:
    - Hero section: Large name 'Steven Huff', subtitle 'Math Educator | CS Teacher | Curriculum Developer | Tool Builder'
    - Brief professional summary (2-3 sentences from research interests / teaching philosophy)
    - Key stats/highlights displayed as cards or counters:
      - '10+ years teaching' (2015-present)
      - '20+ courses taught'
      - '$300K grant awarded'
      - '10+ tools & projects'
    - Call-to-action buttons: 'View Experience', 'See My Projects', 'Download CV'
    - Subtle background element: graph-paper pattern with a math-themed decorative touch (e.g., a faint coordinate plane, a subtle equation, or geometric shapes)
  - Source all content from `src/data/profile.ts` and computed from other data files
  - Apply chalkboard design system throughout
  - Content should be fully readable WITHOUT animations (animations added in Wave 3)

  **Must NOT do**:
  - Do NOT add scroll animations yet (Task 12/16 will add them)
  - Do NOT add a 3D scene or heavy visual hero

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Hero page is the first impression — visual design is critical
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Landing page design requires strong UI/UX instinct

  **Parallelization**:
  - **Can Run In Parallel**: YES (after Task 5)
  - **Parallel Group**: Wave 2 (with Tasks 7-11, all parallel after Task 5)
  - **Blocks**: Task 16 (hero animation)
  - **Blocked By**: Task 5 (needs layout/nav)

  **References**:
  - **Data References**: `src/data/profile.ts`, `src/data/experience.ts` (for computing stats)
  - **Design References**: `tailwind.config.ts`, `globals.css` (chalkboard theme)

  **Acceptance Criteria**:
  - [ ] Hero section displays name, subtitle, summary
  - [ ] Key stats are visible (years teaching, courses, grant amount, projects)
  - [ ] CTA buttons link to correct routes
  - [ ] Chalkboard theme applied (dark background, chalk text, accent color)
  - [ ] Readable without any animations

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Hero content renders correctly
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert h1 contains 'Steven Huff'
      3. Assert page contains text 'Math Educator' or 'Mathematics'
      4. Assert at least 3 stat/counter elements are visible
      5. Screenshot at 1280x800
    Expected Result: Full hero section visible with name, stats, and CTAs
    Evidence: .sisyphus/evidence/task-6-hero-desktop.png

  Scenario: Hero renders on mobile
    Tool: Playwright
    Steps:
      1. Set viewport to 375x812
      2. Navigate to http://localhost:3000
      3. Assert h1 'Steven Huff' visible
      4. Assert stats are stacked (not in a row)
      5. Screenshot at 375x812
    Expected Result: Hero section is readable and properly stacked on mobile
    Evidence: .sisyphus/evidence/task-6-hero-mobile.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(home): build hero landing page with stats and CTAs`
  - Files: `src/app/page.tsx`, `src/components/sections/Hero.tsx`

- [ ] 7. Teaching Experience Page (Timeline)

  **What to do**:
  - Build `src/app/experience/page.tsx` with a visual timeline of Steven's teaching career:
  - Create `src/components/sections/Timeline.tsx` — reusable timeline component:
    - Vertical timeline with alternating left/right entries (desktop), single-column (mobile)
    - Timeline nodes for each position with institution, role, date range
    - Handle CONCURRENT positions visually: when multiple positions overlap (e.g., PVHS 2022-present + Butte 2023-present + EAP 2018-present), show parallel lanes or grouped entries with visual connector
    - 'Current' positions get accent-color highlight / badge
    - Course descriptions: COLLAPSED by default, expandable on click (progressive disclosure)
    - Organize by level: Post-Secondary, Secondary, Primary (with section headers)
  - Source all data from `src/data/experience.ts`
  - Timeline should be fully functional WITHOUT animations (static layout works, animations enhance in Wave 3)

  **Must NOT do**:
  - Do NOT show all course descriptions expanded by default — collapsed with expand toggle
  - Do NOT add scroll animations yet (Task 14)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Timeline with concurrent positions requires thoughtful visual hierarchy
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Complex timeline layout with progressive disclosure

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with Tasks 6, 8-11 after Task 5)
  - **Blocks**: Task 14 (timeline animations)
  - **Blocked By**: Task 5 (layout), Task 2 (data)

  **References**:
  - **Data References**: `src/data/experience.ts` for all teaching positions
  - **Pattern References**: Alternating timeline patterns (CSS), progressive disclosure UI patterns

  **Acceptance Criteria**:
  - [ ] All 12+ teaching positions from CV are displayed
  - [ ] Positions organized by level (Post-Secondary, Secondary, Primary)
  - [ ] Concurrent positions visually grouped or shown in parallel
  - [ ] Course descriptions collapsed by default, expandable on click
  - [ ] 'Current' positions visually distinguished
  - [ ] Timeline readable on mobile (single column)

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: All positions rendered
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/experience
      2. Count elements matching timeline entry selector
      3. Assert count >= 12
      4. Assert text 'Pleasant Valley' present
      5. Assert text 'Butte College' present
      6. Assert text 'CSU Chico' present
      7. Assert text 'Anderson Valley' present
    Expected Result: All institutions from CV appear on the page
    Evidence: .sisyphus/evidence/task-7-timeline-content.txt

  Scenario: Course descriptions expand/collapse
    Tool: Playwright
    Steps:
      1. Navigate to /experience
      2. Find first collapsed course description
      3. Assert description text is NOT visible
      4. Click expand toggle
      5. Assert description text IS now visible
      6. Click toggle again
      7. Assert description text is hidden again
    Expected Result: Progressive disclosure works
    Evidence: .sisyphus/evidence/task-7-expand-collapse.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(experience): build teaching timeline with progressive disclosure`
  - Files: `src/app/experience/page.tsx`, `src/components/sections/Timeline.tsx`

- [ ] 8. Projects Page (Bento Grid Showcase)

  **What to do**:
  - Build `src/app/projects/page.tsx` with an interactive project showcase:
  - Create `src/components/sections/ProjectGrid.tsx` — bento-style grid layout:
    - Each project is a card with: title, short description (1-2 sentences), date range, status badge
    - Status badges: 'Active' (green-teal), 'In Progress' (amber), 'Proof of Concept' (gray), 'Completed' (accent)
    - Cards are clickable — expand to show full description and external link (if available)
    - Featured projects (D.A.D, O.G.R.E, raSHio, bookSHelf) get larger cards in the bento grid
    - Smaller projects (wiSHlist, shDev, 11Gauge, Shufflr, animated-fill-buttons) get standard-size cards
    - Non-tool items (CS Pathway, Embedded Systems curriculum, Golden State Grant) displayed in a separate 'Achievements & Initiatives' section below the grid
  - Source all data from `src/data/projects.ts`
  - Expandable cards should work WITHOUT animations (animations added in Task 15)

  **Must NOT do**:
  - Do NOT embed live demos of projects
  - Do NOT add screenshots or images of projects
  - Do NOT add tech stack badges per project
  - Do NOT add hover animations yet (Task 15)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Bento grid requires careful layout and visual hierarchy
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Grid layout with varying card sizes and status badges

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with Tasks 6-7, 9-11 after Task 5)
  - **Blocks**: Task 15 (project card animations)
  - **Blocked By**: Task 5 (layout), Task 2 (data)

  **References**:
  - **Data References**: `src/data/projects.ts` for all projects and achievements
  - **Pattern References**: Apple-style bento grids, CSS Grid with `grid-template-areas` or auto-fill

  **Acceptance Criteria**:
  - [ ] All 10+ projects/tools from CV displayed
  - [ ] Featured projects (D.A.D, O.G.R.E, raSHio, bookSHelf) are visually prominent (larger cards)
  - [ ] Status badges visible on each card
  - [ ] Cards expand to show full description on click
  - [ ] 'Achievements & Initiatives' section shows non-tool items (grant, CS pathway, etc.)
  - [ ] External links open in new tab where available

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: All projects rendered with status badges
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/projects
      2. Assert text 'D.A.D' present
      3. Assert text 'O.G.R.E' present
      4. Assert text 'raSHio' present (or raSHio with macron)
      5. Assert text 'bookSHelf' present
      6. Assert text 'Golden State' present (in achievements section)
      7. Count status badge elements, assert >= 8
    Expected Result: All projects and achievements visible with status badges
    Evidence: .sisyphus/evidence/task-8-projects-grid.png

  Scenario: Project card expansion works
    Tool: Playwright
    Steps:
      1. Navigate to /projects
      2. Click the first project card
      3. Assert expanded description text is visible
      4. Assert external link is visible (if project has one)
    Expected Result: Card expands to show full details
    Evidence: .sisyphus/evidence/task-8-card-expand.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(projects): build bento grid project showcase with expandable cards`
  - Files: `src/app/projects/page.tsx`, `src/components/sections/ProjectGrid.tsx`

- [ ] 9. Education & Research Page

  **What to do**:
  - Build `src/app/education/page.tsx` with two sections:
  - **Education section**:
    - MS Mathematics Education (CSU Chico, 2021) — with thesis title and link to scholarworks
    - BS Mathematics (CSU Chico, 2015)
    - CA Teaching Credential: Single Subject Mathematics (2015)
    - Computer Science Supplementary Authorization (2023)
    - CTE: ICT Supplementary Authorization (Spring 2026)
    - Each credential as a styled card with institution, date, and description
  - **Research section**:
    - Research interests displayed as tag cloud or styled paragraph
    - Thesis highlight card: title, abstract/summary, link to full thesis
    - Teaching interests displayed as categorized list
  - Source from `src/data/education.ts` and `src/data/profile.ts`

  **Must NOT do**:
  - Do NOT embed the thesis PDF
  - Do NOT add scroll animations yet

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Card layout with academic content requires clean presentation
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with Tasks 6-8, 10-11)
  - **Blocks**: None
  - **Blocked By**: Task 5 (layout), Task 2 (data)

  **References**:
  - **Data References**: `src/data/education.ts`, `src/data/profile.ts`
  - **External References**: Thesis link: https://scholarworks.calstate.edu/concern/theses/fq978099t

  **Acceptance Criteria**:
  - [ ] All 5 credentials displayed (MS, BS, teaching credential, CS auth, CTE auth)
  - [ ] Thesis title and link to scholarworks present
  - [ ] Research interests and teaching interests displayed
  - [ ] Thesis link opens in new tab and returns HTTP 200

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Education content complete
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/education
      2. Assert text 'Master of Science' present
      3. Assert text 'Bachelor of Science' present
      4. Assert text 'Teaching Credential' present
      5. Assert link to scholarworks.calstate.edu exists and href is correct
    Expected Result: All credentials and thesis link visible
    Evidence: .sisyphus/evidence/task-9-education.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(education): add education credentials and research page`
  - Files: `src/app/education/page.tsx`

- [ ] 10. Skills & Technology Page

  **What to do**:
  - Build `src/app/skills/page.tsx` with interactive skill visualization:
  - Organize skills into categories from the CV:
    - **Languages**: JavaScript, R, C++, HTML, LaTeX, Scratch, Python
    - **Personal Projects**: link to /projects page (cross-reference)
    - **Software**: RStudio, Overleaf, Google Suite, StatCrunch, VCarve, Fusion 360, GeoGebra, etc.
    - **Systems**: Blackboard, Canvas, Aeries, MyStatLab, etc.
    - **Hardware**: 3D Printers, CNC Machines, Raspberry Pi, ESP32/ESP8266
  - Each category as a styled section with items displayed as:
    - Skill chips/tags with the chalkboard aesthetic (chalk-on-slate look)
    - OR a grid of small cards
  - Hardware section can have slightly different styling to distinguish from software
  - Include the 'Teaching Interests' list as a separate section (long list of courses he can teach)

  **Must NOT do**:
  - Do NOT use animated skill bars (gimmicky and meaningless for non-dev skills)
  - Do NOT rate skills with percentages or levels
  - Do NOT add scroll animations yet

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Tag/chip layout with categorization requires visual design
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with Tasks 6-9, 11)
  - **Blocks**: None
  - **Blocked By**: Task 5 (layout), Task 2 (data)

  **References**:
  - **Data References**: `src/data/skills.ts`, `src/data/profile.ts` (teaching interests)

  **Acceptance Criteria**:
  - [ ] All 5 skill categories displayed (Languages, Projects, Software, Systems, Hardware)
  - [ ] All individual items from CV present in correct categories
  - [ ] Teaching interests list displayed
  - [ ] No skill bars or percentage ratings

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Skills content complete
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/skills
      2. Assert text 'JavaScript' present
      3. Assert text 'Python' present
      4. Assert text 'Raspberry Pi' present (hardware section)
      5. Assert text 'ESP32' or 'ESP8266' present
      6. Assert text 'Canvas' present (systems section)
      7. Count skill chip/tag elements, assert >= 30
    Expected Result: All skills from CV displayed across categories
    Evidence: .sisyphus/evidence/task-10-skills.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(skills): add categorized skills and teaching interests page`
  - Files: `src/app/skills/page.tsx`

- [ ] 11. Contact Page + PDF Download

  **What to do**:
  - Build `src/app/contact/page.tsx` as the final page:
  - Contact information:
    - Email: shuff57@gmail.com (as a mailto: link)
    - Phone: (209)-986-0301 (as a tel: link) — add a code comment noting this is personal
  - PDF Download section:
    - Prominent download button linking to `/Curriculum%20Vitae.pdf`
    - Brief note: 'Prefer the traditional format? Download the full CV as PDF.'
  - Professional Development section (condensed):
    - All 17+ conference/PD items from the CV
    - Display as a compact list: title, date, one-line description
    - NOT expandable cards (too many items — keep it scannable)
  - Source from `src/data/profile.ts` and `src/data/conferences.ts`

  **Must NOT do**:
  - Do NOT add a contact form (no backend)
  - Do NOT add CAPTCHA or any form processing
  - Do NOT add social media links unless confirmed by user

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Contact page with clear CTA and compact list
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (parallel with Tasks 6-10)
  - **Blocks**: None
  - **Blocked By**: Task 5 (layout), Task 2 (data)

  **References**:
  - **Data References**: `src/data/profile.ts` (contact info), `src/data/conferences.ts`

  **Acceptance Criteria**:
  - [ ] Email displayed as clickable mailto: link
  - [ ] Phone displayed as clickable tel: link
  - [ ] PDF download button works (triggers download of CV PDF)
  - [ ] All 17+ conference/PD items listed
  - [ ] No contact form present

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Contact info and PDF download work
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/contact
      2. Assert mailto: link for shuff57@gmail.com exists
      3. Assert tel: link for phone exists
      4. Find PDF download button/link
      5. Assert href contains 'Curriculum' and '.pdf'
      6. Count conference/PD list items, assert >= 15
    Expected Result: Contact info, PDF link, and conference list all present
    Evidence: .sisyphus/evidence/task-11-contact.png

  Scenario: PDF download works on mobile
    Tool: Playwright
    Steps:
      1. Set viewport to 375x812
      2. Navigate to /contact
      3. Assert PDF download button is visible and clickable
    Expected Result: PDF button accessible on mobile
    Evidence: .sisyphus/evidence/task-11-contact-mobile.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(contact): add contact page with PDF download and professional development list`
  - Files: `src/app/contact/page.tsx`

### Wave 3 — Animation Layer

- [ ] 12. Scroll Animation System (GSAP ScrollTrigger Integration)

  **What to do**:
  - Apply `ScrollReveal` wrappers (from Task 4) to all page sections across the site:
    - Every major section heading: fade-in + slide-up
    - Content blocks: stagger-children (cards, list items appear sequentially)
    - Stats/counters on home page: scale-in
  - Configure ScrollTrigger defaults for the site:
    - `start: 'top 80%'` (trigger when 80% of viewport height is reached)
    - `toggleActions: 'play none none none'` (play once, don't reverse)
  - Ensure Lenis smooth scroll is working correctly with ScrollTrigger
  - Verify `prefers-reduced-motion` disables all scroll animations (content appears in final state)
  - Test ScrollTrigger cleanup on route changes (no memory leaks)

  **Must NOT do**:
  - Do NOT create novel per-section animations — use ONLY the fixed vocabulary
  - Do NOT use GSAP on elements that will have Motion transitions (Task 13)
  - Do NOT animate text character-by-character (too heavy for content pages)

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: GSAP ScrollTrigger integration with Lenis and route cleanup requires careful engineering
  - **Skills**: [`coding-standards`]

  **Parallelization**:
  - **Can Run In Parallel**: NO (first in Wave 3)
  - **Parallel Group**: Wave 3 (Tasks 13-16 depend on this)
  - **Blocks**: Tasks 14, 15, 16
  - **Blocked By**: Tasks 4 (animation utils), 5 (layout)

  **References**:
  - **Pattern References**: `src/lib/gsapConfig.ts`, `src/components/animations/ScrollReveal.tsx` (Task 4)
  - **External References**: GSAP ScrollTrigger docs: https://gsap.com/docs/v3/Plugins/ScrollTrigger/

  **Acceptance Criteria**:
  - [ ] All major sections animate on scroll across all 6 pages
  - [ ] Animations use ONLY the 6 vocabulary types (fade-in, slide-up, stagger, text-reveal, scale-in, parallax)
  - [ ] `prefers-reduced-motion: reduce` disables all animations
  - [ ] No GSAP memory leaks on route change (ScrollTrigger instances cleaned up)
  - [ ] Smooth scroll (Lenis) works in sync with ScrollTrigger

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Scroll animations fire on content sections
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Scroll down slowly (page.mouse.wheel 0, 500 repeated)
      3. Assert elements have transitioned from initial state (opacity 0) to visible (opacity 1)
      4. Screenshot mid-scroll to show animations in progress
    Expected Result: Content fades/slides in as user scrolls
    Evidence: .sisyphus/evidence/task-12-scroll-animations.png

  Scenario: Reduced motion disables animations
    Tool: Playwright
    Steps:
      1. Emulate prefers-reduced-motion: reduce
      2. Navigate to http://localhost:3000
      3. Assert all content is immediately visible (opacity: 1, transform: none)
      4. Scroll down and assert no animation occurs
    Expected Result: All content visible immediately, no motion
    Evidence: .sisyphus/evidence/task-12-reduced-motion.png
  ```

  **Commit**: YES (group with Wave 3)
  - Message: `feat(scroll): apply GSAP ScrollTrigger animations across all pages`

- [ ] 13. Page Route Transitions (Framer Motion)

  **What to do**:
  - Add page transition animations using Framer Motion LazyMotion:
    - Wrap route content in `AnimatePresence` in the root layout
    - Each page fades in on enter (opacity 0 -> 1, slight y-offset)
    - Outgoing page fades out (opacity 1 -> 0)
    - Transition duration: ~300ms, ease-out
  - Use `LazyMotion` with `domAnimation` features (NOT full `motion` import)
  - Ensure transitions don't conflict with GSAP scroll animations

  **Must NOT do**:
  - Do NOT import full `motion` component — use `LazyMotion` + `m` only
  - Do NOT animate with Motion on scroll-triggered elements (GSAP owns those)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Page transitions require smooth visual execution
  - **Skills**: [`vercel-react-best-practices`]
    - `vercel-react-best-practices`: App Router + AnimatePresence integration

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 14-16 after Task 12)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Task 5 (layout)

  **References**:
  - **External References**: Framer Motion LazyMotion docs, AnimatePresence with Next.js App Router patterns

  **Acceptance Criteria**:
  - [ ] Pages fade in/out on route change
  - [ ] `LazyMotion` used (not full `motion`)
  - [ ] No DOM conflict with GSAP-animated elements
  - [ ] Transition completes in ~300ms

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Page transition occurs on navigation
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Click 'Experience' nav link
      3. Wait 100ms, screenshot (should show fade transition)
      4. Wait 400ms, screenshot (should show fully loaded /experience)
    Expected Result: Smooth fade transition visible between screenshots
    Evidence: .sisyphus/evidence/task-13-page-transition.png
  ```

  **Commit**: YES (group with Wave 3)
  - Message: `feat(transitions): add Framer Motion page route transitions`

- [ ] 14. Timeline-Specific Animations

  **What to do**:
  - Enhance the Experience page timeline (Task 7) with scroll-triggered animations:
    - Timeline line draws itself as user scrolls (SVG path animation or border grow)
    - Timeline nodes appear sequentially as they enter viewport (stagger effect)
    - Date labels slide in from the side
    - Expand/collapse of course descriptions uses smooth height animation
  - All animations use `useGSAP` hook with ScrollTrigger

  **Must NOT do**:
  - Do NOT use Framer Motion on timeline elements (GSAP owns this)
  - Do NOT animate each character of text

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13, 15, 16)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Tasks 12 (scroll system), 7 (timeline page)

  **References**:
  - **Pattern References**: `src/components/sections/Timeline.tsx` (Task 7), `src/components/animations/ScrollReveal.tsx` (Task 4)

  **Acceptance Criteria**:
  - [ ] Timeline line animates on scroll (draws or grows)
  - [ ] Timeline nodes stagger in as viewport reaches them
  - [ ] Expand/collapse of descriptions is smooth (not instant)

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Timeline animates on scroll
    Tool: Playwright
    Steps:
      1. Navigate to /experience
      2. Scroll to first timeline section
      3. Assert timeline nodes become visible with stagger delay
      4. Screenshot mid-animation
    Expected Result: Timeline entries appear sequentially during scroll
    Evidence: .sisyphus/evidence/task-14-timeline-animation.png
  ```

  **Commit**: YES (group with Wave 3)
  - Message: `feat(timeline): add scroll-driven timeline animations`

- [ ] 15. Project Card Hover and Expand Interactions

  **What to do**:
  - Enhance project cards (Task 8) with interactive animations:
    - Hover: subtle scale up (1.02x), shadow deepen, accent border glow
    - Click to expand: smooth height/width animation revealing full description
    - Stagger entrance: cards appear in bento grid with staggered timing on scroll
    - Status badges: subtle pulse animation on 'In Progress' items
  - Use GSAP for scroll-triggered stagger entrance
  - Use CSS transitions for hover effects (no library needed)

  **Must NOT do**:
  - Do NOT add 3D card flip effects
  - Do NOT add particle effects on hover

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13, 14, 16)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Tasks 12 (scroll system), 8 (projects page)

  **Acceptance Criteria**:
  - [ ] Cards scale up on hover with shadow change
  - [ ] Card expand/collapse is animated (smooth height transition)
  - [ ] Cards stagger in on scroll

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Card hover effect
    Tool: Playwright
    Steps:
      1. Navigate to /projects
      2. Hover over first project card
      3. Assert transform: scale is > 1 (or box-shadow changed)
    Expected Result: Card visually lifts on hover
    Evidence: .sisyphus/evidence/task-15-card-hover.png
  ```

  **Commit**: YES (group with Wave 3)
  - Message: `feat(projects): add card hover, expand, and stagger animations`

- [ ] 16. Hero Section Entrance Animation

  **What to do**:
  - Create a memorable entrance animation for the home/hero page:
    - Name 'Steven Huff': text-reveal animation (characters or words appearing sequentially)
    - Subtitle: fade-in with slight delay after name
    - Stats: scale-in with stagger (each counter pops in sequentially)
    - CTA buttons: slide-up with stagger
    - Background graph-paper: subtle parallax shift on scroll
  - This should be the 'WOW' moment — the first thing visitors see
  - All animations use GSAP timeline for precise sequencing
  - Total entrance sequence: ~1.5-2 seconds

  **Must NOT do**:
  - Do NOT make the entrance > 3 seconds (people leave)
  - Do NOT block content behind the animation (content must be accessible after animation completes)

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`frontend-ui-ux`]
    - `frontend-ui-ux`: Hero entrance is the key first-impression moment

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 13-15)
  - **Parallel Group**: Wave 3
  - **Blocks**: None
  - **Blocked By**: Tasks 12 (scroll system), 6 (hero page)

  **Acceptance Criteria**:
  - [ ] Name reveals with text animation
  - [ ] Stats counter with stagger effect
  - [ ] Full sequence completes in < 2.5 seconds
  - [ ] Content is fully visible after animation

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Hero entrance plays on load
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait 500ms, screenshot (mid-animation)
      3. Wait 3000ms, screenshot (animation complete)
      4. Assert h1 'Steven Huff' is visible
      5. Assert stats section is visible
    Expected Result: Animated entrance plays, all content visible after
    Evidence: .sisyphus/evidence/task-16-hero-entrance.png
  ```

  **Commit**: YES (group with Wave 3)
  - Message: `feat(hero): add entrance animation with text reveal and stat counters`

### Wave 4 — Polish & Enhancement

- [ ] 17. Math Visualization #1 — Animated Trigonometric Curve

  **What to do**:
  - Create `src/components/math-viz/TrigCurve.tsx`:
    - A subtle, animated sine/cosine curve that draws itself
    - Uses SVG path animation (stroke-dashoffset technique) or Canvas
    - Placed on the Education page as a decorative element near the math credentials
    - OR on the Home page as a subtle background element
    - The curve should slowly trace itself when the section scrolls into view
    - Color: accent/teal on dark background
    - Should feel like a chalk drawing on a chalkboard
  - Trigger: ScrollTrigger (draws as user scrolls to it)
  - Size: Contained (not full-page), approximately 300-500px wide
  - Capped at ~50 lines of animation code

  **Must NOT do**:
  - Do NOT make it interactive (click/drag) — just animated
  - Do NOT use D3.js or WebGL (too heavy for a decorative element)
  - Do NOT exceed 50 lines of animation logic

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: SVG path animation requires precise math and timing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 18-21)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Task 12 (scroll animation system)

  **Acceptance Criteria**:
  - [ ] SVG curve draws itself on scroll
  - [ ] Animation is ~50 lines or less
  - [ ] Renders on dark background with accent color
  - [ ] Disabled when prefers-reduced-motion is set

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Trig curve animates on scroll
    Tool: Playwright
    Steps:
      1. Navigate to page containing the visualization
      2. Scroll to the math viz section
      3. Assert SVG element is present and visible
      4. Screenshot showing the drawn curve
    Expected Result: Animated trig curve visible in accent color
    Evidence: .sisyphus/evidence/task-17-trig-curve.png
  ```

  **Commit**: YES (group with Wave 4)
  - Message: `feat(math-viz): add animated trigonometric curve SVG`

- [ ] 18. Math Visualization #2 — Interactive Normal Distribution

  **What to do**:
  - Create `src/components/math-viz/NormalDist.tsx`:
    - A small interactive normal distribution (bell curve) visualization
    - User can drag/hover to see z-scores and shaded areas
    - OR: animated version that draws the curve and shades a region on scroll
    - Placed on the Skills page (statistics is a key teaching area) or Education page
    - Uses SVG or lightweight Canvas (NO external charting library)
    - Color: accent color for curve, semi-transparent fill for shaded region
  - Interaction: minimal — hover to see value, or scroll-triggered shade animation
  - Capped at ~50 lines of core logic

  **Must NOT do**:
  - Do NOT use D3.js, Chart.js, or any charting library
  - Do NOT make it a full statistics calculator
  - Do NOT exceed 50 lines of core logic

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Normal distribution math + SVG rendering requires precision
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 17, 19-21)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Task 12 (scroll animation system)

  **Acceptance Criteria**:
  - [ ] Bell curve renders correctly (mathematically accurate shape)
  - [ ] Some interactivity or scroll-triggered animation present
  - [ ] Core logic <= 50 lines
  - [ ] Renders on dark background with accent color

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Normal distribution renders
    Tool: Playwright
    Steps:
      1. Navigate to page containing the visualization
      2. Scroll to the math viz section
      3. Assert SVG or Canvas element present
      4. Assert bell curve shape (element has path data or drawn pixels)
      5. Screenshot
    Expected Result: Visible bell curve in accent color on dark background
    Evidence: .sisyphus/evidence/task-18-normal-dist.png
  ```

  **Commit**: YES (group with Wave 4)
  - Message: `feat(math-viz): add interactive normal distribution visualization`

- [ ] 19. Mobile Responsiveness Pass

  **What to do**:
  - Systematic review and fix of ALL 6 pages at 375px viewport:
    - Navigation: hamburger menu works, drawer doesn't overflow
    - Hero: stats stack vertically, text doesn't overflow
    - Timeline: single-column layout, dates don't overlap
    - Project grid: single-column cards, expand still works
    - Education: cards stack, no horizontal overflow
    - Skills: chips wrap properly, no horizontal scroll
    - Contact: all links tappable (min 44px tap target)
    - Math viz: scales down or hides gracefully
  - Fix any horizontal overflow issues
  - Ensure all tap targets are >= 44x44px
  - Test font sizes are readable on mobile (min 16px body text)

  **Must NOT do**:
  - Do NOT add a tablet-specific breakpoint (2 breakpoints only: mobile/desktop)
  - Do NOT redesign layouts — just fix responsive issues

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: [`playwright`]
    - `playwright`: Systematic testing at mobile viewport

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 17-18, 20-21)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Tasks 6-11 (all pages must exist)

  **Acceptance Criteria**:
  - [ ] All 6 pages render without horizontal overflow at 375px
  - [ ] All tap targets >= 44x44px
  - [ ] Body text >= 16px on mobile
  - [ ] Hamburger menu works on every page

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: All pages render on mobile without overflow
    Tool: Playwright
    Steps:
      1. Set viewport to 375x812
      2. Navigate to each of 6 routes
      3. For each: assert document.body.scrollWidth <= 375 (no horizontal overflow)
      4. Screenshot each page
    Expected Result: No horizontal scrollbar on any page at 375px
    Evidence: .sisyphus/evidence/task-19-mobile-{page}.png (6 screenshots)
  ```

  **Commit**: YES (group with Wave 4)
  - Message: `fix(mobile): responsive layout fixes across all pages`

- [ ] 20. Accessibility Pass

  **What to do**:
  - Implement full accessibility across the site:
    - `prefers-reduced-motion: reduce`: All GSAP animations disabled, content in final state, page transitions instant
    - Keyboard navigation: Tab through all interactive elements (nav links, expand buttons, project cards)
    - Focus indicators: Visible focus rings on all interactive elements (accent color outline)
    - ARIA labels: All interactive elements have descriptive aria-labels
    - Semantic HTML: Proper heading hierarchy (h1 -> h2 -> h3), landmark regions (nav, main, footer)
    - Color contrast: All text meets WCAG AA (4.5:1 for normal text, 3:1 for large text) against dark background
    - Skip-to-content link: Hidden link at top of page that skips to main content
    - Alt text: Any decorative SVGs marked as `aria-hidden="true"`
  - Run Lighthouse accessibility audit, target >= 90

  **Must NOT do**:
  - Do NOT aim for WCAG AAA (AA is sufficient)
  - Do NOT add screen reader announcements for animations

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Accessibility requires methodical review of all interactive elements
  - **Skills**: [`playwright`]
    - `playwright`: Automated a11y testing

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 17-19, 21)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Tasks 6-16 (all content and animations must exist)

  **Acceptance Criteria**:
  - [ ] Lighthouse Accessibility score >= 90
  - [ ] Tab navigation reaches all interactive elements on all pages
  - [ ] Focus indicators visible on all interactive elements
  - [ ] Skip-to-content link exists and works
  - [ ] All text passes WCAG AA contrast ratio
  - [ ] prefers-reduced-motion fully disables animations

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Keyboard navigation works
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Press Tab repeatedly
      3. Assert focus moves through nav links, CTA buttons, interactive elements
      4. Assert focus ring is visible on each focused element
      5. Press Enter on a nav link, assert navigation occurs
    Expected Result: Full keyboard navigability with visible focus indicators
    Evidence: .sisyphus/evidence/task-20-keyboard-nav.png

  Scenario: Reduced motion works globally
    Tool: Playwright
    Steps:
      1. Emulate prefers-reduced-motion: reduce
      2. Navigate to all 6 routes
      3. Assert no CSS animations or transforms are active
      4. Assert all content is immediately visible
    Expected Result: Zero motion on all pages
    Evidence: .sisyphus/evidence/task-20-reduced-motion-all.txt
  ```

  **Commit**: YES (group with Wave 4)
  - Message: `feat(a11y): accessibility pass with keyboard nav, focus indicators, and reduced motion`

- [ ] 21. Performance Optimization + Print Stylesheet

  **What to do**:
  - Performance optimization:
    - Analyze bundle with `npx @next/bundle-analyzer` or build output
    - Assert total initial JS bundle < 500kb
    - Lazy-load math visualization components (dynamic import)
    - Optimize font loading (font-display: swap, preload critical fonts)
    - Verify LCP < 2.5s, CLS < 0.1
    - Run Lighthouse Performance audit, target >= 90
  - Print stylesheet (`@media print` in globals.css):
    - Hide navigation, footer, animation elements
    - Show all content expanded (no collapsed sections)
    - Black text on white background
    - Standard readable typography
    - Page breaks between major sections
  - Add basic meta tags:
    - `<title>`, `<meta description>`, Open Graph tags (title, description, image placeholder)

  **Must NOT do**:
  - Do NOT add JSON-LD structured data
  - Do NOT add sitemap.xml or robots.txt (premature optimization)
  - Do NOT chase Lighthouse 100 — 90+ is the target

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Performance analysis and optimization requires measurement-driven approach
  - **Skills**: [`vercel-react-best-practices`]
    - `vercel-react-best-practices`: Next.js performance patterns

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 17-20)
  - **Parallel Group**: Wave 4
  - **Blocks**: None
  - **Blocked By**: Tasks 6-16 (all content and animations)

  **Acceptance Criteria**:
  - [ ] Initial JS bundle < 500kb (verified via build output)
  - [ ] Lighthouse Performance >= 90
  - [ ] Lighthouse Best Practices >= 90
  - [ ] Print stylesheet renders readable content (nav hidden, content expanded)
  - [ ] Meta tags present (title, description, OG)
  - [ ] Math viz components are lazy-loaded (dynamic import)

  **QA Scenarios (MANDATORY):**
  ```
  Scenario: Bundle size within budget
    Tool: Bash
    Steps:
      1. Run `npm run build`
      2. Check build output for 'First Load JS' sizes
      3. Assert no route exceeds 500kb initial JS
    Expected Result: All routes under 500kb JS budget
    Evidence: .sisyphus/evidence/task-21-bundle-size.txt

  Scenario: Print stylesheet works
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Emulate print media: page.emulateMedia({ media: 'print' })
      3. Screenshot the page
      4. Assert navigation is hidden
      5. Assert body has light background
    Expected Result: Clean, printable layout with nav hidden
    Evidence: .sisyphus/evidence/task-21-print.png
  ```

  **Commit**: YES (group with Wave 4)
  - Message: `perf(optimize): bundle optimization, print stylesheet, and meta tags`

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection -> fix -> re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build` + `npx next lint`. Review all files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify all GSAP code uses `useGSAP` hook. Verify no raw `gsap` imports outside `lib/gsapConfig.ts`. Verify LazyMotion used (not full motion).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Full Visual QA via Playwright** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Navigate every route at 1280px and 375px widths. Screenshot each page at both sizes. Test all interactive elements: nav links, project card expand/collapse, PDF download, external links, timeline scroll. Test with `prefers-reduced-motion: reduce`. Test keyboard Tab navigation through all pages. Save all screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Routes [N/N pass] | Interactions [N/N] | Mobile [N/N] | A11y [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual implementation. Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check every "Must NOT do" and "Must NOT Have" for compliance. Verify all CV content from PDF appears on site (compare PDF text to data files). Flag unaccounted files.
  Output: `Tasks [N/N compliant] | Content [complete/missing N items] | Creep [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **After Wave 1**: `feat(foundation): scaffold Next.js project with chalkboard design system and CV data`
- **After Wave 2**: `feat(pages): add all 6 static pages with layout, nav, and CV content`
- **After Wave 3**: `feat(animations): add scroll-driven animations and page transitions`
- **After Wave 4**: `feat(polish): add math visualizations, mobile responsiveness, and accessibility`
- **After Final Verification**: `chore(qa): final polish from verification review`

---

## Success Criteria

### Verification Commands
```bash
npm run build         # Expected: Build succeeds, zero errors
npx next lint         # Expected: Zero warnings or errors
# Lighthouse audit (via Playwright or CLI)
# Expected: Performance >= 90, Accessibility >= 90, Best Practices >= 90
```

### Final Checklist
- [ ] All 6 routes render correctly (/, /experience, /projects, /education, /skills, /contact)
- [ ] All CV content from the 10-page PDF is present (nothing omitted)
- [ ] Dark chalkboard theme with teal accent applied consistently
- [ ] Scroll animations fire on every page section
- [ ] Project cards expand/collapse on click
- [ ] Teaching timeline shows concurrent positions correctly
- [ ] 2 math visualizations present and interactive
- [ ] PDF download button works (serves existing PDF)
- [ ] Mobile layout works at 375px width
- [ ] prefers-reduced-motion disables animations
- [ ] Keyboard Tab navigation works through all interactive elements
- [ ] All external links from CV work (open in new tab)
- [ ] Print stylesheet produces readable output
- [ ] Bundle size < 500kb initial load
- [ ] No `as any`, no raw gsap imports, no full motion component
