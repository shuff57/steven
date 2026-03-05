# Promo Video Pilot — Learnings

## Task 3: Interactive Recording Session

### Blocker: Playwriter Extension activeTab Permission
- `recording.start()` requires the Playwriter extension icon to be **manually clicked** on the target tab before recording can begin
- Without this click, Chrome's `chrome.tabCapture` API has no `activeTab` permission and throws: `"Extension has not been invoked for the current page"`
- **Alternative**: Restart Chrome with `--allowlisted-extension-id=... --auto-accept-this-tab-capture` flags — but this closes ALL Chrome windows, violating the "do not close user's other browser tabs" constraint

### What Worked
- ffmpeg 8.0.1 confirmed available via PATH: `/c/Users/shuff/AppData/Local/Microsoft/WinGet/Packages/Gyan.FFmpeg_Microsoft.Winget.Source_8wekyb3d8bbwe/ffmpeg-8.0.1-full_build/bin`
- Viewport set to 672×610 successfully
- bookSHelf page loads and renders correctly at that viewport
- `public/videos/` directory created

### What Didn't Work (Initially)
- Cannot start recording without user clicking extension icon on the tab — resolved on retry
- `createDemoVideo()` failed because ffprobe wasn't in the playwriter process PATH (Node sandbox has its own PATH)
- Workaround: used ffmpeg directly via bash for post-processing
- Link clicks on bookSHelf index page intercepted by overlay elements — used `goto()` for navigation instead
- Raw recording captured at 1920x1200 (full screen) not 672x610 (viewport) — needed ffmpeg scale

### Post-Processing Pipeline
- Raw: VP9 1920x1200, 201s, 4.7MB
- Processed: H.264 672x610, 25.2s, 213KB
- Command: `ffmpeg -y -i raw.mp4 -vf "setpts=PTS/8,scale=672:610:force_original_aspect_ratio=disable" -c:v libx264 -preset medium -crf 23 -an -r 30 demo.mp4`
- 8x speedup brought 201s → 25s (within 10-30s target)
- CRF 23 + no audio = very small file (213KB vs 5MB limit)

### Demo Sequence Recorded
1. Index page — hover title, scroll section list
2. Zoom 150% into "Introduction to Matrices" link area
3. Navigate to section 2.1 content page
4. Scroll through rich content (tables, math, definitions)
5. Open Sections dropdown navigation
6. Toggle dark mode — scroll in dark theme
7. Zoom 150% on math content
8. Toggle back to light mode
9. Return to index page (loop point)

### Recommendations for Future Runs
1. **Pre-flight check**: Before dispatching recording tasks, verify Chrome was launched with `--auto-accept-this-tab-capture` flag OR instruct user to click extension icon first
2. **Chrome launch step**: Add an explicit task to restart Chrome with recording flags BEFORE the recording task
3. **Task dependency**: Recording tasks should depend on a "Chrome ready for capture" gate
4. **ffmpeg in playwriter PATH**: `createDemoVideo()` needs ffprobe accessible from the Node sandbox — either symlink or set PATH in the playwriter process
5. **Force clicks**: bookSHelf index page has overlay elements that intercept clicks — use `{ force: true }` or direct `goto()` navigation
