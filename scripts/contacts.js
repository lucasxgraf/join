

let contacts = [];

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
renderContactList();
bodyClickClose();
contactClick();
// windowMobile()
getInitialsFromUser()
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
    return name.firstname[0].toUpperCase() + name.secondname[0].toUpperCase();
}

function showContact(index, letter) {
    if (document.getElementById('showContent' + index)) {
        return
    }
    let content = document.getElementById('contact_content');
    content.innerHTML = showContactTemplate(index);
    showContentXOverflowHidden(index)

}

// function showContactAfterEdit(index) {
//     // if (window.matchMedia("(max-width: 950px)").matches) {showContactAfterEditMobile(index); return; }
//     let content = document.getElementById('contact_content');
//     content.innerHTML = showContactAfterEditTemplate(index);
//     let contactCard = document.getElementById(contacts[index].id);
//     contactCard.style.backgroundColor = "#2A3647";
//     contactCard.style.color = "white";

// }

function showNoContact() {
    let content = document.getElementById('contact_content')
    content.innerHTML = "";
}


function contactToast(contactText) {
    let content = document.getElementById('contact_content');
    
    content.innerHTML += getFeedbackContact(contactText);
    alertxOverflowHidden()
}

function returnJSONDATANEW(iName, iMail, iPhone, firstname, secondname) {
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

function returnJSONDATA(contactColor, iName, iMail, iPhone, firstname, secondname) {
    return {
        color: contactColor,
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
    <div class="contact" id="${contacts[index].id}" onclick="showContact(${index}, '${letter}')">
      <button class="contact-picture" style="background-color: ${contact.color}">
        ${contactPictureLetters(index)}
      </button>
      <div style="margin-right: 24px;">
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
    // if (!window.matchMedia("(max-width: 950px)").matches) {contactClick()};
    // windowMobile();
}

async function formCheck(index, event) {
  clearAlerts();
  const { name, mail, phone } = getFormValues();
  const { nameValid, mailValid, phoneValid } = getValidity({ name, mail, phone });
  if (!nameValid)  showError('errorName','alert-name','Example for name: Max Mustermann','group-name');
  if (!mailValid)  showError('errorMail','alert-mail','Example for e-mail: John-Smith@test.com','group-mail');
  if (!phoneValid) showError('errorPhone','alert-phone','Example for phone number: +4917612345678','group-phone');
  if (!nameValid || !mailValid || !phoneValid) return;
  if (document.getElementById('add-Form'))  await addContact(event);
  if (document.getElementById('edit-Form')) await editContact(index);
}

function clearAlerts() {
  document.getElementById('alert-name')?.remove();
  document.getElementById('alert-mail')?.remove();
  document.getElementById('alert-phone')?.remove();
}

function getFormValues() {
  const name  = document.getElementById('input-name').value;
  const mail  = document.getElementById('input-mail').value;
  const phone = document.getElementById('input-phone').value;
  return { name, mail, phone };
}

function getValidity({ name, mail, phone }) {
  const nameValid  = name.length  > 2 && nameCheck(name);
  const mailValid  = mail.length  > 2 && mailCheck(mail);
  const phoneValid = phone.length > 2 && phoneCheck(phone);
  return { nameValid, mailValid, phoneValid };
}

function validName(iName) {
    const trimmed = iName.trim();
    const pattern = /^[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)?\s+[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)?$/ 
    return pattern.test(trimmed);
}

function nameCheck(iName) {
    let errorBorder = document.getElementById("group-name")
    if (!validName(iName)) {
        return false;
    } else {
        errorBorder.classList.add('inputWrapper')
        return true;
    }
}

function validMail(iMail) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(iMail.trim());
}

function mailCheck(iMail) {
    let errorBorder = document.getElementById("group-mail")
    if (!validMail(iMail)) {
        return false
    } else {
        errorBorder.classList.add('inputWrapper')
        return true;
    }
}

function validPhone(iPhone) {
    const pattern = /^\+?[0-9][0-9\s\-().]{6,18}$/;
    return pattern.test(iPhone.trim())
}

function phoneCheck(iPhone) {
    let errorBorder = document.getElementById("group-phone")
    if (!validPhone(iPhone)) {
        return false;
    } else {
        errorBorder.classList.add('inputWrapper')
        return true;
    }
}

function showError(groupId, alertId, message, erroroborderId) {
    let errorBorder = document.getElementById(erroroborderId)
    let group = document.getElementById(groupId)
    let oldAlert = document.getElementById(alertId);
    errorBorder.classList.remove('inputWrapper')
    errorBorder.classList.add('errorBorder');
    if (oldAlert) {
        errorBorder.classList.add('inputWrapper:focus-within')
        oldAlert.remove();
    }
    group.innerHTML = ""
    let alert = document.createElement('p');
    alert.innerText = message;
    alert.setAttribute("id", alertId);
    group.appendChild(alert);
    group.style = "margin-bottom: 0;"
}

function editContactEvent(index) {
    // if (window.matchMedia("(max-width: 930px)").matches) {editContactEventMobile(index); return;} 
    let form = document.getElementById('main');
    let popupBlack = document.getElementById('popupBackground');
    popupBlack.classList.toggle("popup-overlay")
    form.innerHTML += editContactTemplate(index);
    editXOverflowHidden();
    let inputName = document.getElementById('input-name');
    let inputMail = document.getElementById('input-mail');
    let inputPhone = document.getElementById('input-phone');
    inputName.value = contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"];
    inputMail.value = contacts[index]["mail"];
    inputPhone.value = contacts[index]["tel"];
}

function getContactIndexByFullName(fullName) {
    return contacts.findIndex(contact => {
        let full = `${contact.name.firstname} ${contact.name.secondname}`
            .trim()
            .toLowerCase();

        return full === fullName.trim().toLowerCase();
    });
}

function clearContacts() {
    let contactContent = document.getElementById('contact_content');
    contactContent.innerHTML = "";
    contacts.forEach(contact => {
                let id = document.getElementById(contact.id);
                if (id) {
                    id.style.backgroundColor = "";
                    id.style.color = "";
                }
            });
}


function validateInputContact(displayid, currentId, inputFrame) {
  const input = document.getElementById(currentId);
  const output = document.getElementById(displayid)
  const borderError = document.getElementById(inputFrame)

  if (input.value.trim() === "") {
    output.innerHTML = "This field is required."
    borderError.classList.add('errorBorder');
  }
  else{
    output.innerHTML = ""
    borderError.classList.remove('errorBorder');
  }
}