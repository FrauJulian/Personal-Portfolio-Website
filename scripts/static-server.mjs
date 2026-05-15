import { createReadStream } from 'node:fs';
import { access, stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRoot = path.resolve(__dirname, '..');
const distRoot = path.join(appRoot, 'dist');
const browserRoot = path.join(distRoot, 'browser');
const port = 3000;

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
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
    ['.css', '.ico', '.js', '.json', '.map', '.png', '.svg', '.txt', '.webp', '.xml'].includes(
      extension,
    )
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

async function resolveFile(urlPath) {
  const normalized = path.posix.normalize(decodeURIComponent(urlPath));
  const relativePath = normalized.replace(/^(\.\.(\/|\\|$))+/, '').replace(/^\/+/, '');

  const rootCandidate = path.join(distRoot, relativePath);
  if ((await pathExists(rootCandidate)) && (await stat(rootCandidate)).isFile()) {
    return rootCandidate;
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
  console.log(`Serving static app on port ${port}`);
});
