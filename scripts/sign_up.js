import { signUpUser } from './firebase_auth.js';

const REF_BACK_BTN = document.getElementById("goBackArrow");
const SIGNUP_FORM = document.getElementById("signUp");
const SIGNUP_NAME_INPUT = document.getElementById("name");
const SIGNUP_EMAIL_INPUT = document.getElementById("signUpEmail");
const SIGNUP_PSW_INPUT = document.getElementById("signUpPassword");
const SIGNUP_CONF_PSW_INPUT = document.getElementById("signUpConfirmPassword");
const PRIVACY_CHECKBOX = document.getElementById("privacy_police");
const SIGN_BTN_REGISTER = document.getElementById("signBtnRegister");

const SIGN_WINDOW = document.querySelector(".sign_window");
const FOOTER = document.querySelector("footer");
const SVG_PATHS = {
  lock: "./assets/svg/lock.svg",
  off: "./assets/svg/visibility_off.svg",
  on: "./assets/svg/visibility.svg"
};

// EVENT LISTENERS

// Initialisierung
document.addEventListener("DOMContentLoaded", () => {
  // Password Toggle initialisieren
  [
    { inputId: "signUpPassword", toggleId: "toggleSignUpPassword" },
    { inputId: "signUpConfirmPassword", toggleId: "toggleSignUpConfirmPassword" }
  ].forEach(f => {
    initPasswordToggle(f.inputId, f.toggleId, SVG_PATHS.lock, SVG_PATHS.off, SVG_PATHS.on);
  });

  // Sign Window sofort anzeigen (ohne Animation)
  if (SIGN_WINDOW) SIGN_WINDOW.style.display = "block";
  if (FOOTER) FOOTER.style.display = "block";

  // Button-Enable-Logik nur via Checkbox
  initSignUpButtonState();
});

// Back Arrow Click
if (REF_BACK_BTN) {
  REF_BACK_BTN.addEventListener("click", goBack);
}

// Password Match Validation
if (SIGNUP_CONF_PSW_INPUT) {
  SIGNUP_CONF_PSW_INPUT.addEventListener("input", checkPasswordMatch);
}

// Form Submit
if (SIGNUP_FORM) {
  SIGNUP_FORM.addEventListener("submit", handleSignUpSubmit);
}

// Click außerhalb des Forms: Error Messages löschen
document.addEventListener("click", function (event) {
  if (SIGNUP_FORM && !SIGNUP_FORM.contains(event.target)) {
    clearSignUpErrors();
  }
});

// FUNKTIONEN

// Aktiviert/Deaktiviert den Sign-up Button abhängig von der Checkbox
function initSignUpButtonState() {
  if (!SIGN_BTN_REGISTER || !PRIVACY_CHECKBOX) 
    return;
  const UPDATE_SIGN_BTN_REGISTER = () => {
    SIGN_BTN_REGISTER.disabled = !PRIVACY_CHECKBOX.checked;
    SIGN_BTN_REGISTER.classList.toggle("disabled_btn", SIGN_BTN_REGISTER.disabled);
  };
  UPDATE_SIGN_BTN_REGISTER();
  PRIVACY_CHECKBOX.addEventListener("change", UPDATE_SIGN_BTN_REGISTER);
}

// Prüft ob Passwörter übereinstimmen
function checkPasswordMatch() {
  const PASSWORD = SIGNUP_PSW_INPUT.value;
  const CONFIRM_PSW = SIGNUP_CONF_PSW_INPUT.value;
  const ERROR_ELEMENT = document.getElementById("signUpConfirmPasswordError");

  if (CONFIRM_PSW && PASSWORD !== CONFIRM_PSW) {
    showError("signUpConfirmPasswordError", "Your passwords don't match. Please try again.");
    SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
  } else {
    ERROR_ELEMENT.textContent = "";
    SIGNUP_CONF_PSW_INPUT.style.borderColor = "";
  }
}

// Holt Daten aus dem Sign Up Form und validiert
async function handleSignUpSubmit(event) {
  event.preventDefault();
  clearSignUpErrors();

  const NAME = SIGNUP_NAME_INPUT.value.trim();
  const EMAIL = SIGNUP_EMAIL_INPUT.value.trim();
  const PASSWORD = SIGNUP_PSW_INPUT.value;
  const CONFIRM_PSW = SIGNUP_CONF_PSW_INPUT.value;
  const PRIVACY_ACCEPTED = PRIVACY_CHECKBOX.checked;
  const RESULT = await signUpUser(NAME, EMAIL, PASSWORD);

  if (!validateSignUpForm(NAME, EMAIL, PASSWORD, CONFIRM_PSW, PRIVACY_ACCEPTED)) 
    return;

  if (RESULT.success) 
    return onSignUpSuccess();
  onSignUpError(RESULT.error);
}

// Hilfsfunktionen für Sign Up Erfolg/Fehler
function onSignUpSuccess() {
  showSuccessOverlay();
  setTimeout(() => {
    window.location.href = "index.html?noSplash=1";
  }, 2000);
}

function onSignUpError(msg) {
  showError("signUpEmailError", msg);
  SIGNUP_EMAIL_INPUT.style.borderColor = "red";
}

// Validiert alle Sign Up Form Felder
function validateSignUpForm(name, email, password, confirmPassword, privacyAccepted) {
  let isValid = true;
  isValid = validateName(name) && isValid;
  isValid = validateEmail(email) && isValid;
  isValid = validatePassword(password) && isValid;
  isValid = validateConfirmPassword(password, confirmPassword) && isValid;
  isValid = validatePrivacy(privacyAccepted) && isValid;
  return isValid;
}

// Hilfsfunktionen für Validierung
function validateName(name) {
  if (name) return true;
  showError("signUpNameError", "Please enter your name");
  SIGNUP_NAME_INPUT.style.borderColor = "red";
    return false;
}

function validateEmail(email) {
  if (!email) {
    showError("signUpEmailError", "Please enter your email");
    SIGNUP_EMAIL_INPUT.style.borderColor = "red";
      return false;
  }
  if (isValidEmail(email)) 
    return true;
  showError("signUpEmailError", "Please enter a valid email");
  SIGNUP_EMAIL_INPUT.style.borderColor = "red";
    return false;
}

function validatePassword(password) {
  if (!password) {
    showError("signUpPasswordError", "Please enter a password");
    SIGNUP_PSW_INPUT.style.borderColor = "red";
      return false;
  }
  if (password.length >= 6) 
    return true;
  showError("signUpPasswordError", "Password must be at least 6 characters");
  SIGNUP_PSW_INPUT.style.borderColor = "red";
    return false;
}

function validateConfirmPassword(password, confirmPassword) {
  if (!confirmPassword) {
    showError("signUpConfirmPasswordError", "Please confirm your password");
    SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
      return false;
  }
  if (password === confirmPassword) 
    return true;
    showError("signUpConfirmPasswordError", "Passwords do not match");
  SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
    return false;
}

function validatePrivacy(accepted) {
  if (accepted) 
    return true;
  showError("signUpEmailError", "Please accept the privacy policy");
    return false;
}

// Zeigt Success Overlay
function showSuccessOverlay() {
  const OVERLAY = document.getElementById("overlay");
  if (OVERLAY) {
    OVERLAY.style.display = "block";
  }
}

// Validiert Email Format
function isValidEmail(email) {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email);
}

// Löscht alle Error Messages
function clearSignUpErrors() {
  const ERROR_IDS = [
    "signUpNameError",
    "signUpEmailError", 
    "signUpPasswordError",
    "signUpConfirmPasswordError",
  ];

  ERROR_IDS.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = "";
  });

  // Border Colors zurücksetzen
  [SIGNUP_NAME_INPUT, SIGNUP_EMAIL_INPUT, SIGNUP_PSW_INPUT, SIGNUP_CONF_PSW_INPUT].forEach(input => {
    if (input) input.style.borderColor = "";
  });
}