/* ============================================================
   Emblem — news.js
   ニュース一覧を管理・表示するファイル。

   【ニュースを追加するには】
   下の NEWS_ITEMS 配列の先頭に新しいオブジェクトを追加するだけ。
   news.html と index.html（最新4件）に自動で反映される。
   ============================================================ */

const NEWS_ITEMS = [
  /* ── ここにニュースを追加する（新しい順） ── */
  {
    date_jp: "2026年1月",
    date_en: "Jan 2026",
    category: "連携",
    title_jp: "ブータン政府とのLOI調印。首相来日時にJETROビジネスセミナーで登壇。",
    title_en: "LOI signed with the Government of Bhutan. Presented at JETRO Business Seminar during Prime Minister's visit to Japan.",
    link: null
  },
  {
    date_jp: "2025年5月",
    date_en: "May 2025",
    category: "連携",
    title_jp: "モザンビーク政府とのLOI調印。大阪万博パビリオン内で飛行映像を展示。",
    title_en: "LOI signed with the Government of Mozambique. Flight footage exhibited at Osaka Expo pavilion.",
    link: null
  },
  {
    date_jp: "2025年5月",
    date_en: "May 2025",
    category: "採択",
    title_jp: "NEDO先導研究プログラム採択（2024–26）。JAXA・ミズノ・SOMと連携。",
    title_en: "Selected for NEDO Leading Research Program (2024–26). Partnering with JAXA, Mizuno, and SOM.",
    link: null
  },
  {
    date_jp: "2024年10月",
    date_en: "Oct 2024",
    category: "認定",
    title_jp: "JAXAスタートアップ認定。航空技術部門から2社目。",
    title_en: "Certified as a JAXA Startup. Second company from the aviation technology division.",
    link: null
  },
  {
    date_jp: "2024年2月",
    date_en: "Feb 2024",
    category: "連携",
    title_jp: "石川県加賀市と包括連携協定締結。国家戦略特区内に試験拠点整備。",
    title_en: "Comprehensive partnership agreement concluded with Kaga City, Ishikawa. Test facility established in National Strategic Special Zone.",
    link: null
  },
  {
    date_jp: "2024年2月",
    date_en: "Feb 2024",
    category: "メディア",
    title_jp: "日本経済新聞・中日新聞に掲載。",
    title_en: "Featured in Nikkei Shimbun and Chunichi Shimbun.",
    link: null
  }
];

/* ↓ news.html のニュース一覧は HTML に直書きしているため、JS生成は不要 */

/* ---------- index.html 用: 最新4件をNewsバンドに表示 ---------- */
(function renderHomeBand() {
  const container = document.getElementById('home-news-band');
  if (!container) return;

  container.innerHTML = NEWS_ITEMS.slice(0, 4).map(item => `
    <div class="news-card fade-in">
      <div class="news-card__body">
        <p class="caption news-card__date"
           data-jp="${item.date_jp}"
           data-en="${item.date_en}">${item.date_jp}</p>
        <span class="news-card__badge"
              data-jp="${item.category}"
              data-en="${item.category}">${item.category}</span>
        <p class="news-card__title"
           data-jp="${item.title_jp}"
           data-en="${item.title_en}">${item.title_jp}</p>
      </div>
    </div>
  `).join('');
})();
