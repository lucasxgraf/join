/**
 * Login Page Event Listeners und Funktionen
 * @module login
 */

import { loginUser, loginAsGuest } from './firebase_auth.js';

// ====
// DOM ELEMENTE
// ====
const REF_LOGIN_BTN = document.querySelector("#loginBtn");
const PASSWORD_INPUT = document.getElementById("loginPassword");
const TOGGLE_PASSWORD = document.getElementById("togglePassword");
const GUEST_LOGIN_BTN = document.querySelector("#guestLog");

// ====
// INITIALISIERUNG
// ====

/**
 * Initialisiert die Login Page
 */
document.addEventListener("DOMContentLoaded", function () {
  const LOGIN_CARD = document.querySelector(".login_card");
  const loginHeader = document.querySelector(".login_header");
  const footer = document.querySelector("footer");

  // Fade In Animationen
  setTimeout(() => {
    footer.style.display = "block";
    footer.style.animation = "fadeIn 3s forwards";
    loginHeader.style.display = "flex";
    loginHeader.style.animation = "fadeIn 3s forwards";
    LOGIN_CARD.style.display = "inline";
    LOGIN_CARD.style.animation = "fadeIn 3s forwards";
  }, 1000);

  // Password Toggle initialisieren
  initPasswordToggle(
    "loginPassword",
    "togglePassword",
    "./assets/svg/lock.svg",
    "./assets/svg/visibility_off.svg",
    "./assets/svg/visibility.svg"
  );
});

// ====
// EVENT LISTENERS
// ====

/**
 * Login Button Click
 */
if (REF_LOGIN_BTN) {
  REF_LOGIN_BTN.addEventListener("click", handleLoginSubmit);
}

/**
 * Guest Login Button Click
 */
if (GUEST_LOGIN_BTN) {
  GUEST_LOGIN_BTN.addEventListener("click", handleGuestLogin);
}

/**
 * Password Input Change
 */
if (PASSWORD_INPUT && TOGGLE_PASSWORD) {
  PASSWORD_INPUT.addEventListener("input", () => {
    if (PASSWORD_INPUT.value.length === 0) {
      TOGGLE_PASSWORD.src = "./assets/svg/lock.svg";
    } else if (PASSWORD_INPUT.type === "password") {
      TOGGLE_PASSWORD.src = "./assets/svg/visibility_off.svg";
    } else {
      TOGGLE_PASSWORD.src = "./assets/svg/visibility.svg";
    }
  });
}

/**
 * Click außerhalb des Forms: Error Messages löschen
 */
document.addEventListener("click", function (event) {
  const formContent = document.querySelector(".form_content");
  if (formContent && !formContent.contains(event.target)) {
    clearLoginErrors();
  }
});

// ====
// FUNKTIONEN
// ====

/**
 * Behandelt Login Form Submit
 */
async function handleLoginSubmit(event) {
  event.preventDefault();
  clearLoginErrors();

  const email = document.getElementById("loginEmail").value.trim();
  const password = document.getElementById("loginPassword").value;

  // Validierung
  if (!validateLoginInputs(email, password)) {
    return;
  }

  // Login mit Firebase Auth
  const result = await loginUser(email, password);

  if (result.success) {
    window.location.href = "./test.html";
  } else {
    showLoginError(result.error);
  }
}

/**
 * Behandelt Guest Login
 */
async function handleGuestLogin() {
  const result = await loginAsGuest();

  if (result.success) {
    window.location.href = "./test.html";
  } else {
    alert("Guest login failed. Please try again.");
  }
}

/**
 * Validiert Login Inputs
 * @returns {boolean} - true wenn valide, false wenn Fehler
 */
function validateLoginInputs(email, password) {
  let isValid = true;

  if (!email) {
    showError("emailError", "Please enter your email address here.");
    document.getElementById("loginEmail").style.borderColor = "red";
    isValid = false;
  }

  if (!password) {
    showError("passwordError", "Please enter your password here.");
    document.getElementById("loginPassword").style.borderColor = "red";
    isValid = false;
  }

  return isValid;
}

/**
 * Zeigt Login Error (Email + Password rot)
 */
function showLoginError(message) {
  const emailElement = document.getElementById("loginEmail");
  const passwordElement = document.getElementById("loginPassword");
  
  emailElement.style.borderColor = "red";
  passwordElement.style.borderColor = "red";
  document.getElementById("passwordError").innerText = message;
}

/**
 * Löscht alle Login Error Messages
 */
function clearLoginErrors() {
  document.getElementById("emailError").innerText = "";
  document.getElementById("passwordError").innerText = "";
  document.getElementById("loginEmail").style.borderColor = "";
  document.getElementById("loginPassword").style.borderColor = "";
}