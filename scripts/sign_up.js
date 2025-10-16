document.addEventListener('DOMContentLoaded', () => {
  const backBtn = document.getElementById('backBtn');
  const signupForm = document.getElementById('signupForm');

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.location.href = './index.html';
    });
  }

  if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('signUpName').value;
      const email = document.getElementById('signUpEmail').value;
      const password = document.getElementById('signUpPassword').value;
      const confirmPassword = document.getElementById('signUpConfirmPassword').value;
      const privacyCheckbox = document.getElementById('privacyCheckbox');

      clearErrors();

      if (password !== confirmPassword) {
        showError('confirmPasswordError', 'Passwords do not match');
        return;
      }

      if (!privacyCheckbox.checked) {
        alert('Please accept the Privacy Policy');
        return;
      }

      console.log('Sign up successful:', { name, email });
      window.location.href = './index.html';
    });
  }

  // Init Password Toggles
  initPasswordToggle('signUpPassword', '.form_input_wrapper', 'togglePassword', 'togglePasswordOff');
  initPasswordToggle('signUpConfirmPassword', '.form_input_wrapper', 'toggleConfirmPassword', 'toggleConfirmPasswordOff');
});

function showError(elementId, message) {
  const errorElement = document.getElementById(elementId);
  if (errorElement) errorElement.textContent = message;
}

function clearErrors() {
  const errors = document.querySelectorAll('.error_message');
  errors.forEach(error => error.textContent = '');
}

// Passwort Toggle Logik: 
// - Standard: verdeckt (password) + Lock sichtbar
// - Bei Eingabe: Augen erscheinen, bleibt verdeckt
// - Klick "Show": sichtbar (text) + hide-Icon
// - Weitere Eingabe: sofort wieder verdeckt (password)
function initPasswordToggle(inputId, wrapperSelector, showId, hideId) {
  const input = document.getElementById(inputId);
  if (!input) return;
  const wrapper = input.closest(wrapperSelector);
  const btnShow = document.getElementById(showId);
  const btnHide = document.getElementById(hideId);
  if (!wrapper) return;

  function sync(forceMask = false) {
    const hasVal = input.value.length > 0;
    if (forceMask && hasVal && input.type !== 'password') {
      input.type = 'password';
    }
    wrapper.classList.toggle('has-value', hasVal);
    wrapper.classList.toggle('showing', input.type === 'text');
  }

  // Klick: Sichtbar
  btnShow?.addEventListener('click', () => {
    input.type = 'text';
    wrapper.classList.add('showing');
  });

  // Klick: Verbergen
  btnHide?.addEventListener('click', () => {
    input.type = 'password';
    wrapper.classList.remove('showing');
  });

  // Eingabe: sobald Inhalt vorhanden ist -> maskieren
  input.addEventListener('input', () => {
    if (input.value) {
      input.type = 'password';
      wrapper.classList.remove('showing');
    }
    sync(false);
  });

  // Initialzustand
  input.type = 'password';
  wrapper.classList.remove('showing');
  sync(false);
}