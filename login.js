// Events: Formular-Login & Gast-Login
document.querySelector('.form')?.addEventListener('submit', login);
document.getElementById('guestBtn')?.addEventListener('click', () => {
  setLoggedInUserId('guest');           // Gast markieren
  location.href = './summary.html';     // direkt ins Dashboard
});

async function login(e) {
  e.preventDefault();                   // Form-Neuladung verhindern
  const email = document.getElementById('email').value.trim().toLowerCase(); // E-Mail normalisieren
  const password = document.getElementById('password').value;

  try {
    // Nutzer per E-Mail aus DB filtern
    const result = await dbGet('users', {
      orderBy: JSON.stringify('email'),
      equalTo: JSON.stringify(email)
    });

    if (!result || !Object.keys(result).length) return showMsg('E-Mail nicht gefunden.');
    const [uid, user] = Object.entries(result)[0]; // erstes Match

    // Passwort prüfen
    if (user.password !== password) return showMsg('Falsches Passwort.');

    setLoggedInUserId(uid);             // Session setzen
    location.href = './summary.html';   // weiterleiten
  } catch (err) {
    console.error(err);
    showMsg('Login fehlgeschlagen.');   // generische Fehlermeldung
  }
}

// Kurze Helper-Meldung im UI anzeigen
function showMsg(text) {
  const box = document.getElementById('msgBox');
  if (!box) return;
  box.textContent = text;
  box.style.display = 'block';
}
