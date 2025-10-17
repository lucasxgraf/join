// Authentication Sign Up Page
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDZ8H-y7k78IYizot3dt3YNEmjFdDl79X8",
  authDomain: "join-ee4e0.firebaseapp.com",
  projectId: "join-ee4e0",
  storageBucket: "join-ee4e0.firebasestorage.app",
  messagingSenderId: "856619134139",
  appId: "1:856619134139:web:ab0c32f3aff766bd758d9e"
};

const APP = initializeApp(FIREBASE_CONFIG);
const AUTH = getAuth(APP);

const SUBMIT = document.getElementById('login_btn');

SUBMIT.addEventListener('click', function(event) {
event.preventDefault()
// const NAME = document.getElementById('signUpName').value;
const EMAIL = document.getElementById('loginEmail').value;
const PASSWORD = document.getElementById('loginPassword').value;
// const CONFIRM_PASSWORD = document.getElementById('signUpConfirmPassword').value;

signInWithEmailAndPassword(AUTH, EMAIL, PASSWORD)
  .then((userCredential) => {
    // Signed in 
    const user = userCredential.user;
    // ...
    alert("Logging In ...");
    window.location.href = "test.html";
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
  alert(errorMessage);
  // ..
});
})


document.addEventListener("DOMContentLoaded", function () {
  const BG_OVERLAY = document.querySelector(".bg_overlay_responsive");
  setTimeout(() => {
    BG_OVERLAY.style.animation = "fadeOut 1s forwards";
    setTimeout(() => {
      BG_OVERLAY.style.display = "none";
    }, 800);
  }, 1200);
});

function startIntro() {
  const LOGO = document.querySelector('.join_image');
  const PARTS = document.querySelectorAll('.login_header, .login_card, footer');
  if (!LOGO) return;
  LOGO.addEventListener('animationstart', () => {
    PARTS.forEach((el,i) => {
      el.style.visibility = 'visible';
      el.style.animation = `fadeIn 240ms ease-out ${i*80}ms forwards`;
    });
  }, { once: true });
}
document.addEventListener('DOMContentLoaded', startIntro);

document.addEventListener('DOMContentLoaded', () => {
  const SIGN_BTN = document.getElementById('sign_btn');
  if (!SIGN_BTN) return;
  SIGN_BTN.addEventListener('click', () => {
    window.location.href = './sign_up.html';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initPasswordToggle === 'function') {
    initPasswordToggle('loginPassword', '.form_input_wrapper', 'toggleLoginPassword', 'toggleLoginPasswordOff');
  }
});