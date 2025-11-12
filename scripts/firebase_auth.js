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
const PROTECTED_PAGE = 'test.html'; // Hier Pfad von Summary Page eintragen

// SIGN UP FUNKTION

// Registriert einen neuen User mit Firebase Auth und speichert zusätzliche Daten in Database
async function signUpUser(name, email, password) {
  try {
    // 1. User in Firebase Auth erstellen
    const USER_CREDENTIAL = await createUserWithEmailAndPassword(AUTH, email, password);
    const USER = USER_CREDENTIAL.user;
    // 2. Display Name setzen
    await updateProfile(USER, {
      displayName: name
    });
    // 3. Zusätzliche User-Daten in Database speichern
    await saveUserToDatabase(USER.uid, name, email);
      return { success: true, USER };
  } catch (error) {
      return { success: false, error: getErrorMessage(error.code) };
  }
}

// Speichert User-Daten in Realtime Database
async function saveUserToDatabase(uid, name, email) {
  const USER_REF = ref(DATABASE, `users/${uid}`);
  await set(USER_REF, {
    name: name,
    email: email,
    color: getRandomColor(),
    createdAt: new Date().toISOString()
  });
}

// Loggt einen User mit Email und Passwort ein
async function loginUser(email, password) {
  try {
    const USER_CREDENTAIL = await signInWithEmailAndPassword(AUTH, email, password);
    return { success: true, user: USER_CREDENTAIL.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Loggt einen Guest User ein (Anonymous Auth)
async function loginAsGuest() {
  try {
    const USER_CREDENTAIL = await signInAnonymously(AUTH);
    return { success: true, user: USER_CREDENTAIL.user };
  } catch (error) {
    return { success: false, error: getErrorMessage(error.code) };
  }
}

// Loggt den aktuellen User aus
async function logoutUser() {
  try {
    await signOut(AUTH);
    window.location.replace("../../index.html");
  } catch (error) {
    console.error("Logout Error:", error);
  }
}

// Überwacht den Auth State und leitet User entsprechend weiter
// Wird automatisch aufgerufen wenn sich der Auth State ändert
function watchAuthState() {
  onAuthStateChanged(AUTH, (user) => {
    const CURRENT_PATH = window.location.pathname;
    const IS_ON_LOGIN_PAGE = LOGIN_PAGES.some(page => CURRENT_PATH.endsWith(page));

    if (user && IS_ON_LOGIN_PAGE) {
      // User ist eingeloggt und auf Login-Page → Weiterleitung
      window.location.href = PROTECTED_PAGE;
    } else if (!user && !IS_ON_LOGIN_PAGE) {
      // User ist nicht eingeloggt und auf geschützter Page → Zurück zu Login
      window.location.replace("../index.html");
    }
  });
}

// Prüft ob ein User eingeloggt ist (für geschützte Seiten)
function getCurrentUser() {
  return new Promise((resolve) => {
    onAuthStateChanged(AUTH, (user) => {
      resolve(user);
    });
  });
}

// Holt User-Daten aus der Database
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

// Gibt eine zufällige Farbe zurück
function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

// Firebase Error Codes in Userfeedback
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
};

window.logoutUser = logoutUser;