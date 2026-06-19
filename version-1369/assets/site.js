(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-nav]');
  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('is-open');
    });
  }

  const slides = Array.from(document.querySelectorAll('[data-hero-slide]'));
  const dots = Array.from(document.querySelectorAll('[data-hero-dot]'));
  if (slides.length) {
    let current = 0;
    const show = function (index) {
      current = index % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === current);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === current);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
      });
    });
    show(0);
    setInterval(function () {
      show(current + 1);
    }, 5200);
  }

  const filterPanels = Array.from(document.querySelectorAll('[data-filter-panel]'));
  filterPanels.forEach(function (panel) {
    const scope = document.querySelector(panel.getAttribute('data-filter-panel')) || document;
    const cards = Array.from(scope.querySelectorAll('[data-title]'));
    const input = panel.querySelector('[data-filter-keyword]');
    const year = panel.querySelector('[data-filter-year]');
    const region = panel.querySelector('[data-filter-region]');
    const empty = document.querySelector(panel.getAttribute('data-empty-target'));
    const apply = function () {
      const keyword = (input && input.value ? input.value : '').trim().toLowerCase();
      const yearValue = year && year.value ? year.value : '';
      const regionValue = region && region.value ? region.value : '';
      let visible = 0;
      cards.forEach(function (card) {
        const haystack = [
          card.getAttribute('data-title') || '',
          card.getAttribute('data-genre') || '',
          card.getAttribute('data-region') || '',
          card.textContent || ''
        ].join(' ').toLowerCase();
        const okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
        const okYear = !yearValue || (card.getAttribute('data-year') || '').indexOf(yearValue) !== -1;
        const okRegion = !regionValue || (card.getAttribute('data-region') || '').indexOf(regionValue) !== -1;
        const ok = okKeyword && okYear && okRegion;
        card.classList.toggle('is-filter-hidden', !ok);
        if (ok) {
          visible += 1;
        }
      });
      if (empty) {
        empty.classList.toggle('is-open', visible === 0);
      }
    };
    [input, year, region].forEach(function (el) {
      if (el) {
        el.addEventListener('input', apply);
        el.addEventListener('change', apply);
      }
    });
  });

  const globalSearch = document.querySelector('[data-global-search]');
  const globalType = document.querySelector('[data-global-type]');
  const globalButton = document.querySelector('[data-global-button]');
  const globalResults = document.querySelector('[data-global-results]');
  const renderGlobalResults = function () {
    if (!globalSearch || !globalResults || !Array.isArray(window.MOVIE_SEARCH_INDEX)) {
      return;
    }
    const keyword = globalSearch.value.trim().toLowerCase();
    const type = globalType && globalType.value ? globalType.value : '';
    if (!keyword && !type) {
      globalResults.classList.remove('is-open');
      globalResults.innerHTML = '';
      return;
    }
    const hits = window.MOVIE_SEARCH_INDEX.filter(function (item) {
      const text = [item.title, item.genre, item.region, item.tags, item.line, item.year].join(' ').toLowerCase();
      const okKeyword = !keyword || text.indexOf(keyword) !== -1;
      const okType = !type || item.type === type;
      return okKeyword && okType;
    }).slice(0, 12);
    globalResults.innerHTML = hits.map(function (item) {
      return '<a class="search-result-card" href="' + item.url + '">' +
        '<img src="' + item.image + '" alt="' + item.title.replace(/"/g, '&quot;') + '">' +
        '<span><strong>' + item.title + '</strong><br><small>' + item.year + ' · ' + item.region + '</small><br><small>' + item.line + '</small></span>' +
        '</a>';
    }).join('');
    globalResults.classList.toggle('is-open', hits.length > 0);
  };
  if (globalSearch) {
    globalSearch.addEventListener('input', renderGlobalResults);
  }
  if (globalType) {
    globalType.addEventListener('change', renderGlobalResults);
  }
  if (globalButton) {
    globalButton.addEventListener('click', renderGlobalResults);
  }

  const player = document.querySelector('[data-player]');
  if (player) {
    const video = player.querySelector('video');
    const cover = player.querySelector('[data-player-cover]');
    const stream = player.getAttribute('data-video');
    let ready = false;
    const start = function () {
      if (!video || !stream) {
        return;
      }
      if (!ready) {
        if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = stream;
        } else if (window.Hls && window.Hls.isSupported()) {
          const hls = new window.Hls();
          hls.loadSource(stream);
          hls.attachMedia(video);
        } else {
          video.src = stream;
        }
        ready = true;
      }
      if (cover) {
        cover.classList.add('is-hidden');
      }
      video.controls = true;
      const playPromise = video.play();
      if (playPromise && typeof playPromise.catch === 'function') {
        playPromise.catch(function () {});
      }
    };
    if (cover) {
      cover.addEventListener('click', start);
    }
    video.addEventListener('click', function () {
      if (!ready || video.paused) {
        start();
      } else {
        video.pause();
      }
    });
  }
})();
