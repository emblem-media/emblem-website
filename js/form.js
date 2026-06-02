/* ============================================================
   Emblem — form.js
   Contact Form — chip selection, validation, submit handling
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Chips ---------- */
  document.querySelectorAll('.chip').forEach(chip => {
    chip.addEventListener('click', () => {
      chip.classList.toggle('selected');
    });
  });

  /* ---------- Form submit ---------- */
  const form = document.getElementById('contact-form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    btn.disabled = true;
    btn.textContent = '送信中…';

    // チップの選択内容をhidden fieldに反映
    const selected = [...document.querySelectorAll('.chip.selected')]
      .map(c => c.textContent.trim()).join(', ');
    const hiddenSpecialty = form.querySelector('[name="specialty"]');
    if (hiddenSpecialty) hiddenSpecialty.value = selected;

    // Netlify Formsが要求する形式に変換
    const formData = new FormData(form);
    const encoded = new URLSearchParams(formData).toString();

    try {
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encoded,
      });

      if (response.ok) {
        showThankYou();
      } else {
        btn.disabled = false;
        btn.textContent = '送信する →';
        alert('送信に失敗しました。時間をおいて再度お試しください。');
      }
    } catch (err) {
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
