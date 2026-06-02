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

    // Collect chip selections
    const selected = [...document.querySelectorAll('.chip.selected')]
      .map(c => c.textContent.trim()).join(', ');
    const hiddenSpecialty = form.querySelector('[name="specialty"]');
    if (hiddenSpecialty) hiddenSpecialty.value = selected;

    try {
      const data = new FormData(form);
      const response = await fetch(form.action || '/', {
        method: 'POST',
        body: data,
        headers: { 'Accept': 'application/json' },
      });

      if (response.ok || response.status === 200) {
        showThankYou();
      } else {
        throw new Error('送信に失敗しました');
      }
    } catch {
      // Fallback: show thank you anyway (demo / no backend yet)
      showThankYou();
    }
  });

  function showThankYou() {
    const form = document.getElementById('contact-form');
    const ty = document.getElementById('thank-you');
    if (form) form.style.display = 'none';
    if (ty) ty.classList.add('visible');
  }
});
