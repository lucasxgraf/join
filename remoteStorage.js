// Firebase RTDB Base-URL (endet mit "/"; REST-Calls enden auf ".json")
const BASE_URL = 'https://join-b215c-default-rtdb.europe-west1.firebasedatabase.app/';

/** GET: liest JSON unter z.B. "tasks" oder "tasks/abc123" */
async function dbGet(path) {
  const res = await fetch(`${BASE_URL}${path}.json`);
  if (!res.ok) throw new Error('DB GET fehlgeschlagen');
  return res.json();
}

/** POST: erzeugt neuen Eintrag unter Pfad; Antwort enthält i.d.R. { name: "<id>" } */
async function dbPost(path, data) {
  const res = await fetch(`${BASE_URL}${path}.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('DB POST fehlgeschlagen');
  return res.json();
}

