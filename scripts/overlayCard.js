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
    `;}
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
      await loadTasks("board");
    }
    return;
  }
  await deleteTaskFromFirebase(CARD_ID);
  showDeleteToast();
  toggleOverlay();
  await loadTasks("board");
}

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


function disableCurrentOverlay() {
  const OVERLAY = document.getElementById('overlay');
  if (!OVERLAY) 
    return;
  OVERLAY.classList.add('d_none');
}

function validateEditedForm(dateInputId) {
  const dateInput = document.getElementById(dateInputId);
  const dateError = document.getElementById('dateErrorEditOverlay');
  const dateWrapper = document.getElementById('dateOverlayEdit');
  const titleInput = document.getElementById('overlayEditTitle');
  const titleError = document.getElementById('titleErrorEditOverlay');

  let isValid = true;

  if (titleInput.value.trim() === "") {
    titleError.innerHTML = "This field is required.";
    titleInput.classList.add('errorBorder');
    isValid = false;
  } else {
    titleError.innerHTML = "";
    titleInput.classList.remove('errorBorder');
  }

  if (dateInput.value.trim() === "") {
    dateError.innerHTML = "This field is required.";
    dateWrapper.classList.add('errorBorder');
    isValid = false;
  } else {
    dateError.innerHTML = "";
    dateWrapper.classList.remove('errorBorder');
  }
  return isValid;
}

function selectContactsOverlayEdit(i, checkbox) {
  const contact = contactFromFirebase[i];
  const PlaceholderRef = document.getElementById("selectedAssignedEditOverlay")
  if (checkbox.checked) {
    const badge = document.createElement('div');
    badge.className = 'iconConact dpf_cc';
    badge.style.backgroundColor = contact.color;
    badge.innerHTML = `<span>${contact.name.firstname.slice(0, 1)}${contact.name.secondname.slice(0, 1)}</span>`;
    badge.dataset.userId = contact.userid;
    contactBadge.push(badge);
    PlaceholderRef.value = "Select contacts to assign";   

  } else {
    contactBadge = contactBadge.filter(b => b.dataset.userId !== contact.userid);
    PlaceholderRef.value = "";   
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

function validateEditedForm() {
  clearErrors();
  let isValid = true;

  const titleInput = document.getElementById('overlayEditTitle');
  if (titleInput.value.trim() === "") {
    showError('titleErrorEditOverlay', "This field is required.");
    titleInput.classList.add('errorBorder');
    isValid = false;
  } else {
    titleInput.classList.remove('errorBorder');
  }

  if (!validateDueDate("duedateOverlayEdit", "dateErrorEditOverlay", "dateOverlayEdit")) {
    isValid = false;
  }
  return isValid;
}

function checkEditOverlayInput() {
  let button = document.getElementById ("submitEditOverlay")
  let titleInput = document.getElementById("overlayEditTitle").value.trim();
  let dueDate = document.getElementById("duedateOverlayEdit").value.trim();
  const allFilled = titleInput && dueDate
  if (allFilled) {
    button.disabled = false
  }
  else{
    button.disabled = true
  }
}
  
function filterDateInput(id) {
  let input = document.getElementById(id);
  if (!input) return;
  else{
  input.value = input.value.replace(/[^0-9\/]/g, "");
  return true
  } 
}