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

    /* 表示前に全画像を読み込んでおく。
       lazy のままだと、切り替えた瞬間に読み込みが始まり画面が一瞬空白になる。 */
    imgs.forEach(function (img) {
      img.removeAttribute('loading');
      if (!img.complete) { var pre = new Image(); pre.src = img.src; }
    });

    /* 戻る／送るボタン。端では出さない（2枚なら 1枚目は「›」だけ、2枚目は「‹」だけ） */
    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'news-photo-slider__prev';
    prev.setAttribute('aria-label', '前の写真');
    prev.innerHTML = '<span aria-hidden="true">‹</span>';
    slider.appendChild(prev);

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
      prev.hidden = (current === 0);
      next.hidden = (current === imgs.length - 1);
    }

    prev.addEventListener('click', function () {
      if (current > 0) { current--; render(); }
    });

    next.addEventListener('click', function () {
      if (current < imgs.length - 1) { current++; render(); }
    });

    render();
  });
})();
