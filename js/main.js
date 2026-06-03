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
(function initNavTheme() {
  const nav = document.querySelector('.nav');
  if (!nav) return;

  // nav--light ページは常に light — JS では触らない
  if (nav.classList.contains('nav--light')) return;

  const NAV_H = 64; // --nav-height と揃える
  const darkSections = document.querySelectorAll('[data-nav-dark]');
  if (!darkSections.length) {
    // dark セクションが一つもない → 常に gray
    nav.classList.add('scrolled');
    return;
  }

  // どの dark セクションが nav と重なっているかを追跡
  const overlapping = new Set();
  let initialized = false;

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        overlapping.add(entry.target);
      } else {
        overlapping.delete(entry.target);
      }
    });
    initialized = true;
    applyTheme();
  }, {
    // nav の高さ分だけのスリム帯で判定
    rootMargin: `0px 0px -${window.innerHeight - NAV_H}px 0px`,
    threshold: 0
  });

  darkSections.forEach(s => observer.observe(s));

  function applyTheme() {
    if (!initialized || overlapping.size > 0) {
      // dark セクションが nav と重なっている（または初期化前）→ 透明
      nav.classList.remove('scrolled');
    } else {
      // 白セクション → グレー背景
      nav.classList.add('scrolled');
    }
  }

  applyTheme();
})();

/* ---------- Hamburger / Mobile overlay ---------- */
(function initHamburger() {
  const btn = document.querySelector('.nav__hamburger');
  const overlay = document.querySelector('.nav__overlay');

  console.log('=== HAMBURGER DEBUG ===');
  console.log('Window innerWidth:', window.innerWidth);
  console.log('Should trigger mobile menu (max-width: 768px)?', window.innerWidth <= 768);
  console.log('btn found:', !!btn);
  console.log('overlay found:', !!overlay);

  if (!btn || !overlay) {
    console.error('Hamburger or overlay not found in DOM');
    return;
  }

  console.log('btn element:', btn);
  console.log('btn classes:', btn.className);
  console.log('btn computed style display:', getComputedStyle(btn).display);
  console.log('btn computed style visibility:', getComputedStyle(btn).visibility);

  // Force hamburger span visibility
  const spans = btn.querySelectorAll('span');
  console.log('spans found:', spans.length);

  spans.forEach((span, i) => {
    console.log(`Span ${i} before:`, {
      display: getComputedStyle(span).display,
      background: getComputedStyle(span).background,
      opacity: getComputedStyle(span).opacity,
      visibility: getComputedStyle(span).visibility
    });

    span.style.display = 'block';
    span.style.background = 'white';
    span.style.opacity = '1';
    span.style.visibility = 'visible';
    span.style.height = '1.5px';

    console.log(`Span ${i} after:`, {
      display: span.style.display,
      background: span.style.background,
      opacity: span.style.opacity,
      visibility: span.style.visibility
    });
  });

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
