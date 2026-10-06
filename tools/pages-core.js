'use strict';
const { SITE, PHOTOS, PLACES, RESTAURANTS, FAQS, CARS, GUIDES } = require('./data');
const L = require('./lib');
const { esc, turoBtn, layout, pageHead, hero, statStrip, gallery, disclosure, faqHtml, faqSchema, breadcrumbSchema, mapsDir, picImg, PRICE_BADGE } = L;
const FEATURED_PHOTO = PHOTOS.pick('featured');

function placeCard(p) {
  const link = p.href ? `<a href="${p.href}">Read the route guide &rarr;</a> &nbsp;·&nbsp; ` : '';
  return `<article class="card place">
  <h3>${esc(p.name)}</h3>
  <div class="meta"><span class="pill drive">${p.mi} mi · ~${fmtMin(p.min)}</span>${p.area ? `<span class="pill">${esc(p.area)}</span>` : ''}</div>
  <p class="muted" style="margin:0">${esc(p.blurb)}</p>
  <div class="dir">${link}<a class="dir" href="${mapsDir(p.q)}" target="_blank" rel="noopener">Live directions</a></div>
</article>`;
}

/**
 * Tiny inline lead-capture form under each "coming soon" fleet car. Posts to
 * the same /api/contact endpoint (and the same CONTACT_TO inbox) as the main
 * contact form via the generic .notify-form handler in site.js — the visitor
 * only ever sees an email field; name/message are pre-filled so the existing
 * backend validation (name + message required) is satisfied without asking
 * them to type anything extra.
 */
function notifyForm(carName) {
  return `<form class="notify-form" novalidate>
    <input type="hidden" name="name" value="Notify Me signup">
    <input type="hidden" name="vehicle" value="${esc(carName)}">
    <input type="hidden" name="message" value="Please notify me when the ${esc(carName)} is available to book.">
    <div class="hp" aria-hidden="true"><label>Leave this empty</label><input name="website" tabindex="-1" autocomplete="off"></div>
    <div class="row"><input type="email" name="email" required maxlength="150" placeholder="Your email" aria-label="Email for ${esc(carName)} notify me"><button class="btn btn-ghost btn-sm" type="submit">Notify Me</button></div>
    <p class="form-msg" role="status" aria-live="polite"></p>
  </form>`;
}

function fmtMin(m) {
  if (m < 60) return m + ' min';
  const h = Math.floor(m / 60), r = m % 60;
  return h + ' hr' + (r ? ' ' + r + ' min' : '');
}

function steps() {
  return `<div class="grid g3">
  <div class="card"><div class="step-num">1</div><h3>Pick your dates on Turo</h3><p class="muted">Tap <em>Book on Turo</em> to open our Corvette listing. See live availability, pricing, mileage and delivery options.</p></div>
  <div class="card"><div class="step-num">2</div><h3>Reserve &amp; check out on Turo</h3><p class="muted">Turo handles your payment, driver verification and protection plan, so your booking is protected by their platform.</p></div>
  <div class="card"><div class="step-num">3</div><h3>Pick up &amp; drive Idaho</h3><p class="muted">We coordinate hand-off through Turo trip messaging. Then take the Corvette to the foothills, McCall or Sun Valley.</p></div>
</div>`;
}

function home() {
  const teaser = PLACES.filter((p) => ['Idaho State Capitol', 'Bogus Basin Road', 'Idaho City (Ponderosa Pine Scenic Byway)', 'McCall & Payette Lake', 'Sun Valley & Ketchum', 'Lucky Peak Reservoir & Discovery Park'].includes(p.name));
  const body = `
${hero('Boise <span>Luxury Rentals</span>',
    'Rent our 2023 Corvette Stingray Z51 &mdash; book securely on Turo.',
    { xl: true, big: true, compact: true, singleCta: true, eyebrow: 'Sports Car Rental Boise · Corvette Rental Idaho',
      video: { src: '/videos/corvette-hero-loop-v4.mp4', poster: '/images/corvette-hero-poster.jpg' },
      alt: '2023 Chevrolet Corvette Stingray Z51 in a studio, front three-quarter view',
      saveForLater: ['/', 'Boise Luxury Rentals — Corvette Rental'] })}

<section class="mini-stats"><div class="wrap">
  <p class="muted" style="text-align:center;margin:0 0 10px;font-size:.85rem">${PRICE_BADGE}</p>
  <p class="muted" style="text-align:center;margin:0 0 16px;font-size:.85rem">2023 Chevrolet Corvette Stingray Z51 &middot; 5&#9733; rated on Turo &middot; All reservations are completed securely on <strong>Turo</strong></p>
  ${statStrip([['490+', 'Horsepower'], ['6.2L', 'V8'], ['~3.0s', '0-60 mph'], ['Open-air', 'Removable roof'], ['HUD', 'Heads Up Display'], ['Turo', 'Book securely']])}
</div></section>

<section>
  <div class="wrap">
    <span class="eyebrow">How it works</span>
    <h2>Simple to book. Unforgettable to drive.</h2>
    <p class="muted" style="max-width:720px">We're a local host, and every reservation is completed on <strong>Turo</strong>. That means secure checkout, Turo's protection plan options and easy trip messaging with us.</p>
    ${steps()}
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <div class="grid g2" style="align-items:center;gap:40px">
      <div>
        <span class="eyebrow">Featured car</span>
        <h2>2023 Chevrolet Corvette Stingray Z51 (C8)</h2>
        <p>The C8 moved the V8 behind the driver and rewrote the Corvette playbook: a 6.2L V8, an eight-speed dual-clutch transmission, a two-seat cockpit and supercar looks at a fraction of the usual exotic price tag.</p>
        <ul class="muted"><li>Mid-engine layout with a front and rear trunk</li><li>Automatic dual-clutch: easy in traffic, thrilling on the open road</li><li>Based in Meridian, minutes from Boise</li></ul>
        <div class="cta-row">${turoBtn('CHECK AVAILABILITY & BOOK ON TURO', { big: true })}</div><p style="margin-top:14px"><a href="/corvette-rental-boise/">Corvette rental Boise: full details, photos &amp; requirements &rarr;</a></p>
      </div>
      <div class="ph feature-photo">${picImg(FEATURED_PHOTO.src, FEATURED_PHOTO.alt, ' loading="lazy"')}</div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="eyebrow">Gallery</span>
    <h2>See the car</h2>
    ${gallery(PHOTOS.gallery, 5)}
    <p style="margin-top:22px"><a href="/cars/corvette-stingray/">See the full photo gallery &rarr;</a></p>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <span class="eyebrow">Where to drive it</span>
    <h2>Top drives &amp; landmarks in the Treasure Valley</h2>
    <p class="muted" style="max-width:720px">Every stop shows the approximate drive from Meridian. Here are a few favorites; the full list includes restaurants, landmarks and day trips.</p>
    <div class="grid g3">${teaser.map(placeCard).join('')}</div>
    <p style="margin-top:24px"><a class="btn btn-ghost" href="/things-to-do-boise-by-car/">See all things to see by car &rarr;</a></p>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="eyebrow">Our fleet</span>
    <h2>One car now. More on the way.</h2>
    <div class="grid g4">
      ${CARS.map((c) => `<div class="card car-card${c.status === 'soon' ? ' soon' : ''}">${c.photo ? `<div class="ph">${picImg(c.photo, `${c.name}, coming soon`, ' loading="lazy"')}</div>` : ''}<div class="body"><span class="tag${c.status === 'live' ? ' live' : ''}">${esc(c.tag)}</span><h3 style="margin-top:12px">${esc(c.name)}</h3><p class="muted">${esc(c.blurb)}</p>${c.status === 'live' ? `<a href="/cars/${c.slug}/">View details &rarr;</a>` : notifyForm(c.name)}</div></div>`).join('')}
    </div>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <span class="eyebrow">Road-trip guides</span>
    <h2>Plan your drive</h2>
    <div class="grid g3">
      ${GUIDES.slice(1, 4).map((g) => `<a class="card link" href="/guides/${g.slug}/"><h3>${esc(g.title)}</h3><p class="muted" style="margin:0">${esc(g.blurb)}</p></a>`).join('')}
    </div>
  </div>
</section>

<section>
  <div class="wrap narrow prose">
    <span class="eyebrow">Boise's sports car rental</span>
    <h2>Corvette rental in Boise and across Idaho</h2>
    <p>Whether you want a <a href="/corvette-rental-boise/">Corvette rental in Boise</a> for a special day or a full <strong>Corvette rental Idaho</strong> road trip, our 2023 Corvette Stingray Z51 is built for it. The <a href="/c8-corvette-rental-boise/">C8 Corvette rental</a> pairs a mid-engine layout with a 6.2L V8, and the removable roof makes every drive feel bigger.</p>
    <p>Looking for a <a href="/sports-car-rental-boise/">sports car rental in Boise</a> or a <a href="/exotic-rental-boise/">supercar-style exotic rental</a>? The <a href="/cars/corvette-stingray/">Corvette Stingray rental in Boise</a> is the closest, most fun value in the Treasure Valley. Flying in? See our <a href="/boise-airport-car-rental/">Boise Airport sports car rental</a> info, and remember: <strong>every booking is completed on Turo</strong>.</p>
  </div>
</section>

<section>
  <div class="wrap narrow">
    ${disclosure()}
  </div>
</section>

<section class="alt">
  <div class="wrap narrow">
    <span class="eyebrow">Quick answers</span>
    <h2>Frequently asked questions</h2>
    ${faqHtml(FAQS.slice(0, 5))}
    <p><a href="/faq/">See all FAQs &rarr;</a></p>
  </div>
</section>`;

  return layout({
    path: '/',
    title: 'Boise Sports Car Rental | Corvette Rental in Boise, Idaho',
    description: 'Rent a Chevrolet Corvette Stingray in Boise and the Treasure Valley. Luxury and sport car rentals, booked securely on Turo. Photos, road-trip guides and local tips.',
    body,
    preloadHero: '/images/corvette-hero-poster.jpg',
    schema: [faqSchema(FAQS.slice(0, 5))],
  });
}

function carsIndex() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Cars', href: '/cars/' }];
  const body = pageHead(crumbs, 'Our Cars', 'Luxury and sport rentals in the Boise area. Every vehicle is booked through Turo.') + `
<section><div class="wrap">
  <div class="grid g2">
    ${CARS.map((c, i) => `<div class="card car-card${c.status === 'soon' ? ' soon' : ''}">
      <div class="ph">${c.status === 'live' ? picImg(PHOTOS.gallery[0].src, `${c.name} rental in Boise`, ' loading="lazy"') : (c.photo ? picImg(c.photo, `${c.name}, coming soon to Boise Luxury Rentals`, ' loading="lazy"') : '')}</div>
      <div class="body"><span class="tag${c.status === 'live' ? ' live' : ''}">${esc(c.tag)}</span>
      <h3 style="margin-top:12px">${esc(c.name)}</h3><p class="muted">${esc(c.blurb)}</p>
      ${c.status === 'live' ? `<div class="cta-row"><a class="btn btn-ghost btn-sm" href="/cars/${c.slug}/">Details &amp; photos</a>${turoBtn('Book on Turo', { small: true, note: false })}</div>` : '<p class="muted" style="margin:0">Not yet available. Check back soon.</p>'}
      </div></div>`).join('')}
  </div>
  <div style="margin-top:36px">${disclosure()}</div>
</div></section>`;
  return layout({
    path: '/cars/',
    title: 'Luxury & Sport Cars for Rent in Boise | Corvette Stingray',
    description: 'Browse the Boise Luxury Rentals fleet: the Chevrolet Corvette Stingray today, with more luxury and sport cars coming. Reserve on Turo.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

function corvettePage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Cars', href: '/cars/' }, { label: 'Corvette Stingray', href: '/cars/corvette-stingray/' }];
  const body = hero('Chevrolet <span>Corvette Stingray</span> (C8)',
    'Mid-engine, V8-powered and unmistakably American. Available to rent in Meridian, Idaho, just minutes from Boise.',
    { short: true, eyebrow: 'Rent on Turo', secondaryLabel: 'See the photos', secondaryHref: '#gallery' }) + `
<section id="gallery">
  <div class="wrap">
    <span class="eyebrow">Photo gallery</span>
    <h2>Corvette Stingray in the Treasure Valley</h2>
    ${gallery(PHOTOS.gallery)}
    <div class="cta-row" style="margin-top:28px">${turoBtn('Book this Corvette on Turo')}</div>
  </div>
</section>

<section class="alt">
  <div class="wrap">
    <div class="grid g2" style="gap:40px">
      <div>
        <span class="eyebrow">The car</span>
        <h2>Why the C8 is special</h2>
        <p>The eighth-generation Corvette is the first production Corvette with the engine behind the cockpit. The layout is the same one used by many exotic supercars, but with a familiar Chevy V8 and everyday reliability.</p>
        <ul>
          <li><strong>6.2L V8 power:</strong> roughly 490&ndash;495 hp depending on configuration, with a sound to match</li>
          <li><strong>Eight-speed dual-clutch automatic:</strong> smooth in traffic, lightning-quick on the open road</li>
          <li><strong>Two trunks:</strong> front and rear storage for a weekend's worth of soft bags</li>
          <li><strong>Driver-focused cockpit:</strong> two seats, configurable displays and drive modes</li>
        </ul>
        <p class="muted">Exact year, trim, color, options and features are shown on the Turo listing.</p>
      </div>
      <div>
        <span class="eyebrow">Quick facts</span>
        <h2>At a glance</h2>
        <div class="card" style="padding:6px 10px">
          <table class="facts">
            <tr><th>Vehicle</th><td>Chevrolet Corvette Stingray (C8)</td></tr>
            <tr><th>Layout</th><td>Mid-engine, rear-wheel drive, 2 seats</td></tr>
            <tr><th>Engine</th><td>6.2L V8</td></tr>
            <tr><th>Transmission</th><td>8-speed dual-clutch automatic</td></tr>
            <tr><th>Storage</th><td>Front and rear trunk</td></tr>
            <tr><th>Location</th><td>Meridian, Idaho (Treasure Valley)</td></tr>
            <tr><th>Pricing, mileage &amp; deposit</th><td>Shown live on Turo</td></tr>
            <tr><th>Booking</th><td><strong>Turo only</strong></td></tr>
          </table>
        </div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <span class="eyebrow">Ideas</span>
    <h2>What to do with a Corvette</h2>
    <div class="grid g3">
      <div class="card"><h3>Weekend getaway</h3><p class="muted">Take the Payette River Scenic Byway to McCall for lakeside dinners and mountain views. <a href="/guides/boise-to-mccall-road-trip/">Route guide</a>.</p></div>
      <div class="card"><h3>Special-occasion day</h3><p class="muted">Anniversaries, birthdays and milestone celebrations. Add dinner downtown and a golden-hour drive to Bogus Basin.</p></div>
      <div class="card"><h3>Fly-in fun</h3><p class="muted">Visiting Boise and want something better than a standard rental? See our <a href="/guides/boise-airport-sports-car-rental/">airport rental guide</a>.</p></div>
    </div>
  </div>
</section>

<section class="alt">
  <div class="wrap narrow">
    ${disclosure('Before you book, review the Turo listing for driver requirements, protection plan choices, mileage allowance and the cancellation policy.')}
  </div>
</section>`;
  return layout({
    path: '/cars/corvette-stingray/',
    title: 'Chevrolet Corvette Stingray C8 Rental in Boise | Book on Turo',
    description: 'Rent our Chevrolet Corvette Stingray (C8) in Meridian and Boise, Idaho. Mid-engine 6.2L V8 performance. See photos, facts and book securely on Turo.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

function thingsPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Things to See by Car', href: '/things-to-do-boise-by-car/' }];
  const groups = [...new Set(PLACES.map((p) => p.group))];
  const placesHtml = groups.map((g) => `
    <h2 style="margin-top:2em">${esc(g)}</h2>
    <div class="grid g3">${PLACES.filter((p) => p.group === g).map(placeCard).join('')}</div>`).join('');

  const restRows = RESTAURANTS.map((r) => `<tr><td><strong>${esc(r.name)}</strong><br><span class="muted">${esc(r.area)}</span></td><td>${esc(r.blurb)}</td><td class="num">${r.mi} mi<br><span class="muted">~${fmtMin(r.min)}</span></td><td><a href="${mapsDir(r.q)}" target="_blank" rel="noopener">Directions</a></td></tr>`).join('');

  const body = pageHead(crumbs, 'Top Things to See in the Treasure Valley by Car',
    'Scenic drives, landmarks, day trips and great places to eat, all with drive distances from Meridian, where the Corvette is based.') + `
<section><div class="wrap">
  <div class="notice" style="margin-bottom:8px"><p><strong>About the distances:</strong> Miles and drive times are approximate, measured from Meridian, Idaho in normal traffic. Use the <em>Live directions</em> links for exact, current routing from your own starting point. Check hours, seasonal closures and road conditions before you go.</p></div>
  ${placesHtml}

  <h2 style="margin-top:2.2em">Top restaurants worth the drive</h2>
  <p class="muted">A handful of local favorites, with drive distance from Meridian. Call ahead for hours and reservations, as menus and hours change.</p>
  <div class="table-scroll card" style="padding:8px 14px">
    <table class="dist"><thead><tr><th>Restaurant</th><th>Why go</th><th>Drive from Meridian</th><th></th></tr></thead><tbody>${restRows}</tbody></table>
  </div>

  <div style="margin-top:44px">${disclosure('Ready to hit the road? Pick your dates on Turo.')}</div>
</div></section>`;
  const items = PLACES.map((p, i) => ({ '@type': 'ListItem', position: i + 1, name: p.name }));
  return layout({
    path: '/things-to-do-boise-by-car/',
    title: 'Things to See in Boise & the Treasure Valley by Car',
    description: 'Scenic drives, landmarks, day trips and top restaurants around Boise, Meridian and the Treasure Valley, each with drive distance and time.',
    body,
    schema: [breadcrumbSchema(crumbs), { '@context': 'https://schema.org', '@type': 'ItemList', name: 'Things to see in the Treasure Valley by car', itemListElement: items }],
  });
}

function aboutPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'About', href: '/about/' }];
  const body = pageHead(crumbs, 'About Boise Luxury Rentals', 'A locally owned luxury and sport car rental host in Meridian, Idaho.') + `
<section><div class="wrap prose">
  <p>${esc(SITE.name)} is an owner-operated car rental host based in Meridian, Idaho. We started with one goal: to make it easy for locals and visitors to experience Idaho's roads in something special.</p>
  <h2>Booked on Turo, hosted locally</h2>
  <p>We list our vehicles on <strong>Turo</strong>. That gives you a secure, familiar way to book: verified drivers, transparent pricing, protection plan options and support from a large platform. We handle the local side: keeping the cars clean, maintained and ready, and answering your questions before and during your trip.</p>
  <blockquote>This website is our showcase. Every reservation, payment and trip agreement is made on Turo.</blockquote>
  <h2>What we offer</h2>
  <ul>
    <li><strong>Well-kept vehicles.</strong> Starting with a Chevrolet Corvette Stingray (C8), with more luxury and sport cars planned.</li>
    <li><strong>Local knowledge.</strong> Our <a href="/things-to-do-boise-by-car/">things-to-see list</a> and <a href="/guides/">road-trip guides</a> are built around real Idaho driving roads.</li>
    <li><strong>Real people.</strong> Message us before you book and we will text or call you back.</li>
  </ul>
  <h2>Where we operate</h2>
  <p>Our Corvette is based in Meridian and serves the Treasure Valley: Boise, Meridian, Eagle, Nampa, Caldwell, Star and Kuna. Pickup and delivery options are shown on the Turo listing.</p>
  <h2>Ready to drive?</h2>
  <p>${turoBtn('Book the Corvette on Turo')}</p>
  <p>Questions first? <a href="/contact/">Contact us</a> or read the <a href="/faq/">FAQ</a>.</p>
</div></section>`;
  return layout({
    path: '/about/',
    title: 'About Boise Luxury Rentals | Local Turo Host in Meridian, Idaho',
    description: 'Boise Luxury Rentals is a locally owned Turo host in Meridian, Idaho, offering a Chevrolet Corvette Stingray. Learn how booking works.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

function faqPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'FAQ', href: '/faq/' }];
  const body = pageHead(crumbs, 'Frequently Asked Questions', 'Everything to know before you book the Corvette on Turo.') + `
<section><div class="wrap narrow">
  ${faqHtml(FAQS)}
  <div style="margin-top:36px">${disclosure()}</div>
  <p style="margin-top:24px" class="muted">Still have a question? <a href="/contact/">Send us a message</a> and we'll text or call you back.</p>
</div></section>`;
  return layout({
    path: '/faq/',
    title: 'Corvette Rental FAQ | Boise Luxury Rentals (Booked on Turo)',
    description: 'Answers about renting a Corvette in Boise: how booking works on Turo, insurance, requirements, mileage, luggage, pickup and more.',
    body, schema: [breadcrumbSchema(crumbs), faqSchema(FAQS)],
  });
}

function contactPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Contact', href: '/contact/' }];
  const body = pageHead(crumbs, 'Contact Us', 'Questions before you book? Send a message and we will text or call you back.') + `
<section><div class="wrap">
  <div class="grid g2" style="gap:40px;align-items:start">
    <div>
      <div class="notice" style="margin-bottom:24px">
        <h3>Want to book? Go to Turo.</h3>
        <p>We can't take reservations or payments through this form. To reserve the Corvette, use Turo, where you'll see live availability and pricing.</p>
        <p style="margin-top:14px">${turoBtn('Book on Turo')}</p>
      </div>
      <h2>Have a question first?</h2>
      <p class="muted">Ask about the car, planning a route, delivery, timing your trip around a flight, or anything else. We'll reply by text or phone call, so please include a phone number.</p>
      <p class="muted" style="margin-top:14px"><strong>Available 7am&ndash;9pm, 7 days a week.</strong></p>
    </div>
    <div class="card">
      <form id="contact-form" class="contact" novalidate>
        <div class="row2">
          <div><label for="name">Your name *</label><input id="name" name="name" autocomplete="name" required maxlength="100"></div>
          <div><label for="phone">Phone *</label><input id="phone" name="phone" type="tel" autocomplete="tel" maxlength="40" placeholder="(208) 555-0123"></div>
        </div>
        <div class="row2">
          <div><label for="email">Email (optional)</label><input id="email" name="email" type="email" autocomplete="email" maxlength="150"></div>
          <div><label for="contactPref">Best way to reach you</label><select id="contactPref" name="contactPref"><option value="Text">Text</option><option value="Call">Call</option><option value="Either">Either</option></select></div>
        </div>
        <div class="row2">
          <div><label for="vehicle">Vehicle</label><select id="vehicle" name="vehicle"><option>Corvette Stingray</option><option>Other / future vehicle</option></select></div>
          <div><label for="dates">Trip dates (optional)</label><input id="dates" name="dates" maxlength="120" placeholder="e.g. Oct 10-12"></div>
        </div>
        <div><label for="message">Message *</label><textarea id="message" name="message" required maxlength="4000"></textarea></div>
        <div class="hp" aria-hidden="true"><label for="website">Leave this empty</label><input id="website" name="website" tabindex="-1" autocomplete="off"></div>
        <div id="form-msg" class="form-msg" role="status" aria-live="polite"></div>
        <button class="btn btn-turo" type="submit">Send message</button>
        <p class="muted" style="font-size:.82rem;margin:0">By sending this you agree we may contact you about your inquiry. See our <a href="/privacy/">Privacy Policy</a> and <a href="/terms/">Terms &amp; Conditions</a>.</p>
      </form>
    </div>
  </div>
</div></section>`;
  return layout({
    path: '/contact/',
    title: 'Contact Boise Luxury Rentals | Questions Before You Book on Turo',
    description: 'Send a message to Boise Luxury Rentals. We will text or call you back. To reserve the Corvette, book on Turo.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

const LEGAL_UPDATED = 'October 2, 2026';

function legalToc(items) {
  return `<nav class="notice" aria-label="Table of contents" style="padding:18px 22px">
    <strong style="display:block;margin-bottom:8px">On this page</strong>
    <ol style="columns:2;column-gap:28px;margin:0;padding-left:1.2em">
      ${items.map((t, i) => `<li style="break-inside:avoid"><a href="#s${i + 1}">${t}</a></li>`).join('')}
    </ol>
  </nav>`;
}

function privacyPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Privacy Policy', href: '/privacy/' }];
  const toc = [
    'Information we collect', 'How we use information', 'Cookies &amp; tracking technologies',
    'How we share information &mdash; we do not sell your data', 'Turo and other third-party links',
    'Data retention', "Children's privacy", 'Your choices &amp; rights', 'Security', 'Changes to this policy', 'Contact us',
  ];
  const body = pageHead(crumbs, 'Privacy Policy', `Last updated: ${LEGAL_UPDATED}`) + `
<section><div class="wrap prose">
  ${legalToc(toc)}

  <p>${esc(SITE.short)} ("${esc(SITE.short)}," "we," "us" or "our") operates ${esc(SITE.domain)} (the "Site"). This Privacy Policy explains what information the Site collects, how we use and share it, and the choices you have. It applies only to ${esc(SITE.domain)} &mdash; it does not apply to Turo, Inc. ("Turo") or any other third-party site you visit from here, each of which has its own privacy practices.</p>
  <p><strong>The short version:</strong> we do not sell or rent your personal information to anyone, we collect only what we need to answer your questions and run the Site, and every booking, payment and protection plan happens on Turo under Turo's own privacy policy &mdash; never on this Site.</p>

  <h2 id="s1">1. Information we collect</h2>
  <h3>Information you give us directly</h3>
  <p>If you use the contact form on <a href="/contact/">our Contact page</a>, we collect what you choose to enter: your name, phone number, email address (optional), preferred contact method, the vehicle you're asking about, your trip dates (optional) and your message. A name and either a phone number or email are required so we can reply; everything else is optional.</p>
  <h3>Information collected automatically</h3>
  <p>Like most websites, when you visit the Site our servers and the third-party tools described in Section 3 automatically log standard technical information, which may include your IP address, approximate location derived from your IP address, browser and device type, operating system, referring/exit pages, the pages you view, and the dates and times of your visit.</p>
  <h3>Information we do not collect</h3>
  <p>We do not operate a booking or payment system, so we never collect payment card numbers, driver's license images, government ID numbers or insurance information through this Site. That information is collected and verified by Turo as part of its own booking process, governed by <a href="https://turo.com/us/en/privacy-policy" rel="noopener" target="_blank">Turo's Privacy Policy</a>.</p>

  <h2 id="s2">2. How we use information</h2>
  <ul>
    <li>To respond to messages sent through the contact form and follow up about a potential or existing trip;</li>
    <li>To operate, maintain, secure and improve the Site (for example, understanding which pages are useful and fixing problems);</li>
    <li>To measure how people find the Site and whether our advertising is working, using the tools described below;</li>
    <li>To detect, prevent and address fraud, abuse, spam or security issues (for example, a honeypot field and basic rate-limiting on the contact form); and</li>
    <li>To comply with applicable law or respond to lawful requests from public authorities.</li>
  </ul>
  <p>We do not use your contact-form information for unrelated marketing, and we do not profile you or make automated decisions that produce legal or similarly significant effects.</p>

  <h2 id="s3">3. Cookies &amp; tracking technologies</h2>
  <p>The Site uses cookies and similar technologies (like pixels and local storage) placed by us and by third parties:</p>
  <ul>
    <li><strong>Google Tag Manager (GTM):</strong> a tag-management tool that loads other measurement and advertising tags on our behalf. It may set cookies used for analytics (for example, to understand aggregate traffic and page performance).</li>
    <li><strong>Meta (Facebook) Pixel:</strong> loaded on every page, it allows Meta to help us measure the effectiveness of Facebook/Instagram advertising and may be used to build audiences for future ads. Meta may associate this with a Facebook or Instagram account if you have one and are logged in. Meta's use of this data is governed by <a href="https://www.facebook.com/privacy/policy/" rel="noopener" target="_blank">Meta's Privacy Policy</a>, and you can review or limit how Meta uses this information in your <a href="https://www.facebook.com/adpreferences/" rel="noopener" target="_blank">Meta Ad Preferences</a>.</li>
  </ul>
  <p>These providers may set their own cookies and collect data directly &mdash; we do not control exactly what they store, and their own privacy policies govern that collection. You can block or delete cookies in your browser settings at any time; doing so may affect how parts of the Site work but will not prevent you from browsing or using the contact form. We do not currently respond to browser "Do Not Track" signals because there is no common industry standard for how to interpret them.</p>

  <h2 id="s4">4. How we share information &mdash; we do not sell your data</h2>
  <p><strong>We do not sell, rent or trade your personal information to third parties for their own marketing purposes, and we never will.</strong> We share information only in these limited circumstances:</p>
  <ul>
    <li><strong>Service providers</strong> who perform tasks on our behalf and are bound to use data only for that purpose &mdash; for example, our email-delivery provider (to send and receive contact-form messages), our hosting provider (to run the Site), and analytics/advertising platforms (Google and Meta, as described above);</li>
    <li><strong>Legal reasons</strong> &mdash; if required to by law, subpoena, or other legal process, or to protect the rights, property or safety of ${esc(SITE.short)}, our visitors or the public;</li>
    <li><strong>Business transfers</strong> &mdash; if we were ever to sell, merge or reorganize the business, information may transfer as part of that deal, subject to this Policy or a successor policy you're notified of; and</li>
    <li><strong>With your direction</strong> &mdash; for example, if you ask us to pass a question along to Turo on your behalf.</li>
  </ul>

  <h2 id="s5">5. Turo and other third-party links</h2>
  <p>${esc(SITE.short)} is an independent vehicle host on Turo and is not owned by, affiliated with, or endorsed by Turo, Inc. Every "Book on Turo" link takes you to Turo's platform, where Turo collects and processes the information needed for identity verification, payment, insurance/protection plans and trip messaging under its own <a href="https://turo.com/us/en/privacy-policy" rel="noopener" target="_blank">Privacy Policy</a> and <a href="https://turo.com/us/en/terms" rel="noopener" target="_blank">Terms of Service</a>. We encourage you to read those directly, since we have no access to, and no control over, the information you provide to Turo. The Site may also link to our social profiles (Facebook, Instagram, Google) or other outside sites; this Policy does not cover those third-party destinations.</p>

  <h2 id="s6">6. Data retention</h2>
  <p>We keep contact-form messages for as long as reasonably necessary to respond to your inquiry and for a limited period afterward for our own records (for example, in case you follow up about the same trip), after which they are routinely deleted. Standard technical/analytics logs generated by Google and Meta's tools are retained according to those providers' own retention schedules, not ours.</p>

  <h2 id="s7">7. Children's privacy</h2>
  <p>The Site is not directed to children, and vehicle rentals on Turo require renters to meet Turo's minimum age and licensing requirements. We do not knowingly collect personal information from children. If you believe a child has provided us information through the contact form, please <a href="/contact/">contact us</a> and we will delete it.</p>

  <h2 id="s8">8. Your choices &amp; rights</h2>
  <p>Depending on where you live, you may have rights to access, correct, delete, or receive a copy of personal information we hold about you, and to opt out of certain sharing for advertising purposes (sometimes described under state privacy laws as a "sale" or "share" of information even though no money changes hands). To exercise any of these rights, <a href="/contact/">contact us</a> and we will respond within a reasonable time. We will not discriminate against you for making a request. You can also:</p>
  <ul>
    <li>Control cookies through your browser's privacy settings;</li>
    <li>Adjust how Meta uses your data for ads in <a href="https://www.facebook.com/adpreferences/" rel="noopener" target="_blank">Meta Ad Preferences</a>;</li>
    <li>Opt out of personalized Google ads at <a href="https://adssettings.google.com/" rel="noopener" target="_blank">Google Ads Settings</a>; and</li>
    <li>Manage or delete your own Turo account data directly through Turo, since we do not control or store that information.</li>
  </ul>

  <h2 id="s9">9. Security</h2>
  <p>We use reasonable technical and organizational measures (such as encrypted transport (HTTPS), a contact-form honeypot and rate-limiting to deter spam/abuse) to help protect information submitted through the Site. No method of transmission or storage is 100% secure, and we cannot guarantee absolute security.</p>

  <h2 id="s10">10. Changes to this policy</h2>
  <p>We may update this Privacy Policy from time to time to reflect changes to the Site or applicable law. The "Last updated" date at the top of this page shows when it was last revised. Material changes will be posted here; continued use of the Site after an update means you accept the revised Policy.</p>

  <h2 id="s11">11. Contact us</h2>
  <p>Questions about this Privacy Policy, or want to exercise one of the rights above? <a href="/contact/">Contact us</a> and we'll get back to you.</p>
</div></section>`;
  return layout({
    path: '/privacy/', title: 'Privacy Policy | Boise Luxury Rentals',
    description: 'How Boise Luxury Rentals collects, uses and protects information on boiseluxuryrentals.com. We do not sell your data. Bookings and payments are handled by Turo.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

function termsPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Terms & Conditions', href: '/terms/' }];
  const toc = [
    'Acceptance of these terms', 'About this website', 'All bookings happen on Turo', 'Eligibility',
    'Accuracy of information &amp; availability', 'Acceptable use of the Site', 'Intellectual property',
    'Third-party links &amp; services', 'Disclaimers', 'Limitation of liability', 'Indemnification',
    'Governing law &amp; disputes', 'Changes to these terms', 'General', 'Contact us',
  ];
  const body = pageHead(crumbs, 'Terms &amp; Conditions', `Last updated: ${LEGAL_UPDATED}`) + `
<section><div class="wrap prose">
  ${legalToc(toc)}

  <p>These Terms &amp; Conditions ("Terms") govern your use of ${esc(SITE.domain)} (the "Site"), operated by ${esc(SITE.short)} ("${esc(SITE.short)}," "we," "us" or "our"). By browsing or using the Site, you agree to these Terms. If you do not agree, please do not use the Site.</p>

  <h2 id="s1">1. Acceptance of these terms</h2>
  <p>By accessing or using the Site in any way &mdash; browsing pages, viewing photos, using the contact form, or clicking through to Turo &mdash; you agree to be bound by these Terms and by our <a href="/privacy/">Privacy Policy</a>, which is incorporated here by reference. We may update these Terms as described in Section 13; continuing to use the Site after an update means you accept the revised Terms.</p>

  <h2 id="s2">2. About this website</h2>
  <p>${esc(SITE.short)} is an independent host on Turo, the peer-to-peer car-sharing marketplace. This Site is a marketing showcase for our vehicle(s) and the surrounding Boise, Idaho/Treasure Valley area. <strong>${esc(SITE.short)} is not owned by, affiliated with, sponsored by, or endorsed by Turo, Inc., Chevrolet, General Motors, or any vehicle manufacturer mentioned on the Site.</strong> Any manufacturer names, model names and trademarks (for example, "Corvette," "Stingray" and "Z51") are the property of their respective owners and are used only to describe the vehicle(s) we host, under nominative fair use.</p>
  <p>This Site does not process reservations, payments, identity verification, insurance or protection-plan selection, or any other part of a rental transaction. It exists to inform you about the vehicle(s) we host and to direct you to our live Turo listing(s), where every actual booking takes place.</p>

  <h2 id="s3">3. All bookings happen on Turo</h2>
  <p>Every reservation, payment, security deposit, insurance/protection plan, cancellation, mileage allowance, pickup/delivery arrangement, trip extension and trip-related dispute is handled entirely by Turo and is governed by <a href="https://turo.com/us/en/terms" rel="noopener" target="_blank">Turo's Terms of Service</a> and the specific listing details shown on Turo at the time you book. This Site has no ability to take a reservation, accept payment, or guarantee availability. When you click "Book on Turo" (or any similar button or link), you will leave this Site and transact directly with Turo, subject solely to Turo's own terms. We are not a party to, and have no liability arising from, the rental agreement formed between you and us (as host) through Turo's platform, except as set out in that Turo-governed agreement itself.</p>

  <h2 id="s4">4. Eligibility</h2>
  <p>This Site itself has no age restriction to browse, since no transaction occurs here. To actually rent a vehicle, you must meet Turo's own eligibility requirements (minimum age, valid driver's license, identity verification and any other conditions Turo or we, as host, set on the listing), all of which are presented and verified by Turo during booking, not by this Site.</p>

  <h2 id="s5">5. Accuracy of information &amp; availability</h2>
  <p>We try to keep vehicle descriptions, specifications, photos, drive-time estimates and general content on this Site accurate and up to date, but they are provided for general informational purposes only and may not reflect real-time availability, current pricing, mileage limits, or the exact condition/options of the vehicle on a given date. <strong>The Turo listing is always the authoritative source</strong> for current pricing, availability, mileage allowances, protection-plan options and trip terms. Photos may show the vehicle at a particular time and may not reflect its exact current condition, trim accessories or minor cosmetic changes.</p>

  <h2 id="s6">6. Acceptable use of the Site</h2>
  <p>You agree not to:</p>
  <ul>
    <li>Use the Site for any unlawful purpose, or in a way that could damage, disable, overburden or impair it;</li>
    <li>Attempt to gain unauthorized access to any part of the Site, its servers, or any connected systems;</li>
    <li>Use automated means (bots, scrapers, crawlers) to extract content, pricing or photos from the Site without our prior written consent;</li>
    <li>Submit false, misleading or fraudulent information through the contact form, or use it to send spam, unsolicited commercial messages, or abusive content; or</li>
    <li>Copy, reproduce, republish or create derivative works from the Site's text, photography or design for commercial purposes without our prior written permission.</li>
  </ul>

  <h2 id="s7">7. Intellectual property</h2>
  <p>The Site's text, layout, design, original photography and the ${esc(SITE.short)} name and logo are owned by ${esc(SITE.short)} or used with permission, and are protected by applicable copyright and trademark laws. You may view and share links to the Site for personal, non-commercial purposes. All other use &mdash; including copying, reproducing or reusing our photos or written content elsewhere &mdash; requires our prior written consent. "Turo" and the Turo logo are trademarks of Turo Inc.; vehicle manufacturer names and marks belong to their respective owners. Nothing on this Site grants you any license to those third-party marks.</p>

  <h2 id="s8">8. Third-party links &amp; services</h2>
  <p>The Site links to third-party platforms, including Turo, Google (Maps/Search/Tag Manager/Ads), Meta (Facebook/Instagram), and our Google Business Profile. We don't control these third parties and aren't responsible for their content, policies, availability or practices. Visiting a linked site is at your own risk and subject to that site's own terms and privacy policy.</p>

  <h2 id="s9">9. Disclaimers</h2>
  <p>THE SITE AND ITS CONTENT ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT. We do not warrant that the Site will be uninterrupted, timely, secure, or error-free, that defects will be corrected, or that the Site or the servers that make it available are free of viruses or other harmful components. Drive times, mileage, and distances shown on the Site are approximate, measured from Meridian, Idaho under normal traffic conditions, and are provided for general trip planning only &mdash; always confirm current conditions, hours and closures before you go, and drive safely and obey all applicable traffic laws.</p>

  <h2 id="s10">10. Limitation of liability</h2>
  <p>TO THE FULLEST EXTENT PERMITTED BY LAW, ${esc(SITE.short.toUpperCase())} AND ITS OWNERS, EMPLOYEES AND AGENTS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, EXEMPLARY OR PUNITIVE DAMAGES, OR ANY LOSS OF PROFITS, REVENUE, DATA OR GOODWILL, ARISING OUT OF OR RELATED TO YOUR USE OF (OR INABILITY TO USE) THE SITE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. BECAUSE ALL RENTAL TRANSACTIONS OCCUR ON TURO UNDER TURO'S OWN TERMS, WE ARE NOT LIABLE FOR ANY DISPUTE, LOSS, DAMAGE, INJURY, OR OTHER CLAIM ARISING FROM A BOOKING, TRIP, OR RENTAL ITSELF &mdash; THOSE ARE GOVERNED SOLELY BY YOUR AGREEMENT WITH TURO. Some jurisdictions do not allow certain limitations of liability, so some of the above limitations may not apply to you.</p>

  <h2 id="s11">11. Indemnification</h2>
  <p>You agree to indemnify, defend and hold harmless ${esc(SITE.short)} and its owners, employees and agents from any claims, damages, losses, liabilities and expenses (including reasonable attorneys' fees) arising out of or related to your violation of these Terms, your misuse of the Site, or your violation of any law or the rights of a third party.</p>

  <h2 id="s12">12. Governing law &amp; disputes</h2>
  <p>These Terms are governed by the laws of the State of Idaho, without regard to its conflict-of-laws principles. You agree that any dispute arising from these Terms or the Site that cannot be resolved informally will be subject to the exclusive jurisdiction of the state and federal courts located in Idaho, and you consent to personal jurisdiction there. Before filing a formal claim, we encourage you to <a href="/contact/">contact us</a> so we can try to resolve the issue informally.</p>

  <h2 id="s13">13. Changes to these terms</h2>
  <p>We may revise these Terms at any time by posting an updated version on this page with a new "Last updated" date. Changes take effect as soon as they're posted. Your continued use of the Site after a change is posted constitutes acceptance of the updated Terms.</p>

  <h2 id="s14">14. General</h2>
  <p>If any provision of these Terms is found unenforceable, the remaining provisions remain in full effect. Our failure to enforce a provision is not a waiver of it. These Terms, together with our <a href="/privacy/">Privacy Policy</a>, make up the entire agreement between you and ${esc(SITE.short)} regarding the Site and supersede any prior agreements about the Site. These Terms do not alter the terms of any separate agreement you enter into directly with Turo.</p>

  <h2 id="s15">15. Contact us</h2>
  <p>Questions about these Terms? <a href="/contact/">Contact us</a> and we'll be glad to help.</p>
</div></section>`;
  return layout({
    path: '/terms/', title: 'Terms & Conditions | Boise Luxury Rentals',
    description: 'Terms for using boiseluxuryrentals.com. Boise Luxury Rentals is an independent Turo host; all bookings, payments and protection plans happen on Turo.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

function notFoundPage() {
  const body = pageHead([{ label: 'Home', href: '/' }], 'Page not found', "That page doesn't exist, but the road is still open.") + `
<section><div class="wrap"><div class="cta-row"><a class="btn btn-ghost" href="/">Back to home</a>${turoBtn('Book on Turo')}</div></div></section>`;
  return layout({ path: '/404.html', title: 'Page not found | Boise Luxury Rentals', description: 'Page not found.', body, noindex: true });
}

module.exports = { home, carsIndex, corvettePage, thingsPage, aboutPage, faqPage, contactPage, privacyPage, termsPage, notFoundPage, placeCard, fmtMin, steps };
