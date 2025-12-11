import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  updateProfile
} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';

import { 
  ref, 
  set, 
  get 
} from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

import { AUTH, DATABASE } from './firebase_config.js';

const COLORS = [
  "#FF7A00", "#FF5EB3", "#6E52FF", 
  "#9327FF", "#00BEE8", "#1FD7C1", 
  "#FF745E", "#FFA35E", "#FC71FF",
  "#FFC701", "#0038FF", "#C3FF2B",
  "#FFE62B", "#FF4646", "#FFBB2B",
];

const LOGIN_PAGES = ['index.html', 'login.html', 'sign_up.html'];
const PROTECTED_PAGE = 'test.html';


async function signUpUser(name, email, password) {
  try {
    const USER_CREDENTIAL = await createUserWithEmailAndPassword(AUTH, email, password);
    const USER = USER_CREDENTIAL.user;
    await updateProfile(USER, {
      displayName: name
    });
    await saveUserToDatabase(USER.uid, name, email);
      return { success: true, USER };
  } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
  }
}

async function saveUserToDatabase(uid, name, email) {
  const USER_REF = ref(DATABASE, `users/${uid}`);
  await set(USER_REF, {
    name: name,
    email: email,
    color: getRandomColor(),
    createdAt: new Date().toISOString()
  });
}

async function loginUser(email, password) {
  try {
    const USER_CREDENTAIL = await signInWithEmailAndPassword(AUTH, email, password);
    const userData = await getUserData(USER_CREDENTAIL.user.uid);
    localStorage.setItem("headerName", userData.name);
    return { success: true, user: USER_CREDENTAIL.user};
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

async function loginAsGuest() {
  try {
    const USER_CREDENTAIL = await signInAnonymously(AUTH);
    localStorage.setItem("headerName", "Guest");
    return { success: true, user: USER_CREDENTAIL.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}


async function logoutUser() {
  try {
    localStorage.removeItem("headerName");
    await signOut(AUTH);
    window.location.replace("../../../join/index.html");
  } catch (error) {
    console.error("Logout Error:", error);
  }
}


function watchAuthState() {
  onAuthStateChanged(AUTH, (user) => {
    const CURRENT_PATH = window.location.pathname;
    const IS_ON_LOGIN_PAGE = LOGIN_PAGES.some(page => CURRENT_PATH.endsWith(page));

    if (user && IS_ON_LOGIN_PAGE) {
      window.location.href = PROTECTED_PAGE;
    } else if (!user && !IS_ON_LOGIN_PAGE) {
      window.location.replace("../../../join/index.html");
    }
  });
}

function onAuthChange(callback) {
  return onAuthStateChanged(AUTH, callback);
}

function getCurrentUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(AUTH, (user) => {
      resolve(user);
    });
  });
}

async function getUserData(uid) {
  try {
    const USER_REF = ref(DATABASE, `users/${uid}`);
    const snapshot = await get(USER_REF);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address or correct your password.',
    'auth/operation-not-allowed': 'Operation not allowed.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password.',
    'auth/invalid-credential': 'Check your email and password. Please try again.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/network-request-failed': 'Network error. Please check your connection.'
  };

  return errorMessages[errorCode] || 'An error occurred. Please try again.';
}

export {
  signUpUser,
  loginUser,
  loginAsGuest,
  logoutUser,
  watchAuthState,
  getCurrentUser,
  getUserData,
  onAuthChange
};

window.signUpUser = signUpUser;
window.loginUser = loginUser;
window.loginAsGuest = loginAsGuest;
window.logoutUser = logoutUser;
window.watchAuthState = watchAuthState;
window.getCurrentUser = getCurrentUser;
window.getUserData = getUserData;
window.onAuthChange = onAuthChange;

