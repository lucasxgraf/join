const URGENT  = '../assets/svg/priority_symblos/urgent.svg';
const MEDIUM  = '../assets/svg/priority_symblos/medium.svg';
const LOW  = '../assets/svg/priority_symblos/low.svg';
let SingleCARD = []

function openOverlay(cardId) {
  SingleCARD = []
  const OVERLAY = document.getElementById('overlay');
  const OVERLAY_CARD = document.getElementById('overlay_card');
  const CARD = cardFromFirebase.find(c => c.id === cardId);
  if (!OVERLAY || !OVERLAY_CARD || !CARD) 
    return;
  renderOverlayCard(CARD, OVERLAY_CARD);
  showOverlayAssignToContacts(CARD);
  showOverlaySubtasks(CARD);
  OVERLAY.classList.remove('d_none');
  document.body.style.overflow = 'hidden';
}

function toggleOverlay() {
  const OVERLAY = document.getElementById('overlay');
  if (!OVERLAY) 
    return;
  const hidden = OVERLAY.classList.toggle('d_none');
  document.body.style.overflow = hidden ? '' : 'hidden';
}

function stopOverlayClose(e) {
  e.stopPropagation();
}

function renderOverlayCard(CARD, OVERLAY_CARD) {
  OVERLAY_CARD.innerHTML = `
  <div class="overlay_card_header">
    <div class="${String(CARD.category||'').toLowerCase().replace(/\s+/g,'_')}">
      <div class="overlay_card_category">${CARD.category||''}</div>
    </div>
      <button class="overlay_close_btn" onclick="toggleOverlay()">×</button>
  </div>

    <h3 class="overlay_card_title">${CARD.title||''}</h3>

    <div class="overlay_card_description">${CARD.description||''}
    </div>

    <div class="overlay_card_due_date_container">
      <span>Due Date:</span>
      <div>${CARD.date||''}</div>
    </div>

    <div class="overlay_card_priority_container">
      <span>Priority:</span>
      <div class="overlay_card_priority_layout">${CARD.priority||''}
        <div class="overlay_card_priority_img overlay_card_priority_img_${(CARD.priority||'').toLowerCase()}"></div>
      </div>
    </div>

    <div class="overlay_card_assigned_to_container">
      <span>Assigned To:</span>
      <div id="overlayAssignToContact" class="overlay_card_assigned_to_layout">  
      </div>
    </div>

    <div class="overlay_card_subtasks_container">
      <span>Subtasks</span>
      <div id="overlaySubtask" class="overlay_card_subtask_layout"></div>
    </div>

    <div class="overlay_card_footer">
      <button onclick="overlayDeleteCard()">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_75592_9951" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
          <rect x="0.144531" width="24" height="24" fill="currentColor"/>
          </mask>
          <g mask="url(#mask0_75592_9951)">
          <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z" fill="#2A3647"/>
          </g>
        </svg>
        Delete
      </button>
        <div class="overlay_card_footer_separator"></div>
      <button onclick="openOverlayEdit('${CARD.id}')">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
          <rect x="0.144531" width="24" height="24" fill="currentColor"/>
          </mask>
          <g mask="url(#mask0_75592_9969)">
          <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
          </g>
        </svg>
        Edit
      </button>
    </div>
  `;
}

function showOverlayAssignToContacts(CARD) {
  const OVERLAY_CONTACT = document.getElementById('overlayAssignToContact');
  OVERLAY_CONTACT.innerHTML = '';
  const contact_array = CARD.contact || [];
  OVERLAY_CONTACT.innerHTML = renderOverlayContactBadges(contact_array);
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
    `;
  }
  return html;
}

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

  SUBTASKS.forEach((st, index) => {
    OVERLAY_SUBTASK.innerHTML += `
      <div class="overlay_card_single_subtask">
        <input type="checkbox" 
          onclick="toggleSubtaskCompleted('${CARD.id}', ${index})"
          ${st.completed ? 'checked' : ''}/>
        <div>${st.title}</div>
      </div>
    `;
  });
}

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

async function saveSubtasksToFirebase(cardId, subtasks) {
  try {
    const url = `${BASE_URL}addTask/${cardId}/subtask.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subtasks) 
    });
  } catch (error) {
    console.error('Fehler beim Speichern der Subtasks:', error);
  }
}

function refreshOverlay(card) {
  const overlayCard = document.getElementById('overlay_card');
  if (!overlayCard) return;

  renderOverlayCard(card, overlayCard);
  showOverlayAssignToContacts(card);
  showOverlaySubtasks(card);
}

async function overlayDeleteCard() {
  const OVERLAY_CARD = document.getElementById('overlay_card');
  const CARD_ID = OVERLAY_CARD.querySelector('[data-card-id]')?.dataset.cardId;

  if (!CARD_ID) {
    const CARD = cardFromFirebase.find(c => OVERLAY_CARD.innerHTML.includes(c.title));
    if (CARD) {
      await deleteTaskFromFirebase(CARD.id);
      showDeleteToast();
      toggleOverlay();
      await loadTasks();
    }
    return;
  }

  await deleteTaskFromFirebase(CARD_ID);
  showDeleteToast();
  toggleOverlay();
  await loadTasks();
}

async function deleteTaskFromFirebase(taskId) {
  try {
    const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
      method: 'DELETE'
    });
    if (!response.ok) {
      throw new Error('Fehler beim Löschen der Aufgabe');
    }
  } catch (error) {
    console.error('Fehler beim Löschen:', error);
  }
}

function showDeleteToast() {
  toast = document.createElement('div');
  toast.innerHTML = `
    <div class="toast_animation">
      <span>Task deleted</span>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_delete" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
          <rect x="0.144531" width="24" height="24" fill="white"/>
        </mask>
        <g mask="url(#mask0_delete)">
          <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453Z" fill="white"/>
        </g>
      </svg>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}


function openOverlayEdit(cardId) {
  const OVERLAY = document.getElementById('overlay');
  const OVERLAY_CARD = document.getElementById('overlay_card');
  const CARD = cardFromFirebase.find(c => c.id === cardId);
  SingleCARD = [CARD];
  if (!OVERLAY || !OVERLAY_CARD || !CARD) 
    return;
  disableCurrentOverlay();
  renderOverlayEditCard(CARD, OVERLAY_CARD);
  
  renderContactOnHTMLOverlayEdit(contactFromFirebase, "labelContactOverlayEdit");
  fetchSVGs("OverlayEdit");
  
  const subtaskArray = getSubtasksArray(CARD.subtask);
  subtaskEditOverlay(document.getElementById("overlayEditSubtask"), subtaskArray);
  
  changePriority(CARD.priority, "OverlayEdit");
  preselectContactsInOverlay(CARD);

  OVERLAY.classList.remove('d_none');
  document.body.style.overflow = 'hidden';
}

function disableCurrentOverlay() {
  const OVERLAY = document.getElementById('overlay');
  if (!OVERLAY) 
    return;
  OVERLAY.classList.add('d_none');
}

function renderOverlayEditCard(CARD, OVERLAY_CARD) {
  OVERLAY_CARD.innerHTML = `
  <button class="overlay_close_btn" onclick="toggleOverlay()">×</button>

  <form>
    <div class="overlay_edit_form_layout">
      <label for="overlayEditTitle">
        <h3>Title</h3>
      </label> 
      <div>  
        <input id="overlayEditTitle" placeholder="Enter a title" class="inputBorderColor" type="text" name="title" onblur="validateInput('titleErrorEditOverlay', 'overlayEditTitle', 'overlayEditTitle')" value="${CARD.title||''}"/>
        <div id="titleErrorEditOverlay" class="error_message"></div>
      </div> 
    </div>
    <div class="overlay_edit_form_layout">
      <label for="overlayEditDescription">
        <h3>Description</h3>
      </label>
      <textarea class="inputBorderColor" placeholder="Enter a description" id="overlayEditDescription" type="text" name="description">${CARD.description||''}</textarea>
    </div>
    <div class="overlay_edit_form_layout">
      <label aria-label="Date">
        <h3>Due date</h3>
      </label>
      <div> 
        <div id="dateOverlayEdit" class="task-input dpf sp_between inputBackground inputWrapper">
          <input class="fontColor cleanInputforDate" id="duedateOverlayEdit" value="${CARD.date||''}" onblur="validateInput('dateErrorEditOverlay', 'duedateOverlayEdit', 'dateOverlayEdit')" placeholder="dd/mm/yyyy" 
            maxlength="10">
          </input>
          <button type="button" onmousedown="keepFocusOnDate(event)" onclick="toggleCalender('calenderOverlayEdit','duedateOverlayEdit')" class="iconButtonsForImg dpf_cc"><img src="../assets/svg/calender.svg" alt="event">
          </button> 
          <div class="calender" id="calenderOverlayEdit"></div>
        </div>
          <div id="dateErrorEditOverlay" class="error_message"></div>
        </div> 
    </div>
  </form>

  <div class="OverlayEditContainer">
    <div class="overlay_edit_form_layout">
      <h3>Priority</h3>
        <div class="priority-buttons">
          <button type="button" id="urgentBtnOverlayEdit" class="urgent_btn priority-btn dpf_cc" onclick="changePriority('urgent', 'OverlayEdit')">Urgent<span class="urgent_icon"></span></button> 
          <button type="button" id="mediumBtnOverlayEdit" class="medium-btn priority-btn dpf_cc" onclick="changePriority('medium','OverlayEdit')">Medium <span class="medium_icon"></span></button>
          <button type="button" id="lowBtnOverlayEdit" class="low_btn priority-btn dpf_cc" onclick="changePriority('low','OverlayEdit')">Low <span class="low_icon"></span></button>
        </div>
    </div>

    <div class="overlay_edit_form_layout">
      <h3>Assigned to</h3>
        <div class="custom-category-dropdown" id="contactDropdownOverlayEdit">
            <div class="dropdown-header" onclick="toggleDropdown('contactDropdownOverlayEdit','iconContactOverlayEdit')">
                <span>Select contacts to assign</span>
                <div class="dropdown-arrow" id="dropdownArrow"> <img src="../assets/img/arrow_drop_down.png" alt="arrow"></div>
            </div>
            <div class="dropdown-list" id="categoryDropdownList">
                <div id="labelContactOverlayEdit"></div>
            </div>
            <div id="iconContactOverlayEdit" class="dpf gap8"></div>
        </div>
      </div>

      <div class="overlay_edit_form_layout">
        <h3>Subtasks</h3>
          <div class="input-wrapper">
            <input type="text" maxlength="35" class="task-input inputBorderColor" id="subtaskReadOutEditOverlay" placeholder="Add new subtask" oninput="renderSubtaskButtonsEditOverlay(event)" onkeypress="if(event.key==='Enter'){event.preventDefault();addSubtaskEditOverlay();}">
            <div id="inputButtonsEditOverlay"></div>      
          </div>
          <div class="subtask" id="overlayEditSubtask"></div>
        </div>

      <button type="button" onclick="saveEditedCardToFirebase()" id="submitEditOverlay" class="btn btn_create dpf_cc align-self">Ok
        <img class="checkSvg" src="../assets/svg/check.svg" alt="">
      </button>
  </div>
  `;
}

//Edit Overlay Assigned To
function renderContactOnHTMLOverlayEdit(contactFromFirebase, currentId) {
  const contactRef = document.getElementById(currentId);
  contactRef.innerHTML = "";
  
  for (let i = 0; i < contactFromFirebase.length; i++) {
    contactRef.innerHTML += `
    <label class="dropdown-item sp_between">
      <div class="dpf_cc gap8">
        <div id="contactDropdownListEdit_${i}" class="iconConact dpf_cc" style="background-color: ${contactFromFirebase[i].color}">${contactFromFirebase[i].name.firstname.slice(0, 1)}${contactFromFirebase[i].name.secondname.slice(0, 1)}</div>
        <span>${contactFromFirebase[i].name.firstname} ${contactFromFirebase[i].name.secondname}</span>
      </div>
      <input class="checkbox" type="checkbox" onchange="selectContactsOverlayEdit(${i}, this)">
    </label>`;
  }
}

function selectContactsOverlayEdit(i, checkbox) {
  const contact = contactFromFirebase[i];
  
  if (checkbox.checked) {
    const badge = document.createElement('div');
    badge.className = 'iconConact dpf_cc';
    badge.style.backgroundColor = contact.color;
    badge.innerHTML = `<span>${contact.name.firstname.slice(0, 1)}${contact.name.secondname.slice(0, 1)}</span>`;
    badge.dataset.userId = contact.userid;
    contactBadge.push(badge);
  } else {
    contactBadge = contactBadge.filter(b => b.dataset.userId !== contact.userid);
  }
  
  iconContactHTML("iconContactOverlayEdit");
}

function preselectContactsInOverlay(card) {
  setTimeout(() => {
    const checkboxes = document.querySelectorAll('#labelContactOverlayEdit input[type="checkbox"]');
    const cardContacts = card.contact || [];
    
    contactBadge = [];
    
    checkboxes.forEach((checkbox, index) => {
      const contact = contactFromFirebase[index];
      const isSelected = cardContacts.some(c => c.id === contact.userid);
      checkbox.checked = isSelected;
      
      if (isSelected) {
        const badge = document.createElement('div');
        badge.className = 'iconConact dpf_cc';
        badge.style.backgroundColor = contact.color;
        badge.innerHTML = `<span>${getInitials(contact.name)}</span>`;
        badge.dataset.userId = contact.userid;
        contactBadge.push(badge);
      }
    });
    
    iconContactHTML("iconContactOverlayEdit");
  }, 100);
}

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

//Edit Overlkay Subtasks
function renderSubtaskButtonsEditOverlay(event) {
  const input = event ? event.target : document.getElementById("subtaskReadOutEditOverlay");
  const buttonContainer = document.getElementById("inputButtonsEditOverlay");

  if (!input || !buttonContainer) {
    return;
  }
  
  const value = input.value.trim();

  buttonContainer.innerHTML = "";

  if (value !== "") {
    buttonContainer.innerHTML = `
      <button type="button" class="iconButtonsForImg dpf_cc hover" onclick="cleanInputEditOverlay()" id="addBtn">
        <img src="../assets/svg/close.svg" alt="cancel">
      </button>
      <div class="sepraratorSubtask"></div>
      <button type="button" class="iconButtonsForImg dpf_cc hover" onclick="addSubtaskEditOverlay()" id="cancelBtn">
        <img src="../assets/svg/check.svg" alt="check">
      </button>`;
  }
}

function cleanInputEditOverlay() {
  let input = document.getElementById("subtaskReadOutEditOverlay");
  input.value = "";
  document.getElementById("inputButtonsEditOverlay").innerHTML = "";
}

function addSubtaskEditOverlay() {
  const readout = document.getElementById("subtaskReadOutEditOverlay");
  const addSubtaskContainer = document.getElementById("overlayEditSubtask");
  const value = readout.value.trim().toLowerCase();;
  
  if (!SingleCARD[0].subtask) {
    SingleCARD[0].subtask = [];
  }
  
  const subtaskArray = getSubtasksArray(SingleCARD[0].subtask);
  
  if (value === "" || subtaskArray.length >= 5) 
    return;

  subtaskArray.push({ title: value, completed: false });
  SingleCARD[0].subtask = subtaskArray;
  
  subtaskEditOverlay(addSubtaskContainer, subtaskArray);
  document.getElementById("inputButtonsEditOverlay").innerHTML = "";
  readout.value = "";
}

function subtaskEditOverlay(addSubtask, subtaskArray) {
  addSubtask.innerHTML = "";
  
  for (let i = 0; i < subtaskArray.length; i++) {
    const subtaskTitle = typeof subtaskArray[i] === 'object' ? subtaskArray[i].title : subtaskArray[i];
   
    addSubtask.innerHTML += `
      <div class="taskOutput dpf_cc sp_between" id="taskOutputEditOverlay-${i}" ondblclick="editSubtaskEditOverlay(${i})">・ ${subtaskTitle}
        <div class="editdeleteBtn">
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="editSubtaskEditOverlay(${i})"><img src="../assets/svg/edit.svg" alt="pancel"></button>
          <div class="sepraratorSubtask"></div>
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="deleteTaskEditOverlay(${i})"><img src="../assets/svg/delete.svg" alt="arrow"></button>
        </div>
      </div>

      <div class="dnone dpf_cc sp_between containerEditSubtask" id="containerEditSubtaskEditOverlay-${i}">
        <input id="editInputSubtaskEditOverlay-${i}" class="stylingInput" value="${subtaskTitle}">
        <div class="dpf_cc">
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="clearEditSubtaskEditOverlay(${i})"><img src="../assets/svg/delete.svg" alt="pancel"></button>
          <div class="sepraratorSubtask"></div>
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="addEditSubtaskEditOverlay(${i})"><img src="../assets/svg/check.svg" alt="arrow"></button>
        </div>
      </div>`;
  }
}

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
    if (e.relatedTarget && containerEditSubtask.contains(e.relatedTarget)) {
      return;
    }
    cancelEditSubtaskEditOverlay(i);
  };
}

function cancelEditSubtaskEditOverlay(i) {
  const taskOutput = document.getElementById(`taskOutputEditOverlay-${i}`);
  const container = document.getElementById(`containerEditSubtaskEditOverlay-${i}`);

  container.classList.add("dnone");
  taskOutput.classList.remove("dnone");
}

function deleteTaskEditOverlay(i) {
  const subtaskArray = getSubtasksArray(SingleCARD[0].subtask);
  const addSubtask = document.getElementById("overlayEditSubtask");
  
  subtaskArray.splice(i, 1);
  SingleCARD[0].subtask = subtaskArray;
  
  subtaskEditOverlay(addSubtask, subtaskArray);
}

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

//Edit Overlay Ok-Button
async function saveEditedCardToFirebase() {
  const cardId = SingleCARD[0].id;
  const title = document.getElementById("overlayEditTitle").value;
  const description = document.getElementById("overlayEditDescription").value;
  const date = document.getElementById("duedateOverlayEdit").value;
  
  const selectedContacts = getSelectedContactsFromOverlay();
  
  const updatedCard = {
    title: title,
    description: description,
    date: date,
    priority: selectedPriority,
    contact: selectedContacts,
    subtask: SingleCARD[0].subtask,
    category: SingleCARD[0].category,
    dragclass: SingleCARD[0].dragclass
  };

  try {
    const url = `${BASE_URL}addTask/${cardId}.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard)
    });
    
    toggleOverlay();
    location.reload();
  } catch (error) {
    console.error('Fehler beim Speichern:', error);
  }
}
