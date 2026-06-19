(function () {
  const navToggle = document.getElementById("nav-toggle");
  const nav = document.getElementById("main-nav");
  if (navToggle && nav) {
    navToggle.addEventListener("click", function () {
      nav.classList.toggle("is-open");
    });
  }

  document.querySelectorAll(".js-search-form").forEach(function (form) {
    form.addEventListener("submit", function (event) {
      const input = form.querySelector("input[name='q']");
      if (!input || !input.value.trim()) {
        event.preventDefault();
        window.location.href = "./search.html";
      }
    });
  });

  const slider = document.querySelector(".hero-slider");
  if (slider) {
    const slides = Array.from(slider.querySelectorAll(".hero-slide"));
    const dots = Array.from(document.querySelectorAll(".hero-dots button"));
    let index = 0;
    const show = function (next) {
      index = (next + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("is-active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("is-active", i === index);
      });
    };
    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
      });
    });
    if (slides.length > 1) {
      setInterval(function () {
        show(index + 1);
      }, 5600);
    }
  }

  const filterInput = document.querySelector("[data-filter-input]");
  const yearSelect = document.querySelector("[data-year-filter]");
  const categorySelect = document.querySelector("[data-category-filter]");
  const filterCards = Array.from(document.querySelectorAll(".filter-card"));
  const noResult = document.querySelector(".no-result");

  const params = new URLSearchParams(window.location.search);
  const query = params.get("q");
  if (filterInput && query) {
    filterInput.value = query;
  }

  const applyFilters = function () {
    const keyword = filterInput ? filterInput.value.trim().toLowerCase() : "";
    const year = yearSelect ? yearSelect.value : "";
    const category = categorySelect ? categorySelect.value : "";
    let visible = 0;

    filterCards.forEach(function (card) {
      const text = [
        card.dataset.title,
        card.dataset.region,
        card.dataset.genre,
        card.dataset.year
      ].join(" ").toLowerCase();
      const matchedKeyword = !keyword || text.indexOf(keyword) !== -1;
      const matchedYear = !year || card.dataset.year === year;
      const matchedCategory = !category || card.dataset.category === category;
      const matched = matchedKeyword && matchedYear && matchedCategory;
      card.style.display = matched ? "" : "none";
      if (matched) {
        visible += 1;
      }
    });

    if (noResult) {
      noResult.classList.toggle("is-visible", visible === 0);
    }
  };

  [filterInput, yearSelect, categorySelect].forEach(function (control) {
    if (control) {
      control.addEventListener("input", applyFilters);
      control.addEventListener("change", applyFilters);
    }
  });

  if (filterCards.length) {
    applyFilters();
  }
})();
