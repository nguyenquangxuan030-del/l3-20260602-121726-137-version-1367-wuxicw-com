(() => {
  const menuButton = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');

  if (menuButton && mobileNav) {
    menuButton.addEventListener('click', () => {
      const open = mobileNav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.textContent = open ? '×' : '☰';
    });
  }

  const hero = document.querySelector('[data-hero]');
  if (hero) {
    const slides = Array.from(hero.querySelectorAll('.hero-slide'));
    const dots = Array.from(hero.querySelectorAll('.hero-dot'));
    const prev = hero.querySelector('.hero-arrow.prev');
    const next = hero.querySelector('.hero-arrow.next');
    let current = 0;
    let timer = null;

    const show = (index) => {
      if (!slides.length) {
        return;
      }
      current = (index + slides.length) % slides.length;
      slides.forEach((slide, slideIndex) => {
        slide.classList.toggle('active', slideIndex === current);
      });
      dots.forEach((dot, dotIndex) => {
        dot.classList.toggle('active', dotIndex === current);
      });
    };

    const start = () => {
      stop();
      timer = setInterval(() => show(current + 1), 5200);
    };

    const stop = () => {
      if (timer) {
        clearInterval(timer);
      }
    };

    prev?.addEventListener('click', () => {
      show(current - 1);
      start();
    });

    next?.addEventListener('click', () => {
      show(current + 1);
      start();
    });

    dots.forEach((dot, index) => {
      dot.addEventListener('click', () => {
        show(index);
        start();
      });
    });

    hero.addEventListener('mouseenter', stop);
    hero.addEventListener('mouseleave', start);
    start();
  }

  const filterRoot = document.querySelector('[data-filter-root]');
  if (filterRoot) {
    const searchInput = filterRoot.querySelector('[data-filter-search]');
    const yearSelect = filterRoot.querySelector('[data-filter-year]');
    const typeSelect = filterRoot.querySelector('[data-filter-type]');
    const resetButton = filterRoot.querySelector('[data-filter-reset]');
    const cards = Array.from(filterRoot.querySelectorAll('.movie-card'));

    const apply = () => {
      const query = (searchInput?.value || '').trim().toLowerCase();
      const year = yearSelect?.value || '';
      const type = typeSelect?.value || '';

      cards.forEach((card) => {
        const text = card.getAttribute('data-search') || '';
        const cardYear = card.getAttribute('data-year') || '';
        const cardType = card.getAttribute('data-type') || '';
        const matched = (!query || text.includes(query)) && (!year || cardYear === year) && (!type || cardType === type);
        card.style.display = matched ? '' : 'none';
      });
    };

    searchInput?.addEventListener('input', apply);
    yearSelect?.addEventListener('change', apply);
    typeSelect?.addEventListener('change', apply);
    resetButton?.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
      }
      if (yearSelect) {
        yearSelect.value = '';
      }
      if (typeSelect) {
        typeSelect.value = '';
      }
      apply();
    });
  }
})();
