'use strict';

const fs = require('node:fs');
const path = require('node:path');
const { execFileSync } = require('node:child_process');

const PROJECT_ROOT = path.resolve(__dirname, '..');
const PACKAGE_JSON_PATH = path.join(PROJECT_ROOT, 'package.json');
const PACKAGE_LOCK_PATH = path.join(PROJECT_ROOT, 'package-lock.json');
const VERSION_PLACEHOLDER = 'YYDDDhhmm+GIT_HASH';
const RESOLVED_BUILD_PATTERN = /^\d{2}\d{3}\d{4}\+[A-Za-z0-9_-]+$/;
const MODES = new Set(['--set', '--ensure', '--check', '--place']);

function readJson(location) {
  return JSON.parse(fs.readFileSync(location, 'utf8'));
}

function writeJson(location, value) {
  fs.writeFileSync(location, `${JSON.stringify(value, null, 4)}\n`);
}

function getSelectedMode() {
  const selectedModes = process.argv.slice(2).filter((value) => MODES.has(value));

  if (selectedModes.length !== 1) {
    throw new Error('Use exactly one mode: --set, --ensure, --check or --place.');
  }

  return selectedModes[0];
}

function getVersionParts(version) {
  const parts = String(version).split('.');

  if (parts.length < 3) {
    throw new Error(`Version "${version}" does not follow the expected major.minor.build format.`);
  }

  return parts;
}

function getVersionPrefix(version) {
  const [major, minor] = getVersionParts(version);
  return `${major}.${minor}.`;
}

function getBuildPart(version) {
  const [, , buildPart] = getVersionParts(version);
  return buildPart;
}

function hasPlaceholderVersion(version) {
  return version === VERSION_PLACEHOLDER;
}

function hasResolvedVersion(version) {
  const buildPart = getBuildPart(version);
  return buildPart !== VERSION_PLACEHOLDER && RESOLVED_BUILD_PATTERN.test(buildPart);
}

function getExplicitVersion() {
  return process.env.BUILD_VERSION?.trim() || '';
}

function getGitHash() {
  const explicitHash = process.env.BUILD_GIT_HASH?.trim() || process.env.GITHUB_SHA?.trim();

  if (explicitHash) {
    return explicitHash.slice(0, 7);
  }

  try {
    return execFileSync('git', ['rev-parse', '--short', 'HEAD'], {
      cwd: PROJECT_ROOT,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
  } catch {
    return 'nogit';
  }
}

function getBuildNumber() {
  const now = new Date();
  const year = String(now.getFullYear()).slice(-2);
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const dayOfYear = Math.floor((now - startOfYear) / (1000 * 60 * 60 * 24)) + 1;
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `${year}${String(dayOfYear).padStart(3, '0')}${hours}${minutes}`;
}

function resolveVersion(currentVersion) {
  const explicitVersion = getExplicitVersion();

  if (explicitVersion) {
    return explicitVersion;
  }

  return `${getVersionPrefix(currentVersion)}${getBuildNumber()}-${getGitHash()}`;
}

function isAlreadyEnsured(currentVersion) {
  const explicitVersion = getExplicitVersion();

  if (explicitVersion) {
    return currentVersion === explicitVersion;
  }

  return hasResolvedVersion(currentVersion);
}

function writeResolvedVersion(resolvedVersion) {
  const packageJson = readJson(PACKAGE_JSON_PATH);
  packageJson.version = resolvedVersion;
  writeJson(PACKAGE_JSON_PATH, packageJson);

  if (!fs.existsSync(PACKAGE_LOCK_PATH)) {
    return;
  }

  const packageLock = readJson(PACKAGE_LOCK_PATH);
  packageLock.version = resolvedVersion;

  if (packageLock.packages && packageLock.packages['']) {
    packageLock.packages[''].version = resolvedVersion;
  }

  writeJson(PACKAGE_LOCK_PATH, packageLock);
}

function runCheck(currentVersion) {
  if (hasPlaceholderVersion(currentVersion)) {
    console.log(`Placeholder version detected: ${currentVersion}`);
    return;
  }

  throw new Error(
    `Resolved build version detected: ${currentVersion}\nShould be: ${VERSION_PLACEHOLDER}`,
  );
}

function runEnsure(currentVersion) {
  if (isAlreadyEnsured(currentVersion)) {
    console.log(`Version already set: ${currentVersion}`);
    return;
  }

  if (hasPlaceholderVersion(currentVersion)) {
    throw new Error(`Placeholder version detected: ${currentVersion}`);
  }

  if (getExplicitVersion()) {
    throw new Error(
      `Version "${currentVersion}" does not match BUILD_VERSION "${getExplicitVersion()}".`,
    );
  }

  throw new Error(`Version "${currentVersion}" is not a resolved build version.`);
}

function runSet(currentVersion) {
  const resolvedVersion = resolveVersion(currentVersion);
  writeResolvedVersion(resolvedVersion);
  console.log(`Version set to: ${resolvedVersion}`);
}

function runSetPlace() {
  writeResolvedVersion(VERSION_PLACEHOLDER);
  console.log(`Version set to: ${VERSION_PLACEHOLDER}`);
}

try {
  const selectedMode = getSelectedMode();
  const packageJson = readJson(PACKAGE_JSON_PATH);
  const packageVersion = String(packageJson.version);
  const currentVersion = String(packageJson.currentVersion);

  switch (selectedMode) {
    case '--check':
      runCheck(packageVersion);
      break;
    case '--ensure':
      runEnsure(packageVersion);
      break;
    case '--set':
      runSet(currentVersion);
      break;
    case '--place':
      runSetPlace();
      break;
    default:
      throw new Error(`Unknown mode: ${selectedMode}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}
