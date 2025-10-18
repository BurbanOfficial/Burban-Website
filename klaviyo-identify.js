// ===============================================
// 🔗 BURBAN x Firebase x Klaviyo Integration
// Place ce fichier sur toutes les pages du site
// Nécessite : Firebase Auth + Snippet Klaviyo
// ===============================================

(function() {
  // --------- UTILITAIRES ---------
  function setOrUpdateQueryParam(key, value) {
    try {
      const url = new URL(window.location.href);
      const params = url.searchParams;
      if (params.get(key) !== value) {
        params.set(key, value);
        const newUrl = url.pathname + '?' + params.toString() + url.hash;
        history.replaceState(null, '', newUrl);
      }
    } catch (err) {
      console.error('Erreur lors de la mise à jour de l’URL :', err);
    }
  }

  function safeEmailForUrl(email) {
    return encodeURIComponent(email.trim().toLowerCase());
  }

  // --------- FONCTION PRINCIPALE ---------
  function initKlaviyoIdentify() {
    if (!window.firebase || !firebase.auth) {
      console.warn('Firebase Auth non détecté sur cette page.');
      return;
    }

    firebase.auth().onAuthStateChanged(function(user) {
      if (user && user.email) {
        const email = user.email.trim().toLowerCase();
        const encodedEmail = safeEmailForUrl(email);

        // 1️⃣ Ajoute ?utm_email= à l’URL sans recharger
        setOrUpdateQueryParam('utm_email', encodedEmail);

        // 2️⃣ Identifie l’utilisateur dans Klaviyo
        try {
          if (typeof klaviyo === 'object' && typeof klaviyo.push === 'function') {
            klaviyo.push(['identify', { '$email': email }]);
            klaviyo.push(['track', 'User Logged In', { source: 'Firebase' }]);
            console.log('[Klaviyo] Utilisateur identifié via klaviyo.push');
          } else if (typeof klaviyo === 'object' && typeof klaviyo.identify === 'function') {
            klaviyo.identify({ email: email });
            klaviyo.track('User Logged In', { source: 'Firebase' });
            console.log('[Klaviyo] Utilisateur identifié via klaviyo.identify');
          } else if (window._learnq && typeof _learnq.push === 'function') {
            _learnq.push(['identify', { '$email': email }]);
            _learnq.push(['track', 'User Logged In', { source: 'Firebase' }]);
            console.log('[Klaviyo] Utilisateur identifié via _learnq');
          } else {
            console.warn('[Klaviyo] Script non détecté sur cette page.');
          }
        } catch (e) {
          console.error('Erreur Klaviyo identify:', e);
        }
      } else {
        console.log('[Klaviyo] Aucun utilisateur connecté.');
      }
    });
  }

  // --------- INITIALISATION ---------
  document.addEventListener('DOMContentLoaded', function() {
    initKlaviyoIdentify();
  });
})();
