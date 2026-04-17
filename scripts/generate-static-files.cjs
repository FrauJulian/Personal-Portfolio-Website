const fs = require('fs');
const path = require('path');
const { loadEnvFromFileCandidates } = require('./env-utils.cjs');
const staticSiteConfig = require('./static-site.config.cjs');

loadEnvFromFileCandidates();

const outputDir = path.join(process.cwd(), 'src');
const robotsPath = path.join(outputDir, 'robots.txt');
const sitemapPath = path.join(outputDir, 'sitemap.xml');

const configuredSiteUrl = process.env.PUBLIC_SITE_URL || staticSiteConfig.siteUrl;
const siteUrl = normalizeSiteUrl(configuredSiteUrl);

if (!siteUrl) {
  throw new Error(
    'Missing site URL for static file generation. Set PUBLIC_SITE_URL or scripts/static-site.config.cjs.',
  );
}

const robotsContent = createRobotsContent(staticSiteConfig.robots, siteUrl);
const sitemapContent = createSitemapContent(staticSiteConfig.sitemap.routes, siteUrl);

fs.writeFileSync(robotsPath, `${robotsContent}\n`, 'utf8');
fs.writeFileSync(sitemapPath, `${sitemapContent}\n`, 'utf8');

console.log(`Generated ${path.relative(process.cwd(), robotsPath)}`);
console.log(`Generated ${path.relative(process.cwd(), sitemapPath)}`);

function normalizeSiteUrl(rawSiteUrl) {
  if (typeof rawSiteUrl !== 'string') {
    return '';
  }

  const trimmedSiteUrl = rawSiteUrl.trim().replace(/\/+$/u, '');
  if (!trimmedSiteUrl) {
    return '';
  }

  try {
    const normalizedUrl = new URL(trimmedSiteUrl);
    return normalizedUrl.toString().replace(/\/+$/u, '');
  } catch {
    throw new Error(`Invalid site URL "${rawSiteUrl}" in static site configuration.`);
  }
}

function createRobotsContent(robotsConfig, resolvedSiteUrl) {
  const lines = ['User-agent: *', ''];

  for (const allowedPath of robotsConfig.allow) {
    lines.push(`Allow: ${allowedPath}`);
  }

  for (const disallowedPath of robotsConfig.disallow) {
    lines.push(`Disallow: ${disallowedPath}`);
  }

  lines.push('', `Sitemap: ${resolvedSiteUrl}/sitemap.xml`);

  return lines.join('\n');
}

function createSitemapContent(routes, resolvedSiteUrl) {
  const entries = routes
    .map((route) => {
      const normalizedPath = normalizeRoutePath(route.path);
      const parts = [
        '  <url>',
        `    <loc>${escapeXml(`${resolvedSiteUrl}${normalizedPath}`)}</loc>`,
      ];

      if (route.lastModified) {
        parts.push(`    <lastmod>${escapeXml(route.lastModified)}</lastmod>`);
      }

      if (route.changeFrequency) {
        parts.push(`    <changefreq>${escapeXml(route.changeFrequency)}</changefreq>`);
      }

      if (route.priority) {
        parts.push(`    <priority>${escapeXml(route.priority)}</priority>`);
      }

      parts.push('  </url>');
      return parts.join('\n');
    })
    .join('\n');

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    entries,
    '</urlset>',
  ].join('\n');
}

function normalizeRoutePath(routePath) {
  if (routePath === '/') {
    return '';
  }

  if (typeof routePath !== 'string' || !routePath.startsWith('/')) {
    throw new Error(`Invalid sitemap route "${routePath}". Routes must start with "/".`);
  }

  return routePath;
}

function escapeXml(value) {
  return value
    .replace(/&/gu, '&amp;')
    .replace(/"/gu, '&quot;')
    .replace(/'/gu, '&apos;')
    .replace(/</gu, '&lt;')
    .replace(/>/gu, '&gt;');
}
