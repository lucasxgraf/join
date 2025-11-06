let CONTACT_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"

let contacts = [];


async function init() {
await fetchContacts();
algorithm();
//renderContacts();
}

async function fetchContacts() {
    let response = await fetch(CONTACT_URL);
    let responseToJSON = await response.json();
    let contactObj = responseToJSON.contactlist || responseToJSON;
    let contactArray = Object.values(contactObj);
    contacts = contactArray;
}

function renderContacts(letter) {
    let contactListContent = document.getElementById(`${letter}`);
    contactListContent.innerHTML = "";
    for (let index = 0; index < contacts.length; index++) {
        if (letter == contacts[index]["Name"][0]) {
            contactListContent.innerHTML += `<div class="contact">
            <button class="contact-picture">${contactPictureLetters(letter, index)}</button><div><p>${checkRenderContactsName(letter, index)}</p><p>${checkRenderContactsEmail(letter, index)}</p></div>
            </div>`;
        }        
    }
}


function algorithm() {
    contacts.sort();
    let letter = "";
    contacts.forEach(contact => {
    if (letter !== contact.Name[0]) {
            letter = contact.Name[0];
            document.getElementById('contact_list').innerHTML += `<div class="letter">${letter}</div><div class="contact-line"></div>
            <div id="${letter}"></div>`;
        renderContacts(letter);
        }
    })
}

function checkRenderContactsName(letter, index) {
    if (letter == contacts[index]["Name"][0]) {
        return contacts[index]["Name"];
    }
}

function checkRenderContactsEmail(letter, index) {
    if (letter == contacts[index]["Name"][0]) {
        return contacts[index]["E-Mail"];
    }
}

function contactPictureLetters(letter, index) {
    let name = contacts[index]["Name"];
    let spaceIndex = name.indexOf(" ");
    let firstLetterAfterSpace = name[spaceIndex + 1];
    return letter + firstLetterAfterSpace;
}

function getRandomColor() {
  // Werte zwischen 0 und 255
  let r = Math.floor(Math.random() * 256);
  let g = Math.floor(Math.random() * 256);
  let b = Math.floor(Math.random() * 256);

  // Helligkeit berechnen (relative luminance)
  // Formel nach WCAG: 0.299*R + 0.587*G + 0.114*B
  let brightness = 0.299 * r + 0.587 * g + 0.114 * b;

  // Falls zu hell (>200) oder zu dunkel (<50): nochmal probieren
  if (brightness > 200 || brightness < 50) {
    return getRandomColor();
  }

  // RGB-String zurückgeben
  return document.body.style.backgroundColor =`rgb(${r}, ${g}, ${b})`;
}

// Beispiel: Hintergrundfarbe setzen
document.body.style.backgroundColor = getRandomColor();