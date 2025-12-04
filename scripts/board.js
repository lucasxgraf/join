let cardFromFirebase = [];
let dragElementId = "";
let contacts_from_firebase = {};
let currentPlaceholder = null;
let clonedCard = null;
let longPressTimer = null;
let touchStartPos = null;
let isSwapOpen = false;

async function initBoard() {
    getInitialsFromUser()
    await loadContacts();
    await loadTasks("board");
    renderInHtml();
    fetchContact();
}

function loadDetails(cardFromFirebase) {
     updateHTMLToDo(cardFromFirebase)
     updateHTMLInProgress(cardFromFirebase)
     updateHTMLDone(cardFromFirebase)
     updateHTMLawaitFeedback(cardFromFirebase) 
}

function forLoopCards(ref, array , placeholdertext) {

      ref.innerHTML = '';
    for (let index = 0; index < array.length; index++) {
        const ELEMENT = array[index]
        ref.innerHTML += renderCard(ELEMENT);
    }
    if (array.length <= 0) {
    ref.innerHTML = `<div class="placeholderDragContainer">${placeholdertext}</div>`} 
}

function updateHTMLToDo(cardFromFirebase) {
    let todoArray = cardFromFirebase.filter(d => d['dragclass'] === "todo");
    const TODO_REF = document.getElementById("todo");
    forLoopCards(TODO_REF, todoArray, "No tasks To Do") 
}

function updateHTMLInProgress(cardFromFirebase) {
    let inprogressArray = cardFromFirebase.filter(d => d['dragclass'] === "inprogress");
    const INPROGRESS_REF = document.getElementById("inprogress");
    forLoopCards(INPROGRESS_REF, inprogressArray, "No tasks In Progress")
}

function updateHTMLawaitFeedback(cardFromFirebase) {
    let awaitFeedbackArray = cardFromFirebase.filter(d => d['dragclass'] === "awaitfeedback");
    const AWAIT_FEEDBACK_REF = document.getElementById("awaitfeedback");
    forLoopCards(AWAIT_FEEDBACK_REF, awaitFeedbackArray, "No tasks Await Feedback")

}

function updateHTMLDone(cardFromFirebase) {
    let doneArray = cardFromFirebase.filter(d => d['dragclass'] === "done");
    const DONE_REF = document.getElementById("done");
    forLoopCards(DONE_REF, doneArray, "No tasks To Do")
}

function removePlaceholder() {
  if (currentPlaceholder) {
    currentPlaceholder.remove();
    currentPlaceholder = null;
  }
  
  document.querySelectorAll('.singleDragContainer').forEach(container => {
    const textPlaceholder = container.querySelector('.placeholderDragContainer');
    if (textPlaceholder) {
      textPlaceholder.style.display = '';
    }
  });
}

function createPlaceholderPreview(container) {
  const existingPlaceholder = container.querySelector('#drag-placeholder');
  
  if (!existingPlaceholder) {
    const placeholderPreview = document.createElement('div');
    placeholderPreview.className = 'card-placeholder';
    placeholderPreview.id = 'drag-placeholder';
    
    const textPlaceholder = container.querySelector('.placeholderDragContainer');
    if (textPlaceholder) {
      textPlaceholder.classList.add('d_none');
    } 
    
    container.appendChild(placeholderPreview);
    currentPlaceholder = placeholderPreview;
  }
}

function dragoverHandler(ev) {
  ev.preventDefault();
  const container = ev.currentTarget;

  if (!currentPlaceholder || currentPlaceholder.parentNode !== container) {
    removePlaceholder();
  }

  createPlaceholderPreview(container);
}

function startDrag(id) {
    dragElementId = id;
    const ELEMENT = document.querySelector(`[ondragstart*="${id}"]`);
    if (ELEMENT) {
      ELEMENT.classList.add('dragging');
    }
}

function stopDrag(id) {
  const ELEMENT = document.querySelector(`[ondragstart*="${id}"]`);
  if (ELEMENT) {
    ELEMENT.classList.remove('dragging');
  }
  removePlaceholder();
}

function showDialog(targetDragClass) {

  if (isSwapOpen) return;
    changePriority("medium", "AddTask")
    fetchSVGs("AddTask");
    addTaskButton();
    addSubtask();
    enterSubtask();
    enableSubmit();

    const OVERLAY = document.getElementById("addTaskOverlay");
    const DIALOG = document.getElementById("addTaskDialog");
    DIALOG.dataset.dragclass = targetDragClass;

    OVERLAY.classList.toggle("dnone");

      setTimeout(() => {
        DIALOG.classList.add("show");
      }, 10);
}

function closeDialog() {
  const OVERLAY = document.getElementById("addTaskOverlay");
  const DIALOG = document.getElementById("addTaskDialog");

  DIALOG.classList.toggle("show");
  OVERLAY.classList.toggle("dnone");

  clearInput();
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
  if (!contact_array || contact_array.length === 0) {
    return '<div class="no_contacts">No contacts assigned</div>';
  }

  const MAX_VISIBLE = 3;
  let html = '';

  for (let i = 0; i < Math.min(contact_array.length, MAX_VISIBLE); i++) {
    const CONTACT_ENTRY = contact_array[i];
    const CONTACT_ID = CONTACT_ENTRY.id;
    const CONTACT_DATA = contacts_from_firebase[CONTACT_ID];

    if (!CONTACT_DATA) continue;

    const INITIALS = getInitials(CONTACT_DATA.name);
    const COLOR = CONTACT_DATA.color || '#2a3647';

    html += `
      <div class="contact_badge" style="background-color:${COLOR}">
        ${INITIALS}
      </div>
    `;
  }

  if (contact_array.length > MAX_VISIBLE) {
    const REMAINING = contact_array.length - MAX_VISIBLE;
    html += `
      <div class="contact_badge contact_badge_more">
        +${REMAINING}
      </div>
    `;
  }

  return html;
}

function handleTouchStart(e, id) {
const LONG_PRESS_DURATION = 500;
  const touch = e.touches[0];
  touchStartPos = { x: touch.clientX, y: touch.clientY };
  
  longPressTimer = setTimeout(() => {
    e.preventDefault();
    startDrag(id);
    createMobileClone(e.target.closest('.card'));
  }, LONG_PRESS_DURATION);
}

function createMobileClone(card) {
  const rect = card.getBoundingClientRect();
  
  clonedCard = card.cloneNode(true);
  clonedCard.classList.add('mobile-clone');
  clonedCard.style.width = card.offsetWidth + 'px';
  clonedCard.style.left = rect.left + 'px';
  clonedCard.style.top = rect.top + 'px';
  document.body.appendChild(clonedCard);
  
  card.classList.add('card-dragging');
}

function handleTouchMove(e, id) {
  e.preventDefault();
  if (!clonedCard) return;
  
  const touch = e.touches[0];
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const container = elements.find(el => el.classList.contains('singleDragContainer'));
  
  clonedCard.style.left = (touch.clientX - 0) + 'px';
  clonedCard.style.top = (touch.clientY - 0) + 'px';
  
  if (container) {
    dragoverHandler({ preventDefault: () => {}, currentTarget: container });
  }
}

function handleTouchEnd(e, id) {
  clearTimeout(longPressTimer);
  longPressTimer = null;
  
  if (!clonedCard) return;
  
  e.preventDefault();
  
  const touch = e.changedTouches[0];
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const container = elements.find(el => el.classList.contains('singleDragContainer'));
  
  if (container && container.id) {
    moveTo(container.id);
  }
  
  cleanupMobileDrag();
  stopDrag(id);
}

function cleanupMobileDrag() {
  if (clonedCard) {
    clonedCard.remove();
    clonedCard = null;
  }
  
  const card = document.querySelector(`[ondragstart*="${dragElementId}"]`);
  if (dragElementId) {
    if (card) {
      card.classList.remove('card-dragging');
    }
  }
  dragElementId = null;
}

function toggleSwapCategory(event, taskId) {
  event.stopPropagation();
  const card = event.currentTarget.closest('.card');
  const dropdown = card.querySelector('.swap-dropdown');
  
  if (dropdown) {
    dropdown.remove();
    isSwapOpen = false;
    return;
  }
  
  createSwapDropdown(card, taskId);
}

function createSwapDropdown(card, taskId) {
  closeAllSwapDropdowns();
  const task = cardFromFirebase.find(t => t.id === taskId);
  const dropdown = document.createElement('div');
  dropdown.className = 'swap-dropdown';
  dropdown.innerHTML = renderSwapDropDown(taskId, task?.dragclass);
  card.appendChild(dropdown);
  isSwapOpen = true;
  setupDropdownClickOutside(dropdown, card.querySelector('.card_header_swap_icon'));
}

function setupDropdownClickOutside(dropdown, button) {
  const handleClickOutside = (e) => {
    if (!dropdown.contains(e.target) && !button.contains(e.target)) {
      dropdown.remove();
      isSwapOpen = false;
      document.removeEventListener('click', handleClickOutside);
    }
  };
  setTimeout(() => document.addEventListener('click', handleClickOutside), 0);
}

function closeAllSwapDropdowns() {
  document.querySelectorAll('.swap-dropdown').forEach(dropdown => dropdown.remove());
  isSwapOpen = false;
}

async function swapToColumn(event, taskId, newDragClass) {
  event.stopPropagation();
  dragElementId = taskId;
  await moveTo(newDragClass);
  closeAllSwapDropdowns();
}