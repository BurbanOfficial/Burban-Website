// footer.js
document.write(`
  <footer class="footer">
    <style>
      /* style spécifique pour le logo CB (écran et impression) */
      .cb-logo {
        width: 45px;
        min-width: 45px;
        height: auto;
        display: block;
        margin-top: 8px;
      }
      /* Pour l'impression : largeur minimale 16.8mm */
      @media print {
        .cb-logo {
          width: 16.8mm !important;
          min-width: 16.8mm !important;
          height: auto;
        }
      }
    </style>

    <div class="footer-container">
      <div class="footer-brand">
        <img src="https://i.imgur.com/Nup8sfC.png" alt="Burban Logo">
        <p>More than a brand, an identity.</p>
        <!-- Logo CB paiement sécurisé — largeur d'affichage 45px (écran) / 16.8mm (print) -->
        <img
          src="https://imgur.com/hOHypRr.png"
          alt="CB Paiement sécurisé"
          class="cb-logo"
          loading="lazy"
          width="45"
        >
      </div>
      <div class="footer-links">
        <div>
          <h4>Navigation</h4>
          <a href="https://burbanofficial.com/index.html">Home</a>
          <a href="https://burbanofficial.com/shop.html">Shop</a>
          <a href="https://burbanofficial.com/about-burban.html">About Burban</a>
          <a href="https://burbanofficial.com/contact.html">Contact Us</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="https://burbanofficial.com/legality/legal-notice.html">Legal Notice</a>
          <a href="https://burbanofficial.com/legality/TCS.html">TCS</a>
        </div>
        <div>
          <h4>Follow us</h4>
          <a href="https://www.instagram.com/burban.official/" target="_blank">Instagram</a>
          <a href="https://www.facebook.com/profile.php?id=61566473957609" target="_blank">Facebook</a>
          <a href="https://www.tiktok.com/@burban.official" target="_blank">TikTok</a>
          <a href="https://www.whatsapp.com/channel/0029VamoSXlDJ6GxgWLAmz17" target="_blank">WhatsApp</a>
        </div>
      </div>
    </div>
    <div class="footer-bottom">
      &copy; 2024 - <span id="year"></span> Burban. All Rights Reserved.
    </div>
  </footer>
  <script>
    document.getElementById('year').textContent = new Date().getFullYear();
  <\/script>
`);
