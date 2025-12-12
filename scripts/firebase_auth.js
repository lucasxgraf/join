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

/**
 * Creates a new user account with email and password
 * Updates user profile with display name and saves to database
 * 
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object with success status and user data or error message
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
 * Saves user data to Firebase Realtime Database
 * Also adds user as a contact in the contacts list
 * 
 * @param {string} uid - User's unique Firebase ID
 * @param {string} name - User's full name
 * @param {string} email - User's email address
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
 * Generates a random color from predefined color palette
 * 
 * @returns {string} Hex color code
 */
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

/**
 * Adds newly registered user to contacts list
 * Splits name into first and last name
 * 
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} color - Assigned color for user avatar
 */
async function addUserToContacts(name, email, color) {
  const contactData = createContactData(name, email, color);
  await saveContactToDatabase(contactData);
}

/**
 * Creates contact data object from user information
 * 
 * @param {string} name - User's full name
 * @param {string} email - User's email address
 * @param {string} color - Assigned color for user avatar
 * @returns {Object} Contact data object with name, email, color and phone
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
 * Saves contact data to Firebase database
 * 
 * @param {Object} contactData - Contact data object to save
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
 * Authenticates user with email and password
 * Stores user name in localStorage on success
 * 
 * @param {string} email - User's email address
 * @param {string} password - User's password
 * @returns {Promise<Object>} Object with success status and user data or error message
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
 * Authenticates user anonymously as guest
 * Sets guest name in localStorage
 * 
 * @returns {Promise<Object>} Object with success status and user data or error message
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
 * Logs out current user and redirects to login page
 * Clears user name from localStorage
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
 * Monitors authentication state changes
 * Redirects users based on authentication status and current page
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
 * Registers callback for authentication state changes
 * 
 * @param {Function} callback - Function to call when auth state changes
 * @returns {Function} Unsubscribe function
 */
function onAuthChange(callback) {
  return onAuthStateChanged(AUTH, callback);
}

/**
 * Gets currently authenticated user
 * 
 * @returns {Promise<Object|null>} Current user object or null if not authenticated
 */
function getCurrentUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(AUTH, (user) => {
      resolve(user);
    });
  });
}

/**
 * Retrieves user data from Firebase database
 * 
 * @param {string} uid - User's unique Firebase ID
 * @returns {Promise<Object|null>} User data object or null if not found
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
 * Converts Firebase error codes to user-friendly messages
 * 
 * @param {string} errorCode - Firebase error code
 * @returns {string} User-friendly error message
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

/**
 * Checks if user is authenticated and redirects to login if not
 * Should be called on protected pages
 */
async function checkAuthenticatedUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    window.location.replace("../../index.html");
  }
}

export {
  signUpUser,
  loginUser,
  loginAsGuest,
  logoutUser,
  watchAuthState,
  getCurrentUser,
  getUserData,
  onAuthChange,
  checkAuthenticatedUser
};

window.signUpUser = signUpUser;
window.loginUser = loginUser;
window.loginAsGuest = loginAsGuest;
window.logoutUser = logoutUser;
window.watchAuthState = watchAuthState;
window.getCurrentUser = getCurrentUser;
window.getUserData = getUserData;
window.onAuthChange = onAuthChange;
window.checkAuthenticatedUser = checkAuthenticatedUser;