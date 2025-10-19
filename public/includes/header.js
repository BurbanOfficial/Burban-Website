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
