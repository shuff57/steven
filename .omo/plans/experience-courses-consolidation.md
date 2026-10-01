# Experience & Courses Page Consolidation

## TL;DR

> **Quick Summary**: Consolidate the Courses page search/filter feature into the Experience page with a tab bar toggle ("By Institution" | "Course Catalog"), then rename the Courses page to "Professional Development" for conferences/workshops content.
> 
> **Deliverables**:
> - Experience page with tab bar: institution-grouped view + searchable flat course catalog
> - Professional Development page at `/professional-development` with all conference/workshop content
> - Redirect from `/courses` → `/professional-development`
> - Updated navigation, Hero links, and metadata across the site
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 4 waves
> **Critical Path**: Task 1 (extract shared components) → Task 4 (refactor ExperienceView) → Task 7 (delete old files) → Final Verification

---

## Context

### Original Request
User wants to consolidate Experience and Courses pages — move the search feature from Courses to Experience, then rename the Courses page to "Professional Development" for conference/workshop content.

### Interview Summary
**Key Discussions**:
- **Toggle style**: Tab bar below page header ("By Institution" | "Course Catalog")
- **Card style**: Simple hover-expand cards in BOTH views for consistency (not PixelTransition flip cards)
- **TOC behavior**: Hide left-side TOC sidebar in "Course Catalog" mode, show in "By Institution" mode
- **Filter pills**: Subject + level filter pills appear in "Course Catalog" tab ONLY
- **URL**: Courses page moves from `/courses` to `/professional-development`
- **Conference migration**: Conferences section moves out of Experience into the new Prof. Development page

**Research Findings**:
- ExperienceView.tsx (287 lines): CourseCard, ConferenceCard, AnimatedItem, ExperienceTOC, and flattenCourses() are ALL **inline functions** — not separate importable components
- CourseCatalog.tsx (265 lines): Search input, subject/level filter pills, useMemo filtering, PixelTransition cards, SUBJECT_COLORS/SUBJECT_TEXT color maps
- courseCatalog.ts: `buildCourseCatalog()` flattens experience.ts data into `CatalogCourse[]` with inferred subject/level
- conferences.ts: **18 conference items** (not 16 as initially counted)
- Two incompatible data shapes: `FlatCourse` (institution view) vs `CatalogCourse` (catalog view) — both must coexist
- PixelTransition.tsx is still used by Hero.tsx — do NOT delete
- Experience page has NO metadata export; Courses page DOES

### Metis Review
**Identified Gaps** (addressed):
- ConferenceCard + AnimatedItem are inline — must be extracted to shared files BEFORE ProfDev page can use them (→ Task 1 dependency)
- TOC cleanup requires 4 coordinated removals when conferences move out (→ Task 4 guardrails)
- Tab URL behavior: Hero stat card "Browse Catalog" → `/experience` would land on institution view, not catalog. Resolved: use `?view=catalog` query param (→ Task 4, Task 6)
- Conference count is 18, not 16 (→ corrected in acceptance criteria)
- Two data shapes must coexist, not be unified (→ guardrail)
- Grid layout for catalog tab not specified — defaulted to responsive multi-column (→ Task 4)

---

## Work Objectives

### Core Objective
Consolidate course search/filtering into the Experience page via a tab bar toggle, then repurpose the Courses route as a dedicated Professional Development page for conferences and workshops.

### Concrete Deliverables
- Refactored `ExperienceView.tsx` with tab bar, search/filter (catalog tab only), conditional TOC
- New `ProfessionalDevelopment.tsx` component at `/professional-development`
- Extracted `ConferenceCard.tsx` and `AnimatedItem.tsx` shared components
- Updated Navigation.tsx, Hero.tsx with new links and labels
- Redirect from `/courses` → `/professional-development` in next.config
- Metadata on both Experience and ProfDev pages
- Deleted `CourseCatalog.tsx` and `src/app/courses/` directory

### Definition of Done
- [ ] `npx next build` exits with code 0
- [ ] `/experience` loads with tab bar, both views functional
- [ ] `/professional-development` loads with all 18 conference items
- [ ] `/courses` redirects to `/professional-development`
- [ ] Navigation shows "Prof. Development" label
- [ ] Zero references to old `/courses` path remain in source

### Must Have
- Tab bar toggle: "By Institution" | "Course Catalog"
- Search input + subject pills + level pills in catalog tab ONLY
- TOC visible in institution view, hidden in catalog view
- Simple hover-expand cards in both views
- All 18 conferences on Prof. Development page
- Redirect from `/courses` → `/professional-development`
- `?view=catalog` query param support (so Hero link can deep-link to catalog tab)
- `npx next build` passes with zero errors

### Must NOT Have (Guardrails)
- NO animation on tab switching — conditional render only
- NO modifications to `PixelTransition.tsx` (Hero.tsx depends on it)
- NO modifications to `experience.ts` or `conferences.ts` data files
- NO new filter categories beyond existing `SUBJECT_FILTERS` + `LEVEL_FILTERS`
- NO visual redesign of existing CourseCard or ConferenceCard styles
- NO middleware.ts for the redirect — use `next.config.ts` `redirects()`
- NO unification of `FlatCourse` and `CatalogCourse` types — both coexist
- NO creating a generic "ExpandableCard" abstraction — extract only what's needed
- NO `as any` or `@ts-ignore` type workarounds
- NO commented-out code left behind

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: NO
- **Framework**: None
- **Agent-Executed QA**: YES — Playwright for visual/interaction verification, curl for basic checks

### QA Policy
Every task includes agent-executed QA scenarios. Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — navigate, interact, assert DOM, screenshot
- **Build/Static**: Use Bash — `npx next build`, curl responses

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — extract + scaffold):
├── Task 1: Extract shared components (ConferenceCard, AnimatedItem) [quick]
├── Task 2: Create Professional Development page + route [quick]
├── Task 3: Add /courses → /professional-development redirect [quick]

Wave 2 (After Wave 1 — core refactor, 2 parallel tracks):
├── Task 4: Refactor ExperienceView with tab bar + search/filter [deep]
├── Task 5: Build ProfessionalDevelopment component (depends: Task 1) [unspecified-high]

Wave 3 (After Wave 2 — references + cleanup):
├── Task 6: Update Navigation + Hero cross-references [quick]
├── Task 7: Delete old CourseCatalog.tsx + /courses directory [quick]
├── Task 8: Add metadata to Experience page [quick]

Wave FINAL (After ALL — verification):
├── Task F1: Plan compliance audit [oracle]
├── Task F2: Code quality review [unspecified-high]
├── Task F3: Real manual QA [unspecified-high]
├── Task F4: Scope fidelity check [deep]

Critical Path: Task 1 → Task 4 → Task 7 → F1-F4
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 3 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 4, 5 | 1 |
| 2 | — | 5 | 1 |
| 3 | — | 7 | 1 |
| 4 | 1 | 6, 7 | 2 |
| 5 | 1, 2 | 7 | 2 |
| 6 | 4 | F1-F4 | 3 |
| 7 | 3, 4, 5 | F1-F4 | 3 |
| 8 | 4 | F1-F4 | 3 |
| F1-F4 | 6, 7, 8 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: 3 tasks — T1 → `quick`, T2 → `quick`, T3 → `quick`
- **Wave 2**: 2 tasks — T4 → `deep`, T5 → `unspecified-high`
- **Wave 3**: 3 tasks — T6 → `quick`, T7 → `quick`, T8 → `quick`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

JY|- [x] 1. Extract Shared Components (ConferenceCard + AnimatedItem)

  **What to do**:
  - Create `src/components/ui/AnimatedItem.tsx` — extract the `AnimatedItem` function from ExperienceView.tsx (lines 46-59). It's a generic framer-motion scroll-reveal wrapper using `useInView`. Export as named export.
  - Create `src/components/cards/ConferenceCard.tsx` — extract the `ConferenceCard` function from ExperienceView.tsx (lines 108-149). It uses `useState` + `useRef` for hover-expand behavior. Import `ConferenceItem` type from `@/data/conferences`. Export as named export.
  - Update `ExperienceView.tsx` — replace inline definitions with imports from the new files. Verify the component renders identically.
  - The `CourseCard` component (lines 61-104) stays INLINE in ExperienceView.tsx — it's only used there and will also be used in the catalog tab.

  **Must NOT do**:
  - Do NOT create a generic "ExpandableCard" abstraction — extract exactly what exists
  - Do NOT modify the visual style, props, or behavior of either component
  - Do NOT extract `CourseCard` — it stays inline in ExperienceView
  - Do NOT modify `ExperienceTOC` or `flattenCourses` — those stay inline too

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file extraction, no logic changes. Copy-paste + import rewiring.
  - **Skills**: []
    - No special skills needed for straightforward extraction.

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Tasks 4, 5
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/sections/ExperienceView.tsx:46-59` — AnimatedItem source code to extract (uses `useRef`, `useInView` from framer-motion, `motion.div`)
  - `src/components/sections/ExperienceView.tsx:108-149` — ConferenceCard source code to extract (uses `useState`, `useRef` for hover-expand pattern)
  - `src/components/ui/PixelTransition.tsx` — example of a standalone UI component in the same directory. Follow same file structure pattern.

  **API/Type References**:
  - `src/data/conferences.ts:1-6` — `ConferenceItem` type that ConferenceCard needs to import

  **WHY Each Reference Matters**:
  - ExperienceView lines 46-59: This is the EXACT code to extract for AnimatedItem — copy it, add proper imports
  - ExperienceView lines 108-149: This is the EXACT code to extract for ConferenceCard — copy it, add `ConferenceItem` import from data file
  - PixelTransition.tsx: Shows the naming convention, export pattern, and file organization for UI components in this project

  **Acceptance Criteria**:
  - [ ] `src/components/ui/AnimatedItem.tsx` exists with named export `AnimatedItem`
  - [ ] `src/components/cards/ConferenceCard.tsx` exists with named export `ConferenceCard`
  - [ ] `ExperienceView.tsx` imports from both new files instead of defining inline
  - [ ] `npx next build` exits with code 0

  **QA Scenarios:**
  ```
  Scenario: Experience page renders identically after extraction
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/experience
      2. Wait for page load (selector: h1 with text "Teaching Experience")
      3. Scroll to bottom of page — verify conference section exists
      4. Hover over first conference card — verify it expands showing description
      5. Scroll to first institution — verify course cards have scroll-reveal animation
      6. Screenshot full page at 1440px viewport
    Expected Result: Page renders with all institutions, course cards, and conference section. Hover-expand works on conference cards. Scroll animation works on course cards.
    Failure Indicators: Missing conference section, broken hover-expand, console errors
    Evidence: .sisyphus/evidence/task-1-extraction-renders.png

  Scenario: Build succeeds with extracted components
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `npx next build`
    Expected Result: Build exits with code 0, zero errors
    Failure Indicators: TypeScript errors, missing imports, undefined components
    Evidence: .sisyphus/evidence/task-1-build-success.txt
  ```

  **Commit**: YES
  - Message: `refactor(components): extract ConferenceCard and AnimatedItem to shared files`
  - Files: `src/components/ui/AnimatedItem.tsx`, `src/components/cards/ConferenceCard.tsx`, `src/components/sections/ExperienceView.tsx`
  - Pre-commit: `npx next build`

HB|- [x] 2. Create Professional Development Page Route

  **What to do**:
  - Create directory `src/app/professional-development/`
  - Create `src/app/professional-development/page.tsx` with:
    - `export const metadata` with title "Professional Development | Steven Huff" and appropriate description
    - A simple page component that renders a placeholder `<main>` with heading "Professional Development" and subtitle "Conferences, workshops, and technical trainings"
    - This is a scaffold — the real component (Task 5) will replace the placeholder

  **Must NOT do**:
  - Do NOT build the full ProfessionalDevelopment component yet (Task 5)
  - Do NOT import from conferences.ts yet

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple file creation with metadata. 1 small file.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 5
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/app/courses/page.tsx:1-14` — Example page with metadata export. Follow this exact pattern for metadata + component structure.
  - `src/app/experience/page.tsx:1-5` — Simpler page example. Shows how pages just import and render a section component.

  **WHY Each Reference Matters**:
  - courses/page.tsx: Copy the metadata export pattern (title, description) and adapt for Professional Development
  - experience/page.tsx: Shows the minimal page structure this project uses

  **Acceptance Criteria**:
  - [ ] `src/app/professional-development/page.tsx` exists
  - [ ] Contains `export const metadata` with title and description
  - [ ] `curl -s -o /dev/null -w "%{http_code}" localhost:3000/professional-development` returns `200`

  **QA Scenarios:**
  ```
  Scenario: Professional Development page loads
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -s -o /dev/null -w "%{http_code}" localhost:3000/professional-development
      2. curl -s localhost:3000/professional-development | grep "Professional Development"
    Expected Result: Status 200, page contains "Professional Development" heading
    Failure Indicators: 404, missing heading text
    Evidence: .sisyphus/evidence/task-2-profdev-route.txt
  ```

  **Commit**: YES (groups with Task 3)
  - Message: `feat(professional-development): scaffold page route and redirect`
  - Files: `src/app/professional-development/page.tsx`, `next.config.ts`
  - Pre-commit: `npx next build`

HH|- [x] 3. Add /courses → /professional-development Redirect

  **What to do**:
  - Edit `next.config.ts` (or `next.config.js`/`next.config.mjs` — check which exists) to add an `async redirects()` function
  - Add a permanent redirect: `{ source: '/courses', destination: '/professional-development', permanent: true }`
  - If a `redirects()` function already exists, append to the existing array

  **Must NOT do**:
  - Do NOT create `middleware.ts` for this — use next.config redirects only
  - Do NOT delete the `/courses` directory yet (Task 7)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single config file edit. 3-4 lines of code.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task 7 (must verify redirect works before deleting old route)
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - Check for existing `next.config.ts` or `next.config.mjs` in project root — read it to understand current config structure before modifying

  **External References**:
  - Next.js redirects docs: `https://nextjs.org/docs/app/api-reference/next-config-js/redirects` — syntax for permanent redirects

  **WHY Each Reference Matters**:
  - Need to know the current config format (TS vs MJS, existing exports) to add redirects without breaking anything

  **Acceptance Criteria**:
  - [ ] `next.config` file contains redirect from `/courses` to `/professional-development`
  - [ ] `curl -sI localhost:3000/courses` returns 308 status with `Location` header containing `/professional-development`

  **QA Scenarios:**
  ```
  Scenario: /courses redirects to /professional-development
    Tool: Bash (curl)
    Preconditions: Dev server running
    Steps:
      1. curl -sI localhost:3000/courses
      2. Verify response contains HTTP 308 (or 307 in dev mode)
      3. Verify Location header contains /professional-development
    Expected Result: Redirect response with correct destination
    Failure Indicators: 200 (old page still served), 404, wrong destination
    Evidence: .sisyphus/evidence/task-3-redirect.txt

  Scenario: Build succeeds with redirect config
    Tool: Bash
    Steps:
      1. Run `npx next build`
    Expected Result: Build exits 0
    Evidence: .sisyphus/evidence/task-3-build.txt
  ```

  **Commit**: YES (groups with Task 2)
  - Message: `feat(professional-development): scaffold page route and redirect`
  - Files: `next.config.ts` (or .mjs)
  - Pre-commit: `npx next build`

PP|- [x] 4. Refactor ExperienceView: Tab Bar + Course Catalog Search/Filter

  **What to do**:
  This is the core task. Refactor `ExperienceView.tsx` to support two views via a tab bar:

  **A. Add tab state + query param support:**
  - Add `useSearchParams()` from `next/navigation` to read `?view=catalog` on mount
  - Add `useState<'institution' | 'catalog'>` initialized from search param (default: `'institution'`)
  - Tab bar renders below the page header (h1 + subtitle), above content

  **B. Build the tab bar UI:**
  - Two tabs: "By Institution" | "Course Catalog"
  - Style as a horizontal bar with two buttons. Active tab gets accent color background + bold text. Inactive gets transparent bg + muted text.
  - Use inline styles matching the project's `var(--color-*)` pattern
  - NO animation on tab switch — simply conditional render based on state

  **C. Integrate search/filter for "Course Catalog" tab:**
  - Import `buildCourseCatalog`, `SUBJECT_LABELS`, `LEVEL_LABELS`, `CourseSubject`, `CourseLevel` from `@/data/courseCatalog`
  - Move the `SUBJECT_FILTERS`, `LEVEL_FILTERS`, `SUBJECT_COLORS`, `SUBJECT_TEXT` constants from CourseCatalog.tsx into ExperienceView (or into courseCatalog.ts as exports — executor's choice, both are fine)
  - Add `query`, `activeSubject`, `activeLevel` state variables (same as CourseCatalog.tsx lines 49-51)
  - Add `useMemo` filtered computation (same as CourseCatalog.tsx lines 53-64)
  - Render in catalog tab: search input (lines 79-113 pattern), subject filter pills (lines 118-150 pattern), level filter pills (lines 152-176 pattern), result count, then course grid
  - Course grid in catalog tab: use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` layout
  - Course cards in catalog tab: use the existing inline `CourseCard` hover-expand style (NOT PixelTransition). Adapt `CourseCard` to accept `CatalogCourse` data — show code, name, description. Add subject badge and institution name.

  **D. Conditional TOC visibility:**
  - `ExperienceTOC` component: add a `visible` prop or check tab state
  - When `activeTab === 'catalog'`, TOC should have `display: none` or not render
  - When `activeTab === 'institution'`, TOC renders normally

  **E. Remove conference section:**
  - Delete the `<div id={PROF_DEV_ID}>` block (lines 267-284)
  - Delete the `PROF_DEV_ID` constant (line 106)
  - Delete the `ConferenceCard` import (now from shared file) — no longer used here
  - Delete the `conferences` import (line 7)
  - In `ExperienceTOC`: remove `PROF_DEV_ID` from `allIds` (line 153), remove the `{ label: 'Prof. Development', id: PROF_DEV_ID }` item (line 180)

  **F. Scroll behavior on tab switch:**
  - When switching tabs, scroll to top of the section (the h1 heading) to avoid disorienting position

  **Must NOT do**:
  - Do NOT add animation to tab switching — conditional render only
  - Do NOT modify `experience.ts` or `conferences.ts` data files
  - Do NOT modify `courseCatalog.ts` (except optionally moving color constants there)
  - Do NOT create new filter categories
  - Do NOT unify `FlatCourse` and `CatalogCourse` types
  - Do NOT leave `PROF_DEV_ID` references or dangling IntersectionObserver targets

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Major refactor of a 287-line component. Requires understanding two data shapes, integrating search logic, managing conditional rendering, and cleaning up TOC observer. Needs careful attention to avoid breaking institution view.
  - **Skills**: [`coding-standards`]
    - `coding-standards`: Ensures clean TypeScript patterns, proper state management, and consistent code style during a complex refactor
  - **Skills Evaluated but Omitted**:
    - `vercel-react-best-practices`: Not needed — this is a simple state toggle, not a performance optimization task
    - `visual-engineering`: Not needed — visual design is copying existing patterns, not creating new UI

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 5)
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: Tasks 6, 7, 8
  - **Blocked By**: Task 1 (needs extracted AnimatedItem import)

  **References**:

  **Pattern References**:
  - `src/components/sections/ExperienceView.tsx:1-287` — THE file being refactored. Read entirely. Key areas: imports (1-7), FlatCourse type (9-15), sortedExperiences (17-19), INSTITUTION_IDS (21-28), flattenCourses (34-44), AnimatedItem (46-59 — now imported), CourseCard (61-104), PROF_DEV_ID (106 — DELETE), ConferenceCard (108-149 — now imported, but REMOVE from this file entirely since conferences move out), ExperienceTOC (151-223 — remove prof dev from allIds and items), main ExperienceView export (225-287 — add tab bar, conditional content, remove conference section)
  - `src/components/sections/CourseCatalog.tsx:48-176` — Search/filter logic to port. Key areas: state variables (49-51), useMemo filter (53-64), search input JSX (79-113), subject filter pills (118-150), level filter pills (152-176), result count (179-183). Copy the LOGIC and JSX patterns, adapting card rendering.
  - `src/components/sections/CourseCatalog.tsx:15-47` — Filter constants and color maps (SUBJECT_FILTERS, LEVEL_FILTERS, SUBJECT_COLORS, SUBJECT_TEXT). Move these into ExperienceView or into courseCatalog.ts.

  **API/Type References**:
  - `src/data/courseCatalog.ts:3-23` — `CourseSubject`, `CourseLevel`, `CatalogCourse` types needed for catalog tab
  - `src/data/courseCatalog.ts:25-38` — `SUBJECT_LABELS`, `LEVEL_LABELS` exports needed for badge display
  - `src/data/courseCatalog.ts:76-101` — `buildCourseCatalog()` function. Call at module level: `const ALL_COURSES = buildCourseCatalog()`
  - `src/data/experience.ts:9-15` — `FlatCourse` type defined inline in ExperienceView — keep it for institution view

  **WHY Each Reference Matters**:
  - ExperienceView.tsx: This IS the file being modified. Every line section is called out so the executor knows exactly what to add, modify, and delete.
  - CourseCatalog.tsx lines 48-176: These are the EXACT implementations to port. Don't reinvent — copy the pattern and adapt the card rendering.
  - CourseCatalog.tsx lines 15-47: These constants must be moved (not recreated) to avoid drift.
  - courseCatalog.ts types: The catalog tab needs these types for filtering. Import them.

  **Acceptance Criteria**:
  - [ ] Tab bar renders with "By Institution" and "Course Catalog" tabs
  - [ ] Default tab is "By Institution" (shows institution-grouped layout)
  - [ ] Clicking "Course Catalog" shows search input + filter pills + flat grid
  - [ ] Clicking "By Institution" returns to institution layout
  - [ ] TOC visible in institution view, hidden in catalog view (desktop ≥ 1024px)
  - [ ] Search filters courses by text query
  - [ ] Subject pills filter by subject
  - [ ] Level pills filter by level
  - [ ] Conference section is GONE from Experience page
  - [ ] No `PROF_DEV_ID` references remain in the file
  - [ ] `?view=catalog` query param opens catalog tab by default
  - [ ] `npx next build` exits with code 0

  **QA Scenarios:**
  ```
  Scenario: Tab bar renders and switches views
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/experience
      2. Assert h1 contains "Teaching Experience"
      3. Assert two tab buttons exist with text "By Institution" and "Course Catalog"
      4. Assert default view shows institution sections (find heading "Butte College")
      5. Assert NO search input visible
      6. Click "Course Catalog" tab
      7. Assert search input[type="search"] appears
      8. Assert institution heading "Butte College" is NOT visible
      9. Click "By Institution" tab
      10. Assert "Butte College" heading reappears
      11. Assert search input disappears
    Expected Result: Tab switching works bidirectionally, each view shows correct content
    Failure Indicators: Both views visible simultaneously, tab click does nothing, content doesn't change
    Evidence: .sisyphus/evidence/task-4-tab-switching.png

  Scenario: Search filters courses in catalog view
    Tool: Playwright
    Preconditions: On /experience, "Course Catalog" tab active
    Steps:
      1. Navigate to http://localhost:3000/experience?view=catalog
      2. Assert catalog tab is active (search input visible)
      3. Count total course cards — store as totalCount
      4. Type "calculus" into search input
      5. Count course cards — assert fewer than totalCount
      6. Assert at least 1 card contains text "Calculus"
      7. Clear search, type "xyznonexistent"
      8. Assert "∅" empty state visible with "No courses match" text
    Expected Result: Search filters results, empty state shows for no matches
    Failure Indicators: Cards don't filter, count doesn't change, empty state missing
    Evidence: .sisyphus/evidence/task-4-search-filter.png

  Scenario: Subject and level filter pills work
    Tool: Playwright
    Preconditions: On /experience?view=catalog
    Steps:
      1. Click "Statistics" subject pill
      2. Assert Statistics pill has aria-pressed="true"
      3. Assert all visible course cards contain statistics-related courses
      4. Click "High School" level pill
      5. Assert both filters active simultaneously
      6. Assert result count reflects combined filter
      7. Click "All Subjects" to reset subject filter
      8. Click "All Levels" to reset level filter
      9. Assert full course list restored
    Expected Result: Filters compose, pills show pressed state, reset works
    Evidence: .sisyphus/evidence/task-4-filter-pills.png

  Scenario: TOC hides in catalog view (desktop)
    Tool: Playwright
    Preconditions: Viewport 1440x900
    Steps:
      1. Navigate to http://localhost:3000/experience
      2. Assert `nav.fixed` sidebar TOC is visible
      3. Click "Course Catalog" tab
      4. Assert `nav.fixed` sidebar TOC is NOT visible (display:none or removed)
      5. Click "By Institution" tab
      6. Assert `nav.fixed` sidebar TOC is visible again
    Expected Result: TOC toggles visibility with tab state
    Evidence: .sisyphus/evidence/task-4-toc-toggle.png

  Scenario: Conference section removed from Experience
    Tool: Bash (curl)
    Steps:
      1. curl -s localhost:3000/experience | grep -c "Conferences, workshops"
      2. curl -s localhost:3000/experience | grep -c "Professional Development"
    Expected Result: Both grep commands return 0 — no conference section on Experience page
    Failure Indicators: Count > 0 means conference section still present
    Evidence: .sisyphus/evidence/task-4-no-conferences.txt

  Scenario: Query param initializes catalog tab
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000/experience?view=catalog
      2. Assert search input is visible (catalog tab is active)
      3. Navigate to http://localhost:3000/experience (no param)
      4. Assert search input is NOT visible (institution tab is default)
    Expected Result: ?view=catalog query param sets initial tab state
    Evidence: .sisyphus/evidence/task-4-query-param.png
  ```

  **Commit**: YES
  - Message: `feat(experience): add tab bar toggle with course catalog search/filter`
  - Files: `src/components/sections/ExperienceView.tsx`
  - Pre-commit: `npx next build`

TP|- [x] 5. Build ProfessionalDevelopment Component

  **What to do**:
  - Create `src/components/sections/ProfessionalDevelopment.tsx`
  - Import `conferences` from `@/data/conferences`
  - Import `ConferenceCard` from `@/components/cards/ConferenceCard`
  - Import `AnimatedItem` from `@/components/ui/AnimatedItem`
  - Build a page component:
    - Page header: h1 "Professional Development", subtitle "Conferences, workshops, and technical trainings"
    - Render all 18 conference items using `AnimatedItem` > `ConferenceCard` pattern (same as ExperienceView previously did)
    - Layout: `grid-cols-1 max-w-2xl mx-auto gap-3` (same as ExperienceView conference section)
    - Use `py-20 px-4 md:px-8 max-w-7xl mx-auto` wrapper (matching Experience page)
  - Update `src/app/professional-development/page.tsx` to import and render this component (replacing the scaffold from Task 2)

  **Must NOT do**:
  - Do NOT add search or filtering to this page — it's a simple list
  - Do NOT modify `conferences.ts` data
  - Do NOT redesign ConferenceCard visual style

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Straightforward component build but needs to match existing design patterns precisely. More than a trivial task.
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `visual-engineering`: Not needed — copying existing visual patterns, not designing new UI

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 4)
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task 7
  - **Blocked By**: Tasks 1 (extracted components), 2 (route exists)

  **References**:

  **Pattern References**:
  - `src/components/sections/ExperienceView.tsx:267-284` — The EXACT conference section being relocated. Copy this structure: wrapper div, h2 header, subtitle p, grid container, AnimatedItem > ConferenceCard mapping. This is your source of truth.
  - `src/components/sections/ExperienceView.tsx:227-237` — Page header pattern: section wrapper, centered h1 + subtitle paragraph

  **API/Type References**:
  - `src/data/conferences.ts:1-6` — `ConferenceItem` interface (title, date, description, location?)
  - `src/data/conferences.ts:8` — `conferences` export array

  **WHY Each Reference Matters**:
  - ExperienceView lines 267-284: This is literally the code being moved. The new component should render identically to how this section looked before removal.
  - ExperienceView lines 227-237: Shows the page header styling pattern (text size, spacing, centering) to maintain visual consistency across pages.
  - conferences.ts: The data source and type to import.

  **Acceptance Criteria**:
  - [ ] `src/components/sections/ProfessionalDevelopment.tsx` exists
  - [ ] `/professional-development` renders h1 "Professional Development"
  - [ ] All 18 conference items render as ConferenceCards
  - [ ] Hover-expand works on conference cards
  - [ ] `npx next build` exits with code 0

  **QA Scenarios:**
  ```
  Scenario: Professional Development page renders all conferences
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to http://localhost:3000/professional-development
      2. Assert h1 or h2 contains "Professional Development"
      3. Assert subtitle contains "Conferences, workshops"
      4. Count `.chalk-card` elements — assert equals 18
      5. Hover over first conference card
      6. Assert expanded content appears (description text visible)
      7. Screenshot full page at 1440px viewport
    Expected Result: All 18 conferences render, hover-expand works, visual matches original style
    Failure Indicators: Wrong count, broken hover, missing cards, styling mismatch
    Evidence: .sisyphus/evidence/task-5-profdev-page.png

  Scenario: Conference card hover-expand works on mobile
    Tool: Playwright
    Preconditions: Viewport 375x812
    Steps:
      1. Navigate to /professional-development
      2. Click/tap first conference card (mobile uses click not hover)
      3. Assert description text becomes visible
    Expected Result: Cards expand on tap in mobile viewport
    Evidence: .sisyphus/evidence/task-5-profdev-mobile.png
  ```

  **Commit**: YES
  - Message: `feat(professional-development): build conference listing component`
  - Files: `src/components/sections/ProfessionalDevelopment.tsx`, `src/app/professional-development/page.tsx`
  - Pre-commit: `npx next build`

ZW|- [x] 6. Update Navigation + Hero Cross-References

  **What to do**:
  - **Navigation.tsx** (line 13): Change `{ href: '/courses', label: 'Courses' }` to `{ href: '/professional-development', label: 'Prof. Development' }`
  - **Hero.tsx** (line 24): Change `{ title: 'Browse Catalog', href: '/courses' }` to `{ title: 'Browse Catalog', href: '/experience?view=catalog' }` — deep-links to the catalog tab on Experience page
  - Verify: check if there are any OTHER links to `/courses` in the codebase using `ast_grep_search` or grep. Fix any found.

  **Must NOT do**:
  - Do NOT change the Hero stat card value ("20+") or label ("Courses Taught")
  - Do NOT modify Hero animations or layout
  - Do NOT modify Navigation structure beyond the single navLink entry

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Two single-line edits + verification grep. Trivial.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 7, 8)
  - **Parallel Group**: Wave 3 (with Tasks 7, 8)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 4 (Experience page must have catalog tab for Hero deep-link to make sense)

  **References**:

  **Pattern References**:
  - `src/components/ui/Navigation.tsx:7-15` — navLinks array. Line 13 is the Courses entry to modify.
  - `src/components/sections/Hero.tsx:21-26` — stat card with "Courses Taught" label and "Browse Catalog" link. Line 24 is the href to modify.

  **WHY Each Reference Matters**:
  - Navigation.tsx line 13: EXACT line to change. Must match the new route and label.
  - Hero.tsx line 24: EXACT line to change. The href becomes `/experience?view=catalog` so the deep-link opens the catalog tab.

  **Acceptance Criteria**:
  - [ ] Navigation shows "Prof. Development" label
  - [ ] Navigation link href is `/professional-development`
  - [ ] Hero "Browse Catalog" link href is `/experience?view=catalog`
  - [ ] No remaining `/courses` hrefs in any component (except redirect config)

  **QA Scenarios:**
  ```
  Scenario: Navigation label and link updated
    Tool: Playwright
    Preconditions: Dev server running, viewport 1440px
    Steps:
      1. Navigate to http://localhost:3000
      2. Assert nav bar contains text "Prof. Development"
      3. Assert nav bar does NOT contain text "Courses" (as a standalone link label)
      4. Click "Prof. Development" nav link
      5. Assert URL is /professional-development
      6. Assert page loads with "Professional Development" heading
    Expected Result: Nav label updated, link works correctly
    Evidence: .sisyphus/evidence/task-6-nav-updated.png

  Scenario: Hero stat card deep-links to catalog tab
    Tool: Playwright
    Steps:
      1. Navigate to http://localhost:3000
      2. Find stat card with text "Courses Taught"
      3. Hover/click to reveal links
      4. Find link with text "Browse Catalog"
      5. Click the link
      6. Assert URL is /experience?view=catalog
      7. Assert search input is visible (catalog tab is active)
    Expected Result: Hero link opens Experience page with catalog tab active
    Evidence: .sisyphus/evidence/task-6-hero-deeplink.png

  Scenario: No stale /courses references remain
    Tool: Bash
    Steps:
      1. grep -r "/courses" src/ --include="*.tsx" --include="*.ts" -l
    Expected Result: Zero files found (or only next.config with redirect)
    Evidence: .sisyphus/evidence/task-6-no-stale-refs.txt
  ```

  **Commit**: YES (groups with Tasks 7, 8)
  - Message: `chore: update navigation, Hero links, and metadata for page consolidation`
  - Files: `src/components/ui/Navigation.tsx`, `src/components/sections/Hero.tsx`
  - Pre-commit: `npx next build`

QB|- [x] 7. Delete Old CourseCatalog + /courses Directory

  **What to do**:
  - Verify `CourseCatalog` has zero remaining consumers: use `lsp_find_references` on the `CourseCatalog` export, or grep for `CourseCatalog` across all files
  - Delete `src/components/sections/CourseCatalog.tsx`
  - Delete `src/app/courses/` directory (the entire directory including `page.tsx`)
  - Verify `courseCatalog.ts` (the DATA file) is NOT deleted — it's still imported by ExperienceView
  - Run `npx next build` to verify nothing breaks

  **Must NOT do**:
  - Do NOT delete `src/data/courseCatalog.ts` — it's the data builder, still in use
  - Do NOT delete `src/components/ui/PixelTransition.tsx` — Hero.tsx still uses it

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: File deletion + verification. 2 deletes + 1 build check.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 6, 8)
  - **Parallel Group**: Wave 3 (with Tasks 6, 8)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 3 (redirect exists), 4 (search logic absorbed), 5 (ProfDev page built)

  **References**:

  **Pattern References**:
  - `src/components/sections/CourseCatalog.tsx` — File to DELETE. Verify zero imports first.
  - `src/app/courses/page.tsx` — Directory to DELETE. Redirect (Task 3) handles old URL.

  **WHY Each Reference Matters**:
  - Must verify these files have no remaining consumers before deletion. Use lsp_find_references or grep.

  **Acceptance Criteria**:
  - [ ] `src/components/sections/CourseCatalog.tsx` does not exist
  - [ ] `src/app/courses/` directory does not exist
  - [ ] `src/data/courseCatalog.ts` STILL exists
  - [ ] `src/components/ui/PixelTransition.tsx` STILL exists
  - [ ] `npx next build` exits with code 0

  **QA Scenarios:**
  ```
  Scenario: Deleted files are gone, kept files remain
    Tool: Bash
    Steps:
      1. ls src/components/sections/CourseCatalog.tsx 2>&1 — should fail (file not found)
      2. ls src/app/courses/ 2>&1 — should fail (directory not found)
      3. ls src/data/courseCatalog.ts — should succeed
      4. ls src/components/ui/PixelTransition.tsx — should succeed
      5. npx next build — should exit 0
    Expected Result: Deleted files gone, data file and PixelTransition preserved, build passes
    Evidence: .sisyphus/evidence/task-7-deletions.txt
  ```

  **Commit**: YES (groups with Tasks 6, 8)
  - Message: `chore: remove deprecated CourseCatalog and /courses route`
  - Files: deleted `src/components/sections/CourseCatalog.tsx`, deleted `src/app/courses/page.tsx`
  - Pre-commit: `npx next build`

SN|- [x] 8. Add Metadata to Experience Page

  **What to do**:
  - Edit `src/app/experience/page.tsx` to add `export const metadata` with:
    - `title`: "Teaching Experience | Steven Huff"
    - `description`: "Explore Steven Huff's teaching experience across community college, university, and K-12 settings. Browse the full course catalog with search and filtering."
  - The page component stays the same (just renders `<ExperienceView />`)

  **Must NOT do**:
  - Do NOT wrap in `<main>` or change page structure — just add metadata export

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Adding 4 lines to a 5-line file.
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 6, 7)
  - **Parallel Group**: Wave 3 (with Tasks 6, 7)
  - **Blocks**: F1-F4
  - **Blocked By**: Task 4 (Experience page refactored)

  **References**:

  **Pattern References**:
  - `src/app/courses/page.tsx:3-6` — Metadata export pattern to follow (before this file is deleted in Task 7, read it)
  - `src/app/experience/page.tsx:1-5` — Current file to add metadata to

  **WHY Each Reference Matters**:
  - courses/page.tsx: Copy the metadata export pattern and adapt for Experience page
  - experience/page.tsx: The target file. Currently 5 lines, will become ~10.

  **Acceptance Criteria**:
  - [ ] `src/app/experience/page.tsx` has `export const metadata`
  - [ ] Metadata includes title and description
  - [ ] `npx next build` exits with code 0

  **QA Scenarios:**
  ```
  Scenario: Experience page has metadata
    Tool: Bash
    Steps:
      1. grep "export const metadata" src/app/experience/page.tsx
      2. npx next build
    Expected Result: Metadata export found, build passes
    Evidence: .sisyphus/evidence/task-8-metadata.txt
  ```

  **Commit**: YES (groups with Tasks 6, 7)
  - Message: `chore: update navigation, Hero links, and metadata for page consolidation`
  - Files: `src/app/experience/page.tsx`
  - Pre-commit: `npx next build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

PN|  Manual verification: Tab bar, search, filters, ProfDev page all verified | VERDICT: PASS

SM|  Manual verification: Build passes, no data files modified | VERDICT: PASS

XH|  Manual verification: All pages load, no console errors | VERDICT: PASS

SK|  Manual verification: All 8 tasks complete, no scope creep | VERDICT: PASS

---

## Commit Strategy

- **Wave 1**: `refactor(components): extract ConferenceCard and AnimatedItem to shared files` — new component files
- **Wave 1**: `feat(professional-development): scaffold page route and redirect` — new route, next.config update
- **Wave 2**: `feat(experience): add tab bar toggle with course catalog search/filter` — ExperienceView.tsx refactor
- **Wave 2**: `feat(professional-development): build conference listing component` — ProfessionalDevelopment.tsx
- **Wave 3**: `chore: update navigation, Hero links, and metadata for page consolidation` — Navigation.tsx, Hero.tsx, experience page.tsx
- **Wave 3**: `chore: remove deprecated CourseCatalog and /courses route` — deletions

---

## Success Criteria

### Verification Commands
```bash
npx next build              # Expected: exits 0, no errors
curl -s localhost:3000/experience | grep "By Institution"    # Expected: found
curl -s localhost:3000/experience | grep "Course Catalog"    # Expected: found
curl -s localhost:3000/professional-development | grep "Professional Development"  # Expected: found
curl -sI localhost:3000/courses  # Expected: 307/308 redirect to /professional-development
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] `npx next build` passes
- [ ] Zero `/courses` path references remain in source (except redirect config)
- [ ] All 18 conferences render on ProfDev page
- [ ] Tab toggle works bidirectionally
- [ ] Search + filters functional in catalog tab
- [ ] TOC hides/shows correctly with tab state
- [ ] `?view=catalog` query param initializes correct tab
