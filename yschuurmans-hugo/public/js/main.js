(function () {
  'use strict';

  function animateSkillBars() {
    var bars = document.querySelectorAll('.skillbar');
    if (!bars.length) return;

    var reveal = function (bar) {
      var pct = bar.getAttribute('data-percent');
      var fill = bar.querySelector('.skillbar-fill');
      if (fill && pct) {
        requestAnimationFrame(function () { fill.style.width = pct + '%'; });
      }
    };

    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries, observer) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) { reveal(entry.target); observer.unobserve(entry.target); }
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

  function initProjectCarousel() {
    var carouselEl = document.getElementById('projectCarousel');
    if (!carouselEl) return;

    var carousel = new bootstrap.Carousel(carouselEl, { ride: 'carousel', interval: 8000 });
    var ytPlayers = {};

    // Prev / next buttons (no Bootstrap data-attributes — driven entirely here)
    var prevBtn = carouselEl.querySelector('.js-carousel-prev');
    var nextBtn = carouselEl.querySelector('.js-carousel-next');
    if (prevBtn) prevBtn.addEventListener('click', function () { carousel.prev(); });
    if (nextBtn) nextBtn.addEventListener('click', function () { carousel.next(); });

    // Thumbnail buttons
    var thumbs = document.querySelectorAll('.project-thumb');
    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        carousel.to(parseInt(btn.getAttribute('data-slide-to'), 10));
      });
    });

    // Native video elements — pause carousel while playing, resume when paused/ended
    var nativeVideos = {};
    var items = Array.from(carouselEl.querySelectorAll('.carousel-item'));
    carouselEl.querySelectorAll('.js-local-video').forEach(function (vid) {
      var slideIndex = items.indexOf(vid.closest('.carousel-item'));
      nativeVideos[slideIndex] = vid;
      vid.addEventListener('play', function () { carousel.pause(); });
      vid.addEventListener('pause', function () { carousel.cycle(); });
      vid.addEventListener('ended', function () { carousel.cycle(); });
    });

    // Sync active thumbnail + pause media when navigating away from a slide
    carouselEl.addEventListener('slide.bs.carousel', function (event) {
      thumbs.forEach(function (t) { t.classList.remove('active'); });
      var match = document.querySelector('.project-thumb[data-slide-to="' + event.to + '"]');
      if (match) match.classList.add('active');

      var leavingYT = ytPlayers[event.from];
      if (leavingYT && typeof leavingYT.pauseVideo === 'function') {
        try { leavingYT.pauseVideo(); } catch (e) {}
      }

      var leavingVid = nativeVideos[event.from];
      if (leavingVid) {
        try { leavingVid.pause(); } catch (e) {}
      }
    });

    // YouTube IFrame API — pause carousel while video plays, resume when paused/ended
    var ytIframes = carouselEl.querySelectorAll('iframe[id^="yt-slide-"]');
    if (!ytIframes.length) return;

    function createYTPlayers() {
      ytIframes.forEach(function (iframe) {
        var slideIndex = items.indexOf(iframe.closest('.carousel-item'));

        ytPlayers[slideIndex] = new YT.Player(iframe.id, {
          events: {
            onStateChange: function (e) {
              if (e.data === YT.PlayerState.PLAYING) {
                carousel.pause();
              } else if (e.data === YT.PlayerState.PAUSED || e.data === YT.PlayerState.ENDED) {
                carousel.cycle();
              }
            }
          }
        });
      });
    }

    if (window.YT && window.YT.Player) {
      createYTPlayers();
    } else {
      var prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = function () {
        if (prev) prev();
        createYTPlayers();
      };
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        var tag = document.createElement('script');
        tag.src = 'https://www.youtube.com/iframe_api';
        document.head.appendChild(tag);
      }
    }
  }

  function initLightbox() {
    var carouselEl = document.getElementById('projectCarousel');
    if (!carouselEl) return;
    var lightboxEl = document.getElementById('carouselLightbox');
    if (!lightboxEl) return;
    var lightbox = new bootstrap.Modal(lightboxEl);
    var lightboxImg = document.getElementById('lightboxImg');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');

    var slides = Array.from(carouselEl.querySelectorAll('.carousel-item img'));
    var currentIndex = 0;

    function showAt(index) {
      currentIndex = (index + slides.length) % slides.length;
      lightboxImg.src = slides[currentIndex].src;
      lightboxImg.alt = slides[currentIndex].alt;
      var multiSlide = slides.length > 1;
      if (prevBtn) prevBtn.style.display = multiSlide ? '' : 'none';
      if (nextBtn) nextBtn.style.display = multiSlide ? '' : 'none';
    }

    carouselEl.addEventListener('click', function (e) {
      var img = e.target.closest('.carousel-item img');
      if (!img) return;
      showAt(slides.indexOf(img));
      lightbox.show();
    });

    if (prevBtn) prevBtn.addEventListener('click', function () { showAt(currentIndex - 1); });
    if (nextBtn) nextBtn.addEventListener('click', function () { showAt(currentIndex + 1); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      animateSkillBars();
      initProjectHover();
      initProjectCarousel();
      initLightbox();
    });
  } else {
    animateSkillBars();
    initProjectHover();
    initProjectCarousel();
    initLightbox();
  }
})();
