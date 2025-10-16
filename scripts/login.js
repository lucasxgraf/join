document.addEventListener("DOMContentLoaded", function () {
  const BG_OVERLAY = document.querySelector(".bg_overlay_responsive");
  setTimeout(() => {
    BG_OVERLAY.style.animation = "fadeOut 1s forwards";
    setTimeout(() => {
      BG_OVERLAY.style.display = "none";
    }, 800);
  }, 1200);
});

function startIntro() {
  const LOGO = document.querySelector('.join_image');
  const PARTS = document.querySelectorAll('.login_header, .login_card, footer');
  if (!LOGO) return;
  LOGO.addEventListener('animationstart', () => {
    PARTS.forEach((el,i) => {
      el.style.visibility = 'visible';
      el.style.animation = `fadeIn 240ms ease-out ${i*80}ms forwards`;
    });
  }, { once: true });
}
document.addEventListener('DOMContentLoaded', startIntro);

document.addEventListener('DOMContentLoaded', () => {
  const SIGN_BTN = document.getElementById('sign_btn');
  if (!SIGN_BTN) return;
  SIGN_BTN.addEventListener('click', () => {
    window.location.href = './sign_up.html';
  });
});

document.addEventListener('DOMContentLoaded', () => {
  if (typeof initPasswordToggle === 'function') {
    initPasswordToggle('loginPassword', '.form_input_wrapper', 'toggleLoginPassword', 'toggleLoginPasswordOff');
  }
});