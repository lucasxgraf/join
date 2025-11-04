function showError(elementId, message) {
  const ELEMENT = document.getElementById(elementId);
  if (ELEMENT) ELEMENT.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error_message').forEach(e => e.textContent = '');
}

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

function updateToggleIcon(input, toggle, icons) {
  if (input.value.length === 0) {
    toggle.src = icons.lock;
  } else if (input.type === "password") {
    toggle.src = icons.off;
  } else {
    toggle.src = icons.on;
  }
}

function togglePasswordVisibility(input, toggle, icons) {
  if (input.type === "password") {
    input.type = "text";
    toggle.src = icons.on;
  } else {
    input.type = "password";
    toggle.src = input.value.length === 0 ? icons.lock : icons.off;
  }
}

function goBack() {
  window.history.back();
}

function fadeInElement(selector, delay = 1000) {
  const ELEMENT = document.querySelector(selector);
  if (!ELEMENT) return;
  
  setTimeout(() => {
    ELEMENT.style.display = "block";
    ELEMENT.style.animation = "fadeIn 3s forwards";
  }, delay);
}