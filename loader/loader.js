const loader = document.getElementById('loader');
const path = loader.querySelector('path');

// Désactive le scroll pendant le chargement
document.body.style.overflow = 'hidden';

// Récupère la longueur totale du path SVG
const length = path.getTotalLength();

// Stocke cette longueur dans une variable CSS custom pour animation finale
path.style.setProperty('--length', length);

// Initialise animation boucle
path.style.strokeDasharray = 1500;
path.style.strokeDashoffset = 0;
loader.classList.add('loading'); // classe pour boucle d'animation

// Dès que la page est complètement chargée
window.addEventListener('load', () => {
  // Arrête l'animation boucle
  loader.classList.remove('loading');

  // Prépare animation finale complète
  path.style.strokeDasharray = length;
  path.style.strokeDashoffset = length;

  // Force reflow pour appliquer styles immédiatement
  void path.offsetWidth;

  // Ajoute classe 'draw' pour lancer animation dessin final
  loader.classList.add('draw');

  // Après la fin de l'animation dessin (3s ici), on fait disparaître le loader
  setTimeout(() => {
    loader.classList.add('fade-out');

    // Puis on enlève le loader, montre le contenu principal et réactive le scroll
    setTimeout(() => {
      loader.remove();
      document.body.style.overflow = 'auto'; // ✅ scroll réactivé
      const main = document.getElementById('main-content');
      if(main) main.style.opacity = '1';
    }, 1000);
  }, 3000);
});