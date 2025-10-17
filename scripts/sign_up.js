// Authentication Sign Up Page
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js";

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

  const SUBMIT = document.getElementById('signup_btn');

  SUBMIT.addEventListener('click', function(event) {
  event.preventDefault()
  // const NAME = document.getElementById('signUpName').value;
  const EMAIL = document.getElementById('signUpEmail').value;
  const PASSWORD = document.getElementById('signUpPassword').value;
  // const CONFIRM_PASSWORD = document.getElementById('signUpConfirmPassword').value;

  createUserWithEmailAndPassword(AUTH, EMAIL, PASSWORD)
  .then((userCredential) => {
    // Signed up 
    const user = userCredential.user;
    alert("Creating User ...");
    window.location.href = "index.html";
    // ...
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
    // ..
  });
  })


// Function to toggle password visibility
document.addEventListener('DOMContentLoaded', () => {
  const BACK_BTN = document.getElementById('backBtn');
  const SIGN_UP_FORM = document.getElementById('signupForm');

  if (BACK_BTN) {
    BACK_BTN.addEventListener('click', () => {
      window.location.href = './index.html';
    });
  }

  if (SIGN_UP_FORM) {
    SIGN_UP_FORM.addEventListener('submit', (e) => {
      e.preventDefault();
      const NAME = document.getElementById('signUpName').value;
      const EMAIL = document.getElementById('signUpEmail').value;
      const PASSWORD = document.getElementById('signUpPassword').value;
      const CONFIRM_PASSWORD = document.getElementById('signUpConfirmPassword').value;
      const PRIVACY_CHECKBOX = document.getElementById('privacyCheckbox');

      clearErrors();

      if (PASSWORD !== CONFIRM_PASSWORD) {
        showError('confirmPasswordError', 'Passwords do not match');
        return;
      }

      if (!PRIVACY_CHECKBOX.checked) {
        alert('Please accept the Privacy Policy');
        return;
      }

      console.log('Sign up successful:', { NAME, EMAIL });
      window.location.href = './index.html';
    });
  }

  initPasswordToggle('signUpPassword', '.form_input_wrapper', 'togglePassword', 'togglePasswordOff');
  initPasswordToggle('signUpConfirmPassword', '.form_input_wrapper', 'toggleConfirmPassword', 'toggleConfirmPasswordOff');
});