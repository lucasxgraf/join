// Registriert einen neuen Nutzer
async function addUser() {
  // Eingaben holen
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value;
  const confirm = document.getElementById('confirm_password').value;

  // Passwort-Bestätigung prüfen
  if (password !== confirm) {
    alert('Passwörter stimmen nicht überein');
    return;
  }

  // Existierende Nutzer laden und E-Mail auf Duplikat prüfen
  const all = await dbGet('users') || {};
  const users = Object.values(all);
  if (users.some(u => u.email === email)) {
    alert('E-Mail schon registriert');
    return;
  }

  // Nutzer speichern 
  await dbPost('users', { name, email, password, createdAt: Date.now() });

  // Weiterleiten mit Erfolgsnachricht
  window.location.href =
    'login.html?msg=' + encodeURIComponent('You signed up successfully');
}




