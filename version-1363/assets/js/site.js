(function () {
  const menuButton = document.querySelector('[data-menu-toggle]');
  const nav = document.querySelector('[data-site-nav]');

  if (menuButton && nav) {
    menuButton.addEventListener('click', function () {
      nav.classList.toggle('open');
    });
  }

  const hero = document.querySelector('[data-hero]');

  if (hero) {
    const slides = Array.from(hero.querySelectorAll('[data-hero-slide]'));
    const thumbs = Array.from(hero.querySelectorAll('[data-hero-thumb]'));
    let current = 0;

    function showSlide(index) {
      current = (index + slides.length) % slides.length;
      slides.forEach(function (slide, slideIndex) {
        slide.classList.toggle('active', slideIndex === current);
      });
      thumbs.forEach(function (thumb, thumbIndex) {
        thumb.classList.toggle('active', thumbIndex === current);
      });
    }

    thumbs.forEach(function (thumb) {
      thumb.addEventListener('click', function () {
        showSlide(Number(thumb.dataset.heroThumb || 0));
      });
    });

    if (slides.length > 1) {
      setInterval(function () {
        showSlide(current + 1);
      }, 5200);
    }
  }

  const list = document.querySelector('[data-filter-list]');
  const searchInput = document.querySelector('[data-search-input]');
  const typeFilter = document.querySelector('[data-type-filter]');
  const yearFilter = document.querySelector('[data-year-filter]');

  function applyFilters() {
    if (!list) {
      return;
    }

    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const type = typeFilter ? typeFilter.value : 'all';
    const year = yearFilter ? yearFilter.value : 'all';
    const cards = Array.from(list.querySelectorAll('.movie-card'));

    cards.forEach(function (card) {
      const text = (card.dataset.search || '').toLowerCase();
      const cardType = card.dataset.type || '';
      const cardYear = Number(card.dataset.year || 0);
      const queryMatch = !query || text.indexOf(query) !== -1;
      const typeMatch = type === 'all' || cardType === type;
      let yearMatch = true;

      if (year !== 'all') {
        if (year === 'older') {
          yearMatch = cardYear < 2020;
        } else {
          yearMatch = cardYear === Number(year);
        }
      }

      card.classList.toggle('is-hidden', !(queryMatch && typeMatch && yearMatch));
    });
  }

  if (searchInput || typeFilter || yearFilter) {
    if (searchInput) {
      searchInput.addEventListener('input', applyFilters);
      const params = new URLSearchParams(window.location.search);
      const q = params.get('q');

      if (q) {
        searchInput.value = q;
      }
    }

    if (typeFilter) {
      typeFilter.addEventListener('change', applyFilters);
    }

    if (yearFilter) {
      yearFilter.addEventListener('change', applyFilters);
    }

    applyFilters();
  }
})();
