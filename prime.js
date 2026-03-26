/* ============================================================
   Prime Care Clinics — Shared Script
   prime.js
   ============================================================ */

/* 1. Nav scroll — frosted glass effect */
(function () {
  var nav = document.querySelector('nav');
  if (!nav) return;
  var onScroll = function () {
    nav.classList.toggle('scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

/* 2. Scroll reveal — IntersectionObserver (handles both .reveal and .reveal-clip) */
(function () {
  var allReveal = document.querySelectorAll('.reveal, .reveal-clip');

  if (!('IntersectionObserver' in window)) {
    allReveal.forEach(function (el) { el.classList.add('is-visible'); });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  allReveal.forEach(function (el) { observer.observe(el); });

  // Safety net: IO is unreliable for elements already in the viewport on load.
  // After 120ms the initial hidden state has been painted — now force them visible
  // so the transition runs correctly.
  setTimeout(function () {
    allReveal.forEach(function (el) {
      if (el.classList.contains('is-visible')) return;
      var rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-visible');
      }
    });
  }, 120);
})();

/* 3. Counter animation for stats */
function animateCount(el, target, suffix, duration) {
  var start = performance.now();
  var update = function (now) {
    var elapsed = now - start;
    var progress = Math.min(elapsed / duration, 1);
    var eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.round(eased * target) + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

(function () {
  if (!('IntersectionObserver' in window)) return;

  var statsObserver = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var target = parseInt(el.dataset.count, 10);
        var suffix = el.dataset.suffix || '';
        animateCount(el, target, suffix, 1200);
        statsObserver.unobserve(el);
      });
    },
    { threshold: 0.5 }
  );

  document.querySelectorAll('[data-count]').forEach(function (el) {
    statsObserver.observe(el);
  });
})();

/* 4. Custom cursor — gold dot + lagging ring */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  document.body.classList.add('has-custom-cursor');

  var dot = document.createElement('div');
  dot.className = 'cursor-dot';
  var ring = document.createElement('div');
  ring.className = 'cursor-ring';
  document.body.appendChild(dot);
  document.body.appendChild(ring);

  var mouseX = window.innerWidth / 2;
  var mouseY = window.innerHeight / 2;
  var ringX = mouseX;
  var ringY = mouseY;
  var visible = false;

  document.addEventListener('mousemove', function (e) {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!visible) {
      ringX = mouseX;
      ringY = mouseY;
      visible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    }
    dot.style.left = mouseX + 'px';
    dot.style.top = mouseY + 'px';
  });

  document.addEventListener('mouseleave', function () {
    dot.style.opacity = '0';
    ring.style.opacity = '0';
  });

  dot.style.opacity = '0';
  ring.style.opacity = '0';

  function animateRing() {
    ringX += (mouseX - ringX) * 0.1;
    ringY += (mouseY - ringY) * 0.1;
    ring.style.left = ringX + 'px';
    ring.style.top = ringY + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  var hoverTargets = 'a, button, .brand-card, .team-card, .pillar-card, .vacature-item, .why-item';
  document.querySelectorAll(hoverTargets).forEach(function (el) {
    el.addEventListener('mouseenter', function () {
      ring.classList.add('cursor-ring--hover');
    });
    el.addEventListener('mouseleave', function () {
      ring.classList.remove('cursor-ring--hover');
    });
  });
})();

