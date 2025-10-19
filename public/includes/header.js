// header.js
document.write(`
    <!-- Header -->
    <header class="header">
      <!-- Logo -->
      <a href="https://burbanofficial.com/index.html" class="logo-link">
        <img src="https://i.imgur.com/Kl9kTBg.png" alt="Burban Logo" class="logo-img">
      </a>
    
      <!-- Nav desktop -->
      <nav class="nav">
        <a href="https://burbanofficial.com/index.html" class="nav-item">Home</a>
        <a href="https://burbanofficial.com/shop.html" class="nav-item active">Shop</a>
        <a href="https://burbanofficial.com/about-burban.html" class="nav-item">About Burban</a>
        <a href="https://burbanofficial.com/contact.html" class="nav-item">Contact Us</a>
      </nav>
    
      <!-- Icônes + hamburger -->
      <div class="actions">
        <a href="https://burbanofficial.com/account.html" class="account-btn" aria-label="Mon compte"><i class="fa-solid fa-user"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="https://burbanofficial.com/public/index.html" class="cart-btn" aria-label="Mon panier"><i class="fa-solid fa-bag-shopping"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <button class="hamburger" aria-label="Ouvrir le menu">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </button>
        <div class="lang-switcher desktop-lang">
          <select id="languageSelector" aria-label="Changer de langue">
            <option value="EN">EN</option>
            <option value="FR">FR</option>
          </select>
        </div>   
      </div>
    </header>
  
    <!-- Overlay menu mobile -->
    <div class="overlay-menu" id="overlayMenu">
      <button class="close-btn" aria-label="Fermer le menu">&times;</button>
      <ul class="overlay-nav">
        <li><a href="https://burbanofficial.com/index.html">Home</a></li>
        <li><a href="https://burbanofficial.com/shop.html">Shop</a></li>
        <li><a href="https://burbanofficial.com/about-burban.html">About Burban</a></li>
        <li><a href="https://burbanofficial.com/contact.html">Contact Us</a></li>
        <li class="mobile-lang">
          <label for="languageSelectorMobile">Language:</label>
          <select id="languageSelectorMobile" aria-label="Changer de langue">
            <option value="EN">EN</option>
            <option value="FR">FR</option>
          </select>
        </li>
      </ul>
    </div>
  `);

  import gsap from 'https://cdn.skypack.dev/gsap@3.13.0'

(function(){
  const nav = document.querySelector('.nav');
  if(!nav) return console.warn('Nav not found');

  // Création / cleanup du hover Liquid Glass
  const existingHover = nav.querySelector('.nav-hover');
  if (existingHover) existingHover.remove();
  const hover = document.createElement('div');
  hover.className = 'nav-hover';
  nav.appendChild(hover);

  // état cible / actuel pour le "puck"
  let target = { x:0, y:0, w:0, h:0, opacity:0 };
  let current = { x:0, y:0, w:0, h:0, opacity:0 };

  // LERP pour interpolation (vitesse)
  const LERP = 0.99; // augmentez légèrement pour un déplacement plus réactif
  const padX = 14, padY = 10; // padding autour du texte -> définit taille du rectangle

  function measureTextRect(el){
    try {
      const range = document.createRange();
      range.selectNodeContents(el);
      const rect = range.getBoundingClientRect();
      if (!rect || rect.width === 0) return el.getBoundingClientRect();
      return rect;
    } catch {
      return el.getBoundingClientRect();
    }
  }

  function setTargetFromElement(el){
    const navR = nav.getBoundingClientRect();
    const tRect = measureTextRect(el);
    target.w = tRect.width + padX*2;
    target.h = tRect.height + padY*2;
    target.x = tRect.left - navR.left + (tRect.width/2) - (target.w/2);
    target.y = tRect.top - navR.top + (tRect.height/2) - (target.h/2);
    target.opacity = 1;
  }

  function setTargetFollowMouse(clientX){
    const navR = nav.getBoundingClientRect();
    // si on n'a encore aucune taille calculée, on prend la première nav-item comme fallback
    if (current.w <= 0 || current.h <= 0){
      const first = nav.querySelector('.nav-item');
      if(first){
        const tr = measureTextRect(first);
        current.w = tr.width + padX*2;
        current.h = tr.height + padY*2;
      } else {
        current.w = 120; current.h = 44;
      }
    }
    target.w = current.w;
    target.h = current.h;
    target.x = clientX - navR.left - target.w/2;
    target.y = navR.height/2 - target.h/2;
    target.opacity = 1;
  }

  // Events
  nav.addEventListener('mousemove', e=>{
    if(window.matchMedia('(max-width:768px)').matches) return;
    const item = e.target.closest('.nav-item');
    if(item && nav.contains(item)){
      setTargetFromElement(item);
    } else {
      setTargetFollowMouse(e.clientX);
    }
    hover.classList.add('visible');
  });

  nav.addEventListener('mouseleave', ()=>{
    target.opacity = 0;
    hover.classList.remove('visible');
  });

  // click => changer uniquement la classe active (change la couleur du texte)
  nav.querySelectorAll('.nav-item').forEach(item=>{
    item.addEventListener('click', ()=>{
      nav.querySelectorAll('.nav-item.active').forEach(a=>a.classList.remove('active'));
      item.classList.add('active');
    });
  });

  function applyCurrentToHover(){
    hover.style.transform = `translate3d(${Math.round(current.x)}px, ${Math.round(current.y)}px, 0)`;
    hover.style.width = `${Math.round(current.w)}px`;
    hover.style.height = `${Math.round(current.h)}px`;
    hover.style.opacity = String(current.opacity);
  }

  function raf(){
    const easeFactor = 0.99;
    current.x += (target.x - current.x) * LERP;
    current.y += (target.y - current.y) * LERP * easeFactor;
    current.w += (target.w - current.w) * LERP;
    current.h += (target.h - current.h) * LERP;
    current.opacity += (target.opacity - current.opacity) * LERP;
    applyCurrentToHover();
    requestAnimationFrame(raf);
  }

  raf();

  // Recalage simple au resize (évite que hover soit mal positionné après redim)
  window.addEventListener('resize', () => {
    const active = nav.querySelector('.nav-item.active');
    if (active) {
      // repositionne le hover si la souris est au-dessus
      const itemUnderMouse = document.elementFromPoint(window.innerWidth/2, window.innerHeight/2)?.closest?.('.nav-item');
      // on force un update minimal : si active existe, calcule sa cible pour garder fallback propre
      setTargetFromElement(active);
      // et réinitialise current pour éviter glitchs visuels extrêmes
      current.w = target.w; current.h = target.h;
      current.x = target.x; current.y = target.y;
      applyCurrentToHover();
    }
  });

})();



