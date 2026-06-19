(function () {
    document.querySelectorAll('[data-player]').forEach(function (box) {
        var video = box.querySelector('video');
        var layer = box.querySelector('.play-layer');
        var start = box.querySelector('[data-start]');
        var stream = box.getAttribute('data-stream');
        var prepared = false;
        var hlsInstance = null;
        var run = function () {
            if (!video || !stream) {
                return;
            }
            if (!prepared) {
                if (window.Hls && window.Hls.isSupported()) {
                    hlsInstance = new window.Hls({
                        enableWorker: true,
                        lowLatencyMode: true
                    });
                    hlsInstance.loadSource(stream);
                    hlsInstance.attachMedia(video);
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = stream;
                }
                prepared = true;
            }
            if (layer) {
                layer.classList.add('is-hidden');
            }
            video.controls = true;
            var promise = video.play();
            if (promise && promise.catch) {
                promise.catch(function () {
                    if (layer) {
                        layer.classList.remove('is-hidden');
                    }
                });
            }
        };
        if (start) {
            start.addEventListener('click', run);
        }
        if (video) {
            video.addEventListener('click', function () {
                if (video.paused) {
                    run();
                }
            });
        }
        window.addEventListener('pagehide', function () {
            if (hlsInstance) {
                hlsInstance.destroy();
            }
        });
    });
})();
