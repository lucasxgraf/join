import { getCurrentUser, logoutUser } from '../scripts/firebase_auth.js';

// Prüft ob User eingeloggt ist -> Wird auf geschützten Seiten aufgerufen

async function checkUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    window.location.replace("../../index.html");
  }
}

// Logout Funktion -> Wird vom Logout Button aufgerufen
logoutUser();

// Automatisch beim Laden der Seite prüfen
checkUser();

// Für globalen Zugriff (falls in HTML onclick verwendet)
window.logout = logout;