/**
 * @fileoverview Contact management functionality
 * @description Handles contact creation, editing, deletion, validation, and display
 */

let contacts = [];

const COLORS = [
    "#FF7A00", "#FF5EB3", "#6E52FF",
    "#9327FF", "#00BEE8", "#1FD7C1",
    "#FF745E", "#FFA35E", "#FC71FF",
    "#FFC701", "#0038FF", "#C3FF2B",
    "#FFE62B", "#FF4646", "#FFBB2B",
];

/**
 * Initializes the contacts page by loading contacts and setting up event listeners
 */
async function init() {
    await fetchContacts();
    renderContactList();
    bodyClickClose();
    contactClick();
    getInitialsFromUser()
}

/**
 * Gets the initials from a contact's first and last name
 * @param {number} index - The index of the contact in the contacts array
 */
function contactPictureLetters(index) {
    const { firstname, secondname } = contacts[index].name;
        return firstname[0]?.toUpperCase() + secondname[0]?.toUpperCase();
}

/**
 * Displays a contact's details in the content area
 * @param {number} index - The index of the contact to display
 */
function showContact(index, event) {
    const topEl = document.elementFromPoint(event.clientX, event.clientY);
    if (topEl && topEl.closest(".mobile-add-contact")) {addContactEvent(); return}
    event.preventDefault();
    if (document.getElementById('showContent' + index) && window.innerWidth >= 981) {return} else {removeExistingContent(index)}
    document.getElementById('contact_content').innerHTML = showContactTemplate(index);
    showContentXOverflowHidden(index);
    toggleMobileView('.contact-informations', 'block', '.contact-list', 'none');
    bodyClickClose();
}

/**
 * Updates the contact content display after editing
 * @param {number} index - The index of the contact to update
 */
function updateContactContentAfterEdit(index) {
    const content = document.getElementById('contact_content');
    const existingContent = document.getElementById('showContent' + index);
    if (existingContent) {
        content.innerHTML = showContactTemplate(index);
    }
}

/**
 * Removes existing contact content from the display
 * @param {number} index - The index of the contact content to remove
 */
function removeExistingContent(index) {
    document.getElementById('showContent' + index)?.remove();
}

/**
 * Handles mobile back navigation from contact details to list
 * @param {number} index - The index of the contact
 */
function mobileBack(index) {
    removeExistingContent(index);
    toggleMobileView('.contact-informations', 'none', '.contact-list', 'flex');
}

/**
 * Toggles display of elements for mobile view
 * @param {string} selector1 - CSS selector for first element
 * @param {string} display1 - Display value for first element
 * @param {string} selector2 - CSS selector for second element
 * @param {string} display2 - Display value for second element
 */
function toggleMobileView(selector1, display1, selector2, display2) {
    if (window.innerWidth <= 980) {
        document.querySelector(selector1).style.display = display1;
        document.querySelector(selector2).style.display = display2;
    }
}

/**
 * Clears the contact content display area
 */
function showNoContact() {
    document.getElementById('contact_content').innerHTML = "";
}

/**
 * Displays a toast notification for contact actions
 * @param {string} contactText - The text to display in the toast
 */
function contactToast(contactText) {
    if (window.innerWidth <= 980) {
        document.body.innerHTML += getFeedbackContact(contactText);
    } else {
        document.getElementById('contact_content').innerHTML += getFeedbackContact(contactText);
    }
    alertxOverflowHidden();
}

/**
 * Creates a contact data object
 * @param {string} color - The color assigned to the contact
 * @param {string} mail - The email address
 * @param {string} firstname - The first name
 * @param {string} secondname - The last name
 * @param {string} tel - The phone number
 */
function createContactData(color, mail, firstname, secondname, tel) {
    return { color, mail, name: { firstname: firstname || "", secondname: secondname || "" }, tel };
}

/**
 * Creates contact data for a new contact with random color
 * @param {string} iMail - The email address
 * @param {string} iPhone - The phone number
 * @param {string} firstname - The first name
 * @param {string} secondname - The last name
 */
function returnJSONDATANEW(iMail, iPhone, firstname, secondname) {
    return createContactData(getRandomColor(), iMail, firstname, secondname, iPhone);
}

/**
 * Creates contact data with specified color
 * @param {string} contactColor - The color for the contact
 * @param {string} iMail - The email address
 * @param {string} iPhone - The phone number
 * @param {string} firstname - The first name
 * @param {string} secondname - The last name
 */
function returnJSONDATA(contactColor, iMail, iPhone, firstname, secondname) {
    return createContactData(contactColor, iMail, firstname, secondname, iPhone);
}

/**
 * Sorts contacts alphabetically by first name
 */
function sortContacts() {
    contacts.sort((a, b) => a.name.firstname.localeCompare(b.name.firstname, 'de', { sensitivity: 'base' }));
}

/**
 * Renders the complete contact list with alphabetical grouping
 */
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

/**
 * Gets a random color from the COLORS array
 */
function getRandomColor() {
    const randomIndex = Math.floor(Math.random() * COLORS.length);
    return COLORS[randomIndex];
}

/**
 * Closes popup forms by removing them from the DOM
 */
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

/**
 * Clears all alert messages from the form
 */
function clearAlerts() {
    ['alert-name', 'alert-mail', 'alert-phone'].forEach(id => document.getElementById(id)?.remove());
}

/**
 * Gets the current values from the contact form inputs
 */
function getFormValues() {
    const name = document.getElementById('input-name').value;
    let mail = document.getElementById('input-mail').value;
    const phone = document.getElementById('input-phone').value;
        return { name, mail, phone };
}

/**
 * Validates all form field values
 * @param {Object} params - Object containing name, mail, and phone values
 * @param {string} params.name - The name to validate
 * @param {string} params.mail - The email to validate
 * @param {string} params.phone - The phone number to validate
 */
function getValidity({ name, mail, phone }) {
    const nameValid = name.length > 2 && nameCheck(name);
    const mailValid = mail.length > 2 && mailCheck(mail);
    const phoneValid = phone.length > 2 && phoneCheck(phone);
        return { nameValid, mailValid, phoneValid };
}

/**
 * Validates name format using regex
 * @param {string} iName - The name to validate
 * @returns {boolean} True if name is valid, false otherwise
 */
function validName(iName) {
    return /^(?!.*\b(?:Dr|Prof|Professor|Dipl|Ing|Mag|BSc|MSc|PhD)\.?\b)[A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+(?:[- ][A-ZÀ-ÖØ-Ý][a-zà-öø-ÿ]+)*$/.test(iName.trim());
}

/**
 * Checks if name is valid and updates UI
 * @param {string} iName - The name to check
 * @returns {boolean} True if name is valid, false otherwise
 */
function nameCheck(iName) {
    return validateField(iName, validName, "group-name");
}

/**
 * Validates email format using regex
 * @param {string} iMail - The email to validate
 * @returns {boolean} True if email is valid, false otherwise
 */
function validMail(iMail) {
    return /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9.!#$%&'*+/=?^_`{|}~-]+@(?:[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?\.)+[A-Za-z]{2,63}$/.test(iMail.trim());
}

/**
 * Checks if email is valid and updates UI
 * @param {string} iMail - The email to check
 * @returns {boolean} True if email is valid, false otherwise
 */
function mailCheck(iMail) {
    return validateField(iMail, validMail, "group-mail");
}

/**
 * Validates phone number format using regex
 * @param {string} iPhone - The phone number to validate
 * @returns {boolean} True if phone is valid, false otherwise
 */
function validPhone(iPhone) {
    return /^\+?[0-9][0-9\s\-().]{6,18}$/.test(iPhone.trim());
}

/**
 * Checks if phone number is valid and updates UI
 * @param {string} iPhone - The phone number to check
 * @returns {boolean} True if phone is valid, false otherwise
 */
function phoneCheck(iPhone) {
    return validateField(iPhone, validPhone, "group-phone");
}

/**
 * Validates a field using a validator function and updates border styling
 * @param {string} value - The value to validate
 * @param {Function} validator - The validation function
 * @param {string} borderId - The ID of the border element
 * @returns {boolean} True if field is valid, false otherwise
 */
function validateField(value, validator, borderId) {
    const errorBorder = document.getElementById(borderId);
    const isValid = validator(value);
    errorBorder.classList.toggle('inputWrapper', isValid);
    return isValid;
}

/**
 * Opens the edit contact form and populates it with contact data
 * @param {number} index - The index of the contact to edit
 */
function editContactEvent(index) {
    togglePopupOverlay();
    document.getElementById('main').innerHTML += editContactTemplate(index);
    editXOverflowHidden();
    populateEditForm(index);
    setupSaveButtonState(index);
    updateContactDisplay(index);
}

/**
 * Updates the contact display after editing
 * @param {number} index - The index of the contact to update
 */
function updateContactDisplay(index) {
    const existingContent = document.getElementById('showContent' + index);
    if (existingContent) 
        document.getElementById('contact_content').innerHTML = showContactTemplate(index);  
}

/**
 * Toggles the popup overlay visibility
 */
function togglePopupOverlay() {
    document.getElementById('popupBackground').classList.toggle("popup-overlay");
}

/**
 * Populates the edit form with existing contact data
 * @param {number} index - The index of the contact to edit
 */
function populateEditForm(index) {
    const { firstname, secondname } = contacts[index].name;
    document.getElementById('input-name').value = `${firstname} ${secondname}`;
    document.getElementById('input-mail').value = contacts[index].mail;
    const phoneValue = contacts[index].tel === "<i> Please update your phone number <i>" ? "" : contacts[index].tel;
    document.getElementById('input-phone').value = phoneValue;
}

/**
 * Checks if form values have changed from original contact data
 * @param {number} index - The index of the contact
 * @param {Array<HTMLInputElement>} inputs - Array of input elements
 * @param {HTMLButtonElement} saveButton - The save button element
 */
function checkChanges(index, inputs, saveButton) {
    const [inputName, inputMail, inputPhone] = inputs;
    const { firstname, secondname } = contacts[index].name;
    const hasChanges = inputName.value !== `${firstname} ${secondname}` ||
                       inputMail.value !== contacts[index].mail ||
                       inputPhone.value !== contacts[index].tel;
    setSaveButtonDisabled(saveButton, !hasChanges);
}

/**
 * Sets the disabled state of the save button
 * @param {HTMLButtonElement} button - The button element
 * @param {boolean} disabled - Whether the button should be disabled
 */
function setSaveButtonDisabled(button, disabled) {
    button.disabled = disabled;

}

/**
 * Finds a contact index by full name
 * @param {string} fullName - The full name to search for
 * @returns {number} The index of the contact, or -1 if not found
 */
function getContactIndexByFullName(fullName) {
    return contacts.findIndex(contact => {
        const full = `${contact.name.firstname} ${contact.name.secondname}`.trim().toLowerCase();
        return full === fullName.trim().toLowerCase();
    });
}

/**
 * Clears all contact selections and resets styling
 */
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

/**
 * Handles navigation back to contact list from detail view
 */
function goBackToContactList() {
    document.getElementById('contactlist').style = "";
    document.querySelector('.contact-informations').style.display = "none";
    document.getElementById('goback-arrow').remove();
    document.querySelector('.contact-informations').innerHTML = "";
    document.getElementById('upperContainer').onclick = null;
}