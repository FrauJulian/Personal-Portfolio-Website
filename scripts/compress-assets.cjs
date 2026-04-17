const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const distAssetRoots = [
  path.join(process.cwd(), 'dist', 'assets'),
  path.join(process.cwd(), 'dist', 'browser', 'assets'),
];

const losslessTransformers = {
  '.jpg': (pipeline) =>
    pipeline.jpeg({
      quality: 90,
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
      optimizeScans: true,
    }),
  '.jpeg': (pipeline) =>
    pipeline.jpeg({
      quality: 90,
      mozjpeg: true,
      chromaSubsampling: '4:4:4',
      optimizeScans: true,
    }),
  '.png': (pipeline) => pipeline.png({ compressionLevel: 9, effort: 10 }),
  '.gif': (pipeline) => pipeline.gif({ effort: 10, colours: 256 }),
  '.webp': (pipeline) => pipeline.webp({ lossless: true, effort: 6 }),
  '.avif': (pipeline) => pipeline.avif({ lossless: true, effort: 9 }),
  '.tif': (pipeline) => pipeline.tiff({ compression: 'lzw' }),
  '.tiff': (pipeline) => pipeline.tiff({ compression: 'lzw' }),
};

const imageExtensions = new Set([
  '.png',
  '.jpg',
  '.jpeg',
  '.webp',
  '.avif',
  '.gif',
  '.svg',
  '.tif',
  '.tiff',
  '.bmp',
]);

const skippedNoLosslessEncoder = new Set(['.svg', '.bmp']);

function getAllFilesRecursively(directory) {
  const entries = fs.readdirSync(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      files.push(...getAllFilesRecursively(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

async function compressLossless(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const transform = losslessTransformers[ext];

  if (!transform) {
    return { status: 'unsupported', beforeBytes: 0, afterBytes: 0 };
  }

  const beforeBuffer = fs.readFileSync(filePath);
  const beforeBytes = beforeBuffer.byteLength;
  const optimizedBuffer = await transform(sharp(beforeBuffer)).toBuffer();
  const afterBytes = optimizedBuffer.byteLength;

  if (afterBytes < beforeBytes) {
    fs.writeFileSync(filePath, optimizedBuffer);
    return { status: 'optimized', beforeBytes, afterBytes };
  }

  return { status: 'unchanged', beforeBytes, afterBytes: beforeBytes };
}

async function run() {
  const existingRoots = distAssetRoots
    .filter((rootPath) => fs.existsSync(rootPath))
    .filter((rootPath, index, list) => list.indexOf(rootPath) === index);

  if (existingRoots.length === 0) {
    console.log('Asset compression skipped: no dist asset directory found.');
    return;
  }

  const imageFiles = existingRoots
    .flatMap((rootPath) => getAllFilesRecursively(rootPath))
    .filter((filePath) => imageExtensions.has(path.extname(filePath).toLowerCase()));

  let optimizedCount = 0;
  let unchangedCount = 0;
  let skippedCount = 0;
  let totalSavedBytes = 0;

  for (const filePath of imageFiles) {
    const ext = path.extname(filePath).toLowerCase();
    if (skippedNoLosslessEncoder.has(ext)) {
      skippedCount += 1;
      console.log(`Skip (no lossless encoder configured): ${path.relative(process.cwd(), filePath)}`);
      continue;
    }

    try {
      const result = await compressLossless(filePath);
      if (result.status === 'optimized') {
        optimizedCount += 1;
        const savedBytes = result.beforeBytes - result.afterBytes;
        totalSavedBytes += savedBytes;
        console.log(`Optimized: ${path.relative(process.cwd(), filePath)} (-${savedBytes} bytes)`);
      } else if (result.status === 'unchanged') {
        unchangedCount += 1;
        console.log(`Unchanged: ${path.relative(process.cwd(), filePath)}`);
      } else {
        skippedCount += 1;
      }
    } catch (error) {
      skippedCount += 1;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`Skip (error): ${path.relative(process.cwd(), filePath)} (${message})`);
    }
  }

  console.log(
    `Asset compression complete. Optimized: ${optimizedCount}, unchanged: ${unchangedCount}, skipped: ${skippedCount}, saved: ${totalSavedBytes} bytes.`,
  );
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
    console.error(`Asset compression failed: ${message}`);
    process.exit(1);
  });
