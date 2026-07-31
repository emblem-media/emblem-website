/* ============================================================
   emblem — form.js

   recruit.html / contact.html のフォームを管理（共通）：
   • 職種チップ（.chip）の選択トグル（recruit のみ）
   • referral 詳細欄の出し分け（recruit のみ）
   • フォーム送信処理（Netlify Forms 統合）
   • 送信後のサンキューメッセージ表示

   複数の Netlify フォームに対応：
   form[data-netlify] を全て対象にし、各フォームは自ページへ POST する。
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── 職種チップ（recruit）: クリックで選択トグル ── */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => chip.classList.toggle('selected'));
  });

  /* ── 現在のご状況（recruit）: 所属先がある状況のときだけ「所属」欄を表示 ── */
  const status = document.getElementById('status');
  const affiliation = document.getElementById('affiliation-group');
  if (status && affiliation) {
    const showFor = ['employed', 'self_employed', 'university', 'student_other', 'other'];
    status.addEventListener('change', () => {
      const show = showFor.includes(status.value);
      affiliation.style.display = show ? '' : 'none';
      if (!show) {
        const inp = affiliation.querySelector('input');
        if (inp) inp.value = '';
      }
    });
  }

  /* ── きっかけ（recruit）: 特定選択肢のときだけ詳細欄を表示 ── */
  const referral = document.getElementById('referral');
  const referralDetail = document.getElementById('referral-detail-group');
  if (referral && referralDetail) {
    const showFor = ['job_site', 'event', 'news', 'other'];
    referral.addEventListener('change', () => {
      const show = showFor.includes(referral.value);
      referralDetail.style.display = show ? '' : 'none';
      if (!show) {
        const inp = referralDetail.querySelector('input');
        if (inp) inp.value = '';
      }
    });
  }

  /* ============================================================
     Netlify フォーム送信（recruit / contact 共通）
     フロー：
     1. submit を preventDefault（ネイティブ検証は通過済み＝required満たす）
     2. チップ選択を hidden field に反映（存在する場合のみ）
     3. FormData を URL エンコードして自ページへ fetch POST
     4. 成功で同じ .contact-form-inner 内の .thank-you を表示
     5. 失敗はボタンを戻してアラート
   ============================================================ */
  document.querySelectorAll('form[data-netlify]').forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('[type="submit"]');
      const btnHtml = btn ? btn.innerHTML : '';
      if (btn) { btn.disabled = true; btn.textContent = '送信中…'; }

      /* チップ選択 → hidden specialty（recruit のみ） */
      const hiddenSpecialty = form.querySelector('[name="specialty"]');
      if (hiddenSpecialty) {
        hiddenSpecialty.value = [...form.querySelectorAll('.chip.selected')]
          .map(c => c.textContent.trim()).join(', ');
      }

      const encoded = new URLSearchParams(new FormData(form)).toString();
      const action = form.getAttribute('action') || window.location.pathname;

      try {
        const res = await fetch(action, {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: encoded,
        });

        if (res.ok) {
          const inner = form.closest('.contact-form-inner') || form.parentNode;
          const ty = inner.querySelector('.thank-you');
          form.style.display = 'none';
          if (ty) ty.classList.add('visible');
        } else {
          if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
          alert('送信に失敗しました。時間をおいて再度お試しください。');
        }
      } catch (err) {
        if (btn) { btn.disabled = false; btn.innerHTML = btnHtml; }
        alert('通信エラーが発生しました。時間をおいて再度お試しください。');
      }
    });
  });
});
