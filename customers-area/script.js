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

// Error code => message mapping
const errorMessages = {
  'auth/invalid-email': "Adresse email invalide.",
  'auth/user-disabled': "Ce compte a été désactivé.",
  'auth/user-not-found': "Aucun compte ne correspond à cette adresse.",
  'auth/wrong-password': "Erreur dans l'adresse email ou dans le mot de passe.",
  'auth/email-already-in-use': "Cette adresse email est déjà utilisée.",
  'auth/weak-password': "Le mot de passe est trop faible (min. 6 caractères).",
  'auth/invalid-login-credentials': "Adresse Email ou mot de passe incorrect."
};

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

/* script.js modifications */
function showError(containerId, message) {
  const el = document.getElementById(containerId);
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

function showSuccess(containerId, message) {
  const el = document.getElementById(containerId);
  el.textContent = message;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

// Login with Firebase
function login(event) {
  event.preventDefault();
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  auth.signInWithEmailAndPassword(email, password)
    .then(uc => {
      if (!uc.user.emailVerified) {
        auth.signOut();
        throw { code: 'auth/email-not-verified' };
      }
      window.location.href = 'client.html';
    })
    .catch(err => {
      const msg = err.code && errorMessages[err.code]
        ? errorMessages[err.code]
        : (err.code === 'auth/email-not-verified'
            ? 'Veuillez vérifier votre adresse email avant de vous connecter.'
            : err.message);
      showError('login-error', msg);
    });
}

// Register with Firebase + enregistrement Firestore
function register(event) {
  event.preventDefault();
  const prenom     = document.getElementById('prenom').value.trim();
  const nom        = document.getElementById('nom').value.trim();
  const email      = document.getElementById('register-email').value;
  const password   = document.getElementById('register-password').value;
  const phone      = document.getElementById('phone').value;
  const dob        = document.getElementById('dob').value;
  const newsletter = document.getElementById('newsletter').checked;

  auth.createUserWithEmailAndPassword(email, password)
    .then(({ user }) => user.updateProfile({ displayName: `${prenom} ${nom}` })
      .then(() => user.sendEmailVerification({ url: window.location.href }))
      .then(() => user)
    )
    .then(user => db.collection('users').doc(user.uid).set({
      prenom, nom, email,
      phone: phone || null,
      dob: dob || null,
      newsletter,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }))
    .then(() => {
      showError('register-error', 'Inscription réussie ! Un email de confirmation vous a été envoyé.');
      switchForm('login');
    })
    .catch(error => {
      const msg = error.code && errorMessages[error.code] ? errorMessages[error.code] : error.message;
      showError('register-error', msg);
    });
}

// Send password reset email
function sendResetEmail(event) {
  event.preventDefault();
  const email = document.getElementById('reset-email').value;

  auth.sendPasswordResetEmail(email, { url: window.location.href })
    .then(() => {
      showSuccess('reset-success', 'Lien de réinitialisation envoyé. Vérifiez votre boîte de réception.');
      document.getElementById('reset-error').classList.remove('show');
    })
    .catch(error => {
      const msg = error.code && errorMessages[error.code] ? errorMessages[error.code] : error.message;
      showError('reset-error', msg);
      document.getElementById('reset-success').classList.remove('show');
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
