// shCode demo recorder — adapted from bookSHelf's record-bookshelf-demo.mjs
// (steven/scripts/record-bookshelf-demo.mjs) using the same technique:
// Playwright chromium, recordVideo, synthetic cursor + caption bar overlay,
// smooth scrollTo/click/glide helpers, scripted walkthrough -> webm -> mp4.
//
// Records against a LOCAL wrangler pages dev instance (see shCode/DEPLOY.md):
//   cd shCode && npm run build && npx wrangler d1 migrations apply shcode-commits --local
//   npx wrangler pages dev out --port 8788
// Then, from a scratch dir with playwright installed:
//   node record-shcode-demo.mjs                           -> sc_video/sc.webm
//   ffmpeg -i sc_video/sc.webm -c:v libx264 -preset slow -crf 18 \
//     -pix_fmt yuv420p -r 30 -an ../public/videos/shCode-demo.mp4

import { chromium } from 'playwright';
import fs from 'fs';

const OUTDIR = process.env.SC_OUTDIR || 'sc_video';
const ACCENT = '#5baafd'; // shCode's --brand
const BASE = process.env.SC_BASE || 'http://localhost:8788';
const EMAIL = 'shuff57@gmail.com';
const PASS = 'throwaway-pass-12345';

const browser = await chromium.launch();
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
      background: 'rgba(91,170,253,0.88)', border: '2.5px solid #ffffff',
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
const scrollTo = async (loc, block = 'center', settle = 900) => {
  await loc.evaluate((el, b) => el.scrollIntoView({ behavior: 'smooth', block: b }), block)
  await wait(settle)
}
const park = async (x = 1120, y = 200) => { await page.mouse.move(x, y, { steps: 20 }) }
const typeSlow = async (loc, text, delay = 55) => {
  await loc.click()
  await loc.pressSequentially(text, { delay })
}

/* ════════════════════ SCENARIO ════════════════════ */

// ── 1. Home / lesson picker ──
await page.goto(BASE + '/', { waitUntil: 'networkidle' })
await wait(800)
await page.mouse.move(640, 300)
await caption(null, 'shCode — an intro JavaScript course for high schoolers')
await wait(1800)

const searchBox = page.locator('input[placeholder="Search lessons"]')
await scrollTo(searchBox, 'center', 300)
await caption(1, '510 lessons across 28 modules')
await highlight(searchBox)
await wait(700)
await typeSlow(searchBox, 'loop')
await wait(1000)
await searchBox.fill('')
await wait(500)

// ── 2. Sign in ──
const signInBtn = page.locator('header button', { hasText: 'Sign in' }).first()
await scrollTo(signInBtn, 'center', 300)
await caption(2, 'Students sign in to save progress across devices')
await click(signInBtn)
await wait(500)
const emailInput = page.locator('input[type=email]')
const passInput = page.locator('input[type=password]')
await typeSlow(emailInput, EMAIL, 30)
await wait(200)
await typeSlow(passInput, PASS, 30)
await wait(300)
await click(page.locator('button.btn-primary'))
await page.waitForLoadState('networkidle')
await wait(800)

// ── 3. A reading lesson ──
await page.goto(BASE + '/lesson/1-1-2-reading-console-log/', { waitUntil: 'networkidle' })
await wait(800)
await park(1120, 180)
await caption(3, 'Lessons rewritten in plain English, with runnable examples inline')
await wait(1800)
const readingLcb = page.locator('.livecodeblock').first()
await scrollTo(readingLcb, 'center', 600)
await wait(900)

// ── 4. A graded coding exercise ──
await page.goto(BASE + '/lesson/1-1-6-first-statement/', { waitUntil: 'networkidle' })
await wait(900)
await park(900, 250)
await caption(4, 'A real CodeMirror editor for every coding exercise')
await wait(1500)

const runBtn = page.locator('button.btn-run').first()
await highlight(runBtn)
await wait(400)
await click(runBtn)
await wait(900)
await caption(5, 'Code runs live, autograded against the lesson goal')
await wait(1800)

// ── 5. Teacher / class management ──
await page.goto(BASE + '/teacher/', { waitUntil: 'networkidle' })
await wait(800)
await caption(6, 'Teacher tools: rosters, gradebooks, submission review')
await wait(1000)

const classCard = page
  .locator('div', { hasText: 'Period 3 - Intro to JS' })
  .filter({ has: page.locator('button', { hasText: 'Open' }) })
  .last()
await scrollTo(classCard, 'center', 500)
await highlight(classCard)
await wait(500)
const openBtn = classCard.locator('button', { hasText: 'Open' })
await click(openBtn)
await page.waitForLoadState('networkidle')
await wait(1000)

const gradebookTab = page.locator('button', { hasText: 'Gradebook' })
await click(gradebookTab)
await wait(1400)

await caption(null, 'shCode')
await park(640, 300)
await wait(1800)

/* ════════════════════ end SCENARIO ════════════════════ */

const video = page.video()
await ctx.close()
const raw = await video.path()
fs.mkdirSync(OUTDIR, { recursive: true })
fs.renameSync(raw, `${OUTDIR}/sc.webm`)
await browser.close()
console.log('recorded ->', `${OUTDIR}/sc.webm`)
process.exit(0)
