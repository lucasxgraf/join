import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";

import { getAuth } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';

import { getDatabase } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

const FIREBASE_CONFIG = {
  apiKey: "AIzaSyDZ8H-y7k78IYizot3dt3YNEmjFdDl79X8",
  authDomain: "join-ee4e0.firebaseapp.com",
  databaseURL: "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-ee4e0",
  storageBucket: "join-ee4e0.firebasestorage.app",
  messagingSenderId: "856619134139",
  appId: "1:856619134139:web:ab0c32f3aff766bd758d9e"
};

const APP_FIREBASE = initializeApp(FIREBASE_CONFIG);
export const AUTH = getAuth(APP_FIREBASE);
export const DATABASE = getDatabase(APP_FIREBASE);