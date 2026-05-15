import { createReadStream } from 'node:fs';
import { access, readdir, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRoot = path.resolve(__dirname, '..');
const distRoot = path.join(appRoot, 'dist');
const port = Number.parseInt(process.env.PORT ?? '3000', 10);

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.gif', 'image/gif'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff', 'font/woff'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

function getContentType(filePath) {
  return mimeTypes.get(path.extname(filePath).toLowerCase()) ?? 'application/octet-stream';
}

function getCacheControl(filePath) {
  const normalizedPath = filePath.replace(/\\/g, '/');
  const fileName = path.basename(filePath);
  const extension = path.extname(fileName).toLowerCase();

  if (extension === '.html') {
    return 'no-cache, must-revalidate';
  }

  if (/\-[A-Z0-9]{8,}\.(css|js)$/i.test(fileName)) {
    return 'public, max-age=31536000, immutable';
  }

  if (
    [
      '.css',
      '.gif',
      '.ico',
      '.jpg',
      '.jpeg',
      '.js',
      '.json',
      '.map',
      '.png',
      '.svg',
      '.txt',
      '.webp',
      '.woff',
      '.woff2',
      '.xml',
    ].includes(extension)
  ) {
    return normalizedPath.includes('/browser/')
      ? 'public, max-age=604800, stale-while-revalidate=86400'
      : 'public, max-age=86400, stale-while-revalidate=3600';
  }

  return 'public, max-age=3600';
}

async function pathExists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function resolveBrowserRoot() {
  const directBrowserRoot = path.join(distRoot, 'browser');
  if (await pathExists(path.join(directBrowserRoot, 'index.html'))) {
    return directBrowserRoot;
  }

  const distEntries = await readdir(distRoot, { withFileTypes: true });
  for (const entry of distEntries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const nestedBrowserRoot = path.join(distRoot, entry.name, 'browser');
    if (await pathExists(path.join(nestedBrowserRoot, 'index.html'))) {
      return nestedBrowserRoot;
    }
  }

  throw new Error(`Could not locate a browser build under ${distRoot}`);
}

const browserRoot = await resolveBrowserRoot();

async function resolveFile(urlPath) {
  const normalized = path.posix.normalize(decodeURIComponent(urlPath));
  const relativePath = normalized.replace(/^(\.\.(\/|\\|$))+/, '').replace(/^\/+/, '');

  const distCandidate = path.join(distRoot, relativePath);
  if ((await pathExists(distCandidate)) && (await stat(distCandidate)).isFile()) {
    return distCandidate;
  }

  const browserCandidate = path.join(browserRoot, relativePath);
  if ((await pathExists(browserCandidate)) && (await stat(browserCandidate)).isFile()) {
    return browserCandidate;
  }

  if (!path.posix.extname(normalized)) {
    return path.join(browserRoot, 'index.html');
  }

  return null;
}

const server = createServer(async (request, response) => {
  try {
    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const filePath = await resolveFile(requestUrl.pathname);

    if (!filePath) {
      response.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end('Not found');
      return;
    }

    response.writeHead(200, {
      'Cache-Control': getCacheControl(filePath),
      'Content-Type': getContentType(filePath),
    });
    createReadStream(filePath).pipe(response);
  } catch (error) {
    response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    response.end('Internal server error');
    console.error(error);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving static app from ${browserRoot} on port ${port}`);
});
