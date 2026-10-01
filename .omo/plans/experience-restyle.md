# Experience Page Restyle — Match Projects Page Card Layout

## TL;DR

> **Quick Summary**: Restyle the Experience page to use the Projects page's chalk-card styling, single-column centered layout, PixelTransition flip cards, and sidebar TOC navigation. Group courses by institution ordered most current to least current, matching the CV's chronological structure.
> 
> **Deliverables**:
> - Rewritten `ExperienceView.tsx` with inline TOC + institution-grouped card layout
> - Rewritten `Timeline.tsx` replaced with new section renderer
> - Experience page visually matches Projects page card patterns
> 
> **Estimated Effort**: Short
> **Parallel Execution**: NO — sequential (2 dependent tasks + 1 verification)
> **Critical Path**: Task 1 (rewrite ExperienceView + Timeline) → Task 2 (build verification)

---

## Context

### Original Request
User wants the Experience page to match the Projects page's card styling, layout, and sidebar navigation. Courses should be ordered by year (most current to least current), matching the CV format.

### Interview Summary
**Key Discussions**:
- **Card granularity**: One card per course (not per institution). Flatten Institution → Position → Course.
- **Ordering**: Sections grouped by institution, ordered by `dateStart` descending (2023, 2022, 2018, 2017, 2016, 2015). NOT grouped by education level.
- **Section headers**: Institution name + date range (matching CV format, e.g., "Butte College" with "2023 - Present")
- **Card content**: Front shows course code + course name + "Current" badge only (institution info moved to section header). Back shows position title + full course description.
- **Flip cards**: Yes — PixelTransition flip cards on all course cards
- **Layout**: Single-column centered (`max-w-2xl mx-auto`) matching Projects page
- **Navigation**: ProjectTOC-style inline sidebar nav with institution names as labels
- **Card dimensions**: Match Projects tool cards — `height={260}`, `p-6` padding

**Research Findings**:
- `Timeline.tsx` is only imported by `ExperienceView.tsx` — safe to fully rewrite
- `YearNav.tsx` is shared with Education page — MUST NOT modify
- `chalk-card` CSS class already exists globally, used by ProjectGrid
- `PixelTransition` and `ScrollReveal` are already used on both pages
- `ProjectTOC` is inline in `ProjectGrid.tsx` (not shared) — clone pattern, don't extract

### Metis Review
**Identified Gaps** (addressed):
- **Section header format**: Resolved via CV — institution name + date range
- **Card content redundancy**: Institution info removed from cards, moved to section headers
- **YearNav.tsx shared**: Explicit guardrail — do not modify, just stop importing it
- **`instId()` dead code**: Not imported anywhere — will be removed with Timeline.tsx rewrite
- **Card height/padding**: Explicitly set to `height={260}` and `p-6` matching ProjectGrid
- **Dual enrollment date discrepancy**: PVHS dual enrollment (2024) sorts under PVHS section (2022) as it's a position within that institution
- **React key collision**: Use `institutionName + code + index` pattern (already exists)

---

## Work Objectives

### Core Objective
Restyle the Experience page to match the Projects page's visual design — chalk-card flip cards in a single centered column with sidebar TOC navigation, grouped by institution in reverse chronological order.

### Concrete Deliverables
- Rewritten `src/components/sections/ExperienceView.tsx` — new inline TOC + section renderer
- Deleted/replaced `src/components/sections/Timeline.tsx` content — no longer needed as separate component

### Definition of Done
- [ ] Experience page at `/experience` renders without console errors
- [ ] Cards use `chalk-card` styling with `PixelTransition` flip effect
- [ ] Single-column centered layout (`max-w-2xl mx-auto`)
- [ ] Sidebar TOC with institution labels, visible on `lg+` screens
- [ ] Courses grouped by institution, ordered most current first
- [ ] All 25 courses render (none lost)
- [ ] Education page at `/education` still works (YearNav untouched)
- [ ] `npm run build` succeeds with zero errors

### Must Have
- Chalk-card styling on all course cards matching ProjectGrid tool cards
- PixelTransition flip effect on every card (`height={260}`)
- Single-column layout: `max-w-2xl mx-auto` card column
- Inline sidebar TOC (clone ProjectTOC pattern) with IntersectionObserver
- Institution-based section headers with date range (CV format)
- "Current" badge on cards for current positions
- Course code + course name on card front
- Position title + description on card back
- ScrollReveal animations (existing patterns)
- All 25 courses present, zero data loss

### Must NOT Have (Guardrails)
- **DO NOT** modify `src/components/ui/YearNav.tsx` — Education page depends on it
- **DO NOT** modify `src/components/sections/ProjectGrid.tsx` — out of scope
- **DO NOT** modify `src/data/experience.ts` — presentation change only
- **DO NOT** extract a shared TOC component — inline it in ExperienceView
- **DO NOT** extract a shared IntersectionObserver hook — copy the pattern
- **DO NOT** add filtering, search, expand/collapse, or pagination features
- **DO NOT** add institution logos, icons, or visual elements not in current design
- **DO NOT** add action links (Code/Live buttons) to experience cards — these are for projects only
- **DO NOT** add level-based grouping (Post-Secondary/Secondary/Elementary) — flat by institution date

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Next.js build)
- **Automated tests**: None (visual restyle, no unit tests needed)
- **Framework**: N/A

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, interact, assert DOM, screenshot
- **Build**: Use Bash — `npm run build` exits 0

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Single task — core rewrite):
└── Task 1: Rewrite ExperienceView.tsx with new layout + inline TOC [visual-engineering]

Wave 2 (Verification — after Wave 1):
└── Task 2: Build verification + visual QA [quick]

Wave FINAL (After ALL tasks):
└── Task F1: Scope fidelity check [deep]
```

### Dependency Matrix

| Task | Blocked By | Blocks |
|------|-----------|--------|
| 1    | None      | 2, F1  |
| 2    | 1         | F1     |
| F1   | 1, 2      | None   |

### Agent Dispatch Summary

- **Wave 1**: 1 task — T1 → `visual-engineering`
- **Wave 2**: 1 task — T2 → `quick`
- **FINAL**: 1 task — F1 → `deep`

---

## TODOs

- [ ] 1. Rewrite ExperienceView.tsx — Card Layout, Inline TOC, Institution Sections

  **What to do**:
  1. **Rewrite `src/components/sections/ExperienceView.tsx`** as a single self-contained component that replaces both the current ExperienceView and Timeline:
     - **Inline an `ExperienceTOC` component** (clone the pattern from `ProjectGrid.tsx:9-77`). The TOC items should be the 6 institutions in order:
       - `Butte College` → id `section-butte-college`
       - `Pleasant Valley High School` → id `section-pleasant-valley`
       - `California State University, Chico` → id `section-csu-chico`
       - `Anderson Valley Jr./Sr. High School` → id `section-anderson-valley`
       - `San Leandro High School` → id `section-san-leandro`
       - `Clifford Elementary School` → id `section-clifford`
     - Use IntersectionObserver with `rootMargin: '-15% 0px -55% 0px'` (same as ProjectTOC)
     - TOC container: `fixed left-4 xl:left-8 top-1/2 -translate-y-1/2 z-30 hidden lg:block print:hidden`
     - TOC styling: surface background, border, accent dot + label when active (copy ProjectTOC exactly)

  2. **Page header** — match ProjectGrid header pattern:
     ```
     <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
       <ExperienceTOC />
       <ScrollReveal animation="slide-up">
         <div className="mb-16 text-center">
           <h1>Teaching Experience</h1>
           <p>A decade of mathematics and CS education across K-12 and university levels</p>
         </div>
       </ScrollReveal>
     ```

  3. **Institution sections** — sort `experiences` array by `parseInt(dateStart)` descending. For each institution:
     - Section `id` matching the TOC ids above
     - Section header: `<h2>` with institution name, styled like ProjectGrid section headers (`text-3xl font-bold mb-8 font-display border-b border-[var(--color-border)] pb-4 text-center`)
     - Below the h2, show location + date range in a subtitle line: `<p className="text-sm text-[var(--color-text-secondary)] text-center -mt-6 mb-8">{location} · {dateStart} – {dateEnd || 'Present'}</p>`

  4. **Course cards** — flatten each institution's positions → courses. For each course, render a `PixelTransition` card:
     - Container: `<div className="grid grid-cols-1 max-w-2xl mx-auto gap-6 w-full">`
     - Card class on wrapper: `class="experience-card"` (for ScrollReveal stagger selector)
     - `PixelTransition` with `height={260}` and `ariaLabel={\`${course.code} - ${course.name}\`}`
     - **firstContent** (front face):
       ```jsx
       <div className="chalk-card h-full flex flex-col justify-between p-6">
         <div>
           <div className="flex justify-between items-start mb-3">
             <div className="flex-1 min-w-0 pr-3">
               <h3 className="text-2xl font-bold font-display text-[var(--color-text-primary)] truncate">
                 {course.code}
               </h3>
               <p className="text-sm text-[var(--color-accent)] mt-1 font-medium">
                 {course.name}
               </p>
             </div>
             {course.isCurrent && (
               <span className="text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 status-active">
                 Current
               </span>
             )}
           </div>
         </div>
       </div>
       ```
     - **secondContent** (back face):
       ```jsx
       <div className="h-full flex flex-col p-6"
         style={{ background: 'var(--color-bg-secondary)', border: '1px solid rgba(240,192,96,0.4)' }}>
         <div className="flex flex-col h-full gap-3">
           <h3 className="text-base font-bold font-display text-[var(--color-text-primary)]">
             {course.code} — {course.name}
           </h3>
           <p className="text-xs font-semibold text-[var(--color-accent)] mb-1">
             {course.positionTitle}
           </p>
           <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1 overflow-y-auto pr-1">
             {course.description}
           </p>
         </div>
       </div>
       ```
     - Use `ScrollReveal animation="stagger" staggerSelector=".experience-card"` wrapping each section's card grid

  5. **Flatten logic** — reuse the existing `flattenCourses` logic from `Timeline.tsx`, but group by institution instead of level. Create a helper:
     ```ts
     type FlatCourse = {
       code: string; name: string; description: string;
       positionTitle: string; isCurrent: boolean;
     }
     ```
     For each institution (sorted), flatMap its positions → courses with the position title attached.

  6. **React keys** — use `{institutionName}-{course.code}-{idx}` to avoid collisions (e.g., "Math 18" appears at both Butte College and PVHS dual enrollment).

  7. **Remove YearNav import** — ExperienceView no longer imports from `YearNav`. Also remove the `Timeline` import. The component is now self-contained.

  8. **Clean up Timeline.tsx** — since only ExperienceView imported it, either delete the file or empty it. Prefer deletion since its exports (`SECTION_IDS`, `instId`, `Timeline`) are now unused.

  **Must NOT do**:
  - Do NOT modify `YearNav.tsx` — Education page depends on it
  - Do NOT modify `ProjectGrid.tsx` — out of scope
  - Do NOT modify `experience.ts` — presentation only
  - Do NOT extract shared TOC component — keep inline
  - Do NOT add features not described (filtering, search, links, logos)
  - Do NOT add action links (Code/Live buttons) — those are for projects only

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: This is a UI restyle task — card layout, styling, sidebar navigation. Directly in the visual-engineering wheelhouse.
  - **Skills**: [`frontend-design`]
    - `frontend-design`: Needed for crafting polished card UI with consistent styling across the Projects and Experience pages
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed for implementation — only for QA in Task 2

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Task 2, Task F1
  - **Blocked By**: None (can start immediately)

  **References** (CRITICAL):

  **Pattern References** (existing code to follow):
  - `src/components/sections/ProjectGrid.tsx:9-77` — ProjectTOC component pattern: IntersectionObserver setup, fixed sidebar positioning, active state styling, button click scroll behavior. **Clone this entire pattern** for ExperienceTOC.
  - `src/components/sections/ProjectGrid.tsx:116-232` — Section layout pattern: `py-20 px-4 md:px-8 max-w-7xl mx-auto` outer wrapper, `max-w-2xl mx-auto` card column, `chalk-card` card styling, `ScrollReveal` wrapping, `PixelTransition` with `height={260}` and `p-6` padding. **This is the exact layout to replicate.**
  - `src/components/sections/ProjectGrid.tsx:141-229` — PixelTransition tool card pattern: firstContent with `chalk-card h-full flex flex-col justify-between p-6`, secondContent with `bg-secondary` and accent border. **Match this structure for course cards.**
  - `src/components/sections/Timeline.tsx:18-33` — `flattenCourses()` function. **Reuse this flattening logic** but group by institution (sorted by dateStart desc) instead of by level.
  - `src/components/sections/Timeline.tsx:35-87` — Current `CourseCard` component. **Reference for what data fields exist** on flattened courses. The new card will be wider and use ProjectGrid styling instead.

  **API/Type References** (contracts to implement against):
  - `src/data/experience.ts:1-25` — `Institution`, `Position`, `Course` types and `TeachingLevel`, `PositionStatus` types. These are the data shapes you'll consume.
  - `src/data/experience.ts:27-285` — The `experiences` array. 6 institutions, 25 total courses. Sort this by `parseInt(dateStart)` descending.

  **External References**:
  - `PixelTransition` component at `src/components/ui/PixelTransition` — already imported in Timeline.tsx
  - `ScrollReveal` component at `src/components/animations/ScrollReveal` — already imported in Timeline.tsx

  **WHY Each Reference Matters**:
  - ProjectGrid.tsx lines 9-77: The TOC is the exact component to clone — same IntersectionObserver logic, same styling, same fixed positioning
  - ProjectGrid.tsx lines 116-232: This IS the target layout — copy the section structure, card column width, outer wrapper
  - Timeline.tsx flattenCourses: Don't reinvent — this already handles the Institution→Position→Course flattening correctly
  - experience.ts types: The executor needs to know `Institution.dateStart` is a string (e.g., "2023"), `dateEnd` is `string | null`, and `status` is `'current' | 'past'`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Happy path — page loads with all course cards in correct order
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/experience
      2. Wait for `h1` containing "Teaching Experience" to be visible
      3. Collect all `h2` section headings in DOM order
      4. Assert headings are: ["Butte College", "Pleasant Valley High School", "California State University, Chico", "Anderson Valley Jr./Sr. High School", "San Leandro High School", "Clifford Elementary School"]
      5. Count all elements with class `experience-card`
      6. Assert count === 25
    Expected Result: 6 section headings in correct chronological order, 25 course cards total
    Failure Indicators: Missing sections, wrong order, fewer than 25 cards
    Evidence: .sisyphus/evidence/task-1-page-loads-correctly.png

  Scenario: PixelTransition flip works on course card
    Tool: Playwright
    Preconditions: Page loaded at /experience
    Steps:
      1. Locate the first `.experience-card` element
      2. Click on it
      3. Wait 500ms for transition
      4. Assert that text "Adjunct" OR "position title text" is now visible within the card area (secondContent revealed)
    Expected Result: Card flips to show back content with position title and description
    Failure Indicators: Card does not flip, secondContent not visible after click
    Evidence: .sisyphus/evidence/task-1-flip-card.png

  Scenario: Sidebar TOC visible and functional on desktop
    Tool: Playwright
    Preconditions: Page loaded at /experience, viewport set to 1280x800
    Steps:
      1. Set viewport to { width: 1280, height: 800 }
      2. Assert that `nav` element with class containing `fixed` and `left-4` is visible
      3. Assert TOC contains 6 buttons (one per institution)
      4. Click the button labeled "California State University, Chico" (or containing that text)
      5. Wait 500ms
      6. Assert that `#section-csu-chico` element is near the top of the viewport (scrolled into view)
    Expected Result: TOC is visible, clicking an item scrolls to that institution's section
    Failure Indicators: TOC hidden, buttons don't scroll, wrong section scrolled to
    Evidence: .sisyphus/evidence/task-1-toc-navigation.png

  Scenario: TOC hidden on mobile
    Tool: Playwright
    Preconditions: Page loaded at /experience
    Steps:
      1. Set viewport to { width: 375, height: 812 } (iPhone size)
      2. Assert that the sidebar `nav` element is NOT visible (hidden via `hidden lg:block`)
    Expected Result: TOC is hidden on mobile viewports
    Failure Indicators: TOC visible on small screens, overlapping content
    Evidence: .sisyphus/evidence/task-1-mobile-no-toc.png

  Scenario: No level-based grouping remains
    Tool: Playwright
    Preconditions: Page loaded at /experience
    Steps:
      1. Get full page text content via `page.textContent('body')`
      2. Assert text does NOT contain "Post-Secondary" as a heading
      3. Assert text does NOT contain "Elementary" as a section heading (note: "Clifford Elementary School" is fine — it's an institution name, not a level label)
    Expected Result: No education-level section headings exist
    Failure Indicators: Level-based headings still present
    Evidence: .sisyphus/evidence/task-1-no-level-headings.png

  Scenario: Education page still works (YearNav not broken)
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. Run `curl -s -o /dev/null -w "%{http_code}" http://localhost:3000/education`
      2. Assert HTTP status is 200
    Expected Result: Education page returns 200
    Failure Indicators: 404, 500, or any non-200 status
    Evidence: .sisyphus/evidence/task-1-education-ok.txt

  Scenario: Card front shows course code and name only (no institution)
    Tool: Playwright
    Preconditions: Page loaded at /experience
    Steps:
      1. Locate the first `.experience-card` within `#section-butte-college`
      2. Get visible text content of the card front (the chalk-card face)
      3. Assert it contains "Math 11" (course code)
      4. Assert it contains "Liberal Arts Mathematics" (course name)
      5. Assert it does NOT contain "Butte College" (institution moved to section header)
      6. Assert it does NOT contain "Oroville" (location moved to section header)
    Expected Result: Card front shows only course code + name, no institution info
    Failure Indicators: Institution name or location visible on card front
    Evidence: .sisyphus/evidence/task-1-card-content.png
  ```

  **Evidence to Capture:**
  - [ ] task-1-page-loads-correctly.png — full page screenshot
  - [ ] task-1-flip-card.png — screenshot after clicking a card
  - [ ] task-1-toc-navigation.png — desktop view with TOC visible
  - [ ] task-1-mobile-no-toc.png — mobile view without TOC
  - [ ] task-1-no-level-headings.png — page without old level groupings
  - [ ] task-1-education-ok.txt — curl output for education page
  - [ ] task-1-card-content.png — close-up of card front content

  **Commit**: YES
  - Message: `style(experience): restyle experience page to match projects card layout`
  - Files: `src/components/sections/ExperienceView.tsx`, `src/components/sections/Timeline.tsx`
  - Pre-commit: `npm run build`

- [ ] 2. Build Verification

  **What to do**:
  1. Run `npm run build` and verify it exits with code 0
  2. Check for any TypeScript errors or warnings related to the changed files
  3. Verify no broken imports (Timeline exports are no longer referenced anywhere)

  **Must NOT do**:
  - Do NOT modify any files — this is a verification-only task
  - Do NOT fix issues by editing unrelated files

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple verification — run build command and check output
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `playwright`: Not needed — just running build command

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (after Task 1)
  - **Blocks**: Task F1
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `package.json` — check the `build` script for the exact build command

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Production build succeeds
    Tool: Bash
    Preconditions: Task 1 complete
    Steps:
      1. Run `npm run build`
      2. Assert exit code is 0
      3. Assert output does not contain "error" (case insensitive) in TypeScript compilation
    Expected Result: Build completes successfully with zero errors
    Failure Indicators: Non-zero exit code, TypeScript errors, missing module errors
    Evidence: .sisyphus/evidence/task-2-build-success.txt

  Scenario: No broken imports in codebase
    Tool: Bash
    Preconditions: Task 1 complete
    Steps:
      1. Run `grep -r "from.*Timeline" src/ --include="*.tsx" --include="*.ts"`
      2. Assert zero results (Timeline.tsx no longer imported anywhere)
      3. Run `grep -r "SECTION_IDS\|instId" src/ --include="*.tsx" --include="*.ts"`
      4. Assert zero results from external files (only internal to new ExperienceView if used)
    Expected Result: No orphaned imports referencing deleted Timeline exports
    Failure Indicators: Any file still importing from Timeline
    Evidence: .sisyphus/evidence/task-2-no-broken-imports.txt
  ```

  **Evidence to Capture:**
  - [ ] task-2-build-success.txt — build output log
  - [ ] task-2-no-broken-imports.txt — grep results

  **Commit**: NO (verification only, no file changes)

---

## Final Verification Wave

- [ ] F1. **Scope Fidelity Check** — `deep`
  Read the plan end-to-end. For each "Must Have": verify the implementation exists (read files, check selectors). For each "Must NOT Have": search codebase for forbidden changes — reject if found. Verify `YearNav.tsx` is unmodified (`git diff src/components/ui/YearNav.tsx` should be empty). Verify `ProjectGrid.tsx` is unmodified. Verify `experience.ts` is unmodified. Count total course cards rendered = 25. Verify Education page loads without error.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Course Count [25/25] | VERDICT: APPROVE/REJECT`

---

## Commit Strategy

- **After Task 1**: `style(experience): restyle experience page to match projects card layout` — ExperienceView.tsx, Timeline.tsx
- **Pre-commit**: `npm run build`

---

## Success Criteria

### Verification Commands
```bash
npm run build          # Expected: exits 0, no errors
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] Build passes
- [ ] All 25 courses render
- [ ] Education page unbroken
