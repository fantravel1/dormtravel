/* ============================================
   DormTravel.com - Interactive JavaScript
   Mobile-first, performance-optimized
   ============================================ */

(function () {
  'use strict';

  // ---------- DOM Ready ----------
  document.addEventListener('DOMContentLoaded', init);

  function init() {
    initNav();
    initScrollAnimations();
    initFAQ();
    initCountUp();
    initSmoothScroll();
    initVibeScroll();
  }

  // ---------- Navigation ----------
  function initNav() {
    const nav = document.querySelector('.nav');
    const toggle = document.querySelector('.nav-toggle');
    const mobileMenu = document.querySelector('.nav-mobile');

    if (!nav) return;

    // Scroll effect
    let lastScroll = 0;
    const scrollThreshold = 50;

    function handleScroll() {
      const currentScroll = window.pageYOffset;

      if (currentScroll > scrollThreshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }

      lastScroll = currentScroll;
    }

    window.addEventListener('scroll', throttle(handleScroll, 100), { passive: true });

    // Mobile toggle
    if (toggle && mobileMenu) {
      toggle.addEventListener('click', function () {
        toggle.classList.toggle('active');
        mobileMenu.classList.toggle('open');
        document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
      });

      // Close on link click
      mobileMenu.querySelectorAll('.nav-mobile-link').forEach(function (link) {
        link.addEventListener('click', function () {
          toggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        });
      });

      // Close on escape
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
          toggle.classList.remove('active');
          mobileMenu.classList.remove('open');
          document.body.style.overflow = '';
        }
      });
    }
  }

  // ---------- Scroll Animations (IntersectionObserver) ----------
  function initScrollAnimations() {
    var animatedElements = document.querySelectorAll('.fade-in, .slide-left, .slide-right');

    if (!animatedElements.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              observer.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.1,
          rootMargin: '0px 0px -50px 0px',
        }
      );

      animatedElements.forEach(function (el) {
        observer.observe(el);
      });
    } else {
      // Fallback: just show everything
      animatedElements.forEach(function (el) {
        el.classList.add('visible');
      });
    }
  }

  // ---------- FAQ Accordion ----------
  function initFAQ() {
    var faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(function (item) {
      var question = item.querySelector('.faq-question');
      if (!question) return;

      question.addEventListener('click', function () {
        var isOpen = item.classList.contains('open');

        // Close all others
        faqItems.forEach(function (otherItem) {
          otherItem.classList.remove('open');
        });

        // Toggle current
        if (!isOpen) {
          item.classList.add('open');
        }
      });
    });
  }

  // ---------- Count Up Animation ----------
  function initCountUp() {
    var counters = document.querySelectorAll('[data-count]');

    if (!counters.length) return;

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              animateCounter(entry.target);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.5 }
      );

      counters.forEach(function (counter) {
        observer.observe(counter);
      });
    } else {
      counters.forEach(animateCounter);
    }
  }

  function animateCounter(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1500;
    var startTime = null;

    function step(timestamp) {
      if (!startTime) startTime = timestamp;
      var progress = Math.min((timestamp - startTime) / duration, 1);
      var eased = easeOutCubic(progress);
      var current = Math.floor(eased * target);
      el.textContent = formatNumber(current) + suffix;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = formatNumber(target) + suffix;
      }
    }

    requestAnimationFrame(step);
  }

  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // ---------- Smooth Scroll for Anchor Links ----------
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var href = this.getAttribute('href');
        if (href === '#') return;

        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });
  }

  // ---------- Vibe Scroll Indicators ----------
  function initVibeScroll() {
    var scrollContainers = document.querySelectorAll('.vibes-scroll');

    scrollContainers.forEach(function (container) {
      // Add touch-friendly swipe hint
      var hasScrolled = false;

      container.addEventListener('scroll', function () {
        if (!hasScrolled) {
          hasScrolled = true;
        }
      }, { passive: true });
    });
  }

  // ---------- Utility: Throttle ----------
  function throttle(fn, wait) {
    var lastTime = 0;
    return function () {
      var now = Date.now();
      if (now - lastTime >= wait) {
        lastTime = now;
        fn.apply(this, arguments);
      }
    };
  }
})();
