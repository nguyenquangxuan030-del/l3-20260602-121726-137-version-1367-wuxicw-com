function setupPlayer(streamUrl) {
  const video = document.getElementById('movieVideo');
  const cover = document.getElementById('playerCover');
  const button = document.getElementById('playerStart');
  let ready = false;

  if (!video || !streamUrl) {
    return;
  }

  function prepare() {
    if (ready) {
      return;
    }

    ready = true;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = streamUrl;
    } else if (window.Hls && Hls.isSupported()) {
      const hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true
      });
      hls.loadSource(streamUrl);
      hls.attachMedia(video);
    } else {
      video.src = streamUrl;
    }
  }

  function play() {
    prepare();

    if (cover) {
      cover.classList.add('is-hidden');
    }

    const result = video.play();

    if (result && typeof result.catch === 'function') {
      result.catch(function () {});
    }
  }

  if (cover) {
    cover.addEventListener('click', play);
  }

  if (button) {
    button.addEventListener('click', function (event) {
      event.stopPropagation();
      play();
    });
  }

  video.addEventListener('click', function () {
    if (video.paused) {
      play();
    }
  });
}
