/* ==========================================================================
   Modern Flare Hair Design — js/main.js
   --------------------------------------------------------------------------
   Vanilla JS only (no jQuery, no build step) so the behaviour carries straight
   over into a WordPress enqueue later. Every module is defensive: if the
   markup it looks for is missing, the module simply does nothing.

   Modules
   1. Mobile navigation (hamburger toggle)
   2. Sticky header state on scroll
   3. Scroll-reveal animations (IntersectionObserver)
   4. Active nav link highlighting
   5. Footer copyright year
   ========================================================================== */

(function () {
  'use strict';

  /* ------------------------------------------------------------------------
     Helpers
     ------------------------------------------------------------------------ */
  const $ = (selector, scope) => (scope || document).querySelector(selector);
  const $$ = (selector, scope) =>
    Array.prototype.slice.call((scope || document).querySelectorAll(selector));

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ------------------------------------------------------------------------
     1. MOBILE NAVIGATION
     The hamburger controls the panel via aria-expanded / .is-open, keeps the
     body from scrolling behind it, and closes on: link click, Escape,
     outside click and resize back up to desktop.
     ------------------------------------------------------------------------ */
  function initMobileNav() {
    const toggle = $('#nav-toggle');
    const panel = $('#mobile-menu');

    if (!toggle || !panel) return;

    function openMenu() {
      panel.classList.add('is-open');
      panel.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Close navigation menu');
      document.body.style.overflow = 'hidden'; // lock background scroll
    }

    function closeMenu() {
      panel.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Open navigation menu');
      document.body.style.overflow = '';
    }

    function isOpen() {
      return toggle.getAttribute('aria-expanded') === 'true';
    }

    // Touch / click toggle
    toggle.addEventListener('click', function () {
      isOpen() ? closeMenu() : openMenu();
    });

    // Close after choosing a destination
    $$('a', panel).forEach(function (link) {
      link.addEventListener('click', closeMenu);
    });

    // Escape key
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && isOpen()) {
        closeMenu();
        toggle.focus();
      }
    });

    // Click outside the panel
    document.addEventListener('click', function (event) {
      if (!isOpen()) return;
      if (panel.contains(event.target) || toggle.contains(event.target)) return;
      closeMenu();
    });

    // Reset when resizing to the desktop breakpoint (lg = 1024px)
    window.addEventListener('resize', function () {
      if (window.innerWidth >= 1024 && isOpen()) closeMenu();
    });
  }

  /* ------------------------------------------------------------------------
     2. STICKY HEADER
     The header floats transparently over the hero, then gains the noir wash +
     hairline white border once the user scrolls past 40px.
     A single `.is-scrolled` class is toggled (rather than Tailwind utilities)
     so the state is styled in css/style.css and stays out of the compiled
     Tailwind output.
     ------------------------------------------------------------------------ */
  function initStickyHeader() {
    const header = $('#site-header');
    if (!header) return;

    let ticking = false;

    function update() {
      header.classList.toggle('is-scrolled', window.scrollY > 40);
      ticking = false;
    }

    window.addEventListener(
      'scroll',
      function () {
        if (ticking) return;
        ticking = true;
        window.requestAnimationFrame(update);
      },
      { passive: true }
    );

    update();
  }

  /* ------------------------------------------------------------------------
     3. SCROLL REVEAL
     Adds .mf-reveal at runtime (progressive enhancement) then reveals each
     element once as it enters the viewport. Falls back to showing everything
     immediately on old browsers or with reduced-motion enabled.
     ------------------------------------------------------------------------ */
  function initScrollReveal() {
    const targets = $$('[data-reveal]');
    if (!targets.length) return;

    if (prefersReducedMotion || !('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }

    targets.forEach(function (el) {
      el.classList.add('mf-reveal');
      const delay = el.getAttribute('data-reveal-delay');
      if (delay) el.style.transitionDelay = delay + 'ms';
    });

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     4. ACTIVE NAV LINK
     Marks the section currently in view as the current nav item.
     ------------------------------------------------------------------------ */
  function initActiveNav() {
    const links = $$('[data-nav-link]');
    if (!links.length || !('IntersectionObserver' in window)) return;

    const sections = links
      .map((link) => {
        const id = link.getAttribute('href');
        return id && id.charAt(0) === '#' ? $(id) : null;
      })
      .filter(Boolean);

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          links.forEach(function (link) {
            const match = link.getAttribute('href') === '#' + entry.target.id;
            if (match) {
              link.setAttribute('aria-current', 'true');
            } else {
              link.removeAttribute('aria-current');
            }
          });
        });
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

  /* ------------------------------------------------------------------------
     5. FOOTER YEAR
     ------------------------------------------------------------------------ */
  function initYear() {
    const el = $('#current-year');
    if (el) el.textContent = new Date().getFullYear();
  }

  /* ------------------------------------------------------------------------
     Boot
     ------------------------------------------------------------------------ */
  function init() {
    initMobileNav();
    initStickyHeader();
    initScrollReveal();
    initActiveNav();
    initYear();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
