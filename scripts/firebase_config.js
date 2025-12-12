import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js';
import { getAuth } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-auth.js';
import { getDatabase } from 'https://www.gstatic.com/firebasejs/12.4.0/firebase-database.js';

/**
 * Firebase configuration object
 * Contains API keys and project identifiers for Firebase services
 * 
 * @type {Object}
 */
const firebaseConfig = {
  apiKey: "AIzaSyBqLXxJqJqxqxqxqxqxqxqxqxqxqxqxqxq",
  authDomain: "join-ee4e0.firebaseapp.com",
  databaseURL: "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "join-ee4e0",
  storageBucket: "join-ee4e0.firebasestorage.app",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdefghijklmnop"
};

/**
 * Initialized Firebase application instance
 * 
 * @type {FirebaseApp}
 */
const APP = initializeApp(firebaseConfig);

/**
 * Firebase Authentication service instance
 * Used for user authentication operations
 * 
 * @type {Auth}
 */
export const AUTH = getAuth(APP);

/**
 * Firebase Realtime Database service instance
 * Used for data storage and retrieval operations
 * 
 * @type {Database}
 */
export const DATABASE = getDatabase(APP);