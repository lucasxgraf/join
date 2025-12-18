/**
 * @fileoverview Login page functionality including authentication, splash screen, and form validation.
 * @module login
 */

import { loginUser, loginAsGuest } from './firebase_auth.js';

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
 * Reference to the sign up element.
 * @type {HTMLElement}
 */
const SIGN_UP = document.querySelector(".sign_up");

/**
 * Reference to the login card container.
 * @type {HTMLElement}
 */
const LOGIN_CARD = document.querySelector(".login_card");

/**
 * Reference to the login header element.
 * @type {HTMLElement}
 */
const LOGIN_HEADER = document.querySelector("header");

/**
 * Reference to the footer element.
 * @type {HTMLElement}
 */
const FOOTER = document.querySelector("footer");

/**
 * Reference to the logo image element.
 * @type {HTMLElement}
 */
const LOGO = document.querySelector(".logo");

/**
 * Reference to the logo container element.
 * @type {HTMLElement}
 */
const LOGO_CONTAINER = document.querySelector('.logo_container');

/**
 * Reference to the form content container.
 * @type {HTMLElement}
 */
const FORM_CONTENT = document.querySelector(".form_content");

/**
 * Flag indicating whether to skip the splash screen animation.
 * @type {boolean}
 */
let SKIP = shouldSkipSplash();

/**
 * Checks if the splash screen should be skipped based on URL parameters.
 * @returns {boolean} True if splash screen should be skipped, false otherwise.
 */
function shouldSkipSplash() {
  const params = new URLSearchParams(window.location.search);
  const skip = params.get("noSplash") === "1";
  return skip;
}

/**
 * Initializes the login page when DOM content is loaded.
 * Sets up splash screen behavior and password toggle functionality.
 */
document.addEventListener("DOMContentLoaded", function () {
  SKIP = shouldSkipSplash();
  
  if (SKIP) {
    skipAllAnimations();
  }
  
  setTimeout(() => {
    if (!SKIP) {
      fadeInLoginElements();
    }
  }, SKIP ? 0 : 1000);

  initPasswordToggle(
    "loginPassword",
    "togglePassword",
    "./assets/svg/lock.svg",
    "./assets/svg/visibility_off.svg",
    "./assets/svg/visibility.svg"
  );

  if (!SKIP && LOGO && LOGO_CONTAINER && SIGN_UP) {
    setInitialLogoStyle();
    const { deltaX, deltaY } = calculateDelta();
    
    setTimeout(() => {
      if (!shouldSkipSplash()) {
        animateLogoToContainer(deltaX, deltaY);
      }
    }, 1000);

    setTimeout(() => {
      if (!shouldSkipSplash()) {
        finalizeLogoPosition();
      }
    }, 1800);
  }
});

/**
 * Completely skips all splash animations and shows elements immediately.
 * This function is called when the noSplash parameter is present in the URL.
 */
function skipAllAnimations() {
  hideBgOverlay();
  applyLogoStyles();
  showElementsWithoutAnimation();
  
  if (LOGO && LOGO_CONTAINER) {
    LOGO_CONTAINER.appendChild(LOGO);
    LOGO.style.position = "static";
    LOGO.style.transform = "none";
    LOGO.style.cursor = "default";
    LOGO.style.animation = "none";
  }
}

/**
 * Hides the background overlay element immediately.
 * Removes any animations and sets display to none.
 */
function hideBgOverlay() {
  const BG_OVERLAY = document.querySelector(".overlay");
  if (BG_OVERLAY) {
    BG_OVERLAY.style.display = "none";
    BG_OVERLAY.style.animation = "none";
    BG_OVERLAY.style.opacity = "0";
  }
}

/**
 * Applies initial logo styles to skip animation.
 * Positions the logo correctly without any animation effects.
 */
function applyLogoStyles() {
  if (!LOGO) return;
  
  LOGO.style.animation = "none";
  LOGO.style.transform = "translate(0, 0) scale(1)";
  LOGO.style.top = "24px";
  LOGO.style.left = "24px";
  LOGO.style.position = "absolute";
  LOGO.style.transition = "none";
  
  if (window.innerWidth <= 475) {
    LOGO.style.top = "24px";
    LOGO.style.left = "24px";
    LOGO.style.height = "80px";
    LOGO.style.width = "64px";
  }
}

/**
 * Shows all login page elements immediately without animation.
 * Sets display properties and removes any animation effects.
 */
function showElementsWithoutAnimation() {
  const elements = [
    { el: FOOTER, display: "block" },
    { el: LOGIN_HEADER, display: "flex" },
    { el: LOGIN_CARD, display: "block" },
    { el: SIGN_UP, display: "flex" },
  ];
  
  elements.forEach(({ el, display }) => {
    if (el) {
      el.style.display = display;
      el.style.animation = "none";
      el.style.opacity = "1";
    }
  });
}

/**
 * Fades in login page elements with animation.
 * Shows footer, login header, and login card with fade-in effect.
 */
function fadeInLoginElements() {
  const elements = [
    { el: FOOTER, display: "block" },
    { el: LOGIN_HEADER, display: "flex" },
    { el: LOGIN_CARD, display: "block" },
    { el: SIGN_UP, display: "flex" },
  ];
  
  elements.forEach(({ el, display }) => {
    if (el) {
      el.style.display = display;
      el.style.animation = "fadeIn 600ms forwards";
    }
  });
}

/**
 * Adds event listener to login button for form submission.
 */
if (REF_LOGIN_BTN) {
  REF_LOGIN_BTN.addEventListener("click", handleLoginSubmit);
}

/**
 * Adds event listener to guest login button.
 */
if (GUEST_LOGIN_BTN) {
  GUEST_LOGIN_BTN.addEventListener("click", handleGuestLogin);
}

/**
 * Adds event listener to password input for visibility toggle icon update.
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
 * Adds click event listener to clear login errors when clicking outside form.
 */
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
    showError("emailError", "Please enter your email address.");
    document.getElementById("loginEmail").style.borderColor = "red";
    isValid = false;
  }

  if (!password) {
    showError("passwordError", "Please enter your password.");
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

/**
 * Sets initial logo style for animation.
 * Positions the logo in the center of the screen with scaling effect.
 */
function setInitialLogoStyle() {
  if (window.innerWidth <= 475) {
    LOGO.style.content = 'url("./assets/img/logo/join_logo_vector.svg")';
  }
  LOGO.style.position = 'fixed';
  LOGO.style.top = '50%';
  LOGO.style.left = '50%';
  LOGO.style.transform = 'translate(-50%, -50%) scale(2)';
  LOGO.style.transition = 'all 0.8s ease-in-out';
}

/**
 * Calculates the delta values for logo animation to move it to the target position.
 * @returns {Object} Object containing deltaX and deltaY values.
 */
function calculateDelta() {
  const targetRect = LOGO_CONTAINER.getBoundingClientRect();
  const targetX = targetRect.left + targetRect.width / 2;
  const targetY = targetRect.top + targetRect.height / 2;
  const startX = window.innerWidth / 2;
  const startY = window.innerHeight / 2;
  return { deltaX: targetX - startX, deltaY: targetY - startY };
}

/**
 * Animates the logo to move to the container position.
 * @param {number} deltaX - The horizontal distance to move.
 * @param {number} deltaY - The vertical distance to move.
 */
function animateLogoToContainer(deltaX, deltaY) {
  LOGO.style.transform = `translate(calc(-50% + ${deltaX}px), calc(-50% + ${deltaY}px)) scale(1)`;
  LOGO.style.top = '50%';
  LOGO.style.left = '50%';
}

/**
 * Finalizes the logo position by moving it to the logo container.
 * Resets animation and transition properties.
 */
function finalizeLogoPosition() {
  LOGO_CONTAINER.appendChild(LOGO);
  LOGO.style.position = 'static';
  LOGO.style.transform = 'none';
  LOGO.style.cursor = 'default';

  if (window.innerWidth <= 475) {
    if (LOGO.tagName !== 'IMG') {
      LOGO.src = './assets/img/logo/join_logo.png';
    } else {
      LOGO.style.content = 'url("./assets/img/logo/join_logo.png")';
    }
  }
  fadeInLoginElements();
}