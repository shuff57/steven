# Replace FlipCard with PixelTransition

## TL;DR

> **Quick Summary**: Replace all FlipCard card-flip animations with the PixelTransition component from reactbits.dev, using a pixel-dissolve hover/click effect to toggle between front and back content across all three card-based views.
> 
> **Deliverables**:
> - New `PixelTransition.tsx` component adapted for the project theme and Next.js SSR
> - Migrated course cards in `Timeline.tsx`
> - Migrated project cards in `ProjectGrid.tsx`
> - Migrated course catalog cards in `CourseCatalog.tsx`
> - Deleted `FlipCard.tsx` (clean removal, zero remaining references)
> 
> **Estimated Effort**: Short
> **Parallel Execution**: YES — 2 waves
> **Critical Path**: Task 1 → Tasks 2, 3, 4 (parallel) → Task 5 → Final Verification

---

## Context

### Original Request
Replace the card flip animation with the PixelTransition component from https://reactbits.dev/animations/pixel-transition to show content across the portfolio site.

### Interview Summary
**Key Discussions**:
- **Scope**: Replace in ALL locations (Timeline, ProjectGrid, CourseCatalog)
- **Pixel color**: Dark/background color (`var(--color-bg-primary)` / `#141a14`) for the dissolve blocks
- **Interaction**: Keep hover on desktop, click on mobile (PixelTransition default behavior)

**Research Findings**:
- PixelTransition uses GSAP — already installed in the project ✓
- Tailwind + TypeScript variant available — no extra CSS needed ✓
- FlipCard used in **3 files** (not 2): Timeline.tsx, ProjectGrid.tsx, CourseCatalog.tsx

### Metis Review
**Identified Gaps** (addressed):
- **Missed third usage**: CourseCatalog.tsx also imports FlipCard — now included in scope
- **SSR crash**: PixelTransition accesses `window` at top level — must be guarded for Next.js
- **Pointer events bug**: secondContent gets `pointerEvents: 'none'` — breaks clickable links on ProjectGrid back face
- **Accessibility regression**: Original FlipCard has `role="button"`, `aria-pressed`, `aria-label`, keyboard handlers — PixelTransition lacks these
- **Hardcoded styles**: PixelTransition uses `bg-[#222]`, `border-2 border-white`, `w-[300px]` — must use theme variables
- **GSAP import convention**: Project uses centralized `@/lib/gsapConfig` — PixelTransition imports `gsap` directly
- **No GSAP cleanup**: Uses raw `useEffect` instead of `useGSAP` hook — leaks on unmount during CourseCatalog filtering
- **Reduced motion**: GSAP ignores CSS `prefers-reduced-motion` — needs JS check

---

## Work Objectives

### Core Objective
Replace FlipCard squish-toggle animation with PixelTransition dissolve animation in all three card views while preserving accessibility, theme consistency, and SSR compatibility.

### Concrete Deliverables
- `src/components/ui/PixelTransition.tsx` — Adapted component
- `src/components/sections/Timeline.tsx` — Migrated to PixelTransition
- `src/components/sections/ProjectGrid.tsx` — Migrated to PixelTransition
- `src/components/sections/CourseCatalog.tsx` — Migrated to PixelTransition
- `src/components/ui/FlipCard.tsx` — Deleted

### Definition of Done
- [ ] `npm run build` exits 0 (no SSR errors, no broken imports)
- [ ] Zero grep results for `FlipCard|FlipFront|FlipBack` in `src/`
- [ ] All three card views show pixel dissolve animation on hover/click
- [ ] ProjectGrid back-face links (GitHub, Live) are clickable
- [ ] Keyboard navigation works (Tab → Enter/Space to toggle)

### Must Have
- Pixel dissolve animation using GSAP (matching existing dependency)
- Dark/background pixel color (`var(--color-bg-primary)`)
- SSR-safe (no `window` access during SSR)
- Theme-consistent styling (CSS variables, no hardcoded colors)
- Accessible (keyboard support, ARIA attributes, reduced motion)
- GSAP cleanup on unmount via `useGSAP` hook
- Clickable interactive elements inside secondContent
- Fixed height sizing to match current card dimensions

### Must NOT Have (Guardrails)
- DO NOT touch the Achievements & Initiatives section in `ProjectGrid.tsx` (lines 168+)
- DO NOT change parent grid layouts in any file
- DO NOT add PixelTransition to new locations beyond the 3 existing FlipCard usages
- DO NOT refactor/improve card content JSX — transfer 1:1 into firstContent/secondContent
- DO NOT import gsap directly — use `@/lib/gsapConfig`
- DO NOT change the data layer (`experience.ts`, `projects.ts`, `courseCatalog.ts`)
- DO NOT add external dependencies beyond what's already installed

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (no test framework configured)
- **Automated tests**: None
- **Framework**: N/A

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Build verification**: Use Bash — `npm run build`, `npx tsc --noEmit`

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation):
└── Task 1: Create PixelTransition component [visual-engineering]

Wave 2 (After Wave 1 — migrate all consumers in PARALLEL):
├── Task 2: Migrate Timeline.tsx course cards (depends: 1) [quick]
├── Task 3: Migrate ProjectGrid.tsx tool cards (depends: 1) [quick]
└── Task 4: Migrate CourseCatalog.tsx cards (depends: 1) [quick]

Wave 3 (After Wave 2 — cleanup + verification):
└── Task 5: Delete FlipCard.tsx and verify clean removal (depends: 2, 3, 4) [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Tasks 2/3/4 → Task 5 → F1-F4
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 3 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1    | —         | 2, 3, 4 | 1   |
| 2    | 1         | 5       | 2   |
| 3    | 1         | 5       | 2   |
| 4    | 1         | 5       | 2   |
| 5    | 2, 3, 4   | F1-F4   | 3   |
| F1-4 | 5         | —       | Final |

### Agent Dispatch Summary

- **Wave 1**: **1 task** — T1 → `visual-engineering`
- **Wave 2**: **3 tasks** — T2-T4 → `quick`
- **Wave 3**: **1 task** — T5 → `quick`
- **Wave FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs


- [ ] 1. Create PixelTransition Component

  **What to do**:
  - Create `src/components/ui/PixelTransition.tsx` based on the reactbits Tailwind+TypeScript source (full source provided below in References)
  - **SSR Safety**: Move the `isTouchDevice` detection from module-level into `useState(false)` + `useEffect` to avoid `window is not defined` crashes in Next.js SSR
  - **Theme Styling**: Replace ALL hardcoded styles with theme CSS variables:
    - `bg-[#222]` → `bg-[var(--color-surface)]`
    - `border-2 border-white` → `border border-[var(--color-border)]`
    - `w-[300px]` → REMOVE entirely (parent grid controls width)
    - `rounded-[15px]` → `rounded-xl`
    - `text-white` → `text-[var(--color-text-primary)]`
  - **GSAP Import**: Import `gsap` from `@/lib/gsapConfig` (NOT from `'gsap'` directly)
  - **useGSAP Hook**: Replace raw `useEffect` + `gsap.to()` with `useGSAP` from `@gsap/react` for automatic cleanup on unmount (import `useGSAP` from `@/lib/gsapConfig` or `@gsap/react`)
  - **Pointer Events Fix**: Change `pointerEvents: 'none'` on secondContent container to `pointerEvents: 'auto'` when active — interactive children (links, buttons) must remain clickable
  - **Accessibility**: Add `role="button"`, `aria-label` prop, keyboard handler (`onKeyDown` for Enter/Space to toggle), and `aria-pressed` state matching FlipCard's current accessibility
  - **Reduced Motion**: Add `prefers-reduced-motion` JS check (use `window.matchMedia('(prefers-reduced-motion: reduce)')`) — when active, skip GSAP animation and instantly swap content
  - **Height Support**: Add a `height` prop (number | string) that sets explicit height instead of the aspectRatio paddingTop hack — this matches FlipCard's sizing model
  - **Default pixelColor**: Set default to `'var(--color-bg-primary)'` instead of `'currentColor'`
  - Add `'use client'` directive at top of file

  **Must NOT do**:
  - DO NOT install any new packages — GSAP and @gsap/react are already installed
  - DO NOT create a separate CSS file — all styling via Tailwind classes and inline styles
  - DO NOT change `@/lib/gsapConfig.ts`

  **Recommended Agent Profile**:
  > This task requires creating a new UI component with animation, theme integration, and SSR considerations.
  - **Category**: `visual-engineering`
    - Reason: Animation component with GSAP, theme styling, and visual output
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Needed for creating production-grade UI component matching existing design system
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed — no browser testing in this task (that's in QA)

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation task)
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Tasks 2, 3, 4
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL — Be Exhaustive):

  **Source to Adapt** (the original PixelTransition — copy and modify):
  - Full Tailwind+TypeScript source: https://raw.githubusercontent.com/DavidHDev/react-bits/main/src/ts-tailwind/Animations/PixelTransition/PixelTransition.tsx
  - This is the STARTING POINT. Copy this file, then apply all the modifications listed in "What to do" above.

  **Pattern References** (existing project code to follow):
  - `src/lib/gsapConfig.ts` — GSAP import pattern. Import `gsap` and `useGSAP` from here, NOT from `'gsap'` directly
  - `src/components/animations/ScrollReveal.tsx` — Example of GSAP usage with `useGSAP` hook, reduced motion check pattern, and `'use client'` directive
  - `src/components/ui/FlipCard.tsx` — The component being replaced. Study its accessibility attributes (`role`, `aria-pressed`, `aria-label`, `tabIndex`, `onKeyDown`) and sizing (`height` prop) to replicate in PixelTransition

  **Theme References** (CSS variables to use):
  - `--color-surface`: `#1e281e` — card backgrounds
  - `--color-border`: `rgba(240, 237, 232, 0.1)` — borders
  - `--color-text-primary`: `#f0ede8` — text
  - `--color-bg-primary`: `#141a14` — pixel dissolve color (user's choice)

  **WHY Each Reference Matters**:
  - `gsapConfig.ts`: Ensures GSAP plugins are registered once centrally, prevents duplicate registration warnings
  - `ScrollReveal.tsx`: Shows the exact pattern for `useGSAP` scope cleanup and reduced motion checking
  - `FlipCard.tsx`: The accessibility contract that must be preserved 1:1

  **Acceptance Criteria**:

  - [ ] File exists at `src/components/ui/PixelTransition.tsx`
  - [ ] `npx tsc --noEmit` exits 0 (no type errors)
  - [ ] No direct `import { gsap } from 'gsap'` — uses `@/lib/gsapConfig`
  - [ ] No top-level `window` access — SSR safe
  - [ ] Has `role="button"`, `aria-label`, `tabIndex`, `onKeyDown` for keyboard
  - [ ] Has `prefers-reduced-motion` check
  - [ ] Has `height` prop support
  - [ ] Default `pixelColor` is `'var(--color-bg-primary)'`

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Component compiles without errors
    Tool: Bash
    Preconditions: Task 1 file is saved
    Steps:
      1. Run `npx tsc --noEmit`
      2. Check exit code
    Expected Result: Exit code 0, no errors mentioning PixelTransition
    Failure Indicators: Any TypeScript error in PixelTransition.tsx
    Evidence: .sisyphus/evidence/task-1-tsc-check.txt

  Scenario: No direct GSAP import
    Tool: Bash (grep)
    Preconditions: File exists
    Steps:
      1. Run `grep -n "from 'gsap'" src/components/ui/PixelTransition.tsx`
      2. Run `grep -n "from \"gsap\"" src/components/ui/PixelTransition.tsx`
    Expected Result: Zero matches for both
    Failure Indicators: Any line importing from 'gsap' directly
    Evidence: .sisyphus/evidence/task-1-gsap-import-check.txt

  Scenario: SSR safety — no top-level window access
    Tool: Bash (grep)
    Preconditions: File exists
    Steps:
      1. Search for `window` usage outside of useEffect/useState/event handlers
      2. Verify `isTouchDevice` is inside useState+useEffect, not at module scope
    Expected Result: No bare `window` access at component body level
    Failure Indicators: `window.` appearing outside hooks/handlers
    Evidence: .sisyphus/evidence/task-1-ssr-safety.txt
  ```

  **Evidence to Capture:**
  - [ ] task-1-tsc-check.txt
  - [ ] task-1-gsap-import-check.txt
  - [ ] task-1-ssr-safety.txt

  **Commit**: YES
  - Message: `feat(ui): add PixelTransition component adapted from reactbits`
  - Files: `src/components/ui/PixelTransition.tsx`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 2. Migrate Timeline.tsx Course Cards

  **What to do**:
  - In `src/components/sections/Timeline.tsx`:
    - Replace `import { FlipCard, FlipFront, FlipBack } from '@/components/ui/FlipCard'` with `import PixelTransition from '@/components/ui/PixelTransition'`
    - In the `CourseCard` component, replace the `<FlipCard height={200}>` / `<FlipFront>` / `<FlipBack>` structure with `<PixelTransition>`
    - Move the FlipFront content (lines 39-66) into `firstContent` prop — wrap in a `<div>` with the chalk-card styling that FlipFront currently provides: `className="chalk-card h-full flex flex-col justify-between p-6"`
    - Move the FlipBack content (lines 69-72) into `secondContent` prop — wrap in a `<div>` with the FlipBack styling: `className="h-full flex flex-col p-6"` with `style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(94,206,195,0.4)' }}`
    - Set `height={200}` to match current card height
    - Set `pixelColor="var(--color-bg-primary)"` (dark background)
    - Remove the "click to flip" and "flip back" hint text — PixelTransition is discoverable via hover
    - Set `aria-label` to describe the card (e.g., `{course.code} - {course.name}`)

  **Must NOT do**:
  - DO NOT change the parent grid layout (`grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4`)
  - DO NOT change the ScrollReveal wrappers or staggerSelector
  - DO NOT change the data layer or flattenCourses function
  - DO NOT modify the section headers or SECTION_IDS

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Straightforward find-and-replace migration of existing content into new component API
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not needed — no new UI design, just re-wrapping existing content

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/ui/FlipCard.tsx:52-77` — FlipFront and FlipBack wrapper styling. The `chalk-card` class and FlipBack background/border must transfer to firstContent/secondContent wrappers
  - `src/components/sections/Timeline.tsx:35-76` — The current CourseCard component to be migrated. Lines 39-66 become firstContent, lines 69-72 become secondContent
  - `src/components/ui/PixelTransition.tsx` (created in Task 1) — The new component API: `firstContent`, `secondContent`, `height`, `pixelColor`, `aria-label`

  **WHY Each Reference Matters**:
  - `FlipCard.tsx`: Need the FlipFront/FlipBack wrapper classes to preserve visual styling
  - `Timeline.tsx`: The migration target — understand current structure to map into new API

  **Acceptance Criteria**:
  - [ ] `Timeline.tsx` imports `PixelTransition` (not FlipCard)
  - [ ] Zero references to FlipCard/FlipFront/FlipBack in Timeline.tsx
  - [ ] `npx tsc --noEmit` exits 0
  - [ ] Course cards render at 200px height

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Course cards render with pixel transition on /experience
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/experience
      2. Wait for page load
      3. Locate first `.course-card` element
      4. Verify the card contains course code text (e.g., a font-mono element)
      5. Hover over the card
      6. Wait 500ms for pixel animation
      7. Take screenshot
    Expected Result: Card shows pixel dissolve animation, secondContent reveals course description
    Failure Indicators: Card not rendering, no animation on hover, content missing
    Evidence: .sisyphus/evidence/task-2-course-card-hover.png

  Scenario: No FlipCard references remain in Timeline.tsx
    Tool: Bash (grep)
    Steps:
      1. Run `grep -n "FlipCard\|FlipFront\|FlipBack" src/components/sections/Timeline.tsx`
    Expected Result: Zero matches
    Failure Indicators: Any remaining FlipCard reference
    Evidence: .sisyphus/evidence/task-2-no-flipcard-refs.txt
  ```

  **Evidence to Capture:**
  - [ ] task-2-course-card-hover.png
  - [ ] task-2-no-flipcard-refs.txt

  **Commit**: NO (groups with Task 5)

---

- [ ] 3. Migrate ProjectGrid.tsx Tool Cards

  **What to do**:
  - In `src/components/sections/ProjectGrid.tsx`:
    - Replace `import { FlipCard, FlipFront, FlipBack } from '@/components/ui/FlipCard'` with `import PixelTransition from '@/components/ui/PixelTransition'`
    - In the tools section (lines 75-163), replace `<FlipCard height={260}>` / `<FlipFront>` / `<FlipBack>` with `<PixelTransition>`
    - Move FlipFront content (lines 85-111) into `firstContent` — wrap with chalk-card styling div
    - Move FlipBack content (lines 115-159) into `secondContent` — wrap with FlipBack styling div
    - **CRITICAL**: The back face contains clickable `<a>` links (GitHub repo, Live demo) with `onClick={(e) => e.stopPropagation()}`. These MUST remain functional. The PixelTransition from Task 1 should already fix pointerEvents, but verify links are not blocked
    - The `e.stopPropagation()` calls on links should be kept to prevent the PixelTransition toggle from firing when clicking links
    - Set `height={260}` to match current card height
    - Set `pixelColor="var(--color-bg-primary)"`
    - Set `aria-label` to project title

  **Must NOT do**:
  - DO NOT touch the Achievements & Initiatives section (lines 168+ — `<div id="section-achievements">`) — it uses chalk-card directly, NOT FlipCard
  - DO NOT change the parent grid layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`)
  - DO NOT change the featured card spanning logic (`md:col-span-2 lg:col-span-2`)
  - DO NOT modify getStatusLabel, getStatusClass, getTypeLabel helpers

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Direct migration with special attention to preserving clickable links
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 4)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:75-163` — The tools section with FlipCard usage. Lines 85-111 become firstContent, lines 115-159 become secondContent
  - `src/components/sections/ProjectGrid.tsx:123-158` — The action links section (GitHub + Live buttons) — these MUST remain clickable inside secondContent
  - `src/components/ui/FlipCard.tsx:52-77` — FlipFront/FlipBack wrapper styling to preserve
  - `src/components/ui/PixelTransition.tsx` (Task 1) — New component API

  **WHY Each Reference Matters**:
  - `ProjectGrid.tsx:123-158`: The critical path — links must remain interactive after migration
  - `FlipCard.tsx`: Styling contracts to preserve

  **Acceptance Criteria**:
  - [ ] `ProjectGrid.tsx` imports `PixelTransition` (not FlipCard)
  - [ ] Zero references to FlipCard/FlipFront/FlipBack in ProjectGrid.tsx
  - [ ] Achievements section (lines 168+) is UNCHANGED
  - [ ] `npx tsc --noEmit` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Project cards render with pixel transition and links work on /projects
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/projects
      2. Wait for page load
      3. Locate first `.flip-project-card` element in Tools section
      4. Hover over the card
      5. Wait 500ms for pixel animation
      6. Verify secondContent is visible (contains GitHub/Live links)
      7. Click the GitHub link `a[aria-label*="Source code"]`
      8. Verify link is clickable (no pointer-events blocking)
      9. Take screenshot
    Expected Result: Pixel dissolve reveals back content, links are clickable
    Failure Indicators: Links blocked by pointerEvents, animation not triggering
    Evidence: .sisyphus/evidence/task-3-project-card-links.png

  Scenario: Achievements section is untouched
    Tool: Bash (grep)
    Steps:
      1. Run `grep -n "section-achievements" src/components/sections/ProjectGrid.tsx`
      2. Verify the Achievements section still uses chalk-card (not PixelTransition)
    Expected Result: section-achievements div exists, uses chalk-card styling
    Failure Indicators: PixelTransition appearing in Achievements section
    Evidence: .sisyphus/evidence/task-3-achievements-untouched.txt
  ```

  **Evidence to Capture:**
  - [ ] task-3-project-card-links.png
  - [ ] task-3-achievements-untouched.txt

  **Commit**: NO (groups with Task 5)


- [ ] 4. Migrate CourseCatalog.tsx Cards

  **What to do**:
  - In `src/components/sections/CourseCatalog.tsx`:
    - Replace `import { FlipCard, FlipFront, FlipBack } from '@/components/ui/FlipCard'` with `import PixelTransition from '@/components/ui/PixelTransition'`
    - In the course grid (lines 193-249), replace `<FlipCard key={id} height={220}>` / `<FlipFront>` / `<FlipBack>` with `<PixelTransition>`
    - Move FlipFront content (lines 199-230) into `firstContent` — wrap with chalk-card styling div
    - Move FlipBack content (lines 233-246) into `secondContent` — wrap with FlipBack styling div
    - Keep the `key={id}` on the PixelTransition for React reconciliation during filtering
    - Set `height={220}` to match current card height
    - Set `pixelColor="var(--color-bg-primary)"`
    - Set `aria-label` to `{course.code} - {course.name}`
    - Remove "click to flip" / "flip back" hint text

  **Must NOT do**:
  - DO NOT change the parent grid layout (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4`)
  - DO NOT change the search input, filter buttons, or result count
  - DO NOT modify the data layer (`buildCourseCatalog`, `SUBJECT_LABELS`, etc.)
  - DO NOT change the empty state ("No courses match your search")

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Same migration pattern as Tasks 2 and 3
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3)
  - **Blocks**: Task 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/CourseCatalog.tsx:193-249` — The course grid with FlipCard usage. Lines 199-230 become firstContent, lines 233-246 become secondContent
  - `src/components/ui/FlipCard.tsx:52-77` — FlipFront/FlipBack wrapper styling to preserve
  - `src/components/ui/PixelTransition.tsx` (Task 1) — New component API

  **WHY Each Reference Matters**:
  - `CourseCatalog.tsx`: Largest consumer — 50+ cards. Filtering causes mount/unmount, making GSAP cleanup (from Task 1) critical here
  - `FlipCard.tsx`: Styling contracts to preserve

  **Acceptance Criteria**:
  - [ ] `CourseCatalog.tsx` imports `PixelTransition` (not FlipCard)
  - [ ] Zero references to FlipCard/FlipFront/FlipBack in CourseCatalog.tsx
  - [ ] `npx tsc --noEmit` exits 0
  - [ ] Search/filter functionality still works (no regressions from card change)

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Course catalog cards render with pixel transition on /courses
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/courses
      2. Wait for page load
      3. Verify course cards are rendering (check for grid with cards)
      4. Hover over first card
      5. Wait 500ms
      6. Verify secondContent appears (course description or "No additional description")
      7. Take screenshot
    Expected Result: Pixel dissolve reveals course description
    Failure Indicators: Cards not rendering, animation absent
    Evidence: .sisyphus/evidence/task-4-catalog-card-hover.png

  Scenario: Filtering still works after migration
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/courses
      2. Click the "Mathematics" subject filter button
      3. Wait for filtered results
      4. Verify result count changed (font-mono text shows filtered count)
      5. Verify remaining cards are all Mathematics subject
      6. Type "calc" in the search input
      7. Verify results filter further
      8. Take screenshot
    Expected Result: Filter and search work correctly, cards re-render without errors
    Failure Indicators: Console errors from GSAP cleanup, cards not updating
    Evidence: .sisyphus/evidence/task-4-catalog-filter.png
  ```

  **Evidence to Capture:**
  - [ ] task-4-catalog-card-hover.png
  - [ ] task-4-catalog-filter.png

  **Commit**: NO (groups with Task 5)

---

- [ ] 5. Delete FlipCard.tsx and Verify Clean Removal

  **What to do**:
  - Delete `src/components/ui/FlipCard.tsx`
  - Run `grep -r "FlipCard\|FlipFront\|FlipBack" src/` to verify zero remaining references
  - Run `npm run build` to verify the full production build succeeds (catches SSR issues, import errors, and any missed references)
  - Run `npx tsc --noEmit` for TypeScript verification

  **Must NOT do**:
  - DO NOT delete any other files
  - DO NOT modify any other files — all imports should already be updated by Tasks 2-4

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file deletion + verification commands
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (after all migrations)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 2, 3, 4

  **References**:
  - `src/components/ui/FlipCard.tsx` — The file to delete

  **Acceptance Criteria**:
  - [ ] `FlipCard.tsx` does not exist
  - [ ] `grep -r "FlipCard" src/` returns zero results
  - [ ] `grep -r "FlipFront" src/` returns zero results
  - [ ] `grep -r "FlipBack" src/` returns zero results
  - [ ] `npm run build` exits 0
  - [ ] `npx tsc --noEmit` exits 0

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: FlipCard completely removed from codebase
    Tool: Bash
    Steps:
      1. Run `test ! -f src/components/ui/FlipCard.tsx && echo DELETED || echo EXISTS`
      2. Run `grep -r "FlipCard" src/ | wc -l`
      3. Run `grep -r "FlipFront" src/ | wc -l`
      4. Run `grep -r "FlipBack" src/ | wc -l`
    Expected Result: File DELETED, all grep counts = 0
    Failure Indicators: File still exists or any grep count > 0
    Evidence: .sisyphus/evidence/task-5-clean-removal.txt

  Scenario: Full production build succeeds
    Tool: Bash
    Steps:
      1. Run `npm run build`
      2. Check exit code
    Expected Result: Exit code 0, build completes successfully
    Failure Indicators: Any import errors, SSR errors, or build failures
    Evidence: .sisyphus/evidence/task-5-build-success.txt
  ```

  **Evidence to Capture:**
  - [ ] task-5-clean-removal.txt
  - [ ] task-5-build-success.txt

  **Commit**: YES
  - Message: `refactor(cards): replace FlipCard with PixelTransition across all views`
  - Files: `src/components/sections/Timeline.tsx`, `src/components/sections/ProjectGrid.tsx`, `src/components/sections/CourseCatalog.tsx`, deleted `src/components/ui/FlipCard.tsx`
  - Pre-commit: `npm run build`

---
## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `npm run lint`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names. Verify GSAP imports use `@/lib/gsapConfig`, not `'gsap'` directly.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. For EVERY card location (Timeline /experience, ProjectGrid /projects, CourseCatalog /courses): verify pixel dissolve animates on hover, content reveals correctly, hover-off reverses, links are clickable on ProjectGrid back. Test keyboard (Tab + Enter). Test reduced motion (emulate in DevTools). Screenshot evidence.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Verify Achievements section untouched. Verify grid layouts unchanged. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **Task 1**: `feat(ui): add PixelTransition component adapted from reactbits` — `src/components/ui/PixelTransition.tsx`
- **Tasks 2-4 + 5**: `refactor(cards): replace FlipCard with PixelTransition across all views` — `Timeline.tsx`, `ProjectGrid.tsx`, `CourseCatalog.tsx`, deleted `FlipCard.tsx`

---

## Success Criteria

### Verification Commands
```bash
npm run build            # Expected: exits 0, no errors
npx tsc --noEmit         # Expected: exits 0, no type errors
grep -r "FlipCard" src/  # Expected: no results
grep -r "FlipFront" src/ # Expected: no results
grep -r "FlipBack" src/  # Expected: no results
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build succeeds
- [ ] All 3 card views use PixelTransition
- [ ] FlipCard.tsx deleted with zero remaining references
