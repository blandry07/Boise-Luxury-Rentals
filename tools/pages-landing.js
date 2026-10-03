'use strict';
/**
 * Paid-social landing pages (/fb/ and /ig/) for ad traffic from Facebook and
 * Instagram. Stripped-down nav/footer (opts.landing in layout()), a single
 * CTA throughout (no secondary "browse" link), noindex (these are campaign
 * pages, not meant to compete with the real site in organic search), and the
 * same Meta Pixel + GTM tags the rest of the site carries (both fire from the
 * shared layout() head/body, so nothing extra is needed here for tracking).
 */
const { LISTING } = require('./data');
const L = require('./lib');
const { esc, turoBtn, layout, hero, faqHtml, breadcrumbSchema, carSchema, CTA_LABEL } = L;

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

module.exports = { fbLanding, igLanding };
