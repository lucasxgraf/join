/**
 * @fileoverview Contact event handlers and UI interactions
 * @description Manages contact selection, form animations, popup overlays, and mobile menu interactions
 */

window.addEventListener("DOMContentLoaded", contactClick);

/**
 * Adds click event listeners to all contact elements for selection highlighting
 */
function contactClick() {
    if (window.innerWidth <= 980) {return};
    let contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => {
        contact.addEventListener('click', function () {
            contacts.forEach(c => c.classList.remove('contact-selected'));
            if (window.innerWidth >= 980){this.classList.add('contact-selected')};
        });
    });
}

/**
 * Adds horizontal overflow hidden and triggers slide-in animation for add form
 */
function addXOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('add-Form');
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-in-dialog");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-x-scroll');
    document.body.classList.remove('disable-x-scroll');
    form.classList.remove('slide-in-dialog');}
);
}

/**
 * Adds horizontal overflow hidden and triggers slide-in animation for edit form
 */
function editXOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('edit-Form');
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-in-dialog");
    form.addEventListener('animationend', () => {
        document.documentElement.classList.remove('disable-x-scroll');
        document.body.classList.remove('disable-x-scroll');
        form.classList.remove('slide-in-dialog');
    }, { once: true });
}

/**
 * Adds horizontal overflow hidden and triggers slide-in animation for contact content display
 * @param {number} index - The index of the contact being displayed
 */
function showContentXOverflowHidden(index) {
    let info = document.getElementById('showContent'+ index)
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    info.classList.add("slide-in");
    info.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-x-scroll');
    document.body.classList.remove('disable-x-scroll');
    info.classList.remove('slide-in');}
    );
}

/**
 * Adds horizontal overflow hidden and triggers slide-up animation for alert notification
 */
function alertxOverflowHidden() {
    const alertEl = document.getElementById('create-contact-alert');
  document.documentElement.classList.add('disable-x-scroll');
  document.body.classList.add('disable-x-scroll');
  document.getElementById('contactlist').classList.add('disable-x-scroll');
  alertEl.classList.remove('slide-up-hold-down'); void alertEl.offsetWidth;
  alertEl.classList.add('slide-up-hold-down');
  setTimeout(() => {
    document.documentElement.classList.remove('disable-x-scroll');
    document.body.classList.remove('disable-x-scroll');
    document.getElementById('contactlist').classList.remove('disable-x-scroll');
    alertEl.remove();
  }, 2500);
}

/**
 * Adds click event listener to body to close contact details when clicking outside
 */
function bodyClickClose() {
    let content = document.getElementById('contact-side');
    let popupBlack = document.getElementById('popupBackground');
    let contactContent = document.getElementById('contact_content');
    function handler(event) {
        if (window.matchMedia("(max-width: 980px)").matches) return;
        if (popupBlack.classList.contains('popup-overlay') || event.target.closest('.contact')) return;
        if (!content.contains(event.target)) {
            clearContacts();
            document.removeEventListener('click', handler);
        }
    }
    document.addEventListener('click', handler);
}
window.bodyClickClose = bodyClickClose;

/**
 * Opens the add contact form popup
 * @param {Event} event - The click event
 */
function addContactEvent(event) {
    event?.preventDefault();
    event?.stopPropagation();
    let index = undefined;
    let form = document.getElementById('main');
    let popupBlack = document.getElementById('popupBackground');
    popupBlack.classList.toggle("popup-overlay")
    form.innerHTML += addFormTemplate(index);
    addXOverflowHidden();
}

/**
 * Closes the add or edit contact form
 * @param {Event} event - The click event
 */
function closeForm(event) {
    event?.stopPropagation();
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
    contactClick();
    bodyClickClose();
}

/**
 * Closes the mobile menu when clicking outside
 * @param {Event} event - The click event
 */
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

/**
 * Adds overflow hidden and triggers slide-up animation for add form
 */
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

/**
 * Toggles the mobile menu visibility
 * @param {Event} event - The click event
 */
function toggleMenu(event) {
    event?.stopPropagation();
    const menuPopup = document.getElementById('mobilePopupMenu');
    menuPopup.classList.remove('d_none', 'slide-out');
    menuPopup.classList.add('dpf', 'slide-in-mobile-right');

    setTimeout(() => {
        document.addEventListener('click', closeMenuOnClickOutside, { once: true });
    }, 0);
}

/**
 * Sets up the save button state and change detection
 * @param {number} index - The index of the contact being edited
 */
function setupSaveButtonState(index) {
    const inputs = ['input-name', 'input-mail', 'input-phone'].map(id => document.getElementById(id));
    const saveButton = document.getElementById('create-contact');
    setSaveButtonDisabled(saveButton, true);
    inputs.forEach(input => input.addEventListener('input', () => checkChanges(index, inputs, saveButton)));
}

/**
 * Validates form inputs and submits contact data
 * @param {number} index - The index of the contact being edited (if applicable)
 * @param {Event} event - The form submission event
 */
async function formCheck(index, event) {
    clearAlerts();
    const { name, mail, phone } = getFormValues();
    const { nameValid, mailValid, phoneValid } = getValidity({ name, mail, phone });
    if (!nameValid) showErrorContact('errorName', 'alert-name', 'Example: Max Mustermann', 'group-name');
    if (!mailValid) showErrorContact('errorMail', 'alert-mail', 'Example: John-Smith@test.com', 'group-mail');
    if (!phoneValid) showErrorContact('errorPhone', 'alert-phone', 'Example: +4917612345678', 'group-phone');
    if (!nameValid || !mailValid || !phoneValid) return;
    document.getElementById('add-Form') ? await addContact(event) : await editContact(index);
}

/**
 * Validates a contact input field and displays error if empty
 * @param {string} displayId - The ID of the error display element
 * @param {string} currentId - The ID of the input element
 * @param {string} inputFrame - The ID of the input wrapper element
 */
function validateInputContact(displayId, currentId, inputFrame) {
    const input = document.getElementById(currentId);
    const output = document.getElementById(displayId);
    const borderError = document.getElementById(inputFrame);
    const isEmpty = input.value.trim() === "";
    output.innerHTML = isEmpty ? "This field is required." : "";
    borderError.classList.toggle('errorBorder', isEmpty);
}

/**
 * Displays an error message for a form field
 * @param {string} groupId - The ID of the error message container
 * @param {string} alertId - The ID for the alert element
 * @param {string} message - The error message to display
 * @param {string} borderElementId - The ID of the element to add error border
 */
function showErrorContact(groupId, alertId, message, borderElementId) {
    const errorBorder = document.getElementById(borderElementId);
    const group = document.getElementById(groupId);
    errorBorder.classList.remove('inputWrapper');
    errorBorder.classList.add('errorBorder');

    group.innerHTML = "";
    const alert = document.createElement('p');
    alert.innerText = message;
    alert.id = alertId;
    group.appendChild(alert);
    group.style.marginBottom = "0";
}

/**
 * Replaces onclick handlers for mobile contact clicks
 */
function replaceOnClickContacts() {
    contacts.forEach((c, index) => {
        let contact = document.getElementById(c.id)
        contact.onclick = () => mobileContactClick(index)
    });
}

/**
 * Timeout function to disable add contact buttons temporarily
 */
function buttonTimeOut() {
  const addButtons = document.querySelectorAll('.add-contact, .mobile-add-contact');
  addButtons.forEach(btn => btn.disabled = true);
  
  setTimeout(() => {
    addButtons.forEach(btn => btn.disabled = false);
  }, 2500); 
}

/**
 * Refreshes contacts after adding a new one
 */
async function refreshContacts() {
  contacts = [];
}

/**
 * Refreshes contacts after editing
 */
async function refreshContacts() {
  contacts = [];
  await init();
}