'use strict';
/**
 * Central content/config for the site. Edit here, then run `npm run build`.
 */

const SITE = {
  name: 'Boise Luxury Rentals',
  short: 'Boise Luxury Rentals',
  domain: 'boiseluxuryrentals.com',
  url: 'https://boiseluxuryrentals.com',
  turoUrl: 'https://turo.com/us/en/car-rental/united-states/meridian-id/chevrolet/corvette/3912340',
  origin: 'Meridian, ID',
  // Optional business details. Fill in what you want Google to show; blank values are simply left out.
  phone: '',            // e.g. '+1-208-555-0123'  (shown to Google as your business phone)
  hours: [],            // optional, e.g. [{ days: ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'], opens: '08:00', closes: '20:00' }]
  email: '',            // public email, if you want one shown
  sameAs: [             // other pages that are officially you: Google Business Profile, Instagram, Facebook, YouTube...
    // 'https://www.instagram.com/yourhandle',
  ],
  published: '2026-09-23',
};

// Photo slots. Drop your JPGs into /public/images/ using these names (see README).
// Photos are managed in /photos.json (order, alt text, and which photo fills which spot).
// Edit that file, not this one. The FIRST photo carrying a tag is the one used for that spot.
const fs = require('fs');
const path = require('path');
const photoFile = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'photos.json'), 'utf8'));
const gallery = photoFile.photos.map((p) => ({ src: '/images/' + p.file, alt: p.alt, tags: p.tags || [] }));
const byTag = (tag) => gallery.find((p) => p.tags.includes(tag)) || gallery[0];
const PHOTOS = {
  hero: byTag('hero').src,
  gallery,
  pick: byTag,
};

/**
 * The actual car + the details only YOU know. Fill in what you want shown; any
 * blank value automatically displays "See the Turo listing" instead of a guess.
 * Then run `npm run build`.
 */
const LISTING = {
  year: 2023,
  make: 'Chevrolet',
  model: 'Corvette Stingray',
  trim: '2LT',
  color: 'Black exterior, red interior',
  roof: 'Removable roof panel',
  pricePerDay: '',      // e.g. '$249' (leave blank to show "See Turo")
  dailyMiles: '',       // e.g. '150 miles per day'
  extraMileCost: '',    // e.g. '$0.75 per extra mile'
  minAge: '',           // e.g. '25+'
  deposit: '',          // e.g. 'Set by Turo at checkout'
  delivery: '',         // e.g. 'Delivery available to Boise Airport (BOI) for a fee'
  pickupSpot: '',       // e.g. 'Meridian (exact address shared after booking)'
  availabilityNote: '', // e.g. 'Best availability Sun-Thu'
};

/**
 * Things to see by car. Drive distances are approximate, measured from Meridian, ID
 * (where the Corvette is listed) in normal traffic. `q` is the Google Maps destination.
 */
const PLACES = [
  // --- Boise & close-in (under ~30 minutes) ---
  { group: 'Boise & close to Meridian', name: 'Idaho State Capitol', mi: 12, min: 20, q: 'Idaho State Capitol, Boise, ID',
    blurb: 'A sandstone-and-marble landmark in the heart of downtown Boise, and one of the few capitols in the country heated with geothermal water. Great photo backdrop, easy downtown parking nearby.' },
  { group: 'Boise & close to Meridian', name: 'Basque Block', mi: 12, min: 20, q: 'Basque Block, Boise, ID',
    blurb: "Boise's Basque heritage on one walkable block: restaurants, the Basque Museum & Cultural Center and the Basque Market. Pair it with lunch or dinner downtown." },
  { group: 'Boise & close to Meridian', name: 'Boise Depot & Platt Gardens', mi: 14, min: 22, q: 'Boise Depot, Boise, ID',
    blurb: 'A Spanish-style train depot on the bench with sweeping views straight down Capitol Boulevard to the Capitol dome. A classic golden-hour stop.' },
  { group: 'Boise & close to Meridian', name: 'Julia Davis Park & the Boise Greenbelt', mi: 13, min: 20, q: 'Julia Davis Park, Boise, ID',
    blurb: "Downtown's biggest park, along the Boise River and Greenbelt. Rose Garden, zoo, museums and a great place to stretch your legs between drives." },
  { group: 'Boise & close to Meridian', name: 'Old Idaho Penitentiary', mi: 16, min: 25, q: 'Old Idaho Penitentiary, Boise, ID',
    blurb: 'Idaho\'s territorial-era prison, now a museum, tucked into the sandstone foothills on Warm Springs Avenue. The drive in past the historic mansions is half the fun.' },
  { group: 'Boise & close to Meridian', name: 'Idaho Botanical Garden', mi: 16, min: 25, q: 'Idaho Botanical Garden, Boise, ID',
    blurb: 'Themed gardens and foothill views right next to the Old Penitentiary, a good pairing for a relaxed half-day.' },
  { group: 'Boise & close to Meridian', name: 'Table Rock', mi: 17, min: 28, q: 'Table Rock Trailhead, Boise, ID',
    blurb: "The sandstone bluff with the cross that overlooks the whole city. Drive up to the trailhead, then hike to the top for a valley-wide view (or just enjoy the winding approach)." },
  { group: 'Boise & close to Meridian', name: 'Hyde Park & Camel\'s Back Park', mi: 14, min: 22, q: "Camel's Back Park, Boise, ID",
    blurb: "Boise's North End: tree-lined streets, historic homes, cafes and boutiques on 13th Street, and the Camel's Back hill with a city overlook." },
  { group: 'Boise & close to Meridian', name: 'Eagle Island State Park', mi: 12, min: 20, q: 'Eagle Island State Park, Eagle, ID',
    blurb: 'Riverside park with wide-open green space and a quick, easy drive from Meridian: a great low-key stop with the top down (or windows down).' },
  { group: 'Boise & close to Meridian', name: 'The Village at Meridian', mi: 3, min: 8, q: 'The Village at Meridian, Meridian, ID',
    blurb: 'Meridian\'s open-air shopping and dining hub, a natural first stop to show off the car close to home.' },

  // --- Scenic drives & day trips (30 minutes to 1.5 hours) ---
  { group: 'Scenic drives & day trips', name: 'Lake Lowell & Deer Flat National Wildlife Refuge', mi: 20, min: 30, q: 'Lake Lowell, Nampa, ID',
    blurb: 'A big reservoir near Nampa with flat, easy roads, birdwatching and sunset views. A relaxed cruise west of the Valley.' },
  { group: 'Scenic drives & day trips', name: 'Sunny Slope Wine Trail & Ste. Chapelle Winery', mi: 25, min: 30, q: 'Ste. Chapelle Winery, Caldwell, ID',
    blurb: "Idaho's wine country on the hillside near Caldwell. Nice back roads, tasting rooms and valley views. (Please plan a designated driver if you're tasting.)" },
  { group: 'Scenic drives & day trips', name: 'Lucky Peak Reservoir & Discovery Park', mi: 25, min: 35, q: 'Lucky Peak State Park Discovery Unit, Boise, ID',
    blurb: 'Follow ID-21 out of Boise to the dam and reservoir. A great first stretch of the Ponderosa Pine Scenic Byway with open sweepers.' },
  { group: 'Scenic drives & day trips', name: 'Bogus Basin Road', mi: 30, min: 50, q: 'Bogus Basin Mountain Recreation Area, Boise, ID',
    blurb: "The signature 'drive for driving's sake' near Boise: a 16-mile climb from the foothills to Bogus Basin with switchbacks and big views. Watch for cyclists, wildlife and mountain weather." },
  { group: 'Scenic drives & day trips', name: 'Snake River Birds of Prey National Conservation Area', mi: 35, min: 50, q: 'Snake River Birds of Prey National Conservation Area, ID',
    blurb: "Desert canyon country south of Kuna with one of the densest concentrations of nesting raptors in North America. Check road conditions first: some nearby roads are gravel, which isn't a good fit for a low sports car." },
  { group: 'Scenic drives & day trips', name: 'Idaho City (Ponderosa Pine Scenic Byway)', mi: 52, min: 70, q: 'Idaho City, ID',
    blurb: 'A Gold Rush-era mountain town about 40 miles from Boise via ID-21. Boardwalks, old saloons, the historic cemetery and a very fun road to get there.' },
  { group: 'Scenic drives & day trips', name: 'Bruneau Dunes State Park', mi: 70, min: 80, q: 'Bruneau Dunes State Park, ID',
    blurb: "Home to the tallest single-structured sand dune in North America, plus an observatory. A straightforward I-84 drive with a desert payoff." },

  // --- Big Idaho road trips (2+ hours) ---
  { group: 'Big road trips (half-day or more)', name: 'McCall & Payette Lake', mi: 110, min: 125, q: 'Payette Lake, McCall, ID',
    blurb: "Idaho's mountain-lake town via the Payette River Scenic Byway (ID-55). Our most popular day trip: see the full route guide.", href: '/guides/boise-to-mccall-road-trip/' },
  { group: 'Big road trips (half-day or more)', name: 'Shoshone Falls (Twin Falls)', mi: 125, min: 120, q: 'Shoshone Falls Park, Twin Falls, ID',
    blurb: "Known as the 'Niagara of the West' and taller than Niagara Falls. Best in spring runoff. Long freeway stretch, but an easy, quick highway drive." },
  { group: 'Big road trips (half-day or more)', name: 'Sun Valley & Ketchum', mi: 150, min: 165, q: 'Sun Valley, ID',
    blurb: "Resort town at the foot of the Sawtooths via US-20 and the Sawtooth Scenic Byway (ID-75). See the full route guide.", href: '/guides/boise-to-sun-valley-road-trip/' },
];

const RESTAURANTS = [
  { name: 'Chandlers Steakhouse', area: 'Downtown Boise', mi: 12, min: 20, q: 'Chandlers Steakhouse, Boise, ID',
    blurb: 'Boise\'s go-to upscale steak-and-seafood dinner with live jazz. Good for anniversaries and special nights out.' },
  { name: 'Bar Gernika', area: 'Basque Block', mi: 12, min: 20, q: 'Bar Gernika, Boise, ID',
    blurb: 'A casual Basque bar-restaurant on the Basque Block. Famous for its solomo sandwich and croquetas.' },
  { name: 'Bardenay Restaurant & Distillery', area: 'Downtown Boise & Eagle', mi: 12, min: 20, q: 'Bardenay Restaurant Distillery, Boise, ID',
    blurb: 'A distillery-restaurant with house-made spirits and an easy patio scene. The Eagle location is closer to Meridian (about 8 miles / 15 minutes).' },
  { name: 'Fork', area: 'Downtown Boise', mi: 12, min: 20, q: 'Fork Restaurant, Boise, ID',
    blurb: 'Idaho-sourced comfort food in a lively downtown spot. Great when you want a proper meal before or after a drive.' },
  { name: 'Bittercreek Alehouse', area: 'Downtown Boise', mi: 12, min: 20, q: 'Bittercreek Alehouse, Boise, ID',
    blurb: 'Local, sustainable, brewpub-style menu with a big tap list. A downtown staple.' },
  { name: "Goldy's Breakfast Bistro", area: 'Downtown Boise', mi: 13, min: 20, q: "Goldy's Breakfast Bistro, Boise, ID",
    blurb: 'The local breakfast pick. Fuel up before a big road trip. Expect a wait on weekends.' },
  { name: 'Barbacoa Grill', area: 'Harris Ranch', mi: 20, min: 30, q: 'Barbacoa Grill, Boise, ID',
    blurb: 'A dressy Latin-inspired grill in Harris Ranch with a scenic setting near the Boise River, and a nice finish for an evening drive.' },
  { name: 'Tavern at Bown Crossing', area: 'Southeast Boise', mi: 16, min: 25, q: 'Tavern at Bown Crossing, Boise, ID',
    blurb: 'A relaxed neighborhood tavern in Bown Crossing with a big patio and a great burger-and-beer menu.' },
];

const FAQS = [
  { q: 'Where do I book the car?',
    a: 'All bookings, payments and trip agreements are completed on Turo. Use any "Book on Turo" button on this site and it will take you straight to the Corvette listing. We do not take bookings or payments through this website.' },
  { q: 'Is Boise Luxury Rentals the same as Turo?',
    a: 'No. We are an independent local Turo host. This website is our showcase and information hub. Turo, Inc. is a separate company and we are not affiliated with or endorsed by Turo beyond hosting our vehicle on their marketplace.' },
  { q: 'Who handles insurance and protection plans?',
    a: 'Insurance and protection options are offered through Turo when you book and are shown at checkout. Please read the plan details on Turo carefully before you reserve, and check with your own insurer or credit card if you have questions about personal coverage.' },
  { q: 'What are the driver age, license and deposit requirements?',
    a: 'Eligibility, minimum age, license requirements, security deposits, mileage allowances and pricing are set by Turo and by the vehicle listing, so the Turo page is always the source of truth. If anything is unclear, send us a message first and we will point you to the right answer.' },
  { q: 'Do you deliver the car or do airport pickup?',
    a: 'The Corvette is listed in Meridian, Idaho. Any pickup, delivery or airport options we offer are shown on the Turo listing and are arranged through Turo trip messaging. The Boise Airport is about 14 miles (roughly 20 minutes) from Meridian.' },
  { q: 'How much does it cost?',
    a: 'Daily pricing, trip fees and any discounts change with the season and demand, so we show live pricing only on Turo. Pick your dates on the Turo listing to see your exact total.' },
  { q: 'Can I take the Corvette on a road trip to McCall or Sun Valley?',
    a: 'Mileage limits and allowed trip areas are set on the Turo listing. If you are planning a longer drive, check the daily mileage allowance and consider adding extra miles when booking. Our McCall and Sun Valley guides have full route breakdowns.' },
  { q: 'Is the Corvette hard to drive?',
    a: 'The modern mid-engine Corvette is surprisingly easy to drive around town with an automatic dual-clutch transmission. It is low and wide though, so take driveways and parking-lot speed bumps slowly. It is very quick, so build up to spirited driving gradually.' },
  { q: 'Will luggage fit?',
    a: 'The C8 Corvette has a front trunk and a rear trunk, which is enough for a weekend bag or two per person. It is a two-seater, so pack soft bags rather than large hard-shell suitcases.' },
  { q: 'What if I need to change or cancel a trip?',
    a: 'Changes and cancellations are governed by the cancellation policy shown on the Turo listing. You can request changes through the Turo app or website, and you are welcome to message us with questions any time.' },
  { q: 'What if I have a question before I book?',
    a: 'Use the contact page and we will text or call you back. Please note we cannot take bookings by phone or email. Reservations are completed on Turo.' },
  { q: 'Are you adding more cars?',
    a: 'Yes, that is the plan. Future additions may include an Audi R8, a Tesla Cybertruck and a Mercedes-AMG G63. Those pages are coming; the Corvette is the only vehicle available now.' },
];

const CARS = [
  { slug: 'corvette-stingray', name: '2023 Chevrolet Corvette Stingray 2LT (C8)', status: 'live', tag: 'Available on Turo',
    blurb: 'Mid-engine American supercar performance with a 6.2L V8 and a removable roof. Our flagship rental.' },
  { slug: 'audi-r8', name: 'Audi R8', status: 'soon', photo: '/images/audi-r8.jpg', tag: 'Coming soon', blurb: 'V10 supercar drama with everyday usability.' },
  { slug: 'tesla-cybertruck', name: 'Tesla Cybertruck', status: 'soon', photo: '/images/tesla-cybertruck-showroom.jpg', tag: 'Coming soon', blurb: 'The stainless-steel head-turner with electric acceleration.' },
  { slug: 'mercedes-g63-amg', name: 'Mercedes-AMG G63', status: 'soon', photo: '/images/mercedes-g63-amg-showroom.jpg', tag: 'Coming soon', blurb: 'Iconic luxury SUV with a twin-turbo V8 soundtrack.' },
];

const GUIDES = [
  { slug: 'corvette-rental-boise-guide', title: 'The Complete Corvette Rental Guide for Boise', blurb: 'How renting works on Turo, what to expect from a C8, and how to plan the perfect day or weekend.' },
  { slug: 'best-sports-car-routes-boise', title: 'Best Sports Car Drives Near Boise', blurb: 'Four great roads within about two hours of the Treasure Valley: Bogus Basin, ID-21, ID-55 and more.' },
  { slug: 'boise-to-mccall-road-trip', title: 'Boise to McCall Road Trip', blurb: 'About 110 miles of river canyon, mountain valleys and lakeside town via Highway 55.' },
  { slug: 'boise-to-sun-valley-road-trip', title: 'Boise to Sun Valley Road Trip', blurb: 'About 150 miles across the Camas Prairie to Ketchum and the Sawtooth Scenic Byway.' },
  { slug: 'boise-airport-sports-car-rental', title: 'Boise Airport (BOI) Sports Car Rental Guide', blurb: 'Flying into Boise? How to plan a Corvette rental around your arrival.' },
];

module.exports = { SITE, PHOTOS, LISTING, PLACES, RESTAURANTS, FAQS, CARS, GUIDES };
