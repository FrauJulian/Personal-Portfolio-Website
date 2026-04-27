const fs = require('node:fs');
const path = require('node:path');
const sharp = require('sharp');

const sourceRoot = path.join(process.cwd(), 'src', 'assets', 'unoptimized');
const targetRoot = path.join(process.cwd(), 'src', 'assets', 'optimized');

const rasterExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp', '.avif', '.gif', '.tif', '.tiff']);
const passthroughExtensions = new Set(['.svg']);

function collectFilesRecursively(directoryPath) {
  if (!fs.existsSync(directoryPath)) {
    return [];
  }

  const entries = fs.readdirSync(directoryPath, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const fullPath = path.join(directoryPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...collectFilesRecursively(fullPath));
      continue;
    }

    if (entry.isFile()) {
      files.push(fullPath);
    }
  }

  return files;
}

function ensureCleanDirectory(directoryPath) {
  fs.rmSync(directoryPath, { recursive: true, force: true });
  fs.mkdirSync(directoryPath, { recursive: true });
}

function getProfile(relativePath) {
  const normalizedRelativePath = relativePath.split(path.sep).join('/').toLowerCase();

  if (normalizedRelativePath === 'background.jpg' || normalizedRelativePath === 'background.jpeg') {
    return { maxWidth: 1920, quality: 82, alphaQuality: 100 };
  }

  if (normalizedRelativePath.startsWith('logos/')) {
    return { maxWidth: 640, quality: 90, alphaQuality: 92, nearLossless: true };
  }

  if (normalizedRelativePath.startsWith('portrait/')) {
    return { maxWidth: 1600, quality: 84, alphaQuality: 92 };
  }

  return { maxWidth: 1600, quality: 82, alphaQuality: 92 };
}

async function writeOptimizedAsset(sourceFilePath) {
  const relativePath = path.relative(sourceRoot, sourceFilePath);
  const extension = path.extname(sourceFilePath).toLowerCase();
  const targetRelativePath = passthroughExtensions.has(extension)
    ? relativePath
    : relativePath.replace(/\.[^.]+$/, '.webp');
  const targetFilePath = path.join(targetRoot, targetRelativePath);

  fs.mkdirSync(path.dirname(targetFilePath), { recursive: true });

  if (passthroughExtensions.has(extension)) {
    fs.copyFileSync(sourceFilePath, targetFilePath);
    return {
      sourceRelativePath: relativePath,
      targetRelativePath,
      beforeBytes: fs.statSync(sourceFilePath).size,
      afterBytes: fs.statSync(targetFilePath).size,
      mode: 'copied',
    };
  }

  const profile = getProfile(relativePath);
  const inputBuffer = fs.readFileSync(sourceFilePath);
  const inputBytes = inputBuffer.byteLength;
  const image = sharp(inputBuffer, { animated: false }).rotate();
  const metadata = await image.metadata();

  let pipeline = image;
  if ((metadata.width ?? 0) > profile.maxWidth) {
    pipeline = pipeline.resize({
      width: profile.maxWidth,
      fit: 'inside',
      withoutEnlargement: true,
    });
  }

  const outputBuffer = await pipeline
    .webp({
      quality: profile.quality,
      alphaQuality: profile.alphaQuality,
      effort: 6,
      smartSubsample: true,
      nearLossless: profile.nearLossless ?? false,
    })
    .toBuffer();

  fs.writeFileSync(targetFilePath, outputBuffer);

  return {
    sourceRelativePath: relativePath,
    targetRelativePath,
    beforeBytes: inputBytes,
    afterBytes: outputBuffer.byteLength,
    mode: 'converted',
  };
}

async function run() {
  if (!fs.existsSync(sourceRoot)) {
    console.log('Optimized asset generation skipped: no unoptimized asset directory found.');
    return;
  }

  ensureCleanDirectory(targetRoot);

  const assetFiles = collectFilesRecursively(sourceRoot).filter((filePath) => {
    const extension = path.extname(filePath).toLowerCase();
    return rasterExtensions.has(extension) || passthroughExtensions.has(extension);
  });

  let convertedCount = 0;
  let copiedCount = 0;
  let totalSavedBytes = 0;

  for (const assetFile of assetFiles) {
    const result = await writeOptimizedAsset(assetFile);
    const savedBytes = result.beforeBytes - result.afterBytes;
    totalSavedBytes += savedBytes;

    if (result.mode === 'copied') {
      copiedCount += 1;
      console.log(
        `Copied: ${result.sourceRelativePath} -> ${result.targetRelativePath} (${result.afterBytes} bytes)`,
      );
      continue;
    }

    convertedCount += 1;
    console.log(
      `Optimized: ${result.sourceRelativePath} -> ${result.targetRelativePath} (${savedBytes >= 0 ? `-${savedBytes}` : `+${Math.abs(savedBytes)}`} bytes)`,
    );
  }

  console.log(
    `Optimized asset generation complete. Converted: ${convertedCount}, copied: ${copiedCount}, net saved: ${totalSavedBytes} bytes.`,
  );
}

run()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    const message = error instanceof Error ? (error.stack ?? error.message) : String(error);
    console.error(`Optimized asset generation failed: ${message}`);
    process.exit(1);
  });
