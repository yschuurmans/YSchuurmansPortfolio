(function () {
  'use strict';

  function animateSkillBars() {
    var bars = document.querySelectorAll('.skillbar');
    if (!bars.length) return;

    var reveal = function (bar) {
      var pct = bar.getAttribute('data-percent');
      var fill = bar.querySelector('.skillbar-fill');
      if (fill && pct) {
        requestAnimationFrame(function () {
          fill.style.width = pct + '%';
        });
      }
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            reveal(entry.target);
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      bars.forEach(function (bar) { io.observe(bar); });
    } else {
      bars.forEach(reveal);
    }
  }

  function initProjectHover() {
    document.querySelectorAll('.ZoomBlock').forEach(function (el) {
      el.addEventListener('mouseenter', function () { el.classList.add('Zoomed'); });
      el.addEventListener('mouseleave', function () { el.classList.remove('Zoomed'); });
    });
  }

  function initProjectCarouselThumbs() {
    var carousel = document.getElementById('projectCarousel');
    if (!carousel) return;
    var thumbs = document.querySelectorAll('.project-thumb');
    if (!thumbs.length) return;
    carousel.addEventListener('slide.bs.carousel', function (event) {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      var match = document.querySelector('.project-thumb[data-bs-slide-to="' + event.to + '"]');
      if (match) match.classList.add('active');
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      animateSkillBars();
      initProjectHover();
      initProjectCarouselThumbs();
    });
  } else {
    animateSkillBars();
    initProjectHover();
    initProjectCarouselThumbs();
  }
})();
