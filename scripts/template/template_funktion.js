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

function renderInHtml() {
  renderaddTaskOnHtml();
  renderCategoryOnHTML();
  initTaskFormEvents();

}

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

function renderContactOnHTML(contacFromFirebase, currentId) {
  const contactRef = document.getElementById(currentId);
    
  for (let i = 0; i < contacFromFirebase.length; i++) {
    contactRef.innerHTML +=  renderContact(i ,contacFromFirebase);
  }
}

function renderCategoryOnHTML() {
  const categoryRef = document.getElementById("labelCategory");
    
  for (let i = 0; i < category.length; i++) {
    categoryRef.innerHTML +=  renderCategory(i);      
  }
}

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

function getSubtasksArray(subtask) {
  if (Array.isArray(subtask)) 
    return subtask;
  return [];
}

function calcCompleted(subtasks) {
  return subtasks.filter(s => s.completed).length;
}

function calcProgress(subtasks) {
  if (subtasks.length === 0) 
    return 0;
  return (calcCompleted(subtasks) / subtasks.length) * 100;
}

function getInitials(name_obj) {
  if (!name_obj) return '??';
  const FIRST = name_obj.firstname || '';
  const SECOND = name_obj.secondname || '';
  if (!FIRST && !SECOND) return '??';
  return `${FIRST[0] || ''}${SECOND[0] || ''}`.toUpperCase();
}

function renderContactBadges(contact_array) {
  const MAX_VISIBLE = 3;
  let html = '';

  if (!contact_array || contact_array.length === 0) {
    return '<div class="no_contacts">No contacts assigned</div>';
  }

  html += maxContactbadge(contact_array, MAX_VISIBLE);

  if (contact_array.length > MAX_VISIBLE) {
    const REMAINING = contact_array.length - MAX_VISIBLE;
    html += `
      <div class="contact_badge contact_badge_more">+${REMAINING}</div>`;
  }

  return html;
};

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