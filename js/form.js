/* ============================================================
   emblem — form.js

   recruit.html の Contact Form を管理：
   • 職種チップ（.chip）の選択/非選択トグル
   • フォーム送信処理（Netlify Forms 統合）
   • 送信後のサンキューメッセージ表示
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ============================================================
     チップ選択制御（職種選択）

     動作：
     • .chip 要素をクリックで .selected クラスをトグル
     • 複数選択可能（職種は最大3個程度推奨）
     • 選択内容は後で form submit 時に hidden field に反映
   ============================================================ */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  /* ============================================================
     Form 送信処理（Netlify Forms 統合）

     フロー：
     1. フォーム送信イベントを取得（preventDefault で通常送信を阻止）
     2. 選択中のチップをテキストに変換して hidden field に格納
     3. FormData を Netlify Forms が要求する URL エンコード形式に変換
     4. fetch で POST 送信（Netlify のフォーム処理エンドポイント）
     5. 成功時は showThankYou() でサンキューメッセージ表示
     6. 失敗時はボタンを再度有効にしてエラーアラート表示

     Netlify Forms:
     - 設定: recruit.html の form に name="contact-form" と netlify 属性が必須
     - 送信先: Netlify が自動で受け取り、メール通知・ダッシュボード保存
     - エラー処理: network/server エラー時はユーザーにアラート表示
   ============================================================ */
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = '送信中…';

    // 選択中のチップをテキスト化して hidden field に格納
    const selected = [...document.querySelectorAll('.chip.selected')]
      .map(c => c.textContent.trim()).join(', ');
    const hiddenSpecialty = form.querySelector('[name="specialty"]');
    if (hiddenSpecialty) hiddenSpecialty.value = selected;

    // Netlify Forms が要求する URL エンコード形式に変換
    const formData = new FormData(form);
    const encoded = new URLSearchParams(formData).toString();

    try {
      // POST で送信（Netlify が自動処理）
      const response = await fetch('/recruit.html', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded,
      });

      if (response.ok) {
        // 送信成功 → サンキューメッセージ表示
        showThankYou();
      } else {
        // サーバーエラー → ボタンを再度有効に
        btn.disabled = false;
        btn.textContent = '送信する →';
        alert('送信に失敗しました。時間をおいて再度お試しください。');
      }
    } catch (err) {
      // ネットワークエラー → ボタンを再度有効に
      btn.disabled = false;
      btn.textContent = '送信する →';
      alert('通信エラーが発生しました。時間をおいて再度お試しください。');
    }
  });

  function showThankYou() {
    const form = document.getElementById('contact-form');
    const ty = document.getElementById('thank-you');
    if (form) form.style.display = 'none';
    if (ty) ty.classList.add('visible');
  }
});
