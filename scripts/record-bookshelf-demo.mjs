// bookSHelf demo recorder — adapted from rashio-videos/rig/record.mjs.
// Records a scripted walkthrough of the live oerbookshelf.app to bs_video/bs.webm
// with a synthetic cursor (click pulse), caption bar, and highlight rings.
// Palette matches bookSHelf (--wedgwood #4e6e8e) rather than raSHio's orange.
//
// Playwright is NOT a dependency of this repo — run it from a scratch dir:
//   npm i playwright && npx playwright install chromium
//   node record-bookshelf-demo.mjs                        -> bs_video/bs.webm
//   ffmpeg -i bs_video/bs.webm -c:v libx264 -preset slow -crf 18 \
//     -pix_fmt yuv420p -r 30 -an ../public/videos/raw/bookSHelf-demo.mp4
//   rm ../public/videos/bookSHelf-demo.mp4 && npm run compress-videos
//
// Records against the LIVE site, so a bookSHelf redesign can break the
// selectors — the SCENARIO block below is the only part that needs rewriting.

import { chromium } from 'playwright'
import fs from 'fs'

const OUTDIR = process.env.BS_OUTDIR || 'bs_video'
const ACCENT = '#4e6e8e'
const HOME = 'https://oerbookshelf.app/'
const SECTION = 'https://oerbookshelf.app/calculus-volume-1/3.1_defining_the_derivative'

const browser = await chromium.launch()
const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: OUTDIR, size: { width: 1280, height: 720 } },
})

// ── overlay rig: re-injected on every navigation ──
await ctx.addInitScript((accent) => {
  const build = () => {
    const cur = document.createElement('div')
    Object.assign(cur.style, {
      position: 'fixed', width: '20px', height: '20px', borderRadius: '50%',
      background: 'rgba(78,110,142,0.88)', border: '2.5px solid #ffffff',
      boxShadow: '0 1px 6px rgba(0,0,0,0.45)', zIndex: '2147483647',
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
      position: 'fixed', left: '50%', bottom: '22px', transform: 'translateX(-50%)',
      padding: '11px 24px', borderRadius: '10px', zIndex: '2147483646',
      background: 'rgba(20,20,19,0.90)', color: '#f5f4ed',
      border: `2px solid ${accent}`, display: 'none',
      font: '600 20px "Segoe UI", system-ui, sans-serif', pointerEvents: 'none',
      boxShadow: '0 4px 18px rgba(0,0,0,0.35)', whiteSpace: 'nowrap',
      maxWidth: '92vw', overflow: 'hidden', textOverflow: 'ellipsis',
    })
    document.body.appendChild(bar)
    window.__caption = (n, text) => {
      bar.style.display = 'block'
      bar.innerHTML = n
        ? `<span style="display:inline-block;width:27px;height:27px;border-radius:50%;background:${accent};color:#fff;text-align:center;line-height:27px;margin-right:11px;font-size:16px;vertical-align:middle;">${n}</span><span style="vertical-align:middle;">${text}</span>`
        : text
    }
    window.__hl = (el) => {
      el.style.outline = `3px solid ${accent}`
      el.style.outlineOffset = '4px'
      el.style.borderRadius = '4px'
    }
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', build)
  } else {
    build()
  }
}, ACCENT)

const page = await ctx.newPage()

/* ── helpers ── */
const wait = (ms) => page.waitForTimeout(ms)
const caption = (n, text) => page.evaluate(([a, b]) => window.__caption?.(a, b), [n, text])
const highlight = (loc) => loc.evaluate((el) => window.__hl(el)).catch(() => {})

const glide = async (loc, ms = 500) => {
  const b = await loc.boundingBox()
  if (!b) return
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 28 })
  await wait(ms)
}
const click = async (loc) => {
  await glide(loc, 320)
  await page.evaluate(() => window.__click?.())
  await loc.click()
}
// Smooth-scroll an element to the given viewport fraction and settle.
const scrollTo = async (loc, block = 'center', settle = 900) => {
  await loc.evaluate((el, b) => el.scrollIntoView({ behavior: 'smooth', block: b }), block)
  await wait(settle)
}
// Park the cursor clear of the caption bar.
const park = async (x = 1120, y = 200) => { await page.mouse.move(x, y, { steps: 20 }); }

/* ════════════════════ SCENARIO ════════════════════ */

// ── 1. Home ──
await page.goto(HOME, { waitUntil: 'networkidle' })
await wait(1400)
await page.mouse.move(640, 380)
await caption(null, 'bookSHelf — open textbooks, rebuilt for students')
await wait(2600)

const calcCard = page.locator('.book-card', { hasText: 'Calculus Volume 1' }).first()
await scrollTo(calcCard, 'center', 800)
await caption(1, 'Pick a book')
await highlight(calcCard)
await wait(1600)
await click(calcCard)

// ── 2. Book index ──
await page.waitForLoadState('networkidle')
await wait(1300)
// Hold at the top of the index — the clean title/byline/section-list frame.
// Below the fold the list mixes in per-section deck variants; scroll past it fast.
await caption(2, '27 sections, chapter by chapter')
await wait(2600)

const secLink = page.locator('a', { hasText: '3.1 Defining the Derivative' }).first()
await scrollTo(secLink, 'center', 650)
await highlight(secLink)
await wait(850)
await click(secLink)

// ── 3. Section page ──
await page.waitForLoadState('networkidle')
await wait(2200)
await park(1120, 180)
await caption(3, 'Rewritten in plain English, math verified')
await wait(2800)

// ── 4. Animated figure ──
const fig = page.locator('video').first()
await scrollTo(fig, 'center', 1000)
await caption(4, 'Animated figures instead of static diagrams')
await fig.evaluate((el) => { el.muted = true; el.currentTime = 0; el.play?.() }).catch(() => {})
await wait(4200)

// ── 5. Worked example + step-by-step solution ──
const example = page.locator('.example').nth(1)
await scrollTo(example, 'start', 1000)
await caption(5, 'Worked examples throughout')
await wait(2000)

const solution = example.locator('.solution').first()
await scrollTo(solution, 'center', 700)
await caption(5, 'Step-by-step solutions, hidden until you want them')
await wait(1000)
const summary = solution.locator('summary').first()
await click(summary)
await wait(2600)
await park(1120, 160)
await wait(1600)

// ── 6. Video walkthroughs ──
await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'smooth' }))
await wait(1400)
await caption(6, 'A walkthrough video for every concept')
await wait(1200)
const videoBtn = page.locator('.video-btn').first()
await click(videoBtn)
await wait(3200)

await caption(null, 'oerbookshelf.app')
await park(640, 300)
await wait(2600)

/* ════════════════════ end SCENARIO ════════════════════ */

const video = page.video()
await ctx.close()
const raw = await video.path()
fs.renameSync(raw, `${OUTDIR}/bs.webm`)
await browser.close()
console.log('recorded ->', `${OUTDIR}/bs.webm`)
process.exit(0)
