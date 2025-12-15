/**
 * @fileoverview Utility functions for form validation, password toggle, and UI animations.
 * @module script
 */

/**
 * Displays an error message in the specified element.
 * @param {string} elementId - The ID of the element to display the error in.
 * @param {string} message - The error message to display.
 */
function showError(elementId, message) {
  const ELEMENT = document.getElementById(elementId);
  if (ELEMENT) ELEMENT.textContent = message;
}

/**
 * Clears all error messages from elements with the 'error_message' class.
 */
function clearErrors() {
  document.querySelectorAll('.error_message').forEach(e => e.textContent = '');
}

/**
 * Initializes password visibility toggle functionality for an input field.
 * @param {string} inputId - The ID of the password input field.
 * @param {string} toggleId - The ID of the toggle icon element.
 * @param {string} lockIcon - Path to the lock icon.
 * @param {string} visibilityOffIcon - Path to the visibility off icon.
 * @param {string} visibilityIcon - Path to the visibility on icon.
 */
function initPasswordToggle(inputId, toggleId, lockIcon, visibilityOffIcon, visibilityIcon) {
  const INPUT = document.getElementById(inputId);
  const TOGGLE = document.getElementById(toggleId);
  const ICONS = { 
    lock: lockIcon, 
    off: visibilityOffIcon, 
    on: visibilityIcon 
  };
  
  if (!INPUT || !TOGGLE) 
  return;
  
  INPUT.addEventListener("input", () => 
  updateToggleIcon(INPUT, TOGGLE, ICONS));

  TOGGLE.addEventListener("click", () => 
  togglePasswordVisibility(INPUT, TOGGLE, ICONS));
}

/**
 * Updates the toggle icon based on input state.
 * @param {HTMLInputElement} input - The password input element.
 * @param {HTMLElement} toggle - The toggle icon element.
 * @param {Object} icons - Object containing icon paths.
 * @param {string} icons.lock - Path to the lock icon.
 * @param {string} icons.off - Path to the visibility off icon.
 * @param {string} icons.on - Path to the visibility on icon.
 */
function updateToggleIcon(input, toggle, icons) {
  if (input.value.length === 0) {
    toggle.src = icons.lock;
  } else if (input.type === "password") {
    toggle.src = icons.off;
  } else {
    toggle.src = icons.on;
  }
}

/**
 * Toggles password visibility between hidden and visible.
 * @param {HTMLInputElement} input - The password input element.
 * @param {HTMLElement} toggle - The toggle icon element.
 * @param {Object} icons - Object containing icon paths.
 * @param {string} icons.lock - Path to the lock icon.
 * @param {string} icons.off - Path to the visibility off icon.
 * @param {string} icons.on - Path to the visibility on icon.
 */
function togglePasswordVisibility(input, toggle, icons) {
  if (input.type === "password") {
    input.type = "text";
    toggle.src = icons.on;
  } else {
    input.type = "password";
    toggle.src = input.value.length === 0 ? icons.lock : icons.off;
  }
}

/**
 * Navigates back to the previous page in browser history.
 */
function goBack() {
  window.history.back();
}

/**
 * Fades in an element with animation after a delay.
 * @param {string} selector - CSS selector for the element to fade in.
 * @param {number} [delay=1000] - Delay in milliseconds before fade in starts.
 */
function fadeInElement(selector, delay = 1000) {
  const ELEMENT = document.querySelector(selector);
  if (!ELEMENT) return;
  
  setTimeout(() => {
    ELEMENT.style.display = "block";
    ELEMENT.style.animation = "fadeIn 3s forwards";
  }, delay);
}

/**
 * Validates input field and displays error message if empty
 * @param {string} displayid - The ID of the error message element
 * @param {string} currentId - The ID of the input element to validate
 * @param {string} inputFrame - The ID of the wrapper element for error styling
 */
function validateInput(displayid, currentId, inputFrame) {
    const input = document.getElementById(currentId);
    const output = document.getElementById(displayid);
    const borderError = document.getElementById(inputFrame);
    cleanValdedatError(displayid, currentId, inputFrame);
    
    if (!input || !output || !borderError) return; 
    if (input.value.trim() === "") {
        output.innerHTML = "This field is required.";
        borderError.classList.add('errorBorder');
    } else {
        output.innerHTML = "";
        borderError.classList.remove('errorBorder');
    }
}

function cleanValdedatError(displayid, inputFrame) {
  const output = document.getElementById(displayid);
  const borderError = document.getElementById(inputFrame);

  if (!output || !borderError) return;

  if (borderError.classList.contains('errorBorder')) {
    if ( output.innerHTML === "This field is required.") {
      borderError.classList.remove('errorBorder');
      output.innerHTML = "";
    }
  }
}