import { loginUser, loginAsGuest, } from './firebase_auth.js';

const REF_LOGIN_BTN = document.querySelector("#loginBtn");
const PASSWORD_INPUT = document.getElementById("loginPassword");
const TOGGLE_PASSWORD = document.getElementById("togglePassword");
const GUEST_LOGIN_BTN = document.querySelector("#guestLog");
const LOGIN_CARD = document.querySelector(".login_card");
const LOGIN_HEADER = document.querySelector(".login_header");
const FOOTER = document.querySelector("footer");
const LOGO = document.querySelector(".join_image");
const FORM_CONTENT = document.querySelector(".form_content");
const SKIP = shouldSkipSplash();


function shouldSkipSplash() {
  return new URLSearchParams(window.location.search).get("noSplash") === "1";
}

document.addEventListener("DOMContentLoaded", function () {
  skipSplashIfNeeded();

  setTimeout(() => {
    fadeInLoginElements();
  }, SKIP ? 0 : 1000);


  initPasswordToggle(
    "loginPassword",
    "togglePassword",
    "./assets/svg/lock.svg",
    "./assets/svg/visibility_off.svg",
    "./assets/svg/visibility.svg"
  );
});


function skipSplashIfNeeded() {
  if (SKIP && LOGO) {
    LOGO.style.animation = "none";
    LOGO.style.transform = "translate(0, 0) scale(1)";
    LOGO.style.top = "24px";
    LOGO.style.left = "24px";
    
    const BG_OVERLAY = document.querySelector(".bg_overlay_responsive");
    if (BG_OVERLAY) {
      BG_OVERLAY.style.display = "none";
    }
    
    const joinImage = document.querySelector('.join_image');
    joinImage.style.content = 'url("./assets/img/logo/join_logo.png")';
    if (window.innerWidth <= 475) {
      LOGO.style.top = "24px";
      LOGO.style.left = "24px";
      LOGO.style.height = "80px";
      LOGO.style.width = "64px";
    }
  }
}

function fadeInLoginElements() {
  const elements = [
    { el: FOOTER, display: "block" },
    { el: LOGIN_HEADER, display: "flex" },
    { el: LOGIN_CARD, display: "inline" }
  ];
  
  elements.forEach(({ el, display }) => {
    el.style.display = display;
    el.style.animation = "fadeIn 600ms forwards";
  });
}




if (REF_LOGIN_BTN) {
  REF_LOGIN_BTN.addEventListener("click", handleLoginSubmit);
}


if (GUEST_LOGIN_BTN) {
  GUEST_LOGIN_BTN.addEventListener("click", handleGuestLogin);
}


if (PASSWORD_INPUT && TOGGLE_PASSWORD) {
  PASSWORD_INPUT.addEventListener("input", () => {
    if (PASSWORD_INPUT.value.length === 0) {
      TOGGLE_PASSWORD.src = "./assets/svg/lock.svg";
    } else if (PASSWORD_INPUT.type === "password") {
      TOGGLE_PASSWORD.src = "./assets/svg/visibility_off.svg";
    } else {
      TOGGLE_PASSWORD.src = "./assets/svg/visibility.svg";
    }
  });
}


document.addEventListener("click", function (event) {
  if (FORM_CONTENT && !FORM_CONTENT.contains(event.target)) {
    clearLoginErrors();
  }
});


async function handleLoginSubmit(event) {
  event.preventDefault();
  clearLoginErrors();

  const EMAIL = document.getElementById("loginEmail").value.trim();
  const PASSWORD = document.getElementById("loginPassword").value;
  if (!validateLoginInputs(EMAIL, PASSWORD)) {
    return;
  }
  const RESULT = await loginUser(EMAIL, PASSWORD);
  if (RESULT.success) {
    window.location.href = "pages/summary.html";
  } else {
    showLoginError(RESULT.error);
  }
}

async function handleGuestLogin() {
  const RESULT = await loginAsGuest();
  
  if (RESULT.success) {
    window.location.href = "pages/summary.html";
  } else {
    alert("Guest login failed. Please try again.");
  }
}

function validateLoginInputs(email, password) {
  let isValid = true;

  if (!email) {
    showError("emailError", "Please enter your email address here.");
    document.getElementById("loginEmail").style.borderColor = "red";
    isValid = false;
  }

  if (!password) {
    showError("passwordError", "Please enter your password here.");
    document.getElementById("loginPassword").style.borderColor = "red";
    isValid = false;
  }

  return isValid;
}

function showLoginError(message) {
  const EMAIL_INPUT = document.getElementById("loginEmail");
  const PASSWORD_INPUT = document.getElementById("loginPassword");
  
  EMAIL_INPUT.style.borderColor = "red";
  PASSWORD_INPUT.style.borderColor = "red";
  document.getElementById("passwordError").innerText = message;
}

function clearLoginErrors() {
  document.getElementById("emailError").innerText = "";
  document.getElementById("passwordError").innerText = "";
  document.getElementById("loginEmail").style.borderColor = "";
  document.getElementById("loginPassword").style.borderColor = "";
}