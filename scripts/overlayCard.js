/**
 * @fileoverview Overlay card functionality for viewing and managing task details
 * @description Handles overlay display, contact assignment, subtask management, and card deletion
 */

const URGENT  = '../assets/svg/priority_symblos/urgent.svg';
const MEDIUM  = '../assets/svg/priority_symblos/medium.svg';
const LOW  = '../assets/svg/priority_symblos/low.svg';
let SingleCARD = []

/**
 * Opens the overlay to display card details
 * @param {string} cardId - The ID of the card to display
 */
function openOverlay(cardId) {
  SingleCARD = []
  const OVERLAY = document.getElementById('overlay');
  const OVERLAY_CARD = document.getElementById('overlay_card');

  if (isSwapOpen) return;
  const CARD = cardFromFirebase.find(c => c.id === cardId);
  if (!OVERLAY || !OVERLAY_CARD || !CARD) 
    return;
  renderOverlayCard(CARD, OVERLAY_CARD);
  showOverlayAssignToContacts(CARD);
  showOverlaySubtasks(CARD);
  OVERLAY.classList.remove('d_none');
  document.body.style.overflow = 'hidden';
}

/**
 * Toggles the overlay visibility and manages body scroll
 */
function toggleOverlay() {
  const OVERLAY = document.getElementById('overlay');
  if (!OVERLAY) 
    return;
  const hidden = OVERLAY.classList.toggle('d_none');
  document.body.style.overflow = hidden ? '' : 'hidden';
}

/**
 * Prevents overlay from closing when clicking inside
 * @param {Event} e - The click event
 */
function stopOverlayClose(e) {
  e.stopPropagation();
}

/**
 * Displays assigned contacts in the overlay
 * @param {Object} CARD - The card object containing contact information
 */
function showOverlayAssignToContacts(CARD) {
  const OVERLAY_CONTACT = document.getElementById('overlayAssignToContact');
  OVERLAY_CONTACT.innerHTML = '';
  const contact_array = CARD.contact || [];
  OVERLAY_CONTACT.innerHTML = renderOverlayContactBadges(contact_array);
}

/**
 * Displays subtasks in the overlay
 * @param {Object} CARD - The card object containing subtask information
 */
function showOverlaySubtasks(CARD) {
  const OVERLAY_SUBTASK = document.getElementById('overlaySubtask');
  const CONTAINER = document.querySelector('.overlay_card_subtasks_container');
  if (!OVERLAY_SUBTASK) return;
  
  const SUBTASKS = getSubtasksArray(CARD.subtask);
  OVERLAY_SUBTASK.innerHTML = '';
  
  if (SUBTASKS.length === 0) {
    if (CONTAINER) CONTAINER.style.display = 'none';
    return;
  }
  
  if (CONTAINER) CONTAINER.style.display = '';

  showOverlaySubtasksHTML(SUBTASKS, OVERLAY_SUBTASK, CARD.id);
}

/**
 * Toggles the completion status of a subtask
 * @param {string} cardId - The ID of the card containing the subtask
 * @param {number} index - The index of the subtask to toggle
 */
async function toggleSubtaskCompleted(cardId, index) {
  const card = cardFromFirebase.find(c => c.id === cardId);
  if (!card) return;

  const subtasks = getSubtasksArray(card.subtask);
  if (!subtasks[index]) return;

  subtasks[index].completed = !subtasks[index].completed;
  card.subtask = subtasks;

  await saveSubtasksToFirebase(cardId, subtasks);
  loadDetails(cardFromFirebase);
  refreshOverlay(card);
}

/**
 * Refreshes the overlay content with updated card data
 * @param {Object} card - The card object to display
 */
function refreshOverlay(card) {
  const overlayCard = document.getElementById('overlay_card');
  if (!overlayCard) return;

  renderOverlayCard(card, overlayCard);
  showOverlayAssignToContacts(card);
  showOverlaySubtasks(card);
}

/**
 * Deletes the card displayed in the overlay
 */
async function overlayDeleteCard() {
  const OVERLAY_CARD = document.getElementById('overlay_card');
  const CARD_ID = OVERLAY_CARD.querySelector('[data-card-id]')?.dataset.cardId;

  if (!CARD_ID) {
    const CARD = cardFromFirebase.find(c => OVERLAY_CARD.innerHTML.includes(c.title));
    if (CARD) {
      deleteSyn (CARD)
    }
    return;
  }
  deleteSyn (CARD)
}

/**
 * Synchronizes card deletion with Firebase and updates UI
 * @param {Object} CARD - The card object to delete
 */
 async function deleteSyn (CARD) {
      await deleteTaskFromFirebase(CARD.id);
      showDeleteToast();
      toggleOverlay();
      await loadTasks("board");
  
}

/**
 * Disables the current overlay by adding hidden class
 */
function disableCurrentOverlay() {
  const OVERLAY = document.getElementById('overlay');
  if (!OVERLAY) 
    return;
  OVERLAY.classList.add('d_none');
}

/**
 * Validates the edited form fields in the overlay
 * @param {string} dateInputId - The ID of the date input element
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateEditedForm(dateInputId) {
  const dateInput = document.getElementById(dateInputId);
  const dateError = document.getElementById('dateErrorEditOverlay');
  const dateWrapper = document.getElementById('dateOverlayEdit');

  const titleInput = document.getElementById('overlayEditTitle');
  const titleError = document.getElementById('titleErrorEditOverlay');

  let isValid = true;

  isValid &= validateRequired(titleInput, titleError);
  isValid &= validateRequired(dateInput, dateError, dateWrapper);

  return Boolean(isValid);
}

/**
 * Validates that a required field is not empty
 * @param {HTMLInputElement} input - The input element to validate
 * @param {HTMLElement} errorElem - The element to display error messages
 * @param {HTMLElement} [wrapper=input] - The wrapper element for error styling
 * @returns {boolean} True if field is not empty, false otherwise
 */
function validateRequired(input, errorElem, wrapper = input) {
  const isEmpty = input.value.trim() === "";

  if (isEmpty) {
    errorElem.innerHTML = "This field is required.";
    wrapper.classList.add("errorBorder");
  } else {
    errorElem.innerHTML = "";
    wrapper.classList.remove("errorBorder");
  }
  return !isEmpty;
}

/**
 * Handles contact selection in the overlay edit mode
 * @param {number} i - The index of the contact in the contact array
 * @param {HTMLInputElement} checkbox - The checkbox element
 */
function selectContactsOverlayEdit(i, checkbox) {
  const contact = contactFromFirebase[i];
  const placeholder = document.getElementById("selectedAssignedEditOverlay");

  if (checkbox.checked) {
    contactBadge.push(createContactBadge(contact));
    placeholder.value = "Select contacts to assign";
  } else {
    contactBadge = contactBadge.filter(b => b.dataset.userId !== contact.userid);
    placeholder.value = "";
  }

  iconContactHTML("iconContactOverlayEdit");
}

/**
 * Preselects contacts in the overlay based on card data
 * @param {Object} card - The card object containing contact information
 */
function preselectContactsInOverlay(card) {
  setTimeout(() => {
    const checkboxes = document.querySelectorAll('#labelContactOverlayEdit input[type="checkbox"]');
    contactBadge = [];

    checkboxes.forEach((checkbox, i) => {
      const contact = contactFromFirebase[i];
      const selected = (card.contact || []).some(c => c.id === contact.userid);

      checkbox.checked = selected;
      if (selected) contactBadge.push(createContactBadge(contact));
    });

    iconContactHTML("iconContactOverlayEdit");
  }, 100);
}

/**
 * Creates a contact badge element
 * @param {Object} contact - The contact object
 * @returns {HTMLElement} The created badge element
 */
function createContactBadge(contact) {
  const badge = document.createElement("div");
  badge.className = "iconConact dpf_cc";
  badge.style.backgroundColor = contact.color;
  badge.innerHTML = `<span>${contact.name.firstname[0]}${contact.name.secondname[0]}</span>`;
  badge.dataset.userId = contact.userid;
  return badge;
}

/**
 * Gets all selected contacts from the overlay checkboxes
 * @returns {Array} Array of selected contact objects with name and id
 */
function getSelectedContactsFromOverlay() {
  const checkboxes = document.querySelectorAll('#labelContactOverlayEdit input[type="checkbox"]');
  const selectedContacts = [];
  
  checkboxes.forEach((checkbox, index) => {
    if (checkbox.checked) {
      const contact = contactFromFirebase[index];
      selectedContacts.push({
        name: `${contact.name.firstname} ${contact.name.secondname}`,
        id: contact.userid
      });
    }
  });
  return selectedContacts;
}

/**
 * Filters date input to allow only numbers and slashes
 * @param {string} id - The ID of the input element
 * @returns {boolean} True if input exists and was filtered, undefined otherwise
 */
function filterDateInput(id) {
  let input = document.getElementById(id);
  if (!input) return;
  else{
  input.value = input.value.replace(/[^0-9\/]/g, "");
  return true
  } 
}