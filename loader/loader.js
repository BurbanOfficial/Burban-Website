const loader = document.getElementById('loader');
  const path = loader.querySelector('path');

  // Longueur totale du path
  const length = path.getTotalLength();

  // Stocke dans une variable CSS custom property pour l'animation finale
  path.style.setProperty('--length', length);

  // Initialisation pour animation boucle (loader)
  path.style.strokeDasharray = 1500;
  path.style.strokeDashoffset = 0;
  loader.classList.add('loading'); // classe pour boucle

  // Quand la page est complètement chargée
  window.addEventListener('load', () => {
    // Stop la boucle
    loader.classList.remove('loading');

    // Prépare l'animation finale
    path.style.strokeDasharray = length;
    path.style.strokeDashoffset = length;

    // Force reflow pour appliquer les styles (important)
    void path.offsetWidth;

    // Ajoute la classe 'draw' qui déclenche animation dessin final
    loader.classList.add('draw');

    // Quand animation dessin final terminée (3s), on masque le loader
    setTimeout(() => {
      loader.classList.add('fade-out');

      // Puis on enlève le loader et affiche le contenu
      setTimeout(() => {
        loader.remove();
        document.getElementById('main-content').style.opacity = '1';
      }, 1000);
    }, 3000);
  });