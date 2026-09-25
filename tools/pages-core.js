'use strict';
const { SITE, PHOTOS, PLACES, RESTAURANTS, FAQS, CARS, GUIDES } = require('./data');
const L = require('./lib');
const { esc, turoBtn, layout, pageHead, hero, gallery, disclosure, faqHtml, faqSchema, breadcrumbSchema, mapsDir } = L;

function placeCard(p) {
  const link = p.href ? `<a href="${p.href}">Read the route guide &rarr;</a> &nbsp;·&nbsp; ` : '';
  return `<article class="card place">
  <h3>${esc(p.name)}</h3>
  <div class="meta"><span class="pill drive">${p.mi} mi · ~${fmtMin(p.min)}</span>${p.area ? `<span class="pill">${esc(p.area)}</span>` : ''}</div>
  <p class="muted" style="margin:0">${esc(p.blurb)}</p>
  <div class="dir">${link}<a class="dir" href="${mapsDir(p.q)}" target="_blank" rel="noopener">Live directions</a></div>
</article>`;
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
    'Corvette rental in Boise, Idaho: a 2023 mid-engine C8 Corvette Stingray 2LT with a removable roof. Check dates and book securely on Turo.',
    { xl: true, big: true, year: '2023 Chevrolet Corvette Stingray 2LT', eyebrow: 'Sports Car Rental Boise · Corvette Rental Idaho',
      img: '/images/corvette-studio-front.jpg', alt: '2023 Chevrolet Corvette Stingray 2LT studio photo, front three-quarter view',
      badge: 'All reservations are completed securely on <strong>Turo</strong>', secondaryLabel: 'See the Corvette', secondaryHref: '/corvette-rental-boise/',
      stats: [['490+', 'Horsepower'], ['6.2L', 'V8'], ['~3.0s', '0-60 mph'], ['Open-air', 'Removable roof'], ['HUD', 'Heads Up Display'], ['Turo', 'Book securely']] })}

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
        <h2>2023 Chevrolet Corvette Stingray 2LT (C8)</h2>
        <p>The C8 moved the V8 behind the driver and rewrote the Corvette playbook: a 6.2L V8, an eight-speed dual-clutch transmission, a two-seat cockpit and supercar looks at a fraction of the usual exotic price tag.</p>
        <ul class="muted"><li>Mid-engine layout with a front and rear trunk</li><li>Automatic dual-clutch: easy in traffic, thrilling on the open road</li><li>Based in Meridian, minutes from Boise</li></ul>
        <div class="cta-row">${turoBtn('CHECK AVAILABILITY & BOOK ON TURO', { big: true })}</div><p style="margin-top:14px"><a href="/corvette-rental-boise/">Corvette rental Boise: full details, photos &amp; requirements &rarr;</a></p>
      </div>
      <div class="ph feature-photo"><img src="${PHOTOS.gallery[0].src}" alt="${esc(PHOTOS.gallery[0].alt)}" loading="lazy" decoding="async" onerror="this.style.display='none'"></div>
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
      ${CARS.map((c) => `<div class="card car-card${c.status === 'soon' ? ' soon' : ''}">${c.photo ? `<div class="ph"><img src="${c.photo}" alt="${esc(c.name)}, coming soon" loading="lazy" onerror="this.style.display='none'"></div>` : ''}<div class="body"><span class="tag${c.status === 'live' ? ' live' : ''}">${esc(c.tag)}</span><h3 style="margin-top:12px">${esc(c.name)}</h3><p class="muted">${esc(c.blurb)}</p>${c.status === 'live' ? `<a href="/cars/${c.slug}/">View details &rarr;</a>` : ''}</div></div>`).join('')}
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
    <p>Whether you want a <a href="/corvette-rental-boise/">Corvette rental in Boise</a> for a special day or a full <strong>Corvette rental Idaho</strong> road trip, our 2023 Corvette Stingray 2LT is built for it. The <a href="/c8-corvette-rental-boise/">C8 Corvette rental</a> pairs a mid-engine layout with a 6.2L V8, and the removable roof makes every drive feel bigger.</p>
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
    schema: [faqSchema(FAQS.slice(0, 5))],
  });
}

function carsIndex() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Cars', href: '/cars/' }];
  const body = pageHead(crumbs, 'Our Cars', 'Luxury and sport rentals in the Boise area. Every vehicle is booked through Turo.') + `
<section><div class="wrap">
  <div class="grid g2">
    ${CARS.map((c, i) => `<div class="card car-card${c.status === 'soon' ? ' soon' : ''}">
      <div class="ph">${c.status === 'live' ? `<img src="${PHOTOS.gallery[0].src}" alt="${esc(c.name)} rental in Boise" loading="lazy" onerror="this.style.display='none'">` : (c.photo ? `<img src="${c.photo}" alt="${esc(c.name)}, coming soon to Boise Luxury Rentals" loading="lazy" onerror="this.style.display='none'">` : '')}</div>
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
        <p class="muted" style="font-size:.82rem;margin:0">By sending this you agree we may contact you about your inquiry. See our <a href="/privacy/">privacy note</a>.</p>
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

function privacyPage() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Privacy', href: '/privacy/' }];
  const body = pageHead(crumbs, 'Privacy Note') + `
<section><div class="wrap prose">
  <p>This site does not sell your information. If you use the contact form, the name, phone number, email, dates and message you enter are emailed to us so we can reply to your inquiry, and are not used for anything else.</p>
  <p>This site does not process bookings or payments. When you click <em>Book on Turo</em>, you leave this site and are subject to Turo's own terms and privacy policy.</p>
  <p>Questions about this note? <a href="/contact/">Contact us</a>.</p>
</div></section>`;
  return layout({
    path: '/privacy/', title: 'Privacy Note | Boise Luxury Rentals',
    description: 'How Boise Luxury Rentals handles contact-form information. Bookings and payments are handled by Turo.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

function notFoundPage() {
  const body = pageHead([{ label: 'Home', href: '/' }], 'Page not found', "That page doesn't exist, but the road is still open.") + `
<section><div class="wrap"><div class="cta-row"><a class="btn btn-ghost" href="/">Back to home</a>${turoBtn('Book on Turo')}</div></div></section>`;
  return layout({ path: '/404.html', title: 'Page not found | Boise Luxury Rentals', description: 'Page not found.', body, noindex: true });
}

module.exports = { home, carsIndex, corvettePage, thingsPage, aboutPage, faqPage, contactPage, privacyPage, notFoundPage, placeCard, fmtMin, steps };
