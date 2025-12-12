const URGENT  = '../assets/svg/priority_symblos/urgent.svg';
const MEDIUM  = '../assets/svg/priority_symblos/medium.svg';
const LOW  = '../assets/svg/priority_symblos/low.svg';
let SingleCARD = []

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
  
function filterDateInput(id) {
  let input = document.getElementById(id);
  if (!input) return;
  else{
  input.value = input.value.replace(/[^0-9\/]/g, "");
  return true
  } 
}