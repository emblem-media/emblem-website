# emblem Website

## ファイル構成

```
/
├── index.html          ホームページ
├── technology.html     Technologyページ
├── news.html           Newsページ
├── recruit.html        採用ページ
├── mission.html        Missionページ（SHOW_MISSION=trueで公開中）
├── team.html           チームページ（SHOW_TEAM=falseで非表示）
├── privacy.html        プライバシーポリシー
├── news/               ニュース個別ページ
│   ├── bhutan.html
│   ├── mozambique.html
│   ├── nedo.html
│   ├── jaxa.html
│   ├── kaga.html
│   └── kaga-report.html
├── css/
│   └── style.css       全ページ共通スタイル（デザイン全て管理）
├── js/
│   ├── main.js         Nav・言語切り替え・アニメーション等の共通JS
│   ├── tech.js         TECH_ENTRIESデータ + technology.htmlの自動生成
│   └── form.js         採用フォームの送信処理
└── assets/
    ├── images/         ロゴ・写真等
    └── videos/         飛行試験動画（mp4）
```

---

## Updatesニュースを追加したい

Updatesニュースを1件追加するには、**3つのファイルを編集**する必要がある。

### Step 1: 個別ページを新規作成する

`news/` フォルダに新しいHTMLファイルを作る。
既存の `news/kaga-report.html` をコピーして以下を書き換える。

書き換える箇所:
- `<title>` タグのタイトル
- `<meta name="description">` の説明文
- `<link rel="canonical">` のURL
- `news-detail__date` の日付（JP・EN両方）
- `news-detail__badge` のカテゴリ
- `news-detail__title` のタイトル（JP・EN両方）
- `news-detail__text` の説明文（JP・EN両方）
- 外部リンクの `href`（なければ `href=""` のまま → 自動で非表示）
- 写真の `src`（なければ `src=""` のまま）

カテゴリの英語対応:
- 連携 → Partnership
- 採択 → Award / Certified
- 認定 → Award / Certified
- メディア → Media
- イベント → Event

---

### Step 2: news.html のUpdatesリストに追加する

`news.html` の `.news-updates` 内の**先頭**に以下を追加する。

```html
<a href="news/ファイル名.html" class="news-card-full fade-in" data-category="連携">
  <div class="news-card-full__img news-card-full__img--photo">
    <img src="assets/images/写真ファイル名.jpg" alt="写真の説明">
    <!-- 写真がない場合は上の行を削除 -->
  </div>
  <div class="news-card-full__body">
    <div class="news-card-full__meta">
      <span class="news-card-full__date"
            data-jp="2026年X月" data-en="XXX 2026">2026年X月</span>
      <span class="news-card-full__badge"
            data-jp="連携" data-en="Partnership">連携</span>
    </div>
    <p class="news-card-full__title"
       data-jp="日本語タイトル"
       data-en="English title">日本語タイトル</p>
  </div>
</a>
```

`data-category` の値はフィルタータブに対応:
`連携` / `採択` / `認定` / `メディア` / `イベント`

---

### Step 3: index.html のUpdatesリストに追加する

`index.html` の `.hnj__updates-inner` 内の**先頭**に以下を追加する。

```html
<a href="news/ファイル名.html" class="hnj__update-item">
  <div class="hnj__update-thumb">
    <img src="assets/images/写真ファイル名.jpg" alt="写真の説明">
    <!-- 写真がない場合は img タグを削除 -->
  </div>
  <div class="hnj__update-body">
    <div class="hnj__update-meta">
      <span class="hnj__update-date"
            data-jp="2026年X月" data-en="XXX 2026">2026年X月</span>
      <span class="hnj__update-badge"
            data-jp="連携" data-en="Partnership">連携</span>
    </div>
    <p class="hnj__update-title"
       data-jp="日本語タイトル（短め）"
       data-en="English title (short)">日本語タイトル（短め）</p>
  </div>
  <span class="hnj__update-arr" aria-hidden="true">→</span>
</a>
```

---

## Milestonesニュースを追加したい

Milestonesは会社の骨格レベルの実績のみ（JAXAスタートアップ・ブータンLOIなど）。
追加頻度は低い想定。

**news.html**: `.news-milestones__list` の先頭に `news-ms-card` 形式で追加
**index.html**: `.hnj__cards` の中に `hnj__ms-card` 形式で追加

---

## Techを追加したい（だるま落とし形式）

**`js/tech.js` のみを編集する。** technology.htmlは自動で更新される。
index.htmlのTechセクションは自動更新されないため、別途手動で編集が必要。

### Step 1: 現在の「NEXT UP」を正式公開に変更する

`js/tech.js` を開き、`is_planned: true` になっているエントリを探す。

```javascript
// 変更前
num: 'NEXT UP',
is_planned: true,

// 変更後
num: '04',          // 実際の番号に変更
is_planned: false,  // false に変更
```

あわせて以下も更新する:
- `media.src` → 素材のパスに変更
- `date_jp` / `date_en` → 公開日を更新
- `body_jp` / `body_en` → 本文を更新

### Step 2: 新しい「NEXT UP」を配列末尾に追加する

tech.jsのテンプレートを使って追加する（ファイル内にテンプレートあり）。

### Step 3: index.html の Tech セクションを更新する（手動）

`index.html` の `home-tech-full` セクションを開き、必要に応じて動画や
テキストを更新する。tech.jsのデータは自動反映されないため手動で変更する。

---

## index.html の Tech セクションをグリッド式に戻したい

現在 index.html の Tech セクションは `home-tech-full`（フルスクリーン・02動画固定）を使用。
index.html 内にグリッド式のコードがコメントアウトで残っているため、以下の手順で復活できる。

### Step 1: フルスクリーン版をコメントアウトする

index.html の以下の範囲をコメントアウトする。

```html
<!-- ========== TECHNOLOGY — フルスクリーン版 ========== -->
<section class="home-tech-full" id="home-tech">
  ...
</section>
```

### Step 2: グリッド版のコメントアウトを解除する

index.html の以下の範囲のコメントアウトを解除する。

```
<!-- ↓↓↓ TECH GRID（一時コメントアウト中・復活可能）↓↓↓
<section class="home-tech-grid" ...>
  ...
</section>
↑↑↑ TECH GRID ここまで -->
```

### Step 3: syncHomeTechGrid() のコメントアウトを解除する

`js/tech.js` の末尾にある `syncHomeTechGrid()` 関数のコメントアウトを解除する。
これでTECH_ENTRIESのデータがグリッドセルに自動で流し込まれる。

---

## ページの表示・非表示を切り替えたい

`js/main.js` の先頭にあるフラグを変更する。

```javascript
const SHOW_TEAM = false;    // true にするとTeamページ・リンクが表示される
const SHOW_MISSION = true;  // false にするとMissionページ・リンクが非表示になる
```

---

## デプロイ
### GitHub Pages（確認用）
通常の編集・確認は `main` ブランチを使用する。
ディレクトリ（cd ...）は各自の設定に変更する。

```bash
cd ~/Desktop/emblem/homepage
git checkout main
git add .
git commit -m "変更内容"
git push origin main

```
確認URL
https://emblem-media.github.io/emblem-website/
---

## 本番反映（Netlify）
GitHub Pagesで確認完了後、上の方法でpush。そして`main` の内容を `production` ブランチへ反映する。
ディレクトリ（cd ...）は各自の設定に変更する。

```bash

cd ~/Desktop/emblem/homepage
git checkout production
git pull origin production
git merge main
git push origin production
git checkout main

```
反映先
https://emblemandnew.netlify.app/

---
## ブランチ運用

main
- 開発用
- GitHub Pagesで確認
- Netlifyへは反映されない

production
- 本番用
- Netlifyが監視
- pushすると自動デプロイ

---

## 言語切り替え

日本語/英語の切り替えは `data-jp="..."` `data-en="..."` 属性で管理している。
新しいテキストを追加する際は必ず両属性を記載すること。

```html
<p data-jp="日本語テキスト" data-en="English text">日本語テキスト</p>
```

---

## Analytics IDを変更したい

全HTMLファイルの `G-R1NQ5L1PSE` を新しいIDに一括置換する。
対象: index.html, technology.html, news.html, recruit.html, mission.html, team.html, privacy.html, news/以下の全ファイル
