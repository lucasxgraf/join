/**
 * Firebase Authentication Module
 * Alle Auth-Funktionen für Sign Up, Login, Logout und User-Management
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

// ====
// KONSTANTEN
// ====
const COLORS = [
  "rgb(255, 122, 0)",
  "rgb(147, 39, 255)", 
  "rgb(110, 82, 255)", 
  "rgb(252, 113, 255)", 
  "rgb(255, 187, 43)", 
  "rgb(31, 215, 193)", 
  "rgb(70, 47, 138)", 
  "rgb(255, 70, 70)", 
  "rgb(0, 190, 232)"
];

const LOGIN_PAGES = ['index.html', 'login.html', 'sign_up.html'];
const PROTECTED_PAGE = 'test.html';

// ====
// SIGN UP FUNKTION
// ====

/**
 * Registriert einen neuen User mit Firebase Auth und speichert zusätzliche Daten in Database
 * @param {string} name - Name des Users
 * @param {string} email - Email des Users
 * @param {string} password - Passwort des Users
 * @returns {Promise<void>}
 */
async function signUpUser(name, email, password) {
  try {
    // 1. User in Firebase Auth erstellen
    const userCredential = await createUserWithEmailAndPassword(AUTH, email, password);
    const user = userCredential.user;

    // 2. Display Name setzen
    await updateProfile(user, {
      displayName: name
    });

    // 3. Zusätzliche User-Daten in Database speichern
    await saveUserToDatabase(user.uid, name, email);

    return { success: true, user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

/**
 * Speichert User-Daten in Realtime Database
 * @param {string} uid - Firebase Auth User ID
 * @param {string} name - Name des Users
 * @param {string} email - Email des Users
 */
async function saveUserToDatabase(uid, name, email) {
  const userRef = ref(DATABASE, `users/${uid}`);
  await set(userRef, {
    name: name,
    email: email,
    color: getRandomColor(),
    createdAt: new Date().toISOString()
  });
}

// ====
// LOGIN FUNKTION
// ====

/**
 * Loggt einen User mit Email und Passwort ein
 * @param {string} email - Email des Users
 * @param {string} password - Passwort des Users
 * @returns {Promise<Object>}
 */
async function loginUser(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(AUTH, email, password);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// ====
// GUEST LOGIN (ANONYMOUS AUTH)
// ====

/**
 * Loggt einen Guest User ein (Anonymous Auth)
 * @returns {Promise<Object>}
 */
async function loginAsGuest() {
  try {
    const userCredential = await signInAnonymously(AUTH);
    return { success: true, user: userCredential.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// ====
// LOGOUT FUNKTION
// ====

/**
 * Loggt den aktuellen User aus
 * @returns {Promise<void>}
 */
async function logoutUser() {
  try {
    await signOut(AUTH);
    window.location.replace("../../index.html");
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

// ====
// AUTH STATE OBSERVER
// ====

/**
 * Überwacht den Auth State und leitet User entsprechend weiter
 * Wird automatisch aufgerufen wenn sich der Auth State ändert
 */
function watchAuthState() {
  onAuthStateChanged(AUTH, (user) => {
    const currentPath = window.location.pathname;
    const isOnLoginPage = LOGIN_PAGES.some(page => currentPath.endsWith(page));

    if (user && isOnLoginPage) {
      // User ist eingeloggt und auf Login-Page → Weiterleitung
      window.location.href = PROTECTED_PAGE;
    } else if (!user && !isOnLoginPage) {
      // User ist nicht eingeloggt und auf geschützter Page → Zurück zu Login
      window.location.replace("../../index.html");
    }
  });
}

/**
 * Prüft ob ein User eingeloggt ist (für geschützte Seiten)
 * @returns {Promise<Object|null>}
 */
function getCurrentUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(AUTH, (user) => {
      resolve(user);
    });
  });
}

/**
 * Holt User-Daten aus der Database
 * @param {string} uid - Firebase Auth User ID
 * @returns {Promise<Object|null>}
 */
async function getUserData(uid) {
  try {
    const userRef = ref(DATABASE, `users/${uid}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return snapshot.val();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
}

// ====
// HELPER FUNKTIONEN
// ====

/**
 * Gibt eine zufällige Farbe zurück
 * @returns {string}
 */
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

/**
 * Übersetzt Firebase Error Codes in benutzerfreundliche Nachrichten
 * @param {string} errorCode - Firebase Error Code
 * @returns {string}
 */
function getErrorMessage(errorCode) {
  const errorMessages = {
    'auth/email-already-in-use': 'This email is already registered.',
    'auth/invalid-email': 'Please enter a valid email address.',
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

// ====
// EXPORTS
// ====
export { 
  signUpUser, 
  loginUser, 
  loginAsGuest,
  logoutUser, 
  watchAuthState,
  getCurrentUser,
  getUserData
};