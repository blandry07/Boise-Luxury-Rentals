(function () {
  'use strict';

  // ---- Road divider: draw the road when it scrolls into view ----
  document.documentElement.classList.add('js');
  var roads = document.querySelectorAll('.road-div');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.4 });
    roads.forEach(function (r) { io.observe(r); });
  } else { roads.forEach(function (r) { r.classList.add('in'); }); }

  // ---- Sticky mobile "Book on Turo" bar: only show once the page's own
  // CTA button has scrolled out of view, so it never sits on top of it ----
  var stickyCta = document.querySelector('.sticky-cta');
  var heroCta = document.querySelector('.hero .cta-row');
  if (stickyCta && heroCta && 'IntersectionObserver' in window) {
    stickyCta.classList.add('js-managed');
    var ctaIo = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        // Only reveal the bar once the hero CTA has been scrolled PAST
        // (above the viewport) - not simply "not visible yet" on first load,
        // which would otherwise show it immediately while the hero's own
        // button just hasn't scrolled into view yet.
        var scrolledPast = !e.isIntersecting && e.boundingClientRect.top < 0;
        stickyCta.classList.toggle('show', scrolledPast);
      });
    }, { threshold: 0 });
    ctaIo.observe(heroCta);
  } else if (stickyCta && !heroCta) {
    // No hero CTA on this page (e.g. Contact, FAQ) - keep the sticky bar's
    // default always-on behavior.
    stickyCta.classList.add('show');
  }

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

  // ---- "Save for later" modal: visitor types their own email, we email them ----
  var saveModal = document.querySelector('.save-modal');
  if (saveModal) {
    var smForm = saveModal.querySelector('.save-modal-form');
    var smMsg = saveModal.querySelector('.form-msg');
    var smClose = saveModal.querySelector('.sm-close');
    var smOpen = function (btn) {
      smForm.reset();
      smForm.elements.page.value = btn.getAttribute('data-page') || location.pathname;
      smForm.elements.pageName.value = btn.getAttribute('data-name') || document.title;
      smMsg.className = 'form-msg';
      smMsg.textContent = '';
      var submit = smForm.querySelector('button[type=submit]');
      submit.disabled = false;
      submit.textContent = 'Email me this page';
      saveModal.classList.add('open');
      smForm.elements.email.focus();
    };
    var smCloseModal = function () { saveModal.classList.remove('open'); };
    document.querySelectorAll('.save-later-trigger').forEach(function (btn) {
      btn.addEventListener('click', function () { smOpen(btn); });
    });
    smClose.addEventListener('click', smCloseModal);
    saveModal.addEventListener('click', function (e) { if (e.target === saveModal) smCloseModal(); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && saveModal.classList.contains('open')) smCloseModal();
    });
    smForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var submit = smForm.querySelector('button[type=submit]');
      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Sending...';
      smMsg.className = 'form-msg';
      smMsg.textContent = '';

      var data = {};
      new FormData(smForm).forEach(function (v, k) { data[k] = v; });

      fetch('/api/save-for-later', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      })
        .then(function (r) { return r.json().catch(function () { return { ok: false }; }); })
        .then(function (res) {
          if (res.ok) {
            smMsg.className = 'form-msg ok';
            smMsg.textContent = "Check your inbox — we've emailed you the link.";
            smForm.reset();
            submit.textContent = 'Sent!';
          } else {
            smMsg.className = 'form-msg err';
            smMsg.textContent = res.error || 'Something went wrong. Please try again.';
            submit.disabled = false;
            submit.textContent = original;
          }
        })
        .catch(function () {
          smMsg.className = 'form-msg err';
          smMsg.textContent = 'Network error. Please try again.';
          submit.disabled = false;
          submit.textContent = original;
        });
    });
  }

  // ---- Small inline "Notify Me" forms (coming-soon fleet cars) ----
  // Same /api/contact endpoint and inbox as the main contact form above, just
  // a lighter-weight handler since each page can have several of these.
  document.querySelectorAll('.notify-form').forEach(function (form) {
    var msg = form.querySelector('.form-msg');
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var submit = form.querySelector('button[type=submit]');
      submit.disabled = true;
      var original = submit.textContent;
      submit.textContent = 'Sending...';
      if (msg) { msg.className = 'form-msg'; msg.textContent = ''; }

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
            if (msg) { msg.className = 'form-msg ok'; msg.textContent = "You're on the list — we'll reach out when it's available."; }
            form.reset();
            submit.textContent = 'Sent!';
          } else {
            if (msg) { msg.className = 'form-msg err'; msg.textContent = res.error || 'Something went wrong. Please try again.'; }
            submit.disabled = false;
            submit.textContent = original;
          }
        })
        .catch(function () {
          if (msg) { msg.className = 'form-msg err'; msg.textContent = 'Network error. Please try again.'; }
          submit.disabled = false;
          submit.textContent = original;
        });
    });
  });
})();
