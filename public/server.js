'use strict';
/**
 * Boise Luxury Rentals - static site + contact form endpoint.
 * Pages are pre-built into /public by `npm run build` (tools/build.js).
 *
 * Environment variables (set in Railway):
 *   CONTACT_TO          Where contact-form messages are delivered (your personal Gmail)  [required]
 *   RESEND_API_KEY      Use Resend to send (recommended, same as your other sites)
 *   CONTACT_FROM        "Boise Luxury Rentals <hello@boiseluxuryrentals.com>" (a verified Resend sender)
 *   -- OR --
 *   GMAIL_USER          Gmail address used to send
 *   GMAIL_APP_PASSWORD  Gmail "App Password" (Google Account > Security > App passwords)
 *   SITE_URL            Defaults to https://boiseluxuryrentals.com
 *   FORCE_HTTPS         "true" to redirect http -> https (Railway custom domains already serve https)
 */
const path = require('path');
const fs = require('fs');
const express = require('express');
const compression = require('compression');

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

async function sendMail({ subject, text, html, replyTo }) {
  if (!CONTACT_TO) throw new Error('CONTACT_TO is not set');

  if (process.env.RESEND_API_KEY) {
    const from = process.env.CONTACT_FROM || 'Boise Luxury Rentals <onboarding@resend.dev>';
    const payload = { from, to: [CONTACT_TO], subject, text, html };
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

  if (process.env.GMAIL_USER && process.env.GMAIL_APP_PASSWORD) {
    const nodemailer = require('nodemailer');
    const transport = nodemailer.createTransport({
      service: 'gmail',
      auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD },
    });
    await transport.sendMail({
      from: 'Boise Luxury Rentals <' + process.env.GMAIL_USER + '>',
      to: CONTACT_TO,
      replyTo: replyTo || undefined,
      subject,
      text,
      html,
    });
    return;
  }

  throw new Error('No email provider configured (set RESEND_API_KEY or GMAIL_USER + GMAIL_APP_PASSWORD)');
}

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
