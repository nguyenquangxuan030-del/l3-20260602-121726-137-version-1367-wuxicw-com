(function () {
  function ready(fn) {
    if (document.readyState !== "loading") {
      fn();
    } else {
      document.addEventListener("DOMContentLoaded", fn);
    }
  }

  ready(function () {
    bindMobileMenu();
    bindHero();
    bindFilters();
    bindQuerySearch();
    bindPlayers();
  });

  function bindMobileMenu() {
    var button = document.querySelector(".mobile-menu-button");
    var panel = document.querySelector(".mobile-panel");
    if (!button || !panel) {
      return;
    }
    button.addEventListener("click", function () {
      panel.classList.toggle("open");
    });
  }

  function bindHero() {
    var hero = document.querySelector(".hero-slider");
    if (!hero) {
      return;
    }
    var slides = Array.prototype.slice.call(hero.querySelectorAll(".hero-slide"));
    var dots = Array.prototype.slice.call(hero.querySelectorAll(".hero-dot"));
    var prev = hero.querySelector(".hero-prev");
    var next = hero.querySelector(".hero-next");
    var index = 0;
    var timer = null;

    function show(target) {
      index = (target + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("active", i === index);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === index);
      });
    }

    function restart() {
      if (timer) {
        window.clearInterval(timer);
      }
      timer = window.setInterval(function () {
        show(index + 1);
      }, 5200);
    }

    dots.forEach(function (dot, i) {
      dot.addEventListener("click", function () {
        show(i);
        restart();
      });
    });

    if (prev) {
      prev.addEventListener("click", function () {
        show(index - 1);
        restart();
      });
    }

    if (next) {
      next.addEventListener("click", function () {
        show(index + 1);
        restart();
      });
    }

    restart();
  }

  function bindFilters() {
    var scopes = Array.prototype.slice.call(document.querySelectorAll("[data-filter-scope]"));
    scopes.forEach(function (scope) {
      var list = scope.parentElement.querySelector("[data-card-list]");
      if (!list) {
        return;
      }
      var input = scope.querySelector(".filter-input");
      var year = scope.querySelector(".filter-year");
      var type = scope.querySelector(".filter-type");
      var region = scope.querySelector(".filter-region");
      var cards = Array.prototype.slice.call(list.children);

      function value(node) {
        return node ? node.value.trim().toLowerCase() : "";
      }

      function apply() {
        var keyword = value(input);
        var selectedYear = value(year);
        var selectedType = value(type);
        var selectedRegion = value(region);
        cards.forEach(function (card) {
          var search = (card.getAttribute("data-search") || "").toLowerCase();
          var cardYear = (card.getAttribute("data-year") || "").toLowerCase();
          var cardType = (card.getAttribute("data-type") || "").toLowerCase();
          var cardRegion = (card.getAttribute("data-region") || "").toLowerCase();
          var matched = true;
          if (keyword && search.indexOf(keyword) === -1) {
            matched = false;
          }
          if (selectedYear && cardYear !== selectedYear) {
            matched = false;
          }
          if (selectedType && cardType !== selectedType) {
            matched = false;
          }
          if (selectedRegion && cardRegion !== selectedRegion) {
            matched = false;
          }
          card.classList.toggle("card-hidden", !matched);
        });
      }

      [input, year, type, region].forEach(function (node) {
        if (node) {
          node.addEventListener("input", apply);
          node.addEventListener("change", apply);
        }
      });
    });
  }

  function bindQuerySearch() {
    var params = new URLSearchParams(window.location.search);
    var query = params.get("q");
    if (!query) {
      return;
    }
    var input = document.querySelector(".search-filter .filter-input");
    if (input) {
      input.value = query;
      input.dispatchEvent(new Event("input", { bubbles: true }));
    }
  }

  function bindPlayers() {
    var players = Array.prototype.slice.call(document.querySelectorAll(".video-player"));
    players.forEach(function (player) {
      var video = player.querySelector("video");
      var source = video ? video.querySelector("source") : null;
      var button = player.querySelector(".play-cover");
      var mediaUrl = source ? source.getAttribute("src") : "";
      var started = false;
      var hls = null;

      function start() {
        if (!video || !mediaUrl) {
          return;
        }
        if (!started) {
          if (video.canPlayType("application/vnd.apple.mpegurl")) {
            video.src = mediaUrl;
          } else if (window.Hls && window.Hls.isSupported()) {
            hls = new window.Hls();
            hls.loadSource(mediaUrl);
            hls.attachMedia(video);
          } else {
            video.src = mediaUrl;
          }
          started = true;
        }
        if (button) {
          button.classList.add("hidden");
        }
        video.controls = true;
        var playPromise = video.play();
        if (playPromise && typeof playPromise.catch === "function") {
          playPromise.catch(function () {});
        }
      }

      if (button) {
        button.addEventListener("click", start);
      }
      if (video) {
        video.addEventListener("click", function () {
          if (!started || video.paused) {
            start();
          }
        });
      }
      window.addEventListener("pagehide", function () {
        if (hls && typeof hls.destroy === "function") {
          hls.destroy();
        }
      });
    });
  }
})();
