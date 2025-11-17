const URGENT  = '../assets/svg/priority_symblos/urgent.svg';
const MEDIUM  = '../assets/svg/priority_symblos/medium.svg';
const LOW  = '../assets/svg/priority_symblos/low.svg';

function openOverlay(cardId) {
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
      <div id="overlayAssignToContact" class="overlay_card_assigned_to_layout"></div>
    </div>

    <div class="overlay_card_subtasks_container">
      <span>Subtasks</span>
      <div id="overlaySubtask" class="overlay_card_subtask_layout"></div>
    </div>

    <div class="overlay_card_footer">
        <img src="../assets/svg/delete.svg"> Delete
        <div class="overlay_card_footer_seperator"></div>
        <img src="../assets/svg/edit.svg"> Edit
    </div>
  `;
}

function showOverlayAssignToContacts(CARD) {
  const OVERLAY_CONTACT = document.getElementById('overlayAssignToContact');
  if (!OVERLAY_CONTACT) 
    return;
  
  const CONTACTS = Array.isArray(CARD.contact) ? CARD.contact : [];
  OVERLAY_CONTACT.innerHTML = '';
  
  if (CONTACTS.length === 0) 
  return;

  CONTACTS.forEach(contact => {
    OVERLAY_CONTACT.innerHTML += `
      <div>
        <div id="overlayCardContact">
          <img src="../assets/img/profile_badges/anja_schulze.png" alt=""> ${contact.name}
        </div>
      </div>
    `;
  });
}

function showOverlaySubtasks(CARD) {
  const OVERLAY_SUBTASK = document.getElementById('overlaySubtask');
  if (!OVERLAY_SUBTASK) return;
  
  const SUBTASKS = getSubtasksArray(CARD.subtask);
  OVERLAY_SUBTASK.innerHTML = '';
  
  if (SUBTASKS.length === 0) return;

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
    const url = `${BASE_URL}addTask/${cardId}.json`;
    await fetch(url, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subtask: subtasks })
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