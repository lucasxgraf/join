/**
 * @fileoverview Firebase authentication and user management functionality.
 * @module firebase_auth
 */

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

/**
 * Array of available user colors.
 * @type {string[]}
 */
const COLORS = [
  "#FF7A00", "#FF5EB3", "#6E52FF", 
  "#9327FF", "#00BEE8", "#1FD7C1", 
  "#FF745E", "#FFA35E", "#FC71FF",
  "#FFC701", "#0038FF", "#C3FF2B",
  "#FFE62B", "#FF4646", "#FFBB2B",
];

/**
 * Array of login page paths.
 * @type {string[]}
 */
const LOGIN_PAGES = ['index.html', 'login.html', 'sign_up.html'];

/**
 * Protected page path.
 * @type {string}
 */
const PROTECTED_PAGE = 'test.html';

/**
 * Signs up a new user with email and password.
 * @async
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{success: boolean, USER?: Object, error?: string}>} Result object with success status.
 */
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

/**
 * Saves user data to the database.
 * @async
 * @param {string} uid - The user's unique ID.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 */
async function saveUserToDatabase(uid, name, email) {
  const color = getRandomColor();
  const USER_REF = ref(DATABASE, `users/${uid}`);
  await set(USER_REF, {
    name: name,
    email: email,
    color: color,
    createdAt: new Date().toISOString()
  });
  
  await addUserToContacts(name, email, color);
}

/**
 * Adds user to the contacts list.
 * @async
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} color - The user's assigned color.
 */
async function addUserToContacts(name, email, color) {
  const contactData = createContactData(name, email, color);
  await saveContactToDatabase(contactData);
}

/**
 * Creates contact data object from user information.
 * @param {string} name - The user's name.
 * @param {string} email - The user's email address.
 * @param {string} color - The user's assigned color.
 * @returns {Object} Contact data object.
 */
function createContactData(name, email, color) {
  const [firstname, ...rest] = name.trim().split(" ");
  const secondname = rest.join(" ");
  
  return {
    color: color,
    mail: email,
    name: {
      firstname: firstname || "",
      secondname: secondname || ""
    },
    tel: "<i> Please update your phone number <i>"
  };
}

/**
 * Saves contact data to the database.
 * @async
 * @param {Object} contactData - The contact data to save.
 */
async function saveContactToDatabase(contactData) {
  const BASE_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/";
  await fetch(BASE_URL + "contacts/contactlist.json", {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(contactData)
  });
}

/**
 * Logs in a user with email and password.
 * @async
 * @param {string} email - The user's email address.
 * @param {string} password - The user's password.
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Result object with success status.
 */
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

/**
 * Logs in a user as a guest.
 * @async
 * @returns {Promise<{success: boolean, user?: Object, error?: string}>} Result object with success status.
 */
async function loginAsGuest() {
  try {
    const USER_CREDENTAIL = await signInAnonymously(AUTH);
    localStorage.setItem("headerName", "Guest");
    return { success: true, user: USER_CREDENTAIL.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Logs out the current user.
 * @async
 */
async function logoutUser() {
  try {
    localStorage.removeItem("headerName");
    await signOut(AUTH);
    window.location.replace("../../../join/index.html");
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

/**
 * Watches authentication state changes and handles redirects.
 */
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

/**
 * Registers a callback for authentication state changes.
 * @param {Function} callback - Callback function to execute on auth state change.
 * @returns {Function} Unsubscribe function.
 */
function onAuthChange(callback) {
  return onAuthStateChanged(AUTH, callback);
}

/**
 * Gets the current authenticated user.
 * @async
 * @returns {Promise<Object|null>} The current user object or null.
 */
function getCurrentUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(AUTH, (user) => {
      resolve(user);
    });
  });
}

/**
 * Retrieves user data from the database.
 * @async
 * @param {string} uid - The user's unique ID.
 * @returns {Promise<Object|null>} User data object or null.
 */
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

/**
 * Returns a random color from the COLORS array.
 * @returns {string} A random color hex code.
 */
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

/**
 * Converts Firebase error codes to user-friendly messages.
 * @param {string} errorCode - The Firebase error code.
 * @returns {string} User-friendly error message.
 */
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