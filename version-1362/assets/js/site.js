(function () {
  const menuButton = document.querySelector('.menu-button');
  const mainNav = document.querySelector('.main-nav');
  if (menuButton && mainNav) {
    menuButton.addEventListener('click', function () {
      mainNav.classList.toggle('is-open');
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const next = hero.querySelector('.hero-control.next');
    const prev = hero.querySelector('.hero-control.prev');
    let index = 0;
    let timer = null;

    function show(nextIndex) {
      index = (nextIndex + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle('is-active', i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle('is-active', i === index);
      });
    }

    function restart() {
      if (timer) {
        clearInterval(timer);
      }
      timer = setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    if (next) {
      next.addEventListener('click', function () {
        show(index + 1);
        restart();
      });
    }

    if (prev) {
      prev.addEventListener('click', function () {
        show(index - 1);
        restart();
      });
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener('click', function () {
        show(i);
        restart();
      });
    });

    restart();
  }

  const searchInput = document.querySelector('.search-input');
  if (searchInput) {
    const list = document.querySelector('.searchable-list') || document;
    const cards = Array.from(list.querySelectorAll('.movie-card'));
    searchInput.addEventListener('input', function () {
      const value = searchInput.value.trim().toLowerCase();
      cards.forEach(function (card) {
        const haystack = ((card.dataset.title || '') + ' ' + (card.dataset.meta || '') + ' ' + card.textContent).toLowerCase();
        card.classList.toggle('is-filtered-out', value && !haystack.includes(value));
      });
    });
  }
})();

function initMoviePlayer(playUrl) {
  const video = document.querySelector('[data-player]');
  const cover = document.querySelector('[data-play-cover]');
  let loaded = false;

  function loadAndPlay() {
    if (!video || !playUrl) {
      return;
    }

    if (cover) {
      cover.classList.add('is-hidden');
    }

    if (!loaded) {
      if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = playUrl;
      } else if (window.Hls && Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true });
        hls.loadSource(playUrl);
        hls.attachMedia(video);
        video._hls = hls;
      } else {
        video.src = playUrl;
      }
      loaded = true;
    }

    const attempt = video.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', loadAndPlay);
  }

  if (video) {
    video.addEventListener('click', function () {
      if (video.paused) {
        loadAndPlay();
      }
    });
  }
}
