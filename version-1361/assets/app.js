(function () {
    var menuButton = document.querySelector('[data-menu-toggle]');
    var mobileMenu = document.querySelector('[data-mobile-menu]');

    if (menuButton && mobileMenu) {
        menuButton.addEventListener('click', function () {
            mobileMenu.classList.toggle('is-open');
        });
    }

    var hero = document.querySelector('[data-hero]');

    if (hero) {
        var slides = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-slide]'));
        var dots = Array.prototype.slice.call(hero.querySelectorAll('[data-hero-dot]'));
        var prev = hero.querySelector('[data-hero-prev]');
        var next = hero.querySelector('[data-hero-next]');
        var current = 0;
        var timer = null;

        var showSlide = function (index) {
            if (!slides.length) {
                return;
            }

            current = (index + slides.length) % slides.length;

            slides.forEach(function (slide, slideIndex) {
                slide.classList.toggle('is-active', slideIndex === current);
            });

            dots.forEach(function (dot, dotIndex) {
                dot.classList.toggle('is-active', dotIndex === current);
            });
        };

        var startTimer = function () {
            timer = window.setInterval(function () {
                showSlide(current + 1);
            }, 5200);
        };

        var restartTimer = function () {
            if (timer) {
                window.clearInterval(timer);
            }
            startTimer();
        };

        dots.forEach(function (dot) {
            dot.addEventListener('click', function () {
                showSlide(Number(dot.getAttribute('data-hero-dot')) || 0);
                restartTimer();
            });
        });

        if (prev) {
            prev.addEventListener('click', function () {
                showSlide(current - 1);
                restartTimer();
            });
        }

        if (next) {
            next.addEventListener('click', function () {
                showSlide(current + 1);
                restartTimer();
            });
        }

        startTimer();
    }

    var panels = Array.prototype.slice.call(document.querySelectorAll('[data-filter-panel]'));

    panels.forEach(function (panel) {
        var scope = panel.parentElement || document;
        var cards = Array.prototype.slice.call(scope.querySelectorAll('[data-filter-card]'));
        var search = panel.querySelector('[data-filter-search]');
        var year = panel.querySelector('[data-filter-year]');
        var type = panel.querySelector('[data-filter-type]');

        var apply = function () {
            var keyword = search ? search.value.trim().toLowerCase() : '';
            var yearValue = year ? year.value : '';
            var typeValue = type ? type.value : '';

            cards.forEach(function (card) {
                var haystack = [
                    card.getAttribute('data-title') || '',
                    card.getAttribute('data-region') || '',
                    card.getAttribute('data-type') || '',
                    card.getAttribute('data-tags') || ''
                ].join(' ').toLowerCase();
                var okKeyword = !keyword || haystack.indexOf(keyword) !== -1;
                var okYear = !yearValue || card.getAttribute('data-year') === yearValue;
                var okType = !typeValue || card.getAttribute('data-type') === typeValue;

                card.classList.toggle('is-hidden', !(okKeyword && okYear && okType));
            });
        };

        if (search) {
            search.addEventListener('input', apply);
        }
        if (year) {
            year.addEventListener('change', apply);
        }
        if (type) {
            type.addEventListener('change', apply);
        }

        var params = new URLSearchParams(window.location.search);
        var q = params.get('q');
        if (q && search) {
            search.value = q;
            apply();
        }
    });

    var players = Array.prototype.slice.call(document.querySelectorAll('[data-player]'));

    players.forEach(function (player) {
        var video = player.querySelector('video');
        var button = player.querySelector('[data-play-button]');
        var stream = video ? video.getAttribute('data-stream') : '';
        var hlsInstance = null;
        var loaded = false;

        var loadVideo = function () {
            if (!video || !stream || loaded) {
                return;
            }

            loaded = true;

            if (video.canPlayType('application/vnd.apple.mpegurl')) {
                video.src = stream;
            } else if (window.Hls && window.Hls.isSupported()) {
                hlsInstance = new window.Hls({
                    enableWorker: true,
                    lowLatencyMode: true
                });
                hlsInstance.loadSource(stream);
                hlsInstance.attachMedia(video);
            } else {
                video.src = stream;
            }
        };

        var playVideo = function () {
            loadVideo();
            player.classList.add('is-playing');
            var playPromise = video.play();
            if (playPromise && typeof playPromise.catch === 'function') {
                playPromise.catch(function () {});
            }
        };

        if (button && video) {
            button.addEventListener('click', playVideo);
        }

        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    playVideo();
                }
            });
            video.addEventListener('play', function () {
                player.classList.add('is-playing');
            });
        }

        window.addEventListener('beforeunload', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
