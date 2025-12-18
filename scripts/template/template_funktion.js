/**
* Initializes the Add Task page.
* Loads contacts, renders HTML, SVG icons, and sets up event listeners.
*/
function init() {
  getInitialsFromUser()
  fetchContact();
  renderInHtml();
  fetchSVGs("AddTask");
  addTaskButton();
  addSubtask();
  enterSubtask();
  enableSubmit();
  changePriority("medium", "AddTask") 
}

/**
* Starts all render functions for the Add Task form.
*/
function renderInHtml() {
  renderaddTaskOnHtml();
  renderCategoryOnHTML();
  initTaskFormEvents();
}

/**
* Renders the Add Task template either on the board page
* or on the regular Add Task page.
*/
function renderaddTaskOnHtml() {
  const addTaskRef = document.getElementById("addTaskTemplate")
  const boardAddTaskRef = document.getElementById("addTaskAtBoardPage")

  if (boardAddTaskRef) {
    boardAddTaskRef.innerHTML += renderaddTask()
  }
  else{
    addTaskRef.innerHTML += renderaddTask()
  }
}

/**
* Renders the contact list into a given HTML container.
*
* @param {Array} contacFromFirebase - Contact list from Firebase
* @param {string} currentId - Target container ID
*/
function renderContactOnHTML(contacFromFirebase, currentId) {
  const contactRef = document.getElementById(currentId);
    
  for (let i = 0; i < contacFromFirebase.length; i++) {
    contactRef.innerHTML +=  renderContact(i ,contacFromFirebase);
  }
}

/**
* Renders all categories inside the category dropdown.
*/
function renderCategoryOnHTML() {
  const categoryRef = document.getElementById("labelCategory");
    
  for (let i = 0; i < category.length; i++) {
    categoryRef.innerHTML +=  renderCategory(i);      
  }
}

/**
* Adds an input event listener to the subtask input field.
*/
function addTaskButton() {
  const input = document.getElementById("subtaskReadOut");
  input.addEventListener("input", renderSubtaskButtons);
}

/**
* Renders contact badge icons in the specified container (max 9 visible)
* @param {string} currentId - The ID of the container element
*/
function iconContactHTML(currentId) {
  const iconConact = document.getElementById(currentId);
  const visibleBadges = contactBadge.slice(0, 8);
  if (!iconConact) return;
  iconConact.innerHTML = "";

  visibleBadges.forEach(badge => {
    iconConact.appendChild(badge.cloneNode(true));
  });
  if (contactBadge.length > 9) { 
   iconConact.innerHTML += `<div class="iconConact dpf_cc morethan9"><span>+${contactBadge.length - 9}</span></div>`
  }
}

/**
* Returns a valid subtask array.
*
* @param {Array|any} subtask - Subtask data
* @returns {Array} Subtask array or an empty array
*/
function getSubtasksArray(subtask) {
  if (Array.isArray(subtask)) 
    return subtask;
  return [];
}


/**
* Counts the completed subtasks.
*
* @param {Array} subtasks
* @returns {number} Number of completed subtasks
*/
function calcCompleted(subtasks) {
  return subtasks.filter(s => s.completed).length;
}

/**
* Calculates the subtask progress in percent.
*
* @param {Array} subtasks
* @returns {number} Progress value in percent
*/
function calcProgress(subtasks) {
  if (subtasks.length === 0) 
    return 0;
  return (calcCompleted(subtasks) / subtasks.length) * 100;
}

/**
* Creates initials from first and last name.
*
* @param {Object} name_obj - Object containing firstname and secondname
* @returns {string} Initials as uppercase string
*/
function getInitials(name_obj) {
  if (!name_obj) return '??';
  const FIRST = name_obj.firstname || '';
  const SECOND = name_obj.secondname || '';
  if (!FIRST && !SECOND) return '??';
  return `${FIRST[0] || ''}${SECOND[0] || ''}`.toUpperCase();
}

/**
* Renders contact badges (maximum 3 visible).
*
* @param {Array} contact_array - Assigned contacts
* @returns {string} HTML string
*/
function renderContactBadges(contact_array) {
  const MAX_VISIBLE = 3;
  let html = '';

  if (!contact_array || contact_array.length === 0) {
    return '<div class="no_contacts">No contacts assigned</div>';}

  html += maxContactbadge(contact_array, MAX_VISIBLE);

  if (contact_array.length > MAX_VISIBLE) {
    const REMAINING = contact_array.length - MAX_VISIBLE;
    html += `
      <div class="contact_badge contact_badge_more">+${REMAINING}</div>`; }
  return html;
};

/**
* Renders the maximum number of visible contact badges.
*
* @param {Array} contact_array
* @param {number} MAX_VISIBLE
* @returns {string} HTML String
*/
function maxContactbadge(contact_array, MAX_VISIBLE) {
  let html = '';

  for (let i = 0; i < Math.min(contact_array.length, MAX_VISIBLE); i++) {
    const CONTACT_ENTRY = contact_array[i];
    const CONTACT_ID = CONTACT_ENTRY.id;
    const CONTACT_DATA = contacts_from_firebase[CONTACT_ID];

    if (!CONTACT_DATA) continue;

    const INITIALS = getInitials(CONTACT_DATA.name);
    const COLOR = CONTACT_DATA.color || '#2a3647';

    html += `
      <div class="contact_badge" style="background-color:${COLOR}">${INITIALS}</div>`;
  }

  return html;
}

/**
* Renders all assigned contacts inside the overlay.
*
* @param {Array} contact_array
* @returns {string} HTML String
*/
function renderOverlayContactBadges(contact_array) {
  if (!contact_array || contact_array.length === 0)
    return '<div class="overlay_no_contacts">No contacts assigned</div>';

  let html = '';
  for (let i = 0; i < contact_array.length; i++) {
    const contact_entry = contact_array[i];
    const contact_id = contact_entry.id;
    const contact_data = contacts_from_firebase[contact_id];
    if (!contact_data) 
      continue;
    const initials = getInitials(contact_data.name);
    const color = contact_data.color || '#2a3647';
    html += `
      <div class="overlay_contact_badge">
        <div class="overlay_contact_initials" style="background-color:${color}">${initials}</div>
        <div class="overlay_contact_name">
          ${contact_data.name.firstname} ${contact_data.name.secondname}
        </div>
      </div>
    `;}
  return html;
}

/**
* Renders subtasks in the Add Task section.
*
* @param {HTMLElement} addSubtask - Subtask container element
* @param {Array} subtaskArray - Subtask array
*/
function subtask(addSubtask, subtaskArray) {
    addSubtask.innerHTML = "";
  
    for (let i = 0; i < subtaskArray.length; i++) {
      const subtaskTitle = typeof subtaskArray[i] === 'object' ? subtaskArray[i].title : subtaskArray[i];

    addSubtask.innerHTML += subtaskTemplate(i,subtaskTitle);
    }
  }

/**
* Displays subtask action buttons depending on the input value.
*/
 function renderSubtaskButtons() {
  const input = document.getElementById("subtaskReadOut");
  const buttonContainer = document.getElementById("inputButtons");
  const value = input.value.trim();

  buttonContainer.innerHTML = "";

  if (value !== "") {
    buttonContainer.innerHTML = renderSubtaskButtonsTemplate();
  }
 }

/**
* Renders the calendar and initializes the current month and days.
*
* @param {string} currentid - Calendar container ID
* @param {string} displayid - Display container ID
*/
 function renderCalender(currentid, displayid){
  let calenderOpen = document.getElementById(currentid)
  calenderOpen.innerHTML += renderCalenderTemplate(currentid, displayid)

  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();

  initMonthDisplay();
  renderCalendarDays(currentMonth, currentYear, currentid, displayid);  
 }

/**
* Renders subtasks inside the edit overlay.
*
* @param {HTMLElement} addSubtask
* @param {Array} subtaskArray
*/
function subtaskEditOverlay(addSubtask, subtaskArray) {
  addSubtask.innerHTML = "";
  
  for (let i = 0; i < subtaskArray.length; i++) {
    const subtaskTitle = typeof subtaskArray[i] === 'object' ? subtaskArray[i].title : subtaskArray[i];
   
    addSubtask.innerHTML += subtaskEditOverlayTemplate(i, subtaskTitle);}
}


/**
* Displays subtask action buttons inside the edit overlay.
*
* @param {Event} event - Input Event
*/
function renderSubtaskButtonsEditOverlay(event) {
  const input = event ? event.target : document.getElementById("subtaskReadOutEditOverlay");
  const buttonContainer = document.getElementById("inputButtonsEditOverlay");

  if (!input || !buttonContainer) {
    return;
  }
  
  const value = input.value.trim();

  buttonContainer.innerHTML = "";

  if (value !== "") {
    buttonContainer.innerHTML = renderSubtaskButtonsEditOverlayTemplate()
  }}

/**
* Renders contacts inside the edit overlay.
*
* @param {Array} contactFromFirebase
* @param {string} currentId
*/
  function renderContactOnHTMLOverlayEdit(contactFromFirebase, currentId) {
  const contactRef = document.getElementById(currentId);
  contactRef.innerHTML = "";
  
  for (let i = 0; i < contactFromFirebase.length; i++) {
    contactRef.innerHTML += renderContactOnHTMLOverlayEditTemplate(i, contactFromFirebase);
  }}

/**
* Renders contacts inside the edit overlay.
*
* @param {string} taskId - ID  Task
* @param {string} currentDragClass - Current column
*/
  function renderSwapDropDown(taskId, currentDragClass) {
  const columns = [
    { value: 'todo', label: 'To Do' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'awaitfeedback', label: 'Await Feedback' },
    { value: 'done', label: 'Done' }
  ];
  const filteredColumns = columns.filter(col => col.value !== currentDragClass);
  let columnSwapCategory = '<div class="dropdown-list_swap"><span class="dropdown-header-text">Move To</span>';
  
  filteredColumns.forEach(col => {
    columnSwapCategory += renderSwapDropDownTemplate(taskId, col)
  });
  columnSwapCategory += '</div>';
  return columnSwapCategory;
}

/**
* Renders the column swap dropdown for a task.
*/
function showDeleteToast(){
  toast = document.createElement('div');
  toast.innerHTML = showDeleteToastTemplate();
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}
/**
* Renders subtasks inside the task overlay.
*
* @param {Array} SUBTASKS
* @param {HTMLElement} OVERLAY_SUBTASK
* @param {string} CARD_ID
*/
function showOverlaySubtasksHTML (SUBTASKS, OVERLAY_SUBTASK, CARD_ID) {
  SUBTASKS.forEach((st, index) => {
    OVERLAY_SUBTASK.innerHTML += showOverlaySubtasksHTMLTemplate(st, CARD_ID, index)
  })
}