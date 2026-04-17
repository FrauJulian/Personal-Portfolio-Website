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
];
const ALLOWED_EXTENSIONS = DEFAULT_ALLOWED_EXTENSIONS;
const WRITE_MODE = process.argv.includes('--write');

const DIRECT_REPLACEMENTS = [
  ['Ã„', 'Ä'],
  ['Ã–', 'Ö'],
  ['Ãœ', 'Ü'],
  ['Ã¤', 'ä'],
  ['Ã¶', 'ö'],
  ['Ã¼', 'ü'],
  ['ÃŸ', 'ß'],
  ['â€™', '’'],
  ['â€œ', '“'],
  ['â€', '”'],
  ['â€“', '–'],
  ['â€”', '—'],
  ['â€¦', '…'],
  ['Â§', '§'],
  ['&Auml;', 'Ä'],
  ['&Ouml;', 'Ö'],
  ['&Uuml;', 'Ü'],
  ['&auml;', 'ä'],
  ['&ouml;', 'ö'],
  ['&uuml;', 'ü'],
  ['&szlig;', 'ß'],
  ['&sect;', '§'],
];

const WORD_REPLACEMENTS = [
  [/\bAufrufzaehler\b/gu, 'Aufrufzähler'],
  [/\baufzaehlen\b/gu, 'aufzählen'],
  [/\bAusfuellen\b/gu, 'Ausfüllen'],
  [/\bausfuellen\b/gu, 'ausfüllen'],
  [/\bAuswaehlen\b/gu, 'Auswählen'],
  [/\bauswaehlen\b/gu, 'auswählen'],
  [/\bEnthaelt\b/gu, 'Enthält'],
  [/\benthaelt\b/gu, 'enthält'],
  [/\bFuer\b/gu, 'Für'],
  [/\bfuer\b/gu, 'für'],
  [/\bGeschuetzt\b/gu, 'Geschützt'],
  [/\bgeschuetzt\b/gu, 'geschützt'],
  [/\bGueltig\b/gu, 'Gültig'],
  [/\bgueltig\b/gu, 'gültig'],
  [/\bOesterreich\b/gu, 'Österreich'],
  [/\boesterreich\b/gu, 'österreich'],
  [/\bUeberein\b/gu, 'Überein'],
  [/\bueberein\b/gu, 'überein'],
  [/\bUngueltig\b/gu, 'Ungültig'],
  [/\bungueltig\b/gu, 'ungültig'],
  [/\bVerschluesselt\b/gu, 'Verschlüsselt'],
  [/\bverschluesselt\b/gu, 'verschlüsselt'],
  [/\bWaehlen\b/gu, 'Wählen'],
  [/\bwaehlen\b/gu, 'wählen'],
  [/\bZaehler\b/gu, 'Zähler'],
  [/\bzaehler\b/gu, 'zähler'],
  [/\bZurueck\b/gu, 'Zurück'],
  [/\bzurueck\b/gu, 'zurück'],
];

function applyTextFixes(source) {
  let nextSource = source;

  for (const [searchValue, replaceValue] of DIRECT_REPLACEMENTS) {
    if (nextSource.includes(searchValue)) {
      nextSource = nextSource.split(searchValue).join(replaceValue);
    }
  }

  for (const [pattern, replaceValue] of WORD_REPLACEMENTS) {
    nextSource = nextSource.replace(pattern, replaceValue);
  }

  return nextSource;
}

const changedFiles = [];

for (const directoryPath of SOURCE_DIRECTORIES) {
  for (const filePath of collectSourceFiles(directoryPath, ALLOWED_EXTENSIONS)) {
    const source = fs.readFileSync(filePath, 'utf8');
    const nextSource = applyTextFixes(source);
    if (nextSource === source) {
      continue;
    }

    changedFiles.push(toProjectRelativePath(filePath));
    if (WRITE_MODE) {
      fs.writeFileSync(filePath, nextSource, 'utf8');
    }
  }
}

if (changedFiles.length === 0) {
  console.log(`Source text fixer: no changes ${WRITE_MODE ? 'written' : 'needed'}.`);
  process.exit(0);
}

const actionLabel = WRITE_MODE ? 'updated' : 'would update';
console.log(`Source text fixer ${actionLabel} ${changedFiles.length} file(s):`);
for (const filePath of changedFiles) {
  console.log(`- ${filePath}`);
}

process.exit(WRITE_MODE ? 0 : 1);
