'use strict';
/**
 * Boise Luxury Rentals - static site + contact form endpoint.
 * Pages are pre-built into /public by `npm run build` (tools/build.js).
 *
 * Environment variables (set in Railway):
 *   CONTACT_TO          Where contact-form / notify-me messages are delivered (your personal Gmail)  [required]
 *   RESEND_API_KEY      Use Resend to send (needs a verified sending domain)
 *   BREVO_API_KEY       Use Brevo to send instead (needs a verified sending domain in Brevo)
 *   CONTACT_FROM        "Boise Luxury Rentals <hello@boiseluxuryrentals.com>" (must be a verified sender
 *                       on whichever provider's API key is set above)
 *   -- OR, with neither of the above set --
 *   GMAIL_USER          Gmail address used to send
 *   GMAIL_APP_PASSWORD  Gmail "App Password" (Google Account > Security > App passwords)
 *   SITE_URL            Defaults to https://boiseluxuryrentals.com
 *   FORCE_HTTPS         "true" to redirect http -> https (Railway custom domains already serve https)
 *
 * The "save for later" feature (/api/save-for-later) always sends FROM
 * info@boiseluxuryrentals.com (see SFL_FROM below), regardless of which
 * provider is active, as long as that address is a verified sender there.
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');
const { SITE, LISTING, PHOTOS } = require('./tools/data');

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');
const CONTACT_TO = process.env.CONTACT_TO || '';

app.disable('x-powered-by');
app.set('trust proxy', 1);
app.use(compression());

// One canonical host for SEO: send www.boiseluxuryrentals.com to the apex domain.
app.use((req, res, next) => {
  const host = (req.headers.host || '').toLowerCase();
  if (host.startsWith('www.') && host.endsWith('boiseluxuryrentals.com')) {
    return res.redirect(301, 'https://' + host.slice(4) + req.originalUrl);
  }
  next();
});

// ---- Basic hardening headers ----
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  next();
});

if (process.env.FORCE_HTTPS === 'true') {
  app.use((req, res, next) => {
    if (req.headers['x-forwarded-proto'] === 'http') {
      return res.redirect(301, 'https://' + req.headers.host + req.originalUrl);
    }
    next();
  });
}

// ---- Health check for Railway ----
app.get('/healthz', (req, res) => res.json({ ok: true }));

// ---- Contact form ----
const hits = new Map(); // ip -> [timestamps]
function rateLimited(ip) {
  const now = Date.now();
  const windowMs = 15 * 60 * 1000;
  const list = (hits.get(ip) || []).filter((t) => now - t < windowMs);
  list.push(now);
  hits.set(ip, list);
  return list.length > 5;
}
setInterval(() => {
  const now = Date.now();
  for (const [ip, list] of hits) {
    const fresh = list.filter((t) => now - t < 15 * 60 * 1000);
    if (fresh.length) hits.set(ip, fresh); else hits.delete(ip);
  }
}, 10 * 60 * 1000).unref();

const esc = (s) =>
  String(s == null ? '' : s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/**
 * `to`/`from` default to the business inbox (CONTACT_TO) and the regular
 * sender identity, so every existing call site (the contact form) behaves
 * exactly as before. The "save for later" feature overrides both: it sends
 * TO the visitor's own address, FROM a noreply@ identity (see below).
 */
async function sendMail({ subject, text, html, replyTo, to, from }) {
  const recipient = to || CONTACT_TO;
  if (!recipient) throw new Error('No recipient: CONTACT_TO is not set and no `to` was given');

  if (process.env.RESEND_API_KEY) {
    const fromAddr = from || process.env.CONTACT_FROM || 'Boise Luxury Rentals <onboarding@resend.dev>';
    const payload = { from: fromAddr, to: [recipient], subject, text, html };
    if (replyTo) payload.reply_to = replyTo;
    const r = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: 'Bearer ' + process.env.RESEND_API_KEY,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Resend error ' + r.status + ': ' + (await r.text()));
    return;
  }

  if (process.env.BREVO_API_KEY) {
    // Brevo's API wants sender/to as {name, email} objects, not "Name <email>" strings.
    const parseAddr = (s) => {
      const m = /^(.*?)\s*<([^>]+)>$/.exec(s || '');
      return m ? { name: m[1].trim().replace(/^"|"$/g, ''), email: m[2].trim() } : { email: s };
    };
    const fromAddr = parseAddr(from || process.env.CONTACT_FROM || 'Boise Luxury Rentals <info@boiseluxuryrentals.com>');
    const payload = {
      sender: fromAddr,
      to: [{ email: recipient }],
      subject,
      textContent: text,
      htmlContent: html,
    };
    if (replyTo) payload.replyTo = parseAddr(replyTo);
    const r = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'api-key': process.env.BREVO_API_KEY,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(payload),
    });
    if (!r.ok) throw new Error('Brevo error ' + r.status + ': ' + (await r.text()));
    return;
  }

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transport.sendMail({
      // Note: Gmail only honors a custom `from` if it's set up as a
      // "Send mail as" alias on this Gmail account - otherwise Gmail
      // silently sends from GMAIL_USER instead.
      from: from || ('Boise Luxury Rentals <' + process.env.GMAIL_USER + '>'),
      to: recipient,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
    });
    return;
  }

  throw new Error('No email provider configured (set RESEND_API_KEY, BREVO_API_KEY, or GMAIL_USER + GMAIL_APP_PASSWORD)');
}

// ---- "Save for later" email ----
const SFL_PRICE_TEXT = LISTING.pricePerDay ? `Starting at ${LISTING.pricePerDay}/day (before tax & Turo fees)` : '';
const SFL_FROM = 'Boise Luxury Rentals <info@boiseluxuryrentals.com>';

/** Builds the bulletproof, table-based HTML email sent to the visitor's own address. */
function saveForLaterEmail({ pageUrl, pageName }) {
  const heroImg = SITE.url + PHOTOS.hero;
  const carName = `${LISTING.year} ${LISTING.make} ${LISTING.model} ${LISTING.trim}`;
  const year = new Date().getFullYear();
  const host = SITE.url.replace(/^https?:\/\//, '');

  const subject = `Here's the page you saved — ${SITE.short || SITE.name}`;

  const text = [
    `Here's the page you saved: ${pageName}`,
    '',
    `${carName}${SFL_PRICE_TEXT ? ' — ' + SFL_PRICE_TEXT : ''}.`,
    'All bookings are completed securely on Turo.',
    '',
    `Book on Turo: ${SITE.turoUrl}`,
    `View the page again: ${pageUrl}`,
    '',
    `You're receiving this because someone requested this link on ${host}. We don't send any other emails or add you to a list.`,
    `Privacy Policy: ${SITE.url}/privacy/`,
    `Terms & Conditions: ${SITE.url}/terms/`,
  ].join('\n');

  const html = `<!doctype html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>${esc(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#eef0f3;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;">${esc(carName)}${SFL_PRICE_TEXT ? ' — ' + esc(SFL_PRICE_TEXT) : ''}. All bookings are completed securely on Turo.</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#eef0f3;">
<tr><td align="center" style="padding:24px 12px;">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#ffffff;">
  <tr><td style="background:#0a0c0f;padding:22px 28px;text-align:center;">
    <img src="${SITE.url}/assets/icon-512.png" width="40" height="40" alt="" style="vertical-align:middle;border:0;display:inline-block">
    <span style="color:#ffffff;font-size:19px;font-weight:700;vertical-align:middle;margin-left:10px;font-family:Arial,Helvetica,sans-serif;">${esc(SITE.name)}</span>
  </td></tr>
  <tr><td><img src="${heroImg}" width="600" alt="${esc(carName)}" style="width:100%;max-width:600px;display:block;border:0"></td></tr>
  <tr><td style="padding:32px 28px 8px;font-family:Arial,Helvetica,sans-serif;color:#1b1f24;">
    <h1 style="font-size:22px;margin:0 0 10px;color:#0a0c0f;">Here's the page you saved</h1>
    <p style="font-size:15px;line-height:1.55;color:#444b54;margin:0 0 16px;">You asked us to email you a link back to <strong>${esc(pageName)}</strong> so you can book whenever you're ready.</p>
    ${SFL_PRICE_TEXT ? `<div style="display:inline-block;background:#fdeceb;color:#b01e14;font-weight:700;font-size:14px;padding:8px 14px;border-radius:7px;margin:0 0 20px;">${esc(SFL_PRICE_TEXT)}</div>` : ''}
    <p style="font-size:15px;line-height:1.55;color:#444b54;margin:0 0 16px;">${esc(carName)} &mdash; a mid-engine C8 with a removable roof, 490+ horsepower and a 6.2L V8. All bookings are completed securely on Turo.</p>
    <table role="presentation" cellpadding="0" cellspacing="0" style="margin:26px auto 8px;">
      <tr><td align="center" style="border-radius:8px;background:#e5352b;">
        <a href="${SITE.turoUrl}" style="display:inline-block;padding:14px 30px;border-radius:8px;font-family:Arial,Helvetica,sans-serif;font-weight:700;font-size:15px;color:#ffffff;text-decoration:none;letter-spacing:.3px;">CHECK AVAILABILITY &amp; BOOK ON TURO &rarr;</a>
      </td></tr>
    </table>
    <p style="text-align:center;margin:14px 0 0;font-family:Arial,Helvetica,sans-serif;"><a href="${pageUrl}" style="color:#555b63;font-size:13px;text-decoration:underline;">Or view the page again &rarr;</a></p>
  </td></tr>
  <tr><td style="padding:0 28px;"><hr style="border:0;border-top:1px solid #e7e9ec;margin:28px 0 0;"></td></tr>
  <tr><td style="padding:22px 28px 28px;text-align:center;font-family:Arial,Helvetica,sans-serif;">
    <p style="font-size:12px;color:#8a9099;line-height:1.6;margin:0 0 8px;">You're receiving this because someone requested this link on ${esc(host)}. We don't send any other emails or add you to a list.</p>
    <p style="font-size:12px;margin:0 0 8px;"><a href="${SITE.url}/privacy/" style="color:#8a9099;text-decoration:underline;">Privacy Policy</a> &middot; <a href="${SITE.url}/terms/" style="color:#8a9099;text-decoration:underline;">Terms &amp; Conditions</a></p>
    <p style="font-size:12px;color:#8a9099;margin:0;">&copy; ${year} ${esc(SITE.name)} &middot; Meridian, Idaho</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;

  return { subject, text, html };
}

app.post('/api/save-for-later', express.json({ limit: '10kb' }), async (req, res) => {
  try {
    const b = req.body || {};

    // Honeypot: real people never fill this in.
    if (b.website) return res.json({ ok: true });

    if (rateLimited(req.ip)) {
      return res.status(429).json({ ok: false, error: 'Too many requests. Please try again in a few minutes.' });
    }

    const email = String(b.email || '').trim().slice(0, 150);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'Please enter a valid email address.' });
    }

    const rawPage = String(b.page || '/').trim().slice(0, 200);
    const page = rawPage.startsWith('/') ? rawPage : '/' + rawPage;
    const pageName = String(b.pageName || SITE.name).trim().slice(0, 150);
    const pageUrl = SITE.url + page;

    const { subject, text, html } = saveForLaterEmail({ pageUrl, pageName });
    await sendMail({ to: email, from: SFL_FROM, subject, text, html });
    res.json({ ok: true });
  } catch (err) {
    console.error('[save-for-later] failed:', err.message);
    res.status(500).json({
      ok: false,
      error: 'Sorry, something went wrong sending that email. Please try again in a moment.',
    });
  }
});

app.post('/api/contact', express.json({ limit: '20kb' }), express.urlencoded({ extended: false, limit: '20kb' }), async (req, res) => {
  try {
    const b = req.body || {};

    // Honeypot: real people never fill this in.
    if (b.website) return res.json({ ok: true });

    if (rateLimited(req.ip)) {
      return res.status(429).json({ ok: false, error: 'Too many messages. Please try again in a few minutes.' });
    }

    const name = String(b.name || '').trim().slice(0, 100);
    const phone = String(b.phone || '').trim().slice(0, 40);
    const email = String(b.email || '').trim().slice(0, 150);
    const dates = String(b.dates || '').trim().slice(0, 120);
    const vehicle = String(b.vehicle || '').trim().slice(0, 80);
    const contactPref = String(b.contactPref || '').trim().slice(0, 20);
    const message = String(b.message || '').trim().slice(0, 4000);

    if (!name || !message) {
      return res.status(400).json({ ok: false, error: 'Please include your name and a message.' });
    }
    if (!phone && !email) {
      return res.status(400).json({ ok: false, error: 'Please include a phone number or email so we can reach you.' });
    }
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ ok: false, error: 'That email address does not look right.' });
    }

    const subject = 'New inquiry from ' + name.replace(/[\r\n]/g, ' ') + ' - Boise Luxury Rentals';
    const text = [
      'New website inquiry',
      '',
      'Name: ' + name,
      'Phone: ' + (phone || '(not provided)'),
      'Email: ' + (email || '(not provided)'),
      'Prefers: ' + (contactPref || '(no preference)'),
      'Vehicle: ' + (vehicle || '(not specified)'),
      'Dates: ' + (dates || '(not specified)'),
      '',
      'Message:',
      message,
    ].join('\n');
    const html =
      '<h2>New website inquiry</h2><table cellpadding="6" style="border-collapse:collapse">' +
      [['Name', name], ['Phone', phone || '(not provided)'], ['Email', email || '(not provided)'],
       ['Prefers', contactPref || '(no preference)'], ['Vehicle', vehicle || '(not specified)'],
       ['Dates', dates || '(not specified)']]
        .map(([k, v]) => '<tr><td><b>' + k + '</b></td><td>' + esc(v) + '</td></tr>').join('') +
      '</table><h3>Message</h3><p style="white-space:pre-wrap">' + esc(message) + '</p>';

    await sendMail({ subject, text, html, replyTo: email || undefined });
    res.json({ ok: true });
  } catch (err) {
    console.error('[contact] failed:', err.message);
    res.status(500).json({
      ok: false,
      error: 'Sorry, something went wrong sending your message. Please try again in a moment.',
    });
  }
});

// ---- Static site (clean URLs: /faq/ -> public/faq/index.html) ----
app.use(
  express.static(PUBLIC_DIR, {
    extensions: ['html'],
    setHeaders(res, filePath) {
      if (/\.(?:jpe?g|png|webp|avif|svg|woff2?)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=2592000');
      } else if (/\.(?:css|js)$/i.test(filePath)) {
        res.setHeader('Cache-Control', 'public, max-age=3600');
      } else {
        res.setHeader('Cache-Control', 'public, max-age=300');
      }
    },
  })
);

// ---- 404 ----
app.use((req, res) => {
  const p = path.join(PUBLIC_DIR, '404.html');
  res.status(404);
  if (fs.existsSync(p)) return res.sendFile(p);
  res.type('text').send('Not found');
});

app.listen(PORT, () => {
  console.log('Boise Luxury Rentals listening on ' + PORT);
  if (!CONTACT_TO) console.warn('WARNING: CONTACT_TO is not set - contact form will fail until it is.');
});
