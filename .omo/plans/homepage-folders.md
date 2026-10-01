# Homepage: Replace Stat Cards with Navigable Folders

## TL;DR

> **Quick Summary**: Replace the 4 stat cards in the Hero section with 5 interactive Folder components (one per non-Home/Contact nav section). Each folder displays the stat text as its label, opens to reveal clickable paper sub-items, and navigates to the corresponding page section on paper click.
> 
> **Deliverables**:
> - Modified `src/components/sections/Hero.tsx` — stat cards replaced with Folder grid
> - 5 folders: Experience, Projects, Education, Skills, Courses
> - Open-then-navigate behavior matching sidebar FolderNav UX
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO — single implementation task
> **Critical Path**: Task 1 → Final Verification

---

## Context

### Original Request
Replace the stat cards under the hero heading (10+ Years Teaching, 20+ Courses Taught, etc.) with Folder components. Each folder should use the current card text and link to the corresponding page. Add a 5th folder for Skills. Click opens folder to reveal paper sub-links, then paper click navigates.

### Interview Summary
**Key Discussions**:
- **Mapping**: 10+ Years Teaching → Experience, 20+ Courses Taught → Courses, $300K Grant Awarded → Education, 10+ Tools Built → Projects, 35+ Skills → Skills (new)
- **Click behavior**: Open-then-navigate (not direct navigation) — matches sidebar FolderNav UX
- **Layout**: Keep grid layout (responsive, same area as current stat cards)
- **Skills stat**: "35+ Skills" based on aggregate count across languages, software, systems, hardware data

**Research Findings**:
- `Folder` component (`src/components/ui/Folder.tsx`) supports all needed props: `label`, `size`, `items` (ReactNode[]), `open`, `onToggle`, `onPaperClick`
- `FolderNav` (`src/components/ui/FolderNav.tsx`) already defines sub-items per section in `FOLDER_SECTIONS` — use as reference for correct hrefs
- Hero's GSAP timeline animates the stats container ref — keeping the ref attachment unchanged preserves animation
- Folder component hard-caps papers at `maxItems = 3` (line 43) — all sections fit within this (Experience: 3, Projects: 2, Education: 3, Skills: 3, Courses: 1)

### Metis Review
**Identified Gaps** (addressed):
- **Paper overflow in grid**: Papers translate 120%+ on open. Mitigated by using generous grid gaps and `overflow-visible` on the container. Overlap with adjacent folders is acceptable and consistent with sidebar behavior.
- **FolderNav redundancy on desktop**: Sidebar FolderNav and hero folders coexist. Kept both — sidebar is persistent navigation aid, hero folders are the visual content gateway. Different UX purposes.
- **Label readability at 9px**: Folder label is small. At `size={1}`, the 100x80px folder provides enough space for short stat text. The label wraps naturally via `text-center leading-tight`.
- **Grid columns for 5 items**: Use responsive `grid-cols-2 md:grid-cols-3 lg:grid-cols-5` to avoid orphaned items.
- **Print visibility**: Folder component has `print:hidden` baked in. Accepted — stat cards disappearing on print is fine for a portfolio site.
- **Courses section sparseness**: Only 1 sub-item ("Browse Catalog"). Acceptable — 1 paper is visually distinct but functional.

---

## Work Objectives

### Core Objective
Replace the Hero stat card grid with interactive Folder components that visually display stat text and provide open-then-navigate access to each portfolio section.

### Concrete Deliverables
- `src/components/sections/Hero.tsx` modified: stat cards → Folder grid

### Definition of Done
- [ ] `npm run build` completes with zero errors
- [ ] Homepage renders 5 Folder components in the stats area
- [ ] Each folder opens on click, shows navigable paper sub-items
- [ ] Paper clicks navigate to correct page sections
- [ ] Existing Hero content (heading, subtitle, tagline, CTAs) unchanged
- [ ] FolderNav sidebar continues working on homepage

### Must Have
- 5 Folder components: Experience, Projects, Education, Skills, Courses
- Each folder labeled with its stat text (value + description)
- Open/close toggle with one-at-a-time behavior
- Paper items matching FolderNav sub-items for each section
- Paper click → `router.push(href)` → folder closes
- Click-outside-to-close behavior
- GSAP animation on the container preserved
- Responsive grid layout

### Must NOT Have (Guardrails)
- Do NOT modify `src/components/ui/Folder.tsx` — it's shared by FolderNav
- Do NOT modify `src/components/ui/FolderNav.tsx` or its data
- Do NOT change any Hero content outside the stats grid (heading, subtitle, tagline, CTAs)
- Do NOT add new npm dependencies
- Do NOT add per-folder GSAP animations — keep the single container animation
- Do NOT extract folder section data to a shared module — keep inline in Hero.tsx
- Do NOT add new routes or pages
- Do NOT add custom colors per folder — use `#5ECEC3` for all, matching FolderNav

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: YES (Next.js build)
- **Automated tests**: None (UI component swap, no unit tests needed)
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Build**: Use Bash — `npm run build`, verify exit code

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Single implementation task):
└── Task 1: Replace Hero stat cards with navigable Folder components [visual-engineering]

Wave FINAL (After Task 1 — verification):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA — Playwright (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → F1-F4
```

### Dependency Matrix
| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 | None | F1, F2, F3, F4 |
| F1-F4 | 1 | None |

### Agent Dispatch Summary
- **Wave 1**: 1 task — T1 → `visual-engineering`
- **FINAL**: 4 tasks — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs

- [ ] 1. Replace Hero stat cards with navigable Folder components

  **What to do**:

  1. **Remove the `stats` const** (lines 9-14 of Hero.tsx) — it's no longer needed.

  2. **Add imports** to Hero.tsx:
     - `useState` and `useEffect` (add to existing `useRef` import from react)
     - `import { useRouter } from 'next/navigation'`
     - `import { Folder } from '@/components/ui/Folder'`
     - `Link` is already imported

  3. **Define the folder sections data** inline in Hero.tsx (above the component, replacing `stats`). Structure:
     ```
     const heroFolders = [
       {
         value: '10+',
         label: 'Years Teaching',
         items: [
           { title: 'Post-Secondary', href: '/experience#section-post-secondary' },
           { title: 'Secondary', href: '/experience#section-secondary' },
           { title: 'Elementary', href: '/experience#section-elementary' },
         ],
       },
       {
         value: '10+',
         label: 'Tools Built',
         items: [
           { title: 'Tools & Software', href: '/projects#section-tools' },
           { title: 'Achievements', href: '/projects#section-achievements' },
         ],
       },
       {
         value: '$300K',
         label: 'Grant Awarded',
         items: [
           { title: 'Degrees & Credentials', href: '/education#section-degrees' },
           { title: "Master's Thesis", href: '/education#section-thesis' },
           { title: 'Interests', href: '/education#section-interests' },
         ],
       },
       {
         value: '35+',
         label: 'Skills',
         items: [
           { title: 'Languages & Software', href: '/skills#section-languages' },
           { title: 'Systems & Hardware', href: '/skills#section-lms' },
           { title: 'Courses I Can Teach', href: '/skills#section-teaching' },
         ],
       },
       {
         value: '20+',
         label: 'Courses Taught',
         items: [
           { title: 'Browse Catalog', href: '/courses' },
         ],
       },
     ]
     ```
     **CRITICAL**: The sub-item hrefs MUST exactly match those in `FolderNav.tsx` lines 22-54. Cross-reference each href.

  4. **Add state and router** inside the `Hero` component:
     - `const [openIndex, setOpenIndex] = useState<number | null>(null)`
     - `const router = useRouter()`
     - `const folderGridRef = useRef<HTMLDivElement>(null)` (for click-outside)

  5. **Add click-outside handler** — copy the pattern from `FolderNav.tsx` lines 72-80:
     ```
     useEffect(() => {
       function handleClickOutside(e: MouseEvent) {
         if (folderGridRef.current && !folderGridRef.current.contains(e.target as Node)) {
           setOpenIndex(null)
         }
       }
       document.addEventListener('mousedown', handleClickOutside)
       return () => document.removeEventListener('mousedown', handleClickOutside)
     }, [])
     ```

  6. **Replace the stats grid JSX** (lines 160-183 of Hero.tsx). Replace the entire `<div ref={statsRef} className="grid grid-cols-2 md:grid-cols-4 ...">` block with:
     - A container div that keeps `ref={statsRef}` and `opacity-0` (for GSAP)
     - Also attach `ref={folderGridRef}` to the same div (use a callback ref or merge refs)
     - Grid classes: `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 w-full overflow-visible`
     - Map over `heroFolders` rendering a `<Folder>` for each, following the pattern from `FolderNav.tsx` lines 89-123:
       - `color="#5ECEC3"`
       - `size={1}`
       - `label={`${folder.value}\n${folder.label}`}` — combines stat value and description
       - `items` = array of `<Link>` elements for each sub-item (copy the paper Link pattern from FolderNav lines 92-105)
       - `open={openIndex === idx}`
       - `onToggle={() => setOpenIndex(openIndex === idx ? null : idx)}`
       - `onPaperClick={(i) => { router.push(heroFolders[idx].items[i].href); setOpenIndex(null); }}`
     - Center each folder in its grid cell using `flex items-center justify-center`

  7. **Handle merged refs** for the stats container — it needs both `statsRef` (for GSAP) and `folderGridRef` (for click-outside). Options:
     - Use a callback ref that assigns to both
     - Or use a single ref and rename (simplest: replace `statsRef` with `folderGridRef` and update the GSAP `tl.fromTo` to use `folderGridRef.current`)

  **Must NOT do**:
  - Do NOT modify Folder.tsx or FolderNav.tsx
  - Do NOT change heading, subtitle, tagline, or CTA sections
  - Do NOT add per-folder GSAP animations
  - Do NOT add new dependencies
  - Do NOT use different colors per folder

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: This is a frontend UI component swap in a React/Next.js app with visual layout concerns (grid, folder sizing, paper overflow)
  - **Skills**: [`playwright`]
    - `playwright`: Needed for QA scenarios — navigating the homepage, clicking folders, verifying paper links, taking screenshots
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not needed — using existing Folder component as-is, not designing new UI
    - `frontend-ui-ux`: Not needed — layout is prescribed (grid), no design decisions

  **Parallelization**:
  - **Can Run In Parallel**: NO (only implementation task)
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: F1, F2, F3, F4
  - **Blocked By**: None

  **References** (CRITICAL - Be Exhaustive):

  **Pattern References** (existing code to follow):
  - `src/components/ui/FolderNav.tsx:89-123` — **Primary pattern**: How to render Folder components with items, open state, toggle, and paper click navigation. Copy this pattern exactly.
  - `src/components/ui/FolderNav.tsx:67-80` — **State + click-outside pattern**: `useState<number | null>(null)` for openIndex, `useEffect` with `mousedown` listener for click-outside close.
  - `src/components/ui/FolderNav.tsx:92-105` — **Paper Link pattern**: How to render `<Link>` elements as Folder paper items with correct styling and click handlers.
  - `src/components/ui/FolderNav.tsx:18-64` — **Sub-item data reference**: The exact hrefs and titles for each section's sub-items. Cross-reference these when building `heroFolders` data.

  **API/Type References** (contracts to implement against):
  - `src/components/ui/Folder.tsx:5-14` — `FolderProps` interface: `color`, `size`, `items` (ReactNode[]), `label`, `onPaperClick`, `open`, `onToggle`
  - `src/components/ui/Folder.tsx:43` — `maxItems = 3` hard cap on papers

  **Animation References** (preserve existing behavior):
  - `src/components/sections/Hero.tsx:64-71` — GSAP animation for stats container: `fromTo(statsRef.current, { opacity: 0, y: 25 }, { ... })`. The ref attachment must be preserved on the new grid container.
  - `src/components/sections/Hero.tsx:26-28` — `prefers-reduced-motion` check. No changes needed here.

  **Current Code to Replace**:
  - `src/components/sections/Hero.tsx:9-14` — `stats` const array (REMOVE entirely)
  - `src/components/sections/Hero.tsx:160-183` — Stats grid div with chalk-card items (REPLACE with Folder grid)

  **WHY Each Reference Matters**:
  - FolderNav lines 89-123: This is the canonical pattern for rendering Folder with navigation. Don't invent a new pattern — replicate this one.
  - FolderNav lines 18-64: These contain the exact sub-item hrefs. Getting an href wrong means broken anchor navigation. Cross-reference every href.
  - Folder.tsx FolderProps: Understanding the prop interface prevents passing wrong types or missing required interactions.
  - Hero.tsx GSAP lines: The animation timeline references `statsRef.current`. If the ref disconnects, the entrance animation breaks silently (no error, just no animation).

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All 5 folders render in the Hero stats area
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for page load (waitForLoadState 'domcontentloaded')
      3. Query all Folder components in the stats grid area: locate via the grid container `role="button"` elements
      4. Count the folder elements — expect exactly 5
      5. Take screenshot of the hero section
    Expected Result: 5 folder elements visible in a grid below the hero heading
    Failure Indicators: Fewer than 5 folders, build errors, chalk-card elements still present
    Evidence: .sisyphus/evidence/task-1-folders-render.png

  Scenario: Folder opens and shows paper sub-items on click
    Tool: Playwright (playwright skill)
    Preconditions: Homepage loaded
    Steps:
      1. Click the first folder (Experience — "10+ Years Teaching")
      2. Wait 500ms for open animation
      3. Verify papers are visible — look for Link elements with text "Post-Secondary", "Secondary", "Elementary"
      4. Take screenshot showing open folder with papers
    Expected Result: 3 paper elements visible with correct text labels
    Failure Indicators: No papers visible, wrong text, folder doesn't open
    Evidence: .sisyphus/evidence/task-1-folder-open.png

  Scenario: Paper click navigates to correct page section
    Tool: Playwright (playwright skill)
    Preconditions: First folder (Experience) is open
    Steps:
      1. Click the paper labeled "Post-Secondary"
      2. Wait for navigation
      3. Verify URL is /experience#section-post-secondary (or /experience with hash)
      4. Verify page content loads (Experience page renders)
    Expected Result: URL contains "/experience" and hash "#section-post-secondary"
    Failure Indicators: No navigation, wrong URL, 404 error
    Evidence: .sisyphus/evidence/task-1-paper-navigate.png

  Scenario: Only one folder open at a time
    Tool: Playwright (playwright skill)
    Preconditions: Homepage loaded, no folders open
    Steps:
      1. Click first folder (Experience) — verify it opens
      2. Click third folder (Education) — verify Experience closes and Education opens
      3. Take screenshot showing only Education open
    Expected Result: Only one folder shows open papers at a time
    Failure Indicators: Multiple folders open simultaneously
    Evidence: .sisyphus/evidence/task-1-single-open.png

  Scenario: Click outside closes open folder
    Tool: Playwright (playwright skill)
    Preconditions: A folder is open
    Steps:
      1. Click any folder to open it
      2. Click on the hero heading area (outside the folder grid)
      3. Verify all folders are closed (no papers visible)
    Expected Result: Open folder closes when clicking outside the grid
    Failure Indicators: Folder stays open after outside click
    Evidence: .sisyphus/evidence/task-1-click-outside.png

  Scenario: Build succeeds with zero errors
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `npm run build`
      2. Check exit code is 0
      3. Grep output for "error" — expect 0 matches
    Expected Result: Build completes successfully
    Failure Indicators: Non-zero exit code, TypeScript errors, build warnings
    Evidence: .sisyphus/evidence/task-1-build-pass.txt

  Scenario: FolderNav sidebar still works (no regression)
    Tool: Playwright (playwright skill)
    Preconditions: Homepage loaded on desktop viewport (1280px+)
    Steps:
      1. Verify FolderNav sidebar is visible (left side, `data-testid="folder-nav"`)
      2. Click the Experience folder in the sidebar
      3. Verify it opens with papers
      4. Click "Post-Secondary" paper in sidebar
      5. Verify navigation to /experience#section-post-secondary
    Expected Result: Sidebar FolderNav works identically to before
    Failure Indicators: Sidebar missing, broken, or navigating incorrectly
    Evidence: .sisyphus/evidence/task-1-foldernav-regression.png
  ```

  **Evidence to Capture:**
  - [ ] task-1-folders-render.png — Screenshot of 5 folders in hero grid
  - [ ] task-1-folder-open.png — Screenshot of open folder with papers
  - [ ] task-1-paper-navigate.png — Screenshot after paper click navigation
  - [ ] task-1-single-open.png — Screenshot confirming single-open behavior
  - [ ] task-1-click-outside.png — Screenshot confirming click-outside close
  - [ ] task-1-build-pass.txt — Build output showing success
  - [ ] task-1-foldernav-regression.png — Screenshot of working sidebar

  **Commit**: YES
  - Message: `feat(hero): replace stat cards with navigable folder components`
  - Files: `src/components/sections/Hero.tsx`
  - Pre-commit: `npm run build`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read Hero.tsx, check for Folder imports, count folders, verify hrefs). For each "Must NOT Have": search codebase for forbidden changes — reject with file:line if Folder.tsx or FolderNav.tsx were modified, if new dependencies were added, or if non-stats Hero content changed. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npm run build`. Review Hero.tsx for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports (especially old `stats` const). Check AI slop: excessive comments, over-abstraction, generic variable names. Verify no leftover chalk-card elements. Check that new code follows existing patterns (compare with FolderNav usage).
  Output: `Build [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server. Execute EVERY QA scenario from Task 1 — follow exact steps, capture evidence. Test cross-scenario integration: open folder → click paper → verify navigation → go back → verify folders reset. Test edge cases: rapid clicking between folders, clicking folder while animating, mobile viewport (2-col grid). Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  Read Task 1's "What to do" and "Must NOT do". Read the actual git diff. Verify 1:1 — everything in spec was built (5 folders, correct labels, correct hrefs, open behavior, click-outside, GSAP preserved), nothing beyond spec was built (no Folder.tsx changes, no FolderNav changes, no new dependencies, no extra animations). Flag any unaccounted changes.
  Output: `Tasks [N/N compliant] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

| Order | Message | Files | Pre-commit |
|-------|---------|-------|------------|
| 1 | `feat(hero): replace stat cards with navigable folder components` | `src/components/sections/Hero.tsx` | `npm run build` |

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: exit 0, no errors
```

### Final Checklist
- [ ] 5 Folder components render in Hero stats area
- [ ] Each folder has correct stat text label
- [ ] Each folder opens to show correct paper sub-items
- [ ] Paper clicks navigate to correct page sections
- [ ] One folder open at a time
- [ ] Click outside closes open folder
- [ ] GSAP entrance animation works on the folder grid
- [ ] FolderNav sidebar unaffected
- [ ] Hero heading, subtitle, tagline, CTAs unchanged
- [ ] No modifications to Folder.tsx or FolderNav.tsx
- [ ] Build passes with zero errors
