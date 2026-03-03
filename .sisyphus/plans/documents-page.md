# Consolidate CV & Thesis into Single Documents Page

## TL;DR

> **Quick Summary**: Merge the separate `/cv` and `/thesis` routes into one `/documents` page with a segmented control (pill toggle) to switch between viewing CV and Thesis PDFs. Replace the SplitButton nav component with a simple "Documents" nav link.
>
> **Deliverables**:
> - New `SegmentedControl` UI component (reusable pill toggle)
> - New `DocumentsView` client component (toggle state + conditional PdfViewer)
> - New `/documents` route (server page with metadata + client view)
> - Updated Navigation (desktop + mobile) with single "Documents" link
> - Updated ConditionalFooter to hide footer on `/documents`
> - Cleanup: deleted old `/cv`, `/thesis` routes and `SplitButton` component
>
> **Estimated Effort**: Quick
> **Parallel Execution**: YES — 2 waves + final verification
> **Critical Path**: Task 1 (SegmentedControl) → Task 3 (DocumentsView + route) → Task 5 (verify)

---

## Context

### Original Request
User wants to consolidate the separate `/cv` and `/thesis` PDF viewer pages into a single route where both documents are available via a toggle. They specifically asked for an alternative to the current SplitButton pattern — a segmented control (pill-style toggle) was chosen.

### Interview Summary
**Key Discussions**:
- **Route**: `/documents` — neutral route, neither CV nor Thesis gets naming priority
- **Toggle pattern**: Segmented control (rounded pill container, active option fills with accent color)
- **Default view**: CV loads first when navigating to `/documents`
- **Old routes**: Delete entirely — no redirects, `/cv` and `/thesis` will 404
- **Nav update**: Replace SplitButton with a single "Documents" link in both desktop nav and mobile drawer
- **Download links**: Removed from mobile drawer — just the single nav link

### Metis Review
**Identified Gaps** (addressed):
- **ConditionalFooter.tsx**: Has `PDF_PAGES = ['/cv', '/thesis']` which must become `['/documents']` or the footer will render on top of the PDF viewer
- **Server/Client boundary**: `/documents/page.tsx` must export `Metadata` (server) but toggle state requires client — solution: server `page.tsx` + client `DocumentsView.tsx` wrapper

---

## Work Objectives

### Core Objective
Replace two separate PDF viewer routes with a single `/documents` route using a segmented control to toggle between CV and Thesis.

### Concrete Deliverables
- `src/components/ui/SegmentedControl.tsx` — reusable pill toggle component
- `src/components/sections/DocumentsView.tsx` — client component with toggle state + conditional PdfViewer
- `src/app/documents/page.tsx` — server page with metadata
- Updated `src/components/ui/Navigation.tsx` — single Documents link
- Updated `src/components/ui/ConditionalFooter.tsx` — updated route list
- Updated `src/components/ui/index.ts` — barrel export changes

### Definition of Done
- [ ] Navigating to `/documents` shows CV by default in full-viewport PDF viewer
- [ ] Clicking "Thesis" in the segmented control switches to thesis PDF
- [ ] Clicking "CV" switches back to CV PDF
- [ ] Nav bar shows "Documents" link on desktop (no SplitButton)
- [ ] Mobile drawer shows single "Documents" link
- [ ] Footer is hidden on `/documents` page
- [ ] `/cv` and `/thesis` routes no longer exist
- [ ] No build errors: `npm run build` passes

### Must Have
- Segmented control uses existing CSS custom properties (`--color-accent`, `--color-accent-muted`, `--color-bg-primary`, etc.)
- Segmented control sits between the nav bar and the PDF viewer
- Smooth visual transition on the active segment (not jarring)
- Body scroll lock still works correctly (inherited from PdfViewer)

### Must NOT Have (Guardrails)
- No URL hash or query param state — this is purely client-side React state
- No animation/transition on the PDF iframe swap — just conditional render
- No new dependencies — use only what's already installed
- No download buttons in the nav — the browser's native PDF viewer toolbar handles downloads
- No changes to `PdfViewer.tsx` or `pdfConfig.ts` — they work as-is
- Do not add the segmented control INTO the nav bar — it lives on the documents page itself

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (no test framework in project)
- **Automated tests**: None
- **Framework**: None

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Build**: Use Bash — `npm run build`, check exit code

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — independent components + cleanup):
├── Task 1: Create SegmentedControl component [quick]
├── Task 2: Delete old routes + SplitButton + update barrel exports [quick]
└── Task 3: Update ConditionalFooter route list [quick]

Wave 2 (After Wave 1 — page assembly + nav update):
├── Task 4: Create DocumentsView + /documents route [quick]
└── Task 5: Update Navigation component [quick]

Wave FINAL (After ALL tasks):
├── Task F1: Build verification + visual QA [quick]
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1 (SegmentedControl) | — | 4 |
| 2 (Delete old routes) | — | 5 |
| 3 (ConditionalFooter) | — | F1 |
| 4 (DocumentsView + route) | 1 | F1 |
| 5 (Navigation update) | 2 | F1 |
| F1 (Build + QA) | 3, 4, 5 | — |

### Agent Dispatch Summary

- **Wave 1**: **3 tasks** — T1 → `quick`, T2 → `quick`, T3 → `quick`
- **Wave 2**: **2 tasks** — T4 → `quick`, T5 → `quick`
- **FINAL**: **1 task** — F1 → `quick` + `playwright` skill

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.

- [ ] 1. Create SegmentedControl Component

  **What to do**:
  - Create `src/components/ui/SegmentedControl.tsx` — a reusable client component
  - Props: `options: { label: string; value: string }[]`, `value: string`, `onChange: (value: string) => void`
  - Renders a rounded pill container with each option as a clickable segment
  - Active segment gets filled background using `var(--color-accent)` with white text
  - Inactive segments use transparent background with `var(--color-text-secondary)` text
  - Hover state on inactive: subtle `var(--color-accent-muted)` background
  - Smooth CSS transition on background/color changes (150ms)
  - Use inline styles with CSS custom properties to match the site's existing pattern
  - Must be keyboard accessible: focusable segments, Enter/Space to activate

  **Must NOT do**:
  - No framer-motion or GSAP — CSS transitions only
  - No external dependencies
  - Do not make this specific to documents — keep it generic/reusable

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`coding-standards`]
    - `coding-standards`: Ensures clean React component patterns and accessibility
  - **Skills Evaluated but Omitted**:
    - `visual-engineering`: Overkill for a single small component with inline styles

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 2, 3)
  - **Blocks**: Task 4 (DocumentsView needs this component)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/ui/SplitButton.tsx` — Current toggle pattern with inline styles and CSS custom properties. Copy the styling approach (inline `style={{}}` with `var(--color-*)`) but NOT the Link/routing pattern
  - `src/components/ui/Navigation.tsx:9-17` — How `baseStyles` and `activeStyles` are structured with CSS custom properties

  **API/Type References**:
  - CSS custom properties used throughout the site: `--color-accent`, `--color-accent-muted`, `--color-bg-primary`, `--color-text-secondary`, `--color-text-primary`, `--color-border`

  **WHY Each Reference Matters**:
  - SplitButton shows the exact styling system (inline styles + CSS vars) — follow this pattern exactly for visual consistency
  - The CSS custom properties are the design system — using them ensures the component matches the site's theme

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: SegmentedControl renders with correct active state
    Tool: Bash (node)
    Steps:
      1. Import the component in a quick test render (or verify via Playwright after Task 4)
      2. Verify the component exports correctly from the file
      3. Run `npx tsc --noEmit src/components/ui/SegmentedControl.tsx` — no type errors
    Expected Result: Component compiles without errors
    Evidence: .sisyphus/evidence/task-1-typecheck.txt
  ```

  **Commit**: NO (groups with final commit)

- [ ] 2. Delete Old Routes and SplitButton Component

  **What to do**:
  - Delete `src/app/cv/page.tsx`
  - Delete `src/app/thesis/page.tsx`
  - Delete the `src/app/cv/` directory
  - Delete the `src/app/thesis/` directory
  - Delete `src/components/ui/SplitButton.tsx`
  - Update `src/components/ui/index.ts`: remove `SplitButton` export, add `SegmentedControl` export

  **Must NOT do**:
  - Do not delete `PdfViewer.tsx` — it's still used
  - Do not delete `pdfConfig.ts` — paths are still used
  - Do not modify Navigation.tsx in this task — that's Task 5

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `git-master`: Not needed — just file deletions and a small edit

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Task 5 (Navigation needs SplitButton gone to avoid import errors)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/ui/index.ts` — Current barrel exports. Line 6 exports SplitButton — remove it. Add SegmentedControl export.
  - `src/app/cv/page.tsx` — Delete entirely
  - `src/app/thesis/page.tsx` — Delete entirely
  - `src/components/ui/SplitButton.tsx` — Delete entirely

  **WHY Each Reference Matters**:
  - The barrel export must stay in sync with available components — removing SplitButton export prevents build errors from Navigation (updated in Task 5)

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Old files are deleted
    Tool: Bash
    Steps:
      1. Verify `src/app/cv/page.tsx` does not exist
      2. Verify `src/app/thesis/page.tsx` does not exist
      3. Verify `src/components/ui/SplitButton.tsx` does not exist
      4. Verify `src/components/ui/index.ts` does NOT contain 'SplitButton'
      5. Verify `src/components/ui/index.ts` DOES contain 'SegmentedControl'
    Expected Result: All old files gone, barrel export updated
    Evidence: .sisyphus/evidence/task-2-cleanup.txt
  ```

  **Commit**: NO (groups with final commit)

- [ ] 3. Update ConditionalFooter Route List

  **What to do**:
  - In `src/components/ui/ConditionalFooter.tsx`, change `PDF_PAGES` from `['/cv', '/thesis']` to `['/documents']`

  **Must NOT do**:
  - Do not change any other logic in ConditionalFooter

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Task F1 (must be correct for footer QA)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/ui/ConditionalFooter.tsx:6` — Line to change: `const PDF_PAGES = ['/cv', '/thesis']` → `const PDF_PAGES = ['/documents']`

  **WHY Each Reference Matters**:
  - This is a 1-line change but critical — without it, the footer renders over the PDF viewer on `/documents`, breaking the layout

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: ConditionalFooter updated
    Tool: Bash (grep)
    Steps:
      1. Grep `src/components/ui/ConditionalFooter.tsx` for '/documents'
      2. Verify it does NOT contain '/cv' or '/thesis'
    Expected Result: PDF_PAGES array contains only '/documents'
    Evidence: .sisyphus/evidence/task-3-footer-update.txt
  ```

  **Commit**: NO (groups with final commit)

- [ ] 4. Create DocumentsView Component and /documents Route

  **What to do**:
  - Create `src/components/sections/DocumentsView.tsx` as a `'use client'` component:
    - Import `SegmentedControl` from `@/components/ui`
    - Import `PdfViewer` from `@/components/ui`
    - Import `CV_PDF_PATH` and `THESIS_PDF_PATH` from `@/lib/pdfConfig`
    - Define two options: `{ label: 'Curriculum Vitae', value: 'cv' }` and `{ label: "Master's Thesis", value: 'thesis' }`
    - Use `useState('cv')` for the active document (CV is default)
    - Render the SegmentedControl at the top with a small padding/container
    - Conditionally render `<PdfViewer>` below based on active value:
      - `'cv'` → `pdfUrl={CV_PDF_PATH}` title="Curriculum Vitae"
      - `'thesis'` → `pdfUrl={THESIS_PDF_PATH}` title="Master's Thesis"
    - The SegmentedControl container should have a subtle border-bottom to visually separate it from the PDF
    - Use `var(--color-bg-primary)` for the control bar background
  - Create `src/app/documents/page.tsx` as a server component:
    - Export `metadata` with title "Documents | Steven Huff" and appropriate description
    - Render `<main className="min-h-screen"><DocumentsView /></main>`

  **Must NOT do**:
  - Do not modify PdfViewer.tsx
  - Do not add URL state management (hash, query params, router)
  - Do not animate the PDF swap — just conditional render
  - Do not make the page.tsx a client component — keep it server for metadata

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`coding-standards`]
    - `coding-standards`: Ensures clean component composition and proper server/client boundary
  - **Skills Evaluated but Omitted**:
    - `visual-engineering`: Simple layout — inline styles suffice

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 5)
  - **Blocks**: Task F1
  - **Blocked By**: Task 1 (needs SegmentedControl component)

  **References**:

  **Pattern References**:
  - `src/app/cv/page.tsx` — Shows the exact pattern: server page with metadata + `<main><PdfViewer /></main>`. Copy this structure but wrap in DocumentsView client component
  - `src/app/education/page.tsx` — Shows the clean server/client split pattern: server page imports a client view component. Follow this exact approach.
  - `src/components/ui/PdfViewer.tsx` — Component API: `pdfUrl`, `title`, `downloadUrl` props. Note it locks body scroll and uses `height: calc(100vh - 64px)`. The segmented control bar will eat into this height — adjust the PdfViewer's container or wrap accordingly

  **API/Type References**:
  - `src/lib/pdfConfig.ts` — `CV_PDF_PATH` and `THESIS_PDF_PATH` constants to import

  **WHY Each Reference Matters**:
  - `cv/page.tsx` shows the exact PdfViewer usage pattern to replicate
  - `education/page.tsx` demonstrates the server page + client view pattern that solves the metadata export issue Metis identified
  - PdfViewer's height calc matters — the segmented control bar adds ~48px of height that may need accounting for

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: /documents route exists and renders CV by default
    Tool: Bash
    Steps:
      1. Verify `src/app/documents/page.tsx` exists
      2. Verify `src/components/sections/DocumentsView.tsx` exists
      3. Run `npx tsc --noEmit` — no type errors
    Expected Result: Both files exist and compile
    Evidence: .sisyphus/evidence/task-4-typecheck.txt

  Scenario: DocumentsView has correct structure
    Tool: Bash (grep)
    Steps:
      1. Verify DocumentsView.tsx contains 'use client'
      2. Verify DocumentsView.tsx imports SegmentedControl
      3. Verify DocumentsView.tsx imports PdfViewer
      4. Verify DocumentsView.tsx imports CV_PDF_PATH and THESIS_PDF_PATH
      5. Verify page.tsx exports metadata
      6. Verify page.tsx does NOT contain 'use client'
    Expected Result: Correct server/client boundary
    Evidence: .sisyphus/evidence/task-4-structure.txt
  ```

  **Commit**: NO (groups with final commit)

- [ ] 5. Update Navigation Component

  **What to do**:
  - In `src/components/ui/Navigation.tsx`:
    - Remove the `SplitButton` import (line 6)
    - Remove the `CV_PDF_PATH` and `THESIS_PDF_PATH` imports (line 7) — no longer needed in nav
    - Add `{ href: '/documents', label: 'Documents' }` to the `navLinks` array (after Contact, or wherever feels natural — suggest after 'Prof. Development' and before 'Contact', so Contact stays last)
    - Remove the SplitButton rendering in the desktop nav (lines 80-82: the `hidden md:block` div wrapping `<SplitButton />`)
    - Replace the entire mobile drawer "Documents" section (lines 148-202: the `div` with "Documents" header, View CV, Download CV, View Thesis, Download Thesis links) with nothing — the "Documents" link is now part of the regular `navLinks` array and renders automatically

  **Must NOT do**:
  - Do not change nav link order for existing items
  - Do not modify the hamburger animation or mobile drawer behavior
  - Do not change the desktop nav layout/spacing

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: []
  - **Skills Evaluated but Omitted**:
    - `coding-standards`: Simple deletion and one array entry — overkill

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 2 (with Task 4)
  - **Blocks**: Task F1
  - **Blocked By**: Task 2 (SplitButton must be deleted first to avoid stale imports)

  **References**:

  **Pattern References**:
  - `src/components/ui/Navigation.tsx:9-17` — The `navLinks` array. Add `{ href: '/documents', label: 'Documents' }` here. Existing entries show the exact format.
  - `src/components/ui/Navigation.tsx:80-82` — The desktop SplitButton wrapper `<div className="hidden md:block"><SplitButton /></div>`. Delete this entire block.
  - `src/components/ui/Navigation.tsx:148-202` — The mobile drawer Documents section with View/Download links for both CV and Thesis. Delete this entire `<div>` block (the one with `mt-4 pt-4 border-t`).
  - `src/components/ui/Navigation.tsx:6-7` — The SplitButton and pdfConfig imports. Remove both lines.

  **WHY Each Reference Matters**:
  - Lines 9-17: Shows exactly where and how to add the new nav link — follow the existing `{ href, label }` pattern
  - Lines 80-82: The SplitButton must be completely removed — if the import is gone but JSX remains, build will fail
  - Lines 148-202: The entire Documents subsection in mobile drawer is replaced by the automatic rendering from navLinks
  - Lines 6-7: Unused imports cause build warnings/errors

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Navigation updated correctly
    Tool: Bash (grep)
    Steps:
      1. Verify Navigation.tsx does NOT contain 'SplitButton'
      2. Verify Navigation.tsx does NOT contain 'CV_PDF_PATH' or 'THESIS_PDF_PATH'
      3. Verify Navigation.tsx contains "href: '/documents'"
      4. Verify Navigation.tsx does NOT contain 'Download CV' or 'Download Thesis'
      5. Verify Navigation.tsx does NOT contain 'View CV' or 'View Thesis'
      6. Run `npx tsc --noEmit` — no type errors
    Expected Result: Clean navigation with single Documents link
    Evidence: .sisyphus/evidence/task-5-nav-update.txt
  ```

  **Commit**: NO (groups with final commit)

---

## Final Verification Wave

- [ ] F1. **Build + Visual QA**

  **What to do**:
  - Run `npm run build` and verify zero errors
  - Run `npm run dev` and use Playwright to verify:
    - `/documents` loads with CV visible by default
    - Segmented control shows "CV" as active
    - Clicking "Thesis" switches the PDF viewer to thesis
    - Clicking "CV" switches back
    - Desktop nav shows "Documents" link (no SplitButton)
    - Mobile nav (resize viewport) shows "Documents" link
    - Footer is NOT visible on `/documents`
    - Footer IS visible on other pages (e.g., `/`)
    - `/cv` returns 404
    - `/thesis` returns 404

  **Recommended Agent Profile**:
  - **Category**: `quick`
  - **Skills**: [`playwright`]
    - `playwright`: Needed for browser-based visual verification of toggle, navigation, and layout

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave FINAL (solo)
  - **Blocks**: None (final task)
  - **Blocked By**: Tasks 3, 4, 5

  **References**:
  - All files created/modified in Tasks 1–5

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Documents page loads with CV by default
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000/documents
      2. Assert page title contains "Documents"
      3. Assert segmented control exists with two options: "CV" and "Thesis"
      4. Assert "CV" option has active/filled styling
      5. Assert iframe src contains "Curriculum%20Vitae.pdf"
      6. Take screenshot
    Expected Result: CV PDF is visible, "CV" tab is active
    Evidence: .sisyphus/evidence/task-F1-default-cv.png

  Scenario: Toggle to Thesis and back
    Tool: Playwright
    Preconditions: On /documents page
    Steps:
      1. Click the "Thesis" segment
      2. Assert "Thesis" option now has active styling
      3. Assert "CV" option no longer has active styling
      4. Assert iframe src contains "MS%20Thesis.pdf"
      5. Take screenshot
      6. Click the "CV" segment
      7. Assert iframe src contains "Curriculum%20Vitae.pdf"
    Expected Result: PDF switches correctly on each toggle click
    Evidence: .sisyphus/evidence/task-F1-toggle-thesis.png

  Scenario: Nav shows Documents link, no SplitButton
    Tool: Playwright
    Preconditions: On any page, desktop viewport (1280px wide)
    Steps:
      1. Navigate to http://localhost:3000/
      2. Assert nav contains link with text "Documents" and href="/documents"
      3. Assert no element with text "View CV" or "View Thesis" in nav
      4. Click "Documents" link
      5. Assert URL is /documents
    Expected Result: Single Documents link in nav, no split button
    Evidence: .sisyphus/evidence/task-F1-nav-desktop.png

  Scenario: Mobile nav shows Documents link
    Tool: Playwright
    Preconditions: Viewport set to 375px width (mobile)
    Steps:
      1. Navigate to http://localhost:3000/
      2. Click hamburger menu button
      3. Assert mobile drawer contains "Documents" link
      4. Assert no "View CV", "View Thesis", "Download CV", "Download Thesis" links
      5. Take screenshot
    Expected Result: Clean mobile drawer with single Documents link
    Evidence: .sisyphus/evidence/task-F1-nav-mobile.png

  Scenario: Footer hidden on /documents, visible elsewhere
    Tool: Playwright
    Preconditions: Dev server running
    Steps:
      1. Navigate to /documents
      2. Assert footer element is NOT in the DOM
      3. Navigate to /
      4. Assert footer element IS in the DOM
    Expected Result: ConditionalFooter correctly hides on /documents
    Evidence: .sisyphus/evidence/task-F1-footer.png

  Scenario: Old routes return 404
    Tool: Playwright
    Steps:
      1. Navigate to /cv — assert 404 page
      2. Navigate to /thesis — assert 404 page
    Expected Result: Both old routes are gone
    Evidence: .sisyphus/evidence/task-F1-old-routes-404.png

  Scenario: Build passes
    Tool: Bash
    Steps:
      1. Run `npm run build`
      2. Assert exit code 0
      3. Assert no TypeScript errors in output
    Expected Result: Clean build with zero errors
    Evidence: .sisyphus/evidence/task-F1-build.txt
  ```

  **Commit**: NO (verification only — no file changes)

---

## Commit Strategy

| After Task(s) | Message | Files |
|---|---|---|
| 1, 2, 3, 4, 5 | `refactor(documents): consolidate CV and thesis into single page with segmented control` | All changed/created/deleted files |

> Single commit after all tasks — this is a cohesive refactor that should be atomic.

---

## Success Criteria

### Verification Commands
```bash
npm run build  # Expected: exit 0, no errors
```

### Final Checklist
- [ ] `/documents` loads CV by default
- [ ] Segmented control toggles between CV and Thesis
- [ ] Segmented control uses site's accent color theme
- [ ] Nav shows single "Documents" link (desktop + mobile)
- [ ] No SplitButton anywhere
- [ ] Footer hidden on `/documents`
- [ ] `/cv` and `/thesis` are 404
- [ ] `npm run build` passes
- [ ] No new dependencies added
