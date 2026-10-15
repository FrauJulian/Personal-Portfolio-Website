import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import { fileURLToPath } from 'node:url';
import { createBrotliCompress, createGzip } from 'node:zlib';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const appRoot = path.resolve(__dirname, '..');
const distRoot = path.join(appRoot, 'dist');
const browserRoot = path.join(distRoot, 'browser');
const port = 3000;
const indexPath = path.join(browserRoot, 'index.html');
// Keep in sync with src/app/app.routes.ts.
const appRoutes = new Set(['/', '/imprint']);

const mimeTypes = new Map([
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.ico', 'image/x-icon'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.map', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);

const compressibleExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.map',
  '.svg',
  '.txt',
  '.xml',
]);

const securityHeaders = {
  'Permissions-Policy': 'camera=(), geolocation=(), microphone=()',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Strict-Transport-Security': 'max-age=31536000',
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
};

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
      '.ico',
      '.jpg',
      '.js',
      '.json',
      '.map',
      '.png',
      '.svg',
      '.txt',
      '.webp',
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

async function isFile(targetPath) {
  try {
    return (await stat(targetPath)).isFile();
  } catch {
    return false;
  }
}

function resolveInside(root, relativePath) {
  const candidate = path.resolve(root, relativePath);
  return candidate === root || candidate.startsWith(`${root}${path.sep}`) ? candidate : null;
}

async function resolveFile(urlPath) {
  const normalized = path.posix.normalize(decodeURIComponent(urlPath));
  const relativePath = normalized.replace(/^\/+/, '');

  for (const root of [distRoot, browserRoot]) {
    const candidate = resolveInside(root, relativePath);
    if (candidate === null) {
      return null;
    }

    if (await isFile(candidate)) {
      return candidate;
    }
  }

  return null;
}

function getEncoding(request, filePath) {
  if (!compressibleExtensions.has(path.extname(filePath).toLowerCase())) {
    return null;
  }

  const acceptEncoding = request.headers['accept-encoding'] ?? '';
  if (/\bbr\b/.test(acceptEncoding)) {
    return 'br';
  }

  return /\bgzip\b/.test(acceptEncoding) ? 'gzip' : null;
}

async function sendFile(request, response, filePath, statusCode) {
  const encoding = getEncoding(request, filePath);
  const headers = {
    ...securityHeaders,
    'Cache-Control': statusCode === 200 ? getCacheControl(filePath) : 'no-cache',
    'Content-Type': getContentType(filePath),
    Vary: 'Accept-Encoding',
  };

  if (encoding !== null) {
    headers['Content-Encoding'] = encoding;
  }

  response.writeHead(statusCode, headers);

  if (request.method === 'HEAD') {
    response.end();
    return;
  }

  const source = createReadStream(filePath);
  if (encoding === null) {
    await pipeline(source, response);
    return;
  }

  await pipeline(source, encoding === 'br' ? createBrotliCompress() : createGzip(), response);
}

function sendText(response, statusCode, message, extraHeaders = {}) {
  response.writeHead(statusCode, {
    ...securityHeaders,
    ...extraHeaders,
    'Content-Type': 'text/plain; charset=utf-8',
  });
  response.end(message);
}

const server = createServer(async (request, response) => {
  try {
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      sendText(response, 405, 'Method not allowed', { Allow: 'GET, HEAD' });
      return;
    }

    const requestUrl = new URL(request.url ?? '/', `http://${request.headers.host ?? 'localhost'}`);
    const filePath = await resolveFile(requestUrl.pathname);

    if (filePath) {
      await sendFile(request, response, filePath, 200);
      return;
    }

    const routePath = requestUrl.pathname.replace(/(.)\/+$/, '$1');
    if (appRoutes.has(routePath)) {
      await sendFile(request, response, indexPath, 200);
      return;
    }

    // Unknown routes get a 404 status but still boot the app, which redirects to the start page.
    if (!path.posix.extname(requestUrl.pathname)) {
      await sendFile(request, response, indexPath, 404);
      return;
    }

    sendText(response, 404, 'Not found');
  } catch (error) {
    if (!response.headersSent) {
      sendText(response, 500, 'Internal server error');
    } else {
      response.destroy();
    }
    console.error(error);
  }
});

server.listen(port, '0.0.0.0', () => {
  console.log(`Serving static app on port ${port}`);
});
