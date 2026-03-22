# Universal Expanding Card Layout

## TL;DR

> **Quick Summary**: Refactor all 6 expanding card types to use a consistent right-side layout: colored status badge on top, date/year below it. Add missing status fields to data types and data, extract shared helpers, and add new CSS status classes.
> 
> **Deliverables**:
> - Updated `ConferenceItem` and `Credential` interfaces with `status` field
> - All conference and credential data entries populated with appropriate status values
> - All 6 card components refactored with universal right-side layout (badge + date)
> - New CSS status classes for "Earned", "Training", "Facilitated", "Presented", "Attended", "Past"
> - Extracted shared `getStatusLabel()` and `getStatusClass()` helpers into a reusable utility
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES - 3 waves
> **Critical Path**: Task 1 (shared helpers) → Tasks 2-5 (data + components, parallel) → Task 6 (visual QA)

---

## Context

### Original Request
"Enhancement to reorganize the elements on the expanding cards to be universal styling. On the right, it should say current, or concept or some kind of tag, under the tag should be the year/time."

### Interview Summary
**Key Discussions**:
- **Scope**: All 6 expanding card types: CourseCard, DegreeCard, CredentialCard, ToolCard, AchievementCard, ConferenceCard
- **Layout**: Right side shows status badge (colored, uppercase) stacked vertically above the date. Both right-aligned.
- **Status tags for cards that lack them**: Conferences need "Training"/"Facilitated"/"Presented"/"Attended". Credentials/Degrees need "Earned"/"In Progress". Courses with `isCurrent:false` need "Past".
- **Date format**: Preserve existing per-item formats (May 2021, Summer 2025, 2017–2018, etc.)
- **Pattern to follow**: ToolCard/AchievementCard badge pattern is closest to target, but date needs added below badge

**Research Findings**:
- `ConferenceItem` interface lacks `status` field — needs adding
- `Credential` interface lacks `status` field — needs adding
- `Course` interface lacks `status` — derives from parent `Institution.status`
- Existing CSS: `.status-active` (gold), `.status-progress` (amber), `.status-concept` (gray), `.status-completed` (green)
- Existing helpers `getStatusLabel()` and `getStatusClass()` in ProjectGrid.tsx are local to that file, typed to `Project['status']`

---

## Work Objectives

### Core Objective
Unify all 6 expanding card right-side headers with a consistent: **colored status badge + date** stacked layout.

### Concrete Deliverables
- `src/lib/statusHelpers.ts` — Shared status badge utility functions
- Updated `src/data/conferences.ts` — `ConferenceItem` with `status` field + all entries populated
- Updated `src/data/education.ts` — `Credential` with `status` field + all entries populated
- Updated `src/styles/chalkboard.css` — New status classes
- Updated `src/app/globals.css` — New status CSS variables
- Updated 4 component files: ExperienceView.tsx, EducationView.tsx, ProjectGrid.tsx, ConferenceCard.tsx

### Definition of Done
- [x] All 6 card types display: right-aligned status badge + date below badge
- [x] No card type has a different right-side layout from the others
- [x] All status badges are colored and uppercase
- [x] All dates display below their respective badges
- [x] `npm run build` passes with zero errors

### Must Have
- Consistent vertical stack: badge on top, date below, right-aligned on every card
- Status field on every data type that feeds a card
- All existing card functionality preserved (expand/collapse, links, content)

### Must NOT Have (Guardrails)
- DO NOT change the left-side content of any card (title, subtitle)
- DO NOT change expanded card body content or behavior
- DO NOT change card interaction behavior (hover, touch, keyboard)
- DO NOT add unit tests (no test infrastructure exists)
- DO NOT abstract cards into a single shared component — keep each card as its own component, just unify the right-side pattern
- DO NOT change the expand/collapse animation mechanism
- DO NOT add new npm dependencies

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: None

### QA Policy
Every task includes Playwright-based visual QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate to portfolio, verify card layouts, screenshot each card type
- **Build**: Use Bash — `npm run build` must pass

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — must complete first):
├── Task 1: Extract shared status helpers + add new CSS status classes [quick]

Wave 2 (Data + Components — MAX PARALLEL after Wave 1):
├── Task 2: Add status to ConferenceItem + refactor ConferenceCard [quick]
├── Task 3: Add status to Credential + refactor DegreeCard & CredentialCard [quick]
├── Task 4: Refactor CourseCard to use universal layout [quick]
├── Task 5: Refactor ToolCard & AchievementCard to add date below badge [quick]

Wave 3 (Verification — after all implementation):
├── Task 6: Full visual QA across all card types [visual-engineering]

Critical Path: Task 1 → Tasks 2-5 (parallel) → Task 6
Parallel Speedup: ~60% faster than sequential
Max Concurrent: 4 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1    | —         | 2, 3, 4, 5 |
| 2    | 1         | 6 |
| 3    | 1         | 6 |
| 4    | 1         | 6 |
| 5    | 1         | 6 |
| 6    | 2, 3, 4, 5 | — |

### Agent Dispatch Summary

- **Wave 1**: 1 task → `quick`
- **Wave 2**: 4 tasks → all `quick`
- **Wave 3**: 1 task → `visual-engineering` + `playwright` skill

---

## TODOs

- [x] 1. Extract shared status helpers + add new CSS status classes

  **What to do**:
  - Create `src/lib/statusHelpers.ts` with two exported functions:
    - `getUniversalStatusLabel(status: string): string` — maps status slugs to display labels. Must handle ALL status values used across the app: `'active'`, `'in-progress'`, `'concept'`, `'completed'`, `'current'`, `'past'`, `'earned'`, `'training'`, `'facilitated'`, `'presented'`, `'attended'`. Fallback: capitalize the raw string.
    - `getUniversalStatusClass(status: string): string` — maps status slugs to CSS class names. Must handle all the same values. Fallback: `'bg-gray-800 text-gray-400'`.
  - Add new CSS variables to `src/app/globals.css` (after line 24, the existing status vars):
    - `--color-status-earned: #10b981` (green, same as completed)
    - `--color-status-current: #3b82f6` (blue)
    - `--color-status-past: #6b7280` (gray, same as concept)
    - `--color-status-training: #8b5cf6` (purple)
    - `--color-status-facilitated: #ec4899` (pink)
    - `--color-status-presented: #f59e0b` (amber, same as progress)
    - `--color-status-attended: #06b6d4` (cyan)
  - Add new CSS classes to `src/styles/chalkboard.css` (after line 61, the existing status classes):
    - `.status-earned { background-color: rgba(16, 185, 129, 0.15); color: #10b981; }`
    - `.status-current { background-color: rgba(59, 130, 246, 0.15); color: #3b82f6; }`
    - `.status-past { background-color: rgba(107, 114, 128, 0.15); color: #9ca3af; }`
    - `.status-training { background-color: rgba(139, 92, 246, 0.15); color: #8b5cf6; }`
    - `.status-facilitated { background-color: rgba(236, 72, 153, 0.15); color: #ec4899; }`
    - `.status-presented { background-color: rgba(245, 158, 11, 0.15); color: #f59e0b; }`
    - `.status-attended { background-color: rgba(6, 182, 212, 0.15); color: #06b6d4; }`
  - Update `ProjectGrid.tsx` to import from the new shared helpers instead of its local `getStatusLabel()`/`getStatusClass()`. Remove the local functions (lines 47-65) and replace with imports. The shared helpers accept `string` so they work with the old `Project['status']` type too.

  **Must NOT do**:
  - DO NOT change any card rendering or layout in this task
  - DO NOT change data files
  - DO NOT remove the `getTypeLabel()` function from ProjectGrid.tsx (it's separate)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small focused task — create one utility file, add CSS lines, update imports
  - **Skills**: []
    - No specialized skills needed for this straightforward extraction

  **Parallelization**:
  - **Can Run In Parallel**: NO (Wave 1 — foundation)
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Tasks 2, 3, 4, 5
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:47-65` — Existing `getStatusLabel()` and `getStatusClass()` functions to extract and generalize
  - `src/styles/chalkboard.css:57-61` — Existing status badge CSS classes to extend with new values

  **API/Type References**:
  - `src/data/projects.ts:1` — `ProjectStatus` type definition showing existing status values: `'active' | 'in-progress' | 'concept' | 'completed'`
  - `src/data/experience.ts:1` — `PositionStatus` type: `'current' | 'past'`

  **External References**:
  - `src/app/globals.css:21-24` — Existing CSS variables for status colors (pattern to follow for new ones)

  **WHY Each Reference Matters**:
  - ProjectGrid.tsx L47-65: This is the exact code being extracted. Copy logic, then widen the switch to handle new status values.
  - chalkboard.css L57-61: Follow the exact `rgba(r,g,b, 0.15)` background + solid color text pattern for new classes.
  - projects.ts L1: The shared helpers must remain compatible with this existing type.
  - globals.css L21-24: Follow the `--color-status-{name}` naming convention for new variables.

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Shared helpers file exists and exports correctly
    Tool: Bash
    Preconditions: Task implementation complete
    Steps:
      1. Run: cat src/lib/statusHelpers.ts
      2. Verify file exports `getUniversalStatusLabel` and `getUniversalStatusClass`
      3. Verify function handles all 11 status values listed above
      4. Run: npx tsc --noEmit src/lib/statusHelpers.ts (or npm run build)
    Expected Result: File exists, both functions exported, TypeScript compiles
    Failure Indicators: File missing, missing exports, TS compilation errors
    Evidence: .sisyphus/evidence/task-1-helpers-exist.txt

  Scenario: New CSS classes exist in chalkboard.css
    Tool: Bash
    Preconditions: Task implementation complete
    Steps:
      1. Run: grep -c 'status-earned\|status-current\|status-past\|status-training\|status-facilitated\|status-presented\|status-attended' src/styles/chalkboard.css
      2. Assert count is 7 (one per new class)
    Expected Result: All 7 new CSS classes present
    Failure Indicators: Count less than 7
    Evidence: .sisyphus/evidence/task-1-css-classes.txt

  Scenario: ProjectGrid.tsx uses shared helpers (no local duplicates)
    Tool: Bash
    Preconditions: Task implementation complete
    Steps:
      1. Run: grep 'import.*statusHelpers' src/components/sections/ProjectGrid.tsx
      2. Assert import statement exists
      3. Run: grep -c 'function getStatusLabel\|function getStatusClass' src/components/sections/ProjectGrid.tsx
      4. Assert count is 0 (local functions removed)
    Expected Result: Import present, local functions removed
    Failure Indicators: No import, or local functions still present
    Evidence: .sisyphus/evidence/task-1-import-check.txt

  Scenario: Build passes after extraction
    Tool: Bash
    Preconditions: All changes in this task complete
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
    Expected Result: Build succeeds with zero errors
    Failure Indicators: Build fails, type errors, missing imports
    Evidence: .sisyphus/evidence/task-1-build.txt
  ```

  **Commit**: YES
  - Message: `feat(ui): extract shared status helpers and add new status CSS classes`
  - Files: `src/lib/statusHelpers.ts`, `src/styles/chalkboard.css`, `src/app/globals.css`, `src/components/sections/ProjectGrid.tsx`
  - Pre-commit: `npm run build`

- [x] 2. Add status to ConferenceItem + refactor ConferenceCard layout

  **What to do**:
  - Update `ConferenceItem` interface in `src/data/conferences.ts` to add: `status: 'training' | 'facilitated' | 'presented' | 'attended'`
  - Add `status` value to every conference entry in the data array. Use these mappings based on the description content:
    - "Norfield trained on industry level Haas Mills" → `'training'`
    - "SLC Math Tutor Training Facilitator" → `'facilitated'`
    - "CSU Chico GoFlex Session #1" → `'facilitated'`
    - "FLC Faculty Writing Community" → `'attended'`
    - "Quality Learning and Teaching Workshops (QLT)" → `'training'`
    - "Digital Pedagogy FLC" → `'attended'`
    - "Theory and Practice of Teaching First-Year Students FLC" → `'attended'`
    - "Mount Lassen Mathematics Conference" → `'presented'`
    - "CSU Chico Go Virtual Summer Institute #2" → `'training'`
    - "CSU Sacramento's 2020 Quantitative Reasoning Summer Course" → `'training'`
    - "EO 1100 Co-Requisite PD Instructor" → `'presented'`
    - "Chico Math Project Summer Workshop" → `'training'`
    - "2018 CPM Teacher Conference" → `'attended'`
    - "SparkFun Education: Maker Education PD" → `'training'`
    - "Sonoma State: Learn by Making" → `'training'`
    - "AP Calculus AB and BC Workshop" → `'training'`
    - "AVID Certified" → `'training'`
    - "WestEd Experimental Research Study" → `'attended'`
  - Refactor `ConferenceCard.tsx` right-side layout:
    - **Current**: Just the date in mono font on the right
    - **Target**: Replace with a vertical stack (flex-col, items-end): status badge on top (using `getUniversalStatusLabel`/`getUniversalStatusClass` from shared helpers), date below in `text-xs font-mono text-[var(--color-text-secondary)]`
    - Import shared helpers from `src/lib/statusHelpers.ts`
    - Badge styling: `text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0` + status class (matches ToolCard pattern)

  **Must NOT do**:
  - DO NOT change conference card expanded body content
  - DO NOT change card interaction behavior
  - DO NOT change the left side (title)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Two files to update (data + component), small focused changes
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 3, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:169-171` — ToolCard badge rendering pattern: `<span className={text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0 ${getStatusClass(project.status)}}>`
  - `src/components/sections/ProjectGrid.tsx:150-172` — ToolCard full header layout (flex justify-between items-start) to replicate

  **API/Type References**:
  - `src/data/conferences.ts:1-6` — Current `ConferenceItem` interface to extend
  - `src/data/conferences.ts:8-126` — All conference entries that need `status` field added
  - `src/lib/statusHelpers.ts` — Shared helpers to import (created in Task 1)

  **External References**:
  - `src/components/cards/ConferenceCard.tsx:1-47` — Current ConferenceCard component to refactor

  **WHY Each Reference Matters**:
  - ProjectGrid.tsx L169-171: This is the exact badge HTML to replicate for consistent styling
  - ConferenceCard.tsx: The component being modified — understand current structure before changing
  - conferences.ts: Every entry needs the status field — use description context to assign correct value

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Conference cards show status badge + date on right
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running (npm run dev)
    Steps:
      1. Navigate to portfolio site
      2. Find the Conferences/Professional Development section
      3. Locate any conference card (e.g., "Norfield trained on industry level Haas Mills")
      4. Assert: right side contains a colored badge with text "Training" (uppercase)
      5. Assert: below the badge, date text "Summer 2025" is visible
      6. Screenshot the card
    Expected Result: Badge "TRAINING" visible in colored pill, "Summer 2025" below it
    Failure Indicators: No badge visible, date missing, date above badge instead of below
    Evidence: .sisyphus/evidence/task-2-conference-card.png

  Scenario: All conference entries have status values (no undefined badges)
    Tool: Bash
    Preconditions: Data file updated
    Steps:
      1. Run: grep -c "status:" src/data/conferences.ts
      2. Assert count equals number of conference entries (18)
      3. Run: grep "status:" src/data/conferences.ts | grep -v "training\|facilitated\|presented\|attended"
      4. Assert no output (all statuses are valid values)
    Expected Result: 18 status fields, all with valid values
    Failure Indicators: Count mismatch, invalid status values
    Evidence: .sisyphus/evidence/task-2-data-check.txt

  Scenario: Build passes after conference changes
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
    Expected Result: Build succeeds
    Evidence: .sisyphus/evidence/task-2-build.txt
  ```

  **Commit**: YES (groups with Tasks 3, 4, 5 in Wave 2 commit)
  - Message: `feat(ui): unify all expanding cards with universal badge + date layout`
  - Files: `src/data/conferences.ts`, `src/components/cards/ConferenceCard.tsx`
  - Pre-commit: `npm run build`

- [x] 3. Add status to Credential + refactor DegreeCard & CredentialCard layout

  **What to do**:
  - Update `Credential` interface in `src/data/education.ts` to add: `status: 'earned' | 'in-progress'`
  - Add `status` value to every degree and credential entry:
    - Master of Science, Mathematics Education (May 2021) → `'earned'`
    - Bachelor of Science, Mathematics (May 2015) → `'earned'`
    - California Teaching Credential, Single Subject Mathematics (May 2015) → `'earned'`
    - Supplementary Authorization, Computer Science (Summer 2023) → `'earned'`
    - Supplementary Authorization, CTE: ICT (Spring 2026) → `'in-progress'` (future date, still in progress)
  - Refactor `DegreeCard` in `src/components/sections/EducationView.tsx` (around lines 98-144):
    - **Current**: Right side shows date in mono font
    - **Target**: Replace with vertical stack (flex-col, items-end): status badge on top (using shared helpers), date below in `text-xs font-mono text-[var(--color-text-secondary)]`
    - Import shared helpers from `src/lib/statusHelpers.ts`
    - Badge styling: `text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wide shrink-0` + status class
  - Refactor `CredentialCard` in `src/components/sections/EducationView.tsx` (around lines 146-187):
    - Same pattern as DegreeCard: status badge + date below, right-aligned
    - The "in-progress" status for the CTE credential should render with `status-progress` class (amber)

  **Must NOT do**:
  - DO NOT change the thesis section
  - DO NOT change the expanded content of degree/credential cards
  - DO NOT change the left side (degree name, field, institution)

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: One data file + one component file, pattern is same as Task 2
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 4, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:169-171` — ToolCard badge rendering pattern to replicate
  - `src/components/cards/ConferenceCard.tsx` — After Task 2 refactors this, it serves as another reference for the universal pattern

  **API/Type References**:
  - `src/data/education.ts:1-8` — Current `Credential` interface to extend with `status`
  - `src/data/education.ts:21-57` — All degree and credential entries that need `status` field
  - `src/lib/statusHelpers.ts` — Shared helpers to import (created in Task 1)

  **External References**:
  - `src/components/sections/EducationView.tsx:98-187` — DegreeCard (L98-144) and CredentialCard (L146-187) components to refactor

  **WHY Each Reference Matters**:
  - education.ts L1-8: The Credential interface is used for BOTH degrees and credentials arrays, so adding status here affects both
  - EducationView.tsx L98-187: Both card components live in this file — understand the current right-side layout before replacing it
  - ProjectGrid.tsx L169-171: The canonical badge HTML pattern to copy

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Degree cards show status badge + date on right
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to portfolio site
      2. Find the Education section
      3. Locate the "Master of Science" degree card
      4. Assert: right side contains colored badge with text "EARNED" (green)
      5. Assert: below the badge, "May 2021" is visible
      6. Screenshot the card
    Expected Result: Green "EARNED" badge visible, "May 2021" below it
    Failure Indicators: No badge, date missing, wrong status text
    Evidence: .sisyphus/evidence/task-3-degree-card.png

  Scenario: In-progress credential shows correct status
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to Education section
      2. Locate the "CTE: Information and Communication Technologies" credential card
      3. Assert: right side contains amber badge with text "IN PROGRESS"
      4. Assert: below the badge, "Spring 2026" is visible
    Expected Result: Amber "IN PROGRESS" badge visible, "Spring 2026" below
    Failure Indicators: Shows "Earned" instead, date missing
    Evidence: .sisyphus/evidence/task-3-credential-inprogress.png

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
    Expected Result: Build succeeds
    Evidence: .sisyphus/evidence/task-3-build.txt
  ```

  **Commit**: YES (groups with Tasks 2, 4, 5 in Wave 2 commit)
  - Message: `feat(ui): unify all expanding cards with universal badge + date layout`
  - Files: `src/data/education.ts`, `src/components/sections/EducationView.tsx`
  - Pre-commit: `npm run build`

- [x] 4. Refactor CourseCard to use universal right-side layout

  **What to do**:
  - Refactor `CourseCard` in `src/components/sections/ExperienceView.tsx` (around lines 114-157):
    - **Current**: Right side shows a "Current" badge ONLY if `institution.status === 'current'`, nothing otherwise. No date shown.
    - **Target**: Replace with vertical stack (flex-col, items-end): status badge on top (always present — "Current" if `institution.status === 'current'`, "Past" if `'past'`), date below showing `institution.dateStart` – `institution.dateEnd ?? 'Present'`
    - Import shared helpers from `src/lib/statusHelpers.ts`
    - Badge styling: same as all other cards
  - The CourseCard receives the parent `Institution` object to get status and dates. Verify the component props include institution data — if CourseCard only receives course data, the parent rendering context passes institution info and you may need to thread `institution.status`, `institution.dateStart`, `institution.dateEnd` as props.
  - Check how CourseCard is rendered in ExperienceView.tsx to understand what props it currently receives, and add `status` and `dateRange` props if needed.

  **Must NOT do**:
  - DO NOT change the course expanded content (code, name, description)
  - DO NOT change the Experience data file (experience.ts already has status on Institution)
  - DO NOT change how institutions are grouped or rendered

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component file change, follows established pattern
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 5)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:169-171` — ToolCard badge pattern to replicate
  - `src/components/sections/ProjectGrid.tsx:150-168` — ToolCard header flex layout (flex justify-between items-start)

  **API/Type References**:
  - `src/data/experience.ts:1` — `PositionStatus = 'current' | 'past'` — the status values CourseCard will use
  - `src/data/experience.ts:16-25` — `Institution` interface showing `status`, `dateStart`, `dateEnd` fields
  - `src/data/experience.ts:4-8` — `Course` interface — CourseCard's core data
  - `src/lib/statusHelpers.ts` — Shared helpers (created in Task 1)

  **External References**:
  - `src/components/sections/ExperienceView.tsx:114-157` — Current CourseCard component
  - `src/components/sections/ExperienceView.tsx` — Search for where CourseCard is rendered to understand what props are passed

  **WHY Each Reference Matters**:
  - experience.ts L16-25: Institution has `status`, `dateStart`, `dateEnd` — CourseCard needs these for the universal layout but may not currently receive them as props
  - ExperienceView.tsx L114-157: Must understand current CourseCard structure, especially what props it receives, to add status + date

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Current course card shows "Current" badge + date
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to portfolio site
      2. Find the Experience section
      3. Locate a course under a current institution (e.g., Butte College)
      4. Assert: right side contains blue "CURRENT" badge
      5. Assert: below the badge, date range is visible (e.g., "2021 – Present")
      6. Screenshot the card
    Expected Result: Blue "CURRENT" badge, date range below it
    Failure Indicators: No badge, no date, only "Current" text without styling
    Evidence: .sisyphus/evidence/task-4-course-current.png

  Scenario: Past course card shows "Past" badge + date
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Find a course under a past institution
      2. Assert: right side contains gray "PAST" badge
      3. Assert: date range visible below badge
    Expected Result: Gray "PAST" badge, date range below
    Failure Indicators: No badge at all (current behavior for past courses), or missing date
    Evidence: .sisyphus/evidence/task-4-course-past.png

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
    Expected Result: Build succeeds
    Evidence: .sisyphus/evidence/task-4-build.txt
  ```

  **Commit**: YES (groups with Tasks 2, 3, 5 in Wave 2 commit)
  - Message: `feat(ui): unify all expanding cards with universal badge + date layout`
  - Files: `src/components/sections/ExperienceView.tsx`
  - Pre-commit: `npm run build`

- [x] 5. Refactor ToolCard & AchievementCard to add date below badge

  **What to do**:
  - Refactor `ToolCard` in `src/components/sections/ProjectGrid.tsx` (around lines 105-347):
    - **Current**: Right side shows ONLY the status badge (L169-171). Date is shown inside the expanded body.
    - **Target**: Replace the single badge `<span>` with a vertical stack (flex-col, items-end): keep existing badge on top, add date below in `text-xs font-mono text-[var(--color-text-secondary)]`. Date format: `project.dateStart` – `project.dateEnd ?? 'Present'`.
    - The badge already uses shared helpers (after Task 1), so just add the date element below it.
  - Refactor `AchievementCard` in `src/components/sections/ProjectGrid.tsx` (around lines 355-418):
    - **Current**: Right side shows status badge. Date in expanded body.
    - **Target**: Same pattern — add date below badge in header.
    - Date format: same as ToolCard.
  - Both cards should wrap their right-side content in: `<div className="flex flex-col items-end gap-1 shrink-0">` containing the badge `<span>` and the date `<span>`.

  **Must NOT do**:
  - DO NOT remove the date from the expanded body (keep it there too — redundancy is fine)
  - DO NOT change the badge styling (it already uses shared helpers after Task 1)
  - DO NOT change the expanded body content, links, videos, or iframes
  - DO NOT change the category filter tabs or grid layout

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file, adding date element below existing badge — minimal change
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Tasks 2, 3, 4)
  - **Blocks**: Task 6
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:169-171` — Current ToolCard badge (the element to wrap in a flex-col container with date added below)
  - `src/components/sections/ProjectGrid.tsx:355-418` — AchievementCard component location

  **API/Type References**:
  - `src/data/projects.ts:3-18` — `Project` interface showing `dateStart`, `dateEnd`, `status` fields

  **External References**:
  - `src/components/sections/EducationView.tsx` — After Task 3, DegreeCard will have the universal pattern implemented — can reference for consistency

  **WHY Each Reference Matters**:
  - ProjectGrid.tsx L169-171: This is the exact location where the date needs to be added below the existing badge span
  - projects.ts L3-18: Need `dateStart` and `dateEnd` field names to format the date string correctly

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: ToolCard shows badge + date on right
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to portfolio site
      2. Find the Projects/Tools section
      3. Locate the "D.A.D" tool card
      4. Assert: right side contains amber "IN PROGRESS" badge
      5. Assert: below the badge, "2026 – Present" is visible
      6. Screenshot the card
    Expected Result: Badge and date both visible, vertically stacked, right-aligned
    Failure Indicators: Date missing from header, only badge shown (current behavior)
    Evidence: .sisyphus/evidence/task-5-toolcard.png

  Scenario: AchievementCard shows badge + date on right
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Find an achievement card (grant/initiative/curriculum type)
      2. Assert: right side contains status badge
      3. Assert: below the badge, date is visible
      4. Screenshot the card
    Expected Result: Badge and date both visible, same layout as ToolCard
    Failure Indicators: Date missing, inconsistent layout with ToolCard
    Evidence: .sisyphus/evidence/task-5-achievementcard.png

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
    Expected Result: Build succeeds
    Evidence: .sisyphus/evidence/task-5-build.txt
  ```

  **Commit**: YES (groups with Tasks 2, 3, 4 in Wave 2 commit)
  - Message: `feat(ui): unify all expanding cards with universal badge + date layout`
  - Files: `src/components/sections/ProjectGrid.tsx`
  - Pre-commit: `npm run build`

- [x] 6. Full visual QA across all 6 card types

  **What to do**:
  - Start the dev server (`npm run dev`)
  - Navigate to the portfolio site in Playwright
  - Visit EVERY section that contains expanding cards:
    - Experience section → CourseCards
    - Education section → DegreeCards, CredentialCards
    - Projects section → ToolCards, AchievementCards
    - Conferences/Professional Development section → ConferenceCards
  - For EACH card type, verify:
    1. Right side shows colored status badge (uppercase text, colored pill)
    2. Below the badge, date/year is visible in mono font
    3. Badge and date are right-aligned, vertically stacked
    4. Expanded content is unchanged (click to expand, verify body content)
    5. Card interactions work (hover expand, touch expand, keyboard)
  - Test at mobile viewport (375px wide) — cards should still look correct
  - Screenshot each card type (collapsed and expanded) as evidence
  - If ANY card type is inconsistent with the others, report exactly what differs

  **Must NOT do**:
  - DO NOT modify any files — this is a QA-only task
  - DO NOT fix issues found — report them for the coordinator to route back

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual verification task requiring Playwright browser automation and screenshot comparison
  - **Skills**: [`playwright`]
    - `playwright`: Required for browser automation, navigation, screenshot capture

  **Parallelization**:
  - **Can Run In Parallel**: NO (Wave 3 — depends on all implementation)
  - **Parallel Group**: Wave 3 (solo)
  - **Blocks**: Final Verification Wave
  - **Blocked By**: Tasks 2, 3, 4, 5

  **References**:

  **Pattern References**:
  - All component files modified in Tasks 2-5 — verify rendered output matches spec

  **External References**:
  - The universal right-side pattern: `<div class="flex flex-col items-end gap-1 shrink-0"><span class="status-badge">STATUS</span><span class="date">Date</span></div>`

  **WHY Each Reference Matters**:
  - Component files: The QA agent needs to know what was supposed to change to verify it rendered correctly

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All 6 card types have consistent right-side layout
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, all implementation tasks complete
    Steps:
      1. Navigate to portfolio site
      2. For each section (Experience, Education, Projects, Conferences):
         a. Find an expanding card
         b. Screenshot in collapsed state
         c. Verify: right side has colored badge + date below it
         d. Click to expand
         e. Screenshot in expanded state
         f. Verify: expanded body content is intact
      3. Compare all 6 card types — layout pattern must be identical
    Expected Result: 6/6 card types show badge + date, all consistent
    Failure Indicators: Any card missing badge, missing date, different layout
    Evidence: .sisyphus/evidence/task-6-all-cards-collapsed.png, .sisyphus/evidence/task-6-all-cards-expanded.png

  Scenario: Mobile viewport (375px)
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Set viewport to 375x812
      2. Navigate to each section
      3. Verify cards still show badge + date on right
      4. Verify no text overflow or layout breakage
      5. Screenshot
    Expected Result: Cards render correctly on mobile
    Failure Indicators: Badge/date overflow, text truncation, layout broken
    Evidence: .sisyphus/evidence/task-6-mobile.png

  Scenario: Build passes (final)
    Tool: Bash
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
    Expected Result: Clean build, zero errors
    Evidence: .sisyphus/evidence/task-6-build.txt
  ```

  **Commit**: NO (QA-only task, no code changes)

---

## Final Verification Wave

- [x] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, check rendered output). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [x] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names.
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [x] F3. **Real Manual QA** — `visual-engineering` (+ `playwright` skill)
  Start dev server. Visit every section containing expanding cards. Verify ALL 6 card types show badge + date on right. Expand each card — verify body content unchanged. Test on mobile viewport. Screenshot each card type expanded and collapsed.
  Output: `Cards [6/6 correct] | Expanded [6/6 intact] | Mobile [PASS/FAIL] | VERDICT`

- [x] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff. Verify 1:1 — everything in spec was built, nothing beyond spec. Check "Must NOT do" compliance. Detect cross-task contamination. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | VERDICT`

---

## Commit Strategy

- **After Wave 1**: `feat(ui): extract shared status helpers and add new status CSS classes` — src/lib/statusHelpers.ts, src/styles/chalkboard.css, src/app/globals.css
- **After Wave 2**: `feat(ui): unify all expanding cards with universal badge + date layout` — all 4 component files + 2 data files
- **After Wave 3**: No commit needed (QA only)

---

## Success Criteria

### Verification Commands
```bash
npm run build        # Expected: Build succeeds, 0 errors
```

### Final Checklist
- [x] All 6 card types show status badge + date stacked vertically, right-aligned
- [x] All status badges use colored CSS classes (no unstyled badges)
- [x] All existing card interactions work unchanged (expand, collapse, links)
- [x] No card left-side content changed
- [x] No card expanded body content changed
- [x] Build passes with zero errors
