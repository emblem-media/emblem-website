/* ============================================================
   Emblem — tech.js
   technology.html のArchive Gridを自動生成するファイル。

   Featured Grid（上位3件）は technology.html のHTMLを直接編集する。
   Archive Grid（4件目以降）はこのファイルが自動生成する。

   【試験を追加するには】
   1. 下の TECH_TESTS 配列の先頭に新しいオブジェクトを追加
   2. technology.html の Featured Grid を手動で更新
      （左大枠=最新、右上=2番目、右下=3番目）
   3. technology/ フォルダに新しい試験の個別ページHTMLを追加
   ============================================================ */

const TECH_TESTS = [
  {
    slug: "hands-free",
    date_jp: "2026年",
    date_en: "2026",
    title_jp: "ハンズフリーホバリング",
    title_en: "Hands-free Hovering",
    video: "assets/videos/hands-free.mp4",
    photo: null,
    is_latest: true,
    is_planned: false
  },
  {
    slug: "stable-hovering",
    date_jp: "2026年4月",
    date_en: "Apr 2026",
    title_jp: "安定したホバリング",
    title_en: "Stable Hovering",
    video: "assets/videos/hovering.mp4",
    photo: null,
    is_latest: false,
    is_planned: false
  },
  {
    slug: "hunging-start",
    date_jp: "2025年9月",
    date_en: "Sep 2025",
    title_jp: "ホバリング開始",
    title_en: "Hovering Start",
    video: "assets/videos/hunging_start.mp4",
    photo: null,
    is_latest: false,
    is_planned: false
  },
  {
    slug: "first-flight",
    date_jp: "2025年6月",
    date_en: "Jun 2025",
    title_jp: "初フライト",
    title_en: "First Flight",
    video: "assets/videos/first_flight.mp4",
    photo: null,
    is_latest: false,
    is_planned: false
  },
  {
    slug: "system-integration",
    date_jp: "2024年11月",
    date_en: "Nov 2024",
    title_jp: "システム統合",
    title_en: "System Integration",
    video: null,
    photo: null,
    is_latest: false,
    is_planned: false
  },
  {
    slug: null,
    date_jp: "2026年 予定",
    date_en: "2026 Planned",
    title_jp: "ジップライン飛行",
    title_en: "Zip-line Flight",
    video: null,
    photo: null,
    is_latest: false,
    is_planned: true
  }
];

/* ---------- technology.html 用: Archive Grid を生成 ---------- */
(function renderArchiveGrid() {
  const container = document.getElementById('archiveItems');
  if (!container) return;

  // 4件目以降（index 3以降）をArchiveに表示
  const archiveTests = TECH_TESTS.slice(3);

  container.innerHTML = archiveTests.map(test => {
    // Next Coming の場合
    if (test.is_planned) {
      return `
        <div class="tech-arc-item tech-arc-item--next-coming">
          <div class="tech-arc-item__next-placeholder" aria-hidden="true">?</div>
          <div class="tech-arc-item__overlay"></div>
          <div class="tech-arc-item__meta">
            <p class="tech-arc-item__date" data-jp="Next" data-en="Next">Next</p>
            <h3 class="tech-arc-item__title" data-jp="${test.title_jp}" data-en="${test.title_en}">${test.title_jp}</h3>
            <p class="tech-arc-item__date" data-jp="${test.date_jp}" data-en="${test.date_en}">${test.date_jp}</p>
          </div>
        </div>
      `;
    }

    // 通常の試験（動画あり）
    if (test.video) {
      return `
        <a href="technology/${test.slug}.html" class="tech-arc-item">
          <video class="tech-arc-item__video" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
            <source src="${test.video}" type="video/mp4">
          </video>
          <div class="tech-arc-item__overlay"></div>
          <div class="tech-arc-item__meta">
            <p class="tech-arc-item__date" data-jp="${test.date_jp}" data-en="${test.date_en}">${test.date_jp}</p>
            <h3 class="tech-arc-item__title" data-jp="${test.title_jp}" data-en="${test.title_en}">${test.title_jp}</h3>
            <span class="tech-arc-item__arrow">→</span>
          </div>
        </a>
      `;
    }

    // 写真のみ（または素材なし）の試験
    return `
      <a href="technology/${test.slug}.html" class="tech-arc-item">
        <div style="position:absolute;inset:0;background:#1a1a1a;display:flex;align-items:center;justify-content:center;color:#444;font-size:10px;letter-spacing:.1em;text-transform:uppercase;">Photo</div>
        <div class="tech-arc-item__overlay"></div>
        <div class="tech-arc-item__meta">
          <p class="tech-arc-item__date" data-jp="${test.date_jp}" data-en="${test.date_en}">${test.date_jp}</p>
          <h3 class="tech-arc-item__title" data-jp="${test.title_jp}" data-en="${test.title_en}">${test.title_jp}</h3>
          <span class="tech-arc-item__arrow">→</span>
        </div>
      </a>
    `;
  }).join('');
})();
/* ↑ DOMContentLoadedを使わず即時実行。
   scriptタグをbody末尾に置くことでDOMが確実に存在する状態で実行できる。 */
