# Add RotatingText Animation to Hero Section

## TL;DR

> **Quick Summary**: Replace the static role subtitle in the Hero section with ReactBits' RotatingText component, cycling through "Math Educator", "CS Teacher", "Curriculum Developer", and "Tool Builder" with a spring animation.
> 
> **Deliverables**:
> - New component file: `src/components/ui/RotatingText.tsx`
> - Updated Hero section: `src/components/sections/Hero.tsx`
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO — sequential (Task 2 depends on Task 1)
> **Critical Path**: Task 1 → Task 2

---

## Context

### Original Request
User wants to incorporate the RotatingText animation from https://reactbits.dev/text-animations/rotating-text on the home page Hero section.

### Interview Summary
**Key Discussions**:
- **Placement**: Replace the static subtitle `<p>` that reads "Math Educator · CS Teacher · Curriculum Developer · Tool Builder" (Hero.tsx lines 117-124) with RotatingText cycling through each role individually
- **Content**: Use the four existing roles — Math Educator, CS Teacher, Curriculum Developer, Tool Builder
- **Scope**: Just the component file + Hero integration, no automated tests

**Research Findings**:
- Full TypeScript + Tailwind source obtained from [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/TextAnimations/RotatingText/RotatingText.tsx)
- Component depends on `motion` package — but project has `framer-motion` v12.34.3 installed (functionally identical, different import path)
- The TS+Tailwind source from ReactBits does NOT include `'use client'` — must be added since component uses hooks
- Hero uses GSAP timeline for entrance animations; subtitle has its own `fromTo` animation via `subtitleRef`

### Metis Review
**Identified Gaps** (all addressed):
- **GSAP + framer-motion conflict**: Both animate `opacity` and `transform`. Resolved by keeping the `<p ref={subtitleRef}>` wrapper — GSAP fades the container in, RotatingText handles text cycling inside it.
- **Import path**: Source uses `motion/react`; must change to `framer-motion`. All needed exports (`motion`, `AnimatePresence`, `Transition`, `VariantLabels`, `Target`, `TargetAndTransition`) exist in framer-motion v12.
- **`'use client'` missing**: The TS+Tailwind source omits it. Must add since the component uses `useState`, `useEffect`, `useCallback`, `useImperativeHandle`.
- **LazyMotion vs full motion API**: Project uses lightweight `m` + `LazyMotion` in PageTransition. RotatingText uses full `motion.span`. These coexist safely — `motion` components auto-load features independently of `LazyMotion`. Minor bundle increase accepted.
- **Accessibility**: Static subtitle showed all 4 roles; RotatingText only exposes current role via `sr-only`. Add `aria-label` with all roles on the wrapper to preserve accessibility.

---

## Work Objectives

### Core Objective
Add an animated text rotation effect to the Hero subtitle that cycles through the four professional roles, replacing the static dot-separated list.

### Concrete Deliverables
- `src/components/ui/RotatingText.tsx` — Adapted from ReactBits, imports from `framer-motion`
- `src/components/sections/Hero.tsx` — Updated to use RotatingText in place of static subtitle

### Definition of Done
- [ ] `npm run build` completes with zero errors (exit code 0)
- [ ] `npm run lint` passes with zero new warnings/errors
- [ ] Hero section renders at `localhost:3000` with text cycling through 4 roles
- [ ] GSAP entrance animation still works (subtitle container fades in on page load)
- [ ] No console warnings about GSAP targets or framer-motion conflicts

### Must Have
- RotatingText cycles through exactly: "Math Educator", "CS Teacher", "Curriculum Developer", "Tool Builder"
- Text color matches `var(--color-accent)` (teal/cyan accent)
- The GSAP entrance animation on the subtitle container continues to work
- `'use client'` directive on the new component file
- Imports from `framer-motion`, NOT `motion/react`

### Must NOT Have (Guardrails)
- Must NOT install any new npm packages — use existing `framer-motion`
- Must NOT modify any GSAP animations other than the subtitle entry (lines 46-52 of Hero.tsx)
- Must NOT change `PageTransition.tsx` or its `LazyMotion` setup
- Must NOT modify `globals.css` or any stylesheets
- Must NOT change visual appearance of other Hero elements (heading, watermark, tagline, stats, CTA)
- Must NOT add `clsx`, `tailwind-merge`, or other utility libraries — component has its own inline `cn` function
- Must NOT touch any files beyond `RotatingText.tsx` (new) and `Hero.tsx` (edit)

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Next.js build + ESLint)
- **Automated tests**: None (user's choice)
- **Framework**: N/A

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Build verification**: Use Bash — `npm run build`, `npm run lint`
- **TypeScript check**: Use `lsp_diagnostics` on both files
- **Visual verification**: Use Playwright — navigate to localhost:3000, verify text cycling

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Sequential — Task 2 depends on Task 1):
├── Task 1: Create RotatingText component [quick]
└── Task 2: Integrate RotatingText in Hero + verify build [quick]

Wave FINAL (After Task 2):
└── Task F1: Visual QA via dev server [quick]

Critical Path: Task 1 → Task 2 → F1
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1    | —         | 2      |
| 2    | 1         | F1     |
| F1   | 2         | —      |

### Agent Dispatch Summary

- **Wave 1**: 2 tasks — T1 → `quick`, T2 → `quick`
- **FINAL**: 1 task — F1 → `quick` (+ `playwright` skill)

---

## TODOs

- [ ] 1. Create RotatingText Component

  **What to do**:
  - Create `src/components/ui/RotatingText.tsx`
  - Copy the full TypeScript + Tailwind source from ReactBits: https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/TextAnimations/RotatingText/RotatingText.tsx
  - Add `'use client'` as the first line
  - Change the import from `'motion/react'` to `'framer-motion'`:
    ```ts
    import {
      motion,
      AnimatePresence,
      Transition,
      type VariantLabels,
      type Target,
      type TargetAndTransition
    } from 'framer-motion';
    ```
  - Remove the `import './RotatingText.css';` line — not needed, the Tailwind version uses utility classes
  - Keep everything else as-is (the inline `cn` function, the full component, the `RotatingText.displayName`)

  **Must NOT do**:
  - Do NOT install the `motion` npm package
  - Do NOT modify the component logic or props interface
  - Do NOT add a CSS file
  - Do NOT add `clsx` or `tailwind-merge`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file creation, straightforward copy-adapt-paste
  - **Skills**: []
    - No special skills needed — file creation only
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not designing, just adapting existing component
    - `playwright`: No browser work in this task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (sequential, first)
  - **Blocks**: Task 2
  - **Blocked By**: None

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/ui/PageTransition.tsx:1` — Shows `'use client'` directive placement pattern
  - `src/components/ui/PageTransition.tsx:2` — Shows how the project imports from `framer-motion` (uses `LazyMotion, domAnimation, m, AnimatePresence`)

  **Source Reference** (the component to copy and adapt):
  - https://github.com/DavidHDev/react-bits/blob/main/src/ts-tailwind/TextAnimations/RotatingText/RotatingText.tsx — FULL source to copy. Change imports only. Add 'use client'. Remove CSS import.

  **WHY Each Reference Matters**:
  - `PageTransition.tsx` — Shows the project's established `'use client'` + framer-motion import pattern. The new file should follow the same directive style.
  - ReactBits source — This IS the component. Copy it verbatim except for the three changes noted above.

  **Acceptance Criteria**:

  - [ ] File exists: `src/components/ui/RotatingText.tsx`
  - [ ] First line is `'use client'`
  - [ ] Contains `from 'framer-motion'` (NOT `from 'motion/react'`)
  - [ ] Does NOT contain `import './RotatingText.css'`
  - [ ] `lsp_diagnostics` on `src/components/ui/RotatingText.tsx` shows zero errors

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: File structure and imports are correct
    Tool: Bash (grep)
    Preconditions: File created at src/components/ui/RotatingText.tsx
    Steps:
      1. Run: head -1 src/components/ui/RotatingText.tsx → expect "'use client'"
      2. Run: grep "from 'motion/react'" src/components/ui/RotatingText.tsx → expect exit code 1 (no matches)
      3. Run: grep "from 'framer-motion'" src/components/ui/RotatingText.tsx → expect exit code 0 (match found)
      4. Run: grep "import.*RotatingText.css" src/components/ui/RotatingText.tsx → expect exit code 1 (no matches)
    Expected Result: All four checks pass
    Failure Indicators: Any grep returns unexpected exit code
    Evidence: .sisyphus/evidence/task-1-imports-check.txt

  Scenario: TypeScript compilation succeeds
    Tool: lsp_diagnostics
    Preconditions: File created
    Steps:
      1. Run lsp_diagnostics on src/components/ui/RotatingText.tsx with severity "error"
    Expected Result: Zero TypeScript errors
    Failure Indicators: Any diagnostic with severity "error"
    Evidence: .sisyphus/evidence/task-1-ts-diagnostics.txt
  ```

  **Commit**: YES
  - Message: `feat(ui): add RotatingText component from ReactBits`
  - Files: `src/components/ui/RotatingText.tsx`

---

- [ ] 2. Integrate RotatingText in Hero Section

  **What to do**:
  - Edit `src/components/sections/Hero.tsx`
  - Add import at top: `import RotatingText from '@/components/ui/RotatingText'`
  - Replace the static subtitle `<p>` content (lines 117-124) while keeping the `<p>` wrapper:
    - Keep: `<p ref={subtitleRef} ...>` with its existing className and style (these control the GSAP entrance animation)
    - Remove: The static text content (`Math Educator&nbsp;&middot;&nbsp;CS Teacher...`)
    - Add inside the `<p>`: `<RotatingText>` with these props:
      ```tsx
      <RotatingText
        texts={['Math Educator', 'CS Teacher', 'Curriculum Developer', 'Tool Builder']}
        mainClassName="px-2 sm:px-2 md:px-3 overflow-hidden py-0.5 sm:py-1 md:py-2 justify-center rounded-lg"
        staggerFrom="last"
        initial={{ y: "100%" }}
        animate={{ y: 0 }}
        exit={{ y: "-120%" }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        rotationInterval={3000}
      />
      ```
  - Add `aria-label="Roles: Math Educator, CS Teacher, Curriculum Developer, Tool Builder"` to the `<p>` wrapper for accessibility
  - Keep the GSAP `fromTo` animation on `subtitleRef` exactly as-is (lines 47-52) — it fades the container in, RotatingText handles cycling inside

  **Must NOT do**:
  - Do NOT remove `subtitleRef` or its GSAP `fromTo` animation
  - Do NOT change any other GSAP timeline entries (heading, watermark, tagline, stats, CTA)
  - Do NOT modify the stats array, CTA links, or any other Hero content
  - Do NOT change the `<p>` wrapper's className or style — only change its children and add aria-label

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit, clear before/after, no design decisions
  - **Skills**: []
    - No special skills needed
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not doing visual verification in this task
    - `frontend-design`: Not designing, integrating known component

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (sequential, second)
  - **Blocks**: F1
  - **Blocked By**: Task 1

  **References** (CRITICAL):

  **Pattern References**:
  - `src/components/sections/Hero.tsx:117-124` — The current static subtitle `<p>` to replace content of. Keep the `<p>` tag, ref, className, and style. Only replace its children.
  - `src/components/sections/Hero.tsx:47-52` — The GSAP `fromTo` animation on `subtitleRef`. DO NOT MODIFY THIS. It animates the `<p>` container. RotatingText animates inside it.
  - `src/components/sections/Hero.tsx:1-5` — Existing imports. Add the RotatingText import here.

  **API References**:
  - `src/components/ui/RotatingText.tsx` (Task 1 output) — The component just created. Default export. Key props: `texts`, `mainClassName`, `staggerFrom`, `initial`, `animate`, `exit`, `transition`, `rotationInterval`

  **WHY Each Reference Matters**:
  - Lines 117-124 — This is the exact target. The `<p>` wrapper must survive for GSAP. Only the inner text content gets swapped.
  - Lines 47-52 — This GSAP animation must NOT be touched. It provides the entrance fade-in for the subtitle container.
  - Lines 1-5 — Import placement follows existing convention (component imports after library imports).

  **Acceptance Criteria**:

  - [ ] `npm run build` exits with code 0
  - [ ] `npm run lint` exits with code 0
  - [ ] `lsp_diagnostics` on `src/components/sections/Hero.tsx` shows zero errors
  - [ ] Hero.tsx contains `import RotatingText from '@/components/ui/RotatingText'`
  - [ ] The `<p ref={subtitleRef}>` wrapper element is preserved (not removed)
  - [ ] GSAP `fromTo` on `subtitleRef` is unchanged
  - [ ] RotatingText receives exactly 4 texts: Math Educator, CS Teacher, Curriculum Developer, Tool Builder

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Build and lint pass after integration
    Tool: Bash
    Preconditions: Both files saved (RotatingText.tsx created, Hero.tsx edited)
    Steps:
      1. Run: npm run build
      2. Assert: exit code 0, no errors in output
      3. Run: npm run lint
      4. Assert: exit code 0
    Expected Result: Clean build and lint
    Failure Indicators: Non-zero exit code, TypeScript errors, ESLint errors
    Evidence: .sisyphus/evidence/task-2-build-lint.txt

  Scenario: Hero.tsx structure is correct
    Tool: Bash (grep)
    Preconditions: Hero.tsx edited
    Steps:
      1. Run: grep "import RotatingText" src/components/sections/Hero.tsx → expect match
      2. Run: grep "subtitleRef" src/components/sections/Hero.tsx → expect multiple matches (ref declaration + usage + GSAP)
      3. Run: grep "Math Educator" src/components/sections/Hero.tsx → expect match (in texts array)
    Expected Result: Import present, subtitleRef preserved, texts array present
    Failure Indicators: Missing import, subtitleRef removed, or texts missing
    Evidence: .sisyphus/evidence/task-2-structure-check.txt

  Scenario: TypeScript compilation succeeds
    Tool: lsp_diagnostics
    Preconditions: Hero.tsx edited
    Steps:
      1. Run lsp_diagnostics on src/components/sections/Hero.tsx with severity "error"
    Expected Result: Zero TypeScript errors
    Failure Indicators: Any diagnostic with severity "error"
    Evidence: .sisyphus/evidence/task-2-ts-diagnostics.txt
  ```

  **Commit**: YES
  - Message: `feat(hero): replace static subtitle with RotatingText animation`
  - Files: `src/components/sections/Hero.tsx`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

- [ ] F1. **Visual QA — Dev Server Check** — `quick` (+ `playwright` skill)
  Start dev server (`npm run dev`). Use Playwright to navigate to http://localhost:3000. Take a screenshot of the Hero section. Verify:
  1. The hero heading "Steven Huff" is visible
  2. A rotating text element is present in the subtitle area
  3. Wait 4 seconds, take a second screenshot — confirm the displayed role text has changed (text is cycling)
  4. The tagline paragraph below is still visible and unchanged
  5. No console errors in the browser
  6. The GSAP entrance animation completes (elements are visible, not stuck at opacity 0)
  Save screenshots as evidence.
  Output: `Visual [PASS/FAIL] | Animation cycling [YES/NO] | Console errors [CLEAN/N issues] | VERDICT: APPROVE/REJECT`

---

## Commit Strategy

| Task | Message | Files |
|------|---------|-------|
| 1 | `feat(ui): add RotatingText component from ReactBits` | `src/components/ui/RotatingText.tsx` |
| 2 | `feat(hero): replace static subtitle with RotatingText animation` | `src/components/sections/Hero.tsx` |

---

## Success Criteria

### Verification Commands
```bash
npm run build   # Expected: exit code 0, zero errors
npm run lint     # Expected: exit code 0
```

### Final Checklist
- [ ] RotatingText.tsx exists with 'use client' and framer-motion imports
- [ ] Hero subtitle cycles through 4 roles with spring animation
- [ ] GSAP entrance animation still works (subtitle container fades in)
- [ ] No new npm packages installed
- [ ] Build and lint pass cleanly
- [ ] No other files modified
