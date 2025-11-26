let CONTACT_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/contacts.json"

let contacts = [];

let contactID = [];

const COLORS = [
  "#FF7A00", "#FF5EB3", "#6E52FF", 
  "#9327FF", "#00BEE8", "#1FD7C1", 
  "#FF745E", "#FFA35E", "#FC71FF",
  "#FFC701", "#0038FF", "#C3FF2B",
  "#FFE62B", "#FF4646", "#FFBB2B",
];

async function init() {
await fetchContacts();
//algorithm();
//renderContacts();
renderContactList()
}

async function fetchContacts() {
    let response = await fetch(CONTACT_URL);
    let responseToJSON = await response.json();
    let contactObj = responseToJSON.contactlist || responseToJSON;
    for (let id in contactObj) {
        let contactData = contactObj[id];
        contactData.id = id;   // ID INS OBJEKT EINTRAGEN
        contacts.push(contactData);
    }
}

function renderContacts(letter) {
    let contactListContent = document.getElementById(`${letter}`);
    contactListContent.innerHTML = "";
    for (let index = 0; index < contacts.length; index++) {
        if (letter == contacts[index]["name"]["firstname"][0]) {
            contactListContent.innerHTML += `<div class="contact" onclick="showContact(${index}, '${letter}')">
            <button class="contact-picture" style ="${getRandomColor()}">${contactPictureLetters(index)}</button><div><p>${checkRenderContactsName(letter, index)}</p><p class="small-email">${checkRenderContactsEmail(letter, index)}</p></div>
            </div>`;
        }        
    }
    contactClick();
}


function algorithm() {
    contacts.sort();
    let letter = "";
    contacts.forEach(contact => {
    if (letter !== contact.name.firstname[0]) {
            letter = contact.name.firstname[0];
            document.getElementById('contact_list').innerHTML += `<div class="letter">${letter}</div><div class="contact-line"></div>
            <div id="${letter}"></div>`;
        renderContacts(letter);
        }
    })
}

function checkRenderContactsName(letter, index) {
    if (letter == contacts[index]["name"]["firstname"][0]) {
        return contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"];
    }
}

function checkRenderContactsEmail(letter, index) {
    if (letter == contacts[index]["name"]["firstname"][0]) {
        return contacts[index]["mail"];
    }
}

function contactPictureLetters(index) {
    let name = contacts[index]["name"];
    return name.firstname[0] + name.secondname[0];
}

//function getRandomColor() {
 // let r = Math.floor(Math.random() * 256);
 // let g = Math.floor(Math.random() * 256);
 // let b = Math.floor(Math.random() * 256);
 // let brightness = 0.299 * r + 0.587 * g + 0.114 * b;
//  if (brightness > 200 || brightness < 50) {
  //  return getRandomColor();
  //}
 // return "background-color:" + " " + `rgb(${r}, ${g}, ${b})`;
//}

function showContact(index, letter) {
    if (document.getElementById('showContent' + index)) {
        return
    }
    let content = document.getElementById('contact_content');
    content.innerHTML = `<div class="info-content slide-in" id="showContent${index}">
    <div style="display: flex; gap: 48px">
    <button class="big-contact-picture" style ="background-color: ${contacts[index]["color"]};">${contactPictureLetters(index)}</button>
    <div style="display: flex; flex-direction: column;">
        <h2 class="fullname">${contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"]}</h2>
         <div class="contact-icons">
                <img id="edit" src="/assets/svg/edit_contact_icon_default.svg" onclick="editContactEvent(${index})">
                <img id="delete" src="/assets/svg/delete_contact_icon_default.svg">
         </div>
    </div>
    </div>
    <div class="informations">
        <h2>Contact Information</h2>
        <p>Email</p>
        <p>${contacts[index]["mail"]}</p>
        <p>Phone</p>
        <p>${contacts[index]["tel"]}</p>
    </div>
    </div>
    `
    hoverEdit();
    hoverDelete();
}

function addContactEvent(event) {
    event.stopPropagation();
    let index = undefined;
    let form = document.getElementById('main');
    let popupBlack = document.getElementById('popupBackground');
    popupBlack.classList.toggle("popup-overlay")
    form.innerHTML += addformTemplate(index);
    hoverCancel();
}

function closeForm(event) {
    event?.stopPropagation();
    hoverEdit();
    hoverDelete();
    let popupBlack = document.getElementById('popupBackground');
    let addForm = document.getElementById('add-Form');
    let editForm = document.getElementById('edit-Form');
    if (addForm) {
        addForm.remove();
        popupBlack.classList.toggle("popup-overlay");
    }
    if (editForm) {
        editForm.remove();
        popupBlack.classList.toggle("popup-overlay");
    }
}

async function addContact(event) {
    event.stopPropagation();
    let iName = document.getElementById('input-name').value;
    let iMail = document.getElementById('input-mail').value;
    let iPhone = document.getElementById('input-phone').value;
    let [firstname, ...rest] = iName.trim().split(" ");
    let secondname = rest.join(" ");
    const data = returnJSONDATA(iName, iMail, iPhone, firstname, secondname);
    try {
    let response = await fetch("https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/contacts/contactlist.json", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    let responseToJSON = await response.json();
    console.log("Kontakt hinzugefügt:", responseToJSON);
    closeForm(event);
    contacts = [];
    init();
    } catch(error) {
        console.error("Fehler beim Speichern:", error);
    }
}

function returnJSONDATA(iName, iMail, iPhone, firstname, secondname) {
    return {
        color: getRandomColor(),
        mail: iMail,
        name: {
            firstname: firstname || "",
            secondname: secondname || ""
        },
        tel: iPhone
    };
}

//--------------------------------------------------------------------------------------
function sortContacts() {
  contacts.sort((a, b) =>
    a.name.firstname.localeCompare(
      b.name.firstname,
      'de',
      { sensitivity: 'base' }
    )
  );
}

function renderContactList() {
  sortContacts();
  const listEl = document.getElementById('contact_list'); listEl.innerHTML = '';
  let currentLetter = '';
  contacts.forEach((contact, index) => {
    const firstLetter = (contact.name.firstname || '').charAt(0).toUpperCase();
    if (firstLetter !== currentLetter) {
      currentLetter = firstLetter;
      renderGroupHeader(listEl, currentLetter);
    }
    appendContact(listEl, currentLetter, contact, index);
  });
  contactClick();
}

function renderGroupHeader(listEl, letter) {
  listEl.innerHTML += `
    <div class="letter">${letter}</div>
    <div class="contact-line"></div>
    <div id="group-${letter}"></div>
  `;
}

function appendContact(listEl, letter, contact, index) {
  const groupEl = document.getElementById(`group-${letter}`);
  groupEl.innerHTML += `
    <div class="contact" onclick="showContact(${index}, '${letter}')">
      <button class="contact-picture" style="background-color: ${contact.color}">
        ${contactPictureLetters(index)}
      </button>
      <div>
        <p>${contact.name.firstname} ${contact.name.secondname || ''}</p>
        <p class="small-email">${contact.mail}</p>
      </div>
    </div>`;
}


function getRandomColor() {
  const randomIndex = Math.floor(Math.random() * COLORS.length);
  return COLORS[randomIndex];
}

function popupClickClose() {
    let popupBlack = document.getElementById('popupBackground');
    let addForm = document.getElementById('add-Form');
    let editForm = document.getElementById('edit-Form');
    if (addForm) {
        addForm.remove();
        popupBlack.classList.toggle("popup-overlay");
    }
    if (editForm) {
        editForm.remove();
        popupBlack.classList.toggle("popup-overlay");
    }
}

async function formCheck(index, event) {
    let alertName = document.getElementById('alert-name');
    let alertMail = document.getElementById('alert-mail');
    let alertPhone = document.getElementById('alert-phone');
    let iName = document.getElementById('input-name').value;
    let iMail = document.getElementById('input-mail').value;
    let iPhone = document.getElementById('input-phone').value;
    if (alertName || alertMail || alertPhone) {
        alertMail?.remove();
        alertName?.remove();
        alertPhone?.remove();
    }
    if (iPhone.length > 2 && iMail.length > 2 && iName.length > 2) {
        if (nameCheck(iName) == true &&
            mailCheck(iMail) == true &&
            phoneCheck(iPhone) == true) {
                if (document.getElementById('add-Form')) {
                    await addContact(event);
                }
                if (document.getElementById('edit-Form')) {
                    await editContact(index);
                }
        } else {
            if (!nameCheck(iName)) {
                showError(
                    'group-name', 'alert-name', 'This field is required. Example for name: Max Mustermann'
                );
            }
            if (!mailCheck(iMail)) {
                showError(
                    'group-mail', 'alert-mail', 'This field is required. Example for e-mail: John-Smith@test.com'
                );
            }
            if (!phoneCheck(iPhone)) {
                showError(
                    'group-phone', 'alert-phone', 'This field is required. Example for phone number: +4917612345678'
                );
            }
        }
    } else {
        showError(
                    'group-name', 'alert-name', 'This field is required. Example for name: Max Mustermann'
                );
        showError(
                    'group-mail', 'alert-mail', 'This field is required. Example for e-mail: John-Smith@test.com'
                );
        showError(
                    'group-phone', 'alert-phone', 'This field is required. Example for phone number: +4917612345678'
                );
    }
}

function validName(iName) {
    const trimmed = iName.trim();
    const pattern = /^[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)?\s+[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)?$/ 
    return pattern.test(trimmed);
}

function nameCheck(iName) {
    if (!validName(iName)) {
        return false;
    } else {
        return true;
    }
}

function validMail(iMail) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(iMail.trim());
}

function mailCheck(iMail) {
    if (!validMail(iMail)) {
        return false
    } else {
        return true;
    }
}

function validPhone(iPhone) {
    const pattern = /^\+?[0-9][0-9\s\-().]{6,18}$/;
    return pattern.test(iPhone.trim())
}

function phoneCheck(iPhone) {
    if (!validPhone(iPhone)) {
        return false;
    } else {
        return true;
    }
}

function showError(groupId, alertId, message) {
    let group = document.getElementById(groupId)
    let oldAlert = document.getElementById(alertId);
    if (oldAlert) {
        oldAlert.remove();
    }
    let alert = document.createElement('p');
    alert.innerText = message;
    alert.setAttribute("id", alertId);
    group.appendChild(alert);
}

function editContactEvent(index) {
    //event.stopPropagation();
    let form = document.getElementById('main');
    let popupBlack = document.getElementById('popupBackground');
    popupBlack.classList.toggle("popup-overlay")
    form.innerHTML += editContactTemplate(index);
    let inputName = document.getElementById('input-name');
    let inputMail = document.getElementById('input-mail');
    let inputPhone = document.getElementById('input-phone');
    inputName.value = contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"];
    inputMail.value = contacts[index]["mail"];
    inputPhone.value = contacts[index]["tel"];
    hoverCancel();
}

async function editContact(index) {
    let iName = document.getElementById('input-name').value;
    let iMail = document.getElementById('input-mail').value;
    let iPhone = document.getElementById('input-phone').value;
    let url = `https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/contacts/contactlist/${contacts[index].id}.json`;
    let [firstname, ...rest] = iName.trim().split(" ");
    let secondname = rest.join(" ");
    try {
        let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
        color: contacts[index].color,
        mail: iMail,
        name: {
            firstname: firstname || "",
            secondname: secondname || ""
        },
        tel: iPhone
    })
    });
    console.log("Kontakt bearbeitet:", response);
    closeForm();
    contacts = [];
    init();
} catch (err) {
    console.error('Failed to edit contact:', err);
    alert('Could not save contact. See console for details.');
}
}

async function deleteContact(index) {
    
}