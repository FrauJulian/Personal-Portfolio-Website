const fs = require('fs');
const path = require('path');

const sources = [
  {
    source: path.join(process.cwd(), 'src', 'robots.txt'),
    fileName: 'robots.txt',
  },
  {
    source: path.join(process.cwd(), 'src', 'sitemap.xml'),
    fileName: 'sitemap.xml',
  },
];

const distRoot = path.join(process.cwd(), 'dist');
const browserDir = path.join(distRoot, 'browser');

const targetDirectories = [distRoot, browserDir]
  .filter((targetDirectory) => fs.existsSync(targetDirectory))
  .filter((targetDirectory, index, list) => list.indexOf(targetDirectory) === index);

if (targetDirectories.length === 0) {
  console.warn('Skipping static root file copy: dist directory not found.');
  process.exit(0);
}

for (const { source, fileName } of sources) {
  if (!fs.existsSync(source)) {
    console.warn(`Skipping ${fileName} copy: source file not found.`);
    continue;
  }

  for (const targetDirectory of targetDirectories) {
    const targetFile = path.join(targetDirectory, fileName);
    fs.copyFileSync(source, targetFile);
    console.log(
      `Copied ${path.relative(process.cwd(), source)} -> ${path.relative(process.cwd(), targetFile)}`,
    );
  }
}
