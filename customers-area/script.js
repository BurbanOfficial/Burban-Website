// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyDb4AOtRT7jGENnLZ2KNwpczaG2Z77G2rc",
    authDomain: "burban-fidelity.firebaseapp.com",
    projectId: "burban-fidelity",
    storageBucket: "burban-fidelity.firebasestorage.app",
    messagingSenderId: "830299174800",
    appId: "1:830299174800:web:f50a4ec419e108f7f16515",
    measurementId: "G-E4QD4PYLM5"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();

// Messages d'erreur
const errorMessages = {
  'auth/invalid-email': "Adresse email invalide.",
  'auth/user-disabled': "Ce compte a été désactivé.",
  'auth/user-not-found': "Aucun compte ne correspond à cette adresse.",
  'auth/wrong-password': "Erreur dans l'adresse email ou dans le mot de passe.",
  'auth/email-already-in-use': "Cette adresse email est déjà utilisée.",
  'auth/weak-password': "Le mot de passe est trop faible (min. 6 caractères).",
  'auth/invalid-login-credentials': "Adresse Email ou mot de passe incorrect."
};

function showMessage(id, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), 5000);
}

function togglePassword(el,inputId){
  const inp = document.getElementById(inputId);
  const isPwd = inp.type==='password';
  inp.type = isPwd ? 'text' : 'password';
  el.innerHTML = isPwd
    ? '<i class="fa-solid fa-eye"></i>'
    : '<i class="fa-solid fa-eye-low-vision"></i>';
}

function switchForm(f){
  document.querySelectorAll('.form').forEach(x=>x.classList.remove('active'));
  document.getElementById(f+'-form').classList.add('active');
}
function openResetModal(){ document.getElementById('reset-modal').classList.add('show'); }
function closeResetModal(){ document.getElementById('reset-modal').classList.remove('show'); }

// Auth Actions
function login(e){
  e.preventDefault();
  const mail = document.getElementById('login-email').value;
  const pwd  = document.getElementById('login-password').value;
  auth.signInWithEmailAndPassword(mail,pwd)
    .catch(err=> showMessage('login-error', errorMessages[err.code]||err.message));
}

function register(e){
  e.preventDefault();
  const p    = document.getElementById('prenom').value.trim();
  const n    = document.getElementById('nom').value.trim();
  const mail = document.getElementById('reg-email').value;
  const pwd  = document.getElementById('reg-pass').value;
  const ph   = document.getElementById('phone').value;
  const dob  = document.getElementById('dob').value;
  const nw   = document.getElementById('newsletter').checked;

  auth.createUserWithEmailAndPassword(mail,pwd)
    .then(({user})=> {
      return user.updateProfile({displayName:`${p} ${n}`})
        .then(()=> user.sendEmailVerification());
    })
    .then(({user})=> db.collection('users').doc(user.uid).set({
      prenom: p,
      nom: n,
      email: mail,
      phone: ph || null,
      dob:   dob|| null,
      newsletterEmail: nw,
      newsletterPost:  false,
      createdAt: firebase.firestore.FieldValue.serverTimestamp()
    }))
    .then(()=> { showMessage('register-error','Inscription réussie, vérifiez votre email.'); switchForm('login'); })
    .catch(err=> showMessage('register-error', errorMessages[err.code]||err.message));
}

function sendResetEmail(e){
  e.preventDefault();
  const mail = document.getElementById('reset-email').value;
  auth.sendPasswordResetEmail(mail)
    .then(()=> showMessage('reset-success','Lien envoyé !'))
    .catch(err=> showMessage('reset-error', errorMessages[err.code]||err.message));
}

function logout(){ auth.signOut(); }

// Observer
auth.onAuthStateChanged(async user=>{
  const authSec   = document.getElementById('auth-section');
  const clientSec = document.getElementById('client-section');
  if(user && user.emailVerified){
    authSec.classList.add('hidden');
    clientSec.classList.remove('hidden');
    const doc = await db.collection('users').doc(user.uid).get();
    const d = doc.data()||{};
    document.getElementById('user-name').textContent = user.displayName||'';
    ['prenom','nom','email','phone','dob'].forEach(f=>{
      document.getElementById(`c-${f}`).value = f==='email' ? user.email : (d[f]||'');
    });
    ['email','post'].forEach(tp=>{
      const id = `c-newsletter-${tp}`;
      document.getElementById(id).checked = !!d[`newsletter${tp.charAt(0).toUpperCase()+tp.slice(1)}`];
      document.getElementById(id).onchange = async ()=>{
        await db.collection('users').doc(user.uid)
          .update({ [`newsletter${tp.charAt(0).toUpperCase()+tp.slice(1)}`]: document.getElementById(id).checked });
      };
    });
  } else {
    clientSec.classList.add('hidden');
    authSec.classList.remove('hidden');
  }
});
