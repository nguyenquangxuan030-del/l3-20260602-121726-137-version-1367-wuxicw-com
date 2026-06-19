(function () {
    var menuButton = document.querySelector('[data-menu-button]');
    var mobileNav = document.querySelector('[data-mobile-nav]');
    if (menuButton && mobileNav) {
        menuButton.addEventListener('click', function () {
            mobileNav.classList.toggle('is-open');
        });
    }

    document.querySelectorAll('img').forEach(function (img) {
        img.addEventListener('error', function () {
            var holder = img.closest('.poster, .rank-cover, .detail-poster, .hero-slide');
            if (holder) {
                holder.classList.add('is-fallback');
            }
        });
    });

    var slider = document.querySelector('[data-hero-slider]');
    if (slider) {
        var slides = Array.prototype.slice.call(slider.querySelectorAll('.hero-slide'));
        var dots = Array.prototype.slice.call(document.querySelectorAll('[data-slider-dot]'));
        var active = 0;
        var show = function (index) {
            active = (index + slides.length) % slides.length;
            slides.forEach(function (slide, i) {
                slide.classList.toggle('is-active', i === active);
            });
            dots.forEach(function (dot, i) {
                dot.classList.toggle('is-active', i === active);
            });
        };
        dots.forEach(function (dot, index) {
            dot.addEventListener('click', function () {
                show(index);
            });
        });
        if (slides.length > 1) {
            window.setInterval(function () {
                show(active + 1);
            }, 5200);
        }
    }

    var panel = document.querySelector('[data-filter-panel]');
    if (panel) {
        var input = panel.querySelector('[data-filter-input]');
        var year = panel.querySelector('[data-filter-year]');
        var category = panel.querySelector('[data-filter-category]');
        var reset = panel.querySelector('[data-filter-reset]');
        var items = Array.prototype.slice.call(document.querySelectorAll('.movie-card, .rank-item'));
        var empty = document.querySelector('[data-empty-tip]');
        var params = new URLSearchParams(window.location.search);
        if (input && params.get('q')) {
            input.value = params.get('q');
        }
        var apply = function () {
            var keyword = input ? input.value.trim().toLowerCase() : '';
            var selectedYear = year ? year.value : '';
            var selectedCategory = category ? category.value : '';
            var visible = 0;
            items.forEach(function (item) {
                var haystack = [
                    item.dataset.title,
                    item.dataset.region,
                    item.dataset.genre,
                    item.dataset.year
                ].join(' ').toLowerCase();
                var ok = true;
                if (keyword && haystack.indexOf(keyword) === -1) {
                    ok = false;
                }
                if (selectedYear && item.dataset.year !== selectedYear) {
                    ok = false;
                }
                if (selectedCategory && item.dataset.category !== selectedCategory) {
                    ok = false;
                }
                item.classList.toggle('is-hidden', !ok);
                if (ok) {
                    visible += 1;
                }
            });
            if (empty) {
                empty.classList.toggle('is-visible', visible === 0);
            }
        };
        [input, year, category].forEach(function (field) {
            if (field) {
                field.addEventListener('input', apply);
                field.addEventListener('change', apply);
            }
        });
        if (reset) {
            reset.addEventListener('click', function () {
                if (input) {
                    input.value = '';
                }
                if (year) {
                    year.value = '';
                }
                if (category) {
                    category.value = '';
                }
                apply();
            });
        }
        apply();
    }
})();
