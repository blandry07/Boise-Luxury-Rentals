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

const LOGO_MARK = '<circle cx="32" cy="32" r="28" fill="none" stroke="#eef1f5" stroke-width="3"/><circle cx="32" cy="32" r="28" fill="none" stroke="#e5352b" stroke-width="5" stroke-linecap="round" stroke-dasharray="52 200" transform="rotate(-70 32 32)"/><text x="32" y="39" text-anchor="middle" font-family="system-ui,Arial,sans-serif" font-weight="900" font-size="19" fill="#fff" letter-spacing="-.5">BLR</text>';
write('assets/favicon.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="-4 -4 72 72"><rect x="-4" y="-4" width="72" height="72" rx="16" fill="#0a0c0f"/>' + LOGO_MARK + '</svg>');
write('assets/logo.svg', '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" fill="#0a0c0f"/>' + LOGO_MARK + '</svg>');

console.log('Built ' + (pages.length + 1) + ' pages, sitemap.xml, robots.txt');
