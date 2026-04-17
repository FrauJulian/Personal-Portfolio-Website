const fs = require('node:fs');
const path = require('node:path');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const DEFAULT_ALLOWED_EXTENSIONS = new Set(['.ts', '.js', '.cjs', '.html', '.css']);

/**
 * @param {string} directoryPath
 * @param {Set<string>} [allowedExtensions]
 * @returns {string[]}
 */
function collectSourceFiles(directoryPath, allowedExtensions = DEFAULT_ALLOWED_EXTENSIONS) {
  /** @type {string[]} */
  const results = [];
  if (!fs.existsSync(directoryPath)) {
    return results;
  }

  /** @type {string[]} */
  const queue = [directoryPath];

  while (queue.length > 0) {
    const currentPath = queue.pop();
    if (!currentPath) {
      continue;
    }

    const entries = fs.readdirSync(currentPath, { withFileTypes: true });
    for (const entry of entries) {
      const absolutePath = path.join(currentPath, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolutePath);
        continue;
      }

      if (!entry.isFile()) {
        continue;
      }

      const extension = path.extname(entry.name).toLowerCase();
      if (allowedExtensions.has(extension)) {
        results.push(absolutePath);
      }
    }
  }

  return results;
}

/**
 * @param {string} absolutePath
 * @returns {string}
 */
function toProjectRelativePath(absolutePath) {
  return path.relative(PROJECT_ROOT, absolutePath).split(path.sep).join('/');
}

module.exports = {
  PROJECT_ROOT,
  DEFAULT_ALLOWED_EXTENSIONS,
  collectSourceFiles,
  toProjectRelativePath,
};
