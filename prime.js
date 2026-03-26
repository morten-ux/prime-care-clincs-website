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

/* 2. Scroll reveal — IntersectionObserver */
(function () {
  if (!('IntersectionObserver' in window)) {
    // Fallback: just show everything
    document.querySelectorAll('.reveal').forEach(function (el) {
      el.classList.add('is-visible');
    });
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
    { threshold: 0.12 }
  );

  document.querySelectorAll('.reveal').forEach(function (el) {
    observer.observe(el);
  });
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
