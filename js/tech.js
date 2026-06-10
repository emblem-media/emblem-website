/* ============================================================
   emblem — tech.js

   役割：
   TECH_ENTRIES 配列が唯一のデータソース。このファイルのみ編集で、以下が自動更新される：
   • index.html（HOME ページ）: Tech Grid に最新3つを表示（だるま落とし式）
   • index.html（HOME ページ）: NEXT UP セクションに1つを薄く表示
   • technology.html: すべてのエントリを自動生成

   ⚠️  index.html と technology.html は自動生成されます。
       直接 HTML を編集しないでください。js/tech.js のみ編集してください。

   ════════════════════════════════════════════════════════════

   【操作パターン別ガイド】

   📌 新しい Tech を本番公開したい（NEXT UP → 本番化）:
   ────────────────────────────────────────────────
   Step 1: 現在の NEXT UP エントリ（is_planned: true）を探す
   Step 2: 以下を変更:
           - num: 'NEXT UP' → '03' など新しい番号に変更
           - is_planned: true → false に変更
           - 本文・素材を更新

   Step 3: 新しい NEXT UP を配列の末尾に追加（is_planned: true で）
   結果: HOME ページ Tech Grid が新しい順に更新される

   📌 Tech 素材を差し替えたい（動画・写真を更新）:
   ────────────────────────────────────────
   該当するエントリの media.src を変更するだけ。
   例: media: { type: 'video', src: 'assets/videos/new-flight.mp4', ... }

   📌 Tech を非表示にしたい:
   ──────────────────────
   visible: false に変更するだけ。
   削除する必要はありません（history として残しておくことを推奨）。

   ════════════════════════════════════════════════════════════

   各フィールドの説明:

   • id             : ユニークな ID（英数字・ハイフンのみ）。後で個別ページを作る時に参照
   • num            : 表示番号。'01', '02', '03' ... または 'NEXT UP'
   • visible        : true=表示 / false=非表示（HTML に描画されない）
   • is_planned     : true=NEXT UP（準備中・薄い表示） / false=本番公開
   • media
     - type        : 'photo' or 'video'
     - src         : 素材パス（例: 'assets/images/xxx.jpg'）。未入手なら null
     - alt         : 代替テキスト（画像説明）
   • date_jp / date_en : 公開時期（日本語/英語）。NEXT UP の場合は 'Coming Soon'
   • title_jp / title_en : Tech タイトル（日本語/英語）
   • body_jp / body_en  : 説明文（日本語/英語。複数行 OK）
   • link          : 個別ページのリンク先。未作成なら null

   ============================================================ */
/* ── コンテンツデータ ──────────────────────────────────────
   media.type:  'video' | 'photo'
   media.src:   素材のパス。未入手の場合は null（プレースホルダー表示）
   is_planned:  true=NEXT UP（準備中）/ false=本番エントリ
   link:        「続きを読む」のリンク先。個別ページがあれば設定。

   【新しいTechを追加する時の作業】
   1. 現在の NEXT UP エントリ（is_planned: true）を本番化：
      - num を 'NEXT UP' → '04'（等）に変更
      - is_planned を true → false に変更
      - 本文・素材を更新
   2. 配列末尾に新しい NEXT UP を追加（is_planned: true）
   → HOME PAGE と TECHNOLOGY PAGE が自動更新される
   ペースト用のテンプレート：","を前につけてペースト
   {
    id: 'xxxx',
    num: 'NEXT UP',
    visible: true,
    is_planned: true,
    media: {
      type: 'photo',
      src: 'assets/images/xxxxx',
      alt: 'xxxxの写真'
    },
    date_jp: 'month 2026',
    date_en: 'month 2026',
    title_jp: 'title in japanese',
    title_en: 'title in english',
    body_jp: 'body in japanese',
    body_en: 'body in english',
    link: null
    }
   ─────────────────────────────────────────────────────────── */
const TECH_ENTRIES = [
  {
    id: 'field',
    num: '01',
    visible: true,
    is_planned: false,
    media: {
      type: 'photo',
      src: 'assets/images/truss_image.jpg',
      alt: '加賀市試験フィールド 上空からの俯瞰写真'
    },
    date_jp: 'October 2025',
    date_en: 'October 2025',
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
    is_planned: false,
    media: {
      type: 'video',
      src: 'assets/videos/hovering_2.mp4',
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
  }
  /*
  ,
  {
    id: 'hands',
    num: '03',
    visible: true,
    is_planned: false,
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
    num: 'NEXT UP',
    visible: true,
    is_planned: true,
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
  }
    */
];

/* ── DOM生成 ────────────────────────────────────────────────── */

/* visible=true のエントリのみ抽出 */
const visibleEntries = TECH_ENTRIES.filter(e => e.visible);

/* メインセクション群を生成 */
(function buildSections() {
  const container = document.getElementById('techSections');
  if (!container) return;

  container.innerHTML = visibleEntries.map((entry, index) => {

    /* NEXT UP（is_planned: true）の場合は専用のNext Coming表示 */
    if (entry.is_planned) {
      return `
        <section class="tech-sec tech-sec--next-coming" id="tech-sec-${entry.id}"
                 data-index="${index}" data-id="${entry.id}">
          <div class="tech-sec__overlay" style="background:rgba(0,0,0,0.7)"></div>
          ${entry.media.src
            ? (entry.media.type === 'video'
              ? `<video class="tech-sec__media" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
                   <source src="${entry.media.src}" type="video/mp4">
                 </video>`
              : `<img class="tech-sec__media" src="${entry.media.src}" alt="${entry.media.alt}" loading="lazy" style="filter:blur(4px);opacity:0.35">`)
            : `<div class="tech-sec__placeholder">
                 <div class="tech-sec__ph-img" style="font-size:48px;opacity:0.15">?</div>
               </div>`
          }
          <div class="tech-sec__content">
            <p class="tech-sec__num tech-sec__anim tech-sec__anim--num"
               data-jp="NEXT UP — Technology"
               data-en="NEXT UP — Technology">NEXT UP — Technology</p>
            <h2 class="tech-sec__title tech-sec__anim tech-sec__anim--title"
                data-jp="${entry.title_jp}"
                data-en="${entry.title_en}">${entry.title_jp}</h2>
            <p class="tech-sec__title-en tech-sec__anim tech-sec__anim--title-en"
               data-jp="${entry.title_en}"
               data-en="">${entry.title_en}</p>
            <p class="tech-sec__date tech-sec__anim tech-sec__anim--body"
               data-jp="${entry.date_jp}"
               data-en="${entry.date_en}">${entry.date_jp}</p>
          </div>
          <div class="tech-sec__scroll-ind" aria-hidden="true">
            <div class="tech-sec__scroll-line"></div>
            <span class="tech-sec__scroll-label">SCROLL</span>
          </div>
        </section>`;
    }

    /* 通常エントリ（is_planned: false）の場合 */
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
    'tech-sec__anim--num':      300,  // ms
    'tech-sec__anim--title':    500,
    'tech-sec__anim--title-en': 800,
    'tech-sec__anim--body':     1200,
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

/* ============================================================
   Home page Tech Grid 自動更新

   index.html の home-tech-grid 内の3セルに
   TECH_ENTRIES の最新3件（is_planned: false）を自動で流し込む。

   【対応するスロットID】
   デスクトップ:
     htg-slot-large  → 左下大枠（最新）
     htg-slot-top    → 右上（2番目）
     htg-slot-bottom → 右下（3番目）
   モバイル:
     htg-mob-slot-top   → 全幅大枠（最新）
     htg-mob-slot-left  → 下段左（2番目）
     htg-mob-slot-right → 下段右（3番目）

   【次のtechを追加する時の作業】
   js/tech.js の TECH_ENTRIES のみ編集すればよい:
   1. 既存NEXT UPの is_planned を false に・num を '04' 等に変更
   2. 新しいNEXT UPエントリを配列末尾に追加（is_planned: true）
   → technology.html と index.html が自動で更新される
   ============================================================ */
(function syncHomeTechGrid() {

  /* index.html 以外では実行しない */
  if (!document.getElementById('htg-slot-large') &&
      !document.getElementById('htg-mob-slot-top')) return;

  /* is_planned: false のエントリを配列末尾（最新）から3件取得 */
  const normal = TECH_ENTRIES.filter(e => e.visible && !e.is_planned);
  const latest = normal[normal.length - 1];
  const second = normal[normal.length - 2];
  const third  = normal[normal.length - 3];

  /* セルの内部HTMLを生成する */
  function buildCellInner(entry) {
    if (!entry) return '';

    let mediaHTML = '';
    if (entry.media && entry.media.src) {
      if (entry.media.type === 'video') {
        mediaHTML = `<video class="htg-cell-media" autoplay muted loop playsinline
                            preload="metadata" aria-hidden="true">
                       <source src="${entry.media.src}" type="video/mp4">
                     </video>`;
      } else {
        mediaHTML = `<img class="htg-cell-image"
                         src="${entry.media.src}"
                         alt="${entry.media.alt || ''}"
                         loading="lazy">`;
      }
    } else {
      mediaHTML = `<div class="htg-cell-placeholder">
                     <div class="htg-ph-icon"><div class="htg-ph-tri"></div></div>
                     <p class="htg-ph-label">VIDEO / PHOTO</p>
                     <p class="htg-ph-desc">${entry.title_jp}</p>
                   </div>`;
    }

    return `${mediaHTML}
      <div class="htg-cell-overlay"></div>
      <div class="htg-cell-meta">
        <p class="htg-cell-num">${entry.num}</p>
        <h3 class="htg-cell-title"
            data-jp="${entry.title_jp}"
            data-en="${entry.title_en}">${entry.title_jp}</h3>
        <p class="htg-cell-en"
           data-jp="${entry.title_en}"
           data-en="${entry.title_en}">${entry.title_en}</p>
        <span class="htg-cell-arr">→</span>
      </div>`;
  }

  function buildHref(entry) {
    return entry ? `technology.html#tech-sec-${entry.id}` : 'technology.html';
  }

  function fillSlot(id, entry) {
    const el = document.getElementById(id);
    if (!el || !entry) return;
    el.innerHTML = buildCellInner(entry);
    el.href = buildHref(entry);
  }

  /* デスクトップ用スロットを更新 */
  fillSlot('htg-slot-large',  latest);
  fillSlot('htg-slot-top',    second);
  fillSlot('htg-slot-bottom', third);

  /* モバイル用スロットを更新 */
  fillSlot('htg-mob-slot-top',   latest);
  fillSlot('htg-mob-slot-left',  second);
  fillSlot('htg-mob-slot-right', third);

  /* 言語設定を再適用（innerHTML書き換え後に必要） */
  const savedLang = localStorage.getItem('emblem-lang') || 'jp';
  if (savedLang === 'en') {
    document.querySelectorAll('[data-jp]').forEach(el => {
      if (!el.dataset.html) {
        el.textContent = el.dataset.en || el.dataset.jp;
      }
    });
  }

})();
