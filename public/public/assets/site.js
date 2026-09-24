(function () {
  'use strict';

  // ---- Mobile nav ----
  var btn = document.querySelector('.menu-btn');
  var nav = document.querySelector('nav.main');
  if (btn && nav) {
    btn.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    });
  }

  // ---- Hide broken images so the dark placeholder shows instead ----
  document.querySelectorAll('.ph img, img.bg').forEach(function (img) {
    img.addEventListener('error', function () { img.style.display = 'none'; });
  });

  // ---- Lightbox: every photo on the page, de-duplicated, in page order ----
  var seen = {};
  var items = Array.prototype.slice.call(document.querySelectorAll('img[data-full]')).filter(function (i) {
    var k = i.getAttribute('data-full');
    if (seen[k]) return false;
    seen[k] = true;
    return true;
  });
  var lb = document.querySelector('.lightbox');
  if (lb && items.length) {
    var big = lb.querySelector('img');
    var idx = 0;
    var show = function (i) {
      idx = (i + items.length) % items.length;
      big.src = items[idx].getAttribute('data-full');
      big.alt = items[idx].alt;
      lb.classList.add('open');
    };
    document.querySelectorAll('img[data-full]').forEach(function (img) {
      var p = img.closest('.ph');
      if (!p) return;
      p.style.cursor = 'zoom-in';
      p.addEventListener('click', function () {
        var k = img.getAttribute('data-full');
        for (var n = 0; n < items.length; n++) if (items[n].getAttribute('data-full') === k) { show(n); break; }
      });
    });
    lb.querySelector('.lb-close').addEventListener('click', function () { lb.classList.remove('open'); });
    lb.querySelector('.lb-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.lb-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb) lb.classList.remove('open'); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('open')) return;
      if (e.key === 'Escape') lb.classList.remove('open');
      if (e.key === 'ArrowLeft') show(idx - 1);
      if (e.key === 'ArrowRight') show(idx + 1);
    });
  }

  // ---- Contact form ----
  var form = document.getElementById('contact-form');
  if (form) {
    var msg = document.getElementById('form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submit = form.querySelector('button[type=submit]');
      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Sending...';
      msg.className = 'form-msg';
      msg.textContent = '';

      var data = {};
      new FormData(form).forEach(function (v, k) { data[k] = v; });

      fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res.ok) {
            msg.className = 'form-msg ok';
            msg.textContent = "Thanks! We got your message and will text or call you back soon. If you're ready to book, you can also reserve directly on Turo.";
            form.reset();
          } else {
            msg.className = 'form-msg err';
            msg.textContent = res.error || 'Something went wrong. Please try again.';
          }
        })
        .catch(function () {
          msg.className = 'form-msg err';
          msg.textContent = 'Network error. Please try again.';
        })
        .then(function () {
          submit.disabled = false;
          submit.textContent = original;
        });
    });
  }
})();
