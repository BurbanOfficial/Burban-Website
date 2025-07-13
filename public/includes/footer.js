// footer.js
document.write(`
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-brand">
        <img src="https://i.imgur.com/Nup8sfC.png" alt="Burban Logo">
        <p>More than a brand, an identity.</p>
      </div>
      <div class="footer-links">
        <div>
          <h4>Navigation</h4>
          <a href="index.html">Home</a>
          <a href="shop.html">Shop</a>
          <a href="about-burban.html">About Burban</a>
          <a href="contact.html">Contact Us</a>
        </div>
        <div>
          <h4>Support</h4>
          <a href="/legality/legal-notice.html">Legal Notice</a>
          <a href="/legality/TCS.html">TCS</a>
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
