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
    renderContactList();
    bodyClickClose();
    contactClick();
    getInitialsFromUser()
}

function contactPictureLetters(index) {
    const { firstname, secondname } = contacts[index].name;
        return firstname[0].toUpperCase() + secondname[0].toUpperCase();
}

function showContact(index) {
    removeExistingContent(index);
    document.getElementById('contact_content').innerHTML = showContactTemplate(index);
    showContentXOverflowHidden(index);
    toggleMobileView('.contact-informations', 'block', '.contact-list', 'none');
}

function updateContactContentAfterEdit(index) {
    const content = document.getElementById('contact_content');
    const existingContent = document.getElementById('showContent' + index);
    if (existingContent) {
        content.innerHTML = showContactTemplate(index);
    }
}

function removeExistingContent(index) {
    document.getElementById('showContent' + index)?.remove();
}

function mobileBack(index) {
    removeExistingContent(index);
    toggleMobileView('.contact-informations', 'none', '.contact-list', 'flex');
}

function toggleMobileView(selector1, display1, selector2, display2) {
    if (window.innerWidth <= 980) {
        document.querySelector(selector1).style.display = display1;
        document.querySelector(selector2).style.display = display2;
    }
}

function showNoContact() {
    document.getElementById('contact_content').innerHTML = "";
}

function contactToast(contactText) {
    document.getElementById('contact_content').innerHTML += getFeedbackContact(contactText);
    alertxOverflowHidden();
}

function createContactData(color, mail, firstname, secondname, tel) {
    return { color, mail, name: { firstname: firstname || "", secondname: secondname || "" }, tel };
}

function returnJSONDATANEW(iMail, iPhone, firstname, secondname) {
    return createContactData(getRandomColor(), iMail, firstname, secondname, iPhone);
}

function returnJSONDATA(contactColor, iMail, iPhone, firstname, secondname) {
    return createContactData(contactColor, iMail, firstname, secondname, iPhone);
}

function sortContacts() {
    contacts.sort((a, b) => a.name.firstname.localeCompare(b.name.firstname, 'de', { sensitivity: 'base' }));
}

function renderContactList() {
    sortContacts();
    const listEl = document.getElementById('contact_list');
    listEl.innerHTML = '';
    let currentLetter = '';
    contacts.forEach((contact, index) => {
        const firstLetter = (contact.name.firstname || '').charAt(0).toUpperCase();
        if (firstLetter !== currentLetter) {
            currentLetter = firstLetter;
            renderGroupHeader(listEl, currentLetter);
        }
        appendContact(currentLetter, contact, index);
    });
    contactClick();
}

function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
}

function popupClickClose() {
    const popupBlack = document.getElementById('popupBackground');
    const forms = ['add-Form', 'edit-Form'];
    forms.forEach(formId => {
        const form = document.getElementById(formId);
        if (form) {
            form.remove();
            popupBlack.classList.toggle("popup-overlay");
        }
    });
}

async function formCheck(index, event) {
    clearAlerts();
    const { name, mail, phone } = getFormValues();
    const { nameValid, mailValid, phoneValid } = getValidity({ name, mail, phone });
    if (!nameValid) showError('errorName', 'alert-name', 'Example for name: Max Mustermann', 'group-name');
    if (!mailValid) showError('errorMail', 'alert-mail', 'Example for e-mail: John-Smith@test.com', 'group-mail');
    if (!phoneValid) showError('errorPhone', 'alert-phone', 'Example for phone number: +4917612345678', 'group-phone');
    if (!nameValid || !mailValid || !phoneValid) return;
    document.getElementById('add-Form') ? await addContact(event) : await editContact(index);
}

function clearAlerts() {
    ['alert-name', 'alert-mail', 'alert-phone'].forEach(id => document.getElementById(id)?.remove());
}

function getFormValues() {
    const name = document.getElementById('input-name').value;
    const mail = document.getElementById('input-mail').value;
    const phone = document.getElementById('input-phone').value;
        return { name, mail, phone };
}

function getValidity({ name, mail, phone }) {
    const nameValid = name.length > 2 && nameCheck(name);
    const mailValid = mail.length > 2 && mailCheck(mail);
    const phoneValid = phone.length > 2 && phoneCheck(phone);
        return { nameValid, mailValid, phoneValid };
}

function validName(iName) {
    return /^[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)?\s+[A-Za-zÄÖÜäöüß]+(?:-[A-Za-zÄÖÜäöüß]+)?$/.test(iName.trim());
}

function nameCheck(iName) {
    return validateField(iName, validName, "group-name");
}

function validMail(iMail) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(iMail.trim());
}

function mailCheck(iMail) {
    return validateField(iMail, validMail, "group-mail");
}

function validPhone(iPhone) {
    return /^\+?[0-9][0-9\s\-().]{6,18}$/.test(iPhone.trim());
}

function phoneCheck(iPhone) {
    return validateField(iPhone, validPhone, "group-phone");
}

function validateField(value, validator, borderId) {
    const errorBorder = document.getElementById(borderId);
    const isValid = validator(value);
    errorBorder.classList.toggle('inputWrapper', isValid);
    return isValid;
}

function showError(groupId, alertId, message, borderElementId) {
    const errorBorder = document.getElementById(borderElementId);
    const group = document.getElementById(groupId);
    const oldAlert = document.getElementById(alertId);
    errorBorder.classList.remove('inputWrapper');
    errorBorder.classList.add('errorBorder');
    if (oldAlert) {
        errorBorder.classList.add('inputWrapper:focus-within');
        oldAlert.remove();
    }
    group.innerHTML = "";
    const alert = document.createElement('p');
    alert.innerText = message;
    alert.id = alertId;
    group.appendChild(alert);
    group.style.marginBottom = "0";
}

function editContactEvent(index) {
    togglePopupOverlay();
    document.getElementById('main').innerHTML += editContactTemplate(index);
    editXOverflowHidden();
    populateEditForm(index);
    setupSaveButtonState(index);
    updateContactDisplay(index);
}

function updateContactDisplay(index) {
    const existingContent = document.getElementById('showContent' + index);
    if (existingContent) {
        document.getElementById('contact_content').innerHTML = showContactTemplate(index);
    }
}

function togglePopupOverlay() {
    document.getElementById('popupBackground').classList.toggle("popup-overlay");
}

function populateEditForm(index) {
    const { firstname, secondname } = contacts[index].name;
    document.getElementById('input-name').value = `${firstname} ${secondname}`;
    document.getElementById('input-mail').value = contacts[index].mail;
    const phoneValue = contacts[index].tel === "<i> Please update your phone number <i>" ? "" : contacts[index].tel;
    document.getElementById('input-phone').value = phoneValue;
}

function setupSaveButtonState(index) {
    const inputs = ['input-name', 'input-mail', 'input-phone'].map(id => document.getElementById(id));
    const saveButton = document.getElementById('create-contact');
    setSaveButtonDisabled(saveButton, true);
    inputs.forEach(input => input.addEventListener('input', () => checkChanges(index, inputs, saveButton)));
}

function checkChanges(index, inputs, saveButton) {
    const [inputName, inputMail, inputPhone] = inputs;
    const { firstname, secondname } = contacts[index].name;
    const hasChanges = inputName.value !== `${firstname} ${secondname}` ||
                       inputMail.value !== contacts[index].mail ||
                       inputPhone.value !== contacts[index].tel;
    setSaveButtonDisabled(saveButton, !hasChanges);
}

function setSaveButtonDisabled(button, disabled) {
    button.disabled = disabled;
    button.style.opacity = disabled ? '0.5' : '1';
    button.style.cursor = disabled ? 'not-allowed' : 'pointer';
}

function getContactIndexByFullName(fullName) {
    return contacts.findIndex(contact => {
        const full = `${contact.name.firstname} ${contact.name.secondname}`.trim().toLowerCase();
        return full === fullName.trim().toLowerCase();
    });
}

function clearContacts() {
    const contactContent = document.getElementById('contact_content');
    contactContent.innerHTML = "";
    contacts.forEach(contact => {
        const id = document.getElementById(contact.id);
        if (id) {
            id.style.backgroundColor = "";
            id.style.color = "";
        }
    });
}

function validateInputContact(displayId, currentId, inputFrame) {
    const input = document.getElementById(currentId);
    const output = document.getElementById(displayId);
    const borderError = document.getElementById(inputFrame);
    const isEmpty = input.value.trim() === "";
    output.innerHTML = isEmpty ? "This field is required." : "";
    borderError.classList.toggle('errorBorder', isEmpty);
}


function replaceOnClickContacts() {
    contacts.forEach((c, index) => {
        let contact = document.getElementById(c.id)
        contact.onclick = () => mobileContactClick(index)
    });
}


function goBackToContactList() {
    document.getElementById('contactlist').style = "";
    document.querySelector('.contact-informations').style.display = "none";
    document.getElementById('goback-arrow').remove();
    document.querySelector('.contact-informations').innerHTML = "";
    document.getElementById('upperContainer').onclick = null;
}

function toggleMenu(event) {
    event?.stopPropagation();
    const menuPopup = document.getElementById('mobilePopupMenu');
    menuPopup.classList.remove('d_none', 'slide-out');
    menuPopup.classList.add('dpf', 'slide-in-mobile-right');

    setTimeout(() => {
        document.addEventListener('click', closeMenuOnClickOutside, { once: true });
    }, 0);
}

function closeMenuOnClickOutside(event) {
    const menuPopup = document.getElementById('mobilePopupMenu');
    if (menuPopup && !menuPopup.contains(event.target)) {
        menuPopup.classList.remove('slide-in-mobile-right');
        document.body.style.overflowX = "hidden";
        menuPopup.classList.add('slide-out');
        menuPopup.addEventListener('animationend', function handler() {
            menuPopup.classList.add('d_none');
            menuPopup.classList.remove('dpf');
            document.body.style.overflowX = "";
            menuPopup.removeEventListener('animationend', handler);
        });
    }
}

function addYOverflowHidden() {
    const form = document.getElementById('add-Form');
    document.documentElement.classList.add('disable-y-scroll');
    document.body.classList.add('disable-y-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-up");
    form.addEventListener('animationend', () => {
        document.documentElement.classList.remove('disable-y-scroll');
        document.body.classList.remove('disable-y-scroll');
        form.classList.remove('slide-up');
    });
}