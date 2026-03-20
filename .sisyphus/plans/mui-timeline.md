# react-chrono Timeline + Embed-Enhanced Projects

## TL;DR

> **Quick Summary**: Replace the custom-built timeline on `/experience` with `react-chrono` (vertical mode, dark theme, 3 instances per education level). Enhance `/projects` card grid with screenshot images for featured tools + live iframe toggle for projects with `externalUrl`. Remove the year-filter scrubber.
>
> **Deliverables**:
> - react-chrono timeline on `/experience` (3 sections: Post-Secondary, Secondary, Elementary)
> - TimelineScrubber removed (component + CSS + filtering logic)
> - YearNav updated to section-level scroll-spy (3 targets instead of per-institution)
> - Project card images for 4 featured tools (D.A.D, O.G.R.E, rāSHio, bookSHelf)
> - Iframe embed toggle on project cards with `externalUrl`
> - Optional `imageUrl` field on Project data type for future expansion
>
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 → Task 4 → Task 5 → Task 7

---

## Context

### Original Request
Replace the custom-built timeline with a library-based timeline component (user referenced MUI Timeline, then chose react-chrono after comparison). Embed previews of sites/tools into cards instead of redirecting.

### Interview Summary
**Key Discussions**:
- **Library choice**: react-chrono (4.2k ⭐, v3.3.3) over MUI Lab Timeline — 1 package vs 6, built-in dark mode, zero-runtime CSS (Vanilla Extract), no SSR provider needed, data-driven API, custom content support
- **Experience layout**: Three separate `<Chrono>` instances (one per education level section) with `<SectionHeading>` dividers between them. Vertical mode, left-aligned.
- **Projects layout**: Keep existing responsive card grid. Add screenshot images for 4 featured tools + iframe toggle for projects with `externalUrl`.
- **Embed types**: Screenshots/images for featured tools, live iframe embeds for projects with `externalUrl`, link preview infrastructure (embed-ready data model)
- **Images scope**: Featured tools only (D.A.D, O.G.R.E, rāSHio, bookSHelf). Concepts and initiatives get no images. `imageUrl?: string` field on Project interface for future additions.
- **YearNav**: Section-level scroll-spy (3 items: Post-Secondary, Secondary, Elementary) instead of per-institution
- **Scrubber**: Delete entirely

### Metis Review
**Identified Gaps** (all addressed):
- **SSR `window` risk**: react-chrono may access `window` at module scope, causing `ReferenceError` during `next build` (static export). Mitigated with `next/dynamic({ ssr: false })` — new pattern for this codebase.
- **react-chrono CSS import**: Must import `react-chrono/dist/style.css`. Potential conflicts with Tailwind v4.
- **YearNav DOM ID conflict**: react-chrono generates its own DOM without `inst-*` IDs. Resolved: section-level wrapper divs with IDs, YearNav targets 3 sections.
- **Section headings incompatible with single Chrono**: Resolved: 3 separate `<Chrono>` instances.
- **`output: 'export'` + `basePath: '/steven'`**: Image paths in production need basePath prefix. Use relative paths or Next.js basePath pattern.
- **No project images exist**: 4 featured tool images needed. Screenshot rāSHio (has live URL). Branded placeholders for D.A.D, O.G.R.E, bookSHelf.
- **Cross-origin iframe**: rashio.pages.dev (Cloudflare Pages) should allow embedding by default, but must test.
- **ExpandableCourse inside react-chrono**: framer-motion height animation may be clipped by react-chrono card container. Needs testing.
- **ScrollReveal + react-chrono**: Don't wrap Chrono in ScrollReveal — use Chrono's native scroll behavior.

---

## Work Objectives

### Core Objective
Replace the hand-built timeline with react-chrono for a polished, library-backed experience timeline. Enhance project cards with inline previews (images + iframes) to showcase tools without redirecting users away.

### Concrete Deliverables
- `src/components/sections/ChronoTimeline.tsx` — NEW: react-chrono-based timeline component
- `src/components/sections/ExperienceView.tsx` — simplified, uses ChronoTimeline, section-level YearNav
- `src/components/sections/TimelineScrubber.tsx` — DELETED
- `src/components/sections/ProjectGrid.tsx` — enhanced with image previews + iframe toggle
- `src/data/projects.ts` — `imageUrl?: string` added to Project interface
- `src/app/globals.css` — scrubber CSS removed, react-chrono CSS imported
- `public/projects/` — 4 featured tool images (800×450 PNG)
- `package.json` — react-chrono dependency added

### Definition of Done
- [ ] `npm run build` succeeds (static export, no SSR errors)
- [ ] `npm run lint` passes
- [ ] `/experience` renders 3 react-chrono timeline sections with section headings
- [ ] ExpandableCourse expand/collapse works inside react-chrono cards
- [ ] YearNav scroll-spy tracks 3 section-level targets on experience page
- [ ] `/projects` shows images on 4 featured tool cards
- [ ] rāSHio card has working iframe toggle
- [ ] No references to `TimelineScrubber` remain in codebase
- [ ] No `.timeline-scrubber` CSS remains

### Must Have
- react-chrono vertical mode with dark theme matching chalkboard aesthetic
- 3 separate `<Chrono>` instances with `<SectionHeading>` dividers
- `next/dynamic({ ssr: false })` for react-chrono import (SSR safety)
- react-chrono CSS imported (`react-chrono/dist/style.css`)
- ExpandableCourse preserved with framer-motion animations inside custom card content
- instId function preserved or relocated (YearNav may still reference it on projects page)
- "Current" badge on current positions (Butte College, PV High)
- Concurrent position annotation preserved
- Section-level wrapper divs with IDs for YearNav scroll-spy
- `imageUrl?: string` on Project interface (optional, embed-ready)
- Images for 4 featured tools: D.A.D, O.G.R.E, rāSHio, bookSHelf
- Iframe toggle (click to load, not auto-load) for projects with `externalUrl`
- Iframe `sandbox="allow-scripts allow-same-origin"` + `loading="lazy"` attributes
- Image paths compatible with `basePath: '/steven'` in production

### Must NOT Have (Guardrails)
- Do NOT use react-chrono horizontal mode, slideshow, nested timelines, or search features
- Do NOT create a MUI theme, ThemeProvider, or install MUI packages
- Do NOT modify `src/data/experience.ts` types — transformation happens at component level
- Do NOT modify YearNav.tsx internals — only change the items passed to it
- Do NOT add images to non-featured tools (wiSHlist, shDev, 11Gauge, etc.) or initiatives/achievements section
- Do NOT auto-load iframes — must be user-triggered toggle
- Do NOT create an over-engineered MediaPreview abstraction — simple conditional `<img>` / `<iframe>` in the card
- Do NOT wrap react-chrono instances in ScrollReveal (conflicts with Chrono's scroll behavior)
- Do NOT add error boundaries, retry logic, or loading skeletons beyond a simple spinner for iframes
- Do NOT create an image optimization pipeline (config says `unoptimized: true`)
- Do NOT change `next.config.ts` unless react-chrono specifically requires `transpilePackages`
- Do NOT add any npm packages beyond react-chrono

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None (portfolio site, visual refactor)
- **Framework**: N/A

### QA Policy
Every task includes agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Build verification**: Bash — `npm run build` (static export catches SSR errors that dev mode hides)
- **Visual verification**: Playwright — navigate pages, assert DOM, screenshot
- **Dead code check**: Bash — grep for orphaned references
- **Iframe embed**: Playwright — click toggle, verify iframe loads

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — 3 parallel, no dependencies):
├── Task 1: Install react-chrono, verify build compatibility [quick]
├── Task 2: Delete scrubber, clean ExperienceView + globals.css [quick]
└── Task 3: Create 4 featured tool images in public/projects/ [visual-engineering]

Wave 2 (After Tasks 1+2 — core timeline build):
└── Task 4: Build ChronoTimeline component with react-chrono [deep]

Wave 3 (After Task 4 for T5, after Task 3 for T6 — parallel):
├── Task 5: Integrate ChronoTimeline into ExperienceView, update YearNav [deep]
└── Task 6: Add image previews + iframe toggle to ProjectGrid [visual-engineering]

Wave 4 (After Tasks 5+6 — final verification):
└── Task 7: Full build + visual integration test [unspecified-low]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 4 → Task 5 → Task 7 → F1-F4
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 3 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | — | 4 |
| 2 | — | 4 |
| 3 | — | 6 |
| 4 | 1, 2 | 5 |
| 5 | 4 | 7 |
| 6 | 3 | 7 |
| 7 | 5, 6 | F1-F4 |
| F1-F4 | 7 | — |

### Agent Dispatch Summary

- **Wave 1**: 3 tasks — T1 → `quick`, T2 → `quick`, T3 → `visual-engineering`
- **Wave 2**: 1 task — T4 → `deep` + `frontend-ui-ux` skill
- **Wave 3**: 2 tasks — T5 → `deep` + `frontend-ui-ux` skill, T6 → `visual-engineering`
- **Wave 4**: 1 task — T7 → `unspecified-low` + `playwright` skill
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright`, F4 → `deep`

---

## TODOs

- [ ] 1. Install react-chrono & Verify Build Compatibility

  **What to do**:
  - Run `npm install react-chrono`
  - Run `npm run build` to check for immediate SSR/`window is not defined` errors
  - If build fails with `window` error: the component MUST be imported via `next/dynamic(() => import('react-chrono').then(m => m.Chrono), { ssr: false })` — document this requirement for Task 4
  - Import `react-chrono/dist/style.css` in `src/app/globals.css` (add after the chalkboard import) and verify no visual conflicts by running `npm run build` again
  - Run `npx tsc --noEmit` to verify no type errors from the new dependency
  - Note: this project uses `output: 'export'` (static site) — all pages are pre-rendered at build time, making SSR issues surface during build, not at runtime

  **Must NOT do**:
  - Do NOT install any packages beyond react-chrono
  - Do NOT modify any source components in this task
  - Do NOT add transpilePackages config unless build specifically requires it

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 2, 3)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:
  - `package.json` (full file) — current deps: React 19.2.3, Next.js 16.1.6, framer-motion, GSAP
  - `next.config.ts` (full file, 16 lines) — `output: 'export'`, `basePath: '/steven'` in prod, `images: { unoptimized: true }`
  - react-chrono GitHub: https://github.com/prabhuignoto/react-chrono — v3.3.3, React 19 peer dep
  - Known issue: https://github.com/prabhuignoto/react-chrono/issues/461 — `window is not defined` in Next.js SSR

  **WHY Each Reference Matters**:
  - `package.json` — verify peer dep compatibility (React 19.2.3 must match react-chrono's `^19.2.3`)
  - `next.config.ts` — `output: 'export'` means build-time SSR, making `window` errors surface during `npm run build`
  - Issue #461 — documents the exact error we need to guard against and the fix pattern

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: react-chrono installs and builds cleanly
    Tool: Bash
    Preconditions: No react-chrono in package.json
    Steps:
      1. Run `npm install react-chrono` — expect exit 0
      2. Run `npm ls react-chrono` — expect clean tree, no UNMET PEER DEP
      3. Run `npx tsc --noEmit` — expect 0 errors
      4. Run `npm run build` — expect exit 0, no 'window is not defined'
    Expected Result: All commands pass, react-chrono in dependency tree
    Failure Indicators: ERESOLVE error, tsc errors, build fails with window/SSR error
    Evidence: .sisyphus/evidence/task-1-install.txt

  Scenario: react-chrono CSS imports without conflict
    Tool: Bash
    Preconditions: react-chrono installed
    Steps:
      1. Add `@import 'react-chrono/dist/style.css';` to src/app/globals.css
      2. Run `npm run build` — expect exit 0
    Expected Result: Build passes with CSS import
    Failure Indicators: CSS parse error, build failure
    Evidence: .sisyphus/evidence/task-1-css-import.txt
  ```

  **Commit**: YES (combined with Task 2)
  - Message: `refactor(experience): remove timeline scrubber and add react-chrono dependency`
  - Files: `package.json`, `package-lock.json`, `src/app/globals.css`
  - Pre-commit: `npm run build`

- [ ] 2. Delete TimelineScrubber, Clean ExperienceView & CSS

  **What to do**:
  - **Delete file**: `src/components/sections/TimelineScrubber.tsx` (205 lines)
  - **Simplify ExperienceView.tsx** (`src/components/sections/ExperienceView.tsx`):
    - Remove `useState`, `useMemo` imports from React
    - Remove `{ TimelineScrubber }` import (line 6)
    - Remove `MIN_YEAR`, `MAX_YEAR` constants (lines 9-10)
    - Remove `parseYear` function (lines 12-15)
    - Remove `scrubValue`/`activeYear` state hooks (lines 20-21)
    - Remove `handleScrub`/`handleReset` callbacks (lines 23-30)
    - Remove `filtered` useMemo (lines 32-39)
    - Simplify `yearNavItems`: compute from `experiences` directly (no filter dep). Keep ordering logic (post-sec → secondary → primary) and `instId` mapping
    - Remove `<TimelineScrubber ... />` JSX (lines 57-62)
    - Pass `experiences` directly to `<Timeline experiences={experiences} />`
    - Keep `instId` import from `'./Timeline'`
    - Keep `YearNav` import and usage
    - Evaluate: if no hooks remain, consider removing `'use client'` (but `useMemo` for yearNavItems may still be useful for ordering)
  - **Clean globals.css**: Delete lines 116-177 in `src/app/globals.css` — the entire `.timeline-scrubber` CSS block (comment header `/* ─── Timeline Scrubber */` through `.timeline-scrubber:focus-visible::-webkit-slider-thumb`)

  **Must NOT do**:
  - Do NOT modify `Timeline.tsx` (that's Task 4/5)
  - Do NOT modify `YearNav.tsx` internals
  - Do NOT delete `YearNav` from ExperienceView
  - Do NOT remove the `instId` import
  - Do NOT delete any CSS beyond the `.timeline-scrubber` block

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 3)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 4
  - **Blocked By**: None

  **References**:
  - `src/components/sections/ExperienceView.tsx` (full file, 66 lines) — read fully to understand what to keep vs remove
  - `src/components/sections/TimelineScrubber.tsx` (full file, 205 lines) — being DELETED
  - `src/app/globals.css:116-177` — the `.timeline-scrubber` CSS block to delete (starts with comment `/* ─── Timeline Scrubber */`, ends with `.timeline-scrubber:focus-visible::-webkit-slider-thumb` closing brace on line 177)

  **WHY Each Reference Matters**:
  - `ExperienceView.tsx` — must understand the full component to correctly simplify without breaking YearNav or Timeline integration
  - `globals.css` — delete exactly the right CSS block (lines 116-177), not more

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: TimelineScrubber fully removed
    Tool: Bash
    Steps:
      1. `test ! -f src/components/sections/TimelineScrubber.tsx && echo 'PASS' || echo 'FAIL'`
      2. `grep -r 'TimelineScrubber' src/ && echo 'FAIL' || echo 'PASS'`
      3. `grep -r 'timeline-scrubber' src/ && echo 'FAIL' || echo 'PASS'`
    Expected Result: File gone, zero references in codebase
    Evidence: .sisyphus/evidence/task-2-scrubber-removed.txt

  Scenario: ExperienceView simplified
    Tool: Bash
    Steps:
      1. `grep 'YearNav' src/components/sections/ExperienceView.tsx` — expect match
      2. `grep 'instId' src/components/sections/ExperienceView.tsx` — expect match
      3. `grep -E 'handleScrub|handleReset|scrubValue|activeYear|MIN_YEAR|MAX_YEAR' src/components/sections/ExperienceView.tsx && echo 'FAIL' || echo 'PASS'`
      4. `npx tsc --noEmit` — expect 0 errors
    Expected Result: Kept: YearNav + instId. Removed: all filtering logic. Types clean.
    Evidence: .sisyphus/evidence/task-2-experienceview-simplified.txt
  ```

  **Commit**: YES (combined with Task 1)
  - Message: `refactor(experience): remove timeline scrubber and add react-chrono dependency`
  - Files: `src/components/sections/ExperienceView.tsx`, `src/app/globals.css`; Deleted: `src/components/sections/TimelineScrubber.tsx`
  - Pre-commit: `npm run build`

- [ ] 3. Create Placeholder Project Images for Featured Tools

  **What to do**:
  - Create directory `public/projects/`
  - Create 4 images (800×450 PNG, 16:9 aspect ratio) for featured tools:
    - `rashio.png` — screenshot of the live site at https://rashio.pages.dev (use Playwright to navigate and capture screenshot)
    - `dad.png` — branded placeholder (dark background matching `--color-bg-primary`, project name 'D.A.D' + subtitle 'Dynamic Assessment Developer' in accent color, clean typographic style)
    - `ogre.png` — branded placeholder (same style, 'O.G.R.E' + 'Ollama Grading and Rubric Evaluator')
    - `bookshelf.png` — branded placeholder (same style, 'bookSHelf' + 'Book Merge and Remastering Tool')
  - Add `imageUrl?: string` to the `Project` interface in `src/data/projects.ts`
  - Populate `imageUrl` for the 4 featured tools:
    - `rashio`: `imageUrl: '/projects/rashio.png'`
    - `dad`: `imageUrl: '/projects/dad.png'`
    - `ogre`: `imageUrl: '/projects/ogre.png'`
    - `bookshelf`: `imageUrl: '/projects/bookshelf.png'`
  - Leave all other projects without `imageUrl` (undefined = no image shown)
  - Note: `basePath: '/steven'` is added automatically by Next.js for static assets in `public/`. When using `<img src="/projects/rashio.png">` in static export, the HTML output includes the basePath. If using `next/image`, set `unoptimized` prop. If using plain `<img>`, prefix with `process.env.__NEXT_ROUTER_BASEPATH` or just use relative paths — test in production build.

  **Must NOT do**:
  - Do NOT create images for non-featured tools (wiSHlist, shDev, 11Gauge, etc.)
  - Do NOT add images to initiatives/achievements projects
  - Do NOT create an image optimization pipeline
  - Do NOT install any image generation libraries

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
  - **Skills**: `["playwright", "frontend-design"]`
    - `playwright`: Needed to screenshot rashio.pages.dev for the rāSHio image
    - `frontend-design`: Needed to create branded placeholder images that match the chalkboard theme

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 1, 2)
  - **Parallel Group**: Wave 1
  - **Blocks**: Task 6
  - **Blocked By**: None

  **References**:
  - `src/data/projects.ts` (full file, 289 lines) — Project interface at lines 3-15 (add `imageUrl?: string`). Featured tools: `dad` (line 19), `ogre` (line 31), `rashio` (line 44), `bookshelf` (line 58)
  - `next.config.ts` — `basePath: '/steven'` in production, `images: { unoptimized: true }`
  - Live site: https://rashio.pages.dev — screenshot target for rāSHio image
  - `src/styles/chalkboard.css` — theme colors for branded placeholders: `--color-bg-primary` (dark), `--color-accent` (#5ecec3 teal), `--color-text-primary` (#f0ede8)

  **WHY Each Reference Matters**:
  - `projects.ts` — interface must be updated before ProjectGrid can conditionally render images
  - `next.config.ts` — basePath affects how images are served in production
  - rashio.pages.dev — must capture a real screenshot for the one project with a live URL
  - chalkboard.css colors — placeholders should match the site's aesthetic

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Project images created
    Tool: Bash
    Steps:
      1. `ls public/projects/*.png | wc -l` — expect 4
      2. `test -f public/projects/rashio.png && echo 'PASS'`
      3. `test -f public/projects/dad.png && echo 'PASS'`
      4. `test -f public/projects/ogre.png && echo 'PASS'`
      5. `test -f public/projects/bookshelf.png && echo 'PASS'`
    Expected Result: All 4 images exist
    Evidence: .sisyphus/evidence/task-3-images-created.txt

  Scenario: Project data updated with imageUrl
    Tool: Bash
    Steps:
      1. `grep 'imageUrl' src/data/projects.ts | wc -l` — expect at least 5 (1 interface + 4 values)
      2. `npx tsc --noEmit` — expect 0 errors
    Expected Result: Interface updated, 4 projects have imageUrl, types clean
    Evidence: .sisyphus/evidence/task-3-data-updated.txt
  ```

  **Commit**: YES (combined with Task 6)
  - Message: `feat(projects): add image previews and iframe embed toggle`
  - Files: `src/data/projects.ts`, `public/projects/*`

- [ ] 4. Build ChronoTimeline Component with react-chrono

  **What to do**:
  - Create NEW file `src/components/sections/ChronoTimeline.tsx` (keep old `Timeline.tsx` as fallback until Task 5 integrates)
  - Import react-chrono via `next/dynamic`:
    ```tsx
    const Chrono = dynamic(() => import('react-chrono').then(m => m.Chrono), { ssr: false })
    ```
  - Copy `ExpandableCourse` component from `Timeline.tsx` (lines 8-49) — keep exactly as-is with framer-motion
  - Copy `SectionHeading` component from `Timeline.tsx` (lines 129-138) — keep exactly as-is
  - Export `instId` function (copy from Timeline.tsx lines 51-53) — needed by ExperienceView for YearNav
  - Transform `Institution[]` into react-chrono items. For each institution, create a timeline item:
    ```tsx
    {
      title: `${inst.dateStart} – ${inst.dateEnd || 'Present'}`,
      cardTitle: inst.name,
      cardSubtitle: inst.location,
    }
    ```
  - Render custom card content as children of `<Chrono>` — one React element per item. Each child renders:
    - "Current" badge (if `inst.status === 'current'`)
    - Concurrent annotation (if `inst.concurrent`)
    - Position titles, notes
    - ExpandableCourse components for each course
  - Render 3 separate `<Chrono>` instances (one per education level):
    - Post-Secondary section with SectionHeading
    - Secondary section with SectionHeading
    - Elementary section with SectionHeading
  - Each section wrapped in a div with an ID for YearNav scroll-spy:
    - `id="section-post-secondary"`
    - `id="section-secondary"`
    - `id="section-elementary"`
  - Map react-chrono theme to chalkboard aesthetic. Use hardcoded hex values that match the CSS variables (react-chrono theme doesn't support CSS var() strings):
    ```tsx
    theme={{
      primary: '#5ecec3',        // --color-accent
      secondary: 'rgba(94,206,195,0.3)',
      cardBgColor: '#1e281e',     // --color-surface (approx)
      cardForeColor: '#f0ede8',   // --color-text-primary
      titleColor: '#b8b0a4',      // --color-text-muted
      titleColorActive: '#5ecec3', // --color-accent
    }}
    ```
  - Use `mode="VERTICAL"` (react-chrono v3 accepts lowercase 'vertical' too)
  - Set `cardHeight="auto"` or equivalent to prevent cards from being clipped (important for ExpandableCourse expand animation)
  - Do NOT use `ScrollReveal` wrapper around Chrono — conflicts with Chrono's scroll behavior. Keep ScrollReveal on the section headings only.
  - Add a loading fallback div for the dynamic import (simple "Loading timeline..." text or skeleton)

  **Must NOT do**:
  - Do NOT use horizontal mode, slideshow, nested timelines, search, or keyboard navigation features from react-chrono
  - Do NOT modify `Timeline.tsx` (keep as fallback until Task 5)
  - Do NOT modify `src/data/experience.ts` types
  - Do NOT create a separate data transformation utility file — keep transformation inline in the component
  - Do NOT use `TimelineOppositeContent` or any alternate content layout

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Core component with data transformation, custom card rendering, theme mapping, SSR-safe dynamic import — needs careful architectural thinking
  - **Skills**: `["frontend-ui-ux"]`
    - `frontend-ui-ux`: Component composition with react-chrono API, theme mapping to match existing design

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on Task 1 for install + Task 2 for clean ExperienceView)
  - **Parallel Group**: Wave 2 (alone)
  - **Blocks**: Task 5
  - **Blocked By**: Tasks 1, 2

  **References**:

  **Pattern References**:
  - `src/components/sections/Timeline.tsx` (full file, 213 lines) — the source for components to copy/adapt:
    - Lines 8-49: `ExpandableCourse` — copy exactly as-is
    - Lines 51-53: `instId` — copy export function
    - Lines 55-127: `TimelineItem` — this is what react-chrono REPLACES (do NOT copy)
    - Lines 129-138: `SectionHeading` — copy exactly as-is
    - Lines 140-213: `Timeline` component — adapt the section grouping logic (postSecondary/secondary/primary filters)
  - `src/components/animations/ScrollReveal.tsx` — GSAP scroll animation wrapper. Use ONLY on SectionHeading, NOT on Chrono instances

  **API/Type References**:
  - `src/data/experience.ts` (full file, 285 lines) — `Institution` interface (lines 16-25), `Position` (10-14), `Course` (4-8). Key fields for mapping: `name`, `location`, `dateStart`, `dateEnd`, `status`, `level`, `positions[]`, `concurrent?`

  **External References**:
  - react-chrono docs: https://react-chrono.prabhumurthy.com/api/props.html — props API, `mode`, `theme`, `cardHeight`
  - react-chrono theming: https://react-chrono.prabhumurthy.com/customize/theme.html — theme object properties
  - react-chrono custom content: children pattern — one React element per timeline item
  - `next/dynamic` docs: https://nextjs.org/docs/app/building-your-application/optimizing/lazy-loading — `{ ssr: false }` pattern for client-only components

  **WHY Each Reference Matters**:
  - `Timeline.tsx` — primary source file. Executor must read it fully to know what to copy (ExpandableCourse, instId, SectionHeading) vs what react-chrono replaces (TimelineItem, manual dots/lines)
  - `experience.ts` — data contract. Executor needs field names for the Institution→TimelineItem transformation
  - react-chrono docs — API shape, theme props, custom content pattern
  - `next/dynamic` — the SSR-safe import pattern (first usage in this codebase)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: ChronoTimeline component created with react-chrono
    Tool: Bash
    Steps:
      1. `test -f src/components/sections/ChronoTimeline.tsx && echo 'PASS'`
      2. `grep 'next/dynamic' src/components/sections/ChronoTimeline.tsx` — expect match
      3. `grep 'react-chrono' src/components/sections/ChronoTimeline.tsx` — expect match
      4. `grep 'ExpandableCourse' src/components/sections/ChronoTimeline.tsx` — expect match
      5. `grep 'SectionHeading' src/components/sections/ChronoTimeline.tsx` — expect match
      6. `grep 'export function instId' src/components/sections/ChronoTimeline.tsx` — expect match
      7. `npx tsc --noEmit` — expect 0 errors
    Expected Result: New component exists with react-chrono, preserves ExpandableCourse/SectionHeading/instId
    Evidence: .sisyphus/evidence/task-4-chrono-component.txt

  Scenario: Three Chrono sections with IDs
    Tool: Bash
    Steps:
      1. `grep 'section-post-secondary' src/components/sections/ChronoTimeline.tsx` — expect match
      2. `grep 'section-secondary' src/components/sections/ChronoTimeline.tsx` — expect match
      3. `grep 'section-elementary' src/components/sections/ChronoTimeline.tsx` — expect match
    Expected Result: All 3 section wrapper IDs present
    Evidence: .sisyphus/evidence/task-4-section-ids.txt
  ```

  **Commit**: NO (groups with Task 5)

- [ ] 5. Integrate ChronoTimeline into ExperienceView, Update YearNav

  **What to do**:
  - In `ExperienceView.tsx`:
    - Replace `import { Timeline, instId } from './Timeline'` with `import { ChronoTimeline, instId } from './ChronoTimeline'`
    - Replace `<Timeline experiences={...} />` with `<ChronoTimeline experiences={experiences} />`
    - Update `yearNavItems` to use section-level IDs instead of per-institution:
      ```tsx
      const yearNavItems = [
        { year: 'Post-Secondary', id: 'section-post-secondary' },
        { year: 'Secondary', id: 'section-secondary' },
        { year: 'Elementary', id: 'section-elementary' },
      ]
      ```
    - This simplifies the component significantly — `yearNavItems` becomes a static const, potentially removing need for `useMemo`
  - Verify YearNav scroll-spy works:
    - Scroll through the page
    - YearNav should highlight the current section as it enters viewport
  - Clean up old `Timeline.tsx`:
    - If `instId` was copied to ChronoTimeline.tsx, check if Timeline.tsx is still imported anywhere
    - If not imported anywhere, delete `Timeline.tsx` entirely
    - If still imported (e.g., by other pages), keep it but remove internal components that are now in ChronoTimeline
  - Run `npm run build` to verify static export works end-to-end

  **Must NOT do**:
  - Do NOT modify YearNav.tsx internals — only change the items array passed to it
  - Do NOT keep both old Timeline and new ChronoTimeline rendering simultaneously
  - Do NOT modify the experience data types

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Integration task requiring verification of scroll-spy, build, and visual output
  - **Skills**: `["frontend-ui-ux", "playwright"]`
    - `frontend-ui-ux`: Integration and visual verification
    - `playwright`: Verify scroll-spy and visual rendering

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 6)
  - **Parallel Group**: Wave 3 (with Task 6)
  - **Blocks**: Task 7
  - **Blocked By**: Task 4

  **References**:
  - `src/components/sections/ExperienceView.tsx` — the file being updated (after Task 2 simplification)
  - `src/components/sections/ChronoTimeline.tsx` — the new component from Task 4
  - `src/components/sections/Timeline.tsx` — old component to potentially delete
  - `src/components/ui/YearNav.tsx` (full file, 115 lines) — IntersectionObserver at line 20. It watches for elements whose IDs match `items[].id`. Must verify the new section-level IDs (`section-post-secondary`, etc.) are observable.

  **WHY Each Reference Matters**:
  - `ExperienceView.tsx` — wiring point between new ChronoTimeline and existing page infrastructure
  - `YearNav.tsx` — must verify IntersectionObserver finds the new section-level IDs in the DOM

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Experience page renders react-chrono timeline
    Tool: Playwright (playwright skill)
    Preconditions: Dev server at localhost:3000
    Steps:
      1. Navigate to `http://localhost:3000/experience`
      2. Wait for page load (timeout: 15s — dynamic import may take time)
      3. Assert: text 'Post-Secondary' visible on page
      4. Assert: text 'Secondary' visible on page
      5. Assert: text 'Butte College' visible on page
      6. Assert: text 'Pleasant Valley High School' visible on page
      7. Assert: at least one element with `[aria-expanded]` exists (ExpandableCourse)
      8. Click first `[aria-expanded='false']` button
      9. Wait 500ms (framer-motion animation)
      10. Assert: `[aria-expanded='true']` exists (course expanded)
      11. Take full-page screenshot
    Expected Result: 3 timeline sections render, courses expandable
    Failure Indicators: Blank page, missing sections, ExpandableCourse doesn't toggle
    Evidence: .sisyphus/evidence/task-5-experience-page.png

  Scenario: YearNav scroll-spy tracks sections
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to `/experience`
      2. Scroll to `#section-secondary` element
      3. Wait 500ms (IntersectionObserver debounce)
      4. Assert: YearNav has an element with `aria-current='location'` containing 'Secondary'
    Expected Result: YearNav highlights current section
    Failure Indicators: No active state, wrong section highlighted
    Evidence: .sisyphus/evidence/task-5-yearnav-scroll.png

  Scenario: Build succeeds (static export)
    Tool: Bash
    Steps:
      1. `npm run build` — expect exit 0
      2. `npm run lint` — expect exit 0
    Expected Result: Static export builds cleanly, no SSR errors
    Evidence: .sisyphus/evidence/task-5-build.txt
  ```

  **Commit**: YES
  - Message: `feat(experience): replace custom timeline with react-chrono`
  - Files: `src/components/sections/ChronoTimeline.tsx` (new), `src/components/sections/ExperienceView.tsx`; Deleted: `src/components/sections/Timeline.tsx` (if unused)
  - Pre-commit: `npm run build`

- [ ] 6. Add Image Previews & Iframe Toggle to ProjectGrid

  **What to do**:
  - In `ProjectGrid.tsx`, modify the **Tools & Software** section card rendering:
  - **Image preview**: If `project.imageUrl` exists, render an `<img>` tag at the top of the card (before the header section):
    ```tsx
    {project.imageUrl && (
      <div className="mb-4 -mx-5 -mt-5 overflow-hidden rounded-t-lg">
        <img
          src={project.imageUrl}
          alt={`Preview of ${project.title}`}
          className="w-full aspect-video object-cover"
          loading="lazy"
        />
      </div>
    )}
    ```
    - Use `aspect-video` (16:9) and `object-cover` for consistent sizing
    - Negative margins to make image bleed to card edges (inside chalk-card padding)
    - If no `imageUrl`, render nothing (no placeholder)
  - **Iframe toggle**: If `project.externalUrl` exists, add a "Live Preview" button in the card footer (alongside existing "Code" and "Live" links):
    - New `useState` for `previewId` (string | null) — tracks which project's iframe is open
    - Button: "▶ Preview" / "✕ Close Preview" toggle
    - When toggled ON, render an iframe between the image and card content:
      ```tsx
      <iframe
        src={project.externalUrl}
        sandbox="allow-scripts allow-same-origin"
        loading="lazy"
        title={`Live preview of ${project.title}`}
        className="w-full border border-[var(--color-border)] rounded"
        style={{ height: '400px' }}
      />
      ```
    - Add a simple loading spinner overlay while iframe loads (use iframe `onLoad` event)
    - Do NOT auto-load iframes — only load when user clicks
  - **Do NOT modify** the Achievements & Initiatives section — images and iframes are Tools section only
  - Handle basePath for images: In static export, Next.js prepends basePath to static assets automatically for `<img src>` paths from `public/`. If images don't load in production build, prefix with `process.env.__NEXT_ROUTER_BASEPATH || ''`.

  **Must NOT do**:
  - Do NOT add iframe to cards without `externalUrl`
  - Do NOT add images to the Achievements & Initiatives section
  - Do NOT create a separate MediaPreview abstraction component
  - Do NOT add retry logic, error boundaries, or elaborate loading states
  - Do NOT auto-load iframes (user-triggered only)
  - Do NOT install additional packages

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI enhancement with visual output — image layout, iframe embedding, interactive toggle
  - **Skills**: `["frontend-design"]`
    - `frontend-design`: Card layout changes, image integration, iframe styling

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 5)
  - **Parallel Group**: Wave 3 (with Task 5)
  - **Blocks**: Task 7
  - **Blocked By**: Task 3

  **References**:
  - `src/components/sections/ProjectGrid.tsx` (full file, 269 lines) — the file being modified. Key areas:
    - Lines 95-218: Tool card rendering (where images/iframes go)
    - Lines 168-212: Card footer (where "Live Preview" button goes alongside "Code" and "Live" links)
    - Lines 220-266: Achievements section (DO NOT MODIFY)
  - `src/data/projects.ts` — after Task 3, has `imageUrl?: string` on 4 featured tools and `externalUrl` on rāSHio
  - `src/styles/chalkboard.css` — `.chalk-card` padding is typically `p-5` or `p-6`, negative margins for bleed-to-edge image need to match

  **WHY Each Reference Matters**:
  - `ProjectGrid.tsx` — must understand existing card structure to add image/iframe without breaking layout, expand/collapse, or status badges
  - `projects.ts` — know which projects have `imageUrl` and `externalUrl` to write correct conditionals
  - chalkboard.css — card padding values for calculating negative margins on bleed-edge images

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Featured tool cards show images
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, project images in public/projects/
    Steps:
      1. Navigate to `http://localhost:3000/projects`
      2. Assert: `img[alt*="rāSHio"]` visible
      3. Assert: `img[alt*="D.A.D"]` visible
      4. Assert: `img[alt*="O.G.R.E"]` visible
      5. Assert: `img[alt*="bookSHelf"]` visible
      6. Assert: wiSHlist card does NOT have an img element
      7. Take screenshot of Tools section
    Expected Result: 4 featured tool cards show images, non-featured do not
    Failure Indicators: Missing images, broken image icons, images on wrong cards
    Evidence: .sisyphus/evidence/task-6-project-images.png

  Scenario: Iframe toggle works for rāSHio
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to `/projects`
      2. Find the rāSHio card
      3. Assert: button containing 'Preview' is visible
      4. Click the 'Preview' button
      5. Wait 2s (iframe load time)
      6. Assert: iframe with src containing 'rashio.pages.dev' exists
      7. Assert: iframe has sandbox attribute
      8. Take screenshot
    Expected Result: Iframe appears with rāSHio content
    Failure Indicators: No iframe, iframe blocked by CORS/X-Frame-Options, no sandbox
    Evidence: .sisyphus/evidence/task-6-iframe-toggle.png

  Scenario: Achievements section untouched
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to `/projects`
      2. Assert: '#section-achievements' section has NO img elements (except SVG icons)
      3. Assert: '#section-achievements' section has NO iframe elements
    Expected Result: Achievements section unchanged
    Failure Indicators: Images or iframes in achievements section
    Evidence: .sisyphus/evidence/task-6-achievements-untouched.png
  ```

  **Commit**: YES (combined with Task 3)
  - Message: `feat(projects): add image previews and iframe embed toggle`
  - Files: `src/components/sections/ProjectGrid.tsx`
  - Pre-commit: `npm run build`

- [ ] 7. Full Build + Visual Integration Test

  **What to do**:
  - Run `npx tsc --noEmit` — expect 0 errors
  - Run `npm run lint` — expect pass
  - Run `npm run build` — expect success (static export, no SSR errors)
  - Start dev server: `npm run dev`
  - Use Playwright to test both pages:
  - **`/experience` checks**:
    - 3 react-chrono timeline sections render
    - Section headings (Post-Secondary, Secondary, Elementary) visible
    - All 7 institutions listed
    - "Current" badge on Butte College and PV High
    - Concurrent annotation visible on PV High
    - At least one ExpandableCourse expands/collapses
    - YearNav scroll-spy highlights correct section on scroll
    - No unstyled flash, no console errors
  - **`/projects` checks**:
    - 4 featured tool images visible and load correctly
    - rāSHio iframe toggle works
    - Achievements section has no images or iframes
    - Card expand/collapse still works
    - Status badges still render correctly
  - **Cross-page checks**:
    - Home page loads without errors
    - Navigation between pages works
    - No console errors on any page
  - **Mobile viewport** (375px):
    - Both pages render without horizontal overflow
    - react-chrono cards readable
    - Project images scale appropriately

  **Must NOT do**:
  - Do NOT modify any source files
  - Do NOT skip the `npm run build` step

  **Recommended Agent Profile**:
  - **Category**: `unspecified-low`
  - **Skills**: `["playwright"]`
    - `playwright`: Full browser testing across pages and viewports

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 4 (alone)
  - **Blocks**: Final verification wave (F1-F4)
  - **Blocked By**: Tasks 5, 6

  **References**:
  - All modified files from Tasks 1-6
  - `next.config.ts` — `output: 'export'`, `basePath: '/steven'`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Static build succeeds
    Tool: Bash
    Steps:
      1. `npx tsc --noEmit` — exit 0
      2. `npm run lint` — exit 0
      3. `npm run build` — exit 0, no 'window is not defined' in output
    Expected Result: Clean build
    Evidence: .sisyphus/evidence/task-7-build.txt

  Scenario: Experience page full test
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to `/experience`
      2. Verify 3 timeline sections with headings
      3. Verify all institutions present (Butte, CSU Chico, PV High, AV High, SL High, Clifford)
      4. Verify Current badges
      5. Toggle one ExpandableCourse
      6. Scroll to bottom, verify YearNav updates
      7. No console errors
      8. Full-page screenshot
    Expected Result: Complete experience page working
    Evidence: .sisyphus/evidence/task-7-experience-full.png

  Scenario: Projects page full test
    Tool: Playwright (playwright skill)
    Steps:
      1. Navigate to `/projects`
      2. Verify 4 featured tool images
      3. Toggle rāSHio iframe
      4. Expand one project description
      5. Verify achievements section unchanged
      6. No console errors
      7. Full-page screenshot
    Expected Result: Complete projects page working
    Evidence: .sisyphus/evidence/task-7-projects-full.png

  Scenario: Mobile responsive
    Tool: Playwright (playwright skill)
    Steps:
      1. Set viewport 375×812 (iPhone SE)
      2. Navigate to `/experience` — verify no horizontal overflow, timeline readable
      3. Navigate to `/projects` — verify images scale, no overflow
      4. Screenshot both pages
    Expected Result: Both pages responsive at mobile width
    Evidence: .sisyphus/evidence/task-7-mobile-experience.png, .sisyphus/evidence/task-7-mobile-projects.png
  ```

  **Commit**: NO (verification only)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, grep, curl). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files in `.sisyphus/evidence/`. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `npm run lint` + `npm run build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Navigate to `/experience`: verify 3 Chrono sections render, section headings present, courses expandable, YearNav tracks sections, no console errors. Navigate to `/projects`: verify images on featured tools, iframe toggle on rāSHio card, no broken images. Test mobile viewport (375px). Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **After Tasks 1+2**: `refactor(experience): remove timeline scrubber and add react-chrono dependency` — `package.json`, `package-lock.json`, `src/components/sections/ExperienceView.tsx`, `src/app/globals.css`; Deleted: `src/components/sections/TimelineScrubber.tsx`
- **After Tasks 4+5**: `feat(experience): replace custom timeline with react-chrono` — `src/components/sections/ChronoTimeline.tsx` (new), `src/components/sections/ExperienceView.tsx`, `src/components/sections/Timeline.tsx` (cleaned)
- **After Tasks 3+6**: `feat(projects): add image previews and iframe embed toggle` — `src/data/projects.ts`, `src/components/sections/ProjectGrid.tsx`, `public/projects/*`

---

## Success Criteria

### Verification Commands
```bash
npm run build                      # Expected: exit 0, no SSR errors
npm run lint                       # Expected: pass
grep -r "TimelineScrubber" src/    # Expected: no matches
grep -r "timeline-scrubber" src/   # Expected: no matches
grep "react-chrono" package.json   # Expected: match
ls public/projects/*.png           # Expected: 4 files
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] `npm run build` succeeds (static export)
- [ ] `/experience` shows react-chrono timelines with 3 sections
- [ ] `/projects` shows images on featured tools + iframe toggle
- [ ] No dead code or orphaned references
- [ ] Mobile responsive (375px viewport)
