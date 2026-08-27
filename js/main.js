/* ============================================================
   emblem — main.js

   全ページ共通の制御機能：
   • Team ページの表示/非表示トグル（SHOW_TEAM フラグ）
   • Nav のスクロール連動表示/非表示
   • ハンバーガーメニューと mobile overlay の開閉
   • 言語切り替え（JP/EN）と localStorage 永続化
   • Fade-in アニメーション（IntersectionObserver）
   ============================================================ */

const SHOW_TEAM = false; // ← true に変えるだけで Team ページ・リンク全表示
const SHOW_MISSION = true; // ← true で Mission リンク・ページが公開される

/* ============================================================
   Team ページの表示制御
   SHOW_TEAM が false の場合：
   • /team へのアクセスをホームにリダイレクト
   • nav・footer の Team リンクを非表示
   ============================================================ */
(function applyTeamVisibility() {
  if (SHOW_TEAM) return;
  // /team ページへのアクセスを / にリダイレクト
  if (window.location.pathname.includes('/team')) {
    window.location.replace('/');
  }
  // nav・footer 内の [data-team-link] 属性付き要素を非表示
  document.querySelectorAll('[data-team-link]').forEach(el => {
    el.style.display = 'none';
  });
})();

/* ============================================================
   Mission ページの表示制御
   SHOW_MISSION が false の場合：
   • /mission へのアクセスをホームにリダイレクト
   • nav・footer の Mission リンクを非表示
   ============================================================ */
(function applyMissionVisibility() {
  if (SHOW_MISSION) return;
  // /mission ページへのアクセスを / にリダイレクト
  if (window.location.pathname.includes('/mission')) {
    window.location.replace('/');
  }
  // nav・footer 内の [data-mission-link] 属性付き要素を非表示
  document.querySelectorAll('[data-mission-link]').forEach(el => {
    el.style.display = 'none';
  });
})();

/* ============================================================
   Hamburger メニュー＋ Mobile overlay の開閉制御

   操作：
   • .nav__hamburger をクリック → overlay を表示
   • overlay 内の a タグをクリック → overlay を非表示
   • document.body.overflow を制御して背景スクロール防止
   ============================================================ */
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

/* ============================================================
   言語切り替え制御（JP / EN）

   動作：
   • header の JP/EN ボタンをクリックで言語切り替え
   • [data-jp] / [data-en] 属性の内容を動的に表示
   • localStorage に言語設定を保存（ページリロード後も保持）
   • html 要素の lang 属性を更新（SEO・アクセシビリティ対応）

   対応要素：
   • [data-jp] / [data-en] 属性 → すべてのテキスト要素
   • [data-html="true"] → HTML 内容として反映（<br> など保持）
   ============================================================ */
(function initLang() {
  const LANG_KEY = 'emblem-lang';
  let currentLang = localStorage.getItem(LANG_KEY) || 'jp';

  function setLang(lang) {
    currentLang = lang;
    localStorage.setItem(LANG_KEY, lang);
    // [data-jp] / [data-en] 属性を持つすべての要素を切り替え
    document.querySelectorAll('[data-jp]').forEach(el => {
      // data-html 属性がある場合は innerHTML で設定（<br> などを保持）
      if (el.dataset.html) {
        el.innerHTML = lang === 'jp' ? el.dataset.jp : el.dataset.en;
      } else {
        // 通常のテキスト要素は textContent で設定
        el.textContent = lang === 'jp' ? el.dataset.jp : el.dataset.en;
      }
    });
    // JP/EN ボタンの active 状態を更新
    document.querySelectorAll('.lang-toggle__item').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    // SEO・アクセシビリティのため html 要素の lang 属性を更新
    document.documentElement.lang = lang === 'jp' ? 'ja' : 'en';
  }
  // JP/EN ボタンにクリックリスナーを追加
  document.querySelectorAll('.lang-toggle__item').forEach(btn => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
  // ページ読み込み時に保存済みの言語設定を適用
  setLang(currentLang);
})();

/* ============================================================
   Fade-in アニメーション制御（.fade-in クラス）

   動作：
   • .fade-in クラスを持つ要素が画面内に入ると自動的に .visible クラスを追加
   • IntersectionObserver で効率的に管理
   • 一度表示されたら再度非表示にはならない（unobserve）

   対応要素：
   • index.html: ニュースカード、section など
   • CSS では opacity: 0 → 1 のアニメーションを定義
   ============================================================ */
(function initFadeIn() {
  const elements = document.querySelectorAll('.fade-in');
  if (!elements.length) return;
  // threshold: 0.12 = 要素の 12% が見えたらトリガー（軽い効果）
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // .visible クラスを追加してアニメーション開始
        entry.target.classList.add('visible');
        // その後は監視から外す（効率化）
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  // すべての .fade-in 要素を監視開始
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
