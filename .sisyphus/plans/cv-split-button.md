# CV & Thesis Split Button + PDF.js Viewer

## TL;DR

> **Quick Summary**: Replace the existing "Download CV" links across the site with a split button offering "View CV" (primary) plus a dropdown with Download CV, View Thesis, and Download Thesis. Add two new routes (`/cv` and `/thesis`) that render PDFs inline using PDF.js.
> 
> **Deliverables**:
> - `SplitButton` UI component (reusable, with dropdown, click-outside, keyboard nav)
> - `PdfViewer` component wrapping PDF.js for full-page PDF rendering
> - `/cv` route page rendering `Curriculum Vitae.pdf` via PDF.js
> - `/thesis` route page rendering `MS Thesis.pdf` via PDF.js
> - Updated Navigation.tsx (desktop split button + mobile stacked links)
> - Updated Hero.tsx CTA section with split button
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: Task 1 (install) → Task 2 (PdfViewer) → Tasks 4+5 (routes) → Task 7 (build verify)

---

## Context

### Original Request
Add a split button to the site that lets visitors view the CV using PDF.js or download it. Also include view/download options for the Master's Thesis in the dropdown.

### Interview Summary
**Key Discussions**:
- **View behavior**: New dedicated routes (`/cv` and `/thesis`) with embedded PDF.js viewer — not a modal overlay
- **Placement**: Split button replaces CV links in BOTH Navigation (desktop + mobile) and Hero CTA
- **Primary action**: "View CV" is the prominent button; dropdown contains Download CV, View Thesis, Download Thesis
- **Thesis PDF source**: User will add thesis PDF to `public/` (currently only an external ScholarWorks link exists)
- **Mobile strategy**: In the mobile nav drawer, use separate stacked links instead of a nested dropdown

**Research Findings**:
- Site is a **Next.js 16 static export** deployed to GitHub Pages with `basePath: '/steven'` in production
- PDF is at `public/Curriculum Vitae.pdf` — filename has a space (requires URL encoding)
- Three existing CV download locations: Nav desktop (line 78-88), Nav mobile (lines 154-166), Hero CTA (lines 199-206)
- All existing PDF links use plain `<a>` tags (not `<Link>`), which do NOT get `basePath` auto-prepended — this is a potential production bug that must be verified and fixed
- The Hero CTA div has a GSAP entrance animation via `ctaRef` — any replacement inside that div inherits the animation automatically
- No dropdown/popover pattern exists anywhere in the codebase — this is a new interaction pattern
- Styling convention: inline `style={{}}` with CSS custom properties for colors/theming; Tailwind for layout/spacing only
- Component convention: `'use client'` directive, named + default export, barrel exports in `src/components/ui/index.ts`

### Metis Review
**Identified Gaps** (addressed):
- **basePath bug on PDF URLs**: All `<a href="/Curriculum%20Vitae.pdf">` tags won't have basePath prepended in production. Fixed by using a basePath-aware URL helper.
- **PDF.js worker version mismatch risk**: Pinning exact `pdfjs-dist` version and using matching CDN worker URL.
- **Click-outside pattern missing**: Creating inline `useEffect` with ref-based click-outside detection in SplitButton.
- **Mobile PDF.js UX**: PDF.js canvas rendering is fine for reading; browser scroll handles navigation.
- **PDF load failure**: Adding error state with fallback download link.
- **Thesis PDF filename**: Defaulting to `MS Thesis.pdf` — user must add this file as prerequisite.

---

## Prerequisites (USER ACTION REQUIRED)

> **Before running `/start-work`, the user MUST:**
> 1. Add their Master's Thesis PDF to `public/MS Thesis.pdf`
>    - Filename must be exactly `MS Thesis.pdf` (Title Case, space — matches CV convention)
>    - If a different filename is preferred, update the `THESIS_PDF` constant in Task 2

---

## Work Objectives

### Core Objective
Replace all "Download CV" links with a split button component that provides inline PDF viewing (via PDF.js) and download for both the Curriculum Vitae and Master's Thesis.

### Concrete Deliverables
- `src/components/ui/SplitButton.tsx` — Split button with dropdown
- `src/components/ui/PdfViewer.tsx` — PDF.js viewer component
- `src/app/cv/page.tsx` — CV viewer route
- `src/app/thesis/page.tsx` — Thesis viewer route
- Updated `src/components/ui/Navigation.tsx` — Desktop split button + mobile stacked links
- Updated `src/components/sections/Hero.tsx` — Split button replacing download link
- Updated `src/components/ui/index.ts` — Barrel exports

### Definition of Done
- [ ] `npm run build` exits with code 0 (static export succeeds)
- [ ] `out/cv/index.html` and `out/thesis/index.html` exist
- [ ] Split button visible in Navigation on desktop; stacked links visible on mobile
- [ ] Split button visible in Hero CTA section
- [ ] PDF renders via canvas elements on `/cv` and `/thesis` routes
- [ ] Download action triggers browser download (not navigation)
- [ ] All PDF URLs work with basePath `/steven` in production build
- [ ] `npm run lint` exits with code 0

### Must Have
- basePath-aware PDF URL helper (works in both dev and production)
- Click-outside-to-close for dropdown
- Escape key closes dropdown
- Error state with fallback download link when PDF.js fails to load
- Loading indicator while PDF renders
- Accessible: `aria-expanded`, `aria-haspopup`, keyboard navigable dropdown

### Must NOT Have (Guardrails)
- NO page navigation controls (page up/down, page number input) in PDF viewer — browser scroll suffices
- NO zoom controls in PDF viewer — browser native zoom suffices
- NO toolbar/chrome around PDF viewer beyond loading/error states
- NO new UI library installs (Radix, Headless UI, shadcn) — build inline
- NO modifications to the existing GSAP timeline in Hero.tsx
- NO separate `layout.tsx` for `/cv` or `/thesis` routes — use root layout
- NO renaming the CV PDF file
- NO new CSS custom properties or `@theme` additions — use existing design tokens only
- NO `useContext` or global state — component-local `useState` only
- NO generic/abstract SplitButton variants — build exactly what's needed for this use case
- NO print-from-viewer functionality
- NO download progress indicators

---

## Verification Strategy (MANDATORY)

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO
- **Automated tests**: None
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, interact, assert DOM, screenshot
- **Build/Config**: Use Bash — Run commands, assert exit codes and file existence

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Foundation — start immediately):
├── Task 1: Install pdfjs-dist + create basePath helper [quick]
├── Task 2: Create PdfViewer component [visual-engineering]
└── Task 3: Create SplitButton component [visual-engineering]

Wave 2 (Routes + Integration — after Wave 1):
├── Task 4: Create /cv route page (depends: 2) [quick]
├── Task 5: Create /thesis route page (depends: 2) [quick]
├── Task 6: Update Navigation.tsx with SplitButton (depends: 3) [visual-engineering]
└── Task 7: Update Hero.tsx with SplitButton (depends: 3) [visual-engineering]

Wave 3 (Verification — after Wave 2):
└── Task 8: Build verification + full QA (depends: 4, 5, 6, 7) [unspecified-high]

Wave FINAL (Independent review — after ALL tasks, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high)
└── Task F4: Scope fidelity check (deep)

Critical Path: Task 1 → Task 2 → Task 4/5 → Task 8 → F1-F4
Parallel Speedup: ~50% faster than sequential
Max Concurrent: 4 (Wave 2)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1 | — | 2, 3, 4, 5, 6, 7 | 1 |
| 2 | 1 | 4, 5 | 1 |
| 3 | 1 | 6, 7 | 1 |
| 4 | 2 | 8 | 2 |
| 5 | 2 | 8 | 2 |
| 6 | 3 | 8 | 2 |
| 7 | 3 | 8 | 2 |
| 8 | 4, 5, 6, 7 | F1-F4 | 3 |
| F1-F4 | 8 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **3 tasks** — T1 → `quick`, T2 → `visual-engineering`, T3 → `visual-engineering`
- **Wave 2**: **4 tasks** — T4 → `quick`, T5 → `quick`, T6 → `visual-engineering`, T7 → `visual-engineering`
- **Wave 3**: **1 task** — T8 → `unspecified-high`
- **Wave FINAL**: **4 tasks** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high`, F4 → `deep`

---

## TODOs


- [ ] 1. Install pdfjs-dist + Create basePath Helper

  **What to do**:
  - Run `npm install pdfjs-dist` and pin to latest stable 4.x version
  - Create `src/lib/pdfConfig.ts` with:
    - A `getBasePath()` helper that returns `'/steven'` in production and `''` in development (mirror logic from `next.config.ts`)
    - Constants: `CV_PDF_PATH` and `THESIS_PDF_PATH` using getBasePath() + URL-encoded filenames
    - PDF.js worker setup: set `GlobalWorkerOptions.workerSrc` to matching CDN URL for the pinned pdfjs-dist version (e.g., `//unpkg.com/pdfjs-dist@4.x.x/build/pdf.worker.min.mjs`)
  - Export all from `src/lib/index.ts` barrel

  **Must NOT do**:
  - Do NOT install any UI library (Radix, Headless UI, etc.)
  - Do NOT add new CSS custom properties to globals.css
  - Do NOT hardcode the basePath string — derive it from environment

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single dependency install + small utility file creation
  - **Skills**: [`coding-standards`]
    - `coding-standards`: Ensures TypeScript best practices for the utility module
  - **Skills Evaluated but Omitted**:
    - `vercel-react-best-practices`: Not relevant — this is a utility module, not React component optimization

  **Parallelization**:
  - **Can Run In Parallel**: NO (foundation for all other tasks)
  - **Parallel Group**: Wave 1 — starts first, Tasks 2+3 start after
  - **Blocks**: Tasks 2, 3, 4, 5, 6, 7
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/lib/gsapConfig.ts` — Existing lib module pattern (import, configure, re-export)
  - `src/lib/index.ts` — Barrel export pattern to follow
  - `next.config.ts:4-9` — `isProd` logic and `basePath`/`assetPrefix` values to mirror

  **API/Type References**:
  - `pdfjs-dist` package — `GlobalWorkerOptions.workerSrc` property for worker setup

  **External References**:
  - PDF.js docs: https://mozilla.github.io/pdf.js/getting_started/

  **WHY Each Reference Matters**:
  - `next.config.ts` — The basePath logic MUST match exactly. Copy the `isProd` check pattern.
  - `src/lib/gsapConfig.ts` — Shows how this project structures library configuration modules
  - `src/lib/index.ts` — New exports must be added here for barrel import consistency

  **Acceptance Criteria**:
  - [ ] `pdfjs-dist` appears in `package.json` dependencies with pinned 4.x version
  - [ ] `src/lib/pdfConfig.ts` exists with `getBasePath()`, `CV_PDF_PATH`, `THESIS_PDF_PATH`, worker setup
  - [ ] `src/lib/index.ts` re-exports from pdfConfig
  - [ ] `npm run lint` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: pdfjs-dist installed and importable
    Tool: Bash
    Preconditions: npm install completed
    Steps:
      1. Run: node -e "require('pdfjs-dist'); console.log('OK')"
      2. Check exit code is 0
    Expected Result: Prints 'OK', exit code 0
    Failure Indicators: Module not found error, non-zero exit code
    Evidence: .sisyphus/evidence/task-1-pdfjs-installed.txt

  Scenario: basePath helper returns correct values
    Tool: Bash
    Preconditions: src/lib/pdfConfig.ts exists
    Steps:
      1. Run: npx tsx -e "import { CV_PDF_PATH, THESIS_PDF_PATH } from './src/lib/pdfConfig'; console.log(CV_PDF_PATH); console.log(THESIS_PDF_PATH)"
      2. Assert output contains 'Curriculum%20Vitae.pdf' and 'MS%20Thesis.pdf'
    Expected Result: Both paths printed without error
    Failure Indicators: Import error, undefined values
    Evidence: .sisyphus/evidence/task-1-basepath-helper.txt
  ```

  **Commit**: YES (group with Wave 1)
  - Message: `feat(ui): add SplitButton and PdfViewer components with pdfjs-dist`
  - Files: `package.json`, `package-lock.json`, `src/lib/pdfConfig.ts`, `src/lib/index.ts`
  - Pre-commit: `npm run lint`

---

- [ ] 2. Create PdfViewer Component

  **What to do**:
  - Create `src/components/ui/PdfViewer.tsx` as a `'use client'` component that:
    - Accepts props: `pdfUrl: string` (basePath-aware URL), `title: string` (for labeling), `downloadUrl: string`
    - Uses `pdfjs-dist` to load the PDF and render ALL pages into `<canvas>` elements
    - Shows a loading state: centered pulsing text ("Loading document...") using `--color-text-muted`
    - Shows an error state: message + fallback download link ("Unable to load viewer. Download the PDF instead.")
    - Renders pages stacked vertically with gap, scrollable via browser scroll
    - Each canvas fills container width; height scales proportionally to maintain aspect ratio
    - Uses inline `style={{}}` with CSS custom properties for theming (match codebase convention)
    - Sticky header bar at top: document title on left, "Download" link on right
  - Add `PdfViewer` to `src/components/ui/index.ts` barrel exports

  **Must NOT do**:
  - NO page navigation controls (page number, prev/next buttons)
  - NO zoom controls — browser native zoom only
  - NO toolbar beyond the minimal sticky header (title + download)
  - NO print button or thumbnail sidebar

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI component with canvas rendering, loading/error states, responsive layout
  - **Skills**: [`coding-standards`]
    - `coding-standards`: TypeScript patterns and component structure

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 3, after Task 1)
  - **Parallel Group**: Wave 1 (with Tasks 1, 3)
  - **Blocks**: Tasks 4, 5
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/ui/Navigation.tsx:1-5` — `'use client'`, import structure, named + default export pattern
  - `src/components/ui/Navigation.tsx:82-87` — Inline `style={{}}` with CSS custom properties pattern
  - `src/components/ui/index.ts` — Barrel export file to update
  - `src/components/ui/PixelTransition.tsx` — Component using refs and canvas-like rendering

  **API/Type References**:
  - `src/lib/pdfConfig.ts` (from Task 1) — `CV_PDF_PATH`, `THESIS_PDF_PATH` constants, worker setup

  **External References**:
  - PDF.js API: `pdfjs-dist` — `getDocument(url)`, `PDFDocumentProxy.getPage(n)`, `page.getViewport()`, `page.render()`
  - PDF.js rendering guide: https://mozilla.github.io/pdf.js/examples/

  **WHY Each Reference Matters**:
  - `Navigation.tsx` — Follow exact same component structure and styling convention
  - `PixelTransition.tsx` — Shows how this codebase handles ref-based rendering (useful for canvas work)
  - `pdfConfig.ts` — Import the worker setup and path constants from here

  **Acceptance Criteria**:
  - [ ] `src/components/ui/PdfViewer.tsx` exists as a `'use client'` component
  - [ ] Component accepts `pdfUrl`, `title`, and `downloadUrl` props
  - [ ] Loading state renders while PDF loads
  - [ ] Error state renders with fallback download link if PDF fails
  - [ ] All PDF pages render as canvas elements
  - [ ] Sticky header shows title and download link
  - [ ] Added to `src/components/ui/index.ts`
  - [ ] `npm run lint` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: PdfViewer renders CV pages as canvases
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Curriculum Vitae.pdf in public/
    Steps:
      1. Navigate to /cv route
      2. Wait for canvas: await page.locator('canvas').first().waitFor({ timeout: 15000 })
      3. Count canvases: const count = await page.locator('canvas').count()
      4. Assert count >= 1
      5. Screenshot the viewport
    Expected Result: At least 1 canvas element visible, PDF content rendered
    Failure Indicators: Zero canvases, 0x0 dimensions, error message visible
    Evidence: .sisyphus/evidence/task-2-pdf-renders.png

  Scenario: PdfViewer shows error state on invalid PDF URL
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to a test page rendering PdfViewer with pdfUrl='/nonexistent.pdf'
      2. Wait for error: await page.locator('text=Unable to load').waitFor({ timeout: 10000 })
      3. Assert download fallback: await expect(page.locator('a[download]')).toBeVisible()
      4. Screenshot
    Expected Result: Error message with download link fallback
    Failure Indicators: Infinite spinner, blank page, no download link
    Evidence: .sisyphus/evidence/task-2-pdf-error-state.png
  ```

  **Commit**: YES (group with Wave 1)
  - Message: `feat(ui): add SplitButton and PdfViewer components with pdfjs-dist`
  - Files: `src/components/ui/PdfViewer.tsx`, `src/components/ui/index.ts`
  - Pre-commit: `npm run lint`

---

- [ ] 3. Create SplitButton Component

  **What to do**:
  - Create `src/components/ui/SplitButton.tsx` as a `'use client'` component that:
    - Renders a split button: primary button ("View CV") on left + chevron/arrow dropdown toggle on right
    - Primary button is a Next.js `Link` navigating to `/cv`
    - Dropdown toggle opens a menu with three items:
      - "Download CV" — `<a>` tag with `download` attribute pointing to CV_PDF_PATH
      - "View Thesis" — Next.js `Link` navigating to `/thesis`
      - "Download Thesis" — `<a>` tag with `download` attribute pointing to THESIS_PDF_PATH
    - Dropdown has a visual separator between CV and Thesis sections
    - Click-outside-to-close: `useEffect` with `mousedown` event listener, ref containment check
    - Escape key closes dropdown
    - Keyboard accessible: `aria-expanded`, `aria-haspopup="menu"`, `role="menu"` on dropdown, `role="menuitem"` on items
    - Dropdown positioned below the button, aligned to the right edge
    - Styled with inline `style={{}}` + CSS custom properties (accent border, surface bg for dropdown)
    - Subtle entry animation on dropdown (opacity + translateY, CSS transition — no GSAP)
    - Import `CV_PDF_PATH` and `THESIS_PDF_PATH` from `src/lib/pdfConfig`
  - Add `SplitButton` to `src/components/ui/index.ts` barrel exports

  **Must NOT do**:
  - NO UI library (Radix, Headless UI, shadcn)
  - NO global state or context — component-local useState only
  - NO generic/abstract variant system — hardcode for CV/Thesis use case
  - NO framer-motion or GSAP for dropdown animation — CSS transitions only

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Interactive UI component with dropdown, keyboard nav, accessibility, animations
  - **Skills**: [`coding-standards`]
    - `coding-standards`: TypeScript patterns, accessibility best practices

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 2, after Task 1)
  - **Parallel Group**: Wave 1 (with Tasks 1, 2)
  - **Blocks**: Tasks 6, 7
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/ui/Navigation.tsx:78-88` — Existing desktop CV button styling (border, accent color, sizing)
  - `src/components/ui/Navigation.tsx:91-122` — Hamburger button with aria-label, aria-expanded pattern
  - `src/components/ui/Navigation.tsx:22-28` — Escape key handler pattern (copy this for dropdown close)
  - `src/components/sections/Hero.tsx:185-206` — CTA button styling (accent bg, rounded, font-semibold)

  **API/Type References**:
  - `src/lib/pdfConfig.ts` (from Task 1) — `CV_PDF_PATH`, `THESIS_PDF_PATH`

  **WHY Each Reference Matters**:
  - `Navigation.tsx:78-88` — Match the exact styling of the current CV button so the split button feels native
  - `Navigation.tsx:91-122` — Copy aria patterns for the dropdown toggle button
  - `Navigation.tsx:22-28` — Reuse the Escape key listener pattern
  - `Hero.tsx:185-206` — The primary button styling should match the existing CTA buttons

  **Acceptance Criteria**:
  - [ ] `src/components/ui/SplitButton.tsx` exists as a `'use client'` component
  - [ ] Primary button ("View CV") renders as a Link to /cv
  - [ ] Chevron button toggles dropdown open/closed
  - [ ] Dropdown contains: Download CV, View Thesis, Download Thesis
  - [ ] Click outside closes dropdown
  - [ ] Escape key closes dropdown
  - [ ] aria-expanded, aria-haspopup, role attributes present
  - [ ] Added to `src/components/ui/index.ts`
  - [ ] `npm run lint` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: SplitButton renders with primary action and dropdown toggle
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, SplitButton rendered on page
    Steps:
      1. Navigate to homepage
      2. Locate primary button: await page.locator('a:has-text("View CV")').first()
      3. Assert primary button visible
      4. Locate dropdown toggle: await page.locator('button[aria-haspopup="menu"]').first()
      5. Assert toggle visible
      6. Screenshot
    Expected Result: Split button visible with "View CV" text and dropdown chevron
    Failure Indicators: Missing button, missing toggle, no text
    Evidence: .sisyphus/evidence/task-3-splitbutton-renders.png

  Scenario: Dropdown opens and shows all menu items
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Click dropdown toggle: await page.locator('button[aria-haspopup="menu"]').first().click()
      2. Assert dropdown visible: await expect(page.locator('[role="menu"]')).toBeVisible()
      3. Assert "Download CV" menuitem exists
      4. Assert "View Thesis" menuitem exists
      5. Assert "Download Thesis" menuitem exists
      6. Screenshot
    Expected Result: Dropdown open with all 3 items visible
    Failure Indicators: Dropdown missing, items missing, wrong text
    Evidence: .sisyphus/evidence/task-3-dropdown-open.png

  Scenario: Dropdown closes on Escape key
    Tool: Playwright (playwright skill)
    Preconditions: Dropdown is open
    Steps:
      1. Open dropdown by clicking toggle
      2. Press Escape: await page.keyboard.press('Escape')
      3. Assert dropdown hidden: await expect(page.locator('[role="menu"]')).not.toBeVisible()
    Expected Result: Dropdown closes
    Failure Indicators: Dropdown remains visible after Escape
    Evidence: .sisyphus/evidence/task-3-escape-closes.png

  Scenario: Dropdown closes on click outside
    Tool: Playwright (playwright skill)
    Preconditions: Dropdown is open
    Steps:
      1. Open dropdown by clicking toggle
      2. Click outside: await page.locator('body').click({ position: { x: 10, y: 10 } })
      3. Assert dropdown hidden
    Expected Result: Dropdown closes on outside click
    Failure Indicators: Dropdown remains visible
    Evidence: .sisyphus/evidence/task-3-click-outside.png
  ```

  **Commit**: YES (group with Wave 1)
  - Message: `feat(ui): add SplitButton and PdfViewer components with pdfjs-dist`
  - Files: `src/components/ui/SplitButton.tsx`, `src/components/ui/index.ts`
  - Pre-commit: `npm run lint`

---

- [ ] 4. Create /cv Route Page

  **What to do**:
  - Create `src/app/cv/page.tsx` following the existing route pattern:
    - Export `metadata` with title: "Curriculum Vitae | Steven Huff" and appropriate description
    - Default export function rendering `PdfViewer` with:
      - `pdfUrl={CV_PDF_PATH}` from pdfConfig
      - `title="Curriculum Vitae"`
      - `downloadUrl={CV_PDF_PATH}`
    - Wrap in a container matching other page layouts (max-width, padding)
  - Import `CV_PDF_PATH` from `@/lib/pdfConfig` and `PdfViewer` from `@/components/ui`

  **Must NOT do**:
  - NO separate layout.tsx for this route — use root layout
  - NO additional UI chrome beyond what PdfViewer provides

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Small page file, mostly imports and props passing
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 5, 6, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 8
  - **Blocked By**: Task 2 (PdfViewer component)

  **References**:

  **Pattern References**:
  - `src/app/experience/page.tsx` — Canonical page file pattern (metadata export + default function)
  - `src/app/education/page.tsx` — Another page example to match structure

  **API/Type References**:
  - `src/components/ui/PdfViewer.tsx` (from Task 2) — PdfViewer props interface
  - `src/lib/pdfConfig.ts` (from Task 1) — CV_PDF_PATH constant

  **WHY Each Reference Matters**:
  - `experience/page.tsx` — Copy this exact structure: metadata export at top, default function below
  - `PdfViewer` — Pass the correct props matching the component interface

  **Acceptance Criteria**:
  - [ ] `src/app/cv/page.tsx` exists with metadata and PdfViewer
  - [ ] Route renders at `/cv` in dev server
  - [ ] PDF canvas elements appear on page load
  - [ ] Navigation header appears (root layout inherited)
  - [ ] `npm run lint` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: /cv route loads and renders PDF
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, Curriculum Vitae.pdf in public/
    Steps:
      1. Navigate to /cv
      2. Assert page title: await expect(page).toHaveTitle(/Curriculum Vitae/)
      3. Wait for canvas: await page.locator('canvas').first().waitFor({ timeout: 15000 })
      4. Assert navigation header visible: await expect(page.locator('nav')).toBeVisible()
      5. Screenshot full page
    Expected Result: PDF rendered, nav visible, correct title
    Failure Indicators: 404, no canvas, wrong title
    Evidence: .sisyphus/evidence/task-4-cv-route.png

  Scenario: /cv route 404s without crashing (build check)
    Tool: Bash
    Preconditions: Build completed
    Steps:
      1. Run: ls out/cv/index.html
      2. Assert file exists (exit code 0)
    Expected Result: Static HTML page generated for /cv
    Failure Indicators: File not found
    Evidence: .sisyphus/evidence/task-4-cv-build.txt
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(cv): add /cv and /thesis routes, integrate split button into nav and hero`
  - Files: `src/app/cv/page.tsx`
  - Pre-commit: `npm run lint`

- [ ] 5. Create /thesis Route Page

  **What to do**:
  - Create `src/app/thesis/page.tsx` following the same pattern as Task 4:
    - Export `metadata` with title: "Master's Thesis | Steven Huff" and description referencing the thesis title
    - Default export function rendering `PdfViewer` with:
      - `pdfUrl={THESIS_PDF_PATH}` from pdfConfig
      - `title="Master's Thesis"` (or the full thesis title if it fits)
      - `downloadUrl={THESIS_PDF_PATH}`
    - Same container layout as /cv page
  - Import `THESIS_PDF_PATH` from `@/lib/pdfConfig`

  **Must NOT do**:
  - NO separate layout.tsx for this route
  - NO additional UI beyond PdfViewer

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Nearly identical to Task 4 — copy pattern, change props
  - **Skills**: []

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Task 4, 6, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 8
  - **Blocked By**: Task 2 (PdfViewer component)

  **References**:

  **Pattern References**:
  - `src/app/cv/page.tsx` (from Task 4) — Identical structure, different props
  - `src/data/education.ts:57-63` — Thesis title, link, and summary for metadata

  **WHY Each Reference Matters**:
  - `cv/page.tsx` — Copy this file and swap CV for Thesis references
  - `education.ts` — Contains the canonical thesis title to use in metadata description

  **Acceptance Criteria**:
  - [ ] `src/app/thesis/page.tsx` exists with metadata and PdfViewer
  - [ ] Route renders at `/thesis` in dev server
  - [ ] PDF canvas elements appear on page load (requires MS Thesis.pdf in public/)
  - [ ] `npm run lint` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: /thesis route loads and renders PDF
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, MS Thesis.pdf in public/
    Steps:
      1. Navigate to /thesis
      2. Assert page title: await expect(page).toHaveTitle(/Thesis/i)
      3. Wait for canvas: await page.locator('canvas').first().waitFor({ timeout: 15000 })
      4. Assert navigation visible: await expect(page.locator('nav')).toBeVisible()
      5. Screenshot
    Expected Result: Thesis PDF rendered with correct title
    Failure Indicators: 404, no canvas, error state (if PDF missing)
    Evidence: .sisyphus/evidence/task-5-thesis-route.png

  Scenario: /thesis build output exists
    Tool: Bash
    Preconditions: Build completed
    Steps:
      1. Run: ls out/thesis/index.html
      2. Assert file exists
    Expected Result: Static HTML generated for /thesis
    Failure Indicators: File not found
    Evidence: .sisyphus/evidence/task-5-thesis-build.txt
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(cv): add /cv and /thesis routes, integrate split button into nav and hero`
  - Files: `src/app/thesis/page.tsx`
  - Pre-commit: `npm run lint`

---

- [ ] 6. Update Navigation.tsx with SplitButton

  **What to do**:
  - **Desktop**: Replace the existing `<a href="/Curriculum%20Vitae.pdf" download>` button (lines 78-88) with the `SplitButton` component
    - Import SplitButton from `@/components/ui`
    - Place it in the same position within the flex layout
    - Ensure it visually matches the navigation bar height and alignment
  - **Mobile drawer**: Replace the existing download link (lines 154-166) with TWO separate stacked links (NOT a SplitButton dropdown):
    - "View CV" — Link to /cv, styled like existing mobile nav links
    - "Download CV" — `<a>` with download attribute, styled like existing mobile nav links
    - "View Thesis" — Link to /thesis
    - "Download Thesis" — `<a>` with download attribute
    - Each link calls `setMobileOpen(false)` on click (match existing pattern)
    - Each link uses `tabIndex={mobileOpen ? 0 : -1}` (match existing pattern)
    - Group with a subtle label or separator between CV and Thesis items
  - Use basePath-aware URLs from `CV_PDF_PATH` and `THESIS_PDF_PATH` for all download hrefs

  **Must NOT do**:
  - Do NOT render SplitButton dropdown inside the mobile drawer (nested dropdown is bad UX)
  - Do NOT modify the hamburger button or desktop nav links
  - Do NOT change the Navigation layout structure

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: UI integration with existing layout, responsive considerations
  - **Skills**: [`coding-standards`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 7)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 8
  - **Blocked By**: Task 3 (SplitButton component)

  **References**:

  **Pattern References**:
  - `src/components/ui/Navigation.tsx:77-88` — Desktop CV button to REPLACE (exact location)
  - `src/components/ui/Navigation.tsx:154-166` — Mobile CV link to REPLACE (exact location)
  - `src/components/ui/Navigation.tsx:136-153` — Mobile nav link styling pattern (className, style, onClick, tabIndex)
  - `src/components/ui/Navigation.tsx:22-28` — Escape handler (already exists, no changes needed)

  **API/Type References**:
  - `src/components/ui/SplitButton.tsx` (from Task 3) — Component to import
  - `src/lib/pdfConfig.ts` (from Task 1) — CV_PDF_PATH, THESIS_PDF_PATH for mobile download links

  **WHY Each Reference Matters**:
  - Lines 77-88 — This is the EXACT code to remove and replace with SplitButton
  - Lines 154-166 — This is the EXACT code to remove and replace with stacked links
  - Lines 136-153 — Copy the className, style, onClick, tabIndex pattern for new mobile links

  **Acceptance Criteria**:
  - [ ] Desktop navigation shows SplitButton instead of old download button
  - [ ] Mobile drawer shows 4 stacked links (View CV, Download CV, View Thesis, Download Thesis)
  - [ ] Old `<a href="/Curriculum%20Vitae.pdf" download>` tags removed from Navigation
  - [ ] Mobile links call setMobileOpen(false) and use correct tabIndex
  - [ ] `npm run lint` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Desktop nav shows SplitButton
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, viewport >= 768px (md breakpoint)
    Steps:
      1. Set viewport: await page.setViewportSize({ width: 1280, height: 720 })
      2. Navigate to /
      3. Assert SplitButton visible in nav: await expect(page.locator('nav a:has-text("View CV")')).toBeVisible()
      4. Assert old download button gone: await expect(page.locator('nav a:has-text("Download CV")[download]')).not.toBeVisible()
      5. Screenshot of nav area
    Expected Result: SplitButton visible, old button gone
    Failure Indicators: Old download button still visible, SplitButton missing
    Evidence: .sisyphus/evidence/task-6-desktop-nav.png

  Scenario: Mobile drawer shows stacked document links
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running, viewport < 768px
    Steps:
      1. Set viewport: await page.setViewportSize({ width: 375, height: 812 })
      2. Navigate to /
      3. Open hamburger menu
      4. Assert "View CV" link visible in drawer
      5. Assert "Download CV" link visible in drawer
      6. Assert "View Thesis" link visible in drawer
      7. Assert "Download Thesis" link visible in drawer
      8. Click "View CV" — assert menu closes and navigates to /cv
      9. Screenshot
    Expected Result: 4 stacked links visible, clicking one closes drawer
    Failure Indicators: Old single download link still present, links missing
    Evidence: .sisyphus/evidence/task-6-mobile-drawer.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(cv): add /cv and /thesis routes, integrate split button into nav and hero`
  - Files: `src/components/ui/Navigation.tsx`
  - Pre-commit: `npm run lint`

- [ ] 7. Update Hero.tsx with SplitButton

  **What to do**:
  - Replace the existing `<a href="/Curriculum%20Vitae.pdf" download>` link (lines 199-206) with the `SplitButton` component
  - Import SplitButton from `@/components/ui`
  - Place it in the CTA div (ref={ctaRef}) alongside the existing "View My Work" and "See Projects" buttons
  - The SplitButton inherits the GSAP entrance animation from the ctaRef container — no animation changes needed
  - Ensure the SplitButton aligns visually with the other CTA buttons (flex row on sm+, centered)

  **Must NOT do**:
  - Do NOT modify the GSAP timeline in useGSAP
  - Do NOT change the ctaRef or other existing buttons
  - Do NOT add margin-top hack — remove the old `mt-4 sm:mt-0` class since SplitButton handles its own spacing

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual integration with existing CTA layout and animation
  - **Skills**: [`coding-standards`]

  **Parallelization**:
  - **Can Run In Parallel**: YES (with Tasks 4, 5, 6)
  - **Parallel Group**: Wave 2
  - **Blocks**: Task 8
  - **Blocked By**: Task 3 (SplitButton component)

  **References**:

  **Pattern References**:
  - `src/components/sections/Hero.tsx:184-207` — CTA div with all 3 buttons (EXACT location to modify)
  - `src/components/sections/Hero.tsx:199-206` — Download link to REPLACE
  - `src/components/sections/Hero.tsx:64-76` — GSAP timeline (DO NOT MODIFY, just understand ctaRef animation)
  - `src/components/sections/Hero.tsx:185-191` — "View My Work" button styling for visual consistency

  **WHY Each Reference Matters**:
  - Lines 199-206 — This is the EXACT `<a>` tag to remove and replace with SplitButton
  - Lines 185-191 — Match the visual weight and spacing of existing CTA buttons
  - Lines 64-76 — Understand that ctaRef animates the container, so SplitButton inherits animation for free

  **Acceptance Criteria**:
  - [ ] Hero CTA section shows SplitButton instead of old download link
  - [ ] Old `<a>` with `download` attribute removed
  - [ ] SplitButton aligns with "View My Work" and "See Projects" buttons
  - [ ] GSAP entrance animation still works for all CTA elements
  - [ ] `npm run lint` passes

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Hero shows SplitButton in CTA area
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to /
      2. Scroll to or locate the hero section
      3. Assert SplitButton visible: await expect(page.locator('section a:has-text("View CV")')).toBeVisible()
      4. Assert old download link gone: await expect(page.locator('section a:has-text("Download CV (PDF)")')).not.toBeVisible()
      5. Assert "View My Work" and "See Projects" buttons still present
      6. Screenshot of hero CTA area
    Expected Result: SplitButton replaces old link, other buttons unchanged
    Failure Indicators: Old link still present, SplitButton missing, other buttons affected
    Evidence: .sisyphus/evidence/task-7-hero-cta.png

  Scenario: Hero SplitButton dropdown works
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to /
      2. Click dropdown toggle in hero section
      3. Assert dropdown appears with Download CV, View Thesis, Download Thesis
      4. Click "View Thesis" — assert navigation to /thesis
    Expected Result: Dropdown opens in hero context, navigation works
    Failure Indicators: Dropdown clipped by hero overflow, items missing
    Evidence: .sisyphus/evidence/task-7-hero-dropdown.png
  ```

  **Commit**: YES (group with Wave 2)
  - Message: `feat(cv): add /cv and /thesis routes, integrate split button into nav and hero`
  - Files: `src/components/sections/Hero.tsx`
  - Pre-commit: `npm run lint`

- [ ] 8. Build Verification + Integration QA

  **What to do**:
  - Run `npm run build` and verify static export succeeds (exit code 0)
  - Verify output files exist: `out/cv/index.html`, `out/thesis/index.html`, `out/Curriculum Vitae.pdf`
  - Run `npm run lint` and verify passes
  - Run full integration QA with Playwright:
    - Complete user journey: homepage -> click View CV -> see PDF -> go back -> open dropdown -> click View Thesis -> see PDF
    - Download flow: homepage -> open dropdown -> click Download CV -> verify download triggers
    - Mobile flow: resize viewport to 375px -> open hamburger -> see stacked links -> click View CV -> PDF loads
  - Verify basePath handling: check that PDF URLs in the built output reference /steven/ prefix

  **Must NOT do**:
  - Do NOT modify any source files — this is verification only
  - Do NOT create new components or routes

  **Recommended Agent Profile**:
  - **Category**: `unspecified-high`
    - Reason: Build verification + comprehensive Playwright QA across multiple flows
  - **Skills**: [`playwright`, `coding-standards`]
    - `playwright`: Full browser automation for integration testing
    - `coding-standards`: Verify code quality standards met

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on all prior tasks)
  - **Parallel Group**: Wave 3 (solo)
  - **Blocks**: F1-F4
  - **Blocked By**: Tasks 4, 5, 6, 7

  **References**:
  - All files from Tasks 1-7
  - `next.config.ts:7-9` — basePath and assetPrefix to verify in build output

  **Acceptance Criteria**:
  - [ ] `npm run build` exits with code 0
  - [ ] `npm run lint` exits with code 0
  - [ ] `out/cv/index.html` exists
  - [ ] `out/thesis/index.html` exists
  - [ ] All integration QA scenarios pass
  - [ ] Evidence screenshots captured for all scenarios

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Full build succeeds
    Tool: Bash
    Preconditions: All tasks 1-7 complete
    Steps:
      1. Run: npm run build
      2. Assert exit code 0
      3. Run: ls out/cv/index.html
      4. Run: ls out/thesis/index.html
      5. Assert both exist
    Expected Result: Build succeeds, both route pages exist in output
    Failure Indicators: Build errors, missing output files
    Evidence: .sisyphus/evidence/task-8-build-output.txt

  Scenario: Complete user journey — View CV
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to /
      2. Click "View CV" primary button in nav
      3. Assert URL is /cv
      4. Wait for canvas: await page.locator('canvas').first().waitFor({ timeout: 15000 })
      5. Assert at least 1 canvas visible
      6. Screenshot
    Expected Result: Full navigation from home to CV viewer works
    Failure Indicators: Wrong URL, no canvas, 404
    Evidence: .sisyphus/evidence/task-8-journey-view-cv.png

  Scenario: Complete user journey — Download CV from dropdown
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Navigate to /
      2. Click dropdown toggle in nav SplitButton
      3. Click "Download CV" from dropdown
      4. Assert download event fires: const [download] = await Promise.all([page.waitForEvent('download'), ...])
      5. Assert filename contains 'Curriculum Vitae'
    Expected Result: PDF download triggers with correct filename
    Failure Indicators: No download event, wrong filename, navigation instead of download
    Evidence: .sisyphus/evidence/task-8-download-cv.txt

  Scenario: Mobile flow — stacked links work
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running
    Steps:
      1. Set viewport: await page.setViewportSize({ width: 375, height: 812 })
      2. Navigate to /
      3. Click hamburger to open drawer
      4. Assert 4 document links visible (View CV, Download CV, View Thesis, Download Thesis)
      5. Click "View CV"
      6. Assert drawer closes and page navigates to /cv
      7. Wait for canvas
      8. Screenshot
    Expected Result: Mobile drawer links work, PDF loads after navigation
    Failure Indicators: Links missing in drawer, drawer doesn't close, no PDF
    Evidence: .sisyphus/evidence/task-8-mobile-flow.png

  Scenario: Lint check passes
    Tool: Bash
    Preconditions: All source changes complete
    Steps:
      1. Run: npm run lint
      2. Assert exit code 0
    Expected Result: No lint errors or warnings
    Failure Indicators: Non-zero exit code, lint errors
    Evidence: .sisyphus/evidence/task-8-lint.txt
  ```

  **Commit**: YES (only if fixes were needed during verification)
  - Message: `fix: address build/lint issues from integration`
  - Files: any files fixed
  - Pre-commit: `npm run build && npm run lint`

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, curl endpoint, run command). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `npm run lint`. Review all changed/new files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify inline `style={{}}` with CSS custom properties pattern is followed (not hardcoded hex colors).
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start from clean state. Execute EVERY QA scenario from EVERY task — follow exact steps, capture evidence. Test cross-task integration (SplitButton in Nav opens dropdown, clicking "View CV" navigates to /cv which renders PDF). Test edge cases: dropdown keyboard navigation, Escape key, click-outside. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Detect cross-task contamination: Task N touching Task M's files. Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **After Wave 1**: `feat(ui): add SplitButton and PdfViewer components with pdfjs-dist` — SplitButton.tsx, PdfViewer.tsx, package.json, package-lock.json, index.ts, basePath helper
- **After Wave 2**: `feat(cv): add /cv and /thesis routes, integrate split button into nav and hero` — cv/page.tsx, thesis/page.tsx, Navigation.tsx, Hero.tsx
- **After Wave 3**: `chore: verify build and QA evidence` — only if fixes were needed

---

## Success Criteria

### Verification Commands
```bash
npm run build          # Expected: exit code 0, no errors
npm run lint           # Expected: exit code 0
ls out/cv/index.html   # Expected: file exists
ls out/thesis/index.html  # Expected: file exists
ls "out/Curriculum Vitae.pdf"  # Expected: file exists
ls "out/MS Thesis.pdf"    # Expected: file exists
```

### Final Checklist
- [ ] All "Must Have" items present and verified
- [ ] All "Must NOT Have" items absent (searched codebase)
- [ ] Both `/cv` and `/thesis` routes render PDF via canvas
- [ ] SplitButton visible and functional in Navigation (desktop)
- [ ] Stacked links visible in Navigation (mobile drawer)
- [ ] SplitButton visible and functional in Hero CTA
- [ ] All PDF URLs include basePath in production build
- [ ] Build succeeds as static export
- [ ] Lint passes
