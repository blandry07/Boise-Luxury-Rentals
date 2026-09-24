# SEO playbook: boiseluxuryrentals.com

## What is already built in
- **One page per search intent** (keyword map below), each with a unique title (<=65 chars), meta description, single H1, canonical URL, and Open Graph tags.
- **Structured data:** AutoRental + WebSite (home), Car (the 2023 Stingray), FAQPage (home, FAQ, Corvette, C8, landing pages, guides), Article (guides), BreadcrumbList (every page), ItemList (things to see).
- **Speed:** static pre-built HTML, gzip, preloaded hero image, lazy-loaded gallery, long image caching. Fast pages rank and convert better.
- **Crawlability:** `sitemap.xml`, `robots.txt`, clean URLs with trailing slash, www redirects to the apex domain, a 404 page, and keyword-rich internal links (footer "Popular searches", cross-links between the Corvette, C8, guides and things-to-see pages).
- **Audit:** `npm run seo` checks every page (title/description length, one H1, canonical, alt text, schema, sitemap, and that each target keyword appears where it should). Run it after any content change.

## Keyword map (one primary target per page, so pages do not compete)
| URL | Primary keyword | Also naturally includes |
|---|---|---|
| `/` | sports car rental Boise | Corvette rental Boise, Corvette rental Idaho |
| `/corvette-rental-boise/` | Corvette rental Boise | Corvette rental Idaho, C8 rental Boise, Corvette Stingray rental Boise |
| `/c8-corvette-rental-boise/` | C8 Corvette rental Boise | C8 rental Boise, C8 vs Z06 / E-Ray, drive modes |
| `/cars/corvette-stingray/` | Corvette Stingray rental Boise | 2023 Corvette Stingray 2LT specs |
| `/sports-car-rental-boise/` | sports car rental Boise | anniversary / weekend use cases |
| `/boise-airport-car-rental/` | Boise airport sports car rental | BOI distances |
| `/exotic-rental-boise/` | exotic car rental Boise | supercar-style rental |
| `/guides/*` and `/things-to-do-boise-by-car/` | long-tail: Boise to McCall drive, Sun Valley road trip, best drives near Boise, things to see | drive distances |

## Do these after launch (in this order; they matter more than any on-page tweak)
1. **Google Search Console:** add `boiseluxuryrentals.com`, verify DNS, submit `https://boiseluxuryrentals.com/sitemap.xml`, and request indexing for the home page, both Corvette pages and the C8 page.
2. **Google Business Profile:** create one (service-area business, Meridian/Boise, category "Car rental agency"), add the same photos, link to the site, and mention that bookings are on Turo. Local pack results are a big source of "Corvette rental Boise" traffic. Match the business name and phone to the site.
3. **Turo listing:** put "Corvette rental Boise" / "C8 Corvette" naturally in the listing title and description, and add the website URL to your host profile if Turo allows it. Good Turo reviews also send searchers to you.
4. **Real photos with descriptive filenames:** you named them corvette-01 etc.; before uploading, also make sure each image is compressed (<=300 KB, ~2000px wide). The alt text is already written.
5. **Backlinks:** local directories (Boise/Meridian Chamber of Commerce, Idaho tourism and events sites, wedding/photographer vendor lists), local photographers and venues you work with, and Boise bloggers. A few relevant local links beat many random ones.
6. **Reviews and social proof:** once you have Turo reviews, quote real ones (with permission) on the site. Never invent reviews or ratings; that violates Google's policies.
7. **Fresh content:** add a guide every month or two (e.g. "Best patios in Boise for a car meet-up", "Corvette rental for a Boise wedding", seasonal drives). Update the `modified` date only when you actually change a page.

## Content rules that keep the rankings
- Do not copy the same text across pages. Each landing page here has its own angle; keep it that way.
- Only claim what is true and on the Turo listing (price, mileage, age rules). Fill `LISTING` in `tools/data.js` and rebuild.
- Every page should still say plainly that booking happens on Turo. It is also a trust signal.
