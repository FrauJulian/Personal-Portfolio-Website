const lastModified = '2026-10-15';

module.exports = {
  siteUrl: 'https://fraujulian.xyz',
  sitemap: {
    routes: [
      { path: '/', lastModified, changeFrequency: 'monthly', priority: '1.0' },
      { path: '/?lang=de', lastModified, changeFrequency: 'monthly', priority: '1.0' },
      { path: '/imprint', lastModified, changeFrequency: 'yearly', priority: '0.3' },
      { path: '/imprint?lang=de', lastModified, changeFrequency: 'yearly', priority: '0.3' },
    ],
  },
  robots: {
    allow: ['/'],
    disallow: [],
  },
};
