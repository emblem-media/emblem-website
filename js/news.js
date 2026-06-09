/* ============================================================
   Emblem — news.js

   役割：
   • NEWS_ITEMS 配列でニュースデータを一元管理
   • index.html の HOME ページの News バンド（最新 4 件）を自動生成
   • id="home-news-band" コンテナに動的にカード要素を挿入

   ⚠️  重要な注意事項:

   news.html のニュース一覧ページは HTML で直書きされており、
   このファイルの変更は自動で反映されません。

   つまり、ニュースを追加したい時は **2つのファイルを更新する必要があります**:

   【2ファイル編集が必須】
   1. news.html      → id="news-list" の先頭に新しいカード HTML を追加
   2. news.js        → NEWS_ITEMS 配列の先頭に同じニュース情報を追加

   この双方を更新することで：
   • news.html: ニュース一覧ページに反映
   • index.html: HOME ページの最新 4 件バンドに反映

   ════════════════════════════════════════════════════════════

   NEWS_ITEMS の各フィールド説明:

   • date_jp      : 日付（日本語例: "2026年1月"）
   • date_en      : 日付（英語例: "Jan 2026"）
   • category     : カテゴリ名（以下から選択）
                    - "連携" （パートナーシップ）
                    - "採択" （プログラム採択）
                    - "認定" （認定・資格）
                    - "メディア" （メディア掲載）
   • title_jp     : ニュースタイトル（日本語）
   • title_en     : ニュースタイトル（英語）
   • link         : 外部リンク URL （リンクがない場合は null）

   【追加例】
   新しいニュースは配列の先頭に追加してください（新しい順）。
   古いニュースは必要に応じて配列から削除してください。

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

/* ---------- index.html 用: 最新4件をNewsカルーセルに表示 ----------
   id="home-news-band" が存在するページ（index.html）でのみ動作する。
   news.html では動作しない。                                     */
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
