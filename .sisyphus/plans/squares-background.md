# Add Animated Squares Background to Hero Section

## TL;DR

> **Quick Summary**: Port the react-bits Squares canvas background into the Hero section, replacing the existing CSS `graph-paper-bg` pattern. Map colors to the existing blackboard theme tokens.
> 
> **Deliverables**:
> - New `Squares.tsx` animation component in `src/components/animations/`
> - Updated Hero section with animated canvas background
> - Updated barrel export in `src/components/animations/index.ts`
> 
> **Estimated Effort**: Quick
> **Parallel Execution**: NO — 2 sequential tasks + 1 verification
> **Critical Path**: Task 1 → Task 2 → Task 3

---

## Context

### Original Request
User wants to add the react-bits Squares animated background (https://reactbits.dev/backgrounds/squares) to their portfolio site, with `size=36`, `speed=0.1`, using the existing blackboard color scheme.

### Interview Summary
**Key Discussions**:
- Placement: Hero section only (not global)
- Color mapping agreed:
  - `borderColor` → `rgba(240, 237, 232, 0.1)` (matches `--color-border`)
  - `hoverFillColor` → `rgba(94, 206, 195, 0.15)` (matches `--color-accent-muted`)
  - Edge gradient → `#141a14` (matches `--color-bg-primary`, replaces hardcoded `#060010`)

### Metis Review
**Identified Gaps** (addressed):
- **graph-paper-bg conflict**: Hero already has a CSS grid pattern at 40px spacing. Stacking a 36px canvas grid causes moiré/visual noise. → **Resolution**: Remove `graph-paper-bg` from Hero; Squares replaces it.
- **Missing `prefers-reduced-motion`**: Every animation in this codebase respects it (Hero, ParallaxLayer). The react-bits source doesn't. → **Resolution**: Add the check.
- **Default export mismatch**: Source uses `export default`, codebase uses named exports. → **Resolution**: Convert to named export.
- **Unnecessary React import**: React 19 automatic JSX transform. → **Resolution**: Remove `import React`, keep `{ useRef, useEffect }`.
- **Direction not specified**: URL only has size/speed. Default is `'right'`. → **Resolution**: Default to `'diagonal'` (more dynamic for a portfolio hero).
- **DOM stacking order**: Canvas div must appear BEFORE watermark div in Hero DOM for correct z-layering without explicit z-index. → **Resolution**: Document in task instructions.

---

## Work Objectives

### Core Objective
Add a subtle, animated canvas grid background to the Hero section that matches the blackboard theme.

### Concrete Deliverables
- `src/components/animations/Squares.tsx` — TypeScript + Tailwind canvas component
- Updated `src/components/animations/index.ts` — barrel export
- Updated `src/components/sections/Hero.tsx` — integrated background, `graph-paper-bg` removed

### Definition of Done
- [ ] `npm run build` exits with code 0
- [ ] `npm run lint` exits with code 0
- [ ] Canvas element renders inside Hero section at full width/height
- [ ] Hero content (heading, subtitle, stats, CTA buttons) remains interactive
- [ ] Edge gradient fades to `#141a14`, not `#060010`
- [ ] Animation pauses when `prefers-reduced-motion: reduce` is active

### Must Have
- Canvas fills entire Hero section
- Colors use the agreed theme mapping (border, hover, gradient)
- `prefers-reduced-motion` respected
- Named export convention
- `'use client'` directive
- Barrel export updated

### Must NOT Have (Guardrails)
- **DO NOT** install any npm packages — component is self-contained
- **DO NOT** modify the GSAP animation timeline in Hero — entrance animations are tuned
- **DO NOT** change z-index values on existing Hero elements (content is `z-10`)
- **DO NOT** modify `globals.css` or `chalkboard.css`
- **DO NOT** add new CSS variables or theme tokens
- **DO NOT** use default export — codebase uses named exports exclusively
- **DO NOT** add performance abstractions (IntersectionObserver, visibility API, etc.)
- **DO NOT** add Squares to any section other than Hero

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

- **Build/Lint**: Use Bash — `npm run build`, `npm run lint`
- **Frontend/UI**: Use Playwright (playwright skill) — Navigate, check canvas, click CTAs, screenshot
- **File checks**: Use Bash (grep) — Verify exports, conventions, color values

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — create component):
└── Task 1: Create Squares.tsx component [quick]

Wave 2 (After Wave 1 — integration):
└── Task 2: Integrate Squares into Hero section [quick]

Wave 3 (After Wave 2 — verification):
└── Task 3: Visual + functional verification via dev server [quick + playwright]

Critical Path: Task 1 → Task 2 → Task 3
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| 1    | —         | 2, 3   | 1    |
| 2    | 1         | 3      | 2    |
| 3    | 2         | —      | 3    |

### Agent Dispatch Summary

- **Wave 1**: 1 task — T1 → `quick`
- **Wave 2**: 1 task — T2 → `quick`
- **Wave 3**: 1 task — T3 → `quick` + `playwright` skill

---

## TODOs

- [ ] 1. Create `Squares.tsx` in `src/components/animations/`

  **What to do**:
  1. Create `src/components/animations/Squares.tsx` with the full react-bits TypeScript + Tailwind source (provided below in References), applying these modifications:
     - First line: `'use client'`
     - Change `import React, { useRef, useEffect } from 'react'` → `import { useRef, useEffect } from 'react'`
     - Change `export default Squares` → remove this line entirely
     - Change `const Squares: React.FC<SquaresProps> = ({` → `export function Squares({` and close with normal function syntax (remove the `const`/arrow/FC wrapper)
     - Inside the `useEffect`, BEFORE the `resizeCanvas()` call, add:
       ```ts
       const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
       ```
     - If `prefersReduced` is true: call `resizeCanvas()`, call `drawGrid()` once (static frame), then `return` early (skip the `requestAnimationFrame` loop). The cleanup function should still run.
     - Change the gradient color stop `'#060010'` → `'#141a14'` (line with `gradient.addColorStop(1, ...)`)
  2. Update `src/components/animations/index.ts` — add: `export { Squares } from './Squares'`

  **Must NOT do**:
  - Do NOT install any npm packages
  - Do NOT use default export
  - Do NOT import React (only `{ useRef, useEffect }`)
  - Do NOT modify any existing files except `index.ts` barrel

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file creation with clear instructions, straightforward porting work
  - **Skills**: `[]`
    - No special skills needed — file creation with explicit source code provided
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not designing UI, porting existing component with specific modifications
    - `playwright`: No browser verification in this task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 1 (solo)
  - **Blocks**: Task 2, Task 3
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References** (existing code to follow):
  - `src/components/animations/ParallaxLayer.tsx` — Follow this file's structure: `'use client'` directive, named import from `'react'`, interface definition, named export function. Specifically note line 1 (`'use client'`), line 3 (import style), line 13 (named export), and lines 20-21 (prefers-reduced-motion pattern).
  - `src/components/animations/index.ts` — Barrel export pattern: `export { ComponentName } from './ComponentName'`. Add the Squares export after the existing two lines.

  **Source Code Reference** (the react-bits Squares component — TypeScript + Tailwind variant):
  ```tsx
  'use client'
  import { useRef, useEffect } from 'react';

  type CanvasStrokeStyle = string | CanvasGradient | CanvasPattern;

  interface GridOffset {
    x: number;
    y: number;
  }

  interface SquaresProps {
    direction?: 'diagonal' | 'up' | 'right' | 'down' | 'left';
    speed?: number;
    borderColor?: CanvasStrokeStyle;
    squareSize?: number;
    hoverFillColor?: CanvasStrokeStyle;
  }

  export function Squares({
    direction = 'right',
    speed = 1,
    borderColor = '#999',
    squareSize = 40,
    hoverFillColor = '#222'
  }: SquaresProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const requestRef = useRef<number | null>(null);
    const numSquaresX = useRef<number>(0);
    const numSquaresY = useRef<number>(0);
    const gridOffset = useRef<GridOffset>({ x: 0, y: 0 });
    const hoveredSquareRef = useRef<GridOffset | null>(null);

    useEffect(() => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');

      // Respect prefers-reduced-motion
      const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const resizeCanvas = () => {
        canvas.width = canvas.offsetWidth;
        canvas.height = canvas.offsetHeight;
        numSquaresX.current = Math.ceil(canvas.width / squareSize) + 1;
        numSquaresY.current = Math.ceil(canvas.height / squareSize) + 1;
      };

      window.addEventListener('resize', resizeCanvas);
      resizeCanvas();

      const drawGrid = () => {
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
        const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;
        for (let x = startX; x < canvas.width + squareSize; x += squareSize) {
          for (let y = startY; y < canvas.height + squareSize; y += squareSize) {
            const squareX = x - (gridOffset.current.x % squareSize);
            const squareY = y - (gridOffset.current.y % squareSize);
            if (
              hoveredSquareRef.current &&
              Math.floor((x - startX) / squareSize) === hoveredSquareRef.current.x &&
              Math.floor((y - startY) / squareSize) === hoveredSquareRef.current.y
            ) {
              ctx.fillStyle = hoverFillColor;
              ctx.fillRect(squareX, squareY, squareSize, squareSize);
            }
            ctx.strokeStyle = borderColor;
            ctx.strokeRect(squareX, squareY, squareSize, squareSize);
          }
        }
        const gradient = ctx.createRadialGradient(
          canvas.width / 2, canvas.height / 2, 0,
          canvas.width / 2, canvas.height / 2,
          Math.sqrt(canvas.width ** 2 + canvas.height ** 2) / 2
        );
        gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
        gradient.addColorStop(1, '#141a14');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
      };

      // If user prefers reduced motion, draw static grid and exit
      if (prefersReduced) {
        drawGrid();
        return () => {
          window.removeEventListener('resize', resizeCanvas);
        };
      }

      const updateAnimation = () => {
        const effectiveSpeed = Math.max(speed, 0.1);
        switch (direction) {
          case 'right':
            gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
            break;
          case 'left':
            gridOffset.current.x = (gridOffset.current.x + effectiveSpeed + squareSize) % squareSize;
            break;
          case 'up':
            gridOffset.current.y = (gridOffset.current.y + effectiveSpeed + squareSize) % squareSize;
            break;
          case 'down':
            gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
            break;
          case 'diagonal':
            gridOffset.current.x = (gridOffset.current.x - effectiveSpeed + squareSize) % squareSize;
            gridOffset.current.y = (gridOffset.current.y - effectiveSpeed + squareSize) % squareSize;
            break;
          default:
            break;
        }
        drawGrid();
        requestRef.current = requestAnimationFrame(updateAnimation);
      };

      const handleMouseMove = (event: MouseEvent) => {
        const rect = canvas.getBoundingClientRect();
        const mouseX = event.clientX - rect.left;
        const mouseY = event.clientY - rect.top;
        const startX = Math.floor(gridOffset.current.x / squareSize) * squareSize;
        const startY = Math.floor(gridOffset.current.y / squareSize) * squareSize;
        const hoveredSquareX = Math.floor((mouseX + gridOffset.current.x - startX) / squareSize);
        const hoveredSquareY = Math.floor((mouseY + gridOffset.current.y - startY) / squareSize);
        if (
          !hoveredSquareRef.current ||
          hoveredSquareRef.current.x !== hoveredSquareX ||
          hoveredSquareRef.current.y !== hoveredSquareY
        ) {
          hoveredSquareRef.current = { x: hoveredSquareX, y: hoveredSquareY };
        }
      };

      const handleMouseLeave = () => {
        hoveredSquareRef.current = null;
      };

      canvas.addEventListener('mousemove', handleMouseMove);
      canvas.addEventListener('mouseleave', handleMouseLeave);
      requestRef.current = requestAnimationFrame(updateAnimation);

      return () => {
        window.removeEventListener('resize', resizeCanvas);
        if (requestRef.current) cancelAnimationFrame(requestRef.current);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mouseleave', handleMouseLeave);
      };
    }, [direction, speed, borderColor, hoverFillColor, squareSize]);

    return <canvas ref={canvasRef} className="w-full h-full border-none block"></canvas>;
  }
  ```

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Component file created with correct conventions
    Tool: Bash (grep/ls)
    Preconditions: None
    Steps:
      1. ls src/components/animations/Squares.tsx — file exists
      2. grep "export function Squares" src/components/animations/Squares.tsx — named export present
      3. grep "export default" src/components/animations/Squares.tsx — should return NO matches
      4. grep "'use client'" src/components/animations/Squares.tsx — directive present
      5. grep "import React" src/components/animations/Squares.tsx — should return NO matches (React 19 auto JSX)
      6. grep "prefers-reduced-motion" src/components/animations/Squares.tsx — reduced motion check present
      7. grep "#141a14" src/components/animations/Squares.tsx — correct gradient color
      8. grep "#060010" src/components/animations/Squares.tsx — should return NO matches (old color removed)
    Expected Result: Steps 1-4, 6-7 find matches; steps 5, 8 find NO matches
    Failure Indicators: Any grep returning unexpected results
    Evidence: .sisyphus/evidence/task-1-file-conventions.txt

  Scenario: Barrel export updated
    Tool: Bash (grep)
    Preconditions: index.ts exists
    Steps:
      1. grep "Squares" src/components/animations/index.ts — export line present
    Expected Result: Line like `export { Squares } from './Squares'` found
    Failure Indicators: No match
    Evidence: .sisyphus/evidence/task-1-barrel-export.txt
  ```

  **Commit**: YES
  - Message: `feat(animations): add Squares canvas background component`
  - Files: `src/components/animations/Squares.tsx`, `src/components/animations/index.ts`

---

- [ ] 2. Integrate Squares into Hero section

  **What to do**:
  1. In `src/components/sections/Hero.tsx`:
     - Add import: `import { Squares } from '@/components/animations'`
     - Remove `graph-paper-bg` from the section's className (line 84). The className should become: `"relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden py-24 px-6"`
     - Insert a new `<div>` wrapper **BEFORE** the watermark div (before line 87's `<div className="absolute inset-0 flex items-center...`), containing the Squares component:
       ```tsx
       {/* Animated grid background */}
       <div className="absolute inset-0" aria-hidden="true">
         <Squares
           speed={0.1}
           squareSize={36}
           direction="diagonal"
           borderColor="rgba(240, 237, 232, 0.1)"
           hoverFillColor="rgba(94, 206, 195, 0.15)"
         />
       </div>
       ```
     - The DOM order MUST be: Squares div → Watermark div → Content div (z-10). This ensures correct visual stacking without explicit z-index on the background layers.
  2. Do NOT modify anything else in Hero.tsx — no GSAP changes, no other className changes, no z-index additions.

  **Must NOT do**:
  - Do NOT modify the GSAP timeline or animation refs
  - Do NOT change z-index on existing elements
  - Do NOT modify any other section or component
  - Do NOT add z-index to the Squares wrapper div
  - Do NOT modify `globals.css` or `chalkboard.css`

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single file edit with 3 clear changes (add import, remove class, insert div)
  - **Skills**: `[]`
    - No special skills needed — targeted file edits with explicit instructions
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Layout is predetermined, no design judgment needed
    - `playwright`: No browser verification in this task

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (solo, sequential after Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: Task 1

  **References**:

  **Pattern References**:
  - `src/components/sections/Hero.tsx:84` — The section element's className where `graph-paper-bg` must be removed
  - `src/components/sections/Hero.tsx:87-99` — The watermark div. The new Squares div must be inserted BEFORE this div.
  - `src/components/sections/Hero.tsx:102` — The content div with `z-10`. Must remain untouched.

  **Color References**:
  - `src/app/globals.css:26` — `--color-border: rgba(240, 237, 232, 0.1)` → used as `borderColor`
  - `src/app/globals.css:18` — `--color-accent-muted: rgba(94, 206, 195, 0.15)` → used as `hoverFillColor`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Hero imports Squares and removes graph-paper-bg
    Tool: Bash (grep)
    Preconditions: Task 1 complete
    Steps:
      1. grep "import.*Squares.*from.*animations" src/components/sections/Hero.tsx — import present
      2. grep "graph-paper-bg" src/components/sections/Hero.tsx — should return NO matches
      3. grep "squareSize={36}" src/components/sections/Hero.tsx — prop present
      4. grep "speed={0.1}" src/components/sections/Hero.tsx — prop present
    Expected Result: Steps 1, 3, 4 find matches; step 2 finds NO matches
    Failure Indicators: graph-paper-bg still present, or Squares import/props missing
    Evidence: .sisyphus/evidence/task-2-hero-integration.txt

  Scenario: Build and lint pass
    Tool: Bash
    Preconditions: All edits complete
    Steps:
      1. npm run build — exit code 0
      2. npm run lint — exit code 0
    Expected Result: Both commands succeed with exit code 0
    Failure Indicators: Type errors, lint errors, build failures
    Evidence: .sisyphus/evidence/task-2-build-lint.txt

  Scenario: DOM order is correct (Squares before watermark before content)
    Tool: Bash (grep)
    Preconditions: Hero.tsx edited
    Steps:
      1. Review Hero.tsx source order: Squares div appears first, then watermark div, then content div (z-10)
      2. grep -n "Animated grid background\|Decorative watermark\|Content\|z-10" src/components/sections/Hero.tsx — verify line ordering
    Expected Result: "Animated grid" line number < "watermark" line number < "z-10" line number
    Failure Indicators: Squares div appears after watermark or content
    Evidence: .sisyphus/evidence/task-2-dom-order.txt
  ```

  **Commit**: YES
  - Message: `feat(hero): integrate Squares animated background, replace graph-paper-bg`
  - Files: `src/components/sections/Hero.tsx`

---

- [ ] 3. Visual and functional verification via dev server

  **What to do**:
  1. Start dev server: `npm run dev` (may already be running)
  2. Using Playwright, navigate to `http://localhost:3000`
  3. Verify all acceptance criteria:
     - Canvas element exists inside the Hero section
     - Canvas has non-zero dimensions
     - CTA links ("View My Work", "See Projects") are clickable
     - The ∫ watermark text is still present in the DOM
     - Take a screenshot as evidence
  4. Stop the dev server when done

  **Must NOT do**:
  - Do NOT modify any code in this task — verification only
  - Do NOT change any files

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification task using Playwright to check rendered page
  - **Skills**: `['playwright']`
    - `playwright`: Required for browser automation — navigate to dev server, check DOM elements, click links, take screenshots
  - **Skills Evaluated but Omitted**:
    - `frontend-design`: Not designing, just verifying
    - `git-master`: No git operations

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 3 (final verification)
  - **Blocks**: None
  - **Blocked By**: Task 2

  **References**:

  **Verification Targets**:
  - `http://localhost:3000` — Homepage with Hero section
  - `section canvas` — Canvas element selector inside Hero
  - `a[href="/experience"]` — "View My Work" CTA link
  - `a[href="/projects"]` — "See Projects" CTA link

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Canvas renders in Hero section
    Tool: Playwright (playwright skill)
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for page load (domcontentloaded)
      3. Locate canvas element inside section: page.locator('section canvas')
      4. Assert canvas is visible
      5. Get canvas bounding box — assert width > 0 and height > 0
    Expected Result: Canvas element exists, is visible, has non-zero dimensions
    Failure Indicators: Canvas not found, zero dimensions, or not visible
    Evidence: .sisyphus/evidence/task-3-canvas-exists.png

  Scenario: Hero content remains interactive
    Tool: Playwright (playwright skill)
    Preconditions: Page loaded at localhost:3000
    Steps:
      1. Locate "View My Work" link: page.locator('a[href="/experience"]')
      2. Assert it is visible
      3. Click it
      4. Assert URL changed to include "/experience"
      5. Navigate back to http://localhost:3000
      6. Locate "See Projects" link: page.locator('a[href="/projects"]')
      7. Assert it is visible
    Expected Result: Both CTA links are visible and clickable; clicking "View My Work" navigates to /experience
    Failure Indicators: Links not found, not visible, or click doesn't navigate
    Evidence: .sisyphus/evidence/task-3-cta-clickable.png

  Scenario: Watermark still visible in DOM
    Tool: Playwright (playwright skill)
    Preconditions: Page loaded at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Check for text content "∫" on the page
      3. Take full-page screenshot
    Expected Result: Integral symbol is present in the DOM
    Failure Indicators: Text "∫" not found
    Evidence: .sisyphus/evidence/task-3-full-hero.png
  ```

  **Commit**: NO (verification only)

---

## Final Verification Wave

> Since this is a small, 3-task plan, Task 3 already serves as the final verification.
> No additional verification wave needed — Task 3 covers build, lint, visual, and functional checks.

---

## Commit Strategy

| Order | Message | Files | Pre-commit Check |
|-------|---------|-------|-----------------|
| 1 | `feat(animations): add Squares canvas background component` | `src/components/animations/Squares.tsx`, `src/components/animations/index.ts` | `npm run lint` |
| 2 | `feat(hero): integrate Squares animated background, replace graph-paper-bg` | `src/components/sections/Hero.tsx` | `npm run build` |

---

## Success Criteria

### Verification Commands
```bash
npm run build   # Expected: exit code 0, no errors
npm run lint    # Expected: exit code 0, no errors
```

### Final Checklist
- [ ] `Squares.tsx` created with named export, `'use client'`, `prefers-reduced-motion` check
- [ ] Gradient edge color is `#141a14` (not `#060010`)
- [ ] `graph-paper-bg` removed from Hero
- [ ] Canvas renders full-size in Hero section
- [ ] Hero CTA buttons remain clickable
- [ ] ∫ watermark still visible
- [ ] Build passes
- [ ] Lint passes
