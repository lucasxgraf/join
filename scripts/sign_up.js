import { signUpUser } from './firebase_auth.js';

const SIGNUP_FORM = document.getElementById("signUp");
const SIGNUP_NAME_INPUT = document.getElementById("name");
const SIGNUP_EMAIL_INPUT = document.getElementById("signUpEmail");
const SIGNUP_PSW_INPUT = document.getElementById("signUpPassword");
const SIGNUP_CONF_PSW_INPUT = document.getElementById("signUpConfirmPassword");
const PRIVACY_CHECKBOX = document.getElementById("privacyCheckbox");
const SIGN_BTN_REGISTER = document.getElementById("signBtnRegister");

/**
 * Initializes password visibility toggle functionality for sign up form
 * Sets up click handlers for password and confirm password fields
 */
function initPasswordToggle() {
  const passwordToggles = [
    { inputId: "signUpPassword", toggleId: "toggleSignUpPassword" },
    { inputId: "signUpConfirmPassword", toggleId: "toggleSignUpConfirmPassword" }
  ];

  passwordToggles.forEach(({ inputId, toggleId }) => {
    setupPasswordToggle(inputId, toggleId);
  });
}

/**
 * Sets up password toggle for a specific input field
 * 
 * @param {string} inputId - ID of the password input element
 * @param {string} toggleId - ID of the toggle icon element
 */
function setupPasswordToggle(inputId, toggleId) {
  const input = document.getElementById(inputId);
  const toggle = document.getElementById(toggleId);
  if (input && toggle) {
    toggle.addEventListener("click", () => togglePasswordVisibility(inputId, toggleId));
  }
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
 * Initializes sign up button state management
 * Enables/disables button based on form completion and privacy checkbox
 */
function initSignUpButtonState() {
  if (!SIGN_BTN_REGISTER || !PRIVACY_CHECKBOX) 
    return;
  
  updateSignUpButtonState();
  attachSignUpButtonListeners();
}

/**
 * Updates sign up button enabled/disabled state
 * Checks if all required fields are filled and privacy is accepted
 */
function updateSignUpButtonState() {
  const allFieldsFilled = areAllFieldsFilled();
  SIGN_BTN_REGISTER.disabled = !allFieldsFilled;
  SIGN_BTN_REGISTER.classList.toggle("disabled_btn", SIGN_BTN_REGISTER.disabled);
}

/**
 * Checks if all required form fields are filled
 * 
 * @returns {boolean} True if all fields are filled and privacy accepted
 */
function areAllFieldsFilled() {
  return SIGNUP_NAME_INPUT.value.trim() !== "" &&
         SIGNUP_EMAIL_INPUT.value.trim() !== "" &&
         SIGNUP_PSW_INPUT.value !== "" &&
         SIGNUP_CONF_PSW_INPUT.value !== "" &&
         PRIVACY_CHECKBOX.checked;
}

/**
 * Attaches input event listeners to all form fields
 * Updates button state on any field change
 */
function attachSignUpButtonListeners() {
  const fields = [PRIVACY_CHECKBOX, SIGNUP_NAME_INPUT, SIGNUP_EMAIL_INPUT, 
                  SIGNUP_PSW_INPUT, SIGNUP_CONF_PSW_INPUT];
  
  fields.forEach(field => {
    const eventType = field === PRIVACY_CHECKBOX ? "change" : "input";
    field.addEventListener(eventType, updateSignUpButtonState);
  });
}

/**
 * Validates password match between password and confirm password fields
 * Displays error message if passwords don't match
 */
function checkPasswordMatch() {
  const PASSWORD = SIGNUP_PSW_INPUT.value;
  const CONFIRM_PSW = SIGNUP_CONF_PSW_INPUT.value;
  const ERROR_ELEMENT = document.getElementById("signUpConfirmPasswordError");

  if (CONFIRM_PSW && PASSWORD !== CONFIRM_PSW) {
    showPasswordMismatchError();
  } else {
    clearPasswordError(ERROR_ELEMENT);
  }
}

/**
 * Displays password mismatch error message
 */
function showPasswordMismatchError() {
  showError("signUpConfirmPasswordError", "Your passwords don't match. Please try again.");
  SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
}

/**
 * Clears password error message and border color
 * 
 * @param {HTMLElement} errorElement - Error message element to clear
 */
function clearPasswordError(errorElement) {
  errorElement.textContent = "";
  SIGNUP_CONF_PSW_INPUT.style.borderColor = "";
}

/**
 * Handles sign up form submission
 * Validates form and creates new user account
 * 
 * @param {Event} event - Form submit event
 */
async function handleSignUpSubmit(event) {
  event.preventDefault();
  clearSignUpErrors();

  const formData = getFormData();
  const RESULT = await signUpUser(formData.name, formData.email, formData.password);

  if (!validateSignUpForm(formData)) 
    return;

  if (RESULT.success) 
    return onSignUpSuccess();
  onSignUpError(RESULT.error);
}

/**
 * Retrieves all form data from input fields
 * 
 * @returns {Object} Form data object with name, email, password, confirmPassword, and privacyAccepted
 */
function getFormData() {
  return {
    name: SIGNUP_NAME_INPUT.value.trim(),
    email: SIGNUP_EMAIL_INPUT.value.trim(),
    password: SIGNUP_PSW_INPUT.value,
    confirmPassword: SIGNUP_CONF_PSW_INPUT.value,
    privacyAccepted: PRIVACY_CHECKBOX.checked
  };
}

/**
 * Handles successful sign up
 * Shows success overlay and redirects to login page
 */
function onSignUpSuccess() {
  showSuccessOverlay();
  setTimeout(() => {
    window.location.href = "index.html?noSplash=1";
  }, 2000);
}

/**
 * Handles sign up errors
 * Displays error message and highlights email field
 * 
 * @param {string} msg - Error message to display
 */
function onSignUpError(msg) {
  showError("signUpEmailError", msg);
  SIGNUP_EMAIL_INPUT.style.borderColor = "red";
}

/**
 * Validates all sign up form fields
 * 
 * @param {Object} formData - Form data object containing all input values
 * @returns {boolean} True if form is valid, false otherwise
 */
function validateSignUpForm(formData) {
  let isValid = true;
  isValid = validateName(formData.name) && isValid;
  isValid = validateEmail(formData.email) && isValid;
  isValid = validatePassword(formData.password) && isValid;
  isValid = validateConfirmPassword(formData.password, formData.confirmPassword) && isValid;
  isValid = validatePrivacy(formData.privacyAccepted) && isValid;
  return isValid;
}

/**
 * Validates name field is not empty
 * 
 * @param {string} name - User's name
 * @returns {boolean} True if name is valid
 */
function validateName(name) {
  if (name) return true;
  showError("signUpNameError", "Please enter your name");
  SIGNUP_NAME_INPUT.style.borderColor = "red";
  return false;
}

/**
 * Validates email field format and presence
 * 
 * @param {string} email - User's email address
 * @returns {boolean} True if email is valid
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
 * Validates password meets minimum requirements
 * 
 * @param {string} password - User's password
 * @returns {boolean} True if password is valid
 */
function validatePassword(password) {
  if (password.length >= 6) return true;
  showError("signUpPasswordError", "Password must be at least 6 characters");
  SIGNUP_PSW_INPUT.style.borderColor = "red";
  return false;
}

/**
 * Validates confirm password matches password
 * 
 * @param {string} password - User's password
 * @param {string} confirmPassword - Confirmed password
 * @returns {boolean} True if passwords match
 */
function validateConfirmPassword(password, confirmPassword) {
  if (password === confirmPassword) return true;
  showError("signUpConfirmPasswordError", "Passwords do not match");
  SIGNUP_CONF_PSW_INPUT.style.borderColor = "red";
  return false;
}

/**
 * Validates privacy policy checkbox is checked
 * 
 * @param {boolean} privacyAccepted - Privacy checkbox state
 * @returns {boolean} True if privacy is accepted
 */
function validatePrivacy(privacyAccepted) {
  if (privacyAccepted) return true;
  showError("signUpPrivacyError", "You must accept the privacy policy");
  return false;
}

/**
 * Checks if email format is valid using regex
 * 
 * @param {string} email - Email address to validate
 * @returns {boolean} True if email format is valid
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
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
 * Clears all sign up form error messages and resets field borders
 */
function clearSignUpErrors() {
  const errorIds = ["signUpNameError", "signUpEmailError", "signUpPasswordError", 
                    "signUpConfirmPasswordError", "signUpPrivacyError"];
  
  errorIds.forEach(id => clearErrorById(id));
  resetInputBorders();
}

/**
 * Clears error message for a specific element
 * 
 * @param {string} id - ID of the error element to clear
 */
function clearErrorById(id) {
  const element = document.getElementById(id);
  if (element) element.textContent = "";
}

/**
 * Resets all input field border colors to default
 */
function resetInputBorders() {
  SIGNUP_NAME_INPUT.style.borderColor = "";
  SIGNUP_EMAIL_INPUT.style.borderColor = "";
  SIGNUP_PSW_INPUT.style.borderColor = "";
  SIGNUP_CONF_PSW_INPUT.style.borderColor = "";
}

/**
 * Displays success overlay animation
 */
function showSuccessOverlay() {
  const overlay = document.getElementById("successOverlay");
  if (overlay) {
    overlay.style.display = "flex";
  }
}

/**
 * Initializes all event listeners for the sign up form
 */
function initEventListeners() {
  initPasswordToggle();
  initSignUpButtonState();
  initPasswordMatchListener();
  initFormSubmitListener();
  initOutsideClickListener();
}

/**
 * Sets up password match validation listener
 */
function initPasswordMatchListener() {
  if (SIGNUP_CONF_PSW_INPUT) {
    SIGNUP_CONF_PSW_INPUT.addEventListener("input", checkPasswordMatch);
  }
}

/**
 * Sets up sign up form submit event listener
 */
function initFormSubmitListener() {
  if (SIGNUP_FORM) {
    SIGNUP_FORM.addEventListener("submit", handleSignUpSubmit);
  }
}

/**
 * Sets up click outside form to clear errors
 */
function initOutsideClickListener() {
  document.addEventListener("click", (event) => {
    if (SIGNUP_FORM && !SIGNUP_FORM.contains(event.target)) {
      clearSignUpErrors();
    }
  });
}

initEventListeners();