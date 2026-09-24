'use strict';
/**
 * Generates every HTML page into /public plus sitemap.xml and robots.txt.
 * Run with: npm run build
 */
const fs = require('fs');
const path = require('path');
const { SITE, GUIDES } = require('./data');
const core = require('./pages-core');
const seo = require('./pages-seo');
const fl = require('./pages-flagship');

const PUBLIC = path.join(__dirname, '..', 'public');

const pages = [
  ['/', core.home()],
  ['/cars/', core.carsIndex()],
  ['/cars/corvette-stingray/', fl.vehiclePage()],
  ['/corvette-rental-boise/', fl.flagship()],
  ['/c8-corvette-rental-boise/', fl.c8Page()],
  ['/sports-car-rental-boise/', seo.sportsCarPage()],
  ['/boise-airport-car-rental/', seo.airportPage()],
  ['/exotic-rental-boise/', seo.exoticPage()],
  ['/things-to-do-boise-by-car/', core.thingsPage()],
  ['/about/', core.aboutPage()],
  ['/faq/', core.faqPage()],
  ['/contact/', core.contactPage()],
  ['/privacy/', core.privacyPage()],
  ['/guides/', seo.guidesIndex()],
  ['/guides/corvette-rental-boise-guide/', seo.guideCorvette()],
  ['/guides/best-sports-car-routes-boise/', seo.guideRoutes()],
  ['/guides/boise-to-mccall-road-trip/', seo.guideMcCall()],
  ['/guides/boise-to-sun-valley-road-trip/', seo.guideSunValley()],
  ['/guides/boise-airport-sports-car-rental/', seo.guideAirport()],
];

function write(rel, content) {
  const file = path.join(PUBLIC, rel);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, content);
}

for (const [url, html] of pages) {
  write(url === '/' ? 'index.html' : url.replace(/^\//, '') + 'index.html', html);
}
write('404.html', core.notFoundPage());

// Sitemap
const priority = (u) => (u === '/' ? '1.0' : u.startsWith('/guides/') && u !== '/guides/' ? '0.6' : u === '/privacy/' ? '0.2' : '0.8');
const today = new Date().toISOString().slice(0, 10);
write('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  pages.map(([u]) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority></url>`).join('\n') +
  '\n</urlset>\n');

write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

write('assets/favicon.svg',
  '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="14" fill="#0a0c0f"/><path d="M10 40c4-10 12-16 24-16 8 0 14 3 20 10l-4 4H14z" fill="#e5352b"/><circle cx="22" cy="42" r="5" fill="#eef1f5"/><circle cx="44" cy="42" r="5" fill="#eef1f5"/></svg>');

console.log('Built ' + (pages.length + 1) + ' pages, sitemap.xml, robots.txt');
