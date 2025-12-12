/**
 * @fileoverview Overlay card edit functionality for task management
 * @description Handles editing tasks in overlay mode including subtask management, validation, and contact assignment
 */

/**
 * Opens the overlay edit mode for a specific card
 * @param {string} cardId - The ID of the card to edit
 */
function openOverlayEdit(cardId) {
  const OVERLAY = document.getElementById('overlay');
  const OVERLAY_CARD = document.getElementById('overlay_card');
  const CARD = cardFromFirebase.find(c => c.id === cardId);
  const subtaskArray = getSubtasksArray(CARD.subtask);
  SingleCARD = [CARD];
  if (!OVERLAY || !OVERLAY_CARD || !CARD) 
    return;
  
  openOverlayEditSync(CARD, OVERLAY_CARD, subtaskArray,contactFromFirebase)
  OVERLAY.classList.remove('d_none');
  document.body.style.overflow = 'hidden';
}

/**
 * Synchronizes the overlay edit state with card data
 * @param {Object} CARD - The card object to edit
 * @param {HTMLElement} OVERLAY_CARD - The overlay card container element
 * @param {Array} subtaskArray - Array of subtasks
 * @param {Array} contactFromFirebase - Array of contacts from Firebase
 */
function openOverlayEditSync (CARD, OVERLAY_CARD, subtaskArray, contactFromFirebase) {
  disableCurrentOverlay();
  renderOverlayEditCard(CARD, OVERLAY_CARD);
  fetchSVGs("OverlayEdit");
  subtaskEditOverlay(document.getElementById("overlayEditSubtask"), subtaskArray);
  changePriority(CARD.priority, "OverlayEdit");
  preselectContactsInOverlay(CARD);
  checkEditOverlayInput();
  renderContactOnHTMLOverlayEdit(contactFromFirebase, "labelContactOverlayEdit");
}

/**
 * Clears the subtask input field in the edit overlay
 */
function cleanInputEditOverlay() {
  let input = document.getElementById("subtaskReadOutEditOverlay");
  input.value = "";
  document.getElementById("inputButtonsEditOverlay").innerHTML = "";
}

/**
 * Adds a new subtask to the card being edited in the overlay
 */
function addSubtaskEditOverlay() {
  const readout = document.getElementById("subtaskReadOutEditOverlay");
  const addSubtaskContainer = document.getElementById("overlayEditSubtask");
  const value = readout.value.trim().toLowerCase();;
  
  if (!SingleCARD[0].subtask) 
    SingleCARD[0].subtask = [];

  const subtaskArray = getSubtasksArray(SingleCARD[0].subtask);
  
  if (value === "" || subtaskArray.length >= 5) 
    return;

  subtaskArray.push({ title: value, completed: false });
  SingleCARD[0].subtask = subtaskArray;
  
  subtaskEditOverlay(addSubtaskContainer, subtaskArray);
  document.getElementById("inputButtonsEditOverlay").innerHTML = "";
  readout.value = "";
}

/**
 * Enables edit mode for a specific subtask in the overlay
 * @param {number} i - The index of the subtask to edit
 */
function editSubtaskEditOverlay(i) {
  const subtaskArray = getSubtasksArray(SingleCARD[0].subtask);

  const taskOutput = document.getElementById(`taskOutputEditOverlay-${i}`);
  const editInputSubtask = document.getElementById(`editInputSubtaskEditOverlay-${i}`);
  const containerEditSubtask = document.getElementById(`containerEditSubtaskEditOverlay-${i}`);

  taskOutput.classList.toggle("dnone");
  containerEditSubtask.classList.toggle("dnone");
  editInputSubtask.value = subtaskArray[i].title;
  editInputSubtask.focus();   
  editInputSubtask.onblur = (e) => {
    if (e.relatedTarget && containerEditSubtask.contains(e.relatedTarget)) 
      return;
    cancelEditSubtaskEditOverlay(i);
  };
}

/**
 * Cancels subtask editing and returns to view mode
 * @param {number} i - The index of the subtask
 */
function cancelEditSubtaskEditOverlay(i) {
  const taskOutput = document.getElementById(`taskOutputEditOverlay-${i}`);
  const container = document.getElementById(`containerEditSubtaskEditOverlay-${i}`);

  container.classList.add("dnone");
  taskOutput.classList.remove("dnone");
}

/**
 * Deletes a subtask from the card being edited
 * @param {number} i - The index of the subtask to delete
 */
function deleteTaskEditOverlay(i) {
  const subtaskArray = getSubtasksArray(SingleCARD[0].subtask);
  const addSubtask = document.getElementById("overlayEditSubtask");
  
  subtaskArray.splice(i, 1);
  SingleCARD[0].subtask = subtaskArray;
  
  subtaskEditOverlay(addSubtask, subtaskArray);
}

/**
 * Clears the subtask edit input or deletes the subtask if already empty
 * @param {number} i - The index of the subtask
 */
function clearEditSubtaskEditOverlay(i) {
  const editInputSubtask = document.getElementById(`editInputSubtaskEditOverlay-${i}`);
  const subtaskArray = getSubtasksArray(SingleCARD[0].subtask);

  if (editInputSubtask.value === "") {
    subtaskArray.splice(i, 1);
    SingleCARD[0].subtask = subtaskArray;
    subtaskEditOverlay(document.getElementById("overlayEditSubtask"), subtaskArray);
  } else {
    editInputSubtask.value = "";
    editInputSubtask.focus();
  }
}

/**
 * Saves the edited subtask or removes it if empty
 * @param {number} i - The index of the subtask to update
 */
function addEditSubtaskEditOverlay(i) {
  const subtaskArray = getSubtasksArray(SingleCARD[0].subtask);
  const editInputSubtask = document.getElementById(`editInputSubtaskEditOverlay-${i}`);
  const newValue = editInputSubtask.value;

  if (newValue !== null && newValue.trim() !== "") {
    subtaskArray[i] = { title: newValue.trim(), completed: false };
    SingleCARD[0].subtask = subtaskArray;
    subtaskEditOverlay(document.getElementById("overlayEditSubtask"), subtaskArray);
  } else {
    subtaskArray.splice(i, 1);
    SingleCARD[0].subtask = subtaskArray;
    subtaskEditOverlay(document.getElementById("overlayEditSubtask"), subtaskArray);
  }
}

/**
 * Validates the edited form fields
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateEditedForm() {
  clearErrors();
  let isValid = true;

  const titleInput = document.getElementById('overlayEditTitle');
  if (titleInput.value.trim() === "") {
    showError('titleErrorEditOverlay', "This field is required.");
    titleInput.classList.add('errorBorder');
    isValid = false;
  } else 
    titleInput.classList.remove('errorBorder');
  if (!validateDueDate("duedateOverlayEdit", "dateErrorEditOverlay", "dateOverlayEdit")) 
    isValid = false;
  
  return isValid;
}

/**
 * Checks if all required inputs are filled and enables/disables submit button
 */
function checkEditOverlayInput() {
  let button = document.getElementById ("submitEditOverlay")
  let titleInput = document.getElementById("overlayEditTitle").value.trim();
  let dueDate = document.getElementById("duedateOverlayEdit").value.trim();
  const allFilled = titleInput && dueDate
  if (allFilled) 
    button.disabled = false
  else
    button.disabled = true
  
}