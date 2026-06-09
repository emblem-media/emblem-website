# Emblem Website

## ファイル構成

```
/
├── index.html          ホームページ
├── technology.html     技術・飛行試験一覧
├── news.html           ニュース一覧
├── recruit.html        採用ページ
├── team.html           チームページ（SHOW_TEAM=falseで非表示）
├── privacy.html        プライバシーポリシー
├── technology/         飛行試験の個別ページ
│   ├── hands-free.html
│   ├── stable-hovering.html
│   ├── hunging-start.html
│   ├── first-flight.html
│   └── system-integration.html
├── css/
│   └── style.css       全ページ共通スタイル
├── js/
│   ├── main.js         Nav・言語切り替え・アニメーション等の共通JS
│   ├── form.js         採用フォームの送信処理
│   ├── news.js         NEWS_ITEMSデータ + index.htmlのNewsカルーセル生成
│   └── tech.js         TECH_TESTSデータ + technology.htmlのArchive生成
└── assets/
    ├── images/         ロゴ・写真等
    └── videos/         飛行試験動画（mp4）
```

---

## よくある更新作業

### ニュースを追加したい

**重要**: ニュースは **2つのファイル** で管理されています。
- `news.html`：ニュース一覧ページ
- `js/news.js`：HOME ページのニュースバンド（最新4件）を自動生成

両ファイルを更新することで、ニュース一覧と HOME ページの両方が同時に反映されます。

#### Step 1: news.html にニュースカードを追加

`news.html` を開いて、`id="news-list"` の **最初（一番上）** に新しいカード HTML を挿入します。

**コピペ用テンプレート** (`<div class="news-card-full...` 以下をコピーして新しい日付とテキストを入力):

```html
<!-- 新しい順に配置（最新のニュースを一番上に） -->
<div class="news-card-full fade-in" data-category="連携">
  <div class="news-card-full__img news-card-full__img--photo">
    <!-- 画像がある場合: -->
    <!-- <img src="assets/images/xxx.jpg" alt="説明文"> -->
    
    <!-- 画像がない場合（プレースホルダー）: -->
    <div style="width:100%;height:100%;background:#f0f0f0;display:flex;align-items:center;justify-content:center;color:#999;font-size:12px;letter-spacing:.05em;">No Image</div>
  </div>
  <div class="news-card-full__body">
    <div class="news-card-full__meta">
      <span class="news-card-full__date" data-jp="2026年X月" data-en="XXX 2026">2026年X月</span>
      <span class="news-card-full__badge" data-jp="カテゴリ名" data-en="Category">カテゴリ名</span>
    </div>
    <p class="news-card-full__title" data-jp="日本語タイトル" data-en="English title">日本語タイトル</p>
  </div>
</div>
```

**入力するポイント:**
- `data-jp="..."` と `data-en="..."` は日本語と英語の両方を必ず入力（言語切り替えに使用）
- `data-category="連携"` は以下から選択:
  - `"連携"` （パートナーシップ）
  - `"採択"` （プログラム採択）
  - `"認定"` （認定・資格）
  - `"メディア"` （メディア掲載）

#### Step 2: js/news.js の NEWS_ITEMS に同じニュースを追加

次に `js/news.js` を開いて、**`NEWS_ITEMS` 配列の先頭** に同じニュース情報を追加します。

**コピペ用テンプレート:**

```javascript
{
  date_jp: "2026年X月",         // 日本語日付
  date_en: "XXX 2026",          // 英語日付（例: "Jan 2026", "Dec 2024"）
  category: "連携",             // カテゴリ: 連携 / 採択 / 認定 / メディア
  title_jp: "日本語タイトル",   // ニュースのタイトル（日本語）
  title_en: "English title",    // ニュースのタイトル（英語）
  link: null                    // 外部リンク: URLがあればここに入力、なければ null
},
```

**具体例:**

```javascript
{
  date_jp: "2026年1月",
  date_en: "Jan 2026",
  category: "連携",
  title_jp: "ブータン政府とのLOI調印。首相来日時にJETROビジネスセミナーで登壇。",
  title_en: "LOI signed with the Government of Bhutan. Presented at JETRO Business Seminar during Prime Minister's visit to Japan.",
  link: null
},
```

#### 反映確認

両ファイルを更新して保存したら：
- `news.html` でニュース一覧ページに新しいカードが表示される
- `index.html` でニュースが最新4件に入った場合、HOME ページのニュースバンドにも自動で表示される

---

### Tech を追加したい（だるま落とし形式）

**重要**: `js/tech.js` **のみ** を編集してください。`index.html` と `technology.html` は自動で更新されます。

**仕組みの説明:**
- `is_planned: false` の最新3件が HOME ページの Tech Grid に自動表示（だるま落とし式で次々と入れ替わる）
- `is_planned: true` の1件が「NEXT UP」セクションに薄く表示される
- `technology.html` には `visible: true` のすべてが自動生成される

#### Step 1: 現在の「NEXT UP」エントリを本番化（公開）する

`js/tech.js` の `TECH_ENTRIES` 配列内の、現在 `is_planned: true` になっているエントリを探して、以下を変更します：

```javascript
// 変更前:
{
  id: 'vision',
  num: 'NEXT UP',
  is_planned: true,
  // ... 他のフィールド
}

// 変更後: （例として num を '03' に変更した場合）
{
  id: 'vision',
  num: '03',          // ← 'NEXT UP' → '03' に変更
  is_planned: false,  // ← true → false に変更
  // ... 他のフィールドはそのまま
}
```

**各フィールドの説明:**
- `id`: 一意の ID（英数字・ハイフンのみ）。後で個別ページを作る時に使用
- `num`: 番号。'NEXT UP' 以外は '01', '02', '03' など
- `visible`: `true` で表示、`false` で非表示（通常は `true`）
- `is_planned`: `true` = NEXT UP（準備中）/ `false` = 本番公開
- `media.type`: 'photo' または 'video'
- `media.src`: 素材のパス（例: `'assets/images/xxx.jpg'` または `'assets/videos/xxx.mp4'`）。未入手なら `null`
- `media.alt`: 画像の説明文
- `link`: 個別ページのリンク先。未設定なら `null`

#### Step 2: 新しい「NEXT UP」エントリを配列末尾に追加

`TECH_ENTRIES` 配列の **最後** に新しいエントリを追加します。**必ず `is_planned: true` で設定してください。**

**コピペ用テンプレート** (最後のエントリの後に `,` をつけてペースト):

```javascript
{
  id: 'new-feature',              // ← ユニークな ID に変更
  num: 'NEXT UP',                 // ← そのまま
  visible: true,                  // ← そのまま
  is_planned: true,               // ← そのまま（本番化されるまで true）
  media: {
    type: 'photo',                // ← 'photo' または 'video'
    src: null,                    // ← 素材パス、未入手なら null
    alt: '説明文'                 // ← 画像説明文
  },
  date_jp: 'Coming Soon',         // ← 公開予定時期（日本語）
  date_en: 'Coming Soon',         // ← 公開予定時期（英語）
  title_jp: '次の技術名',         // ← タイトル（日本語）
  title_en: 'Next Feature Name',  // ← タイトル（英語）
  body_jp: '説明文（日本語）...',  // ← 本文（日本語。複数行OK）
  body_en: 'Description...',      // ← 本文（英語。複数行OK）
  link: null                      // ← 個別ページのリンク先、未設定なら null
}
```

**具体例:**

```javascript
{
  id: 'stabilizer',
  num: 'NEXT UP',
  visible: true,
  is_planned: true,
  media: {
    type: 'photo',
    src: null,                    // 素材はまだ未入手
    alt: '新型安定化システムの写真'
  },
  date_jp: 'Coming Soon',
  date_en: 'Coming Soon',
  title_jp: '安定化システムの進化',
  title_en: 'Evolution of Stabilization',
  body_jp: `新しい安定化システムについての説明...`,
  body_en: `Explanation of new stabilization system...`,
  link: null
}
```

#### デプロイ

`js/tech.js` を保存して git push するだけで、HOME ページと technology ページが自動で更新されます。

---

### チームページを公開したい

`js/main.js` の先頭にある以下の行を変更する。

```javascript
const SHOW_TEAM = false;  // ← true に変えるだけで全ページのTeamリンクが出現
```

---

### フッターのメールアドレスを変えたい

現状: 各HTMLファイルのフッターに直接書かれているため、全ファイルを変更する必要がある。
（将来的にPhase 2: コンポーネント共通化で解消予定）

対象ファイル:
- index.html, technology.html, news.html, recruit.html, team.html, privacy.html
- technology/ 以下の全HTMLファイル

---

## デプロイ

GitHubのmainブランチにpushすると、Netlifyが自動でデプロイする。
URL: https://emblemand.netlify.app

動画ファイルはリポジトリに含めない（.gitignore参照）。
動画はCloudflare R2に格納し、HTMLのsrc属性でURLを参照する。

↑現状できていない。githubで全てまとめて公開中。将来的にはこの方法に移行。

---

## 言語切り替え

日本語/英語の切り替えは `data-jp="..."` `data-en="..."` 属性で管理している。
新しいテキストを追加する際は必ず両属性を記載すること。
`js/main.js` の `initLang()` 関数が全ページで処理する。

---

## OGP画像

- ファイル: assets/images/og-image.jpg
- 推奨サイズ: 1200×630px
- 用途: SNSシェア時のサムネイル
- 現状: プレースホルダー未設置。画像を用意してこのパスに配置すること。
