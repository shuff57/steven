// earSHot demo recorder — adapted from rashio-videos/rig/record.mjs.
//
// Playwright is NOT a dependency of this repo — run it from a scratch dir:
//   npm i playwright && npx playwright install chromium
//   node record-earshot-demo.mjs               -> earshot_video/earshot.webm
//   ffmpeg -i earshot_video/earshot.webm -c:v libx264 -preset slow -crf 18 \
//     -pix_fmt yuv420p -r 30 -an ../public/videos/raw/earSHot-demo.mp4
//   rm ../public/videos/earSHot-demo.mp4 && npm run compress-videos
//
// AUTH: earSHot is behind a sign-in. Credentials are read from the earSHot
// repo's .env and used to mint a storageState in a SEPARATE, non-recording
// context — the recorded context starts already authenticated, so no username,
// password, or login form ever appears in the footage. Never inline the
// credentials here and never type them on camera.
//
// PRIVACY: this films a real personal music library. Stats (listening history)
// is deliberately never visited, and the scenario stays on functional surfaces
// rather than wide library-grid shots.

import { chromium } from 'playwright'
import fs from 'fs'

const OUTDIR = process.env.ES_OUTDIR || 'earshot_video'
const STATE = 'earshot-state.json'
const ACCENT = '#3b9bff'
const APP = 'https://music.huffpalmer.fyi/'
const ENV = 'C:/Users/shuff/Documents/GitHub/earSHot/.env'

const browser = await chromium.launch()

// ── auth pass: off camera ──
if (!fs.existsSync(STATE)) {
  const env = fs.readFileSync(ENV, 'utf8')
  const pass = (env.match(/^ND_ADMIN_PASSWORD=(.*)$/m) || [])[1]?.trim()
  if (!pass) throw new Error('ND_ADMIN_PASSWORD missing from .env')
  const authCtx = await browser.newContext({ viewport: { width: 1280, height: 720 } })
  const ap = await authCtx.newPage()
  await ap.goto(APP, { waitUntil: 'networkidle' })
  await ap.waitForTimeout(2500)
  await ap.locator('input[type=text]').first().fill('shuff57')
  await ap.locator('input[type=password]').first().fill(pass)
  await ap.locator('button:has-text("Sign in")').first().click()
  await ap.waitForTimeout(7000)
  if (/invalid credentials/i.test(await ap.locator('body').innerText())) {
    throw new Error('login failed — refresh the credentials before recording')
  }
  await authCtx.storageState({ path: STATE })
  await authCtx.close()
  console.log('authenticated (off camera)')
}

const ctx = await browser.newContext({
  viewport: { width: 1280, height: 720 },
  recordVideo: { dir: OUTDIR, size: { width: 1280, height: 720 } },
  storageState: STATE,
})

await ctx.addInitScript((accent) => {
  const build = () => {
    const cur = document.createElement('div')
    Object.assign(cur.style, {
      position: 'fixed', width: '20px', height: '20px', borderRadius: '50%',
      background: 'rgba(59,155,255,0.9)', border: '2.5px solid #ffffff',
      boxShadow: '0 1px 6px rgba(0,0,0,0.55)', zIndex: '2147483647',
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
      // 108px clears the persistent player bar along the bottom.
      position: 'fixed', left: '50%', bottom: '108px', transform: 'translateX(-50%)',
      padding: '11px 24px', borderRadius: '10px', zIndex: '2147483646',
      background: 'rgba(10,12,16,0.94)', color: '#eef2f7',
      border: `2px solid ${accent}`, display: 'none',
      font: '600 20px "Segoe UI", system-ui, sans-serif', pointerEvents: 'none',
      boxShadow: '0 4px 18px rgba(0,0,0,0.5)', whiteSpace: 'nowrap',
    })
    document.body.appendChild(bar)
    window.__caption = (n, text) => {
      bar.style.display = 'block'
      bar.innerHTML = n
        ? `<span style="display:inline-block;width:27px;height:27px;border-radius:50%;background:${accent};color:#0a0c10;text-align:center;line-height:27px;margin-right:11px;font-size:16px;vertical-align:middle;font-weight:700;">${n}</span><span style="vertical-align:middle;">${text}</span>`
        : text
    }
    window.__captionHide = () => { bar.style.display = 'none' }
    window.__hl = (el) => {
      el.style.outline = `3px solid ${accent}`
      el.style.outlineOffset = '4px'
      el.style.borderRadius = '6px'
    }
    window.__unhl = (el) => { el.style.outline = 'none' }
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build)
  else build()
}, ACCENT)

const page = await ctx.newPage()
// Video recording starts with the first page, so treat this as t=0 for the
// splice window printed below.
const T0 = Date.now()

const wait = (ms) => page.waitForTimeout(ms)
const caption = (n, t) => page.evaluate(([a, b]) => window.__caption?.(a, b), [n, t])
const highlight = (loc) => loc.evaluate((el) => window.__hl(el)).catch(() => {})
const unhighlight = (loc) => loc.evaluate((el) => window.__unhl(el)).catch(() => {})
const nav = (label) => page.locator(`a:has-text("${label}"), button:has-text("${label}")`).first()
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
const park = async (x = 1180, y = 300) => { await page.mouse.move(x, y, { steps: 16 }) }
// Drag a range input to a fraction of its track.
const setSlider = async (loc, frac) => {
  const b = await loc.boundingBox()
  if (!b) return
  await page.mouse.move(b.x + b.width * 0.5, b.y + b.height / 2, { steps: 16 })
  await page.evaluate(() => window.__click?.())
  await page.mouse.down()
  await page.mouse.move(b.x + b.width * frac, b.y + b.height / 2, { steps: 32 })
  await page.mouse.up()
  await wait(500)
}

await page.goto(APP, { waitUntil: 'networkidle' })
await wait(4000)

/* ════════════════════ SCENARIO ════════════════════ */

await page.mouse.move(640, 360)
await caption(null, 'earSHot — your own music library, self-hosted')
await wait(3000)

// ── 1. Radio: the vibe sliders ──
await caption(1, 'Build a station from a vibe, not a genre')
await wait(800)
await click(nav('Radio'))
await wait(2600)

const sliders = page.locator('input[type=range]')
await setSlider(sliders.nth(0), 0.78) // Familiar -> Discover
await setSlider(sliders.nth(1), 0.30) // Chill
await setSlider(sliders.nth(2), 0.70) // toward Deep cuts
await wait(700)

const vibe = page.locator('input[placeholder*="describe a vibe" i]').first()
await click(vibe)
await vibe.pressSequentially('rainy afternoon focus', { delay: 90 })
await wait(1000)

await caption(2, 'Describe it in plain English')
await wait(1200)
await click(page.locator('button:has-text("Generate Radio")').first())
await caption(2, 'Generating a station…')
await park(1200, 240)

// AudioMuse takes ~40s to build the station — far too long to sit through in a
// card video, but the finished station is the whole point of the beat. So wait
// for the real thing and print the video-relative window to splice out; the
// encode step drops it. Nothing is faked, only a loading wait is shortened.
await wait(3500)
const cutStart = (Date.now() - T0) / 1000
const genBtn = page.locator('button:has-text("Generate Radio"), button:has-text("Asking")').first()
for (let i = 0; i < 40; i++) {
  await wait(2000)
  const label = await genBtn.innerText().catch(() => '')
  if (/generate radio/i.test(label)) break
}
const cutEnd = (Date.now() - T0) / 1000
console.log(`SPLICE_CUT ${cutStart.toFixed(1)} ${cutEnd.toFixed(1)}`)

await caption(2, 'A station built around that vibe')
await wait(4200)

// ── 3. Search ──
await caption(3, 'Search the whole library instantly')
await wait(800)
await click(nav('Search'))
await wait(2200)
const search = page.locator('input[placeholder*="Search songs" i]').first()
await click(search)
await search.pressSequentially('midnight', { delay: 110 })
await wait(3000)
await park(1200, 240)
await wait(2000)

// ── 4. Podcasts — it is not only music ──
await caption(4, 'Podcasts and collections in the same player')
await wait(800)
await click(nav('Podcasts'))
await wait(3200)
await park(1200, 240)
await wait(2200)

// ── 5. The player ──
// Deliberately no Stats page: that is listening history.
await caption(5, 'One player, every device, nothing leaves your hardware')
await wait(900)
const player = page.locator('footer, [class*=player]').first()
await highlight(player)
await wait(3200)
await unhighlight(player)
await wait(600)

await caption(null, 'earSHot')
await wait(2400)

/* ════════════════════ end SCENARIO ════════════════════ */

const video = page.video()
await ctx.close()
fs.renameSync(await video.path(), `${OUTDIR}/earshot.webm`)
await browser.close()
console.log('recorded ->', `${OUTDIR}/earshot.webm`)
process.exit(0)
