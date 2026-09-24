'use strict';
const { SITE, PHOTOS, PLACES, GUIDES, FAQS } = require('./data');
const L = require('./lib');
const { esc, turoBtn, layout, pageHead, hero, gallery, disclosure, faqHtml, faqSchema, breadcrumbSchema, articleSchema, mapsDir } = L;

const relatedLinks = (items) =>
  `<div class="grid g3">${items.map(([href, t, d]) => `<a class="card link" href="${href}"><h3>${esc(t)}</h3><p class="muted" style="margin:0">${esc(d)}</p></a>`).join('')}</div>`;

const sharedRelated = relatedLinks([
  ['/cars/corvette-stingray/', 'Corvette Stingray details', 'Photos, quick facts and booking link.'],
  ['/things-to-do-boise-by-car/', 'Things to see by car', 'Drives, landmarks and restaurants with distances.'],
  ['/guides/', 'Road-trip guides', 'McCall, Sun Valley and the best local routes.'],
]);

/** Landing pages share a frame but each has its own content. */
function landing({ path, title, description, h1, lead, crumbLabel, sections, faqs, ogAlt }) {
  const crumbs = [{ label: 'Home', href: '/' }, { label: crumbLabel, href: path }];
  const body = hero(h1, lead, { short: true, alt: ogAlt }) + `
<section><div class="wrap prose">
${sections}
</div></section>
<section class="alt"><div class="wrap"><h2>Photos</h2>${gallery(PHOTOS.gallery, 4)}<div class="cta-row" style="margin-top:26px">${turoBtn('Book on Turo')}</div></div></section>
${faqs ? `<section><div class="wrap narrow"><h2>Common questions</h2>${faqHtml(faqs)}</div></section>` : ''}
<section class="${faqs ? 'alt' : ''}"><div class="wrap narrow">${disclosure()}</div></section>
<section><div class="wrap"><h2>Keep exploring</h2>${sharedRelated}</div></section>`;
  return layout({ path, title, description, body, schema: [breadcrumbSchema(crumbs)].concat(faqs ? [faqSchema(faqs)] : []) });
}

const pick = (i) => FAQS[i];

function sportsCarPage() {
  return landing({
    path: '/sports-car-rental-boise/',
    crumbLabel: 'Sports Car Rental Boise',
    title: 'Sports Car Rental in Boise, Idaho | Corvette on Turo',
    description: 'Sports car rental in Boise and the Treasure Valley. Rent a Corvette Stingray for a weekend, date night or road trip. Booked on Turo. Local routes and tips.',
    h1: 'Sports Car Rental in <span>Boise</span>',
    lead: 'Weekend getaways, anniversaries or just because. Choose a sports car for your next Idaho drive.',
    sections: `
<h2>Why rent a sports car in Boise?</h2>
<p>Boise is a smaller city with an outsized driving landscape: river canyons, high-desert plains, alpine passes and lake towns are all within a few hours. A sports car changes what those drives feel like, which is the whole point.</p>
<h2>Good reasons to rent one</h2>
<ul>
  <li><strong>Anniversaries and birthdays:</strong> dinner in Boise plus a drive with a view.</li>
  <li><strong>Trips with friends:</strong> a two-seat sports car is ideal for a couple or a pair of friends.</li>
  <li><strong>Milestones and celebrations:</strong> plan a day around a route from our <a href="/guides/">guides</a>.</li>
  <li><strong>Photos and content:</strong> golden hour on the foothills makes a great backdrop.</li>
  <li><strong>Try before you buy:</strong> curious about a mid-engine Corvette? A rental day is a good test drive.</li>
</ul>
<h2>What we offer now</h2>
<p>Right now our lineup is the <a href="/cars/corvette-stingray/">Chevrolet Corvette Stingray (C8)</a>. We're planning to add more luxury and sport vehicles over time. See the <a href="/cars/">cars page</a> for what's coming.</p>
<h2>Booking &amp; requirements</h2>
<p>All rentals are booked through Turo, which handles driver eligibility, protection plans and payment. Age, license, deposit and mileage rules are shown on the listing, so review them before you reserve.</p>
<h2>Tips for a great sports car day</h2>
<ul>
  <li>Start early in summer to avoid heat and traffic, or go late for golden hour.</li>
  <li>Fill the tank before mountain routes. Fuel is sparser between towns.</li>
  <li>Pack soft luggage for a two-seater.</li>
  <li>Look at our <a href="/things-to-do-boise-by-car/">things to see by car</a> for drive distances.</li>
</ul>`,
    faqs: [pick(0), pick(3), pick(6), pick(10)],
  });
}

function airportPage() {
  return landing({
    path: '/boise-airport-car-rental/',
    crumbLabel: 'Boise Airport Car Rental',
    title: 'Boise Airport Sports Car Rental | Corvette on Turo',
    description: 'Flying into Boise Airport (BOI)? Rent a Corvette Stingray from a local Turo host in Meridian, about 14 miles (20 minutes) from the airport. Booked on Turo.',
    h1: 'Boise Airport Car Rental, <span>Upgraded</span>',
    lead: 'Flying into BOI? Skip the economy sedan and add a Corvette to your Idaho trip. We are about 20 minutes from the airport.',
    sections: `
<h2>Traditional airport rentals vs. a Turo Corvette</h2>
<p>Traditional rental companies operate at Boise Airport (BOI). We're a different option: an independent local host who lists a Corvette Stingray on Turo. That means there's no rental counter. You book on Turo, then coordinate the hand-off with us through Turo trip messaging.</p>
<h2>Distance from the airport</h2>
<table class="facts">
  <tr><th>Boise Airport (BOI) to Meridian</th><td>about 14 miles, ~20 minutes via I-84</td></tr>
  <tr><th>Boise Airport to downtown Boise</th><td>about 4 miles, ~10 minutes</td></tr>
  <tr><th>Boise Airport to Eagle</th><td>about 20 miles, ~30 minutes</td></tr>
</table>
<p class="muted" style="margin-top:10px">Approximate drive times in normal traffic.</p>
<h2>Pickup and delivery</h2>
<p>The Corvette is based in Meridian. Any pickup, delivery or airport hand-off options we offer are shown on the Turo listing and arranged inside Turo. If you're planning around a flight, send us a message through Turo (or our <a href="/contact/">contact page</a> before booking), and we'll help you plan the timing.</p>
<h2>Plan your arrival</h2>
<ul>
  <li>Book on Turo with the dates that match your stay.</li>
  <li>Share your flight time in Turo trip messages so we can plan the hand-off.</li>
  <li>Arrange a rideshare or taxi from BOI to the pickup point if needed.</li>
  <li>Use our <a href="/guides/boise-airport-sports-car-rental/">Boise Airport sports car guide</a> for a full checklist.</li>
</ul>
<h2>Where to go first</h2>
<p>Downtown Boise (10 minutes from the airport) is a natural first stop. From there, head to <a href="/things-to-do-boise-by-car/">the best drives, landmarks and restaurants</a>.</p>`,
    faqs: [pick(4), pick(0), pick(2), pick(3)],
  });
}

function exoticPage() {
  return landing({
    path: '/exotic-rental-boise/',
    crumbLabel: 'Exotic Rental Boise',
    title: 'Exotic Car Rental Boise | Supercar-Style Corvette on Turo',
    description: 'Exotic car rental in Boise: rent a mid-engine Corvette Stingray with supercar looks and performance. More exotic and luxury vehicles are planned. Booked on Turo.',
    h1: 'Exotic Car Rental in <span>Boise</span>',
    lead: 'Mid-engine looks, V8 sound and head-turning presence, available in the Treasure Valley.',
    sections: `
<h2>Exotic cars in Boise</h2>
<p>Boise doesn't have a big exotic car rental scene, which is part of the appeal. When you arrive in one, people notice. Our current exotic-style option is the mid-engine <a href="/cars/corvette-stingray/">Chevrolet Corvette Stingray (C8)</a>.</p>
<h2>Is a Corvette an "exotic"?</h2>
<p>The C8 is Chevrolet's mass-produced sports car, but it uses the same mid-engine layout and dramatic styling as much more expensive exotics. Many drivers see it as the best value in supercar-style driving. If you want that look and feel without a five-figure daily rate, that's the appeal.</p>
<h2>What's coming</h2>
<p>We're working on expanding the fleet. Future additions we're planning include:</p>
<ul>
  <li>Audi R8</li>
  <li>Tesla Cybertruck</li>
  <li>Mercedes-AMG G63</li>
</ul>
<p class="muted">These vehicles are not available yet. The Corvette is the only vehicle currently available to book.</p>
<h2>Booking</h2>
<p>All reservations are handled on Turo, with live pricing and availability on the listing. See the <a href="/faq/">FAQ</a> for how it works.</p>`,
    faqs: [pick(0), pick(11), pick(3), pick(5)],
  });
}

// ---------------- Guides ----------------
function guideFrame({ slug, title, description, h1, lead, content, faqs }) {
  const path = `/guides/${slug}/`;
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Guides', href: '/guides/' }, { label: h1, href: path }];
  const others = GUIDES.filter((g) => g.slug !== slug).slice(0, 3).map((g) => [`/guides/${g.slug}/`, g.title, g.blurb]);
  const body = pageHead(crumbs, h1, lead) + `
<section><div class="wrap prose">${content}
<div style="margin:36px 0">${disclosure()}</div>
</div></section>
${faqs ? `<section class="alt"><div class="wrap narrow"><h2>Common questions</h2>${faqHtml(faqs)}</div></section>` : ''}
<section><div class="wrap"><h2>More guides</h2>${relatedLinks(others)}</div></section>`;
  return layout({ path, title, description, body, ogType: 'article', schema: [breadcrumbSchema(crumbs), articleSchema({ title, description, path })].concat(faqs ? [faqSchema(faqs)] : []) });
}

const stops = (list) => `<ol class="stop-list">${list.map(([name, dist, text]) => `<li><strong>${esc(name)}</strong><span class="d">${esc(dist)}</span>${esc(text)}</li>`).join('')}</ol>`;

function guidesIndex() {
  const crumbs = [{ label: 'Home', href: '/' }, { label: 'Guides', href: '/guides/' }];
  const body = pageHead(crumbs, 'Corvette Rental & Idaho Road-Trip Guides', 'Route ideas, planning checklists and local tips for driving a sports car around Boise and the Treasure Valley.') + `
<section><div class="wrap">
  <div class="grid g2">
    ${GUIDES.map((g) => `<a class="card link" href="/guides/${g.slug}/"><h3>${esc(g.title)}</h3><p class="muted" style="margin:0">${esc(g.blurb)}</p></a>`).join('')}
    <a class="card link" href="/things-to-do-boise-by-car/"><h3>Top Things to See in the Treasure Valley by Car</h3><p class="muted" style="margin:0">Landmarks, scenic drives and top restaurants, each with drive distance from Meridian.</p></a>
  </div>
  <div style="margin-top:36px">${disclosure()}</div>
</div></section>`;
  return layout({
    path: '/guides/',
    title: 'Boise Road-Trip & Corvette Rental Guides',
    description: 'Guides for driving a sports car around Boise: Corvette rental tips, best driving routes, Boise to McCall, Boise to Sun Valley and airport rentals.',
    body, schema: [breadcrumbSchema(crumbs)],
  });
}

function guideCorvette() {
  return guideFrame({
    slug: 'corvette-rental-boise-guide',
    title: 'Corvette Rental Boise Guide: What to Know Before You Book',
    description: 'Everything to know before renting a Corvette in Boise: how Turo booking works, what to expect from a C8, packing, driving tips and where to go.',
    h1: 'The Complete Corvette Rental Guide for Boise',
    lead: 'How renting works, what the C8 is like to drive, and how to plan a great day or weekend in the Treasure Valley.',
    content: `
<h2>1. How the rental works</h2>
<p>Our Corvette is listed on Turo, so the process is the same as any Turo trip: choose dates on the listing, complete checkout on Turo, select a protection plan and message us through the app to arrange pickup. <strong>We do not take payments or bookings on this website.</strong></p>
<h2>2. Before you book, check the listing</h2>
<ul>
  <li>Driver age and license requirements</li>
  <li>Daily mileage allowance and the cost of extra miles</li>
  <li>Security deposit (if any) and protection plan options</li>
  <li>Cancellation policy</li>
  <li>Pickup or delivery options</li>
</ul>
<h2>3. What the C8 Corvette is like</h2>
<p>The C8 is a mid-engine, rear-wheel-drive two-seater with a 6.2L V8 and an eight-speed dual-clutch automatic. It's smooth around town and very quick when you ask for it. Visibility is decent and the car is easy to place, but it is <em>low</em>, so drive slowly over steep driveways, dips and speed bumps.</p>
<h2>4. Packing</h2>
<p>There's a front trunk and a rear trunk, so pack soft duffels or backpacks instead of large hard-shell luggage. For a two-person weekend trip, this is usually plenty.</p>
<h2>5. Idaho driving conditions</h2>
<ul>
  <li><strong>Summer heat:</strong> Treasure Valley afternoons can reach the upper 90s or higher. Start early and use the A/C.</li>
  <li><strong>Wildlife:</strong> deer are common on mountain roads at dawn and dusk. Slow down.</li>
  <li><strong>Gravel:</strong> avoid unpaved roads. They're hard on a low sports car.</li>
  <li><strong>Fuel:</strong> top up before leaving the Valley for mountain routes.</li>
  <li><strong>Seasons:</strong> mountain passes can see snow well into spring and early fall. Check ITD's 511 road report before you go.</li>
</ul>
<h2>6. Three easy plans</h2>
<h3>The half-day</h3>
${stops([['Downtown Boise', '12 mi · ~20 min from Meridian', 'Coffee, photos by the Capitol, lunch on the Basque Block.'], ['Table Rock', '17 mi · ~28 min from Meridian', 'Views over the city from above.']])}
<h3>The full day</h3>
${stops([['Lucky Peak Reservoir', '25 mi · ~35 min from Meridian', 'Start along ID-21 for open sweepers.'], ['Idaho City', '52 mi · ~1 hr 10 min from Meridian', 'Lunch in a Gold Rush town.'], ['Return via Bogus Basin Road', '', 'Loop back through the foothills if time and daylight allow.']])}
<h3>The weekend</h3>
<p>Head north to McCall via Highway 55. Follow our <a href="/guides/boise-to-mccall-road-trip/">Boise to McCall guide</a>.</p>
<h2>7. Ready?</h2>
<p>Browse our <a href="/things-to-do-boise-by-car/">things to see by car</a> and pick your route.</p>`,
    faqs: [pick(0), pick(3), pick(7), pick(8)],
  });
}

function guideRoutes() {
  return guideFrame({
    slug: 'best-sports-car-routes-boise',
    title: 'Best Sports Car Drives Near Boise, Idaho | Scenic Routes',
    description: 'The best driving roads near Boise for a sports car: Bogus Basin Road, ID-21 to Idaho City, Highway 55 to McCall and the Sawtooth Scenic Byway.',
    h1: 'Best Sports Car Drives Near Boise',
    lead: 'Four great roads within about two hours of Meridian, plus tips for driving them well.',
    content: `
<p class="muted">Drive times are approximate from Meridian, Idaho in normal traffic. Always obey posted speed limits and drive to conditions.</p>
<h2>1. Bogus Basin Road</h2>
<p><strong>About 30 miles · ~50 minutes from Meridian.</strong> The closest real mountain road to Boise: 16 miles of climbing curves from the foothills to Bogus Basin Recreation Area. Expect cyclists, especially on weekends, and cooler weather at the top. Go early or near sunset.</p>
<h2>2. ID-21: Ponderosa Pine Scenic Byway to Idaho City</h2>
<p><strong>About 52 miles · ~1 hr 10 min from Meridian.</strong> From Boise, ID-21 follows the Boise River past Lucky Peak Reservoir and climbs into pine forest. Idaho City is a natural lunch stop with historic buildings and a Gold Rush past. Continue north toward Lowman if you want a longer day, but check seasonal conditions on higher stretches.</p>
<h2>3. ID-55: Payette River Scenic Byway to McCall</h2>
<p><strong>About 110 miles · ~2 hr from Meridian.</strong> A river canyon, then open mountain valleys, then a lake town. Full breakdown in our <a href="/guides/boise-to-mccall-road-trip/">Boise to McCall guide</a>. Passing is limited in the canyon, so be patient and enjoy the view.</p>
<h2>4. US-20 &amp; ID-75: Sawtooth Scenic Byway to Sun Valley</h2>
<p><strong>About 150 miles · ~2 hr 45 min from Meridian.</strong> Long, open highway across the Camas Prairie, then the Wood River Valley into Ketchum. See the <a href="/guides/boise-to-sun-valley-road-trip/">Boise to Sun Valley guide</a>.</p>
<h2>Sports car driving tips</h2>
<ul>
  <li>Keep to paved roads. Gravel and washboard are hard on a low car.</li>
  <li>Watch for deer, cyclists and slow trucks. Blind corners are common.</li>
  <li>Give the tires a few miles to warm up in cool mornings.</li>
  <li>Fuel up in towns, since stations can be sparse in the mountains.</li>
  <li>Check <a href="https://511.idaho.gov" target="_blank" rel="noopener">Idaho 511</a> for closures and construction.</li>
</ul>
<p>More stops and restaurants with drive distances are on the <a href="/things-to-do-boise-by-car/">things to see by car</a> page.</p>`,
    faqs: [pick(6), pick(0), pick(3)],
  });
}

function guideMcCall() {
  return guideFrame({
    slug: 'boise-to-mccall-road-trip',
    title: 'Boise to McCall Road Trip Guide | Highway 55 by Sports Car',
    description: 'Drive from Boise to McCall on Highway 55: about 110 miles, 2 hours, with stops at Horseshoe Bend, Banks, Cascade and Payette Lake. Route, stops and tips.',
    h1: 'Boise to McCall Road Trip',
    lead: 'The Payette River Scenic Byway: river canyon, mountain valleys and a lakeside town.',
    content: `
<table class="facts">
  <tr><th>Distance</th><td>About 110 miles from Meridian (about 106 from downtown Boise)</td></tr>
  <tr><th>Drive time</th><td>About 2 hours each way without stops</td></tr>
  <tr><th>Route</th><td>Meridian / Eagle &rarr; ID-55 north through Horseshoe Bend, Banks, Smiths Ferry, Cascade and Donnelly to McCall</td></tr>
  <tr><th>Best season</th><td>Late spring to early fall (check for snow/ice outside summer)</td></tr>
</table>
<h2>The route, stop by stop</h2>
${stops([
  ['Eagle', '8 mi · ~15 min from Meridian', 'Top up fuel and coffee. ID-55 begins here and heads north.'],
  ['Horseshoe Bend', '~30 mi · ~45 min', 'Where the road drops into the Payette River canyon. Great first stretch with sweeping curves.'],
  ['Banks & the Payette River', '~45 mi · ~1 hr', 'Popular rafting and kayaking put-in. The canyon section has limited passing, so relax and enjoy the river.'],
  ['Smiths Ferry & Cascade', '~85 mi · ~1 hr 40 min', 'The canyon opens into wide mountain valleys. Lake Cascade is a good stop for photos and a stretch.'],
  ['Donnelly (Tamarack Resort area)', '~100 mi · ~1 hr 55 min', 'Ski-resort country with restaurants and mountain views.'],
  ['McCall & Payette Lake', '~110 mi · ~2 hr', 'Lakeside downtown, Ponderosa State Park nearby and plenty of dining. Stay the night or return the same day.'],
])}
<p class="muted">Times are approximate cumulative drive times in normal traffic, without stops.</p>
<h2>Tips for driving this route</h2>
<ul>
  <li><strong>Start early.</strong> Summer weekend traffic between Boise and McCall builds through the morning, and the canyon has few passing zones.</li>
  <li><strong>Fuel:</strong> fill up in Eagle or Horseshoe Bend.</li>
  <li><strong>Wildlife &amp; cyclists:</strong> deer at dusk, plus cyclists on the shoulder.</li>
  <li><strong>Mileage:</strong> a round trip is about 220 miles, so check the mileage allowance on the Turo listing and add extra miles if needed.</li>
  <li><strong>Off-season:</strong> the road is generally open year-round, but snow and ice are possible outside summer. Check <a href="https://511.idaho.gov" target="_blank" rel="noopener">Idaho 511</a>.</li>
</ul>
<h2>Where to eat and what to do in McCall</h2>
<ul>
  <li>Walk downtown McCall and the lakefront on Payette Lake.</li>
  <li>Visit Ponderosa State Park for a peninsula drive and lake views.</li>
  <li>Grab lunch downtown, then return before dusk for wildlife safety.</li>
</ul>
<p>Explore other <a href="/things-to-do-boise-by-car/">day trips and drives</a> from the Treasure Valley.</p>`,
    faqs: [pick(6), pick(0), pick(7)],
  });
}

function guideSunValley() {
  return guideFrame({
    slug: 'boise-to-sun-valley-road-trip',
    title: 'Boise to Sun Valley Road Trip Guide | Sawtooth Scenic Byway',
    description: 'Drive from Boise to Sun Valley and Ketchum: about 150 miles and 2 hours 45 minutes via I-84, US-20 and Highway 75. Route, stops and tips for a sports car.',
    h1: 'Boise to Sun Valley Road Trip',
    lead: 'High desert, the Camas Prairie and the Wood River Valley, ending at one of America\'s classic mountain resorts.',
    content: `
<table class="facts">
  <tr><th>Distance</th><td>About 150 miles from Meridian</td></tr>
  <tr><th>Drive time</th><td>About 2 hours 45 minutes each way without stops</td></tr>
  <tr><th>Route</th><td>I-84 east to Mountain Home &rarr; US-20 east through Fairfield &rarr; ID-75 north (Sawtooth Scenic Byway) through Hailey and Ketchum</td></tr>
  <tr><th>Best season</th><td>Late spring to early fall</td></tr>
</table>
<h2>The route, stop by stop</h2>
${stops([
  ['Mountain Home', '~40 mi · ~40 min from Meridian', 'Last big fuel stop before the prairie. I-84 gives way to US-20 here.'],
  ['Camas Prairie & Fairfield', '~90 mi · ~1 hr 40 min', 'Wide, open ranch country and big sky. A good photo stop. Watch for livestock and speed limits in town.'],
  ['Timmerman Junction to Hailey', '~130 mi · ~2 hr 25 min', 'Turn north on ID-75 and enter the Wood River Valley, where the scenery changes quickly.'],
  ['Ketchum', '~150 mi · ~2 hr 45 min', 'Small mountain-town downtown with restaurants and shops. Sun Valley Resort is just up the road.'],
  ['Sun Valley', '~152 mi · ~2 hr 50 min', 'Historic resort and hiking trails. Ernest Hemingway lived and is memorialized nearby.'],
])}
<p class="muted">Cumulative approximate drive times in normal traffic, without stops.</p>
<h2>Tips</h2>
<ul>
  <li><strong>Mileage:</strong> this is a 300-plus mile round trip. Check the Turo mileage allowance and consider adding extra miles.</li>
  <li><strong>Overnight vs. day trip:</strong> the drive is doable in one day, but more enjoyable with an overnight in Ketchum.</li>
  <li><strong>Weather:</strong> mountain weather changes fast. Check <a href="https://511.idaho.gov" target="_blank" rel="noopener">Idaho 511</a> before you leave.</li>
  <li><strong>Wildlife:</strong> deer and elk are active at dawn and dusk.</li>
  <li><strong>Going farther:</strong> the Sawtooth Scenic Byway continues north from Ketchum toward Stanley for another scenic stretch (ask us about seasonal conditions).</li>
</ul>
<p>Prefer a shorter drive? Try the <a href="/guides/boise-to-mccall-road-trip/">McCall road trip</a>.</p>`,
    faqs: [pick(6), pick(0), pick(5)],
  });
}

function guideAirport() {
  return guideFrame({
    slug: 'boise-airport-sports-car-rental',
    title: 'Boise Airport (BOI) Sports Car Rental Guide',
    description: 'Planning a sports car rental around a Boise Airport (BOI) arrival? Distances, timing tips and a checklist for renting a Corvette from a local Turo host.',
    h1: 'Boise Airport (BOI) Sports Car Rental Guide',
    lead: 'How to add a Corvette to a Boise trip, from booking to hand-off to your first drive.',
    content: `
<h2>Distances from BOI</h2>
<table class="facts">
  <tr><th>To Meridian (car location)</th><td>about 14 miles · ~20 minutes via I-84</td></tr>
  <tr><th>To downtown Boise</th><td>about 4 miles · ~10 minutes</td></tr>
  <tr><th>To Eagle</th><td>about 20 miles · ~30 minutes</td></tr>
  <tr><th>To Boise Foothills / Table Rock</th><td>about 8 miles · ~15 minutes</td></tr>
</table>
<h2>Step-by-step</h2>
<ol>
  <li><strong>Check dates and pricing on Turo</strong> using your arrival and departure days.</li>
  <li><strong>Read the listing</strong> for pickup/delivery options, mileage and requirements.</li>
  <li><strong>Book on Turo.</strong> Payment and protection plan selection happen there.</li>
  <li><strong>Message us</strong> in the Turo app with your flight number and landing time.</li>
  <li><strong>Plan your ride</strong> from BOI to the hand-off point (rideshare, taxi or a friend), unless a delivery option is available.</li>
  <li><strong>Inspect and go.</strong> Photograph the car at pickup, as Turo's process recommends.</li>
</ol>
<h2>Timing tips</h2>
<ul>
  <li>Allow extra time after landing for baggage and ground transport, especially with a checked bag.</li>
  <li>Evening arrivals can be tricky, so plan for daylight hand-offs when possible for photos and inspection.</li>
  <li>Cross-check your return: allow a buffer before your flight so you're not rushing.</li>
</ul>
<h2>Your first day</h2>
<p>Downtown Boise is only about 10 minutes from the airport. Start with the <a href="/things-to-do-boise-by-car/">Capitol, Basque Block and Boise Depot</a>, then plan a scenic drive using our <a href="/guides/best-sports-car-routes-boise/">route guide</a>.</p>`,
    faqs: [pick(4), pick(0), pick(3)],
  });
}

module.exports = {
  sportsCarPage, airportPage, exoticPage,
  guidesIndex, guideCorvette, guideRoutes, guideMcCall, guideSunValley, guideAirport,
};
