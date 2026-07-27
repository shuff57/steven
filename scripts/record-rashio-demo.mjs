// rāSHio demo recorder — adapted from rashio-videos/rig/record.mjs.
//
// Runs INSIDE the raSHio repo (needs its @playwright/test + vite), NOT here:
//   cp scripts/record-rashio-demo.mjs <raSHio repo>/_record.mjs
//   cd <raSHio repo> && npm run build && node _record.mjs   -> rn_video/rashio.webm
//   ffmpeg -i rn_video/rashio.webm -c:v libx264 -preset slow -crf 18 \
//     -pix_fmt yuv420p -r 30 -an <steven>/public/videos/raw/rashio-demo.mp4
//   rm <steven>/public/videos/rashio-demo.mp4 && npm run compress-videos
//   rm -rf _record.mjs rn_video   # nothing transient is committed to raSHio
//
// Records the LOCAL build because rashio.app gates /stats.html behind /signin —
// the local preview has no auth gate. Rebuild first or you capture stale styles.

import { chromium } from '@playwright/test'
import { preview } from 'vite'
import fs from 'fs'

const PORT = Number(process.env.RN_PORT || 4183)
const OUTDIR = process.env.RN_OUTDIR || 'rn_video'
const ACCENT = '#7a9bbf' // raSHio dark-theme --accent

const server = await preview({ preview: { port: PORT, strictPort: true } })
const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: OUTDIR, size: { width: 1280, height: 720 } },
})

await ctx.addInitScript((accent) => {
  const build = () => {
    const cur = document.createElement('div')
    Object.assign(cur.style, {
      position: 'fixed', width: '20px', height: '20px', borderRadius: '50%',
      background: 'rgba(122,155,191,0.9)', border: '2.5px solid #ffffff',
      boxShadow: '0 1px 6px rgba(0,0,0,0.5)', zIndex: '2147483647',
      pointerEvents: 'none', left: '-60px', top: '-60px',
      transform: 'translate(-50%,-50%)', transition: 'none',
    })
    document.body.appendChild(cur)
    window.addEventListener('mousemove', (e) => {
      cur.style.left = e.clientX + 'px'
      cur.style.top = e.clientY + 'px'
    }, true)
    window.__click = () => cur.animate([
      { transform: 'translate(-50%,-50%) scale(1)' },
      { transform: 'translate(-50%,-50%) scale(0.55)' },
      { transform: 'translate(-50%,-50%) scale(1)' },
    ], { duration: 280 })

    const bar = document.createElement('div')
    Object.assign(bar.style, {
      position: 'fixed', left: '50%', bottom: '20px', transform: 'translateX(-50%)',
      padding: '11px 24px', borderRadius: '10px', zIndex: '2147483646',
      background: 'rgba(18,20,23,0.93)', color: '#eceae4',
      border: `2px solid ${accent}`, display: 'none',
      font: '600 20px "Segoe UI", system-ui, sans-serif', pointerEvents: 'none',
      boxShadow: '0 4px 18px rgba(0,0,0,0.45)', whiteSpace: 'nowrap',
    })
    document.body.appendChild(bar)
    window.__caption = (n, text) => {
      bar.style.display = 'block'
      bar.innerHTML = n
        ? `<span style="display:inline-block;width:27px;height:27px;border-radius:50%;background:${accent};color:#12151a;text-align:center;line-height:27px;margin-right:11px;font-size:16px;vertical-align:middle;font-weight:700;">${n}</span><span style="vertical-align:middle;">${text}</span>`
        : text
    }
    // Hide during long smooth scrolls: a caption left up while the page travels
    // ends up describing whichever section is NOT on screen.
    window.__captionHide = () => { bar.style.display = 'none' }
    window.__hl = (el) => {
      el.style.outline = `3px solid ${accent}`
      el.style.outlineOffset = '3px'
    }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build)
  else build()
}, ACCENT)

const page = await ctx.newPage()

const wait = (ms) => page.waitForTimeout(ms)
const caption = (n, t) => page.evaluate(([a, b]) => window.__caption?.(a, b), [n, t])
const captionHide = () => page.evaluate(() => window.__captionHide?.())
const highlight = (loc) => loc.evaluate((el) => window.__hl(el)).catch(() => {})
const menu = (label) => page.locator('.menu-trigger-label', { hasText: label }).first()
const glide = async (loc, ms = 450) => {
  const b = await loc.boundingBox()
  if (!b) return
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 26 })
  await wait(ms)
}
const click = async (loc) => {
  await glide(loc, 300)
  await page.evaluate(() => window.__click?.())
  await loc.click()
}
const park = async (x = 1120, y = 620) => { await page.mouse.move(x, y, { steps: 18 }) }

await page.goto(`http://localhost:${PORT}/stats.html`, { waitUntil: 'networkidle' })
await wait(2200)
// jspreadsheet's one-shot theme repaint races recording overhead — force it.
await page.evaluate(() => document.getElementById('spreadsheet')?.jexcel?.refresh?.())
await wait(600)

// Series standard — clean open: the Analysis Panel loads `open` at 480px and
// eats the right third of the frame. Close it so the spreadsheet fills the
// shot. This preamble is on camera (Playwright records from page load), so
// head-trim it at encode time: ffmpeg -ss 3.5 …
const drawerClose = page.locator('.analysis-drawer-close')
if (await drawerClose.isVisible().catch(() => false)) {
  await drawerClose.click()
  await wait(900)
}
await wait(500)

/* ════════════════════ SCENARIO ════════════════════ */

await page.mouse.move(640, 400)
await caption(null, 'rāSHio — statistics built for the intro student')
await wait(2800)

// ── 1. Load a real dataset ──
await caption(1, 'File → Load Sample Data')
await wait(700)
await click(menu('File'))
await wait(600)
const loadItem = page.locator('text=Load Sample Data').first()
await highlight(loadItem)
await wait(500)
await click(loadItem)
await wait(1400)

const sel = page.locator('[class*=modal] select').first()
await click(sel)
await sel.selectOption({ label: 'GPA & Study Habits (OpenIntro)' }).catch(() => {})
await wait(1100)
await caption(1, 'Real OpenIntro datasets, one click')
await wait(1200)
await click(page.locator('button:has-text("Load Preset")').first())
await wait(2200)
await park(1150, 640)
await caption(null, '')
await wait(1400)

// ── 2. Summary statistics ──
await caption(2, 'Summary statistics without the syntax')
await wait(800)
await click(menu('Stats'))
await wait(600)
await click(page.locator('text=Summary Statistics').first())
await wait(1500)
const colSel = page.locator('[class*=modal] select').first()
await click(colSel)
await colSel.selectOption({ label: 'Gpa' }).catch(() => {})
await wait(900)
await click(page.locator('button:has-text("Calculate")').first())
await wait(2600)
await park(1150, 640)
await wait(2400)

// ── 3. Histogram ──
await caption(3, 'Charts that follow the data')
await wait(700)
await click(menu('Graph'))
await wait(600)
await click(page.locator('text=Histogram').first())
await wait(1600)
const hSel = page.locator('[class*=modal] select').first()
await click(hSel)
await hSel.selectOption({ label: 'Gpa' }).catch(() => {})
await wait(900)
// The histogram modal's submit is labelled "Calculate", same as Summary Statistics.
await click(page.locator('[class*=modal] button:has-text("Calculate")').first())
await wait(3000)
await park(1150, 640)
await wait(2200)

// ── 4. Interactive distribution ──
await caption(4, 'Distributions with the area shaded as you type')
await wait(700)
await click(menu('Distributions'))
await wait(600)
await click(page.locator('text=Normal').first())
await wait(1800)
const cutoff = page.locator('[class*=normal-calculator-modal] input').nth(2)
await click(cutoff).catch(() => {})
await cutoff.fill('').catch(() => {})
await cutoff.pressSequentially('1.25', { delay: 220 }).catch(() => {})
await wait(2600)
await park(1150, 640)
await wait(2000)

// ── 5. Teacher side ──
// The real classes/roster UI needs /api + a signed-in teacher, which the plain
// vite preview does not serve. educators.html is the teacher-facing surface
// that renders fully offline.
await caption(5, 'Free for verified teachers')
await wait(900)
await page.goto(`http://localhost:${PORT}/educators.html`, { waitUntil: 'networkidle' })
await wait(1800)
await page.mouse.move(640, 380)
await caption(5, 'Classes, join codes, rosters, co-teachers')
await wait(3000)

// Hide the caption for the duration of each scroll, then label the section once
// it has settled. Timing the caption against a smooth scroll either leads it or
// lags it — both put the wrong words over the wrong section.
const scrollToHeading = async (text, label, hold) => {
  await captionHide()
  await page
    .locator('h2', { hasText: text })
    .first()
    .evaluate((el) => el.scrollIntoView({ behavior: 'smooth', block: 'center' }))
    .catch(() => {})
  await wait(1400)
  await caption(5, label)
  await wait(hold)
}

await scrollToHeading('Two class periods at a glance', 'Two class periods at a glance', 3400)
await scrollToHeading('Six characters', 'Students join with a six-character code', 3000)

await caption(null, 'rashio.app')
await wait(2600)

/* ════════════════════ end SCENARIO ════════════════════ */

const video = page.video()
await ctx.close()
fs.renameSync(await video.path(), `${OUTDIR}/rashio.webm`)
await browser.close()
await server.close()
console.log('recorded ->', `${OUTDIR}/rashio.webm`)
process.exit(0)
