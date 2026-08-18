/* ============================================================
   動画のクリック再生型埋め込み（YouTube facade）

   初期状態ではサムネイル画像しか置かないため、ページを開いた時点では
   YouTube へのリクエストが一切発生しない。ユーザーが再生ボタンを
   クリックした時点で初めて iframe を差し込む。

   これにより、同意前に third-party Cookie が送信されないため、
   Cookie同意バナー（js/consent.js）の対象外として扱える。
   ドメインは youtube-nocookie.com を使用する。

   使い方:
     <button class="video-embed" data-youtube="動画ID"> ... </button>
   ============================================================ */
(function initVideoEmbed() {
  document.querySelectorAll('.video-embed[data-youtube]').forEach(function (el) {
    el.addEventListener('click', function () {
      var id = el.dataset.youtube;
      if (!id || el.dataset.loaded) return;
      el.dataset.loaded = 'true';

      var iframe = document.createElement('iframe');
      iframe.src = 'https://www.youtube-nocookie.com/embed/' + id +
                   '?autoplay=1&rel=0&playsinline=1';
      iframe.title = el.getAttribute('aria-label') || 'YouTube video';
      iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; ' +
                     'gyroscope; picture-in-picture; web-share';
      iframe.allowFullscreen = true;

      el.innerHTML = '';
      el.appendChild(iframe);
      el.style.cursor = 'default';
    });
  });
})();
