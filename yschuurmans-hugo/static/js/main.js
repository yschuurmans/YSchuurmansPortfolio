(function () {
  'use strict';

  function normalizePath(pathname) {
    if (!pathname) return '/';
    return pathname.length > 1 ? pathname.replace(/\/+$/, '') : pathname;
  }

  function shouldDisableHeroTransition(currentUrl, targetUrl) {
    var currentPath = normalizePath(currentUrl.pathname);
    var targetPath = normalizePath(targetUrl.pathname);

    return (currentPath === '/' && targetPath === '/projects') ||
      (currentPath === '/projects' && targetPath === '/');
  }

  function updateActiveNav(url) {
    var pathname = normalizePath(url.pathname);

    document.querySelectorAll('#mainNavbar .nav-link').forEach(function (link) {
      var linkPath = normalizePath(new URL(link.href, window.location.origin).pathname);
      var isProjects = linkPath === '/projects' && pathname.indexOf('/projects') === 0;
      var isMatch = isProjects || linkPath === pathname;

      link.classList.toggle('active', isMatch);
      link.setAttribute('aria-current', isMatch ? 'page' : 'false');
    });
  }

  function closeNavbar() {
    var navbarEl = document.getElementById('mainNavbar');
    if (!navbarEl || !window.bootstrap || !bootstrap.Collapse) return;
    var collapse = bootstrap.Collapse.getInstance(navbarEl);
    if (collapse) collapse.hide();
  }

  function enhancePage() {
    animateSkillBars();
    initProjectHover();
    initProjectCarousel();
    initLightbox();
  }

  function swapPageContent(nextDocument) {
    var currentHero = document.querySelector('.site-hero-shell');
    var currentMain = document.querySelector('main[data-page-main]');
    var nextHero = nextDocument.querySelector('.site-hero-shell');
    var nextMain = nextDocument.querySelector('main[data-page-main]');

    if (!currentHero || !currentMain || !nextHero || !nextMain) {
      return false;
    }

    currentHero.replaceWith(nextHero);
    currentMain.replaceWith(nextMain);
    document.title = nextDocument.title;
    if (nextDocument.documentElement.lang) {
      document.documentElement.lang = nextDocument.documentElement.lang;
    }

    return true;
  }

  function fetchPage(url) {
    return window.fetch(url.href, {
      headers: {
        'X-Requested-With': 'portfolio-nav'
      }
    }).then(function (response) {
      if (!response.ok) {
        throw new Error('Navigation failed with status ' + response.status);
      }

      return response.text();
    }).then(function (html) {
      return new DOMParser().parseFromString(html, 'text/html');
    });
  }

  function runSwapTransition(callback, options) {
    var root = document.documentElement;
    var disableHeroTransition = options && options.disableHeroTransition;

    if (disableHeroTransition) {
      root.classList.add('disable-hero-transition');
    }

    if (document.startViewTransition) {
      return document.startViewTransition(function () {
        callback();
      }).finished.finally(function () {
        root.classList.remove('disable-hero-transition');
      });
    }

    callback();
    root.classList.remove('disable-hero-transition');
    return Promise.resolve();
  }

  function restoreScroll(position) {
    window.scrollTo(position && typeof position.x === 'number' ? position.x : 0,
      position && typeof position.y === 'number' ? position.y : 0);
  }

  function initClientNavigation() {
    var inflightRequest = 0;
    var currentPageUrl = new URL(window.location.href);

    if (!window.fetch || !window.DOMParser || !window.history || !history.pushState) {
      updateActiveNav(new URL(window.location.href));
      enhancePage();
      return;
    }

    history.replaceState({
      url: window.location.href,
      scroll: { x: window.scrollX, y: window.scrollY }
    }, '', window.location.href);

    function navigateTo(url, options) {
      var requestId = ++inflightRequest;
      var targetUrl = new URL(url, window.location.href);
      var previousUrl = new URL(currentPageUrl.href);
      var replace = options && options.replace;
      var restorePosition = options && options.restoreScroll;

      return fetchPage(targetUrl).then(function (nextDocument) {
        if (requestId !== inflightRequest) {
          return;
        }

        return runSwapTransition(function () {
          if (!swapPageContent(nextDocument)) {
            window.location.href = targetUrl.href;
            return;
          }

          if (replace) {
            history.replaceState({ url: targetUrl.href, scroll: restorePosition || { x: 0, y: 0 } }, '', targetUrl.href);
          } else {
            history.replaceState({ url: window.location.href, scroll: { x: window.scrollX, y: window.scrollY } }, '', window.location.href);
            history.pushState({ url: targetUrl.href, scroll: restorePosition || { x: 0, y: 0 } }, '', targetUrl.href);
          }

          updateActiveNav(targetUrl);
          closeNavbar();
          enhancePage();
          restoreScroll(restorePosition || { x: 0, y: 0 });
          currentPageUrl = new URL(targetUrl.href);
        }, {
          disableHeroTransition: shouldDisableHeroTransition(previousUrl, targetUrl)
        });
      }).catch(function () {
        window.location.href = targetUrl.href;
      });
    }

    document.addEventListener('click', function (event) {
      var link;
      var href;
      var url;

      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
        return;
      }

      link = event.target.closest('a[href]');
      if (!link || link.target === '_blank' || link.hasAttribute('download') || link.hasAttribute('data-no-spa')) {
        return;
      }

      href = link.getAttribute('href');
      if (!href || href.charAt(0) === '#' || /^(mailto:|tel:|javascript:)/i.test(href)) {
        return;
      }

      try {
        url = new URL(link.href, window.location.href);
      } catch (error) {
        return;
      }

      if (url.origin !== window.location.origin) {
        return;
      }

      if (url.pathname === window.location.pathname && url.search === window.location.search) {
        if (url.hash) {
          return;
        }
        event.preventDefault();
        return;
      }

      event.preventDefault();
      navigateTo(url.href, { restoreScroll: { x: 0, y: 0 } });
    });

    window.addEventListener('popstate', function (event) {
      var state = event.state || {};
      navigateTo(window.location.href, {
        replace: true,
        restoreScroll: state.scroll || { x: 0, y: 0 }
      });
    });

    updateActiveNav(new URL(window.location.href));
    enhancePage();
  }

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
      initClientNavigation();
    });
  } else {
    initClientNavigation();
  }
})();
