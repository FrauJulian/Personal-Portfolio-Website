const fs = require('fs');
const path = require('path');

const ENV_FILE_CANDIDATES = [
  path.join(process.cwd(), '.env'),
  path.join(process.cwd(), 'backend', '.env'),
];

function applyEnvFile(filePath, env = process.env) {
  const rawFile = fs.readFileSync(filePath, 'utf8').replace(/^\uFEFF/u, '');
  const lines = rawFile.split(/\r?\n/u);

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) {
      continue;
    }

    const withoutExport = trimmedLine.startsWith('export ')
      ? trimmedLine.slice('export '.length).trim()
      : trimmedLine;
    const separatorIndex = withoutExport.indexOf('=');
    if (separatorIndex <= 0) {
      continue;
    }

    const key = withoutExport.slice(0, separatorIndex).trim();
    let value = withoutExport.slice(separatorIndex + 1).trim();

    if (!/^[A-Za-z_][A-Za-z0-9_]*$/u.test(key) || key in env) {
      continue;
    }

    if (value.startsWith('"') && value.endsWith('"')) {
      value = value
        .slice(1, -1)
        .replace(/\\n/gu, '\n')
        .replace(/\\r/gu, '\r')
        .replace(/\\t/gu, '\t')
        .replace(/\\"/gu, '"')
        .replace(/\\\\/gu, '\\');
    } else if (value.startsWith("'") && value.endsWith("'")) {
      value = value.slice(1, -1);
    } else {
      value = value.replace(/\s+#.*$/u, '').trim();
    }

    env[key] = value;
  }
}

function loadEnvFromFileCandidates(envFileCandidates = ENV_FILE_CANDIDATES, env = process.env) {
  for (const envFilePath of envFileCandidates) {
    if (!fs.existsSync(envFilePath)) {
      continue;
    }

    applyEnvFile(envFilePath, env);
    return envFilePath;
  }

  return null;
}

function parsePositiveIntEnv(names, fallback, env = process.env) {
  const candidates = Array.isArray(names) ? names : [names];

  for (const name of candidates) {
    const rawValue = env[name];
    if (rawValue === undefined || rawValue === null || rawValue.trim().length === 0) {
      continue;
    }

    const parsed = Number.parseInt(rawValue, 10);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      throw new Error(`${name} must be a positive integer. Received "${rawValue}".`);
    }

    return parsed;
  }

  return fallback;
}

function parseTimeZoneEnv(name, fallback, env = process.env) {
  const rawValue = env[name];
  const value =
    rawValue === undefined || rawValue === null || rawValue.trim().length === 0
      ? fallback
      : rawValue.trim();

  try {
    new Intl.DateTimeFormat('en-GB', {
      timeZone: value,
    });
  } catch {
    throw new Error(`${name} must be a valid IANA timezone. Received "${rawValue}".`);
  }

  return value;
}

module.exports = {
  loadEnvFromFileCandidates,
  parsePositiveIntEnv,
  parseTimeZoneEnv,
};
