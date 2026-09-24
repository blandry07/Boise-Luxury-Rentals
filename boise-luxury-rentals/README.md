# Boise Luxury Rentals (boiseluxuryrentals.com)

Marketing site for Boise Sports & Luxury Car Rentals. **All bookings happen on Turo**; the site links to the Corvette listing and has a contact form that emails you.

## Structure
- `server.js`: Express server. Serves `/public` with clean URLs and handles `POST /api/contact`.
- `tools/data.js`: **edit content here** (Turo URL, photos, places + drive distances, restaurants, FAQs, cars, guides).
- `tools/pages-core.js`, `tools/pages-seo.js`, `tools/lib.js`: page templates.
- `npm run build` regenerates every page into `/public` (plus `sitemap.xml`, `robots.txt`).
- `public/` is committed pre-built, so Railway only needs `npm start`.

## Fill in your listing details
Open `tools/data.js` and complete the `LISTING` block (color, daily price, daily miles, extra-mile cost, minimum age, deposit, delivery, pickup spot, availability note), then run `npm run build`. Any blank value shows "See the Turo listing" instead of a guess.

## SEO
See `SEO-PLAYBOOK.md`. Run `npm run seo` after every build to audit titles, descriptions, H1s, schema, keywords and the sitemap.

## Your photos
Drop JPGs into `public/images/` with these names (landscape, ~2000px wide, under ~500 KB each is ideal):

| File | Used for |
|---|---|
| `corvette-hero.jpg` | Home page hero + social share image |
| `corvette-01.jpg` ... `corvette-08.jpg` | Shot list: 01 front 3/4 (large lead), 02 rear, 03 side profile, 04 interior, 05 roof panel off, 06 wheel/detail, 07 open trunk with luggage, 08 scenic Idaho road |

Until a photo exists, that slot shows a dark placeholder. To use a different number of photos or different names, edit `PHOTOS` in `tools/data.js` and run `npm run build`.

## Railway environment variables
| Variable | Value |
|---|---|
| `CONTACT_TO` | Your personal Gmail (where inquiries are delivered) **required** |
| `RESEND_API_KEY` + `CONTACT_FROM` | Send with Resend (same as your other sites). `CONTACT_FROM` must be a verified sender, e.g. `Boise Luxury Rentals <hello@boiseluxuryrentals.com>` |
| *or* `GMAIL_USER` + `GMAIL_APP_PASSWORD` | Send through Gmail with an App Password instead |

Health check path: `/healthz`. Add `boiseluxuryrentals.com` (and `www`) as custom domains in Railway and point DNS as Railway instructs.

## Adding a future car
1. Add a page function in `tools/pages-core.js` (copy `corvettePage`) and register it in `tools/build.js`.
2. In `tools/data.js` set that car's `status` to `'live'` in `CARS`.
3. `npm run build`.

## Things to verify before launch
- Drive distances/times are estimates from Meridian; spot-check a few in Google Maps (each place has a live directions link).
- Restaurant and landmark details (names, locations) are worth a quick check for anything that has closed or moved.
- Confirm the Corvette's model year/trim so you can add it to the car page if you want.
