'use strict';
/**
 * The three pages that carry the most search value:
 *  - /corvette-rental-boise/      flagship presentation of the actual car (all rental details)
 *  - /cars/corvette-stingray/     vehicle profile / spec sheet
 *  - /c8-corvette-rental-boise/   performance-focused C8 page (different search intent)
 */
const { SITE, PHOTOS, LISTING, PLACES } = require('./data');
const L = require('./lib');
const { esc, turoBtn, layout, pageHead, hero, disclosure, faqHtml, faqSchema, breadcrumbSchema, carSchema, articleSchema, val, mapsDir, CTA_LABEL } = L;

const G = PHOTOS.gallery; // order + tags come from /photos.json
const photoImg = (p, extra = '') => `<img src="${p.src}" data-full="${p.src}" alt="${esc(p.alt)}" loading="lazy" decoding="async" onerror="this.style.display='none'"${extra}>`;
const img = (tag) => `<div class="ph ar">${photoImg(PHOTOS.pick(tag))}</div>`;
// First 9 photos form the big mosaic; everything else follows in a tidy grid. Both open in the lightbox.
const mosaic = () => {
  const rest = G.slice(9);
  // Keep the trailing grid to a full row (3-col desktop / 2-col tablet, so a multiple of 6)
  // so it never ends with a lone photo dangling next to empty grid cells.
  const restFull = rest.slice(0, Math.floor(rest.length / 6) * 6);
  return `<div class="mosaic">${G.slice(0, 9).map((p) => `<div class="ph">${photoImg(p)}</div>`).join('')}</div>` +
    (restFull.length > 0 ? `<h3 style="margin:34px 0 14px">More photos</h3><div class="photo-grid">${restFull.map((p) => `<div class="ph">${photoImg(p)}</div>`).join('')}</div>` : '');
};
const CAR = `${LISTING.year} ${LISTING.make} ${LISTING.model} ${LISTING.trim}`;

const feature = ({ id, tag, flip, eyebrow, h2, html }) => `
<section id="${id}"><div class="wrap"><div class="feature${flip ? ' flip' : ''}">
  ${img(tag)}
  <div><span class="eyebrow">${eyebrow}</span><h2>${h2}</h2>${html}</div>
</div></div></section>`;

const ctaBand = (h2, sub) => `
<section class="cta-band"><div class="wrap narrow">
  <h2>${h2}</h2>
  <p class="muted" style="max-width:640px;margin:0 auto 26px">${sub}</p>
  ${turoBtn(CTA_LABEL, { big: true })}
</div></section>`;

const FLAGSHIP_FAQS = [
  { q: 'How do I book the Corvette?', a: 'Every reservation is completed on Turo. Click "Check Availability & Book on Turo" to open the listing, choose your dates and check out there. This website does not take bookings or payments.' },
  { q: 'What Corvette will I be renting?', a: 'A 2023 Chevrolet Corvette Stingray 2LT, the mid-engine C8 generation, with a 6.2L V8, an 8-speed dual-clutch automatic and a removable roof panel.' },
  { q: 'Can I take the roof off?', a: 'Yes. The C8 Stingray coupe has a removable roof panel that lifts out by hand and stows in the rear trunk, so you can drive with open sky overhead. Stowing the panel uses up part of the rear cargo space.' },
  { q: 'Will luggage fit in the C8 Corvette?', a: 'Chevrolet lists about 12.6 cubic feet of combined front and rear cargo space. That is comfortable for a couple on a weekend trip if you pack soft duffel bags. Hard-shell suitcases and stowing the roof panel at the same time will be tight.' },
  { q: 'Is there airport pickup or delivery at Boise Airport (BOI)?', a: 'The Corvette is based in Meridian, about 14 miles and 20 minutes from Boise Airport. Any pickup or delivery options we offer are shown on the Turo listing and arranged through Turo trip messaging.' },
  { q: 'How many miles are included?', a: 'The daily mileage allowance and the price of extra miles are set on the Turo listing. Use the mileage planner on this page to estimate popular Idaho drives like McCall (about 220 miles round trip) before you book.' },
  { q: 'What do I need to rent the Corvette?', a: 'Turo verifies your driver\'s license and identity during booking, and a protection plan is chosen at checkout. Minimum age, deposit and any other rules are shown on the Turo listing, which is always the source of truth.' },
  { q: 'Is this the only place to rent a C8 Corvette in Boise?', a: 'We can only speak for our own car. Search results for Corvette rental in Boise often include other Turo hosts, so compare dates, mileage and protection options on Turo and choose what fits your trip.' },
];

/* --------------------------------------------------------------------------
   FLAGSHIP: /corvette-rental-boise/
-------------------------------------------------------------------------- */
function flagship() {
  const path = '/corvette-rental-boise/';
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Corvette Rental Boise', href: path }];
  const routes = PLACES.filter((p) => ['Bogus Basin Road', 'Idaho City (Ponderosa Pine Scenic Byway)', 'McCall & Payette Lake', 'Sun Valley & Ketchum'].includes(p.name));

  const body = hero(
    'Corvette Rental in <span>Boise, Idaho</span>',
    'The mid-engine <strong>C8 Corvette</strong> you have been looking at, with a removable roof, a 6.2L V8 and Treasure Valley roads to match. Sports car rental in Boise, booked securely on Turo.',
    { xl: true, big: true, year: `${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim}`, eyebrow: 'Corvette Rental Boise · C8 Rental',
      badge: 'Reservations, payment and protection plans are handled securely by <strong>Turo</strong>',
      secondaryLabel: 'See every detail', secondaryHref: '#overview',
      alt: `${CAR} C8 Corvette rental in Boise, Idaho`,
      stats: [['490+', 'Horsepower'], ['6.2L', 'V8 engine'], ['~3.0s', '0-60 mph'], ['Open-air', 'Removable roof'], ['2', 'Seats'], ['HUD', 'Heads up display']] }
  ) + `
<section id="overview" style="padding-bottom:20px"><div class="wrap">
  <ul class="toc" aria-label="On this page">
    <li><a href="#power">Horsepower &amp; performance</a></li><li><a href="#interior">Interior</a></li><li><a href="#roof">Removable roof</a></li>
    <li><a href="#luggage">Luggage</a></li><li><a href="#availability">Available dates</a></li><li><a href="#pickup">Pickup &amp; delivery</a></li>
    <li><a href="#airport">Boise Airport</a></li><li><a href="#requirements">Renter requirements</a></li><li><a href="#mileage">Mileage</a></li><li><a href="#how-turo-works">How Turo booking works</a></li>
  </ul>
  <div class="grid g2" style="gap:44px;align-items:center">
    <div>
      <span class="eyebrow">Meet the car</span>
      <h2>Corvette Stingray rental in Boise, ready when you are</h2>
      <p>If you searched for a <strong>Corvette rental in Boise</strong>, this is the car: a ${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim}, the eighth-generation <strong>C8 Corvette</strong> with its engine behind the driver. It looks like a supercar, drives like one, and it is available as a <strong>sports car rental in Boise</strong> from a local owner who takes care of it. For anyone comparing a <strong>C8 rental Boise</strong> has to offer, this is the one.</p>
      <p>It is listed in Meridian, minutes from Boise, and reserved entirely on Turo, so you get live availability, transparent pricing and Turo's checkout and protection plans. Take it to dinner downtown, up to Bogus Basin, or on a full <strong>Corvette rental Idaho</strong> road trip to McCall or Sun Valley.</p>
      <div class="cta-row">${turoBtn(CTA_LABEL, { big: true })}</div>
    </div>
    <div class="card" style="padding:6px 10px">
      <table class="facts">
        <tr><th>Vehicle</th><td>${CAR} (C8)</td></tr>
        ${LISTING.color ? `<tr><th>Color</th><td>${esc(LISTING.color)}</td></tr>` : ''}
        <tr><th>Engine</th><td>6.2L LT2 V8</td></tr>
        <tr><th>Transmission</th><td>8-speed dual-clutch automatic</td></tr>
        <tr><th>Roof</th><td>${esc(LISTING.roof)}</td></tr>
        <tr><th>Seats</th><td>2</td></tr>
        <tr><th>Location</th><td>Meridian, Idaho (Boise area)</td></tr>
        <tr><th>Price</th><td>${val(LISTING.pricePerDay ? LISTING.pricePerDay + ' per day' : '', 'Live pricing on Turo')}</td></tr>
        <tr><th>Booking</th><td><strong>On Turo only</strong></td></tr>
      </table>
    </div>
  </div>
</div></section>

<section style="padding-top:20px"><div class="wrap">
  <span class="eyebrow">Photos</span>
  <h2>The C8 Corvette Stingray up close</h2>
  ${mosaic()}
</div></section>

${feature({ id: 'power', tag: 'side', eyebrow: 'Horsepower &amp; performance', h2: 'A 6.2L V8 behind you, about 3 seconds to 60',
  html: `<p>The heart of any <strong>C8 Corvette rental</strong> is the LT2 6.2-liter V8. Chevrolet rates the 2023 Stingray at 490 horsepower, or 495 with the performance exhaust, and roughly 465 to 470 lb-ft of torque. With the engine mid-mounted and power going to the rear wheels through an 8-speed dual-clutch, Chevrolet quotes roughly <strong>3 seconds from 0 to 60 mph</strong>.</p>
  <div class="big-num"><div><b>490+</b><span>Horsepower</span></div><div><b>~3.0s</b><span>0-60 mph</span></div><div><b>8-spd</b><span>Dual-clutch</span></div></div>
  <ul><li>Mid-engine layout for balance and grip through corners</li><li>Drive modes from relaxed Tour to sharper Sport</li><li>Easy to drive in town: it is an automatic, not a manual</li></ul>
  <p class="muted">Want the engineering detail? See our <a href="/c8-corvette-rental-boise/">C8 Corvette rental page</a>.</p>` })}

${feature({ id: 'interior', tag: 'interior', flip: true, eyebrow: 'Interior', h2: 'A cockpit built around the driver',
  html: `<p>Inside the ${LISTING.year} Stingray ${LISTING.trim}, everything angles toward the driver: a configurable digital instrument display, an infotainment touchscreen with Apple CarPlay and Android Auto, and a low, wraparound seating position.</p>
  <ul><li>Two supportive sport seats</li><li>Digital driver display and touchscreen infotainment</li><li>2LT trim highlights Chevrolet lists include premium Bose audio, heated and ventilated seats and a head-up display</li><li>Dual-zone climate control for Idaho's hot summers and cool mountain mornings</li></ul>
  <p class="muted">Exact options vary by car, so the Turo listing shows the equipment for this one.</p>` })}

${feature({ id: 'roof', tag: 'roof', eyebrow: 'Removable roof', h2: 'Take the roof off and drive open-air',
  html: `<p>This Corvette has a <strong>removable roof panel</strong>. On a clear day in the Treasure Valley, lift it off by hand, stow it in the rear trunk and drive with the sky overhead: down Bogus Basin Road, along the Payette River, or across the Camas Prairie toward Sun Valley.</p>
  <ul><li>Panel comes off in a couple of minutes and stows in the rear trunk</li><li>Stowing the panel uses part of the rear cargo space (see luggage below)</li><li>Keep the panel in the car whenever the roof is off, and put it back on before rain</li></ul>` })}

${feature({ id: 'luggage', tag: 'trunk-rear', flip: true, eyebrow: 'Luggage capacity', h2: 'Room for a weekend trip for two',
  html: `<p>The C8 is a two-seater with <strong>two trunks</strong>, a front trunk and a rear trunk. Chevrolet lists about <strong>12.6 cubic feet</strong> of combined cargo space, plenty for a couple's weekend when you pack soft duffel bags.</p>
  <div class="big-num"><div><b>2</b><span>Trunks</span></div><div><b>12.6</b><span>cu ft combined</span></div><div><b>2</b><span>Seats</span></div></div>
  <ul><li>Soft bags fit far better than hard-shell suitcases</li><li>Stowing the roof panel takes space from the rear trunk</li><li>Traveling for several days or with more than two people? Plan on packing light or ask us first</li></ul>` })}

<section id="availability" class="alt"><div class="wrap narrow">
  <span class="eyebrow">Available dates</span>
  <h2>Check Corvette rental availability in Boise</h2>
  <p>Availability and pricing change daily, and the live calendar is on Turo, so that is the fastest way to see if your dates are open. Pick your trip dates on the listing and you will see the exact total before you commit to anything.</p>
  <ul>
    <li><strong>Book early</strong> for summer weekends, holiday weekends and big Boise events.</li>
    <li><strong>Flexible?</strong> Weekday trips often have the most open dates.</li>
    <li>${LISTING.availabilityNote ? esc(LISTING.availabilityNote) : 'Dates not showing? Send us a message and we will help you find something that works.'}</li>
  </ul>
  <p>${turoBtn(CTA_LABEL, { big: true })}</p>
</div></section>

<section id="pickup"><div class="wrap">
  <div class="grid g2" style="gap:44px">
    <div>
      <span class="eyebrow">Pickup &amp; delivery</span>
      <h2>Boise location and how the hand-off works</h2>
      <p>The Corvette is based in <strong>Meridian, Idaho</strong>, right next to Boise, at the center of the Treasure Valley. That puts downtown Boise, the airport, Eagle and the foothills all within roughly 20 to 30 minutes.</p>
      <table class="facts">
        <tr><th>Pickup location</th><td>${val(LISTING.pickupSpot, 'Meridian, ID. Exact details shared through Turo after booking')}</td></tr>
        <tr><th>Delivery</th><td>${val(LISTING.delivery, 'Any delivery options are shown on the Turo listing')}</td></tr>
        <tr><th>Coordination</th><td>Turo trip messaging</td></tr>
      </table>
    </div>
    <div class="card">
      <h3>Drive times from the Corvette (Meridian)</h3>
      <table class="facts">
        <tr><th>Downtown Boise</th><td>~12 mi · 20 min</td></tr>
        <tr><th>Boise Airport (BOI)</th><td>~14 mi · 20 min</td></tr>
        <tr><th>Eagle</th><td>~8 mi · 15 min</td></tr>
        <tr><th>Nampa</th><td>~18 mi · 25 min</td></tr>
        <tr><th>Caldwell</th><td>~25 mi · 30 min</td></tr>
        <tr><th>Boise Foothills / Table Rock</th><td>~17 mi · 28 min</td></tr>
      </table>
      <p class="muted" style="margin:10px 0 0;font-size:.85rem">Approximate, normal traffic.</p>
    </div>
  </div>
</div></section>

<section id="airport" class="alt"><div class="wrap">
  <div class="grid g2" style="gap:44px;align-items:center">
    <div>
      <span class="eyebrow">Boise Airport information</span>
      <h2>Boise Airport (BOI) Corvette rental</h2>
      <p>Flying in? Boise Airport is about <strong>14 miles and 20 minutes</strong> from the Corvette in Meridian, and about 10 minutes from downtown Boise. There is no rental counter with us: you book on Turo, then we coordinate your hand-off through Turo's trip messaging, including around your flight times.</p>
      <ul><li>Share your flight number and landing time in Turo messages</li><li>Any airport pickup or delivery option is shown on the Turo listing</li><li>Departing? Build in a buffer between your Corvette return and your flight</li></ul>
      <p><a href="/boise-airport-car-rental/">Boise airport sports car rental details</a> &middot; <a href="/guides/boise-airport-sports-car-rental/">Airport planning guide</a></p>
    </div>
    <div class="card"><h3>Arriving by air? Quick plan</h3>
      <ol><li>Check dates on Turo and book</li><li>Message us your arrival time</li><li>Rideshare or taxi from BOI to the hand-off point (or use delivery if the listing offers it)</li><li>Inspect, photograph, and go</li></ol>
    </div>
  </div>
</div></section>

<section id="idaho"><div class="wrap">
  <span class="eyebrow">Corvette rental Idaho</span>
  <h2>Where to take a Corvette rental in Idaho</h2>
  <p class="muted" style="max-width:720px">Boise is the gateway to some of the best driving in the Northwest. These are our favorite drives, with distances from Meridian. See all of them on our <a href="/things-to-do-boise-by-car/">things to see by car</a> page.</p>
  <div class="grid g2">
    ${routes.map((p) => `<article class="card place"><h3>${esc(p.name)}</h3><div class="meta"><span class="pill drive">${p.mi} mi · ~${p.min >= 60 ? Math.floor(p.min / 60) + ' hr ' + (p.min % 60 ? (p.min % 60) + ' min' : '') : p.min + ' min'}</span></div><p class="muted" style="margin:0">${esc(p.blurb)}</p><div class="dir">${p.href ? `<a href="${p.href}">Route guide &rarr;</a> &nbsp;·&nbsp; ` : ''}<a class="dir" href="${mapsDir(p.q)}" target="_blank" rel="noopener">Live directions</a></div></article>`).join('')}
  </div>
</div></section>

<section id="requirements" class="alt"><div class="wrap">
  <div class="grid g2" style="gap:44px">
    <div>
      <span class="eyebrow">Renter requirements</span>
      <h2>What you need to rent the Corvette</h2>
      <p>Turo runs eligibility and checkout, so its rules apply to every trip, and the listing may add its own. Always confirm on the Turo listing before you book.</p>
      <div class="card" style="padding:6px 10px"><table class="facts">
        <tr><th>Driver's license</th><td>Valid license, verified by Turo at booking</td></tr>
        <tr><th>Minimum age</th><td>${val(LISTING.minAge, 'Set by Turo and shown on the listing')}</td></tr>
        <tr><th>ID verification</th><td>Completed on Turo</td></tr>
        <tr><th>Protection plan</th><td>Chosen at Turo checkout</td></tr>
        <tr><th>Security deposit</th><td>${val(LISTING.deposit, 'Shown on the Turo listing, if applicable')}</td></tr>
        <tr><th>Payment</th><td>Through Turo. We never take payment on this site.</td></tr>
      </table></div>
    </div>
    <div id="mileage">
      <span class="eyebrow">Mileage information</span>
      <h2>Will your miles cover the drive?</h2>
      <div class="card" style="padding:6px 10px;margin-bottom:18px"><table class="facts">
        <tr><th>Daily mileage</th><td>${val(LISTING.dailyMiles, 'Shown on the Turo listing')}</td></tr>
        <tr><th>Extra miles</th><td>${val(LISTING.extraMileCost, 'Set on the listing; you can often add miles when booking')}</td></tr>
      </table></div>
      <div class="table-scroll card" style="padding:6px 10px"><table class="dist" style="min-width:0">
        <thead><tr><th>Drive (round trip from Meridian)</th><th>Miles</th></tr></thead>
        <tbody>
          <tr><td>Downtown Boise + Table Rock</td><td class="num">~50</td></tr>
          <tr><td>Bogus Basin Road</td><td class="num">~60</td></tr>
          <tr><td>Idaho City via ID-21</td><td class="num">~105</td></tr>
          <tr><td><a href="/guides/boise-to-mccall-road-trip/">McCall via Highway 55</a></td><td class="num">~220</td></tr>
          <tr><td><a href="/guides/boise-to-sun-valley-road-trip/">Sun Valley</a></td><td class="num">~300</td></tr>
        </tbody>
      </table></div>
    </div>
  </div>
</div></section>

<section id="how-turo-works"><div class="wrap">
  <span class="eyebrow">Turo booking explanation</span>
  <h2>How booking works: it all happens on Turo</h2>
  <p class="muted" style="max-width:760px">${esc(SITE.short)} is an independent local host. This website is our showcase; <strong>every reservation happens on Turo</strong>, the world's largest car-sharing marketplace.</p>
  <div class="grid g4">
    <div class="card"><div class="step-num">1</div><h3>Click to Turo</h3><p class="muted">Use any "Check availability &amp; book on Turo" button to open the Corvette listing.</p></div>
    <div class="card"><div class="step-num">2</div><h3>Choose your dates</h3><p class="muted">See live availability, your exact price and the mileage allowance.</p></div>
    <div class="card"><div class="step-num">3</div><h3>Check out on Turo</h3><p class="muted">Turo verifies your license, takes payment and gives you protection plan options.</p></div>
    <div class="card"><div class="step-num">4</div><h3>Message us &amp; drive</h3><p class="muted">We arrange pickup through Turo messaging. Then the Corvette is yours for the trip.</p></div>
  </div>
  <div class="grid g2" style="margin-top:26px">
    <div class="card"><h3>Handled by Turo</h3><ul class="muted"><li>Booking and payment</li><li>Driver verification</li><li>Insurance and protection plans</li><li>Cancellation policy and support</li></ul></div>
    <div class="card"><h3>Handled by us</h3><ul class="muted"><li>A clean, well-maintained Corvette</li><li>Pickup and return coordination</li><li>Local route and restaurant advice</li><li>Questions before you book (<a href="/contact/">contact us</a>)</li></ul></div>
  </div>
</div></section>

${ctaBand('Ready to drive a C8 Corvette in Boise?', 'Check your dates and lock in the trip on Turo. It takes a couple of minutes.')}

<section><div class="wrap narrow">
  <span class="eyebrow">FAQ</span>
  <h2>Corvette rental in Boise: common questions</h2>
  ${faqHtml(FLAGSHIP_FAQS)}
</div></section>

<section class="alt"><div class="wrap">
  <h2>Keep exploring</h2>
  <div class="grid g3">
    <a class="card link" href="/c8-corvette-rental-boise/"><h3>C8 Corvette rental: the performance story</h3><p class="muted" style="margin:0">Engineering, drive modes and how a C8 compares to other Corvettes.</p></a>
    <a class="card link" href="/things-to-do-boise-by-car/"><h3>Things to see by car</h3><p class="muted" style="margin:0">Drives, landmarks and restaurants with distances.</p></a>
    <a class="card link" href="/guides/best-sports-car-routes-boise/"><h3>Best sports car drives near Boise</h3><p class="muted" style="margin:0">Four great roads within two hours.</p></a>
  </div>
</div></section>`;

  return layout({
    path,
    title: 'Corvette Rental Boise | 2023 C8 Stingray 2LT on Turo',
    description: 'Corvette rental in Boise: a 2023 C8 Stingray 2LT with a removable roof. See photos, horsepower, luggage, airport info and mileage, then book on Turo.',
    body, preloadHero: true,
    schema: [breadcrumbSchema(crumbs), faqSchema(FLAGSHIP_FAQS), carSchema()],
  });
}

/* --------------------------------------------------------------------------
   VEHICLE PROFILE: /cars/corvette-stingray/
-------------------------------------------------------------------------- */
function vehiclePage() {
  const path = '/cars/corvette-stingray/';
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Cars', href: '/cars/' }, { label: 'Corvette Stingray', href: path }];
  const body = hero(
    `${LISTING.year} Corvette <span>Stingray ${LISTING.trim}</span>`,
    'Vehicle profile and spec sheet for our C8 Corvette Stingray rental in Boise, Idaho.',
    { short: true, big: true, eyebrow: 'Vehicle profile · Booked on Turo', badge: 'Book on <strong>Turo</strong>. No payments on this site',
      img: '/images/corvette-studio-rear.jpg', secondaryLabel: 'Full Corvette rental details', secondaryHref: '/corvette-rental-boise/', alt: `${CAR} Corvette Stingray studio photo, rear three-quarter view` }
  ) + `
<section><div class="wrap">
  <span class="eyebrow">Gallery</span><h2>Photos of the ${LISTING.year} Corvette Stingray</h2>
  ${mosaic()}
</div></section>

<section class="alt"><div class="wrap">
  <div class="grid g2" style="gap:44px">
    <div>
      <span class="eyebrow">Spec sheet</span><h2>${CAR}</h2>
      <div class="card" style="padding:6px 10px"><table class="facts">
        <tr><th>Model year</th><td>${LISTING.year}</td></tr>
        <tr><th>Trim</th><td>${LISTING.trim}</td></tr>
        ${LISTING.color ? `<tr><th>Color</th><td>${esc(LISTING.color)}</td></tr>` : ''}
        <tr><th>Engine</th><td>6.2L LT2 V8</td></tr>
        <tr><th>Power</th><td>490 hp (495 hp with performance exhaust)</td></tr>
        <tr><th>Torque</th><td>About 465-470 lb-ft</td></tr>
        <tr><th>Transmission</th><td>8-speed dual-clutch automatic</td></tr>
        <tr><th>Drivetrain</th><td>Mid-engine, rear-wheel drive</td></tr>
        <tr><th>0-60 mph</th><td>Roughly 3 seconds (Chevrolet quoted)</td></tr>
        <tr><th>Roof</th><td>${esc(LISTING.roof)}, stows in the rear trunk</td></tr>
        <tr><th>Seating</th><td>2</td></tr>
        <tr><th>Cargo</th><td>Front + rear trunk, about 12.6 cu ft combined</td></tr>
      </table></div>
    </div>
    <div>
      <span class="eyebrow">Rental details</span><h2>Rental terms at a glance</h2>
      <div class="card" style="padding:6px 10px"><table class="facts">
        <tr><th>Where to book</th><td><strong>Turo</strong></td></tr>
        <tr><th>Location</th><td>Meridian, Idaho (Boise area)</td></tr>
        <tr><th>Daily rate</th><td>${val(LISTING.pricePerDay, 'Live on Turo')}</td></tr>
        <tr><th>Mileage</th><td>${val(LISTING.dailyMiles, 'Shown on the Turo listing')}</td></tr>
        <tr><th>Minimum age</th><td>${val(LISTING.minAge, 'Shown on the Turo listing')}</td></tr>
        <tr><th>Delivery</th><td>${val(LISTING.delivery, 'See the Turo listing')}</td></tr>
        <tr><th>Boise Airport</th><td>~14 mi · 20 min from the car</td></tr>
      </table></div>
      <p style="margin-top:22px">${turoBtn(CTA_LABEL, { big: true })}</p>
      <p class="muted">Want the full story with route ideas, luggage, roof and airport info? Read our <a href="/corvette-rental-boise/">Corvette rental in Boise</a> page.</p>
    </div>
  </div>
</div></section>

<section><div class="wrap narrow">${disclosure('Review the Turo listing for driver requirements, protection plan choices, mileage allowance and the cancellation policy before you reserve.')}</div></section>`;
  return layout({
    path,
    title: '2023 Corvette Stingray 2LT Rental Boise | Specs & Photos',
    description: 'Specs, photos and rental details for our 2023 Chevrolet Corvette Stingray 2LT (C8) in Meridian near Boise, Idaho. Corvette Stingray rental in Boise, booked on Turo.',
    body, preloadHero: true, schema: [breadcrumbSchema(crumbs), carSchema()],
  });
}

/* --------------------------------------------------------------------------
   C8 LANDING: /c8-corvette-rental-boise/  (performance / engineering intent)
-------------------------------------------------------------------------- */
const C8_FAQS = [
  { q: 'How fast is a C8 Corvette Stingray?', a: 'Chevrolet quotes roughly 3 seconds from 0 to 60 mph for the 2023 Stingray, and independent tests put the quarter mile in the low 11-second range. Top speed is quoted near 190 mph, which of course belongs on a closed course and not an Idaho highway.' },
  { q: 'Is the C8 Corvette an automatic?', a: 'Yes. Every C8 Corvette uses an 8-speed dual-clutch automatic transmission with paddle shifters. It is smooth in traffic and very quick when you use the paddles or Sport mode.' },
  { q: 'What is the difference between a C8 Stingray, Z06 and E-Ray?', a: 'The Stingray is the base C8 with a 6.2L V8. The Z06 adds a 5.5L flat-plane-crank V8 with far more power, and the E-Ray adds hybrid all-wheel drive. We rent a 2023 Stingray 2LT, which is more than fast enough for Idaho roads.' },
  { q: 'Is a C8 rental hard to drive?', a: 'No. It is friendly around town, and visibility and low-speed manners are better than most supercar-style cars. It is very quick, so build up gradually and remember the nose sits low over steep driveways.' },
  { q: 'Can I take the roof off?', a: 'Yes. The C8 Stingray coupe has a removable roof panel that stows in the rear trunk.' },
  { q: 'Where can I rent a C8 in Boise?', a: 'You can rent our 2023 Corvette Stingray 2LT in Meridian near Boise through Turo. Click the button on this page to check availability and book.' },
];

function c8Page() {
  const path = '/c8-corvette-rental-boise/';
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'C8 Corvette Rental Boise', href: path }];
  const body = hero(
    'C8 Corvette Rental <span>in Boise</span>',
    'Mid-engine layout, a 6.2L V8 and a dual-clutch that snaps off shifts. If you searched for a <strong>C8 rental in Boise</strong> for the driving, this page is for you.',
    { short: true, big: true, eyebrow: 'C8 Corvette Rental Boise · Performance',
      badge: 'Available to book on <strong>Turo</strong>',
      img: '/images/corvette-studio-front-angle2.jpg', secondaryLabel: 'Corvette rental details & photos', secondaryHref: '/corvette-rental-boise/', alt: 'C8 Corvette Stingray studio photo, front angle',
      stats: [['490+', 'Horsepower'], ['~40/60', 'Weight split'], ['~3.0s', '0-60 mph'], ['8-spd', 'Dual-clutch'], ['Mid', 'Engine'], ['HUD', 'Heads up display']] }
  ) + `
<section><div class="wrap"><div class="notice" style="display:flex;flex-wrap:wrap;gap:20px;align-items:center;justify-content:space-between">
  <div><h3 style="margin:0 0 .2em">Looking for photos, roof, luggage, pickup and requirements?</h3><p style="margin:0">Everything about the actual car is on our main <a href="/corvette-rental-boise/"><strong>Corvette rental in Boise</strong></a> page. This page is about how the C8 drives.</p></div>
  ${turoBtn(CTA_LABEL, { big: true })}
</div></div></section>

<section><div class="wrap">
  <div class="grid g2 stretch" style="gap:44px;align-items:center">
    <div>
      <span class="eyebrow">Why the C8 is different</span>
      <h2>Everything changed when the engine moved</h2>
      <p>For 66 years the Corvette put its V8 up front. The <strong>C8 Corvette</strong>, introduced for 2020, moved it behind the driver. That one decision changes how the car turns, launches and brakes, and it is why a <strong>C8 rental Boise</strong> visitors book feels nothing like renting a typical muscle car.</p>
      <ul>
        <li><strong>Weight distribution:</strong> roughly 40 percent front and 60 percent rear, so the rear tires get serious traction off the line.</li>
        <li><strong>Sharper turn-in:</strong> with the mass near the center of the car, it rotates quickly and predictably.</li>
        <li><strong>Cabin forward:</strong> a driver-focused cockpit, a low nose and a long tail.</li>
      </ul>
    </div>
    ${img('engine')}
  </div>
</div></section>

<section class="alt"><div class="wrap">
  <span class="eyebrow">Performance numbers</span>
  <h2>${LISTING.year} Corvette Stingray by the numbers</h2>
  <div class="grid g3">
    <div class="card"><h3>Engine</h3><p class="muted">6.2L LT2 V8 with dry-sump lubrication. 490 hp, or 495 hp with the performance exhaust, and about 465 to 470 lb-ft of torque.</p></div>
    <div class="card"><h3>Transmission</h3><p class="muted">8-speed dual-clutch automatic with paddle shifters. Launch control is built in for closed-course use.</p></div>
    <div class="card"><h3>Acceleration</h3><p class="muted">Roughly 3 seconds to 60 mph as quoted by Chevrolet, and a quarter mile in the low 11s in independent tests.</p></div>
  </div>
  <p class="muted" style="margin-top:16px;font-size:.88rem">Figures are manufacturer or independent-test numbers for the 2023 Stingray, and vary with configuration. See the Turo listing for this car's exact equipment.</p>
</div></section>

<section><div class="wrap">
  <div class="grid g2 stretch" style="gap:44px;align-items:center">
    ${img('cockpit')}
    <div>
      <span class="eyebrow">Drive modes</span>
      <h2>One car, several personalities</h2>
      <p>The C8 changes character at the turn of a dial. Weather and Tour keep it calm and quiet for town and highway; Sport and Track sharpen throttle, steering and shifts for a twisty road or closed course.</p>
      <div class="table-scroll card" style="padding:6px 10px"><table class="dist" style="min-width:0">
        <thead><tr><th>Mode</th><th>Best for</th></tr></thead>
        <tbody>
          <tr><td><strong>Tour</strong></td><td>Daily driving, dinner downtown, highway cruising</td></tr>
          <tr><td><strong>Weather</strong></td><td>Wet or cool conditions, gentle throttle</td></tr>
          <tr><td><strong>Sport</strong></td><td>Mountain roads like Bogus Basin and ID-55</td></tr>
          <tr><td><strong>Track</strong></td><td>Closed-course use only</td></tr>
          <tr><td><strong>My Mode</strong></td><td>Your own mix of settings</td></tr>
        </tbody>
      </table></div>
    </div>
  </div>
</div></section>

<section class="alt"><div class="wrap">
  <span class="eyebrow">Comparing Corvettes</span>
  <h2>C8 Stingray vs. other Corvettes</h2>
  <div class="table-scroll card" style="padding:6px 10px"><table class="compare">
    <thead><tr><th></th><th>C7 Stingray (2014-19)</th><th>C8 Stingray (2020+)</th><th>C8 Z06</th><th>C8 E-Ray</th></tr></thead>
    <tbody>
      <tr><td><strong>Engine position</strong></td><td>Front</td><td>Mid</td><td>Mid</td><td>Mid</td></tr>
      <tr><td><strong>Engine</strong></td><td>6.2L V8</td><td>6.2L V8</td><td>5.5L flat-plane V8</td><td>6.2L V8 + electric motor</td></tr>
      <tr><td><strong>Transmission</strong></td><td>Manual or automatic</td><td>Dual-clutch automatic</td><td>Dual-clutch automatic</td><td>Dual-clutch automatic</td></tr>
      <tr><td><strong>Drive</strong></td><td>Rear-wheel</td><td>Rear-wheel</td><td>Rear-wheel</td><td>Hybrid all-wheel</td></tr>
      <tr><td><strong>Rent it in Boise</strong></td><td>-</td><td><strong>Yes, ours (2023 2LT)</strong></td><td>-</td><td>-</td></tr>
    </tbody>
  </table></div>
</div></section>

<section><div class="wrap">
  <span class="eyebrow">On Idaho roads</span>
  <h2>Where a C8 rental in Boise really shines</h2>
  <div class="grid g3">
    <a class="card link" href="/guides/best-sports-car-routes-boise/"><h3>Bogus Basin Road</h3><p class="muted" style="margin:0">A 16-mile climb of switchbacks where Sport mode and mid-engine balance make sense.</p></a>
    <a class="card link" href="/guides/boise-to-mccall-road-trip/"><h3>Highway 55 to McCall</h3><p class="muted" style="margin:0">River-canyon curves, then fast open valleys. Plenty of torque for safe passing.</p></a>
    <a class="card link" href="/guides/boise-to-sun-valley-road-trip/"><h3>Sun Valley run</h3><p class="muted" style="margin:0">Long, open Camas Prairie stretches where the C8's Tour mode is a comfortable cruiser.</p></a>
  </div>
  <p class="muted" style="margin-top:18px">Drive within the law and to the conditions. Speed belongs on a closed course. See all <a href="/guides/best-sports-car-routes-boise/">our favorite drives</a>.</p>
</div></section>

${ctaBand('Feel the mid-engine difference', 'Check availability for the 2023 Corvette Stingray 2LT and book securely on Turo.')}

<section><div class="wrap narrow">
  <span class="eyebrow">FAQ</span><h2>C8 Corvette rental: common questions</h2>
  ${faqHtml(C8_FAQS)}
  <p style="margin-top:22px">See <a href="/corvette-rental-boise/">everything about renting our Corvette in Boise</a> or <a href="/cars/corvette-stingray/">the full spec sheet</a>.</p>
</div></section>`;
  return layout({
    path,
    title: 'C8 Corvette Rental Boise | Mid-Engine 2023 Stingray on Turo',
    description: 'C8 Corvette rental in Boise: how the mid-engine 6.2L V8 Stingray drives, performance numbers, drive modes and how it compares to other Corvettes. Book on Turo.',
    body, preloadHero: true, schema: [breadcrumbSchema(crumbs), faqSchema(C8_FAQS)],
  });
}

module.exports = { flagship, vehiclePage, c8Page };
