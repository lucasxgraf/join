document.addEventListener('DOMContentLoaded', () => {
  const BACK_BTN = document.getElementById('backBtn');
  const SIGN_UP_FORM = document.getElementById('signupForm');

  if (BACK_BTN) {
    BACK_BTN.addEventListener('click', () => {
      window.location.href = './index.html';
    });
  }

  if (SIGN_UP_FORM) {
    SIGN_UP_FORM.addEventListener('submit', (e) => {
      e.preventDefault();
      const NAME = document.getElementById('signUpName').value;
      const EMAIL = document.getElementById('signUpEmail').value;
      const PASSWORD = document.getElementById('signUpPassword').value;
      const CONFIRM_PASSWORD = document.getElementById('signUpConfirmPassword').value;
      const PRIVACY_CHECKBOX = document.getElementById('privacyCheckbox');

      clearErrors();

      if (PASSWORD !== CONFIRM_PASSWORD) {
        showError('confirmPasswordError', 'Passwords do not match');
        return;
      }

      if (!PRIVACY_CHECKBOX.checked) {
        alert('Please accept the Privacy Policy');
        return;
      }

      console.log('Sign up successful:', { NAME, EMAIL });
      window.location.href = './index.html';
    });
  }

  initPasswordToggle('signUpPassword', '.form_input_wrapper', 'togglePassword', 'togglePasswordOff');
  initPasswordToggle('signUpConfirmPassword', '.form_input_wrapper', 'toggleConfirmPassword', 'toggleConfirmPasswordOff');
});