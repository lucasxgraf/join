/**
 * @fileoverview Sign up page functionality including form validation and user registration.
 * @module sign_up
 */

import { signUpUser } from './firebase_auth.js';

/**
 * Reference to the back button element.
 * @type {HTMLElement}
 */
const REF_BACK_BTN = document.getElementById("goBackArrow");

/**
 * Reference to the sign up form element.
 * @type {HTMLFormElement}
 */
const SIGNUP_FORM = document.getElementById("signUp");

/**
 * Reference to the name input field.
 * @type {HTMLInputElement}
 */
const SIGNUP_NAME_INPUT = document.getElementById("name");

/**
 * Reference to the email input field.
 * @type {HTMLInputElement}
 */
const SIGNUP_EMAIL_INPUT = document.getElementById("signUpEmail");

/**
 * Reference to the password input field.
 * @type {HTMLInputElement}
 */
const SIGNUP_PSW_INPUT = document.getElementById("signUpPassword");

/**
 * Reference to the confirm password input field.
 * @type {HTMLInputElement}
 */
const SIGNUP_CONF_PSW_INPUT = document.getElementById("signUpConfirmPassword");

/**
 * Reference to the privacy policy checkbox.
 * @type {HTMLInputElement}
 */
const PRIVACY_CHECKBOX = document.getElementById("privacy_police");

/**
 * Reference to the sign up button.
 * @type {HTMLButtonElement}
 */
const SIGN_BTN_REGISTER = document.getElementById("signBtnRegister");

/**
 * Reference to the sign up window container.
 * @type {HTMLElement}
 */
const SIGN_WINDOW = document.querySelector(".sign_window");

/**
 * Reference to the footer element.
 * @type {HTMLElement}
 */
const FOOTER = document.querySelector("footer");

/**
 * SVG icon paths for password visibility toggle.
 * @type {Object.<string, string>}
 */
const SVG_PATHS = {
  lock: "./assets/svg/lock.svg",
  off: "./assets/svg/visibility_off.svg",
  on: "./assets/svg/visibility.svg"
};

/**
 * Initializes the sign up page when DOM content is loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  [
    { inputId: "signUpPassword", toggleId: "toggleSignUpPassword" },
    { inputId: "signUpConfirmPassword", toggleId: "toggleSignUpConfirmPassword" }
  ].forEach(f => {
    initPasswordToggle(f.inputId, f.toggleId, SVG_PATHS.lock, SVG_PATHS.off, SVG_PATHS.on);
  });

  if (SIGN_WINDOW) SIGN_WINDOW.style.display = "block";
  if (FOOTER) FOOTER.style.display = "block";

  initSignUpButtonState();
});

if (REF_BACK_BTN) {
  REF_BACK_BTN.addEventListener("click", goBack);
}

if (SIGNUP_CONF_PSW_INPUT) {
  SIGNUP_CONF_PSW_INPUT.addEventListener("input", checkPasswordMatch);
}

if (SIGNUP_FORM) {
  SIGNUP_FORM.addEventListener("submit", handleSignUpSubmit);
}

document.addEventListener("click", function (event) {
  if (SIGNUP_FORM && !SIGNUP_FORM.contains(event.target)) {
    clearSignUpErrors();
  }
});

/**
 * Initializes the sign up button state based on form validation.
 */
function initSignUpButtonState() {
  if (!SIGN_BTN_REGISTER || !PRIVACY_CHECKBOX) 
    return;
  
  updateSignUpButtonState();
  attachFormFieldListeners();
}

/**
 * Updates the sign up button enabled/disabled state.
 */
function updateSignUpButtonState() {
  const allFieldsFilled = areAllFieldsFilled();
  SIGN_BTN_REGISTER.disabled = !allFieldsFilled;
  SIGN_BTN_REGISTER.classList.toggle("disabled_btn", SIGN_BTN_REGISTER.disabled);
}

/**
 * Checks if all required form fields are filled.
 * @returns {boolean} True if all fields are filled, false otherwise.
 */
function areAllFieldsFilled() {
  return SIGNUP_NAME_INPUT.value.trim() !== "" &&
    SIGNUP_EMAIL_INPUT.value.trim() !== "" &&
    SIGNUP_PSW_INPUT.value !== "" &&
    SIGNUP_CONF_PSW_INPUT.value !== "" &&
    PRIVACY_CHECKBOX.checked;
}

/**
 * Attaches event listeners to form fields for button state updates.
 */
function attachFormFieldListeners() {
  PRIVACY_CHECKBOX.addEventListener("change", updateSignUpButtonState);
  SIGNUP_NAME_INPUT.addEventListener("input", updateSignUpButtonState);
  SIGNUP_EMAIL_INPUT.addEventListener("input", updateSignUpButtonState);
  SIGNUP_PSW_INPUT.addEventListener("input", updateSignUpButtonState);
  SIGNUP_CONF_PSW_INPUT.addEventListener("input", updateSignUpButtonState);
}

/**
 * Checks if password and confirm password fields match.
 */
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

/**
 * Handles the sign up form submission.
 * @async
 * @param {Event} event - The form submit event.
 */
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

/**
 * Handles successful sign up.
 */
function onSignUpSuccess() {
  showSuccessOverlay();
  setTimeout(() => {
    window.location.href = "index.html?noSplash=1";
  }, 2000);
}

/**
 * Handles sign up error.
 * @param {string} msg - The error message to display.
 */
function onSignUpError(msg) {
  showError("signUpEmailError", msg);
  SIGNUP_EMAIL_INPUT.style.borderColor = "red";
}

/**
 * Validates the entire sign up form.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @param {string} confirmPassword - The password confirmation.
 * @param {boolean} privacyAccepted - Whether privacy policy is accepted.
 * @returns {boolean} True if form is valid, false otherwise.
 */
function validateSignUpForm(name, email, password, confirmPassword, privacyAccepted) {
  let isValid = true;
  isValid = validateName(name) && isValid;
  isValid = validateEmail(email) && isValid;
  isValid = validatePassword(password) && isValid;
  isValid = validateConfirmPassword(password, confirmPassword) && isValid;
  isValid = validatePrivacy(privacyAccepted) && isValid;
  return isValid;
}

/**
 * Validates the name field.
 * @param {string} name - The name to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function validateName(name) {
  if (name) return true;
  showError("signUpNameError", "Please enter your name");
  SIGNUP_NAME_INPUT.style.borderColor = "red";
    return false;
}

/**
 * Validates the email field.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
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

/**
 * Validates the password field.
 * @param {string} password - The password to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
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

/**
 * Validates the confirm password field.
 * @param {string} password - The original password.
 * @param {string} confirmPassword - The password confirmation.
 * @returns {boolean} True if valid, false otherwise.
 */
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

/**
 * Validates the privacy policy acceptance.
 * @param {boolean} accepted - Whether privacy policy is accepted.
 * @returns {boolean} True if accepted, false otherwise.
 */
function validatePrivacy(accepted) {
  if (accepted) 
    return true;
  showError("signUpEmailError", "Please accept the privacy policy");
    return false;
}

/**
 * Shows the success overlay after registration.
 */
function showSuccessOverlay() {
  const OVERLAY = document.getElementById("overlay");
  if (OVERLAY) {
    OVERLAY.style.display = "block";
  }
}

/**
 * Checks if an email address is valid.
 * @param {string} email - The email to validate.
 * @returns {boolean} True if valid, false otherwise.
 */
function isValidEmail(email) {
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return EMAIL_REGEX.test(email);
}

/**
 * Clears all sign up error messages and input borders.
 */
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

  [SIGNUP_NAME_INPUT, SIGNUP_EMAIL_INPUT, SIGNUP_PSW_INPUT, SIGNUP_CONF_PSW_INPUT].forEach(input => {
    if (input) input.style.borderColor = "";
  });
}