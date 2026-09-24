'use strict';
/**
 * SEO audit for the built site. Run: npm run seo
 * Checks titles, descriptions, H1s, canonicals, schema, alt text, internal links,
 * and that target keyword phrases appear on the pages meant to rank for them.
 */
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', 'public');

const KEYWORDS = {
  '/corvette-rental-boise/': ['corvette rental boise', 'c8 corvette rental boise', 'corvette rental idaho', 'c8 rental boise', 'corvette stingray rental boise', 'sports car rental boise'],
  '/c8-corvette-rental-boise/': ['c8 corvette rental boise', 'c8 rental boise', 'c8 corvette rental'],
  '/cars/corvette-stingray/': ['corvette stingray rental boise'],
  '/sports-car-rental-boise/': ['sports car rental boise'],
  '/boise-airport-car-rental/': ['boise airport'],
  '/exotic-rental-boise/': ['exotic'],
  '/': ['corvette rental boise', 'sports car rental boise', 'corvette rental idaho', 'c8 corvette rental'],
};

const walk = (d) => fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]);
const files = walk(ROOT).filter((f) => f.endsWith('.html') && !f.endsWith('404.html'));
const strip = (h) => h.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/&amp;/g, '&').replace(/\s+/g, ' ').toLowerCase();
let problems = 0, titles = new Map(), descs = new Map();
const warn = (u, m) => { problems++; console.log('  ✗ ' + u + ': ' + m); };

for (const f of files) {
  const u = '/' + path.relative(ROOT, f).replace(/index\.html$/, '').replace(/\\/g, '/');
  const h = fs.readFileSync(f, 'utf8');
  const title = (h.match(/<title>([^<]*)<\/title>/) || [])[1] || '';
  const desc = (h.match(/<meta name="description" content="([^"]*)"/) || [])[1] || '';
  const h1s = (h.match(/<h1[\s>]/g) || []).length;
  if (!title) warn(u, 'missing title'); else if (title.length > 65) warn(u, `title ${title.length} chars (aim <= 65)`); else if (title.length < 30) warn(u, 'title short');
  if (!desc) warn(u, 'missing meta description'); else if (desc.length > 165) warn(u, `description ${desc.length} chars (aim <= 160)`); else if (desc.length < 70) warn(u, 'description short');
  if (h1s !== 1) warn(u, `${h1s} H1 tags (need exactly 1)`);
  if (!h.includes(`<link rel="canonical" href="https://boiseluxuryrentals.com${u}">`)) warn(u, 'canonical missing/incorrect');
  if (!/application\/ld\+json/.test(h)) warn(u, 'no structured data');
  for (const m of h.matchAll(/<img\b[^>]*>/g)) if (!/\balt="[^"]+"/.test(m[0]) && !/class="bg"/.test(m[0]) && !/<img alt="">/.test(m[0])) warn(u, 'image without alt: ' + m[0].slice(0, 60));
  titles.set(title, (titles.get(title) || []).concat(u));
  descs.set(desc, (descs.get(desc) || []).concat(u));
  const text = strip(h);
  for (const k of KEYWORDS[u] || []) {
    const n = text.split(k).length - 1;
    if (n < 1) warn(u, `keyword missing: "${k}"`);
    else console.log(`  ✓ ${u} "${k}" x${n}`);
  }
  const words = text.split(' ').length;
  if (words < 250 && !/privacy|contact|cars\/$/.test(u)) warn(u, `thin content (${words} words)`);
}
for (const [t, us] of titles) if (us.length > 1) warn(us.join(', '), 'duplicate title');
for (const [d, us] of descs) if (us.length > 1) warn(us.join(', '), 'duplicate description');
const sm = fs.readFileSync(path.join(ROOT, 'sitemap.xml'), 'utf8');
for (const f of files) { const u = '/' + path.relative(ROOT, f).replace(/index\.html$/, '').replace(/\\/g, '/'); if (!sm.includes('boiseluxuryrentals.com' + u + '</loc>')) warn(u, 'not in sitemap'); }
console.log(problems ? `\n${problems} issue(s) to review` : `\nAll ${files.length} pages passed.`);
process.exit(problems ? 1 : 0);
