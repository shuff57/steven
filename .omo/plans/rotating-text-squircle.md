# Rotating Text: Squircle Background, Wave Animations & Chalk Font

## TL;DR

> **Quick Summary**: Upgrade the hero's rotating text to use a squircle-shaped background that dynamically resizes with smooth layout animations, staggered wave character animations for enter/exit, and a handwritten Caveat font — reinforcing the site's chalkboard identity.
> 
> **Deliverables**:
> - Squircle-shaped background container replacing the current pill
> - Smooth width/height transitions as text rotates between different-length words
> - Wave-style staggered character animations (sinusoidal ripple in/out)
> - Caveat handwritten font integrated via next/font/google
> - Muted chalk-teal background color
> 
> **Estimated Effort**: Short (3-4 tasks, ~1 hour execution)
> **Parallel Execution**: YES - 2 waves
> **Critical Path**: Task 1 (font) → Task 2 (RotatingText) → Task 3 (Hero integration) → Task 4 (QA)

---

## Context

### Original Request
User wants the rotating text on the home page hero section to have:
1. A squircle (superellipse) shaped dynamically resizing background
2. Wave in/wave out animations per character
3. Handwritten, chalkboard-style font

### Interview Summary
**Key Discussions**:
- Font: **Caveat** from Google Fonts — clean handwriting, legible at display sizes
- Animation: **Staggered character wave** — each letter ripples in with sinusoidal timing
- Color: **Muted chalk-teal** — softer than the current `#5ecec3`, more natural on chalkboard
- Squircle: Superellipse-approximated border-radius (NOT clip-path, see Metis review)

**Research Findings**:
- RotatingText component already has `staggerFrom`, `staggerDuration`, character-level splitting
- Framer-motion `layout` prop already exists on the outer `<motion.span>`
- Site uses Inter (sans) + Crimson Pro (display) — Caveat will be the 3rd font
- Theme is "blackboard" with dark greens, chalk accents, graph-paper backgrounds

### Metis Review
**Identified Gaps** (all addressed):
- **clip-path + layout animation conflict** (CRITICAL): CSS `clip-path: path(...)` prevents framer-motion `layout` from animating dimensions smoothly. Resolution: Use `border-radius` approximation for the squircle shape instead (`border-radius: 30%` or similar superellipse-approximating values).
- **AnimatePresence mode="wait" causes collapse** (CRITICAL): With `mode="wait"`, the container collapses to zero width between exit and enter of text. Resolution: Switch to `mode="popLayout"` so exiting text is popped out of layout flow while entering text immediately takes space.
- **staggerDuration defaults to 0** (IMPORTANT): Current Hero usage doesn't pass `staggerDuration`, so all characters animate simultaneously — no wave effect. Resolution: Explicitly set `staggerDuration={0.03}` or similar for visible wave ripple.

---

## Work Objectives

### Core Objective
Transform the rotating text display from a static pill-shaped badge into a dynamic, chalkboard-styled squircle that resizes smoothly and uses wave animations — elevating the hero's visual identity.

### Concrete Deliverables
- `src/app/layout.tsx` — Caveat font loaded and exposed as CSS variable
- `src/components/ui/RotatingText.tsx` — Wave animation support, `popLayout` mode
- `src/components/sections/Hero.tsx` — Squircle styling, muted teal, Caveat font, wave props
- `src/app/globals.css` or `src/styles/chalkboard.css` — Squircle utility class (if needed)

### Definition of Done
- [ ] Rotating text displays in Caveat handwritten font
- [ ] Background is squircle-shaped (superellipse via border-radius)
- [ ] Background smoothly resizes width when text changes (e.g., "Innovator" → "Curriculum Developer")
- [ ] Characters wave in (sinusoidal stagger) and wave out on each rotation
- [ ] No layout jump or collapse between word transitions
- [ ] `npm run build` succeeds with zero errors

### Must Have
- Squircle shape via border-radius (NOT clip-path)
- AnimatePresence mode="popLayout" to prevent collapse
- Explicit staggerDuration for visible wave effect
- Caveat font loaded via next/font/google (not CDN link)
- Background color softer/muted compared to current `#5ecec3`

### Must NOT Have (Guardrails)
- Do NOT use CSS `clip-path` for the squircle — it breaks framer-motion layout animations
- Do NOT change the text content (the 8 role strings stay the same)
- Do NOT modify other Hero elements (stat cards, CTA buttons, watermark Sigma)
- Do NOT add external animation libraries beyond what's already installed (framer-motion, GSAP)
- Do NOT change the overall layout or positioning of the rotating text section
- Do NOT add excessive decorative elements (drop shadows, glows, particles)
- Do NOT modify the RotatingText component's public API in breaking ways — it should remain backward-compatible

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.

### Test Decision
- **Infrastructure exists**: NO (no test framework configured)
- **Automated tests**: NONE
- **Agent-Executed QA**: ALWAYS (Playwright screenshots + build verification)

### QA Policy
Every task includes agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Frontend/UI**: Use Playwright — Navigate to homepage, screenshot the rotating text area, verify font family, verify squircle shape, verify wave animation timing
- **Build**: Run `npm run build` — verify zero errors

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — foundation):
├── Task 1: Add Caveat font to layout.tsx [quick]
└── Task 2: Update RotatingText wave animation support [visual-engineering]

Wave 2 (After Wave 1 — integration + QA):
├── Task 3: Wire up squircle + wave + font in Hero.tsx [visual-engineering]
└── Task 4: Build verification + visual QA [quick]

Critical Path: Task 1 → Task 3 → Task 4
Parallel Speedup: Tasks 1 & 2 run concurrently
Max Concurrent: 2 (Wave 1)
```

### Dependency Matrix

| Task | Depends On | Blocks |
|------|-----------|--------|
| 1    | —         | 3      |
| 2    | —         | 3      |
| 3    | 1, 2      | 4      |
| 4    | 3         | —      |

### Agent Dispatch Summary

- **Wave 1**: **2 parallel** — T1 → `quick`, T2 → `visual-engineering`
- **Wave 2**: **2 sequential** — T3 → `visual-engineering`, T4 → `quick`

---

## TODOs


- [ ] 1. Add Caveat Handwritten Font

  **What to do**:
  - Import `Caveat` from `next/font/google` in `src/app/layout.tsx`
  - Configure with weights `['400', '700']`, `display: 'swap'`, variable `'--font-chalk'`
  - Add the CSS variable class to the `<body>` className alongside existing font variables
  - Add `--font-chalk: var(--font-chalk);` to the `@theme inline` block in `globals.css` so Tailwind can reference it

  **Must NOT do**:
  - Do NOT remove or modify Inter or Crimson Pro font configurations
  - Do NOT apply Caveat globally — it should only be used where explicitly referenced
  - Do NOT use a CDN link tag — must use next/font/google for optimization

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single-file font addition with minor CSS update — straightforward, well-documented pattern
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/app/layout.tsx:10-22` — How Inter and Crimson Pro are loaded via next/font/google. Follow this exact pattern for Caveat: import, configure with variable, add to body className.

  **API/Type References**:
  - `src/app/globals.css:5-60` — The `@theme inline` block where CSS custom properties are defined. Add `--font-chalk` here so it is available as a Tailwind token.

  **External References**:
  - Google Fonts Caveat: `https://fonts.google.com/specimen/Caveat`
  - Next.js font docs: `https://nextjs.org/docs/app/building-your-application/optimizing/fonts`

  **Acceptance Criteria**:
  - [ ] `Caveat` imported and configured in layout.tsx with variable `--font-chalk`
  - [ ] Body className includes the Caveat variable class
  - [ ] `--font-chalk` added to globals.css @theme inline block
  - [ ] `npm run build` succeeds with zero errors

  **QA Scenarios:**

  ```
  Scenario: Font variable is available and build passes
    Tool: Bash
    Preconditions: Project builds successfully
    Steps:
      1. Run npm run build
      2. Verify exit code is 0
      3. Search source for --font-chalk to confirm the variable is defined
    Expected Result: Build succeeds, --font-chalk CSS variable present in theme
    Failure Indicators: Build error mentioning Caveat, or --font-chalk not found
    Evidence: .sisyphus/evidence/task-1-font-build.txt
  ```

  **Commit**: YES (groups with Task 2)
  - Message: `feat(hero): add Caveat chalk font and wave animation support`
  - Files: `src/app/layout.tsx`, `src/app/globals.css`
  - Pre-commit: `npm run build`

- [ ] 2. Add Wave Animation Support to RotatingText Component

  **What to do**:
  - **CRITICAL**: Change `animatePresenceMode` default from `'wait'` to `'popLayout'`
    - With `'wait'`, the container collapses to zero width between exit/enter, causing a jarring flash
    - With `'popLayout'`, the exiting element is popped out of layout flow so the entering element can immediately take space
    - This is essential for smooth dynamic resizing of the squircle background
  - Modify the default `initial`, `animate`, and `exit` animation variants to create a wave effect:
    - Enter: `{ y: '100%', opacity: 0, rotateZ: -8 }` to `{ y: 0, opacity: 1, rotateZ: 0 }`
    - Exit: `{ y: '-120%', opacity: 0, rotateZ: 8 }`
    - The `rotateZ` wobble gives each character a slight rotation as it waves in/out
    - These are defaults — the Hero will pass its own values, but defaults should be wave-ready
  - Ensure the outer `<motion.span>` retains `layout` prop (it already does) for container size animation
  - Verify `staggerDuration` and `staggerFrom` props thread through to per-character `<motion.span>` (they already do)

  **Must NOT do**:
  - Do NOT change the component TypeScript interface in a breaking way
  - Do NOT remove existing animation prop pass-through (initial, animate, exit remain overridable)
  - Do NOT change character splitting logic
  - Do NOT add new external dependencies

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Animation engineering requiring understanding of framer-motion layout animations, AnimatePresence modes, and spring physics
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/ui/RotatingText.tsx:47-70` — Current default props including `animatePresenceMode = 'wait'` on line 55, `initial`/`animate`/`exit` defaults on lines 52-54. These are the exact lines to modify.
  - `src/components/ui/RotatingText.tsx:108-124` — `getStaggerDelay` function. Already computes per-character delays using `staggerFrom` and `staggerDuration`. No changes needed, but understand it to verify wave timing.
  - `src/components/ui/RotatingText.tsx:186-236` — The render tree. Outer `<motion.span>` (line 187) has `layout` prop. `AnimatePresence` (line 194) uses `animatePresenceMode`. Per-character `<motion.span>` (line 212) applies `initial`/`animate`/`exit`.

  **API/Type References**:
  - `src/components/ui/RotatingText.tsx:23-45` — `RotatingTextProps` interface. The `animatePresenceMode` prop on line 33, `initial`/`animate`/`exit` on lines 30-32. Types must remain unchanged.

  **External References**:
  - Framer Motion AnimatePresence: `https://www.framer.com/motion/animate-presence/` — `popLayout` mode docs
  - Framer Motion layout animations: `https://www.framer.com/motion/layout-animations/` — How `layout` prop enables automatic size transitions

  **Acceptance Criteria**:
  - [ ] `animatePresenceMode` default changed from `'wait'` to `'popLayout'`
  - [ ] Default `initial`/`animate`/`exit` include `rotateZ` for wave wobble
  - [ ] Component still accepts custom `initial`/`animate`/`exit` overrides (backward compatible)
  - [ ] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Component compiles and defaults are updated
    Tool: Bash
    Preconditions: Task 2 changes applied to RotatingText.tsx
    Steps:
      1. Run npm run build
      2. Verify exit code is 0
      3. Read RotatingText.tsx and confirm animatePresenceMode default is 'popLayout'
      4. Read RotatingText.tsx and confirm initial default includes rotateZ
    Expected Result: Build passes, defaults are updated as specified
    Failure Indicators: Build error, or defaults still show 'wait' / missing rotateZ
    Evidence: .sisyphus/evidence/task-2-wave-build.txt

  Scenario: Backward compatibility preserved
    Tool: Bash
    Preconditions: Component modified
    Steps:
      1. Read RotatingText.tsx props destructuring
      2. Verify initial, animate, exit are still destructured with defaults (not hardcoded)
      3. Verify animatePresenceMode is still a prop (not hardcoded)
    Expected Result: All animation props remain overridable via props
    Failure Indicators: Any animation value hardcoded instead of using prop default
    Evidence: .sisyphus/evidence/task-2-backward-compat.txt
  ```

  **Commit**: YES (groups with Task 1)
  - Message: `feat(hero): add Caveat chalk font and wave animation support`
  - Files: `src/components/ui/RotatingText.tsx`
  - Pre-commit: `npm run build`


- [ ] 3. Wire Up Squircle, Wave Props & Chalk Font in Hero.tsx

  **What to do**:
  - Update the `RotatingText` usage in `Hero.tsx` to combine all three enhancements:
  - **Squircle shape**: Replace `rounded-full` in `mainClassName` with a squircle-approximating `border-radius`.
    Use a value like `border-radius: 22%` or `border-radius: 20px / 50%` that creates the superellipse look.
    The exact value should be tuned visually but should clearly read as a squircle not a pill and not a plain rounded-rect.
  - **Dynamic resize**: The `layout` prop on RotatingText's outer span already handles this, but ensure `overflow-hidden` is removed or adjusted so the squircle shape is visible during resize. The `mainClassName` should NOT have `overflow-hidden` since `popLayout` mode needs exiting elements to be visible briefly.
  - **Muted chalk-teal background**: Replace `bg-[#5ecec3]` with a softer muted teal. Suggested: `bg-[#4db8ad]` or `bg-[#3fa89e]` — should feel like chalk on a chalkboard, not neon.
  - **Caveat font**: Add `style={{ fontFamily: 'var(--font-chalk)' }}` to the RotatingText or its wrapper, so the rotating words render in the handwritten font.
  - **Wave animation props**: Pass explicit wave-ready animation props:
    - `initial={{ y: '100%', opacity: 0, rotateZ: -8 }}`
    - `animate={{ y: 0, opacity: 1, rotateZ: 0 }}`
    - `exit={{ y: '-120%', opacity: 0, rotateZ: 8 }}`
    - `staggerDuration={0.03}` — This is CRITICAL. Without it, stagger defaults to 0 and there is no wave.
    - `staggerFrom="last"` — Keep existing value for wave direction
    - `transition={{ type: 'spring', damping: 30, stiffness: 200 }}` — Slightly softer than current for more natural wave feel
  - **Font size**: Consider bumping font size slightly since Caveat reads smaller than Inter at the same size. Try `text-xl md:text-3xl` or similar.

  **Must NOT do**:
  - Do NOT change the text content array (the 8 role strings stay the same)
  - Do NOT modify stat cards, CTA buttons, watermark sigma, or any other Hero element
  - Do NOT change the overall layout/positioning of the subtitle section
  - Do NOT add drop shadows, glows, or particles to the squircle
  - Do NOT hardcode pixel widths — the squircle must resize dynamically

  **Recommended Agent Profile**:
  - **Category**: `visual-engineering`
    - Reason: Visual integration requiring careful CSS tuning of squircle border-radius, color selection, font sizing, and animation parameter balancing
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: NO
  - **Parallel Group**: Wave 2 (sequential after Wave 1)
  - **Blocks**: Task 4
  - **Blocked By**: Task 1 (font), Task 2 (wave animation support)

  **References**:

  **Pattern References**:
  - `src/components/sections/Hero.tsx:113-122` — Current RotatingText usage. Lines 113-121 contain all the props that need to change: `texts`, `mainClassName`, `staggerFrom`, `initial`, `animate`, `exit`, `transition`, `rotationInterval`. This is the primary edit target.
  - `src/components/sections/Hero.tsx:107-123` — The full subtitle `<p>` wrapper around RotatingText. The font-family style should be applied here or on the RotatingText itself.

  **API/Type References**:
  - `src/components/ui/RotatingText.tsx:23-45` — Available props for RotatingText. Key new props to use: `staggerDuration` (line 36), `staggerFrom` (line 37). Key changed defaults: `animatePresenceMode` now defaults to `'popLayout'`.

  **External References**:
  - CSS squircle approximation: `border-radius` with percentage values creates superellipse approximation. See `https://squircley.app/` for visual reference of the target shape.

  **Acceptance Criteria**:
  - [ ] `mainClassName` uses squircle border-radius instead of `rounded-full`
  - [ ] Background color is muted/softer than `#5ecec3`
  - [ ] `staggerDuration` is explicitly set (not 0)
  - [ ] `rotateZ` present in initial/animate/exit props
  - [ ] Font family references `--font-chalk` (Caveat)
  - [ ] `overflow-hidden` removed or adjusted for popLayout compatibility
  - [ ] `npm run build` succeeds

  **QA Scenarios:**

  ```
  Scenario: Squircle, font, and wave props are correctly wired
    Tool: Bash
    Preconditions: Tasks 1 and 2 complete
    Steps:
      1. Run npm run build
      2. Verify exit code is 0
      3. Read Hero.tsx RotatingText usage
      4. Verify mainClassName does NOT contain rounded-full
      5. Verify mainClassName or inline style contains squircle border-radius
      6. Verify staggerDuration prop is set and non-zero
      7. Verify font-chalk is referenced in style or className
      8. Verify initial/exit props include rotateZ
    Expected Result: All props correctly configured, build passes
    Failure Indicators: rounded-full still present, staggerDuration missing, no font reference
    Evidence: .sisyphus/evidence/task-3-hero-wiring.txt

  Scenario: Visual appearance via Playwright
    Tool: Playwright
    Preconditions: Dev server running at localhost:3000
    Steps:
      1. Navigate to http://localhost:3000
      2. Wait for hero section to load (wait for RotatingText to be visible)
      3. Screenshot the rotating text area
      4. Wait 3 seconds for text rotation to occur
      5. Screenshot again to capture different word with resized squircle
      6. Check computed font-family of rotating text element contains Caveat
    Expected Result: Screenshots show squircle shape (not pill), handwritten font, muted teal background
    Failure Indicators: Pill shape visible, standard font, bright teal unchanged
    Evidence: .sisyphus/evidence/task-3-visual-before.png, .sisyphus/evidence/task-3-visual-after.png
  ```

  **Commit**: YES
  - Message: `feat(hero): squircle background with dynamic resize for rotating text`
  - Files: `src/components/sections/Hero.tsx`
  - Pre-commit: `npm run build`

---

## Final Verification Wave

- [ ] F1. **Build + Lint Verification** — `quick`
  Run `npm run build`. Verify zero TypeScript errors, zero build failures. Check that no unused imports or type errors were introduced. Run `npx next lint` if configured.
  Output: `Build [PASS/FAIL] | Lint [PASS/FAIL] | VERDICT`

- [ ] F2. **Visual QA — Playwright** — `visual-engineering` (+ `playwright` skill)
  Load homepage at `http://localhost:3000`. Wait for rotating text to appear. Take screenshots during:
  1. Initial render (first word visible in squircle)
  2. Mid-transition (characters waving out)
  3. After transition (new word fully visible, squircle resized)
  Verify: Caveat font is applied (check computed font-family), squircle border-radius is visible, background color is muted teal, no layout jump between words.
  Evidence: `.sisyphus/evidence/final-qa/rotating-text-*.png`
  Output: `Font [PASS/FAIL] | Squircle [PASS/FAIL] | Resize [PASS/FAIL] | Wave [PASS/FAIL] | VERDICT`

---

## Commit Strategy

- **Wave 1**: `feat(hero): add Caveat chalk font and wave animation support` — `src/app/layout.tsx`, `src/components/ui/RotatingText.tsx`
- **Wave 2**: `feat(hero): squircle background with dynamic resize for rotating text` — `src/components/sections/Hero.tsx`, CSS files if changed

---

## Success Criteria

### Verification Commands
```bash
npm run build   # Expected: Compiled successfully
```

### Final Checklist
- [ ] Rotating text renders in Caveat handwritten font
- [ ] Background is squircle-shaped (visible rounded-square, not pill)
- [ ] Background resizes smoothly between "Innovator" and "Curriculum Developer"
- [ ] Characters ripple in/out with visible wave stagger
- [ ] No collapse/flash between word transitions
- [ ] Build passes
- [ ] All other Hero elements unchanged (stat cards, CTA, sigma)
