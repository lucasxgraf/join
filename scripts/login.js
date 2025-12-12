/**
 * @fileoverview Login page functionality including authentication, splash screen, and form validation.
 * @module login
 */

import { loginUser, loginAsGuest, } from './firebase_auth.js';

/**
 * Reference to the login button element.
 * @type {HTMLElement}
 */
const REF_LOGIN_BTN = document.querySelector("#loginBtn");

/**
 * Reference to the password input field.
 * @type {HTMLInputElement}
 */
const PASSWORD_INPUT = document.getElementById("loginPassword");

/**
 * Reference to the password visibility toggle icon.
 * @type {HTMLElement}
 */
const TOGGLE_PASSWORD = document.getElementById("togglePassword");

/**
 * Reference to the guest login button.
 * @type {HTMLElement}
 */
const GUEST_LOGIN_BTN = document.querySelector("#guestLog");

/**
 * Reference to the login card container.
 * @type {HTMLElement}
 */
const LOGIN_CARD = document.querySelector(".login_card");

/**
 * Reference to the login header element.
 * @type {HTMLElement}
 */
const LOGIN_HEADER = document.querySelector(".login_header");

/**
 * Reference to the footer element.
 * @type {HTMLElement}
 */
const FOOTER = document.querySelector("footer");

/**
 * Reference to the logo image element.
 * @type {HTMLElement}
 */
const LOGO = document.querySelector(".join_image");

/**
 * Reference to the form content container.
 * @type {HTMLElement}
 */
const FORM_CONTENT = document.querySelector(".form_content");

/**
 * Flag indicating whether to skip the splash screen animation.
 * @type {boolean}
 */
const SKIP = shouldSkipSplash();

/**
 * Checks if the splash screen should be skipped based on URL parameters.
 * @returns {boolean} True if splash screen should be skipped, false otherwise.
 */
function shouldSkipSplash() {
  return new URLSearchParams(window.location.search).get("noSplash") === "1";
}

/**
 * Initializes the login page when DOM content is loaded.
 * Sets up splash screen behavior and password toggle functionality.
 */
document.addEventListener("DOMContentLoaded", function () {
  skipSplashIfNeeded();

  setTimeout(() => {
    fadeInLoginElements();
  }, SKIP ? 0 : 1000);

  initPasswordToggle(
    "loginPassword",
    "togglePassword",
    "./assets/svg/lock.svg",
    "./assets/svg/visibility_off.svg",
    "./assets/svg/visibility.svg"
  );
});

/**
 * Skips the splash screen animation if the noSplash parameter is set.
 * Adjusts logo positioning and removes background overlay.
 */
function skipSplashIfNeeded() {
  if (SKIP && LOGO) {
    applyLogoStyles();
    hideBgOverlay();
    adjustLogoForMobile();
  }
}

/**
 * Applies initial logo styles to skip animation.
 */
function applyLogoStyles() {
  LOGO.style.animation = "none";
  LOGO.style.transform = "translate(0, 0) scale(1)";
  LOGO.style.top = "24px";
  LOGO.style.left = "24px";
  
  const joinImage = document.querySelector('.join_image');
  joinImage.style.content = 'url("./assets/img/logo/join_logo.png")';
}

/**
 * Hides the background overlay element.
 */
function hideBgOverlay() {
  const BG_OVERLAY = document.querySelector(".bg_overlay_responsive");
  if (BG_OVERLAY) {
    BG_OVERLAY.style.display = "none";
  }
}

/**
 * Adjusts logo size and position for mobile devices.
 */
function adjustLogoForMobile() {
  if (window.innerWidth <= 475) {
    LOGO.style.top = "24px";
    LOGO.style.left = "24px";
    LOGO.style.height = "80px";
    LOGO.style.width = "64px";
  }
}

/**
 * Fades in login page elements with animation.
 * Shows footer, login header, and login card with fade-in effect.
 */
function fadeInLoginElements() {
  const elements = [
    { el: FOOTER, display: "block" },
    { el: LOGIN_HEADER, display: "flex" },
    { el: LOGIN_CARD, display: "inline" }
  ];
  
  elements.forEach(({ el, display }) => {
    el.style.display = display;
    el.style.animation = "fadeIn 600ms forwards";
  });
}

if (REF_LOGIN_BTN) {
  REF_LOGIN_BTN.addEventListener("click", handleLoginSubmit);
}

if (GUEST_LOGIN_BTN) {
  GUEST_LOGIN_BTN.addEventListener("click", handleGuestLogin);
}

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

document.addEventListener("click", function (event) {
  if (FORM_CONTENT && !FORM_CONTENT.contains(event.target)) {
    clearLoginErrors();
  }
});

/**
 * Handles the login form submission.
 * Validates inputs and attempts to authenticate the user.
 * @async
 * @param {Event} event - The form submit event.
 */
async function handleLoginSubmit(event) {
  event.preventDefault();
  clearLoginErrors();

  const EMAIL = document.getElementById("loginEmail").value.trim();
  const PASSWORD = document.getElementById("loginPassword").value;
  if (!validateLoginInputs(EMAIL, PASSWORD)) {
    return;
  }
  const RESULT = await loginUser(EMAIL, PASSWORD);
  if (RESULT.success) {
    window.location.href = "pages/summary.html";
  } else {
    showLoginError(RESULT.error);
  }
}

/**
 * Handles guest login functionality.
 * Logs in as a guest user and redirects to summary page on success.
 * @async
 */
async function handleGuestLogin() {
  const RESULT = await loginAsGuest();
  
  if (RESULT.success) {
    window.location.href = "pages/summary.html";
  } else {
    alert("Guest login failed. Please try again.");
  }
}

/**
 * Validates login form inputs.
 * Checks if email and password fields are filled.
 * @param {string} email - The email address to validate.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if inputs are valid, false otherwise.
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
 * Displays login error message and highlights input fields.
 * @param {string} message - The error message to display.
 */
function showLoginError(message) {
  const EMAIL_INPUT = document.getElementById("loginEmail");
  const PASSWORD_INPUT = document.getElementById("loginPassword");
  
  EMAIL_INPUT.style.borderColor = "red";
  PASSWORD_INPUT.style.borderColor = "red";
  document.getElementById("passwordError").innerText = message;
}

/**
 * Clears all login error messages and resets input field borders.
 */
function clearLoginErrors() {
  document.getElementById("emailError").innerText = "";
  document.getElementById("passwordError").innerText = "";
  document.getElementById("loginEmail").style.borderColor = "";
  document.getElementById("loginPassword").style.borderColor = "";
}