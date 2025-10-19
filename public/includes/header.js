// header.js — version document.write
  document.write(`
    <!-- START BURBAN HEADER (injected via document.write) -->
    <!-- SVG filters -->
    <svg aria-hidden="true" style="position:absolute;width:0;height:0;overflow:hidden;" id="burban-svg-filters">
      <defs>
        <filter id="liquid" x="-20%" y="-20%" width="140%" height="140%" primitiveUnits="objectBoundingBox">
          <feTurbulence id="feTurb" type="fractalNoise" baseFrequency="0.008 0.012" numOctaves="2" stitchTiles="stitch" result="noise"/>
          <feGaussianBlur stdDeviation="0.6" in="noise" result="noiseBlur"/>
          <feDisplacementMap id="feDisp" in="SourceGraphic" in2="noiseBlur" scale="8" xChannelSelector="R" yChannelSelector="G"/>
        </filter>
      </defs>
    </svg>

    <svg style="position:absolute;width:0;height:0;">
      <filter id="goo">
        <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur"/>
        <feColorMatrix in="blur" mode="matrix"
          values="1 0 0 0 0
                  0 1 0 0 0
                  0 0 1 0 0
                  0 0 0 16 -10" result="goo"/>
        <feBlend in="SourceGraphic" in2="goo"/>
      </filter>
    </svg>

    <!-- Header -->
    <header class="header">
      <a href="/index.html" class="logo-link">
        <img src="https://i.imgur.com/Kl9kTBg.png" alt="Burban Logo" class="logo-img">
      </a>

      <nav class="nav">
        <a href="/index.html" class="nav-item">Home</a>
        <a href="/shop.html" class="nav-item">Shop</a>
        <a href="/about-burban.html" class="nav-item">About Burban</a>
        <a href="/contact.html" class="nav-item">Contact Us</a>
      </nav>

      <div class="actions">
        <a href="/account.html" class="account-btn" aria-label="Mon compte"><i class="fa-solid fa-user"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;
        <a href="/public/index.html" class="cart-btn" aria-label="Mon panier"><i class="fa-solid fa-bag-shopping"></i></a>&nbsp;&nbsp;&nbsp;&nbsp;
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
        <li><a href="/index.html">Home</a></li>
        <li><a href="/shop.html">Shop</a></li>
        <li><a href="/about-burban.html">About Burban</a></li>
        <li><a href="/contact.html">Contact Us</a></li>
        <li class="mobile-lang">
          <label for="languageSelectorMobile">Language:</label>
          <select id="languageSelectorMobile" aria-label="Changer de langue">
            <option value="EN">EN</option>
            <option value="FR">FR</option>
          </select>
        </li>
      </ul>
    </div>

    <!-- Inline init scripts (overlay, language, year, active nav, nav puck) -->
    <script>
      (function(){
        // Safety: si déjà initialisé, on skip
        if (window.__BURBAN_HEADER_INIT) return;
        window.__BURBAN_HEADER_INIT = true;

        // Helper : safe query selectors
        function $sel(s, root){ try { return (root||document).querySelector(s); } catch(e){ return null; } }
        function $selAll(s, root){ try { return Array.from((root||document).querySelectorAll(s)); } catch(e){ return []; } }

        // Overlay menu
        var hamburger = $sel('.hamburger');
        var overlay = $sel('#overlayMenu');
        if (hamburger && overlay){
          var closeBtn = overlay.querySelector('.close-btn');
          hamburger.addEventListener('click', function(){
            overlay.classList.add('open');
            document.body.style.overflow = 'hidden';
          });
          closeBtn && closeBtn.addEventListener('click', function(){
            overlay.classList.remove('open');
            document.body.style.overflow = 'auto';
          });
          overlay.querySelectorAll('a').forEach(function(a){
            a.addEventListener('click', function(){ overlay.classList.remove('open'); document.body.style.overflow = 'auto'; });
          });
        }

        // Language selectors
        function handleLang(v){
          if (v === 'EN') window.location.href = 'https://burbanofficial.com/';
          else if (v === 'FR') window.location.href = 'https://burbanofficial.com/FR-fr/';
        }
        var s1 = document.getElementById('languageSelector');
        var s2 = document.getElementById('languageSelectorMobile');
        if (s1) s1.addEventListener('change', function(){ handleLang(this.value); });
        if (s2) s2.addEventListener('change', function(){ handleLang(this.value); });

        // Update year if element present
        var y = document.getElementById('year');
        if (y) y.textContent = new Date().getFullYear();

        // Set active nav item based on current path
        (function setActive(){
          var nav = $sel('.nav');
          if (!nav) return;
          var items = $selAll('.nav-item', nav);
          items.forEach(function(i){ i.classList.remove('active'); });
          var path = location.pathname.split('/').pop() || 'index.html';
          var mapping = {
            'index.html': 0,
            'shop.html': 1,
            'about-burban.html': 2,
            'contact.html': 3
          };
          var idx = mapping[path];
          if (typeof idx === 'number' && items[idx]) {
            items[idx].classList.add('active');
          } else {
            // fallback : match by href ending
            items.forEach(function(it){
              try {
                var href = it.getAttribute('href') || '';
                if (href.endsWith(path) || (path === '' && href.endsWith('index.html'))) it.classList.add('active');
              } catch(e){}
            });
          }
        })();

        // Nav puck (liquid glass) — sans gsap
        (function initPuck(){
          var nav = $sel('.nav');
          if (!nav) return;
          // cleanup existing
          var existing = nav.querySelector('.nav-hover');
          if (existing) existing.parentNode.removeChild(existing);
          var hover = document.createElement('div');
          hover.className = 'nav-hover';
          nav.appendChild(hover);

          var target = { x:0, y:0, w:0, h:0, opacity:0 };
          var current = { x:0, y:0, w:0, h:0, opacity:0 };
          var LERP = 0.99;
          var padX = 14, padY = 10;

          function measureTextRect(el){
            try {
              var range = document.createRange();
              range.selectNodeContents(el);
              var rect = range.getBoundingClientRect();
              if (!rect || rect.width === 0) return el.getBoundingClientRect();
              return rect;
            } catch(e) {
              return el.getBoundingClientRect();
            }
          }

          function setTargetFromElement(el){
            var navR = nav.getBoundingClientRect();
            var tRect = measureTextRect(el);
            target.w = tRect.width + padX*2;
            target.h = tRect.height + padY*2;
            target.x = tRect.left - navR.left + (tRect.width/2) - (target.w/2);
            target.y = tRect.top - navR.top + (tRect.height/2) - (target.h/2);
            target.opacity = 1;
          }

          function setTargetFollowMouse(clientX){
            var navR = nav.getBoundingClientRect();
            if (current.w <= 0 || current.h <= 0){
              var first = nav.querySelector('.nav-item');
              if(first){
                var tr = measureTextRect(first);
                current.w = tr.width + padX*2;
                current.h = tr.height + padY*2;
              } else { current.w = 120; current.h = 44; }
            }
            target.w = current.w;
            target.h = current.h;
            target.x = clientX - navR.left - target.w/2;
            target.y = navR.height/2 - target.h/2;
            target.opacity = 1;
          }

          nav.addEventListener('mousemove', function(e){
            if(window.matchMedia('(max-width:768px)').matches) return;
            var item = e.target.closest ? e.target.closest('.nav-item') : null;
            if (item && nav.contains(item)) setTargetFromElement(item);
            else setTargetFollowMouse(e.clientX);
            hover.classList.add('visible');
          });

          nav.addEventListener('mouseleave', function(){
            target.opacity = 0;
            hover.classList.remove('visible');
          });

          nav.querySelectorAll('.nav-item').forEach(function(item){
            item.addEventListener('click', function(){
              nav.querySelectorAll('.nav-item.active').forEach(function(a){ a.classList.remove('active'); });
              item.classList.add('active');
            });
          });

          function applyCurrent(){
            hover.style.transform = 'translate3d(' + Math.round(current.x) + 'px,' + Math.round(current.y) + 'px,0)';
            hover.style.width = Math.round(current.w) + 'px';
            hover.style.height = Math.round(current.h) + 'px';
            hover.style.opacity = String(current.opacity);
          }

          (function raf(){
            current.x += (target.x - current.x) * LERP;
            current.y += (target.y - current.y) * LERP;
            current.w += (target.w - current.w) * LERP;
            current.h += (target.h - current.h) * LERP;
            current.opacity += (target.opacity - current.opacity) * LERP;
            applyCurrent();
            requestAnimationFrame(raf);
          })();

          window.addEventListener('resize', function(){
            var active = nav.querySelector('.nav-item.active');
            if (active) {
              setTargetFromElement(active);
              current.w = target.w; current.h = target.h; current.x = target.x; current.y = target.y;
              applyCurrent();
            }
          });
        })();

      })();
    </script>
    <!-- END BURBAN HEADER (injected) -->
  `);
})();
