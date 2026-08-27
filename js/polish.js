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
      /* デスクトップはスムーズページャー、それ以外はネイティブのsmoothスクロール */
      if (smoothSnap.active) {
        smoothSnap.toIndex(smoothSnap.currentIndex() + 1);
      } else {
        var amount = scroller ? scroller.clientHeight : window.innerHeight;
        if (scroller) scroller.scrollTo({ top: amount, behavior: 'smooth' });
        else window.scrollTo({ top: amount, behavior: 'smooth' });
      }
    });
  })();

  /* ============================================================
     3.6 ホームのスムーズ・セクションスナップ
     ------------------------------------------------------------
     ネイティブの scroll-snap はスナップ速度を制御できず動きが急。
     native snap を無効化し、自前のイージングで次/前のセクションへ
     ゆっくり移動する。
     • マウス/トラックパッド: 1ホイール操作ごとにページ送り
     • タッチ（モバイル）: 指に追従してドラッグ→離した時に
       スワイプ方向のセクションへ PC と同じ速度でスナップ
     reduce-motion はネイティブ挙動のまま。

     ▼ スピード調整: SNAP_DURATION（ミリ秒）を変えるだけ。
        大きいほどゆっくり・なめらか（PC・モバイル共通）。
     ============================================================ */
  var smoothSnap = (function initSmoothSnap() {
    var SNAP_DURATION = 1150; /* ← スナップ移動の所要時間(ms)。お好みで調整 */
    var COOLDOWN = 120;       /* 連続発火を防ぐ待機(ms) */
    var SWIPE_DIST = 50;      /* ページ送り判定のドラッグ量(px) */
    var SWIPE_VEL = 0.3;      /* ページ送り判定のスワイプ速度(px/ms) */

    var noop = { active: false, toIndex: function () {}, currentIndex: function () { return 0; } };
    var container = homeContainer;
    if (!container) return noop;

    if (prefersReduced) return noop;

    /* native snap を切って自前で制御。
       scroll-behavior:smooth のままだと scrollTop 代入もブラウザ側で
       スムーズ補間され、自前の rAF イージングと競合するので auto にする。 */
    container.style.scrollSnapType = 'none';
    container.style.scrollBehavior = 'auto';

    var locked = false;
    /* タッチ開始でアニメーションを中断できるようにするトークン */
    var animToken = 0;

    function snapPoints() {
      var max = container.scrollHeight - container.clientHeight;
      var pts = [];
      [].slice.call(container.children).forEach(function (el) {
        if (el.nodeType !== 1 || el.offsetHeight <= 0) return;
        var top = Math.min(el.offsetTop, max);
        if (pts.indexOf(top) === -1) pts.push(top);
      });
      pts.sort(function (a, b) { return a - b; });
      return pts;
    }

    function nearestIndex(pts) {
      var top = container.scrollTop, best = 0, bd = Infinity;
      for (var i = 0; i < pts.length; i++) {
        var d = Math.abs(pts[i] - top);
        if (d < bd) { bd = d; best = i; }
      }
      return best;
    }

    function easeInOutCubic(t) {
      return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }

    /* v0(px/ms) 省略時: 通常のease-in-out（ホイール用）。
       v0 指定時: 指を離した瞬間の速度を初速として引き継ぎ、
       そのまま滑らかに減速して目標へ吸い付く（速度連続のHermite曲線）。
       これにより「一瞬止まってから動き出す」違和感がなくなる。 */
    function animateTo(target, done, v0) {
      var start = container.scrollTop;
      var dist = target - start;
      if (Math.abs(dist) < 1) { if (done) done(); return; }
      var t0 = performance.now();
      var token = animToken; /* タッチ開始で中断される */

      /* 正規化した初速（曲線の初期勾配）。0=静止スタート。
         過大なフリック速度は 3 までにクランプ（行き過ぎ防止） */
      var m0 = 0;
      if (typeof v0 === 'number' && isFinite(v0)) {
        m0 = Math.max(0, Math.min(3, v0 * SNAP_DURATION / dist));
      }

      function curve(t) {
        if (m0 <= 0.01) return easeInOutCubic(t);
        /* Hermite: h(0)=0, h(1)=1, h'(0)=m0, h'(1)=0 */
        return m0 * (t * t * t - 2 * t * t + t) + (3 * t * t - 2 * t * t * t);
      }

      (function step(now) {
        if (token !== animToken) { locked = false; return; }
        var p = Math.min(1, (now - t0) / SNAP_DURATION);
        container.scrollTop = start + dist * curve(p);
        if (p < 1) requestAnimationFrame(step);
        else if (done) done();
      })(t0);
    }

    function toIndex(i, v0) {
      var pts = snapPoints();
      var next = Math.max(0, Math.min(pts.length - 1, i));
      if (Math.abs(container.scrollTop - pts[next]) < 1) return;
      locked = true;
      animateTo(pts[next], function () {
        setTimeout(function () { locked = false; }, COOLDOWN);
      }, v0);
    }

    /* イベント発生位置〜container の間に独自の縦スクロール領域
       （例: News の Updates 一覧）があるか。あればその領域は
       「独自スクロール専用ゾーン」とし、ページ送りは一切しない。
       端での連鎖は CSS の overscroll-behavior:contain が抑止する。 */
    function inInnerScroll(node) {
      while (node && node !== container && node.nodeType === 1) {
        if (node.scrollHeight > node.clientHeight + 1) {
          var oy = getComputedStyle(node).overflowY;
          if (oy === 'auto' || oy === 'scroll') return true;
        }
        node = node.parentNode;
      }
      return false;
    }

    container.addEventListener('wheel', function (e) {
      /* 横方向ジェスチャー（Newsカルーセル等）はそのまま通す */
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      if (!e.deltaY) return;
      /* 独自スクロール領域上ではネイティブスクロールのみ（snapしない） */
      if (inInnerScroll(e.target)) return;
      e.preventDefault();
      if (locked) return;
      toIndex(nearestIndex(snapPoints()) + (e.deltaY > 0 ? 1 : -1));
    }, { passive: false });

    /* ── タッチ（モバイル）: 指に追従→離した時にPCと同じ速度でスナップ ──
       ネイティブの momentum + mandatory snap は急激で、描画が追いつかず
       白いフラッシュ（チカチカ）の原因にもなるため、JS で制御する。 */
    var tTracking = false;  /* このスワイプをJSが制御中か */
    var tNative = false;    /* このスワイプはネイティブに任せるか */
    var tStartX = 0, tStartY = 0, tStartTop = 0, tOriginIdx = 0;
    var tLastY = 0, tLastT = 0, tVel = 0;

    container.addEventListener('touchstart', function (e) {
      if (e.touches.length !== 1) { tTracking = false; tNative = true; return; }
      animToken++;            /* 進行中のスナップアニメを中断して指を優先 */
      locked = false;
      var t = e.touches[0];
      tStartX = t.clientX;
      tStartY = t.clientY;
      tLastY = t.clientY;
      tLastT = performance.now();
      tVel = 0;
      tStartTop = container.scrollTop;
      tOriginIdx = nearestIndex(snapPoints());
      tTracking = false;      /* 方向が確定するまで未決 */
      tNative = false;
    }, { passive: true });

    container.addEventListener('touchmove', function (e) {
      if (tNative) return;
      if (e.touches.length !== 1) { tNative = true; return; }
      var t = e.touches[0];
      var dy = tStartY - t.clientY;          /* 正=下へスクロール */
      var dx = tStartX - t.clientX;

      if (!tTracking) {
        /* 微小な指ブレでは方向判定しない（デッドゾーン） */
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return;
        /* 初動で判定: 横ジェスチャー（Newsカルーセル等）と
           独自スクロール領域（Updates一覧）はネイティブに任せる */
        if (Math.abs(dx) > Math.abs(dy)) { tNative = true; return; }
        if (inInnerScroll(e.target)) { tNative = true; return; }
        tTracking = true;
      }

      e.preventDefault();                     /* ネイティブスクロールを止める */
      container.scrollTop = tStartTop + dy;   /* 指に追従 */

      var now = performance.now();
      /* 瞬間速度をEMAで平滑化（サンプルのブレを吸収） */
      var inst = (tLastY - t.clientY) / Math.max(1, now - tLastT);
      tVel = tVel * 0.4 + inst * 0.6;
      tLastY = t.clientY;
      tLastT = now;
    }, { passive: false });

    container.addEventListener('touchend', function () {
      if (!tTracking || tNative) { tTracking = false; return; }
      tTracking = false;
      var disp = container.scrollTop - tStartTop;
      var next = tOriginIdx;
      if (disp > SWIPE_DIST || tVel > SWIPE_VEL) next = tOriginIdx + 1;
      else if (disp < -SWIPE_DIST || tVel < -SWIPE_VEL) next = tOriginIdx - 1;
      /* 指を離した速度を初速として渡し、流れのままスナップへ */
      toIndex(next, tVel);
    }, { passive: true });

    return {
      active: true,
      toIndex: toIndex,
      currentIndex: function () { return nearestIndex(snapPoints()); }
    };
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
