'use strict';
const { SITE, PHOTOS } = require('./data');

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const mapsDir = (q) =>
  'https://www.google.com/maps/dir/?api=1&origin=' + encodeURIComponent(SITE.origin) +
  '&destination=' + encodeURIComponent(q);

const NAV = [
  { href: '/', label: 'Home' },
  { href: '/cars/', label: 'Cars' },
  { href: '/things-to-do-boise-by-car/', label: 'Things to See' },
  { href: '/guides/', label: 'Guides' },
  { href: '/about/', label: 'About' },
  { href: '/faq/', label: 'FAQ' },
  { href: '/contact/', label: 'Contact' },
];

/** Primary booking button. Always points at Turo and always says so. */
const CTA_LABEL = 'CHECK AVAILABILITY & BOOK ON TURO';

function turoBtn(label, opts = {}) {
  const note = opts.note === false ? '' : '<span class="cta-note">Secure checkout on Turo. Live dates &amp; pricing.</span>';
  const cls = 'btn btn-turo' + (opts.small ? ' btn-sm' : '') + (opts.big ? ' btn-xl' : '');
  const a = `<a class="${cls}" href="${SITE.turoUrl}" target="_blank" rel="noopener" data-turo>${esc(label || 'Book on Turo')} <span aria-hidden="true">&rarr;</span></a>`;
  return opts.note === false ? a : `<span class="cta-stack">${a}${note}</span>`;
}

function crumbs(items) {
  return '<nav class="crumbs" aria-label="Breadcrumb">' +
    items.map((c, i) => (i < items.length - 1 ? `<a href="${c.href}">${esc(c.label)}</a> / ` : esc(c.label))).join('') +
    '</nav>';
}

function breadcrumbSchema(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((c, i) => ({
      '@type': 'ListItem', position: i + 1, name: c.label, item: SITE.url + (c.href || ''),
    })),
  };
}

function businessSchema() {
  return [{
    '@context': 'https://schema.org',
    '@type': 'AutoRental',
    '@id': SITE.url + '/#business',
    name: SITE.name,
    url: SITE.url,
    image: SITE.url + PHOTOS.hero,
    description: 'Sports and luxury car rentals in Boise, Idaho, including a 2023 Chevrolet Corvette Stingray 2LT (C8). Bookings are completed on Turo.',
    areaServed: ['Boise, ID', 'Meridian, ID', 'Eagle, ID', 'Nampa, ID', 'Caldwell, ID', 'Star, ID', 'Kuna, ID', 'Treasure Valley, ID', 'Idaho'],
    address: { '@type': 'PostalAddress', addressLocality: 'Meridian', addressRegion: 'ID', addressCountry: 'US' },
    geo: { '@type': 'GeoCoordinates', latitude: 43.6121, longitude: -116.3915 },
    potentialAction: { '@type': 'ReserveAction', target: { '@type': 'EntryPoint', urlTemplate: SITE.turoUrl, actionPlatform: 'https://schema.org/DesktopWebPlatform' }, result: { '@type': 'LodgingReservation', name: 'Reserve on Turo' } },
  }, {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    publisher: { '@id': SITE.url + '/#business' },
  }];
}

/** schema.org Car for the actual vehicle (no price/offer is invented). */
function carSchema(extra = {}) {
  const { LISTING } = require('./data');
  return Object.assign({
    '@context': 'https://schema.org',
    '@type': 'Car',
    name: `${LISTING.year} ${LISTING.make} ${LISTING.model} ${LISTING.trim}`,
    brand: { '@type': 'Brand', name: LISTING.make },
    model: LISTING.model,
    vehicleModelDate: String(LISTING.year),
    bodyType: 'Coupe',
    vehicleSeatingCapacity: 2,
    vehicleEngine: { '@type': 'EngineSpecification', name: '6.2L LT2 V8', engineDisplacement: { '@type': 'QuantitativeValue', value: 6.2, unitCode: 'LTR' } },
    vehicleTransmission: '8-speed dual-clutch automatic',
    driveWheelConfiguration: 'https://schema.org/RearWheelDriveConfiguration',
    image: PHOTOS.gallery.map((p) => SITE.url + p.src),
    url: SITE.url + '/cars/corvette-stingray/',
    description: `${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim} (C8) available to rent in Boise, Idaho through Turo.`,
  }, extra);
}

/** Article schema for guides. */
function articleSchema({ title, description, path, modified }) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    mainEntityOfPage: SITE.url + path,
    image: [SITE.url + PHOTOS.hero],
    datePublished: SITE.published,
    dateModified: modified || SITE.published,
    author: { '@type': 'Organization', name: SITE.name, url: SITE.url },
    publisher: { '@type': 'Organization', name: SITE.name, url: SITE.url },
  };
}

function gallery(photos, limit) {
  const list = limit ? photos.slice(0, limit) : photos;
  return '<div class="gallery">' + list.map((p) =>
    `<div class="ph"><img src="${p.src}" data-full="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async" onerror="this.style.display='none'"></div>`
  ).join('') + '</div>';
}

function disclosure(extra) {
  return `<div class="notice">
  <h3>How booking works: it happens on Turo</h3>
  <p><strong>${esc(SITE.short)}</strong> is an independent local host on <strong>Turo</strong>, the world's largest car-sharing marketplace. This website is our showcase. <strong>All reservations, payments, insurance/protection plans and trip terms are handled by Turo</strong>, not on this site. Click <em>Book on Turo</em> to see live pricing and availability.</p>
  ${extra ? '<p>' + extra + '</p>' : ''}
  <p style="margin-top:14px">${turoBtn('Book the Corvette on Turo')}</p>
</div>`;
}

function faqHtml(faqs) {
  return faqs.map((f) => `<details class="faq"><summary>${esc(f.q)}</summary><div class="ans"><p>${esc(f.a)}</p></div></details>`).join('');
}

function faqSchema(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
  };
}

/**
 * Wrap page content in the shared layout.
 * opts: { path, title, description, body, schema[], hero (bool for transparent), ogImage, noindex }
 */
function layout(opts) {
  const url = SITE.url + opts.path;
  const schemas = (opts.schema || []).concat(opts.path === '/' ? businessSchema() : []);
  const og = SITE.url + (opts.ogImage || PHOTOS.hero);
  const nav = NAV.map((n) => {
    const current = n.href === opts.path || (n.href !== '/' && opts.path.startsWith(n.href)) ? ' aria-current="page"' : '';
    return `<a href="${n.href}"${current}>${n.label}</a>`;
  }).join('');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(opts.title)}</title>
<meta name="description" content="${esc(opts.description)}">
<link rel="canonical" href="${url}">
${opts.noindex ? '<meta name="robots" content="noindex">' : '<meta name="robots" content="index,follow,max-image-preview:large,max-snippet:-1">'}
${opts.preloadHero ? `<link rel="preload" as="image" href="${PHOTOS.hero}" fetchpriority="high">` : ''}
<meta property="og:locale" content="en_US">
<meta property="og:type" content="${opts.ogType || 'website'}">
<meta property="og:site_name" content="${esc(SITE.name)}">
<meta property="og:title" content="${esc(opts.title)}">
<meta property="og:description" content="${esc(opts.description)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${og}">
<meta name="twitter:card" content="summary_large_image">
<meta name="theme-color" content="#0a0c0f">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
${schemas.map((s) => '<script type="application/ld+json">' + JSON.stringify(s) + '</script>').join('\n')}
</head>
<body>
<a class="skip" href="#main">Skip to content</a>
<div class="turo-bar"><strong>All bookings are completed on Turo.</strong> Tap <em>Book on Turo</em> to check dates and pricing. <a href="/faq/">How it works</a></div>
<header class="site">
  <div class="wrap nav">
    <a class="brand" href="/" aria-label="${esc(SITE.name)} home">Boise Luxury Rentals<small>Sports &amp; Luxury Cars</small></a>
    <button class="menu-btn" aria-label="Menu" aria-expanded="false">Menu</button>
    <nav class="main" aria-label="Main">
      ${nav}
      ${turoBtn('Book on Turo', { small: true, note: false })}
    </nav>
  </div>
</header>
<main id="main">
${opts.body}
</main>
<footer class="site">
  <div class="wrap">
    <div class="grid g4">
      <div>
        <h4>${esc(SITE.short)}</h4>
        <p>Sports and luxury car rentals in Boise, Meridian and the Treasure Valley. Reservations are made on Turo.</p>
        <p>${turoBtn('Book on Turo', { small: true, note: false })}</p>
      </div>
      <div>
        <h4>Rentals</h4>
        <ul>
          <li><a href="/cars/corvette-stingray/">Corvette Stingray</a></li>
          <li><a href="/corvette-rental-boise/">Corvette Rental Boise</a></li>
          <li><a href="/c8-corvette-rental-boise/">C8 Corvette Rental</a></li>
          <li><a href="/sports-car-rental-boise/">Sports Car Rental Boise</a></li>
          <li><a href="/exotic-rental-boise/">Exotic Rental Boise</a></li>
          <li><a href="/boise-airport-car-rental/">Boise Airport Rentals</a></li>
        </ul>
      </div>
      <div>
        <h4>Explore</h4>
        <ul>
          <li><a href="/things-to-do-boise-by-car/">Things to See by Car</a></li>
          <li><a href="/guides/">Road Trip Guides</a></li>
          <li><a href="/guides/boise-to-mccall-road-trip/">Boise to McCall</a></li>
          <li><a href="/guides/boise-to-sun-valley-road-trip/">Boise to Sun Valley</a></li>
          <li><a href="/guides/best-sports-car-routes-boise/">Best Driving Routes</a></li>
        </ul>
      </div>
      <div>
        <h4>Company</h4>
        <ul>
          <li><a href="/about/">About</a></li>
          <li><a href="/faq/">FAQ</a></li>
          <li><a href="/contact/">Contact</a></li>
          <li><a href="/privacy/">Privacy</a></li>
        </ul>
      </div>
    </div>
    <p class="disclaimer"><strong>Popular searches:</strong>
      <a href="/corvette-rental-boise/">Corvette rental Boise</a> &middot;
      <a href="/c8-corvette-rental-boise/">C8 Corvette rental Boise</a> &middot;
      <a href="/corvette-rental-boise/#idaho">Corvette rental Idaho</a> &middot;
      <a href="/cars/corvette-stingray/">Corvette Stingray rental Boise</a> &middot;
      <a href="/sports-car-rental-boise/">Sports car rental Boise</a> &middot;
      <a href="/boise-airport-car-rental/">Boise airport sports car rental</a> &middot;
      <a href="/exotic-rental-boise/">Exotic car rental Boise</a>
    </p>
    <p class="disclaimer" style="border:0;margin-top:0;padding-top:0">${esc(SITE.short)} is an independent vehicle host on Turo and is not owned by, affiliated with or endorsed by Turo, Inc. Turo is a trademark of Turo Inc. All reservations, payments, insurance and protection plans, eligibility requirements, mileage limits and cancellation terms are provided by Turo and shown on the vehicle listing. Drive times and distances on this site are approximate, measured from Meridian, Idaho in normal traffic. Confirm conditions and current hours before you go. Drive safely and obey all traffic laws.</p>
    <p class="disclaimer" style="border:0;margin-top:0;padding-top:0">&copy; ${new Date().getFullYear()} ${esc(SITE.name)}. Meridian, Idaho.</p>
  </div>
</footer>
<div class="sticky-cta"><span>Reserve on Turo<br>Secure checkout</span>${turoBtn('Book on Turo', { small: true, note: false })}</div>
<div class="lightbox" role="dialog" aria-label="Photo viewer" aria-modal="true"><button class="lb-close" aria-label="Close">&times;</button><button class="lb-prev" aria-label="Previous">&lsaquo;</button><img alt=""><button class="lb-next" aria-label="Next">&rsaquo;</button></div>
<script src="/assets/site.js" defer></script>
</body>
</html>`;
}

/** Standard inner-page header (non-hero pages). */
function pageHead(crumbItems, h1, lead) {
  return `<div class="page-head"><div class="wrap">${crumbs(crumbItems)}<h1>${h1}</h1>${lead ? `<p class="lead muted" style="max-width:720px;font-size:1.1rem">${lead}</p>` : ''}</div></div>`;
}

function hero(h1, lead, opts = {}) {
  return `<section class="hero${opts.short ? ' short' : ''}${opts.xl ? ' xl' : ''}">
  <img class="bg" src="${opts.img || PHOTOS.hero}" alt="${esc(opts.alt || 'Chevrolet Corvette Stingray available to book on Turo in Boise, Idaho')}" fetchpriority="high" decoding="async" onerror="this.style.display='none'">
  <div class="wrap">
    ${opts.year ? `<span class="badge-year">${opts.year}</span><br>` : ''}<span class="eyebrow">${esc(opts.eyebrow || 'Boise, Idaho · Booked on Turo')}</span>
    <h1>${h1}</h1>
    <p class="lead">${lead}</p>
    ${opts.badge ? `<p class="turo-badge"><span>&#10003;</span> ${opts.badge}</p>` : ''}
    <div class="cta-row">${opts.big ? turoBtn(CTA_LABEL, { big: true }) : turoBtn('Book on Turo')}<a class="btn btn-ghost" href="${opts.secondaryHref || '/cars/corvette-stingray/'}">${esc(opts.secondaryLabel || 'See the Corvette')}</a></div>
    ${opts.stats ? statStrip(opts.stats) : ''}
  </div>
</section>`;
}

/** Row of big numbers, e.g. [['495','HP'],['2.9s','0-60 mph']] */
function statStrip(stats) {
  return `<div class="stat-strip">${stats.map(([n, l]) => `<div><b>${n}</b><span>${l}</span></div>`).join('')}</div>`;
}

/** Fallback-aware listing value: shows the value if you filled it in, else points to Turo. */
function val(v, fallback) {
  return v ? esc(v) : (fallback || 'See the Turo listing');
}

module.exports = { esc, mapsDir, turoBtn, crumbs, breadcrumbSchema, gallery, disclosure, faqHtml, faqSchema, layout, pageHead, hero, statStrip, val, carSchema, articleSchema, CTA_LABEL, NAV };
