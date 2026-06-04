/* ============================================================
   Emblem — home-tech.js
   index.html の Technology セクションを管理するファイル。

   js/tech.js の TECH_ENTRIES データを使い回す。
   tech.js を先に読み込んでから、このファイルを読み込むこと。

   【データを更新するには】
   js/tech.js の TECH_ENTRIES を編集するだけ。
   このファイルは触らなくてよい。
   ============================================================ */

(function initHomeTech() {

  /* TECH_ENTRIES が未定義の場合は終了（tech.jsより後に読み込まれる前提） */
  if (typeof TECH_ENTRIES === 'undefined') {
    console.warn('home-tech.js: TECH_ENTRIES が見つかりません。tech.js を先に読み込んでください。');
    return;
  }

  /* visible=true のエントリのみ使用 */
  const entries = TECH_ENTRIES.filter(e => e.visible);
  if (!entries.length) return;

  const entriesContainer = document.getElementById('htv2Entries');
  const dotsContainer    = document.getElementById('htv2Dots');
  const swipeDotsContainer = document.getElementById('htv2SwipeDots');
  if (!entriesContainer) return;

  /* ── エントリHTML生成 ─────────────────────────────────── */
  entriesContainer.innerHTML = entries.map((entry, i) => {

    /* 素材エリア */
    let mediaHTML = '';
    if (entry.media && entry.media.src) {
      if (entry.media.type === 'video') {
        mediaHTML = `<video class="htv2-entry-media" autoplay muted loop playsinline
                            preload="metadata" aria-hidden="true">
                       <source src="${entry.media.src}" type="video/mp4">
                     </video>`;
      } else {
        mediaHTML = `<img class="htv2-entry-media"
                         src="${entry.media.src}"
                         alt="${entry.media.alt || ''}"
                         loading="${i === 0 ? 'eager' : 'lazy'}">`;
      }
    } else {
      /* プレースホルダー */
      const icon = (entry.media && entry.media.type === 'video')
        ? `<div class="htv2-ph-play"><div class="htv2-ph-tri"></div></div>`
        : `<div class="htv2-ph-img">Photo</div>`;
      mediaHTML = `<div class="htv2-entry-placeholder">
                     ${icon}
                     <p class="htv2-ph-label">${entry.media ? entry.media.type.toUpperCase() : 'PHOTO'} PLACEHOLDER</p>
                     <p class="htv2-ph-desc">${entry.media ? entry.media.alt : ''}</p>
                   </div>`;
    }

    return `
      <div class="htv2-entry ${i === 0 ? 'active' : ''}"
           data-index="${i}" data-id="${entry.id}">
        ${mediaHTML}
        <div class="htv2-entry-overlay"></div>
        <div class="htv2-entry-meta">
          <p class="htv2-entry-num">${entry.num}</p>
          <h3 class="htv2-entry-title"
              data-jp="${entry.title_jp}"
              data-en="${entry.title_en}">${entry.title_jp}</h3>
          <p class="htv2-entry-title-en"
             data-jp="${entry.title_en}"
             data-en="${entry.title_en}">${entry.title_en}</p>
          <p class="htv2-entry-body"
             data-jp="${entry.body_jp.split('\n')[0]}"
             data-en="${entry.body_en.split('\n')[0]}">${entry.body_jp.split('\n')[0]}</p>
          <p class="htv2-entry-date"
             data-jp="${entry.date_jp}"
             data-en="${entry.date_en}">${entry.date_jp}</p>
        </div>
      </div>`;
  }).join('');

  /* ── ドット生成（デスクトップ縦・モバイル横共通） ───────── */
  const dotsHTML = entries.map((e, i) =>
    `<div class="htv2-dot ${i === 0 ? 'active' : ''}" data-index="${i}"></div>`
  ).join('');
  if (dotsContainer)      dotsContainer.innerHTML      = dotsHTML;
  if (swipeDotsContainer) swipeDotsContainer.innerHTML = dotsHTML;

  /* ── デスクトップ: 縦スクロールスナップ ─────────────────── */
  /* 右パネル自身に scroll-snap を設定。
     上2/3に01、下1/3に02を顔出しするため、
     スクロールコンテナの高さ = 100%（固定）
     各エントリの高さ = 100%（= コンテナ全体）
     で、スナップにより01→02→03と切り替わる。               */

  const rightPanel = document.getElementById('htv2Right');
  if (!rightPanel) return;

  /* ── ドット更新: IntersectionObserver方式（tech.jsと同じ）── */
  function updateDots(activeIndex) {
    /* デスクトップ用ドット */
    document.querySelectorAll('#htv2Dots .htv2-dot').forEach((d, i) => {
      d.classList.toggle('active', i === activeIndex);
    });
    /* モバイル用ドット */
    document.querySelectorAll('#htv2SwipeDots .htv2-dot').forEach((d, i) => {
      d.classList.toggle('active', i === activeIndex);
    });
  }

  /* エントリが50%以上見えたらドットを更新 */
  const entryObserver = new IntersectionObserver(observerEntries => {
    observerEntries.forEach(observerEntry => {
      if (observerEntry.isIntersecting) {
        const idx = parseInt(observerEntry.target.dataset.index);
        updateDots(idx);
      }
    });
  }, {
    /* デスクトップは右パネル、モバイルは横スクロールコンテナをrootに指定 */
    root: null,         /* viewport基準。両方に対応 */
    threshold: 0.5      /* 50%見えたらトリガー */
  });

  /* 全エントリを監視 */
  entriesContainer.querySelectorAll('.htv2-entry').forEach(el => {
    entryObserver.observe(el);
  });

  /* ── ドットクリックでスクロール ────────────────────────── */
  document.querySelectorAll('#htv2Dots .htv2-dot').forEach(dot => {
    dot.addEventListener('click', () => {
      const idx = parseInt(dot.dataset.index);
      const totalH = rightPanel.scrollHeight;
      rightPanel.scrollTo({ top: (totalH / entries.length) * idx, behavior: 'smooth' });
    });
  });

})();
