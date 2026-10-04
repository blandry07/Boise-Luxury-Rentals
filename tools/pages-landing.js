'use strict';
/**
 * Paid-social landing pages (/fb/, /ig/, /links/) for traffic from social
 * profiles. Stripped-down nav/footer (opts.landing in layout()), a single
 * CTA throughout (no secondary "browse" link), noindex (these are campaign
 * pages, not meant to compete with the real site in organic search), and the
 * same Meta Pixel + GTM tags the rest of the site carries (both fire from the
 * shared layout() head/body, so nothing extra is needed here for tracking).
 */
const { LISTING, PHOTOS, SITE } = require('./data');
const L = require('./lib');
const { esc, turoBtn, layout, hero, gallery, faqHtml, breadcrumbSchema, carSchema, CTA_LABEL } = L;

const MINI_FAQS = [
  { q: 'Is this a real rental, or a giveaway/contest?', a: 'A real rental you book yourself. There is no giveaway, contest or sweepstakes tied to this page or our social posts.' },
  { q: 'Where do I actually book?', a: 'On Turo. Tap any "Book on Turo" button here to open our live Turo listing, pick your dates and check out there. This page does not take payments.' },
  { q: 'Where is the car located?', a: 'Meridian, Idaho, about 15 minutes from downtown Boise and 20 minutes from Boise Airport (BOI).' },
];

const social = (h1, lead, eyebrow, source) => {
  const path = `/${source}/`;
  const crumbs = [{ label: 'Home', href: '/' }, { label: source === 'fb' ? 'Facebook' : 'Instagram', href: path }];
  const body = hero(
    h1,
    lead,
    { xl: true, big: true, singleCta: true, year: `${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim}`, eyebrow,
      badge: '5&#9733; rated on Turo &middot; all reservations are handled securely by <strong>Turo</strong>',
      alt: `${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim} C8 rental in Boise, Idaho`,
      stats: [['490+', 'Horsepower'], ['6.2L', 'V8'], ['~3.0s', '0-60 mph'], ['Open-air', 'Removable roof'], ['2', 'Seats'], ['5&#9733;', 'On Turo']] }
  ) + `
<section><div class="wrap narrow" style="text-align:center">
  <h2>Why people book this car</h2>
  <div class="grid g3" style="margin-top:28px;text-align:left">
    <div class="card"><h3>Mid-engine C8</h3><p class="muted">The Corvette that looks and drives like a supercar: 6.2L V8, dual-clutch automatic, about 3 seconds to 60.</p></div>
    <div class="card"><h3>Open-air roof</h3><p class="muted">The removable roof panel lifts out by hand, so Treasure Valley drives can be open-top whenever you want.</p></div>
    <div class="card"><h3>Easy, secure booking</h3><p class="muted">Every reservation, payment and protection plan runs through Turo &mdash; the same trusted checkout as any other Turo trip.</p></div>
  </div>
</div></section>

<section class="alt"><div class="wrap narrow">
  <h2 style="text-align:center">Quick questions</h2>
  ${faqHtml(MINI_FAQS)}
</div></section>

<section class="cta-band"><div class="wrap narrow">
  <h2>Ready to drive it?</h2>
  <p class="muted" style="max-width:640px;margin:0 auto 26px">Check your dates on Turo &mdash; it takes about two minutes.</p>
  ${turoBtn(CTA_LABEL, { big: true })}
</div></section>`;

  return layout({
    path,
    landing: true,
    noindex: true,
    title: `${LISTING.year} Corvette Stingray ${LISTING.trim} Rental Boise | Book on Turo`,
    description: `Rent our ${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim} (C8) in Boise/Meridian, Idaho. 5-star rated on Turo. Check dates and book securely.`,
    body,
    schema: [breadcrumbSchema(crumbs), carSchema()],
  });
};

const fbLanding = () => social(
  'The Corvette <span>everyone’s talking about</span>',
  'You saw it on Facebook &mdash; now check real dates and pricing. A 2023 mid-engine C8 Corvette Stingray, booked securely on Turo.',
  'From our Facebook page',
  'fb'
);

const igLanding = () => social(
  'As seen <span>on Instagram</span>',
  'The car from our feed, ready to book. A 2023 mid-engine C8 Corvette Stingray, booked securely on Turo.',
  'From our Instagram',
  'ig'
);

/**
 * "Link in bio" page (/links/): a single link to use across every social
 * profile. Compact hero (same opts.compact used on the homepage), an
 * expandable offer-details accordion instead of a wall of spec text, every
 * vehicle photo (not just the homepage's teaser slice), Book-on-Turo +
 * Contact Us as the two calls to action throughout, and a trimmed footer
 * that keeps just Privacy/Terms (opts.minimalFooter) instead of the full
 * 4-column link grid or no footer at all.
 */
const OFFER_DETAILS = [
  { q: 'Specs at a glance', a: `${LISTING.year} ${LISTING.make} ${LISTING.model} ${LISTING.trim}: a 6.2L V8 making 490+ horsepower, 8-speed dual-clutch automatic, rear-wheel drive, about 3 seconds 0-60, a removable roof panel, 2 seats, and a front + rear trunk. ${esc(LISTING.color)}.` },
  { q: 'Pricing, mileage & deposit', a: 'Daily pricing changes with season and demand, so exact numbers show up live once you pick your dates on Turo. Mileage allowance, any extra-mile cost and the security deposit are set on the Turo listing and confirmed at checkout, never guessed here.' },
  { q: 'Pickup, delivery & driver requirements', a: `The car is based in ${esc(SITE.origin)}, about 20 minutes from Boise Airport (BOI). Minimum driver age, license requirements and any delivery options are set by Turo and shown on the listing before you book.` },
  { q: 'How booking actually works', a: 'Every reservation, payment and protection plan is handled by Turo, not on this page. Tap "Book on Turo" to open the live listing, pick your dates, and check out securely there.' },
];

const LINKS_FAQS = [
  { q: 'Is this a real rental, or a giveaway/contest?', a: 'A real rental you book yourself. There is no giveaway, contest or sweepstakes tied to this page or our social posts.' },
  { q: 'Where do I actually book?', a: 'On Turo. Tap any "Book on Turo" button here to open our live Turo listing, pick your dates and check out there. This page does not take payments.' },
  { q: 'What if I have a question before I book?', a: 'Tap "Contact Us" below and send us a message. We cannot take bookings by phone, text or email — reservations are completed on Turo.' },
];

const linksPage = () => {
  const path = '/links/';
  const crumbsItems = [{ label: 'Home', href: '/' }, { label: 'Links', href: path }];
  const contactBtn = `<a class="btn btn-ghost btn-xl" href="/contact/">Contact Us</a>`;

  const body = hero(
    'Boise <span>Luxury Rentals</span>',
    `Rent our ${LISTING.year} Corvette Stingray ${LISTING.trim} &mdash; book securely on Turo.`,
    { xl: true, big: true, compact: true, eyebrow: 'Sports Car Rental Boise · Corvette Rental Idaho',
      img: '/images/corvette-studio-front.jpg', alt: `${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim} studio photo, front three-quarter view`,
      secondaryLabel: 'Contact Us', secondaryHref: '/contact/' }
  ) + `
<section class="mini-stats"><div class="wrap">
  <p class="muted" style="text-align:center;margin:0 0 16px;font-size:.85rem">${LISTING.year} ${esc(LISTING.make)} ${esc(LISTING.model)} ${esc(LISTING.trim)} &middot; 5&#9733; rated on Turo &middot; All reservations are completed securely on <strong>Turo</strong></p>
  ${L.statStrip([['490+', 'Horsepower'], ['6.2L', 'V8'], ['~3.0s', '0-60 mph'], ['Open-air', 'Removable roof'], ['2', 'Seats'], ['Turo', 'Book securely']])}
</div></section>

<section><div class="wrap narrow">
  <h2 style="text-align:center">The offer, in detail</h2>
  <p class="muted" style="text-align:center;max-width:640px;margin:0 auto 10px">Tap any question below to expand it &mdash; no need to leave this page to see the basics.</p>
  ${faqHtml(OFFER_DETAILS)}
</div></section>

<section class="alt"><div class="wrap">
  <h2 style="text-align:center">See every photo</h2>
  ${gallery(PHOTOS.gallery)}
</div></section>

<section><div class="wrap narrow">
  <h2 style="text-align:center">Quick questions</h2>
  ${faqHtml(LINKS_FAQS)}
</div></section>

<section class="cta-band"><div class="wrap narrow">
  <h2>Ready to drive it?</h2>
  <p class="muted" style="max-width:640px;margin:0 auto 26px">Check your dates on Turo, or message us first if you have questions.</p>
  <div class="cta-row" style="justify-content:center">${turoBtn(CTA_LABEL, { big: true })}${contactBtn}</div>
</div></section>`;

  return layout({
    path,
    landing: true,
    minimalFooter: true,
    noindex: true,
    title: `${LISTING.year} Corvette Stingray ${LISTING.trim} Rental Boise | Links`,
    description: `Everything to book our ${LISTING.year} Chevrolet Corvette Stingray ${LISTING.trim} (C8) in Boise/Meridian, Idaho: photos, trip details, Turo booking and contact, all in one link.`,
    body,
    schema: [breadcrumbSchema(crumbsItems), carSchema()],
  });
};

module.exports = { fbLanding, igLanding, linksPage };
