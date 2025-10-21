/**
 * User Authentication Check für geschützte Seiten
 * @module checkActiveUser
 */

import { getCurrentUser, logoutUser } from './scripts/firebase_auth.js';

/**
 * Prüft ob User eingeloggt ist
 * Wird auf geschützten Seiten aufgerufen
 */
async function checkUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    // Kein User eingeloggt → Zurück zu Login
    window.location.replace("../../index.html");
  }
}

/**
 * Logout Funktion
 * Wird vom Logout Button aufgerufen
 */
function logout() {
  logoutUser();
}

// Automatisch beim Laden der Seite prüfen
checkUser();

// Für globalen Zugriff (falls in HTML onclick verwendet)
window.logout = logout;