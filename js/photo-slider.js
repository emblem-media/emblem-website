/* ============================================================
   News記事の写真スライダー

   .news-photo-slider の中に複数の <img> を置くと、
   1枚ずつ表示して「＞」ボタンで送れるようにする。
   画像が1枚だけのときは何もしない（ボタンも出さない）。
   JSが無効な環境では全画像が縦に並ぶ（情報は失われない）。
   ============================================================ */
(function initPhotoSlider() {
  document.querySelectorAll('.news-photo-slider').forEach(function (slider) {
    var imgs = [].slice.call(slider.querySelectorAll('img'));
    if (imgs.length < 2) return;

    slider.classList.add('is-ready');
    var current = 0;

    /* 送りボタン */
    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'news-photo-slider__next';
    next.setAttribute('aria-label', '次の写真');
    next.innerHTML = '<span aria-hidden="true">›</span>';
    slider.appendChild(next);

    /* 現在位置のドット */
    var dots = document.createElement('div');
    dots.className = 'news-photo-slider__dots';
    imgs.forEach(function () {
      var d = document.createElement('span');
      d.className = 'news-photo-slider__dot';
      dots.appendChild(d);
    });
    slider.appendChild(dots);

    function render() {
      imgs.forEach(function (img, i) { img.classList.toggle('is-current', i === current); });
      [].slice.call(dots.children).forEach(function (d, i) {
        d.classList.toggle('is-current', i === current);
      });
    }

    next.addEventListener('click', function () {
      current = (current + 1) % imgs.length;
      render();
    });

    render();
  });
})();
