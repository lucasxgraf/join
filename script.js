function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error_message').forEach(e => e.textContent = '');
}

function initPasswordToggle(inputId, toggleId, lockIcon, visibilityOffIcon, visibilityIcon) {
  const INPUT = document.getElementById(inputId);
  const TOGGLE = document.getElementById(toggleId);
  
  if (!INPUT || !TOGGLE) return;

  // Input Event: Icon ändern basierend auf Wert
  INPUT.addEventListener("input", () => {
    if (INPUT.value.length === 0) {
      TOGGLE.src = lockIcon;
    } else if (INPUT.type === "password") {
      TOGGLE.src = visibilityOffIcon;
    } else {
      TOGGLE.src = visibilityIcon;
    }
  });

  // Click Event: Password sichtbar/unsichtbar machen
  TOGGLE.addEventListener("click", () => {
    if (INPUT.type === "password") {
      INPUT.type = "text";
      TOGGLE.src = visibilityIcon;
    } else {
      INPUT.type = "password";
      if (INPUT.value.length === 0) {
        TOGGLE.src = lockIcon;
      } else {
        TOGGLE.src = visibilityOffIcon;
      }
    }
  });
}

function goBack() {
  window.history.back();
}

function fadeInElement(selector, delay = 1000) {
  const element = document.querySelector(selector);
  if (!element) return;
  
  setTimeout(() => {
    element.style.display = "block";
    element.style.animation = "fadeIn 3s forwards";
  }, delay);
}