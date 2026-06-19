function initMoviePlayer(options) {
  const video = document.getElementById(options.videoId);
  const trigger = document.getElementById(options.triggerId);
  const overlay = document.getElementById(options.overlayId);
  let hls = null;
  let ready = false;

  const load = () => {
    if (!video || ready) {
      return;
    }

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = options.source;
      ready = true;
      return;
    }

    if (window.Hls && window.Hls.isSupported()) {
      hls = new window.Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(options.source);
      hls.attachMedia(video);
      ready = true;
      return;
    }

    video.src = options.source;
    ready = true;
  };

  const play = () => {
    load();
    overlay?.classList.add('hidden');
    const attempt = video?.play();
    if (attempt && typeof attempt.catch === 'function') {
      attempt.catch(() => {
        overlay?.classList.remove('hidden');
      });
    }
  };

  trigger?.addEventListener('click', play);
  overlay?.addEventListener('click', play);
  video?.addEventListener('click', () => {
    if (video.paused) {
      play();
    } else {
      video.pause();
    }
  });
  video?.addEventListener('play', () => overlay?.classList.add('hidden'));
  video?.addEventListener('pause', () => {
    if (!video.ended) {
      overlay?.classList.remove('hidden');
    }
  });
  window.addEventListener('pagehide', () => {
    if (hls) {
      hls.destroy();
    }
  });
}
