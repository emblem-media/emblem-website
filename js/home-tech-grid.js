/* ============================================================
   Emblem — home-tech-grid.js

   役割：
   Home page (index.html) の Tech Grid セクションを
   js/tech.js の TECH_ENTRIES から自動生成

   機能：
   • 最新3つの visible なエントリを Grid に表示
   • 4番目の visible エントリを "NEXT UP" セクションに表示
   • tech.js を更新するだけで home/tech ページ両方が自動更新
     （だるま落とし形式）

   実行タイミング：
   • tech.js が先に読み込まれている前提
   • DOMContentLoaded で実行
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  // tech.js の TECH_ENTRIES が読み込まれているか確認
  if (typeof TECH_ENTRIES === 'undefined') {
    console.error('home-tech-grid.js: TECH_ENTRIES が見つかりません。tech.js を先に読み込んでください。');
    return;
  }

  /* ============================================================
     TECH_ENTRIES から visible な項目だけを抽出
   ============================================================ */
  const visibleEntries = TECH_ENTRIES.filter(e => e.visible);
  if (visibleEntries.length < 3) {
    console.warn('home-tech-grid.js: visible な tech が3つ以上ないため、grid を生成できません。');
    return;
  }

  /* ============================================================
     Home page Tech Grid 生成

     構成：
     • 左列上: Text（Technology説明）+ 03セル（最新3番目）
     • 左列下: 03セル
     • 右列上: 02セル（最新2番目）
     • 右列下: 01セル（最新1番目）
   ============================================================ */
  function renderHomeGrid() {
    // 最新3つを新しい順に取得（表示順序）
    const latest3 = visibleEntries.slice(0, 3);
    const newest = latest3[0];    // 01 表示用（最新）
    const second = latest3[1];    // 02 表示用（2番目）
    const third = latest3[2];     // 03 表示用（3番目）

    // 各セルのビデオ/画像をレンダリング
    function renderMedia(entry) {
      if (entry.media?.src) {
        if (entry.media.type === 'video') {
          return `<video class="htg-cell-media" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
                    <source src="${entry.media.src}" type="video/mp4">
                  </video>`;
        } else {
          return `<img class="htg-cell-media" src="${entry.media.src}" alt="${entry.media.alt}">`;
        }
      } else {
        // プレースホルダー
        return `<div class="htg-cell-placeholder">
                  <div class="htg-ph-icon"><div class="htg-ph-tri"></div></div>
                  <p class="htg-ph-label">VIDEO / PHOTO</p>
                  <p class="htg-ph-desc">${entry.title_jp}</p>
                </div>`;
      }
    }

    // 右列上: 02セル（2番目）
    const cell02Html = `
      <a href="technology.html#tech-sec-${second.id}" class="htg-cell htg-cell--02">
        ${renderMedia(second)}
        <div class="htg-cell-overlay"></div>
        <div class="htg-cell-meta">
          <p class="htg-cell-num">${second.num}</p>
          <h3 class="htg-cell-title" data-jp="${second.title_jp}" data-en="${second.title_en}">${second.title_jp}</h3>
          <p class="htg-cell-en" data-jp="${second.title_en}" data-en="${second.title_en}">${second.title_en}</p>
          <span class="htg-cell-arr">→</span>
        </div>
      </a>`;

    // 右列下: 01セル（最新）
    const cell01Html = `
      <a href="technology.html#tech-sec-${newest.id}" class="htg-cell htg-cell--01">
        ${renderMedia(newest)}
        <div class="htg-cell-overlay"></div>
        <div class="htg-cell-meta">
          <p class="htg-cell-num">${newest.num}</p>
          <h3 class="htg-cell-title" data-jp="${newest.title_jp}" data-en="${newest.title_en}">${newest.title_jp}</h3>
          <p class="htg-cell-en" data-jp="${newest.title_en}" data-en="${newest.title_en}">${newest.title_en}</p>
          <span class="htg-cell-arr">→</span>
        </div>
      </a>`;

    // 左列下: 03セル（3番目）
    const cell03Html = `
      <a href="technology.html#tech-sec-${third.id}" class="htg-cell htg-cell--03">
        ${renderMedia(third)}
        <div class="htg-cell-overlay"></div>
        <div class="htg-cell-meta">
          <p class="htg-cell-num">${third.num}</p>
          <h3 class="htg-cell-title" data-jp="${third.title_jp}" data-en="${third.title_en}">${third.title_jp}</h3>
          <p class="htg-cell-en" data-jp="${third.title_en}" data-en="${third.title_en}">${third.title_en}</p>
          <span class="htg-cell-arr">→</span>
        </div>
      </a>`;

    // Desktop layout に挿入
    const desktopRight = document.querySelector('.htg-desktop-layout .htg-right');
    const desktopLeft = document.querySelector('.htg-desktop-layout .htg-left');
    if (desktopRight && desktopLeft) {
      // 既存の 02, 01 セルを置き換え
      const cells02 = desktopRight.querySelectorAll('.htg-cell--02');
      const cells01 = desktopRight.querySelectorAll('.htg-cell--01');
      const cells03 = desktopLeft.querySelectorAll('.htg-cell--03');

      if (cells02.length > 0) cells02[0].outerHTML = cell02Html;
      if (cells01.length > 0) cells01[0].outerHTML = cell01Html;
      if (cells03.length > 0) cells03[0].outerHTML = cell03Html;
    }
  }

  /* ============================================================
     Home page NEXT UP セクション生成（4番目の visible エントリ）
   ============================================================ */
  function renderNextUp() {
    if (visibleEntries.length < 4) {
      console.warn('home-tech-grid.js: 4番目の項目がないため、NEXT UP を表示できません。');
      return;
    }

    const nextEntry = visibleEntries[3];

    function renderMedia(entry) {
      if (entry.media?.src) {
        if (entry.media.type === 'video') {
          return `<video class="next-up-media" autoplay muted loop playsinline preload="metadata" aria-hidden="true">
                    <source src="${entry.media.src}" type="video/mp4">
                  </video>`;
        } else {
          return `<img class="next-up-media" src="${entry.media.src}" alt="${entry.media.alt}">`;
        }
      } else {
        return `<div class="next-up-placeholder">
                  <div class="htg-ph-icon"><div class="htg-ph-tri"></div></div>
                  <p class="htg-ph-label">VIDEO / PHOTO</p>
                  <p class="htg-ph-desc">${nextEntry.title_jp}</p>
                </div>`;
      }
    }

    // NEXT UP セクションを更新
    const nextUpSection = document.querySelector('.next-up-section');
    if (nextUpSection) {
      nextUpSection.innerHTML = `
        <a href="technology.html#tech-sec-${nextEntry.id}" class="next-up-cell">
          ${renderMedia(nextEntry)}
          <div class="next-up-overlay"></div>
          <div class="next-up-meta">
            <p class="next-up-num">${nextEntry.num}</p>
            <h3 class="next-up-title" data-jp="${nextEntry.title_jp}" data-en="${nextEntry.title_en}">${nextEntry.title_jp}</h3>
            <p class="next-up-en" data-jp="${nextEntry.title_en}" data-en="${nextEntry.title_en}">${nextEntry.title_en}</p>
            <span class="next-up-arr">→</span>
          </div>
        </a>`;
    }
  }

  // 実行
  renderHomeGrid();
  renderNextUp();

  // 言語切り替え後も対応するため、lang-change イベントをリッスン（必要に応じて）
  console.log('✓ Home Tech Grid rendered from TECH_ENTRIES');
});
