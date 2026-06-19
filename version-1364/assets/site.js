(function () {
  function qs(selector, root) {
    return (root || document).querySelector(selector);
  }

  function qsa(selector, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(selector));
  }

  var menuButton = qs('[data-menu-button]');
  var mobileMenu = qs('[data-mobile-menu]');
  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      mobileMenu.classList.toggle('open');
    });
  }

  var slides = qsa('[data-hero-slide]');
  var dots = qsa('[data-hero-dot]');
  if (slides.length > 0) {
    var current = 0;
    var showSlide = function (index) {
      current = index % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach(function (dot, dotIndex) {
        dot.classList.toggle('active', dotIndex === current);
      });
    };
    dots.forEach(function (dot, dotIndex) {
      dot.addEventListener('click', function () {
        showSlide(dotIndex);
      });
    });
    showSlide(0);
    window.setInterval(function () {
      showSlide(current + 1);
    }, 5600);
  }

  qsa('[data-video-source]').forEach(function (panel) {
    var video = qs('video', panel);
    var button = qs('[data-play-button]', panel);
    if (!video || !button) {
      return;
    }
    var source = video.getAttribute('data-src');
    var attached = false;
    var attachSource = function () {
      if (attached || !source) {
        return;
      }
      attached = true;
      if (window.Hls && window.Hls.isSupported()) {
        var hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = source;
      }
    };
    var startPlay = function () {
      attachSource();
      panel.classList.add('is-playing');
      var playResult = video.play();
      if (playResult && typeof playResult.catch === 'function') {
        playResult.catch(function () {
          panel.classList.remove('is-playing');
        });
      }
    };
    button.addEventListener('click', startPlay);
    video.addEventListener('click', function () {
      if (video.paused) {
        startPlay();
      }
    });
  });

  var searchForm = qs('[data-search-form]');
  var searchInput = qs('[data-search-input]');
  var searchResults = qs('[data-search-results]');
  var searchStatus = qs('[data-search-status]');
  if (searchForm && searchInput && searchResults && Array.isArray(window.MovieSearchData)) {
    var renderResults = function (items, keyword) {
      searchResults.innerHTML = '';
      items.slice(0, 120).forEach(function (item) {
        var article = document.createElement('article');
        article.className = 'movie-card';
        article.innerHTML = [
          '<a class="movie-cover" href="' + item.url + '">',
          '<img src="' + item.image + '" alt="' + item.title + '海报" loading="lazy">',
          '<span class="cover-year">' + item.year + '</span>',
          '<span class="cover-score">' + item.score + '</span>',
          '</a>',
          '<div class="movie-info">',
          '<h3><a href="' + item.url + '">' + item.title + '</a></h3>',
          '<p class="movie-meta">' + item.region + ' · ' + item.type + ' · ' + item.genre + '</p>',
          '<p class="movie-desc">' + item.desc + '</p>',
          '</div>'
        ].join('');
        searchResults.appendChild(article);
      });
      var message = keyword ? '找到 ' + items.length + ' 条相关影片' : '输入片名、地区、类型或标签开始搜索';
      searchStatus.textContent = message;
    };
    var applySearch = function () {
      var keyword = searchInput.value.trim().toLowerCase();
      if (!keyword) {
        renderResults(window.MovieSearchData.slice(0, 24), '');
        return;
      }
      var items = window.MovieSearchData.filter(function (item) {
        return item.text.indexOf(keyword) !== -1;
      });
      renderResults(items, keyword);
    };
    searchForm.addEventListener('submit', function (event) {
      event.preventDefault();
      applySearch();
    });
    searchInput.addEventListener('input', applySearch);
    var params = new URLSearchParams(window.location.search);
    var q = params.get('q');
    if (q) {
      searchInput.value = q;
    }
    applySearch();
  }
})();
