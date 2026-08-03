/* ============================================================
   emblem — consent.js（Cookie同意管理）

   方針：
   • 同意を得るまで Google Analytics を「一切読み込まない」
     （gtag.js の読み込み自体を同意後まで遅延させる basic consent mode。
       事前に Google へ通信が発生しないため EU 圏で最も安全側）
   • Google Consent Mode v2 の既定値を denied で宣言し、同意後に update
   • 「同意する」と「拒否する」を同等の見た目で提示（EU の要求事項）
   • 同意は localStorage に保存し、フッターの「Cookie設定」から撤回可能
   • 同意の有効期限は 365 日。ポリシー改定時は POLICY_VERSION を上げると再取得

   バナー文言は data-jp / data-en を持ち、JP/EN トグルに追従する。
   ============================================================ */
(function () {
  var GA_ID          = 'G-R1NQ5L1PSE';
  var STORE_KEY      = 'emblem-cookie-consent';
  var LANG_KEY       = 'emblem-lang';
  var POLICY_VERSION = 1;     // Cookie Policy 改定時にインクリメント → 再同意を求める
  var MAX_AGE_DAYS   = 365;   // 同意の有効期限

  /* ── Consent Mode v2: 既定はすべて拒否 ───────────────── */
  window.dataLayer = window.dataLayer || [];
  function gtag() { window.dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage:            'denied',
    ad_user_data:          'denied',
    ad_personalization:    'denied',
    analytics_storage:     'denied',
    functionality_storage: 'granted', // 言語設定など、サイトの動作に必要なもの
    security_storage:      'granted'
  });

  /* ── 保存済みの同意を読む（期限切れ・版ずれは無効扱い） ── */
  function readConsent() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (!raw) return null;
      var rec = JSON.parse(raw);
      if (rec.version !== POLICY_VERSION) return null;
      if (Date.now() - rec.ts > MAX_AGE_DAYS * 864e5) return null;
      return rec.status; // 'granted' | 'denied'
    } catch (e) {
      return null;
    }
  }

  function saveConsent(status) {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify({
        status: status, version: POLICY_VERSION, ts: Date.now()
      }));
    } catch (e) { /* localStorage 不可の環境では都度確認になる */ }
  }

  /* ── GA を読み込む（同意後にのみ呼ばれる） ───────────── */
  var gaLoaded = false;
  function loadGA() {
    if (gaLoaded) return;
    gaLoaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  /* ── GA が落とした Cookie を削除（拒否・撤回時） ──────── */
  function clearGACookies() {
    var host = location.hostname;
    var domains = ['', host, '.' + host];
    var parts = host.split('.');
    if (parts.length > 2) domains.push('.' + parts.slice(-2).join('.'));

    document.cookie.split(';').forEach(function (c) {
      var name = c.split('=')[0].trim();
      if (!/^(_ga|_gid|_gat)/.test(name)) return;
      domains.forEach(function (d) {
        document.cookie = name + '=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
                        + (d ? '; domain=' + d : '');
      });
    });
  }

  /* ── 同意 / 拒否 ─────────────────────────────────────── */
  function grant() {
    saveConsent('granted');
    gtag('consent', 'update', { analytics_storage: 'granted' });
    loadGA();
    hideBanner();
  }

  function deny() {
    saveConsent('denied');
    gtag('consent', 'update', { analytics_storage: 'denied' });
    clearGACookies();
    hideBanner();
  }

  /* ── バナー ──────────────────────────────────────────── */
  var banner = null;

  var TEXT = {
    body: {
      jp: '本サイトでは，サイトの利用状況を把握し改善するためにCookieを使用します。分析用Cookieは同意いただいた場合にのみ使用します。詳しくは',
      en: 'We use cookies to understand how our site is used and to improve it. Analytics cookies are used only with your consent. For details, see our '
    },
    link:   { jp: 'Cookieポリシー', en: 'Cookie Policy' },
    tail:   { jp: 'をご覧ください。', en: '.' },
    accept: { jp: '同意する',       en: 'Accept' },
    reject: { jp: '拒否する',       en: 'Reject' }
  };

  function lang() {
    return localStorage.getItem(LANG_KEY) === 'en' ? 'en' : 'jp';
  }

  // news/ 配下からは 1 階層上を参照する
  function policyHref() {
    return (location.pathname.indexOf('/news/') !== -1 ? '../' : '') + 'cookie.html';
  }

  function applyBannerLang() {
    if (!banner) return;
    var l = lang();
    banner.querySelectorAll('[data-jp]').forEach(function (el) {
      el.textContent = l === 'jp' ? el.dataset.jp : el.dataset.en;
    });
  }

  function buildBanner() {
    banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-live', 'polite');
    banner.setAttribute('aria-label', 'Cookie consent');

    banner.innerHTML =
      '<div class="cookie-banner__inner">' +
        '<p class="cookie-banner__text">' +
          '<span data-jp="' + TEXT.body.jp + '" data-en="' + TEXT.body.en + '"></span>' +
          '<a class="cookie-banner__link" href="' + policyHref() + '"' +
             ' data-jp="' + TEXT.link.jp + '" data-en="' + TEXT.link.en + '"></a>' +
          '<span data-jp="' + TEXT.tail.jp + '" data-en="' + TEXT.tail.en + '"></span>' +
        '</p>' +
        '<div class="cookie-banner__actions">' +
          '<button type="button" class="cookie-btn cookie-btn--reject"' +
                 ' data-jp="' + TEXT.reject.jp + '" data-en="' + TEXT.reject.en + '"></button>' +
          '<button type="button" class="cookie-btn cookie-btn--accept"' +
                 ' data-jp="' + TEXT.accept.jp + '" data-en="' + TEXT.accept.en + '"></button>' +
        '</div>' +
      '</div>';

    banner.querySelector('.cookie-btn--accept').addEventListener('click', grant);
    banner.querySelector('.cookie-btn--reject').addEventListener('click', deny);

    document.body.appendChild(banner);
    applyBannerLang();
    // rAF はバックグラウンドタブで停止しうるため setTimeout で確実に表示させる
    setTimeout(function () { banner.classList.add('visible'); }, 20);
  }

  function showBanner() {
    if (banner) {
      banner.classList.add('visible');
      applyBannerLang();
    } else {
      buildBanner();
    }
  }

  function hideBanner() {
    if (banner) banner.classList.remove('visible');
  }

  /* ── 起動 ────────────────────────────────────────────── */
  function init() {
    var consent = readConsent();

    if (consent === 'granted') {
      gtag('consent', 'update', { analytics_storage: 'granted' });
      loadGA();
    } else {
      // 同意がない状態で GA Cookie が残っていれば削除する
      // （同意取得を導入する前に訪問された方の Cookie もここで消える）
      clearGACookies();
      if (consent === null) showBanner(); // 未回答のときだけ表示。拒否済みは何もしない
    }

    // JP/EN トグルにバナー文言を追従させる
    document.querySelectorAll('.lang-toggle__item').forEach(function (btn) {
      btn.addEventListener('click', function () { setTimeout(applyBannerLang, 0); });
    });

    // フッターの「Cookie設定」から再表示（同意の撤回導線）
    document.querySelectorAll('[data-cookie-settings]').forEach(function (el) {
      el.addEventListener('click', function (e) {
        e.preventDefault();
        showBanner();
      });
    });
  }

  // 外部から呼べる同意撤回用API
  window.emblemCookieSettings = showBanner;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
