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

## Your photos and how to change their order
All photos live in `public/images/` and are controlled by **`photos.json`** in the project root.

- **Reorder:** move a whole `{ ... }` block up or down. The order in the file is the order on the site. The first 9 fill the big photo mosaic; the rest appear under "More photos".
- **Hide a photo:** delete its block (the file can stay in the folder).
- **Add a photo:** put the JPG in `public/images/` and add a block with `file`, `alt` (describe the photo) and optional `tags`.
- **Special spots:** the first photo carrying a tag fills that spot: `hero` (home page + social share), `side`, `interior`, `roof`, `trunk-rear`, `trunk-front`, `engine`, `cockpit`, `screen`.

Then commit and push in GitHub Desktop. Railway runs `npm run build` on deploy, so the site updates itself. (Locally: `npm run build`.)

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
