// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDb4AOtRT7jGENnLZ2KNwpczaG2Z77G2rc",
    authDomain: "burban-fidelity.firebaseapp.com",
    projectId: "burban-fidelity",
    storageBucket: "burban-fidelity.firebasestorage.app",
    messagingSenderId: "830299174800",
    appId: "1:830299174800:web:f50a4ec419e108f7f16515",
    measurementId: "G-E4QD4PYLM5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// Toggle password visibility with FontAwesome icons
function togglePassword(el, inputId) {
    const input = document.getElementById(inputId);
    const isPassword = input.getAttribute('type') === 'password';
    input.setAttribute('type', isPassword ? 'text' : 'password');
    // Update icon
    el.innerHTML = isPassword
      ? '<i class="fa-solid fa-eye"></i>'
      : '<i class="fa-solid fa-eye-low-vision"></i>';
  }

// Switch between login and register forms
function switchForm(form) {
  document.querySelectorAll('.form').forEach(f => f.classList.remove('active'));
  document.getElementById(`${form}-form`).classList.add('active');
}

// Open and close reset modal
function openResetModal() {
    document.getElementById('reset-modal').classList.add('show');
}
function closeResetModal() {
    document.getElementById('reset-modal').classList.remove('show');
}

// Login with Firebase
function login(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      if (userCredential.user.emailVerified) {
        window.location.href = 'client.html';
      } else {
        alert('Veuillez vérifier votre adresse email avant de vous connecter.');
        auth.signOut();
      }
    })
    .catch(error => {
      alert(error.message);
    });
}

// Register with Firebase
function register(event) {
  event.preventDefault();
  const prenom = document.getElementById('prenom').value.trim();
  const nom = document.getElementById('nom').value.trim();
  const email = document.getElementById('register-email').value;
  const password = document.getElementById('register-password').value;
  const phone = document.getElementById('phone').value;
  const dob = document.getElementById('dob').value;
  const newsletter = document.getElementById('newsletter').checked;

  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      // Save additional profile info
      return userCredential.user.updateProfile({
        displayName: `${prenom} ${nom}`
      }).then(() => userCredential.user.sendEmailVerification({
        url: window.location.href
      }));
    })
    .then(() => {
      // Show confirmation modal
      alert('Email de confirmation envoyé. Veuillez vérifier votre boîte email (lien valide 15 minutes).');
      switchForm('login');
    })
    .catch(error => {
      alert(error.message);
    });
}

// Send password reset email
function sendResetEmail(event) {
  event.preventDefault();
  const email = document.getElementById('reset-email').value;
  auth.sendPasswordResetEmail(email, { url: window.location.href })
    .then(() => {
      alert('Lien de réinitialisation envoyé. Valable 15 minutes.');
      closeModal();
    })
    .catch(error => {
      alert(error.message);
    });
}

// Dans login()
auth.signInWithEmailAndPassword(email, password)
  .then(uc => {
    if (!uc.user.emailVerified) throw new Error('Vérifiez votre email');
    // Redirection ici, uniquement après un login explicite
    window.location.href = 'client.html';
  })
  .catch(err => alert(err.message));

// Et on peut enlever entirely l'onAuthStateChanged