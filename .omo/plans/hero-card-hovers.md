# Hero Stat Card Hover Content Update

## TL;DR

> **Quick Summary**: Update the hover (flip-side) content of 4 out of 5 hero stat cards on the home page so each card's links reflect the user's actual top content rather than generic placeholders.
> 
> **Deliverables**:
> - Updated `statCards` array in `src/components/sections/Hero.tsx`
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO — single task
> **Critical Path**: Task 1

---

## Context

### Original Request
The five PixelTransition stat cards on the home page flip on hover to reveal navigation links. Four of them need their hover links updated:
- **20+ Courses** — show top 4 classes instead of "Browse Catalog"
- **$300K Grant** — link to accomplishments section instead of education page
- **10+ Tools** — show rāSHio, O.G.R.E, and bookSHelf specifically
- **35+ Skills** — match the actual section IDs on the skills page (current links point to non-existent anchors)

### Research Findings
- The `statCards` array at line 10 of `Hero.tsx` defines all five cards as `{ value, label, links[] }` objects.
- Each `links` entry is `{ title: string, href: string }` rendered as Next.js `<Link>` components inside a `PixelTransition` `secondContent`.
- The 10+ Years Teaching card (index 0) is already correct — no changes needed.
- The skills page has sections: `section-languages`, `section-software`, `section-systems`, `section-hardware`. The current 35+ Skills card links to `section-lms` and `section-teaching` which **do not exist** — these are broken links.
- The projects page has `section-tools` and `section-achievements` — tools are listed as expandable cards, achievements include the $300K grant.

---

## Work Objectives

### Core Objective
Fix the hover content on 4 hero stat cards so they show relevant, working links.

### Concrete Deliverables
- Modified `statCards` array in `src/components/sections/Hero.tsx` (lines 10–53)

### Definition of Done
- [ ] All 5 hero cards flip on hover and show the correct links
- [ ] No broken anchor links (all `#section-*` targets exist on destination pages)

### Must Have
- 20+ card shows: Intro to Statistics, Calculus I, Intro to Programming, Finite Math
- $300K card links to the accomplishments/grant section on projects page
- 10+ Tools card shows: rāSHio, O.G.R.E, bookSHelf
- 35+ Skills card shows: Languages, Software, Systems, Hardware (matching actual page sections)

### Must NOT Have (Guardrails)
- Do NOT change the front-face content (values/labels) of any card
- Do NOT modify the PixelTransition component or its styling
- Do NOT change the "10+ Years Teaching" card (index 0) — it's already correct
- Do NOT add new components, files, or dependencies

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed.

### Test Decision
- **Infrastructure exists**: YES (Next.js build)
- **Automated tests**: None needed — data-only change, no logic
- **Framework**: N/A

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate, hover cards, verify link text + href, screenshot

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Single task):
└── Task 1: Update statCards hover links [quick]

Wave FINAL:
└── Task F1: Visual QA of all 5 hover cards [quick]
```

### Dependency Matrix
- **1**: None — can start immediately
- **F1**: Depends on Task 1

### Agent Dispatch Summary
- **Wave 1**: 1 task — T1 → `quick`
- **FINAL**: 1 task — F1 → `quick` + `playwright` skill

---

## TODOs

- [ ] 1. Update statCards hover links in Hero.tsx

  **What to do**:
  Replace the `links` arrays for stat cards at indices 1–4 in the `statCards` array (lines 20–52 of `src/components/sections/Hero.tsx`):

  **Card index 1 — "20+ Courses Taught"** (lines 20–26):
  Replace current links with:
  ```ts
  links: [
    { title: 'Intro to Statistics', href: '/experience?view=catalog' },
    { title: 'Calculus I', href: '/experience?view=catalog' },
    { title: 'Intro to Programming', href: '/experience?view=catalog' },
    { title: 'Finite Math', href: '/experience?view=catalog' },
  ],
  ```

  **Card index 2 — "$300K Grant Awarded"** (lines 27–35):
  Replace current links with:
  ```ts
  links: [
    { title: 'Golden State Pathways Grant', href: '/projects#section-achievements' },
  ],
  ```

  **Card index 3 — "10+ Tools Built"** (lines 36–43):
  Replace current links with:
  ```ts
  links: [
    { title: 'rāSHio', href: '/projects#section-tools' },
    { title: 'O.G.R.E', href: '/projects#section-tools' },
    { title: 'bookSHelf', href: '/projects#section-tools' },
  ],
  ```

  **Card index 4 — "35+ Skills"** (lines 44–52):
  Replace current links with:
  ```ts
  links: [
    { title: 'Languages', href: '/skills#section-languages' },
    { title: 'Software', href: '/skills#section-software' },
    { title: 'Systems', href: '/skills#section-systems' },
    { title: 'Hardware', href: '/skills#section-hardware' },
  ],
  ```

  **Must NOT do**:
  - Do not change card values, labels, or the first card (index 0)
  - Do not modify any component logic, styling, or imports

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file data modification, no logic changes
  - **Skills**: `[]`
    - No special skills needed — straightforward array edit
  - **Skills Evaluated but Omitted**:
    - `visual-engineering`: Not needed — no UI/styling changes
    - `playwright`: Not needed for implementation, only for QA

  **Parallelization**:
  - **Can Run In Parallel**: NO (single task)
  - **Parallel Group**: Wave 1
  - **Blocks**: F1
  - **Blocked By**: None

  **References**:

  **Pattern References**:
  - `src/components/sections/Hero.tsx:10-53` — The `statCards` array to modify. Each card is `{ value, label, links[] }`. Links are rendered as `<Link>` in the `secondContent` of `PixelTransition`.

  **API/Type References**:
  - `src/components/sections/Hero.tsx:165-173` — How `stat.links` is rendered: each `{ title, href }` becomes a `<Link>` with the title as display text.

  **Target Anchor References** (verify these exist on destination pages):
  - `src/components/sections/ProjectGrid.tsx:314` — `id="section-tools"` exists
  - `src/components/sections/ProjectGrid.tsx:339` — `id="section-achievements"` exists
  - `src/components/sections/SkillsView.tsx:310` — `id="section-languages"` exists
  - `src/components/sections/SkillsView.tsx:317` — `id="section-software"` exists
  - `src/components/sections/SkillsView.tsx:324` — `id="section-systems"` exists
  - `src/components/sections/SkillsView.tsx:331` — `id="section-hardware"` exists

  **Acceptance Criteria**:
  - [ ] `statCards[1].links` contains 4 items: Intro to Statistics, Calculus I, Intro to Programming, Finite Math
  - [ ] `statCards[2].links` contains 1 item linking to `/projects#section-achievements`
  - [ ] `statCards[3].links` contains 3 items: rāSHio, O.G.R.E, bookSHelf
  - [ ] `statCards[4].links` contains 4 items: Languages, Software, Systems, Hardware
  - [ ] `npx next build` completes without errors

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: All five hover cards show correct link text
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for the stat cards grid to be visible (selector: div.grid with 5 PixelTransition children)
      3. For each of the 5 stat cards, hover to trigger the PixelTransition flip
      4. Read the link text shown in each card's secondContent
      5. Verify card 1 (10+ Years): "Post-Secondary", "Secondary", "Elementary"
      6. Verify card 2 (20+ Courses): "Intro to Statistics", "Calculus I", "Intro to Programming", "Finite Math"
      7. Verify card 3 ($300K): "Golden State Pathways Grant"
      8. Verify card 4 (10+ Tools): "rāSHio", "O.G.R.E", "bookSHelf"
      9. Verify card 5 (35+ Skills): "Languages", "Software", "Systems", "Hardware"
    Expected Result: All link texts match exactly as specified
    Failure Indicators: Any link text mismatch or missing link
    Evidence: .sisyphus/evidence/task-1-hover-cards-text.png

  Scenario: All hover card links have correct href values
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Query all anchor elements inside the stat cards grid
      3. Verify href values:
         - Card 2 links: all 4 point to "/experience?view=catalog"
         - Card 3 link: "/projects#section-achievements"
         - Card 4 links: all 3 point to "/projects#section-tools"
         - Card 5 links: "/skills#section-languages", "/skills#section-software", "/skills#section-systems", "/skills#section-hardware"
    Expected Result: All href attributes match expected values
    Failure Indicators: Any href mismatch
    Evidence: .sisyphus/evidence/task-1-hover-cards-hrefs.txt

  Scenario: No broken anchor targets
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to /projects#section-achievements — verify element with id="section-achievements" exists
      2. Navigate to /projects#section-tools — verify element with id="section-tools" exists
      3. Navigate to /skills#section-languages — verify element with id="section-languages" exists
      4. Navigate to /skills#section-software — verify element with id="section-software" exists
      5. Navigate to /skills#section-systems — verify element with id="section-systems" exists
      6. Navigate to /skills#section-hardware — verify element with id="section-hardware" exists
    Expected Result: All 6 anchor targets resolve to existing DOM elements
    Failure Indicators: Any document.getElementById() returns null
    Evidence: .sisyphus/evidence/task-1-anchor-targets.txt
  ```

  **Evidence to Capture:**
  - [ ] task-1-hover-cards-text.png — screenshot of each card in hover state
  - [ ] task-1-hover-cards-hrefs.txt — extracted href values
  - [ ] task-1-anchor-targets.txt — confirmation of anchor target existence

  **Commit**: YES
  - Message: `fix(hero): update stat card hover links to show top courses, tools, and correct skill sections`
  - Files: `src/components/sections/Hero.tsx`
  - Pre-commit: `npx next build`

---

## Final Verification Wave

- [ ] F1. **Visual QA — All 5 hover cards** — `quick` + `playwright` skill
  Start dev server. Navigate to localhost:3000. Hover over each of the 5 stat cards one by one. Screenshot each in its flipped state. Verify link text and link targets are correct per the plan. Click each link and verify it navigates to the correct page and section. Save screenshots to `.sisyphus/evidence/final-qa/`.
  Output: `Cards [5/5 correct] | Links [15/15 working] | Anchors [6/6 exist] | VERDICT: APPROVE/REJECT`

---

## Commit Strategy

- **T1**: `fix(hero): update stat card hover links to show top courses, tools, and correct skill sections` — `src/components/sections/Hero.tsx`

---

## Success Criteria

### Verification Commands
```bash
npx next build  # Expected: Build succeeds with no errors
```

### Final Checklist
- [ ] 20+ Courses card shows: Intro to Statistics, Calculus I, Intro to Programming, Finite Math
- [ ] $300K card links to projects achievements section
- [ ] 10+ Tools card shows: rāSHio, O.G.R.E, bookSHelf
- [ ] 35+ Skills card shows: Languages, Software, Systems, Hardware (matching actual page)
- [ ] 10+ Years card unchanged
- [ ] No broken anchor links
- [ ] Build passes
