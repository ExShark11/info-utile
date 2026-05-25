/**
 * Pop-up "Pour aller plus loin" — propose le parcours /trotskysme/ aux
 * lecteurs qui passent ~1 min sur une page d'info-utile.
 *
 * - Pas d'apparition si l'utilisateur est déjà sur /trotskysme/
 * - Pas d'apparition si déjà fermée dans les 7 derniers jours (localStorage)
 * - Déclenchement à 60s passés sur la page
 * - Styles auto-injectés, pas de dépendance CSS externe
 */
(function () {
  if (location.pathname.startsWith('/trotskysme')) return;

  const KEY = 'iu_popup_trotskysme_dismissed_at';
  const COOLDOWN_MS = 7 * 24 * 60 * 60 * 1000; // 7 jours
  const DELAY_MS = 60 * 1000;

  try {
    const last = parseInt(localStorage.getItem(KEY) || '0', 10);
    if (last && Date.now() - last < COOLDOWN_MS) return;
  } catch (_) { /* storage indispo, on continue */ }

  setTimeout(showPopup, DELAY_MS);

  function showPopup() {
    injectStyles();

    const overlay = document.createElement('div');
    overlay.id = 'iu-popup-overlay';
    overlay.innerHTML = `
      <div class="iu-popup" role="dialog" aria-modal="true" aria-labelledby="iu-popup-title">
        <button class="iu-popup__close" aria-label="Fermer">&times;</button>
        <p class="iu-popup__overline">Pour aller plus loin</p>
        <h3 class="iu-popup__title" id="iu-popup-title">Comprendre les bases</h3>
        <p class="iu-popup__lead">Un parcours en 6 chapitres sur le trotskysme — d'où vient cette tradition politique, ce qu'elle défend, et pourquoi elle compte encore aujourd'hui.</p>
        <a class="iu-popup__cta" href="/trotskysme/">Découvrir le parcours &rarr;</a>
        <p class="iu-popup__subtitle">Lecture libre, sans inscription.</p>
      </div>
    `;
    document.body.appendChild(overlay);
    requestAnimationFrame(() => overlay.classList.add('iu-popup-visible'));

    const dismiss = () => {
      try { localStorage.setItem(KEY, String(Date.now())); } catch (_) {}
      overlay.classList.remove('iu-popup-visible');
      setTimeout(() => overlay.remove(), 300);
    };

    overlay.querySelector('.iu-popup__close').addEventListener('click', dismiss);
    overlay.addEventListener('click', (e) => { if (e.target === overlay) dismiss(); });
    overlay.querySelector('.iu-popup__cta').addEventListener('click', () => {
      try { localStorage.setItem(KEY, String(Date.now())); } catch (_) {}
    });
    document.addEventListener('keydown', function escClose(e) {
      if (e.key === 'Escape') { dismiss(); document.removeEventListener('keydown', escClose); }
    });
  }

  function injectStyles() {
    if (document.getElementById('iu-popup-styles')) return;
    const style = document.createElement('style');
    style.id = 'iu-popup-styles';
    style.textContent = `
      #iu-popup-overlay {
        position: fixed; inset: 0;
        background: rgba(10,10,18,0.7);
        -webkit-backdrop-filter: blur(4px);
        backdrop-filter: blur(4px);
        display: flex; align-items: center; justify-content: center;
        z-index: 10000;
        opacity: 0; transition: opacity 0.3s ease;
        padding: 20px;
      }
      #iu-popup-overlay.iu-popup-visible { opacity: 1; }
      .iu-popup {
        background: #FAFBFD;
        border-radius: 16px;
        max-width: 440px; width: 100%;
        padding: 36px 32px 28px;
        box-shadow: 0 20px 60px rgba(0,0,0,0.3);
        position: relative;
        font-family: 'Source Serif 4', Georgia, serif;
        color: #1A1A2E;
        transform: scale(0.95);
        transition: transform 0.3s ease;
      }
      #iu-popup-overlay.iu-popup-visible .iu-popup { transform: scale(1); }
      .iu-popup__close {
        position: absolute; top: 10px; right: 14px;
        background: none; border: none;
        font-size: 28px; line-height: 1;
        color: #8892A8; cursor: pointer;
        padding: 4px 10px; border-radius: 6px;
      }
      .iu-popup__close:hover { color: #C62828; background: rgba(0,0,0,0.04); }
      .iu-popup__overline {
        font-family: 'Inter', sans-serif;
        font-size: 11px; font-weight: 700;
        color: #C62828; letter-spacing: 2px; text-transform: uppercase;
        margin: 0 0 8px;
      }
      .iu-popup__title {
        font-family: 'Playfair Display', serif;
        font-size: 1.5rem; font-weight: 700;
        color: #16213E; margin: 0 0 14px;
        line-height: 1.2;
      }
      .iu-popup__lead {
        font-size: 15px; line-height: 1.6;
        color: #5A6178; margin: 0 0 22px;
      }
      .iu-popup__cta {
        display: inline-block;
        background: #16213E; color: #FFFFFF;
        padding: 12px 24px; border-radius: 8px;
        text-decoration: none;
        font-family: 'Inter', sans-serif;
        font-weight: 600; font-size: 15px;
        transition: background 0.2s;
      }
      .iu-popup__cta:hover { background: #0F3460; }
      .iu-popup__subtitle {
        margin: 14px 0 0;
        font-family: 'Inter', sans-serif;
        font-size: 12px; color: #8892A8;
      }
      @media (max-width: 480px) {
        .iu-popup { padding: 28px 24px 22px; }
        .iu-popup__title { font-size: 1.3rem; }
      }
    `;
    document.head.appendChild(style);
  }
})();
