#!/usr/bin/env node

const fs = require('node:fs');
const path = require('node:path');
const {
  PROJECT_ROOT,
  DEFAULT_ALLOWED_EXTENSIONS,
  collectSourceFiles,
  toProjectRelativePath,
} = require('./source-files.cjs');

const SOURCE_DIRECTORIES = [
  path.join(PROJECT_ROOT, 'backend', 'src'),
  path.join(PROJECT_ROOT, 'src'),
  path.join(PROJECT_ROOT, 'scripts'),
];
const IGNORED_RELATIVE_PATHS = new Set([
  'scripts/check-source-quality.cjs',
  'scripts/fix-source-text.cjs',
]);
const ALLOWED_EXTENSIONS = DEFAULT_ALLOWED_EXTENSIONS;

const MOJIBAKE_PATTERNS = [
  { label: 'UTF8_AS_LATIN1', regex: /\u00C3[\u0080-\u00BF]/u },
  { label: 'REPLACEMENT_CHAR', regex: /\uFFFD/u },
  { label: 'MISDECODED_QUESTION_MARK', regex: /\u00EF\u00BF\u00BD/u },
  { label: 'CP1252_ARTIFACT', regex: /\u00C2[\u0080-\u00BF]?/u },
  {
    label: 'DOUBLE_DECODED_APOSTROPHE',
    regex: /\u00E2\u20AC\u2122|\u00E2\u20AC\u0153|\u00E2\u20AC\u009D/u,
  },
];

const ASCII_TRANSLITERATION_PATTERNS = [
  {
    label: 'ASCII_TRANSLITERATION',
    regex:
      /\b(?:fuer|Fuer|gueltig|Gueltig|ungueltig|Ungueltig|zurueck|Zurueck|ueberein|Ueberein|waehlen|Waehlen|zaehler|Zaehler|ausfuellen|Ausfuellen|geschuetzt|Geschuetzt|verschluesselt|Verschluesselt)\b/u,
  },
];

const VAR_PATTERN = /\bvar\s+[A-Za-z_$][A-Za-z0-9_$]*/u;

/** @type {Array<{file: string, rule: string, detail: string}>} */
const issues = [];

for (const directoryPath of SOURCE_DIRECTORIES) {
  const files = collectSourceFiles(directoryPath, ALLOWED_EXTENSIONS);
  for (const filePath of files) {
    const source = fs.readFileSync(filePath, 'utf8');
    const relativePath = toProjectRelativePath(filePath);
    const extension = path.extname(filePath).toLowerCase();
    if (IGNORED_RELATIVE_PATHS.has(relativePath)) {
      continue;
    }

    for (const pattern of MOJIBAKE_PATTERNS) {
      if (pattern.regex.test(source)) {
        issues.push({
          file: relativePath,
          rule: pattern.label,
          detail: 'possible mojibake detected',
        });
      }
    }

    for (const pattern of ASCII_TRANSLITERATION_PATTERNS) {
      if (pattern.regex.test(source)) {
        issues.push({
          file: relativePath,
          rule: pattern.label,
          detail: 'possible ASCII transliteration detected',
        });
      }
    }

    if (extension !== '.html' && VAR_PATTERN.test(source)) {
      issues.push({
        file: relativePath,
        rule: 'NO_VAR',
        detail: 'use const/let instead of var',
      });
    }
  }
}

if (issues.length === 0) {
  console.log('Source quality check passed: no mojibake artifacts and no var declarations found.');
  process.exit(0);
}

console.error('Source quality check failed:');
for (const issue of issues) {
  console.error(`- ${issue.file} [${issue.rule}] ${issue.detail}`);
}
process.exit(1);
