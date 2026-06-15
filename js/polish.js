/* ============================================================
   emblem — polish.js
   "Cinematic Precision" インタラクション層。

   役割（main.js / tech.js を補完する純粋な追加機能）：
   • スクロールリビール（[data-reveal] / [data-reveal-group]）
   • Nav のフロスト化（スクロール時に .nav--scrolled）
   • スクロール進捗バー
   • Hero の入場アニメ発火（body.is-loaded）
   • prefers-reduced-motion を尊重

   home/tech ページは position:fixed の専用コンテナをスクロールするため、
   window ではなくコンテナの scrollTop を監視する（main.js と同方式）。
   ============================================================ */
(function () {
  'use strict';

  var prefersReduced = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* スクロール主体（home/tech は専用コンテナ、その他は window） */
  var homeContainer = document.getElementById('homeScrollContainer');
  var techContainer = document.getElementById('techScrollContainer');
  var scroller = homeContainer || techContainer || null; // null = window

  function getScrollTop() {
    if (scroller) return scroller.scrollTop;
    return window.pageYOffset || document.documentElement.scrollTop || 0;
  }
  function getScrollRange() {
    if (scroller) return scroller.scrollHeight - scroller.clientHeight;
    var d = document.documentElement;
    return d.scrollHeight - window.innerHeight;
  }

  /* ============================================================
     1. スクロールリビール
     [data-reveal-group] の直下にある [data-reveal] へ
     連番の --i を振り、IntersectionObserver で .is-in を付与。
     ============================================================ */
  (function initReveal() {
    document.documentElement.classList.add('js');

    /* グループ内のスタッガー番号を自動付与 */
    document.querySelectorAll('[data-reveal-group]').forEach(function (group) {
      var items = group.querySelectorAll('[data-reveal]');
      items.forEach(function (el, i) {
        if (!el.style.getPropertyValue('--i')) {
          el.style.setProperty('--i', String(i));
        }
      });
    });

    var targets = document.querySelectorAll('[data-reveal]');
    if (!targets.length) return;

    if (prefersReduced || !('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('is-in'); });
      return;
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });

    targets.forEach(function (el) { io.observe(el); });

    /* 安全策：万一監視が機能しなくても 2.5s 後に全表示 */
    setTimeout(function () {
      targets.forEach(function (el) { el.classList.add('is-in'); });
    }, 2500);
  })();

  /* ============================================================
     2. Nav フロスト化 + 3. スクロール進捗バー
     ============================================================ */
  (function initNavAndProgress() {
    var nav = document.querySelector('.nav');

    /* 進捗バーを生成 */
    var bar = document.createElement('div');
    bar.className = 'scroll-progress';
    var fill = document.createElement('i');
    bar.appendChild(fill);
    document.body.appendChild(bar);

    var ticking = false;
    function update() {
      var top = getScrollTop();
      var range = getScrollRange();
      var p = range > 0 ? Math.min(1, Math.max(0, top / range)) : 0;
      fill.style.setProperty('--p', (p * 100).toFixed(2) + '%');
      if (nav) nav.classList.toggle('nav--scrolled', top > 40);
      ticking = false;
    }
    function onScroll() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    (scroller || window).addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
  })();

  /* ============================================================
     3.5 Hero スクロールキュー：固定コンテナを次のセクションへ
     ============================================================ */
  (function initScrollCue() {
    var cue = document.querySelector('.hero__scroll-cue');
    if (!cue) return;
    cue.addEventListener('click', function (e) {
      e.preventDefault();
      var amount = scroller ? scroller.clientHeight : window.innerHeight;
      if (scroller) scroller.scrollTo({ top: amount, behavior: 'smooth' });
      else window.scrollTo({ top: amount, behavior: 'smooth' });
    });
  })();

  /* ============================================================
     4. Hero 入場アニメ発火
     ============================================================ */
  (function initHeroEntrance() {
    function fire() {
      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          document.body.classList.add('is-loaded');
        });
      });
    }
    if (document.readyState === 'complete') fire();
    else window.addEventListener('load', fire);
    /* 念のためのフォールバック */
    setTimeout(function () { document.body.classList.add('is-loaded'); }, 1200);
  })();

})();
