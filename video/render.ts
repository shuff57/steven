import path from 'path';
import { bundle } from '@remotion/bundler';
import { renderMedia, selectComposition } from '@remotion/renderer';

const OUTPUT_PATH = path.resolve(process.cwd(), 'public/videos/bookshelf-demo.mp4');

async function main() {
  console.log('Bundling...');
  const bundleLocation = await bundle({
    entryPoint: path.resolve(process.cwd(), 'video/index.tsx'),
    webpackOverride: (config) => config,
  });

  console.log('Selecting composition...');
  const composition = await selectComposition({
    serveUrl: bundleLocation,
    id: 'BookshelfPromo',
    inputProps: {},
  });

  console.log(`Rendering ${composition.durationInFrames} frames at ${composition.fps}fps...`);
  await renderMedia({
    composition,
    serveUrl: bundleLocation,
    codec: 'h264',
    outputLocation: OUTPUT_PATH,
    inputProps: {},
    videoBitrate: '1500k',
    onProgress: ({ progress }) => {
      process.stdout.write(`\r  ${(progress * 100).toFixed(1)}%`);
    },
  });

  console.log(`\nDone → ${OUTPUT_PATH}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
