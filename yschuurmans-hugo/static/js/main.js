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

    if (window.__projectCarouselKeydownHandler) {
      document.removeEventListener('keydown', window.__projectCarouselKeydownHandler);
      window.__projectCarouselKeydownHandler = null;
    }

    if (!carouselEl) return;

    var carousel = new bootstrap.Carousel(carouselEl, { ride: 'carousel', interval: 8000 });
    var ytPlayers = {};
    var ytPlayerStates = {};
    var items = Array.from(carouselEl.querySelectorAll('.carousel-item'));
    var nativeVideos = {};
    var manualNavigationResetId = 0;
    var manualNavigationInFlight = false;

    function getActiveSlideIndex() {
      return items.findIndex(function (item) {
        return item.classList.contains('active');
      });
    }

    function isNativeVideoPlaying(video) {
      return !!video && !video.paused && !video.ended;
    }

    function isSlidePlaybackLocked(slideIndex) {
      var ytBufferingState = window.YT && window.YT.PlayerState ? window.YT.PlayerState.BUFFERING : 3;
      var ytPlayingState = window.YT && window.YT.PlayerState ? window.YT.PlayerState.PLAYING : 1;
      var ytState = ytPlayerStates[slideIndex];

      if (slideIndex < 0) return false;

      if (isNativeVideoPlaying(nativeVideos[slideIndex])) {
        return true;
      }

      return ytState === ytPlayingState || ytState === ytBufferingState;
    }

    function syncCarouselPlaybackLock() {
      if (isSlidePlaybackLocked(getActiveSlideIndex())) {
        carousel.pause();
      } else {
        carousel.cycle();
      }
    }

    function clearManualNavigationLock() {
      if (manualNavigationResetId) {
        window.clearTimeout(manualNavigationResetId);
        manualNavigationResetId = 0;
      }

      manualNavigationInFlight = false;
    }

    function runManualNavigation(callback) {
      clearManualNavigationLock();
      manualNavigationInFlight = true;
      callback();
      manualNavigationResetId = window.setTimeout(clearManualNavigationLock, 1200);
    }

    window.__projectCarouselKeydownHandler = function (event) {
      var modalOpen = document.querySelector('#carouselLightbox.show');
      var target = event.target;
      var canQueryTarget = target && typeof target.closest === 'function';
      var isEditable = target && (
        (canQueryTarget && target.closest('input, textarea, select, [contenteditable="true"]')) ||
        target.isContentEditable
      );

      if (modalOpen || isEditable) return;

      if (event.key === 'ArrowLeft') {
        event.preventDefault();
        runManualNavigation(function () {
          carousel.prev();
        });
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault();
        runManualNavigation(function () {
          carousel.next();
        });
      }
    };

    document.addEventListener('keydown', window.__projectCarouselKeydownHandler);

    // Prev / next buttons (no Bootstrap data-attributes — driven entirely here)
    var prevBtn = carouselEl.querySelector('.js-carousel-prev');
    var nextBtn = carouselEl.querySelector('.js-carousel-next');
    if (prevBtn) {
      prevBtn.addEventListener('click', function () {
        runManualNavigation(function () {
          carousel.prev();
        });
      });
    }
    if (nextBtn) {
      nextBtn.addEventListener('click', function () {
        runManualNavigation(function () {
          carousel.next();
        });
      });
    }

    // Thumbnail buttons
    var thumbs = document.querySelectorAll('.project-thumb');
    thumbs.forEach(function (btn) {
      btn.addEventListener('click', function () {
        runManualNavigation(function () {
          carousel.to(parseInt(btn.getAttribute('data-slide-to'), 10));
        });
      });
    });

    // Native video elements — pause carousel while playing, resume when paused/ended
    carouselEl.querySelectorAll('.js-local-video').forEach(function (vid) {
      var slideIndex = items.indexOf(vid.closest('.carousel-item'));
      nativeVideos[slideIndex] = vid;
      vid.addEventListener('play', syncCarouselPlaybackLock);
      vid.addEventListener('pause', syncCarouselPlaybackLock);
      vid.addEventListener('ended', syncCarouselPlaybackLock);
    });

    // Sync active thumbnail + pause media when navigating away from a slide
    carouselEl.addEventListener('slide.bs.carousel', function (event) {
      if (!manualNavigationInFlight && isSlidePlaybackLocked(event.from)) {
        event.preventDefault();
        syncCarouselPlaybackLock();
        return;
      }

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

    carouselEl.addEventListener('slid.bs.carousel', function () {
      clearManualNavigationLock();
      syncCarouselPlaybackLock();
    });

    // YouTube IFrame API — pause carousel while video plays, resume when paused/ended
    var ytIframes = carouselEl.querySelectorAll('iframe[id^="yt-slide-"]');
    if (!ytIframes.length) {
      syncCarouselPlaybackLock();
      return;
    }

    function createYTPlayers() {
      ytIframes.forEach(function (iframe) {
        var slideIndex = items.indexOf(iframe.closest('.carousel-item'));

        ytPlayers[slideIndex] = new YT.Player(iframe.id, {
          events: {
            onStateChange: function (e) {
              ytPlayerStates[slideIndex] = e.data;
              syncCarouselPlaybackLock();
            }
          }
        });
      });

      syncCarouselPlaybackLock();
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
    var managedLightboxes = document.querySelectorAll('#carouselLightbox[data-managed-lightbox="true"]');

    if (!carouselEl) {
      managedLightboxes.forEach(function (staleLightbox) {
        var staleInstance = bootstrap.Modal.getInstance(staleLightbox);
        if (staleInstance) staleInstance.dispose();
        staleLightbox.remove();
      });

      if (managedLightboxes.length) {
        document.querySelectorAll('.modal-backdrop').forEach(function (backdrop) {
          backdrop.remove();
        });
        document.body.classList.remove('modal-open');
        document.body.style.removeProperty('padding-right');
      }

      return;
    }

    var pageRoot = carouselEl.closest('.project-detail') || document;
    var lightboxEl = pageRoot.querySelector('#carouselLightbox') || document.querySelector('#carouselLightbox[data-managed-lightbox="true"]');
    if (!lightboxEl) return;

    managedLightboxes.forEach(function (staleLightbox) {
      if (staleLightbox === lightboxEl) return;

      var staleInstance = bootstrap.Modal.getInstance(staleLightbox);
      if (staleInstance) staleInstance.dispose();
      staleLightbox.remove();
    });

    lightboxEl.setAttribute('data-managed-lightbox', 'true');
    if (lightboxEl.parentNode !== document.body) {
      document.body.appendChild(lightboxEl);
    }

    var lightbox = bootstrap.Modal.getOrCreateInstance(lightboxEl);
    var lightboxStage = document.getElementById('lightboxStage');
    var lightboxImg = document.getElementById('lightboxImg');
    var lightboxEmbed = document.getElementById('lightboxEmbed');
    var lightboxIframe = document.getElementById('lightboxIframe');
    var lightboxVideo = document.getElementById('lightboxVideo');
    var prevBtn = document.getElementById('lightboxPrev');
    var nextBtn = document.getElementById('lightboxNext');
    var slides = Array.from(carouselEl.querySelectorAll('.carousel-item')).map(function (item) {
      var type = item.getAttribute('data-lightbox-type');
      var src = item.getAttribute('data-lightbox-src');

      if (!type || !src) return null;

      return {
        element: item,
        type: type,
        src: src,
        title: item.getAttribute('data-lightbox-title') || '',
        mime: item.getAttribute('data-lightbox-mime') || ''
      };
    }).filter(Boolean);
    var currentIndex = 0;
    var transitionToken = 0;
    var fadeTimeoutId = 0;

    if (!slides.length || !lightboxImg || !lightboxStage || !lightboxEmbed || !lightboxIframe || !lightboxVideo) return;

    function updateControls() {
      var multiSlide = slides.length > 1;
      if (prevBtn) prevBtn.style.display = multiSlide ? '' : 'none';
      if (nextBtn) nextBtn.style.display = multiSlide ? '' : 'none';
    }

    function stopLightboxMedia() {
      lightboxImg.hidden = true;

      lightboxEmbed.hidden = true;
      lightboxIframe.setAttribute('src', 'about:blank');
      lightboxIframe.setAttribute('title', '');

      lightboxVideo.pause();
      lightboxVideo.removeAttribute('src');
      lightboxVideo.hidden = true;
      lightboxVideo.load();
    }

    function renderLightboxMedia(slide) {
      stopLightboxMedia();

      if (slide.type === 'youtube') {
        lightboxEmbed.hidden = false;
        lightboxIframe.setAttribute('title', slide.title || 'YouTube video');
        lightboxIframe.setAttribute('src', slide.src);
        return;
      }

      if (slide.type === 'video') {
        lightboxVideo.hidden = false;
        lightboxVideo.src = slide.src;
        if (slide.mime) {
          lightboxVideo.setAttribute('type', slide.mime);
        } else {
          lightboxVideo.removeAttribute('type');
        }
        lightboxVideo.load();
        return;
      }

      lightboxImg.hidden = false;
      lightboxImg.src = slide.src;
      lightboxImg.alt = slide.title || '';
    }

    function prepareMedia(slide, callback) {
      if (slide.type !== 'image') {
        callback();
        return;
      }

      var preload = new Image();
      var settled = false;

      function finish() {
        if (settled) return;
        settled = true;
        callback();
      }

      preload.addEventListener('load', finish, { once: true });
      preload.addEventListener('error', finish, { once: true });
      preload.src = slide.src;

      if (preload.complete) {
        finish();
      }
    }

    function showAt(index, options) {
      currentIndex = (index + slides.length) % slides.length;
      updateControls();

      var nextSlide = slides[currentIndex];
      var animate = Boolean(options && options.animate && lightboxEl.classList.contains('show'));

      window.clearTimeout(fadeTimeoutId);

      if (!animate) {
        transitionToken += 1;
        lightboxStage.classList.remove('is-fading');
        renderLightboxMedia(nextSlide);
        return;
      }

      var token = ++transitionToken;

      function runTransition() {
        if (token !== transitionToken) return;

        lightboxStage.classList.add('is-fading');
        fadeTimeoutId = window.setTimeout(function () {
          if (token !== transitionToken) return;

          renderLightboxMedia(nextSlide);
          requestAnimationFrame(function () {
            if (token !== transitionToken) return;
            lightboxStage.classList.remove('is-fading');
          });
        }, 180);
      }

      prepareMedia(nextSlide, runTransition);
    }

    carouselEl.addEventListener('click', function (e) {
      if (e.target.closest('.carousel-control-prev, .carousel-control-next')) return;

      var carouselItem = e.target.closest('.carousel-item');
      if (!carouselItem) return;

      var slideIndex = slides.findIndex(function (slide) {
        return slide.element === carouselItem;
      });

      if (slideIndex === -1) return;

      showAt(slideIndex, { animate: false });
      lightbox.show();
    });

    if (prevBtn) {
      prevBtn.addEventListener('click', function (event) {
        event.preventDefault();
        showAt(currentIndex - 1, { animate: true });
      });
    }

    if (nextBtn) {
      nextBtn.addEventListener('click', function (event) {
        event.preventDefault();
        showAt(currentIndex + 1, { animate: true });
      });
    }

    lightboxEl.addEventListener('keydown', function (event) {
      if (!lightboxEl.classList.contains('show')) return;

      if (event.key === 'ArrowLeft' && slides.length > 1) {
        event.preventDefault();
        showAt(currentIndex - 1, { animate: true });
      }

      if (event.key === 'ArrowRight' && slides.length > 1) {
        event.preventDefault();
        showAt(currentIndex + 1, { animate: true });
      }
    });

    lightboxEl.addEventListener('shown.bs.modal', function () {
      updateControls();
      lightboxEl.focus();
    });

    lightboxEl.addEventListener('hidden.bs.modal', function () {
      transitionToken += 1;
      window.clearTimeout(fadeTimeoutId);
      lightboxStage.classList.remove('is-fading');
      stopLightboxMedia();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function () {
      initClientNavigation();
    });
  } else {
    initClientNavigation();
  }
})();
