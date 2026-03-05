# Promo Video Pilot — bookSHelf Demo Embed

## TL;DR

> **Quick Summary**: Record a 10-30 second demo video of the bookSHelf site (Applied Finite Math section) using Playwriter screen recording with ghost cursor and viewport zoom, then embed it as an autoplay muted loop replacing the iframe preview in the portfolio's project card.
> 
> **Deliverables**:
> - `public/videos/bookshelf-demo.mp4` — polished demo clip (≤5MB, H.264)
> - `public/videos/bookshelf-demo-poster.jpg` — first-frame poster image
> - Updated `Project` interface with `videoUrl` + `posterUrl` fields
> - Updated `ToolCard` component — `<video>` replaces `<iframe>` when `videoUrl` exists
> - Updated `projects.ts` — bookSHelf entry with video paths
> 
> **Estimated Effort**: Medium
> **Parallel Execution**: YES — 3 waves
> **Critical Path**: T1 (ffmpeg) → T3 (recording) → T5 (video embed component) → T7 (build verify)

---

## Context

### Original Request
Create semi-polished promo videos for individual portfolio projects, embedded as autoplay muted loops in the project cards. Start with a pilot for bookSHelf. Interactive recording workflow — on each page load, pause and ask the user what to highlight. Use ghost cursor and viewport zoom for focus effects.

### Interview Summary
**Key Discussions**:
- **Promoting**: Individual projects to employers/hiring committees + fellow educators
- **First pilot**: bookSHelf site — navigate to "Applied Finite Math", highlight buttons/tools
- **Video behavior**: Autoplay muted loop in click-expand panel (replaces iframe)
- **Highlight style**: Viewport zoom via CSS `zoom` during recording for focus effects
- **Dimensions**: Match project card embed area (~672px wide, 610px tall panel)
- **Storage**: `public/` folder, committed to git (acceptable for pilot — ~3-5MB)
- **No audio/music**

**Research Findings**:
- Portfolio: Next.js 16 + React 19 + GSAP + Framer Motion + Tailwind
- Static export (`output: 'export'`) with `basePath: '/steven'` in production
- `ToolCard` in `ProjectGrid.tsx`: hover-expand body (description + buttons) + click-expand iframe panel (610px)
- bookSHelf currently has `iframeUrl: 'https://shuff57.github.io/bookSHelf/'`
- rāSHio has `externalUrl` (iframe blocked by X-Frame-Options — also a future video candidate)
- ffmpeg is NOT installed on this Windows system — needed for `createDemoVideo()`

### Metis Review
**Identified Gaps** (addressed):
- **ffmpeg not installed**: Added as prerequisite Task 1
- **basePath handling**: Video src must use `basePath` prefix — enforced in component code
- **Video placement UX ambiguity**: Resolved — video replaces iframe in click-expand panel (Preview button toggles it)
- **File size budget**: Set at ≤5MB hard limit
- **prefers-reduced-motion**: Video pauses on first frame for reduced-motion users
- **Poster image**: Added poster generation task for loading state
- **H.264 baseline**: Specified in recording/compression settings for Safari/iOS compatibility
- **Priority cascade**: `videoUrl` > `iframeUrl` > nothing — both can coexist in data
- **Loop continuity**: Recording should end on a similar visual state as start for smooth loop restart

---

## Work Objectives

### Core Objective
Record a polished demo video of the bookSHelf site and embed it in the portfolio project card, replacing the iframe preview with an autoplay muted video loop.

### Concrete Deliverables
- `public/videos/bookshelf-demo.mp4` — demo clip (10-30s, ≤5MB, H.264 baseline, dimensions matching embed area)
- `public/videos/bookshelf-demo-poster.jpg` — poster frame for loading state
- `src/data/projects.ts` — `Project` interface updated with `videoUrl?` and `posterUrl?` fields; bookSHelf data updated
- `src/components/sections/ProjectGrid.tsx` — `ToolCard` updated: renders `<video>` instead of `<iframe>` when `videoUrl` exists

### Definition of Done
- [ ] `npm run build` succeeds with zero errors
- [ ] `npx tsc --noEmit` exits 0
- [ ] Video plays as autoplay muted loop in the project card expand panel
- [ ] Video pauses on poster frame when `prefers-reduced-motion: reduce` is active
- [ ] Projects without `videoUrl` still render iframe as before (backward compatible)
- [ ] Video src path works in production (includes `/steven/` basePath prefix)

### Must Have
- Ghost cursor visible in recording
- At least one viewport zoom into a feature region during the demo
- Smooth idle compression via `createDemoVideo()`
- H.264 codec for universal browser support
- `poster` attribute on `<video>` element
- `prefers-reduced-motion` respected
- Backward compatible — iframe still works for projects without video

### Must NOT Have (Guardrails)
- ❌ No play/pause button overlay or custom video controls
- ❌ No loading spinners or extra JS for video loading
- ❌ No recording of other projects (bookSHelf only in this task)
- ❌ No video compression pipeline in build step
- ❌ No responsive/breakpoint-specific video files
- ❌ No analytics tracking on video views
- ❌ No audio tracks
- ❌ No ffmpeg post-processing beyond idle compression (zoom is done during recording)
- ❌ No Remotion or external video tooling
- ❌ Do not remove `iframeUrl` from bookSHelf data — keep as fallback

---

## Verification Strategy

> **ZERO HUMAN INTERVENTION** — ALL verification is agent-executed. No exceptions.
> Exception: The recording session (T3) requires user direction for content — this is by design, not a QA gap.

### Test Decision
- **Infrastructure exists**: YES (Next.js build, TypeScript compiler)
- **Automated tests**: None (no test framework in project; creative/media task)
- **Framework**: N/A

### QA Policy
Every task MUST include agent-executed QA scenarios.
Evidence saved to `.sisyphus/evidence/task-{N}-{scenario-slug}.{ext}`.

- **Video file**: Use Bash (ffprobe) — verify dimensions, duration, codec, file size
- **Component code**: Use Bash (tsc, next build) — verify build succeeds
- **Video embed**: Use Playwright — navigate to projects page, expand card, verify `<video>` element attributes

---

## Execution Strategy

### Parallel Execution Waves

```
Wave 1 (Start Immediately — prerequisites, 2 parallel):
├── Task 1: Install ffmpeg on Windows [quick]
└── Task 2: Pre-recording calibration — verify site, measure dimensions [quick]

Wave 2 (After Wave 1 — recording, sequential + interactive):
└── Task 3: Interactive recording session for bookSHelf demo [deep + playwriter]
    ⚠️ REQUIRES USER INTERACTION — agent pauses for direction at each page

Wave 3 (After Wave 2 — code integration, 3 parallel):
├── Task 4: Update Project type + bookSHelf data entry [quick]
├── Task 5: Update ToolCard — video embed replacing iframe [quick]
└── Task 6: Generate poster image from video first frame [quick]

Wave 4 (After Wave 3 — build + verify):
└── Task 7: Build verification + accessibility check [quick]

Wave FINAL (After ALL tasks — independent review, 4 parallel):
├── Task F1: Plan compliance audit (oracle)
├── Task F2: Code quality review (unspecified-high)
├── Task F3: Real manual QA (unspecified-high + playwright)
└── Task F4: Scope fidelity check (deep)

Critical Path: T1 → T3 → T5 → T7 → F1-F4
Parallel Speedup: ~40% faster than sequential
Max Concurrent: 3 (Wave 3)
```

### Dependency Matrix

| Task | Depends On | Blocks | Wave |
|------|-----------|--------|------|
| T1 | — | T3 | 1 |
| T2 | — | T3 | 1 |
| T3 | T1, T2 | T4, T5, T6 | 2 |
| T4 | T3 | T7 | 3 |
| T5 | T3, T4 | T7 | 3 |
| T6 | T3 | T7 | 3 |
| T7 | T4, T5, T6 | F1-F4 | 4 |
| F1-F4 | T7 | — | FINAL |

### Agent Dispatch Summary

- **Wave 1**: **2** — T1 → `quick`, T2 → `quick` + `playwriter`
- **Wave 2**: **1** — T3 → `deep` + `playwriter`
- **Wave 3**: **3** — T4 → `quick`, T5 → `quick`, T6 → `quick`
- **Wave 4**: **1** — T7 → `quick`
- **FINAL**: **4** — F1 → `oracle`, F2 → `unspecified-high`, F3 → `unspecified-high` + `playwright`, F4 → `deep`

---

## TODOs

> Implementation + Test = ONE Task. Never separate.
> EVERY task MUST have: Recommended Agent Profile + Parallelization info + QA Scenarios.
> **A task WITHOUT QA Scenarios is INCOMPLETE. No exceptions.**

- [x] 1. Install ffmpeg on Windows

  **What to do**:
  - Check if ffmpeg is already available: `ffmpeg -version`
  - If not installed, install via winget: `winget install Gyan.FFmpeg`
  - Verify installation: `ffmpeg -version` and `ffprobe -version`
  - Verify both commands are on PATH (may need to restart shell or add to PATH manually)

  **Must NOT do**:
  - Do not install via chocolatey or scoop — use winget
  - Do not modify system environment variables beyond adding ffmpeg to PATH if needed

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single tool installation, no code changes
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwriter`: Not needed — this is CLI only

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 2)
  - **Blocks**: Task 3 (recording requires ffmpeg for createDemoVideo)
  - **Blocked By**: None (can start immediately)

  **References**:

  **External References**:
  - ffmpeg Windows install: `winget install Gyan.FFmpeg`
  - Playwriter docs state: `createDemoVideo` requires `ffmpeg` and `ffprobe` installed on the system

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: ffmpeg is installed and on PATH
    Tool: Bash
    Preconditions: None
    Steps:
      1. Run `ffmpeg -version`
      2. Assert output contains "ffmpeg version"
      3. Run `ffprobe -version`
      4. Assert output contains "ffprobe version"
    Expected Result: Both commands succeed with version output
    Failure Indicators: "command not found" or "not recognized" error
    Evidence: .sisyphus/evidence/task-1-ffmpeg-installed.txt
  ```

  **Commit**: NO

- [x] 2. Pre-recording calibration — verify bookSHelf site and measure embed dimensions

  **What to do**:
  - Open the portfolio site locally (`npm run dev`) OR the live bookSHelf site
  - Navigate to `https://shuff57.github.io/bookSHelf/`
  - Verify the site loads within 3 seconds (GitHub Pages can be slow)
  - Measure the exact pixel dimensions of the ToolCard iframe embed area:
    - The card container is `max-w-2xl` (672px) with the iframe at 610px height
    - Use Playwriter to measure: `await state.page.locator('iframe').boundingBox()` on the portfolio, or use the known CSS values
  - Test ghost cursor visibility at the target viewport size
  - Record the exact dimensions to use for the recording viewport

  **Must NOT do**:
  - Do not start recording — this is calibration only
  - Do not modify any files

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Quick measurement/verification task
  - **Skills**: `['playwriter']`
    - `playwriter`: Needed to open browser, navigate, measure elements, test ghost cursor

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 1 (with Task 1)
  - **Blocks**: Task 3 (recording needs calibrated dimensions)
  - **Blocked By**: None (can start immediately)

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:129` — iframe panel max-height 660px
  - `src/components/sections/ProjectGrid.tsx:153` — iframe height 610px
  - `src/components/sections/ProjectGrid.tsx:319` — grid container `max-w-2xl` (672px)

  **External References**:
  - bookSHelf live site: `https://shuff57.github.io/bookSHelf/`
  - Portfolio site: `http://localhost:3000/projects` (dev) or production equivalent

  **WHY Each Reference Matters**:
  - `ProjectGrid.tsx:129,153` — These are the exact CSS dimensions the video must match. The recording viewport MUST be set to these dimensions.
  - `ProjectGrid.tsx:319` — The card container width constrains the video width. The video should be this wide or wider (CSS will scale it).

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: bookSHelf site loads successfully
    Tool: Playwriter
    Preconditions: Chrome is open with Playwriter extension enabled
    Steps:
      1. Navigate to https://shuff57.github.io/bookSHelf/
      2. Wait for page load (waitForPageLoad, timeout 10s)
      3. Take snapshot — verify page has content (not blank/error)
      4. Record load time
    Expected Result: Site loads within 5 seconds with visible content
    Failure Indicators: Blank page, 404 error, timeout
    Evidence: .sisyphus/evidence/task-2-site-loads.png

  Scenario: Ghost cursor is visible at target viewport
    Tool: Playwriter
    Preconditions: bookSHelf site loaded
    Steps:
      1. Set viewport to calibrated dimensions (e.g., 672x610)
      2. Show ghost cursor: `await ghostCursor.show({ page: state.page })`
      3. Move cursor to center of page
      4. Take screenshot — verify cursor is visible and appropriately sized
    Expected Result: Ghost cursor is clearly visible against page content
    Failure Indicators: Cursor invisible, too small, or obscured by page elements
    Evidence: .sisyphus/evidence/task-2-ghost-cursor.png
  ```

  **Evidence to Capture**:
  - [ ] Screenshot of bookSHelf site at target viewport dimensions
  - [ ] Screenshot showing ghost cursor visibility
  - [ ] Text file with exact dimensions to use for recording

  **Commit**: NO

---

- [ ] 3. Interactive recording session — bookSHelf demo video

  **⚠️ THIS TASK REQUIRES USER INTERACTION**
  The agent records the screen and controls the browser, but the USER directs what to show.
  At each page/section, the agent MUST pause and ask the user what to highlight next.
  Use the Question tool or direct chat to get user direction.

  **What to do**:
  - Open Chrome with Playwriter extension enabled on a new tab
  - Set viewport to calibrated dimensions from Task 2 (target: ~672×610)
  - Navigate to `https://shuff57.github.io/bookSHelf/`
  - Start recording: `await recording.start({ page: state.page, outputPath: './public/videos/bookshelf-raw.mp4', frameRate: 30 })`
  - Enable ghost cursor: `await ghostCursor.show({ page: state.page, style: 'minimal' })`
  - **INTERACTIVE LOOP**:
    1. Take snapshot of current page
    2. ASK USER: "What should I highlight on this page?" (use Question tool or chat)
    3. User directs: click X, hover Y, zoom into Z
    4. Perform directed interactions with smooth cursor movements (use `locator.click()`, `page.mouse.move()` with steps for visible motion)
    5. For zoom/focus: `await state.page.evaluate(() => { document.documentElement.style.zoom = '150%' })` — scroll target into view — pause 2s — zoom back to 100%
    6. On page navigation → wait for load → go to step 1
    7. Repeat until user says done
  - **LOOP POINT**: Try to end the recording on a visually similar state to the start (e.g., same page/section) for smooth loop restart
  - Stop recording: `const result = await recording.stop({ page: state.page })`
  - Create demo video with idle compression:
    ```
    const demoPath = await createDemoVideo({
      recordingPath: result.path,
      durationMs: result.duration,
      executionTimestamps: result.executionTimestamps,
      speed: 5,
      outputFile: './public/videos/bookshelf-demo.mp4'
    })
    ```
  - Verify output: check file size (must be ≤5MB), duration (10-30s), dimensions
  - If file too large: re-encode with lower bitrate using ffmpeg:
    `ffmpeg -i bookshelf-demo.mp4 -c:v libx264 -profile:v baseline -crf 28 -preset slow -an -movflags +faststart bookshelf-demo-final.mp4`

  **Must NOT do**:
  - Do not record other projects — bookSHelf only
  - Do not add audio tracks
  - Do not use ffmpeg filters/overlays beyond idle compression and optional re-encoding
  - Do not skip the user interaction loop — this is collaborative, not autonomous
  - Do not close the user's other browser tabs

  **Recommended Agent Profile**:
  - **Category**: `deep`
    - Reason: Complex interactive session requiring user collaboration, multiple Playwriter calls, viewport manipulation, recording management. Requires patience and careful coordination.
  - **Skills**: `['playwriter']`
    - `playwriter`: Core tool — browser control, recording, ghost cursor, createDemoVideo
  - **Skills Evaluated but Omitted**:
    - `playwright`: Different from playwriter — playwright is for testing, playwriter is for browser automation with recording

  **Parallelization**:
  - **Can Run In Parallel**: NO (sequential, interactive)
  - **Parallel Group**: Wave 2 (solo)
  - **Blocks**: Tasks 4, 5, 6 (all code integration tasks need the video file)
  - **Blocked By**: Task 1 (ffmpeg), Task 2 (calibrated dimensions)

  **References**:

  **External References**:
  - bookSHelf live site: `https://shuff57.github.io/bookSHelf/`
  - Playwriter recording API: `recording.start()`, `recording.stop()`, `createDemoVideo()`
  - Ghost cursor API: `ghostCursor.show()`, `ghostCursor.hide()`
  - CSS zoom: `document.documentElement.style.zoom` for viewport zoom during recording

  **WHY Each Reference Matters**:
  - The bookSHelf site is the recording target — the agent navigates it while recording
  - Playwriter recording APIs are the core tool for capture and post-processing
  - Ghost cursor provides the polished cursor animation visible in the video
  - CSS zoom is the chosen technique for focus/highlight effects

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Video file meets all specifications
    Tool: Bash (ffprobe)
    Preconditions: Recording complete, createDemoVideo() has run
    Steps:
      1. Run `ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_name -of csv=p=0 public/videos/bookshelf-demo.mp4`
      2. Assert codec is h264
      3. Assert dimensions match calibrated values (e.g., 672x610)
      4. Run `ffprobe -v error -show_entries format=duration -of csv=p=0 public/videos/bookshelf-demo.mp4`
      5. Assert duration is between 10.0 and 30.0 seconds
      6. Check file size: `powershell -Command "(Get-Item 'public/videos/bookshelf-demo.mp4').Length / 1MB"`
      7. Assert file size < 5.0 MB
    Expected Result: H.264 codec, correct dimensions, 10-30s duration, under 5MB
    Failure Indicators: Wrong codec, wrong dimensions, too long/short, file too large
    Evidence: .sisyphus/evidence/task-3-video-specs.txt

  Scenario: Ghost cursor is visible in recorded video
    Tool: Playwriter
    Preconditions: Video file exists
    Steps:
      1. Open the video file in a new browser tab (file:// or serve locally)
      2. Play for 2 seconds
      3. Take screenshot
      4. Verify cursor overlay is visible in the frame
    Expected Result: Ghost cursor clearly visible in at least one frame
    Failure Indicators: No cursor visible in any frame
    Evidence: .sisyphus/evidence/task-3-cursor-visible.png
  ```

  **Evidence to Capture**:
  - [ ] Video file: `public/videos/bookshelf-demo.mp4`
  - [ ] ffprobe output showing specs
  - [ ] Screenshot from recorded video showing ghost cursor

  **Commit**: YES (asset commit)
  - Message: `asset: add bookSHelf demo video`
  - Files: `public/videos/bookshelf-demo.mp4`
  - Pre-commit: `ffprobe -v error public/videos/bookshelf-demo.mp4` (verify file is valid)

---

- [ ] 4. Update Project type and bookSHelf data entry

  **What to do**:
  - In `src/data/projects.ts`, add two optional fields to the `Project` interface:
    - `videoUrl?: string` — path to demo video file
    - `posterUrl?: string` — path to poster/thumbnail image
  - Update the bookSHelf project entry to include:
    - `videoUrl: '/videos/bookshelf-demo.mp4'`
    - `posterUrl: '/videos/bookshelf-demo-poster.jpg'`
  - Keep `iframeUrl` on bookSHelf — do NOT remove it (serves as fallback reference)
  - Do NOT modify any other project entries

  **Must NOT do**:
  - Do not remove `iframeUrl` from bookSHelf
  - Do not add videoUrl/posterUrl to any other project
  - Do not change any existing field values

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Simple type addition + data update, 2 files, <10 lines changed
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwriter`: Not needed — no browser interaction

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 5, 6)
  - **Blocks**: Task 5 (component needs the type), Task 7 (build verify)
  - **Blocked By**: Task 3 (need video file path to reference)

  **References**:

  **Pattern References**:
  - `src/data/projects.ts:1-16` — `Project` interface definition (add `videoUrl?` and `posterUrl?` after `iframeUrl`)
  - `src/data/projects.ts:61-72` — bookSHelf project entry (add `videoUrl` and `posterUrl` fields here)

  **API/Type References**:
  - `src/data/projects.ts:12-14` — Existing optional URL fields (`externalUrl?`, `repoUrl?`, `iframeUrl?`) — follow same pattern

  **WHY Each Reference Matters**:
  - Lines 1-16 define the interface — new fields go here, matching the pattern of existing optional URL fields
  - Lines 61-72 are the bookSHelf entry — only this project gets video data in this task

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Project type has new video fields
    Tool: Bash (grep)
    Preconditions: File edited
    Steps:
      1. Run `grep -n 'videoUrl' src/data/projects.ts`
      2. Assert line exists with `videoUrl?: string`
      3. Run `grep -n 'posterUrl' src/data/projects.ts`
      4. Assert line exists with `posterUrl?: string`
    Expected Result: Both optional fields present in Project interface
    Failure Indicators: Fields missing or not optional (?)
    Evidence: .sisyphus/evidence/task-4-type-fields.txt

  Scenario: bookSHelf entry has video data
    Tool: Bash (grep)
    Preconditions: File edited
    Steps:
      1. Run `grep -A2 'bookshelf' src/data/projects.ts | grep 'videoUrl'`
      2. Assert contains '/videos/bookshelf-demo.mp4'
      3. Run `grep -A2 'bookshelf' src/data/projects.ts | grep 'posterUrl'`
      4. Assert contains '/videos/bookshelf-demo-poster.jpg'
      5. Run `grep -A1 'bookshelf' src/data/projects.ts | grep 'iframeUrl'`
      6. Assert iframeUrl is STILL present (not removed)
    Expected Result: bookSHelf has videoUrl, posterUrl, AND iframeUrl
    Failure Indicators: videoUrl missing, iframeUrl removed
    Evidence: .sisyphus/evidence/task-4-bookshelf-data.txt

  Scenario: TypeScript compiles cleanly
    Tool: Bash
    Preconditions: File edited
    Steps:
      1. Run `npx tsc --noEmit`
      2. Assert exit code 0
    Expected Result: No type errors
    Failure Indicators: Type errors in any file
    Evidence: .sisyphus/evidence/task-4-tsc.txt
  ```

  **Commit**: YES (groups with T5)
  - Message: `feat(projects): add video embed support to project cards`
  - Files: `src/data/projects.ts`
  - Pre-commit: `npx tsc --noEmit`

- [ ] 5. Update ToolCard — video embed replacing iframe

  **What to do**:
  - In `src/components/sections/ProjectGrid.tsx`, modify the `ToolCard` component:
  - **Priority cascade logic**: If project has `videoUrl`, render `<video>`. Else if `iframeUrl`, render `<iframe>`. Else render nothing.
  - **Video element requirements**:
    ```tsx
    <video
      src={project.videoUrl}
      poster={project.posterUrl}
      autoPlay
      loop
      muted
      playsInline
      className="w-full block"
      style={{ height: '610px', objectFit: 'cover' }}
    />
    ```
  - **basePath handling**: The video `src` must work in production. Use Next.js basePath:
    - Import or reference basePath: Since this is a static export, prefix paths with `process.env.NODE_ENV === 'production' ? '/steven' : ''`
    - OR use a utility: `const prefix = typeof window !== 'undefined' && window.location.pathname.startsWith('/steven') ? '/steven' : ''`
    - Simplest approach: hardcode basePath check matching `next.config.ts` pattern
  - **`prefers-reduced-motion` support**:
    - Use a React hook or `useEffect` to detect `prefers-reduced-motion: reduce`
    - When active: pause the video on load (show poster frame instead)
    - Implementation: `useEffect` with `matchMedia('(prefers-reduced-motion: reduce)')` listener, call `videoRef.current.pause()` if matched
  - **Preview button label**: Change text from "Preview" to "Demo" when `videoUrl` exists (optional, minor UX polish)
  - **Keep existing iframe code path**: The `<iframe>` rendering must still work for projects that only have `iframeUrl`

  **Must NOT do**:
  - Do not add custom play/pause controls or overlays
  - Do not add loading spinners
  - Do not add analytics
  - Do not change the expand/collapse animation
  - Do not modify the hover-expand body section
  - Do not touch other components

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single component modification, clear spec, <30 lines of changes
  - **Skills**: `[]`
  - **Skills Evaluated but Omitted**:
    - `playwriter`: Component editing doesn't need browser automation
    - `visual-engineering`: Changes are functional, not design-oriented

  **Parallelization**:
  - **Can Run In Parallel**: YES (but needs T4 types first)
  - **Parallel Group**: Wave 3 (with Tasks 4, 6 — but T5 depends on T4)
  - **Blocks**: Task 7 (build verify)
  - **Blocked By**: Task 3 (need video file), Task 4 (need updated type)

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx:104-118` — Existing `iframeUrl` conditional rendering and Preview button — add `videoUrl` check BEFORE this block
  - `src/components/sections/ProjectGrid.tsx:124-157` — Existing iframe panel — add video panel using same expand/collapse pattern
  - `src/components/sections/ProjectGrid.tsx:152-154` — Existing `<iframe>` element — model the `<video>` element on this (same slot, same sizing)

  **API/Type References**:
  - `src/data/projects.ts:Project` — Type interface (updated by T4) — `videoUrl?` and `posterUrl?` fields
  - `next.config.ts:8` — basePath pattern: `isProd ? '/steven' : ''` — replicate for video src

  **WHY Each Reference Matters**:
  - Lines 104-118: This is WHERE the priority cascade goes — check `videoUrl` before `iframeUrl`
  - Lines 124-157: This is the expand panel that currently holds the iframe — the video goes in the SAME structural slot
  - Lines 152-154: The existing `<iframe>` element shows the exact sizing and styling to replicate for `<video>`
  - `next.config.ts:8`: The basePath logic must be replicated — hardcoded paths will break in production

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Video element renders with correct attributes
    Tool: Bash (grep)
    Preconditions: Component file edited
    Steps:
      1. Run `grep -n '<video' src/components/sections/ProjectGrid.tsx`
      2. Assert `<video` tag exists
      3. Run `grep -c 'autoPlay\|muted\|loop\|playsInline\|poster' src/components/sections/ProjectGrid.tsx`
      4. Assert all 5 attributes are present
    Expected Result: `<video>` element with autoPlay, muted, loop, playsInline, poster
    Failure Indicators: Missing attributes, especially muted (autoplay won't work without it)
    Evidence: .sisyphus/evidence/task-5-video-attrs.txt

  Scenario: prefers-reduced-motion is handled
    Tool: Bash (grep)
    Preconditions: Component file edited
    Steps:
      1. Run `grep -n 'prefers-reduced-motion' src/components/sections/ProjectGrid.tsx`
      2. Assert at least one match exists
    Expected Result: Media query check present in component
    Failure Indicators: No prefers-reduced-motion handling
    Evidence: .sisyphus/evidence/task-5-reduced-motion.txt

  Scenario: basePath prefix applied to video src
    Tool: Bash (grep)
    Preconditions: Component file edited
    Steps:
      1. Run `grep -n 'steven\|basePath\|prefix' src/components/sections/ProjectGrid.tsx`
      2. Assert video src includes basePath logic
    Expected Result: Video path is prefixed correctly for production deployment
    Failure Indicators: Hardcoded `/videos/...` without basePath prefix
    Evidence: .sisyphus/evidence/task-5-basepath.txt

  Scenario: Iframe still works for non-video projects
    Tool: Bash (grep)
    Preconditions: Component file edited
    Steps:
      1. Run `grep -n '<iframe' src/components/sections/ProjectGrid.tsx`
      2. Assert `<iframe>` tag still exists in the component
      3. Verify the conditional rendering: videoUrl check comes before iframeUrl check
    Expected Result: Both `<video>` and `<iframe>` paths exist in the component
    Failure Indicators: `<iframe>` removed entirely, or no conditional branching
    Evidence: .sisyphus/evidence/task-5-iframe-fallback.txt

  Scenario: Build succeeds
    Tool: Bash
    Preconditions: Component file edited
    Steps:
      1. Run `npm run build`
      2. Assert exit code 0
    Expected Result: Build completes without errors
    Failure Indicators: Build errors mentioning ProjectGrid or video
    Evidence: .sisyphus/evidence/task-5-build.txt
  ```

  **Commit**: YES (groups with T4)
  - Message: `feat(projects): add video embed support to project cards`
  - Files: `src/components/sections/ProjectGrid.tsx`
  - Pre-commit: `npx tsc --noEmit && npm run build`

- [ ] 6. Generate poster image from video first frame

  **What to do**:
  - Extract the first frame of the demo video as a JPEG poster image
  - Command: `ffmpeg -i public/videos/bookshelf-demo.mp4 -vframes 1 -q:v 2 public/videos/bookshelf-demo-poster.jpg`
  - Verify the poster image:
    - Dimensions match video dimensions
    - File size is reasonable (<500KB)
    - Image is not blank/black
  - This poster is referenced by the `<video poster="...">` attribute and shown during video load and for `prefers-reduced-motion` users

  **Must NOT do**:
  - Do not create multiple poster images or thumbnails
  - Do not modify the video file
  - Do not add image optimization pipeline

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Single ffmpeg command + verification
  - **Skills**: `[]`

  **Parallelization**:
  - **Can Run In Parallel**: YES
  - **Parallel Group**: Wave 3 (with Tasks 4, 5)
  - **Blocks**: Task 7 (poster needed for full QA)
  - **Blocked By**: Task 3 (need video file to extract frame from)

  **References**:

  **External References**:
  - ffmpeg frame extraction: `ffmpeg -i input.mp4 -vframes 1 -q:v 2 output.jpg`

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Poster image exists and matches video dimensions
    Tool: Bash (ffprobe)
    Preconditions: Video file exists at public/videos/bookshelf-demo.mp4
    Steps:
      1. Run `ffmpeg -i public/videos/bookshelf-demo.mp4 -vframes 1 -q:v 2 public/videos/bookshelf-demo-poster.jpg`
      2. Verify file exists: `ls public/videos/bookshelf-demo-poster.jpg`
      3. Check dimensions: `ffprobe -v error -select_streams v:0 -show_entries stream=width,height -of csv=p=0 public/videos/bookshelf-demo-poster.jpg`
      4. Assert dimensions match video dimensions
      5. Check file size: `powershell -Command "(Get-Item 'public/videos/bookshelf-demo-poster.jpg').Length / 1KB"`
      6. Assert file size < 500 KB
    Expected Result: JPEG poster image with matching dimensions, under 500KB
    Failure Indicators: File missing, wrong dimensions, file too large, blank image
    Evidence: .sisyphus/evidence/task-6-poster.txt
  ```

  **Commit**: YES (groups with T3 asset commit)
  - Message: `asset: add bookSHelf demo video and poster`
  - Files: `public/videos/bookshelf-demo-poster.jpg`
  - Pre-commit: `ls public/videos/bookshelf-demo-poster.jpg`

- [ ] 7. Build verification and accessibility check

  **What to do**:
  - Run full build: `npm run build`
  - Run TypeScript check: `npx tsc --noEmit`
  - Verify all deliverables are in place:
    - `public/videos/bookshelf-demo.mp4` exists
    - `public/videos/bookshelf-demo-poster.jpg` exists
    - `src/data/projects.ts` has `videoUrl` field and bookSHelf data
    - `src/components/sections/ProjectGrid.tsx` has `<video>` element
  - Run dev server and verify video plays in browser:
    - Start `npm run dev`
    - Navigate to `http://localhost:3000/projects`
    - Expand bookSHelf card → click Preview/Demo button
    - Verify video autoplays, is muted, and loops
  - Test `prefers-reduced-motion`:
    - In Chrome DevTools → Rendering → Emulate CSS media feature `prefers-reduced-motion: reduce`
    - Verify video shows poster frame and does not autoplay
  - Test backward compatibility:
    - Verify a project without videoUrl (e.g., D.A.D) still shows normal card behavior
    - If it had an iframeUrl, verify iframe still works

  **Must NOT do**:
  - Do not modify any source files — this is verification only
  - Do not deploy

  **Recommended Agent Profile**:
  - **Category**: `quick`
    - Reason: Verification and testing only, no code changes
  - **Skills**: `['playwriter']`
    - `playwriter`: Needed to verify video plays in browser, test reduced-motion, test backward compatibility

  **Parallelization**:
  - **Can Run In Parallel**: NO (depends on all Wave 3 tasks)
  - **Parallel Group**: Wave 4 (solo)
  - **Blocks**: Final verification wave
  - **Blocked By**: Tasks 4, 5, 6

  **References**:

  **Pattern References**:
  - `src/components/sections/ProjectGrid.tsx` — the modified component to verify
  - `src/data/projects.ts` — the modified data to verify
  - `public/videos/` — the video and poster files to verify

  **Acceptance Criteria**:

  **QA Scenarios (MANDATORY):**

  ```
  Scenario: Full build succeeds
    Tool: Bash
    Preconditions: All code changes complete (T4, T5)
    Steps:
      1. Run `npm run build`
      2. Assert exit code 0
      3. Run `npx tsc --noEmit`
      4. Assert exit code 0
    Expected Result: Both commands succeed
    Failure Indicators: Build or type errors
    Evidence: .sisyphus/evidence/task-7-build.txt

  Scenario: Video autoplays in browser
    Tool: Playwriter
    Preconditions: Dev server running (`npm run dev`)
    Steps:
      1. Navigate to `http://localhost:3000/projects`
      2. Hover over bookSHelf card to expand body
      3. Click the Preview/Demo button to expand panel
      4. Wait 2 seconds
      5. Verify `<video>` element exists in DOM
      6. Verify video is playing: `await state.page.evaluate(() => !document.querySelector('video').paused)`
      7. Verify video is muted: `await state.page.evaluate(() => document.querySelector('video').muted)`
      8. Take screenshot showing video playing
    Expected Result: Video is autoplaying, muted, in the expand panel
    Failure Indicators: Video not found, video paused, video not muted
    Evidence: .sisyphus/evidence/task-7-video-playing.png

  Scenario: prefers-reduced-motion pauses video
    Tool: Playwriter
    Preconditions: Dev server running, video panel expanded
    Steps:
      1. Emulate reduced motion: `await state.page.emulateMedia({ reducedMotion: 'reduce' })`
      2. Reload page and re-expand bookSHelf card
      3. Verify video is paused: `await state.page.evaluate(() => document.querySelector('video').paused)`
      4. Verify poster is showing
    Expected Result: Video paused on poster frame
    Failure Indicators: Video still autoplaying despite reduced motion
    Evidence: .sisyphus/evidence/task-7-reduced-motion.png

  Scenario: Non-video project card works normally
    Tool: Playwriter
    Preconditions: Dev server running
    Steps:
      1. Navigate to `http://localhost:3000/projects`
      2. Hover over D.A.D card (no videoUrl, no iframeUrl)
      3. Verify card expands on hover showing description
      4. Verify no video or iframe element present
      5. If any project has iframeUrl without videoUrl, verify iframe still renders
    Expected Result: Non-video projects unaffected by changes
    Failure Indicators: Cards broken, missing content, JavaScript errors
    Evidence: .sisyphus/evidence/task-7-backward-compat.png
  ```

  **Commit**: NO (verification only)

---

## Final Verification Wave (MANDATORY — after ALL implementation tasks)

> 4 review agents run in PARALLEL. ALL must APPROVE. Rejection → fix → re-run.

- [ ] F1. **Plan Compliance Audit** — `oracle`
  Read the plan end-to-end. For each "Must Have": verify implementation exists (read file, run ffprobe on video, check component code). For each "Must NOT Have": search codebase for forbidden patterns — reject with file:line if found. Check evidence files exist in .sisyphus/evidence/. Compare deliverables against plan.
  Output: `Must Have [N/N] | Must NOT Have [N/N] | Tasks [N/N] | VERDICT: APPROVE/REJECT`

- [ ] F2. **Code Quality Review** — `unspecified-high`
  Run `npx tsc --noEmit` + `npm run build`. Review all changed files for: `as any`/`@ts-ignore`, empty catches, console.log in prod, commented-out code, unused imports. Check AI slop: excessive comments, over-abstraction, generic names (data/result/item/temp). Verify video element has all required attributes (autoPlay, muted, loop, playsInline, poster). Verify basePath handling.
  Output: `Build [PASS/FAIL] | TypeScript [PASS/FAIL] | Files [N clean/N issues] | VERDICT`

- [ ] F3. **Real Manual QA** — `unspecified-high` (+ `playwright` skill)
  Start dev server (`npm run dev`). Navigate to `/projects`. Hover over bookSHelf card to expand. Click "Preview" button to expand video panel. Verify: video autoplays, is muted, loops, shows ghost cursor in content. Test with `prefers-reduced-motion: reduce` in Chrome DevTools — verify video pauses. Test a project without video (e.g., D.A.D) — verify card still works normally. Take screenshots as evidence. Save to `.sisyphus/evidence/final-qa/`.
  Output: `Scenarios [N/N pass] | Integration [N/N] | Edge Cases [N tested] | VERDICT`

- [ ] F4. **Scope Fidelity Check** — `deep`
  For each task: read "What to do", read actual diff (git log/diff). Verify 1:1 — everything in spec was built (no missing), nothing beyond spec was built (no creep). Check "Must NOT do" compliance. Flag: custom video controls (forbidden), extra JS loading logic (forbidden), changes to non-bookSHelf project data (forbidden), audio tracks (forbidden). Flag unaccounted changes.
  Output: `Tasks [N/N compliant] | Contamination [CLEAN/N issues] | Unaccounted [CLEAN/N files] | VERDICT`

---

## Commit Strategy

- **After T4+T5+T6**: `feat(projects): add video embed support to project cards` — `src/data/projects.ts`, `src/components/sections/ProjectGrid.tsx`
- **After T3+T6**: `asset: add bookSHelf demo video and poster` — `public/videos/bookshelf-demo.mp4`, `public/videos/bookshelf-demo-poster.jpg`

---

## Success Criteria

### Verification Commands
```bash
# Video file exists and meets specs
ffprobe -v error -select_streams v:0 -show_entries stream=width,height,codec_name -of csv=p=0 public/videos/bookshelf-demo.mp4
# Expected: h264,672,610 (or matching embed dimensions)

ffprobe -v error -show_entries format=duration -of csv=p=0 public/videos/bookshelf-demo.mp4
# Expected: between 10.0 and 30.0

# File size under 5MB
powershell -Command "(Get-Item 'public/videos/bookshelf-demo.mp4').Length / 1MB"
# Expected: < 5.0

# Poster exists
ls public/videos/bookshelf-demo-poster.jpg

# Build succeeds
npm run build
# Expected: exit 0

# TypeScript clean
npx tsc --noEmit
# Expected: exit 0

# videoUrl field exists
grep -n "videoUrl" src/data/projects.ts
# Expected: field definition + bookshelf entry

# Video element in component
grep -n "<video" src/components/sections/ProjectGrid.tsx
# Expected: video tag with autoPlay muted loop playsInline

# prefers-reduced-motion handled
grep -n "prefers-reduced-motion" src/components/sections/ProjectGrid.tsx
# Expected: media query or hook usage
```

### Final Checklist
- [ ] All "Must Have" present
- [ ] All "Must NOT Have" absent
- [ ] `npm run build` passes
- [ ] `npx tsc --noEmit` passes
- [ ] Video plays correctly in dev server
- [ ] Backward compatible — non-video projects unaffected
