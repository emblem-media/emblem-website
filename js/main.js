/* ============================================================
   Emblem — main.js
   Nav scroll · Language toggle · Intersection Observer · SHOW_TEAM
   ============================================================ */

const SHOW_TEAM = false; // ← true に変えるだけで全表示

/* ---------- Team visibility ---------- */
(function applyTeamVisibility() {
  if (SHOW_TEAM) return;
  // redirect team page to home
  if (window.location.pathname.includes('/team')) {
    window.location.replace('/');
  }
  // hide team links in nav/footer
  document.querySelectorAll('[data-team-link]').forEach(el => {
    el.style.display = 'none';
  });
})();

/* ---------- Nav theme (dark / light) ----------
   data-nav-dark セクションが nav 領域を覆っている間は透明白テキスト。
   白セクションにさしかかったらグレー背景＋黒テキスト。
   nav--light ページ（tech/news等）は常に light のまま。
   ------------------------------------------------------------ */
/* ---------- Hamburger / Mobile overlay ---------- */
(function initHamburger() {
  const btn = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__overlay');
  if (!btn || !overlay) return;

  btn.addEventListener('click', () => {
    const open = btn.classList.toggle('open');
    overlay.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  overlay.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      btn.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ---------- Nav スクロール連動（表示/非表示）----------
   下スクロール → Navが上にスライドして消える
   上スクロール → Navが戻ってくる
   ページ最上部付近（80px以内）→ 常に表示

   home/tech は position:fixed の専用コンテナをスクロールするため
   window.scrollY ではなくコンテナの scrollTop を監視する。
   その他のページ（news/recruit等）は window を監視する。
   -------------------------------------------------------- */
(function initNavScroll() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  /* ページ最上部からこのpx以内は常に表示 */
  const TOP_THRESHOLD = 80;
  /* この量以上スクロールしたら判定（小さい揺れを無視） */
  const DELTA = 6;

  function setupListener(scrollTarget) {
    let lastTop = 0;
    let ticking = false;

    const getTop = () =>
      scrollTarget === window ? window.scrollY : scrollTarget.scrollTop;

    scrollTarget.addEventListener('scroll', () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const current = getTop();
        const delta = current - lastTop;

        if (current < TOP_THRESHOLD) {
          /* 最上部付近: 必ず表示 */
          nav.classList.remove('nav--hidden');
        } else if (delta > DELTA) {
          /* 下スクロール: 非表示 */
          nav.classList.add('nav--hidden');
        } else if (delta < -DELTA) {
          /* 上スクロール: 表示 */
          nav.classList.remove('nav--hidden');
        }

        lastTop = current;
        ticking = false;
      });
    }, { passive: true });
  }

  /* homeScrollContainer（index.html） */
  const homeContainer = document.getElementById('homeScrollContainer');
  if (homeContainer) setupListener(homeContainer);

  /* techScrollContainer（technology.html） */
  const techContainer = document.getElementById('techScrollContainer');
  if (techContainer) setupListener(techContainer);

  /* 上記どちらもないページ（news/recruit/team/privacy）*/
  if (!homeContainer && !techContainer) {
    setupListener(window);
  }
})();

/* ---------- Language toggle（localStorage で永続化）---------- */
(function initLang() {
  const LANG_KEY = 'emblem-lang';
  let currentLang = localStorage.getItem(LANG_KEY) || 'jp';

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    document.querySelectorAll('[data-jp]').forEach(el => {
      // data-html 属性がある要素は innerHTML で設定（<br>等を保持）
      if (el.dataset.html) {
        el.innerHTML = lang === 'jp' ? el.dataset.jp : el.dataset.en;
      } else {
        el.textContent = lang === 'jp' ? el.dataset.jp : el.dataset.en;
      }
    });
    document.querySelectorAll('.lang-toggle__item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // html lang 属性も更新
    document.documentElement.lang = lang === 'jp' ? 'ja' : 'en';
  }
  document.querySelectorAll('.lang-toggle__item').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  // ページ読み込み時に保存済み言語を適用
  setLang(currentLang);
})();

/* ---------- Hero animation（段階的フェードイン）---------- */
(function initHeroAnimation() {
  const hero = document.querySelector('.hero--home');
  if (!hero) return;

  const DELAYS = {
    'hero-anim--badge': 300,
    'hero-anim--title': 300,
    'hero-anim--right-title': 500,
    'hero-anim--lead': 800,
    'hero-anim--body': 1200,
  };

  let animated = false;

  function animateHero() {
    if (animated) return;
    animated = true;

    Object.entries(DELAYS).forEach(([cls, delay]) => {
      setTimeout(() => {
        const els = hero.querySelectorAll(`.${cls}`);
        els.forEach(el => el.classList.add('visible'));
      }, delay);
    });
  }

  // ページロード時にすぐにアニメーション開始
  animateHero();
})();

/* ---------- Fade-in (Intersection Observer) ---------- */
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  elements.forEach(el => observer.observe(el));
})();

/* ---------- Team link visibility (post-DOM) ---------- */
document.addEventListener('DOMContentLoaded', () => {
  if (!SHOW_TEAM) {
    document.querySelectorAll('[data-team-link]').forEach(el => {
      el.style.display = 'none';
    });
  }
});

/* ─── Tech Archive: 3列基準パターン ─────────────────────────
   ルール:
   - 基本は3列
   - n % 3 === 2 → 末尾1行だけ2枚
   - n % 3 === 1 → 末尾2行を [2, 2] に（最後の4枚を2+2に分割）
   - n % 3 === 0 → すべて3列
──────────────────────────────────────────────────────────── */
