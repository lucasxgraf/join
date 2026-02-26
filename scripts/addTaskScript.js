/**
 * @fileoverview Add Task functionality for task management system
 * @description Handles task creation, validation, contact assignment, subtask management, and priority selection
 */
let task = [];
let subtaskArray = [];
let contactList = [];
let contactBadge = [];
let selectedPriority = '';
let category = ["Technical Task", "User Story",];
let hasForbidden ;

/**
 * Clears all input fields and resets the form to default state
 */
function clearInput() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("duedate").value = "";
  task = [];

  const categoryInput = document.getElementById("selectedCategory");
  categoryInput.value = "";
  changePriority("medium", "AddTask")
  document.getElementById("submit").disabled = true
  clearSubtask()
  clearContact()
  updateAssignedInput()
}

/**
 * Clears all subtasks from the form
 */
function clearSubtask() {
  subtaskArray = [];
  const addSubtaskContainer = document.getElementById("addSubtask");
  if (addSubtaskContainer) addSubtask(addSubtaskContainer, subtaskArray);   
  addSubtaskContainer.innerHTML = ""
}

/**
 * Clears all selected contacts and unchecks all contact checkboxes
 */
function clearContact() {
  contactList = [];
  contactBadge = [];
  const iconConact = document.getElementById("iconConact");
  if (iconConact) iconConact.innerHTML = "";

    document.querySelectorAll('#contactDropdown input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
    iconContactHTML("iconContact")});
}

/**
 * Toggles the visibility of a dropdown menu
 * @param {string} selector - The ID of the dropdown element
 * @param {string} [currentId] - Optional ID for icon rendering
 */
function toggleDropdown(selector, currentId) {
  const dropdown = document.getElementById(selector);
  const isOpen = dropdown.classList.toggle("open");
  if (selector === "contact") {
    renderIcon();
  } if (isOpen) {
    setTimeout(() => {
      document.addEventListener("click", (e) => handleClickOutside(e, dropdown, currentId));
    }, 0);
  } if (!isOpen) { if (currentId) iconContactHTML(currentId);}
}

/**
 * Handles clicks outside of dropdown to close it
 * @param {Event} e - The click event
 * @param {HTMLElement} dropdown - The dropdown element
 * @param {string} [currentId] - Optional ID for icon rendering
 */
function handleClickOutside(e, dropdown, currentId) {
  if (dropdown && !dropdown.contains(e.target)) {
    dropdown.classList.remove("open");
    document.removeEventListener("click", handleClickOutside);
    if (currentId) iconContactHTML(currentId);}
}

/**
 * Handles overlay clicks to close dialog if no dropdown is open
 * @param {Event} event - The click event
 */
function handleOverlayClick(event) {
  const dropdown = document.querySelector('.custom-category-dropdown.open');
  if (dropdown) { return; }
  closeDialog();
}

/**
 * Changes the selected category and updates the input field
 * @param {string|Element} selection - The selected category as string or DOM element
 */
function changeCategory(selection) {
  let text = "";
  const input = document.getElementById("selectedCategory");

  if (typeof selection === "string") {
    text = selection;
  } if (selection instanceof Element) {
    const span = selection.querySelector("span");
    text = span ? span.innerText.trim() : selection.innerText.trim();
  } if (input && text) {
    input.value = text;
    enableSubmit()
  }
  toggleDropdown('categoryDropdown');
}

/**
 * Adds a new subtask to the subtask array (max 5 subtasks)
 */
function addSubtask() {
  const readout = document.getElementById("subtaskReadOut");
  const addSubtaskContainer = document.getElementById("addSubtask");
  const value = readout.value.trim().toLowerCase();
  if (value === "" || subtaskArray.length >= 5) 
    return;

  subtaskArray.push({ title: value, completed: false });  
  subtask(addSubtaskContainer, subtaskArray);
  document.getElementById("inputButtons").innerHTML = ""
  readout.value = "";
}

/**
 * Adds event listener for Enter key to add subtask
 */
function enterSubtask() {
  document.getElementById("subtaskReadOut").addEventListener("keypress", (event) => {  
  if (event.key === "Enter"){
    event.preventDefault();
    addSubtask();
  }}); 
}

/**
 * Changes the priority level and updates button states
 * @param {string} priority - The priority level (urgent, medium, low)
 * @param {string} currentId - The ID suffix for the button element
 */
function changePriority(priority, currentId) {
  const buttons = document.querySelectorAll('.priority-btn');
  const button = document.getElementById(`${priority}Btn${currentId}`);

  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');
  selectedPriority = priority;
}

/**
 * Selects or deselects a contact for task assignment
 * @param {number} i - The index of the contact in the contact array
 * @param {HTMLInputElement} checkbox - The checkbox element
 */
function selectContacts(i, checkbox) {
  let badgeName = contactName[i].innerText
  let badgeEl = document.getElementById(`contactDropdownList_${i}`);
  let userId = contactFromFirebase[i].userid;
  const exists = contactList.some(c => c.id === userId);

  if (!exists) {
    contactBadge.push(badgeEl);
    contactList.push({name: badgeName, id: userId
    });
  } else {
    contactList = contactList.filter(c => c.id !== userId);
    contactBadge = contactBadge.filter(b => b.id !== badgeEl.id);}
  updateAssignedInput();
}

/**
 * Updates the assigned contacts input field placeholder
 */
function updateAssignedInput() {
  const input = document.getElementById("selectedAssigned");
  
  if (contactList.length === 0) {
    input.value = "";
  } else 
    input.value = "Select contacts to assign";   
}

/**
 * Deletes a subtask at the specified index
 * @param {number} i - The index of the subtask to delete
 */
function deleteTask(i){
  const addSubtask = document.getElementById("addSubtask");
  subtaskArray.splice(i, 1);
  subtask(addSubtask, subtaskArray);
}

/**
 * Clears the subtask input field
 */
function cleanInput() {
  let input = document.getElementById("subtaskReadOut")
  input.value = "";  
}

/**
 * Enables edit mode for a subtask
 * @param {number} i - The index of the subtask to edit
 */
function editSubtask(i) {
  const taskOutput = document.getElementById(`taskOutput-${i}`);
  const editInputSubtask = document.getElementById(`editInputSubtask-${i}`);
  const containerEditSubtask = document.getElementById(`containerEditSubtask-${i}`)

  taskOutput.classList.toggle("dnone");
  containerEditSubtask.classList.toggle("dnone")
  editInputSubtask.value = subtaskArray[i].title;
  editInputSubtask.focus();   
  editInputSubtask.onblur = (e) => {
  if (e.relatedTarget && containerEditSubtask.contains(e.relatedTarget)) {
    return;}
  cancelEditSubtask(i);
  }};

/**
 * Cancels subtask editing and returns to view mode
 * @param {number} i - The index of the subtask
 */
function cancelEditSubtask(i) {
  const taskOutput = document.getElementById(`taskOutput-${i}`);
  const container = document.getElementById(`containerEditSubtask-${i}`);

  container.classList.add("dnone");
  taskOutput.classList.remove("dnone");
}
 
/**
 * Saves the edited subtask or removes it if empty
 * @param {number} i - The index of the subtask to update
 */
function addEditSubtask(i) {
  const editInputSubtask = document.getElementById(`editInputSubtask-${i}`);
  const newValue = editInputSubtask.value;

  if (newValue !== null && newValue.trim() !== "") {
    subtaskArray[i] = { title: newValue.trim(), completed: false };
    subtask(document.getElementById("addSubtask"), subtaskArray);
  } else{ (editInputSubtask.value === "") 
  subtaskArray.splice(i, 1);
  subtask(document.getElementById("addSubtask"), subtaskArray) }
}

/**
 * Clears the subtask edit input or deletes the subtask if already empty
 * @param {number} i - The index of the subtask
 */
function clearEditSubtask(i) {
  const editInputSubtask = document.getElementById(`editInputSubtask-${i}`);
  if (editInputSubtask.value === "") {
  subtaskArray.splice(i, 1);
  subtask(document.getElementById("addSubtask"), subtaskArray) 
  } else{
  editInputSubtask.value = "";
  editInputSubtask.focus();}
}

/**
 * Displays an error message in the specified element
 * @param {string} elementId - The ID of the error message element
 * @param {string} message - The error message to display
 */
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

/**
 * Clears all error messages from the form
 */
function clearErrors() {
  document.querySelectorAll('.error_message').forEach(e => e.textContent = '');
}

/**
 * Enables or disables the submit button based on required field completion
 */
function enableSubmit() {
  const duedateInput = document.getElementById("duedate").value.trim();
  const categorySelect = document.getElementById("selectedCategory").value.trim();
  const titleInput = document.getElementById("title").value.trim();
  const allFilled = categorySelect && titleInput && duedateInput;
  const hasForbidden = checkReg();
  document.getElementById("submit").disabled = !allFilled || hasForbidden || !submit;


  if (allFilled) 
      document.getElementById("submit").disabled = false
  else
    document.getElementById("submit").disabled = true
  }


/**
 * Initializes task form event handlers for validation and submission
 */
function initTaskFormEvents() {
  const form = document.getElementById("taskForm");
  const submitBtn = document.getElementById("submit");
  const title = document.getElementById("title");
  const duedate = document.getElementById("duedate");
  const category = document.getElementById("selectedCategory");


title.addEventListener('blur', () => {
  if (!title.value.trim()) {
    showError("titleError", "This field is required.");
  } else {
    showError("titleError", "");
  }
  enableSubmit();
});


duedate.addEventListener('blur', () => {
  if (!validateDueDate()) {
    showError("dateError", "This field is required.");
  } else {
    showError("dateError", "");
  }
  enableSubmit();
});

category.addEventListener('change', () => {
  if (!category.value.trim()) {
    showError("categoryError", "This field is required.");
  } else {
    showError("categoryError", "");
  }
  enableSubmit();
});

submitBtn.addEventListener('click', (e) => {
  e.preventDefault();
  if (validateForm()) {
    addTask();
  }
  clearErrors();
});
}

/**
 * Prevents focus loss on date input when clicking calendar button
 * @param {Event} e - The mousedown event
 */
function keepFocusOnDate(e) {
  e.preventDefault(); 
}

/**
 * Validates all required form fields
 * @returns {boolean} True if all fields are valid, false otherwise
 */
function validateForm() {
  let ok = true;
  if (!title.value.trim()) { showError("titleError", "This field is required."); ok = false; }
  if (!validateDueDate()) ok = false;
  if (!selectedCategory.value.trim()) { showError("categoryError", "This field is required."); ok = false; }
  return ok;
}

/**
 * Displays feedback message and redirects to board page
 */
function sendFeedback() {
  const feedbackRef = document.getElementById("feedback")
  feedbackRef.classList.remove("dnone");
  const checkURL = checkWindowURL()
  setTimeout(() => {
    feedbackRef.classList.add("dnone");
    if (checkURL) {
      window.location.href = "board.html";}
    else {
      closeDialog();
      clearInput();
      clearErrors();
      initTaskFormEvents();
      loadTasks("board");
      return;
    }}, 2000);
}

/**
 * Check Window URL to determine if on addTask page
 * @returns {boolean} True if on addTask page, false otherwise
 */
function checkWindowURL() {
  const currentPath = window.location.pathname;
  const isAddTaskPage = currentPath.endsWith("addTask.html");
  return isAddTaskPage;
}

function checkReg() {  
  const reg = /[<>\[\]{}´']/;
  return reg.test(document.getElementById("subtaskReadOut").value) ||
         reg.test(document.getElementById("description").value) ||
         reg.test(document.getElementById("title").value);
}