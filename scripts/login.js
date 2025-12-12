import { loginUser, loginAsGuest } from './firebase_auth.js';

const LOGIN_FORM = document.getElementById("loginForm");
const LOGIN_EMAIL_INPUT = document.getElementById("loginEmail");
const LOGIN_PSW_INPUT = document.getElementById("loginPassword");
const GUEST_LOGIN_BTN = document.getElementById("guestLoginBtn");

/**
 * Initializes password visibility toggle functionality for login form
 * Sets up click handlers for password field icons
 */
function initPasswordToggle() {
  const passwordToggles = [
    { inputId: "loginPassword", toggleId: "toggleLoginPassword" }
  ];

  passwordToggles.forEach(({ inputId, toggleId }) => {
    const input = document.getElementById(inputId);
    const toggle = document.getElementById(toggleId);
    if (input && toggle) {
      toggle.addEventListener("click", () => togglePasswordVisibility(inputId, toggleId));
    }
  });
}

/**
 * Toggles password visibility for a specific input field
 * Changes input type between password and text, updates icon accordingly
 * 
 * @param {string} inputId - ID of the password input element
 * @param {string} toggleId - ID of the toggle icon element
 */
function togglePasswordVisibility(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  const isPassword = input.type === "password";
  input.type = isPassword ? "text" : "password";
  toggle.src = isPassword ? "./assets/svg/visibility.svg" : "./assets/svg/lock.svg";
}

/**
 * Handles login form submission
 * Validates credentials and authenticates user via Firebase
 * 
 * @param {Event} event - Form submit event
 */
async function handleLoginSubmit(event) {
  event.preventDefault();
  clearLoginErrors();

  const EMAIL = LOGIN_EMAIL_INPUT.value.trim();
  const PASSWORD = LOGIN_PSW_INPUT.value;

  if (!validateLoginForm(EMAIL, PASSWORD)) 
    return;

  const RESULT = await loginUser(EMAIL, PASSWORD);

  if (RESULT.success) 
    return onLoginSuccess();
  onLoginError(RESULT.error);
}

/**
 * Handles successful login
 * Redirects user to main application page
 */
function onLoginSuccess() {
  window.location.href = "test.html";
}

/**
 * Handles login errors
 * Displays error message and highlights email field
 * 
 * @param {string} msg - Error message to display
 */
function onLoginError(msg) {
  showError("loginEmailError", msg);
  LOGIN_EMAIL_INPUT.style.borderColor = "red";
}

/**
 * Validates login form inputs
 * Checks for empty email and password fields
 * 
 * @param {string} email - User email address
 * @param {string} password - User password
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateLoginForm(email, password) {
  let isValid = true;

  if (!email) {
    showError("loginEmailError", "Please enter your email");
    LOGIN_EMAIL_INPUT.style.borderColor = "red";
    isValid = false;
  }

  if (!password) {
    showError("loginPasswordError", "Please enter your password");
    LOGIN_PSW_INPUT.style.borderColor = "red";
    isValid = false;
  }

  return isValid;
}

/**
 * Displays error message for a specific form field
 * 
 * @param {string} elementId - ID of the error message container
 * @param {string} message - Error message text to display
 */
function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) {
    errorElement.textContent = message;
  }
}

/**
 * Clears all login form error messages and resets field borders
 */
function clearLoginErrors() {
  const errorIds = ["loginEmailError", "loginPasswordError"];
  errorIds.forEach(id => {
    const element = document.getElementById(id);
    if (element) element.textContent = "";
  });

  LOGIN_EMAIL_INPUT.style.borderColor = "";
  LOGIN_PSW_INPUT.style.borderColor = "";
}

/**
 * Handles guest login functionality
 * Authenticates user anonymously and redirects to main page
 * 
 * @param {Event} event - Click event from guest login button
 */
async function handleGuestLogin(event) {
  event.preventDefault();
  const RESULT = await loginAsGuest();
  
  if (RESULT.success) {
    window.location.href = "test.html";
  }
}

/**
 * Initializes all event listeners for the login form
 */
function initEventListeners() {
  initFormSubmitListener();
  initGuestLoginListener();
  initOutsideClickListener();
}

/**
 * Sets up login form submit event listener
 */
function initFormSubmitListener() {
  if (LOGIN_FORM) {
    LOGIN_FORM.addEventListener("submit", handleLoginSubmit);
  }
}

/**
 * Sets up guest login button event listener
 */
function initGuestLoginListener() {
  if (GUEST_LOGIN_BTN) {
    GUEST_LOGIN_BTN.addEventListener("click", handleGuestLogin);
  }
}

/**
 * Sets up click outside form to clear errors
 */
function initOutsideClickListener() {
  document.addEventListener("click", (event) => {
    if (LOGIN_FORM && !LOGIN_FORM.contains(event.target)) {
      clearLoginErrors();
    }
  });
}

if (LOGIN_FORM) {
  initPasswordToggle();
}

initEventListeners();