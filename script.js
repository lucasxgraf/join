function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error_message').forEach(e => e.textContent = '');
}

function initPasswordToggle(inputId, wrapperSelector, showId, hideId) {
  const INPUT = document.getElementById(inputId);
  if (!INPUT) return;
  const WRAPPER = INPUT.closest(wrapperSelector);
  const BTN_SHOW = document.getElementById(showId);
  const BTN_HIDE = document.getElementById(hideId);
  if (!WRAPPER) return;

  function sync(forceMask = false) {
    const hasVal = INPUT.value.length > 0;
    if (forceMask && hasVal && INPUT.type !== 'password') {
      INPUT.type = 'password';
    }
    WRAPPER.classList.toggle('has-value', hasVal);
    WRAPPER.classList.toggle('showing', INPUT.type === 'text');
  }

  BTN_SHOW?.addEventListener('click', () => {
    INPUT.type = 'text';
    WRAPPER.classList.add('showing');
  });

  BTN_HIDE?.addEventListener('click', () => {
    INPUT.type = 'password';
    WRAPPER.classList.remove('showing');
  });

  INPUT.addEventListener('input', () => {
    if (INPUT.value) {
      INPUT.type = 'password';
      WRAPPER.classList.remove('showing');
    }
    sync(false);
  });

  INPUT.type = 'password';
  WRAPPER.classList.remove('showing');
  sync(false);
}