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
const IMG_PAGES = { '/': 8, '/corvette-rental-boise/': 12, '/cars/corvette-stingray/': 12, '/c8-corvette-rental-boise/': 6, '/cars/': 3 };
const { PHOTOS } = require('./data');
const imgXml = (u) => (IMG_PAGES[u] ? PHOTOS.gallery.slice(0, IMG_PAGES[u]).map((p) => `<image:image><image:loc>${SITE.url}${p.src}</image:loc><image:caption>${p.alt.replace(/&/g, '&amp;').replace(/</g, '&lt;')}</image:caption></image:image>`).join('') : '');
write('sitemap.xml',
  '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">\n' +
  pages.map(([u]) => `  <url><loc>${SITE.url}${u}</loc><lastmod>${today}</lastmod><priority>${priority(u)}</priority>${imgXml(u)}</url>`).join('\n') +
  '\n</urlset>\n');

write('site.webmanifest', JSON.stringify({
  name: SITE.name, short_name: 'Boise Luxury', description: 'Luxury and sport car rentals in Boise, Idaho. Book on Turo.',
  start_url: '/', scope: '/', display: 'standalone', background_color: '#0a0c0f', theme_color: '#0a0c0f',
  icons: [
    { src: '/assets/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
    { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
    { src: '/assets/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
  ],
}, null, 2));

write('robots.txt', `User-agent: *\nAllow: /\nDisallow: /api/\n\nSitemap: ${SITE.url}/sitemap.xml\n`);

const { LOGO_MARK, svgDoc } = require('./brand');
write('assets/favicon.svg', svgDoc(LOGO_MARK, '-6 -6 76 76', '<rect x="-6" y="-6" width="76" height="76" rx="16" fill="#0a0c0f"/>'));
write('assets/logo.svg', svgDoc(LOGO_MARK, '-6 -6 76 76', '<rect x="-6" y="-6" width="76" height="76" fill="#0a0c0f"/>'));

console.log('Built ' + (pages.length + 1) + ' pages, sitemap.xml, robots.txt');
