// SLAG demo recorder — adapted from rashio-videos/rig/record.mjs.
// Records a scripted walkthrough of the live slagweld.pages.dev to
// slag_video/slag.webm with a synthetic cursor, caption bar, and highlights.
//
// Playwright is NOT a dependency of this repo — run it from a scratch dir:
//   npm i playwright && npx playwright install chromium
//   node record-slag-demo.mjs                          -> slag_video/slag.webm
//   ffmpeg -i slag_video/slag.webm -c:v libx264 -preset slow -crf 18 \
//     -pix_fmt yuv420p -r 30 -an ../public/videos/raw/SLAG-demo.mp4
//   rm ../public/videos/SLAG-demo.mp4 && npm run compress-videos
//
// Records the LIVE site — the calculator needs no sign-in (only saving a
// tweak does), so unlike raSHio there is no local build to stand up.

import { chromium } from 'playwright'
import fs from 'fs'

const OUTDIR = process.env.SLAG_OUTDIR || 'slag_video'
const ACCENT = '#e8905f' // SLAG's orange gauge/chip accent
const APP = 'https://slagweld.pages.dev/'

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
      background: 'rgba(232,144,95,0.9)', border: '2.5px solid #ffffff',
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
      position: 'fixed', left: '50%', bottom: '18px', transform: 'translateX(-50%)',
      padding: '11px 24px', borderRadius: '10px', zIndex: '2147483646',
      background: 'rgba(16,17,19,0.93)', color: '#f0ece7',
      border: `2px solid ${accent}`, display: 'none',
      font: '600 20px "Segoe UI", system-ui, sans-serif', pointerEvents: 'none',
      boxShadow: '0 4px 18px rgba(0,0,0,0.45)', whiteSpace: 'nowrap',
    })
    document.body.appendChild(bar)
    window.__caption = (n, text) => {
      bar.style.display = 'block'
      bar.innerHTML = n
        ? `<span style="display:inline-block;width:27px;height:27px;border-radius:50%;background:${accent};color:#101113;text-align:center;line-height:27px;margin-right:11px;font-size:16px;vertical-align:middle;font-weight:700;">${n}</span><span style="vertical-align:middle;">${text}</span>`
        : text
    }
    window.__captionHide = () => { bar.style.display = 'none' }
    window.__hl = (el) => {
      el.style.outline = `3px solid ${accent}`
      el.style.outlineOffset = '3px'
      el.style.borderRadius = '6px'
    }
    window.__unhl = (el) => { el.style.outline = 'none' }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build)
  else build()
}, ACCENT)

const page = await ctx.newPage()

const wait = (ms) => page.waitForTimeout(ms)
const caption = (n, t) => page.evaluate(([a, b]) => window.__caption?.(a, b), [n, t])
const highlight = (loc) => loc.evaluate((el) => window.__hl(el)).catch(() => {})
const unhighlight = (loc) => loc.evaluate((el) => window.__unhl(el)).catch(() => {})
const glide = async (loc, ms = 420) => {
  const b = await loc.boundingBox()
  if (!b) return
  await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 24 })
  await wait(ms)
}
const click = async (loc) => {
  await glide(loc, 280)
  await page.evaluate(() => window.__click?.())
  await loc.click()
}
const park = async (x = 1180, y = 120) => { await page.mouse.move(x, y, { steps: 16 }) }

await page.goto(APP, { waitUntil: 'networkidle' })
await wait(2400)

/* ════════════════════ SCENARIO ════════════════════ */

await page.mouse.move(640, 380)
await caption(null, 'SLAG — weld settings for the machine in front of you')
await wait(3000)

// ── 1. Pick the machine ──
await caption(1, 'Pick your machine, not a generic chart')
await wait(900)
const brand = page.locator('select').first()
const model = page.locator('select').nth(1)
await click(brand)
await brand.selectOption({ label: 'Miller' }).catch(() => {})
await wait(1300)
await click(model)
await wait(900)
await park(1180, 110)
await wait(1600)

// ── 2. Describe the job ──
await caption(2, 'Process, material, thickness')
await wait(900)
await click(page.locator('button', { hasText: /^Flux-core$/ }).first())
await wait(1100)
await click(page.locator('button', { hasText: /^Stainless$/ }).first())
await wait(1400)

// Thickness slider is in mils: min 30 (0.030") .. max 500 (0.500").
const slider = page.locator('input[type=range]').first()
const sb = await slider.boundingBox()
if (sb) {
  await page.mouse.move(sb.x + sb.width * 0.22, sb.y + sb.height / 2, { steps: 20 })
  await page.evaluate(() => window.__click?.())
  await page.mouse.down()
  await page.mouse.move(sb.x + sb.width * 0.52, sb.y + sb.height / 2, { steps: 45 })
  await page.mouse.up()
}
await wait(1600)
await park(1180, 110)
await wait(1400)

// ── 3. The gauges — the actual payoff ──
await caption(3, 'Wire speed as a dial position, not just IPM')
await wait(900)
const gauges = page.locator('svg, [class*=gauge]').first()
await highlight(gauges)
await wait(3200)
await unhighlight(gauges)
await wait(400)

// ── 4. Wire diameter changes the answer ──
await caption(4, 'Change the wire, the dial moves')
await wait(800)
await click(page.locator('button', { hasText: /^0\.045"$/ }).first())
await wait(2600)
await park(1180, 110)
await wait(1400)

// ── 5. Over-capacity warning ──
// This job (0.275" stainless, 0.045 flux) needs ~248 A on a 230 A machine —
// the app says so instead of handing over a setting that cannot work.
await caption(5, 'And when the machine cannot do the job, it says so')
await wait(900)
const warning = page.locator('text=/machine maxes at/i').first()
await highlight(warning)
await wait(3400)
await unhighlight(warning)
await wait(400)

// ── 6. Save what actually works ──
await caption(6, 'Save what actually works on your machine')
await wait(900)
// The Tweak control carries an icon, so its text is not exactly "Tweak" —
// anchored regex misses it.
const tweak = page.locator('button', { hasText: 'Tweak' }).first()
// No highlight ring here: clicking Tweak swaps the control for Save/Cancel and
// the outline would be left stranded on a button that now says something else.
await wait(700)
await click(tweak)
await wait(3000)
await park(1180, 110)
await wait(1800)

await caption(null, 'slagweld.pages.dev')
await wait(2600)

/* ════════════════════ end SCENARIO ════════════════════ */

const video = page.video()
await ctx.close()
fs.renameSync(await video.path(), `${OUTDIR}/slag.webm`)
await browser.close()
console.log('recorded ->', `${OUTDIR}/slag.webm`)
process.exit(0)
