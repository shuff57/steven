#!/usr/bin/env node
/**
 * compress-videos.js
 *
 * Compresses all MP4s in public/videos/raw/ and outputs them to public/videos/.
 * Raw sources are gitignored — only the compressed outputs are committed.
 *
 * Usage:
 *   npm run compress-videos
 *
 * To add a new video:
 *   1. Drop the raw MP4 into public/videos/raw/
 *   2. Run: npm run compress-videos
 *   3. Commit the compressed file from public/videos/
 */

const ffmpeg = require('fluent-ffmpeg')
const ffmpegStatic = require('ffmpeg-static')
const fs = require('fs')
const path = require('path')

ffmpeg.setFfmpegPath(ffmpegStatic)

const RAW_DIR = path.join(__dirname, '..', 'public', 'videos', 'raw')
const OUT_DIR = path.join(__dirname, '..', 'public', 'videos')

// CRF 26 = good quality/size balance for demo/portfolio videos
// Lower = better quality, larger file (18=visually lossless, 28=decent, 51=worst)
const CRF = 26
// Scale to max 1280px wide, keep aspect ratio, only downscale (never upscale)
const MAX_WIDTH = 1280

function formatBytes(bytes) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function compressVideo(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    const inputSize = fs.statSync(inputPath).size
    const filename = path.basename(inputPath)

    console.log(`\n▶ ${filename}`)
    console.log(`  Input:  ${formatBytes(inputSize)}`)

    ffmpeg(inputPath)
      .setFfmpegPath(ffmpegStatic)
      .videoCodec('libx264')
      .audioCodec('aac')
      .audioBitrate('128k')
      .outputOptions([
        `-crf ${CRF}`,
        '-preset slow',          // better compression, worth the extra encode time
        '-movflags +faststart',  // moves metadata to front for instant web playback
        `-vf scale='min(${MAX_WIDTH},iw)':-2`, // scale down if wider than MAX_WIDTH
        '-pix_fmt yuv420p',      // max browser compatibility
      ])
      .output(outputPath)
      .on('progress', (progress) => {
        if (progress.percent) {
          process.stdout.write(`\r  Progress: ${Math.round(progress.percent)}%   `)
        }
      })
      .on('end', () => {
        const outputSize = fs.statSync(outputPath).size
        const reduction = (((inputSize - outputSize) / inputSize) * 100).toFixed(1)
        process.stdout.write('\r')
        console.log(`  Output: ${formatBytes(outputSize)} (${reduction}% smaller)`)
        resolve()
      })
      .on('error', (err) => {
        console.error(`\n  ✗ Error: ${err.message}`)
        reject(err)
      })
      .run()
  })
}

async function main() {
  if (!fs.existsSync(RAW_DIR)) {
    fs.mkdirSync(RAW_DIR, { recursive: true })
    console.log(`Created: public/videos/raw/`)
    console.log(`\nDrop your raw MP4 files into public/videos/raw/ and re-run this script.`)
    process.exit(0)
  }

  const files = fs.readdirSync(RAW_DIR).filter(f => f.toLowerCase().endsWith('.mp4'))

  if (files.length === 0) {
    console.log(`No MP4 files found in public/videos/raw/`)
    console.log(`Drop your raw MP4 files there and re-run: npm run compress-videos`)
    process.exit(0)
  }

  console.log(`\nCompressing ${files.length} video(s) with CRF ${CRF}...\n`)

  let passed = 0
  let failed = 0

  for (const file of files) {
    const inputPath = path.join(RAW_DIR, file)
    const outputPath = path.join(OUT_DIR, file)

    if (fs.existsSync(outputPath)) {
      const inputMtime = fs.statSync(inputPath).mtimeMs
      const outputMtime = fs.statSync(outputPath).mtimeMs
      if (outputMtime > inputMtime) {
        console.log(`⏭  ${file} — already compressed, skipping (delete output to re-compress)`)
        passed++
        continue
      }
    }

    try {
      await compressVideo(inputPath, outputPath)
      passed++
    } catch {
      failed++
    }
  }

  console.log(`\n✓ Done. ${passed} compressed, ${failed} failed.\n`)
  if (failed > 0) process.exit(1)
}

main()
