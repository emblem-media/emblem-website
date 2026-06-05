/* ============================================================
   Emblem — tech.js
   Technology ページのフルスクリーンセクションを管理するファイル。

   【コンテンツを追加・更新するには】
   TECH_ENTRIES 配列を編集するだけ。
   - 新しいエントリを追加 → 配列に追記
   - 表示/非表示の切り替え → visible: true/false を変更
   - 素材の差し替え → media.src を変更

   【表示制御変数】
   SHOW_TECH_4 / SHOW_TECH_5 を true にすると④⑤が表示される。
   SHOW_TEAM と同じ方式。
   ============================================================ */

/* ── 表示制御 ─────────────────────────────────────────────── */
const SHOW_TECH_4 = false; // ← true で④「飛行する視界」を公開
const SHOW_TECH_5 = false; // ← true で⑤「自由な飛行」を公開

/* ── コンテンツデータ ──────────────────────────────────────
   media.type: 'video' | 'photo'
   media.src:  素材のパス。未入手の場合は null（プレースホルダー表示）
   link:       「続きを読む」のリンク先。個別ページがあれば設定。
   ─────────────────────────────────────────────────────────── */
const TECH_ENTRIES = [
  {
    id: 'field',
    num: '01',
    visible: true,
    media: {
      type: 'photo',
      src: 'assets/images/truss_image.jpg',
      alt: '加賀市試験フィールド 上空からの俯瞰写真'
    },
    date_jp: 'December 2025',
    date_en: 'December 2025',
    title_jp: '人が空を飛ぶフィールド',
    title_en: 'A Field for Human Flight',
    body_jp: `飛行機には空港があります。
自動車には道路があります。
では、人が空を飛ぶためには何が必要でしょうか。
私たちは、その答えをつくろうとしています。
東京で設計された飛行システムは、北陸の実証フィールドへ運ばれます。そこでエンジンに火が入り、人が装着し、空へ挑みます。
Human Flightは、まだ存在しない産業です。
だから私たちは、飛行装置だけでなく、その未来が生まれる場所そのものをつくっています。`,
    body_en: `Airplanes have airports. Cars have roads.
But what does it take for humans to fly?
We are building the answer.
Our flight systems are designed in Tokyo and brought to our test field in Hokuriku, where engines ignite, pilots suit up, and new possibilities take flight.
Human Flight is not yet an industry.
That is why we are building more than a flying machine.
We are building the place where its future can begin.`,
    link: null
  },
  {
    id: 'body',
    num: '02',
    visible: true,
    media: {
      type: 'video',
      src: 'assets/videos/hovering.mp4',
      alt: '安定したホバリング試験映像'
    },
    date_jp: 'March 2026',
    date_en: 'March 2026',
    title_jp: '身体と飛行',
    title_en: 'Flight Should Follow the Body',
    body_jp: `私たちは、操縦桿を巧みに扱うことが飛行の本質だとは考えていません。
人は歩くとき、自転車に乗るとき、自分の身体を意識的に操作しているわけではありません。身体の動きそのものが、移動へとつながっています。
飛行もまた同じであるべきだと考えています。
私たちが目指すのは、人間が機械を操縦する飛行ではなく、人間の身体の延長として成立する飛行です。
飛ぶための技術ではなく、自然に飛べる身体をつくること。
その挑戦がここから始まります。`,
    body_en: `We do not believe that the essence of flight lies in mastering a control stick.
When people walk or ride a bicycle, they are not consciously operating their bodies as machines. Movement emerges naturally from the body itself.
We believe flight should work the same way.
Our goal is not a form of flight in which humans operate machines. It is a form of flight that becomes an extension of the human body.
We are not simply developing technology for flying.
We are exploring what it means to create a body that can fly naturally.
That journey begins here.`,
    link: null
  },
  {
    id: 'hands',
    num: '03',
    visible: true,
    media: {
      type: 'video',
      src: null,
      alt: 'ハンズフリーホバリング映像'
    },
    date_jp: 'May 2026',
    date_en: 'May 2026',
    title_jp: '身体を解放する',
    title_en: 'Freeing the Hands',
    body_jp: `手は、人間にとって最も重要な道具です。
つかむ。支える。修理する。救助する。
空中で活動するために本当に重要なのは、飛ぶことそのものではありません。飛んだ先で何ができるかです。
私たちは、飛行中も操縦に意識を向け続ける状態から、人が本来の仕事に集中できる状態への移行を目指しています。
ハンズフリー飛行は、そのための一歩です。
それは飛行技術の進歩ではありません。人間の自由度を増やすための進歩です。`,
    body_en: `Hands are humanity's most important tools.
To grasp. To support. To repair. To rescue.
When operating in the air, what matters most is not the act of flying itself. It is what becomes possible after flight.
Our goal is to move beyond a state where attention is constantly devoted to control, and toward one where people can focus on the work that truly matters.
Hands-free flight is one step in that direction.
It is not simply an advance in flight technology.
It is an advance in human freedom.`,
    link: null
  },
  {
    id: 'vision',
    num: 'NEXT',
    visible: true,
    media: {
      type: 'photo',
      src: 'assets/images/next_goggle_2.jpg',
      alt: 'REKKIEゴーグルを着用した飛行写真'
    },
    date_jp: 'August 2026',
    date_en: 'August 2026',
    title_jp: '飛行する視界',
    title_en: 'Vision in Flight',
    body_jp: 'See beyond what you see',
    body_en: 'See beyond what you see',
    link: null
  },
  {
    id: 'free',
    num: '05',
    visible: SHOW_TECH_5,
    media: {
      type: 'video',
      src: null,
      alt: 'フリーフライト映像'
    },
    date_jp: '2026年 予定',
    date_en: 'Coming 2026',
    title_jp: '自由な飛行',
    title_en: 'Free Flight',
    body_jp: `人は長い間、地面と共に生きてきました。
道路に沿って移動し、階段を上り、橋を渡る。私たちの身体は、常に地形の制約を受けています。
飛行は、その関係を変えます。
前へ進むだけでなく、上へ行くことができる。迂回するのではなく、越えることができる。地形に従うのではなく、空間そのものを使うことができる。
私たちが追い求めているのは、単なる飛行ではありません。
人が三次元空間を自由に使うための、新しい身体です。`,
    body_en: `For most of human history, movement has been shaped by the ground beneath our feet.
Roads. Stairs. Bridges. Our bodies have always followed the terrain.
Flight changes that relationship.
Not only forward, but upward. Not around, but across. Not constrained by geography, but able to use space itself.
What we are pursuing is more than flight.
It is a new body for a three-dimensional world.`,
    link: null
  }
];

/* ── DOM生成 ────────────────────────────────────────────────── */

/* visible=true のエントリのみ抽出 */
const visibleEntries = TECH_ENTRIES.filter(e => e.visible);

/* メインセクション群を生成 */
(function buildSections() {
  const container = document.getElementById('techSections');
  if (!container) return;

  container.innerHTML = visibleEntries.map((entry, index) => {

    /* 素材エリア: src があれば video/img、なければプレースホルダー */
    let mediaHTML = '';
    if (entry.media.src) {
      if (entry.media.type === 'video') {
        mediaHTML = `
          <video class="tech-sec__media" autoplay muted loop playsinline
                 preload="metadata" aria-hidden="true">
            <source src="${entry.media.src}" type="video/mp4">
          </video>`;
      } else {
        mediaHTML = `
          <img class="tech-sec__media" src="${entry.media.src}"
               alt="${entry.media.alt}" loading="${index === 0 ? 'eager' : 'lazy'}">`;
      }
    } else {
      /* プレースホルダー: 素材未入手の場合 */
      const icon = entry.media.type === 'video'
        ? `<div class="tech-sec__ph-play"><div class="tech-sec__ph-tri"></div></div>`
        : `<div class="tech-sec__ph-img">📷</div>`;
      mediaHTML = `
        <div class="tech-sec__placeholder">
          ${icon}
          <p class="tech-sec__ph-label">${entry.media.type.toUpperCase()} PLACEHOLDER</p>
          <p class="tech-sec__ph-desc">${entry.media.alt}</p>
        </div>`;
    }

    /* 「続きを読む」リンク */
    const linkHTML = entry.link
      ? `<a href="${entry.link}" class="tech-sec__link tech-sec__anim tech-sec__anim--body"
            data-jp="続きを読む →" data-en="Read more →">続きを読む →</a>`
      : '';

    return `
      <section class="tech-sec" id="tech-sec-${entry.id}"
               data-index="${index}" data-id="${entry.id}">
        ${mediaHTML}
        <div class="tech-sec__overlay"></div>
        <div class="tech-sec__content">
          <p class="tech-sec__num tech-sec__anim tech-sec__anim--num"
             data-jp="${entry.num} — Technology"
             data-en="${entry.num} — Technology">${entry.num} — Technology</p>

          <!-- タイトル: 日本語と英語を縦に重ねて表示 -->
          <h2 class="tech-sec__title tech-sec__anim tech-sec__anim--title"
              data-jp="${entry.title_jp}"
              data-en="${entry.title_en}">${entry.title_jp}</h2>
          <p class="tech-sec__title-en tech-sec__anim tech-sec__anim--title-en"
             data-jp="${entry.title_en}"
             data-en="">${entry.title_en}</p>

          <!-- 本文 -->
          <p class="tech-sec__body tech-sec__anim tech-sec__anim--body"
             data-jp="${entry.body_jp.replace(/`/g, '&#96;').replace(/"/g, '&quot;').replace(/\n/g, '<br>')}"
             data-en="${entry.body_en.replace(/`/g, '&#96;').replace(/"/g, '&quot;').replace(/\n/g, '<br>')}"
             data-html="true"
             >${entry.body_jp.replace(/\n/g, '<br>')}</p>

          <!-- 日付 -->
          <p class="tech-sec__date tech-sec__anim tech-sec__anim--body"
             data-jp="${entry.date_jp}"
             data-en="${entry.date_en}">${entry.date_jp}</p>

          ${linkHTML}
        </div>
        <div class="tech-sec__scroll-ind" aria-hidden="true">
          <div class="tech-sec__scroll-line"></div>
          <span class="tech-sec__scroll-label">SCROLL</span>
        </div>
      </section>`;
  }).join('');

  /* 最後のセクションにlastクラスを付与（スクロールインジケーターを非表示に） */
  const allSections = container.querySelectorAll('.tech-sec');
  if (allSections.length > 0) {
    allSections[allSections.length - 1].classList.add('last');
  }
})();

/* ナビゲーションドットを生成 */
(function buildNavDots() {
  const nav = document.getElementById('techNavDots');
  if (!nav) return;

  nav.innerHTML = visibleEntries.map((entry, i) => `
    <button class="tech-nav-dot ${i === 0 ? 'active' : ''}"
            data-index="${i}"
            aria-label="${entry.title_jp}"
            title="${entry.title_jp}"></button>
  `).join('');

  /* クリックでスクロール */
  nav.querySelectorAll('.tech-nav-dot').forEach(btn => {
    btn.addEventListener('click', () => {
      const idx = parseInt(btn.dataset.index);
      const target = document.querySelector(
        `.tech-sec[data-index="${idx}"]`
      );
      const scrollContainer = document.getElementById('techScrollContainer');
      if (target && scrollContainer) {
        scrollContainer.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
})();

/* ── アニメーション制御 ─────────────────────────────────────
   各セクションに入ったタイミングで:
   1. 動画/画像が即座に表示開始（背景なので元から見えている）
   2. 0.8s後: num + title がフェードイン
   3. 1.4s後: title-en がフェードイン
   4. 1.9s後: body + date + link がフェードイン
   セクションを外れたらアニメーションをリセット（再度入ると再生）
   ─────────────────────────────────────────────────────────── */
(function initAnimations() {
  const sections = document.querySelectorAll('.tech-sec');
  if (!sections.length) return;

  /* アニメーション遅延の定義 */
  const DELAYS = {
    'tech-sec__anim--num':      800,  // ms
    'tech-sec__anim--title':    800,
    'tech-sec__anim--title-en': 1400,
    'tech-sec__anim--body':     1900,
  };

  /* タイマーIDを保持（セクション離脱時にクリア） */
  const timers = new Map();

  function animateIn(section) {
    const id = section.dataset.id;

    /* 同一セクションのタイマーがあればクリア */
    if (timers.has(id)) {
      timers.get(id).forEach(t => clearTimeout(t));
    }

    const sectionTimers = [];
    Object.entries(DELAYS).forEach(([cls, delay]) => {
      const els = section.querySelectorAll(`.${cls}`);
      const t = setTimeout(() => {
        els.forEach(el => el.classList.add('visible'));
      }, delay);
      sectionTimers.push(t);
    });

    timers.set(id, sectionTimers);
  }

  function animateOut(section) {
    const id = section.dataset.id;
    if (timers.has(id)) {
      timers.get(id).forEach(t => clearTimeout(t));
      timers.delete(id);
    }
    /* アニメーション要素をリセット */
    section.querySelectorAll('.tech-sec__anim').forEach(el => {
      el.classList.remove('visible');
    });
  }

  /* IntersectionObserver: セクションが画面の50%以上見えたらアニメーション開始 */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateIn(entry.target);
        /* ナビゲーションドットを更新 */
        const idx = parseInt(entry.target.dataset.index);
        document.querySelectorAll('.tech-nav-dot').forEach((dot, i) => {
          dot.classList.toggle('active', i === idx);
        });
      } else {
        animateOut(entry.target);
      }
    });
  }, {
    threshold: 0.5  /* セクションの50%が見えたらトリガー */
  });

  sections.forEach(s => observer.observe(s));
})();

/* ── ページ読み込み時: URLハッシュで該当セクションへスクロール ── */
(function initHashScroll() {
  const hash = window.location.hash;
  if (!hash) return;

  const scrollContainer = document.getElementById('techScrollContainer');
  if (!scrollContainer) return;

  /* DOMが完全に構築されてからスクロール */
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      const target = document.querySelector(hash);
      if (target) {
        scrollContainer.scrollTo({
          top: target.offsetTop,
          behavior: 'smooth'
        });
      }
    });
  });
})();
