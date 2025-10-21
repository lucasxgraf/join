/**
 * Event Listeners für Sign Up Page
 * @module signUpEventListener
 */

import { signUpUser } from './firebase_auth.js';

// ====
// DOM ELEMENTE
// ====
const REF_BACK_BTN = document.getElementById("goBackArrow");
const SIGNUP_FORM = document.getElementById("signUp");
const SIGNUP_NAME_INPUT = document.getElementById("name");
const SIGNUP_EMAIL_INPUT = document.getElementById("signUpEmail");
const SIGNUP_PSW_INPUT = document.getElementById("signUpPassword");
const SIGNUP_CONF_PSW_INPUT = document.getElementById("signUpConfirmPassword");
const PRIVACY_CHECKBOX = document.getElementById("privacy_police");

// ====
// EVENT LISTENERS
// ====

/**
 * DOMContentLoaded: Initialisierung
 */
document.addEventListener("DOMContentLoaded", () => {
  // Password Toggle initialisieren
  initPasswordToggle(
    "signUpPassword",
    "toggleSignUpPassword",
    "./assets/svg/lock.svg",
    "./assets/svg/visibility_off.svg",
    "./assets/svg/visibility.svg"
  );

  initPasswordToggle(
    "signUpConfirmPassword",
    "toggleSignUpConfirmPassword",
    "./assets/svg/lock.svg",
    "./assets/svg/visibility_off.svg",
    "./assets/svg/visibility.svg"
  );

  // Sign Window sofort anzeigen (ohne Animation)
  const signWindow = document.querySelector(".sign_window");
  const footer = document.querySelector("footer");
  
  if (signWindow) {
    signWindow.style.display = "block";
  }
  if (footer) {
    footer.style.display = "block";
  }
});

/**
 * Back Arrow Click
 */
if (REF_BACK_BTN) {
  REF_BACK_BTN.addEventListener("click", goBack);
}

/**
 * Password Match Validation
 */
if (SIGNUP_CONF_PSW_INPUT) {
  SIGNUP_CONF_PSW_INPUT.addEventListener("input", checkPasswordMatch);
}

/**
 * Form Submit
 */
if (SIGNUP_FORM) {
  SIGNUP_FORM.addEventListener("submit", handleSignUpSubmit);
}

/**
 * Click außerhalb des Forms: Error Messages löschen
 */
document.addEventListener("click", function (event) {
  if (SIGNUP_FORM && !SIGNUP_FORM.contains(event.target)) {
    clearSignUpErrors();
  }
});

// ====
// FUNKTIONEN
// ====

/**
 * Prüft ob Passwörter übereinstimmen
 */
function checkPasswordMatch() {
  const password = SIGNUP_PSW_INPUT.value;
  const confirmPassword = SIGNUP_CONF_PSW_INPUT.value;
  const errorElement = document.getElementById("signUpConfirmPasswordError");

  if (confirmPassword && password !== confirmPassword) {
    showError("signUpConfirmPasswordError", "Your passwords don't match. Please try again.");
    SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
  } else {
    errorElement.textContent = "";
    SIGNUP_CONF_PSW_INPUT.style.borderColor = "";
  }
}

/**
 * Holt Daten aus dem Sign Up Form und validiert
 */
async function handleSignUpSubmit(event) {
  event.preventDefault();
  clearSignUpErrors();

  const name = SIGNUP_NAME_INPUT.value.trim();
  const email = SIGNUP_EMAIL_INPUT.value.trim();
  const password = SIGNUP_PSW_INPUT.value;
  const confirmPassword = SIGNUP_CONF_PSW_INPUT.value;
  const privacyAccepted = PRIVACY_CHECKBOX.checked;

  // Validierung
  if (!validateSignUpForm(name, email, password, confirmPassword, privacyAccepted)) {
    return;
  }

  // User registrieren mit Firebase Auth
  const result = await signUpUser(name, email, password);

  if (result.success) {
    showSuccessOverlay();
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  } else {
    showError("signUpEmailError", result.error);
    SIGNUP_EMAIL_INPUT.style.borderColor = "red";
  }
}

/**
 * Validiert alle Sign Up Form Felder
 * @returns {boolean} - true wenn valide, false wenn Fehler
 */
function validateSignUpForm(name, email, password, confirmPassword, privacyAccepted) {
  let isValid = true;

  if (!name) {
    showError("signUpNameError", "Please enter your name");
    SIGNUP_NAME_INPUT.style.borderColor = "red";
    isValid = false;
  }

  if (!email) {
    showError("signUpEmailError", "Please enter your email");
    SIGNUP_EMAIL_INPUT.style.borderColor = "red";
    isValid = false;
  } else if (!isValidEmail(email)) {
    showError("signUpEmailError", "Please enter a valid email");
    SIGNUP_EMAIL_INPUT.style.borderColor = "red";
    isValid = false;
  }

  if (!password) {
    showError("signUpPasswordError", "Please enter a password");
    SIGNUP_PSW_INPUT.style.borderColor = "red";
    isValid = false;
  } else if (password.length < 6) {
    showError("signUpPasswordError", "Password must be at least 6 characters");
    SIGNUP_PSW_INPUT.style.borderColor = "red";
    isValid = false;
  }

  if (!confirmPassword) {
    showError("signUpConfirmPasswordError", "Please confirm your password");
    SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
    isValid = false;
  } else if (password !== confirmPassword) {
    showError("signUpConfirmPasswordError", "Passwords do not match");
    SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
    isValid = false;
  }

  if (!privacyAccepted) {
    showError("signUpEmailError", "Please accept the privacy policy");
    isValid = false;
  }

  return isValid;
}

/**
 * Zeigt Success Overlay
 */
function showSuccessOverlay() {
  const overlay = document.getElementById("overlay");
  if (overlay) {
    overlay.style.display = "block";
  }
}

/**
 * Validiert Email Format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Löscht alle Error Messages
 */
function clearSignUpErrors() {
  const errorIds = [
    "signUpNameError",
    "signUpEmailError", 
    "signUpPasswordError",
    "signUpConfirmPasswordError",
  ];

  errorIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = "";
  });

  // Border Colors zurücksetzen
  [SIGNUP_NAME_INPUT, SIGNUP_EMAIL_INPUT, SIGNUP_PSW_INPUT, SIGNUP_CONF_PSW_INPUT].forEach(input => {
    if (input) input.style.borderColor = "";
  });
}