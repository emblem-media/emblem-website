/* ============================================================
   News一覧（Updates）のページャー

   1ページあたり PER_PAGE 件を表示し、下部にページ送りを出す。
   カードはHTMLに残したまま表示/非表示を切り替えるだけなので、
   検索エンジンには全件が見えたままになる（SEO資産を失わない）。
   JSが無効な環境では全件がそのまま表示される。
   ============================================================ */
(function initNewsPager() {
  var PER_PAGE = 10;

  var wrap = document.querySelector('.news-updates');
  if (!wrap) return;

  var cards = [].slice.call(wrap.querySelectorAll('.news-card-full'));
  if (cards.length <= PER_PAGE) return;

  var pages = Math.ceil(cards.length / PER_PAGE);
  var current = 1;

  /* ページャーのDOMを生成 */
  var nav = document.createElement('nav');
  nav.className = 'news-pager';
  nav.setAttribute('aria-label', 'News pagination');
  wrap.appendChild(nav);

  function label(el, jp, en) {
    el.setAttribute('data-jp', jp);
    el.setAttribute('data-en', en);
    el.textContent = (localStorage.getItem('emblem-lang') === 'en') ? en : jp;
  }

  function render() {
    /* カードの表示切り替え */
    cards.forEach(function (card, i) {
      var page = Math.floor(i / PER_PAGE) + 1;
      card.hidden = (page !== current);
    });

    /* ページャーを組み直す */
    nav.innerHTML = '';

    var prev = document.createElement('button');
    prev.type = 'button';
    prev.className = 'news-pager__arrow';
    prev.textContent = '←';
    prev.disabled = (current === 1);
    prev.addEventListener('click', function () { go(current - 1); });
    nav.appendChild(prev);

    for (var p = 1; p <= pages; p++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'news-pager__num' + (p === current ? ' is-current' : '');
      b.textContent = String(p);
      if (p === current) b.setAttribute('aria-current', 'page');
      (function (n) {
        b.addEventListener('click', function () { go(n); });
      })(p);
      nav.appendChild(b);
    }

    var next = document.createElement('button');
    next.type = 'button';
    next.className = 'news-pager__arrow';
    next.textContent = '→';
    next.disabled = (current === pages);
    next.addEventListener('click', function () { go(current + 1); });
    nav.appendChild(next);
  }

  function go(n) {
    if (n < 1 || n > pages || n === current) return;
    current = n;
    render();
    /* ページを送ったら Updates の先頭に戻す */
    var label = wrap.querySelector('.news-updates__label');
    if (label) label.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  render();
})();
