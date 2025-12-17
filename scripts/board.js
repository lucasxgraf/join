/**
 * @fileoverview Board functionality for task management with drag and drop
 * @description Handles task board initialization, drag and drop operations, mobile touch events, and task status updates
 */

let cardFromFirebase = [];
let dragElementId = "";
let contacts_from_firebase = {};
let currentPlaceholder = null;
let clonedCard = null;
let longPressTimer = null;
let touchStartPos = null;
let isSwapOpen = false;

/**
 * Initializes the board by loading user data, contacts, and tasks
 */
async function initBoard() {
    getInitialsFromUser()
    await loadContacts();
    await loadTasks("board");
    renderInHtml();
    fetchContact();
}

/**
 * Updates all task columns with current data from Firebase
 * @param {Array} cardFromFirebase - Array of task cards from Firebase
 */
function loadDetails(cardFromFirebase) {
     updateHTMLToDo(cardFromFirebase)
     updateHTMLInProgress(cardFromFirebase)
     updateHTMLDone(cardFromFirebase)
     updateHTMLawaitFeedback(cardFromFirebase) 
}

/**
 * Renders cards in a container or displays placeholder text if empty
 * @param {HTMLElement} ref - The container element to render cards into
 * @param {Array} array - Array of card objects to render
 * @param {string} placeholdertext - Text to display when no cards exist
 */
function forLoopCards(ref, array , placeholdertext) {

      ref.innerHTML = '';
    for (let index = 0; index < array.length; index++) {
        const ELEMENT = array[index]
        ref.innerHTML += renderCard(ELEMENT);
    }
    if (array.length <= 0) {
    ref.innerHTML = `<div class="placeholderDragContainer">${placeholdertext}</div>`} 
}

/**
 * Updates the "To Do" column with filtered tasks
 * @param {Array} cardFromFirebase - Array of all task cards
 */
function updateHTMLToDo(cardFromFirebase) {
    let todoArray = cardFromFirebase.filter(d => d['dragclass'] === "todo");
    const TODO_REF = document.getElementById("todo");
    forLoopCards(TODO_REF, todoArray, "No tasks To Do") 
}

/**
 * Updates the "In Progress" column with filtered tasks
 * @param {Array} cardFromFirebase - Array of all task cards
 */
function updateHTMLInProgress(cardFromFirebase) {
    let inprogressArray = cardFromFirebase.filter(d => d['dragclass'] === "inprogress");
    const INPROGRESS_REF = document.getElementById("inprogress");
    forLoopCards(INPROGRESS_REF, inprogressArray, "No tasks In Progress")
}

/**
 * Updates the "Await Feedback" column with filtered tasks
 * @param {Array} cardFromFirebase - Array of all task cards
 */
function updateHTMLawaitFeedback(cardFromFirebase) {
    let awaitFeedbackArray = cardFromFirebase.filter(d => d['dragclass'] === "awaitfeedback");
    const AWAIT_FEEDBACK_REF = document.getElementById("awaitfeedback");
    forLoopCards(AWAIT_FEEDBACK_REF, awaitFeedbackArray, "No tasks Await Feedback")

}

/**
 * Updates the "Done" column with filtered tasks
 * @param {Array} cardFromFirebase - Array of all task cards
 */
function updateHTMLDone(cardFromFirebase) {
    let doneArray = cardFromFirebase.filter(d => d['dragclass'] === "done");
    const DONE_REF = document.getElementById("done");
    forLoopCards(DONE_REF, doneArray, "No tasks To Do")
}

/**
 * Removes the drag placeholder and restores text placeholders
 */
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

/**
 * Creates a visual placeholder in the target container during drag
 * @param {HTMLElement} container - The container to add the placeholder to
 */
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

/**
 * Handles dragover event to show placeholder in target container
 * @param {DragEvent} ev - The dragover event
 */
function dragoverHandler(ev) {
  ev.preventDefault();
  const container = ev.currentTarget;

  if (!currentPlaceholder || currentPlaceholder.parentNode !== container) {
    removePlaceholder();
  }

  createPlaceholderPreview(container);
}

/**
 * Initiates drag operation and adds dragging class to element
 * @param {string} id - The ID of the task being dragged
 */
function startDrag(id) {
  dragElementId = id;
  const ELEMENT = document.querySelector(`[ondragstart*="${id}"]`);
  if (ELEMENT) {
    ELEMENT.classList.add('dragging');
  }
}

/**
 * Ends drag operation and removes dragging class from element
 * @param {string} id - The ID of the task being dragged
 */
function stopDrag(id) {
  const ELEMENT = document.querySelector(`[ondragstart*="${id}"]`);
  if (ELEMENT) {
    ELEMENT.classList.remove('dragging');
  }
  removePlaceholder();
}

/**
 * Synchronizes dialog state for adding new tasks
 */
function syncforDialog() {
  changePriority("medium", "AddTask")
  fetchSVGs("AddTask");
  addTaskButton();
  addSubtask();
  enterSubtask();
  enableSubmit();
}

/**
 * Opens the add task dialog with specified drag class
 * @param {string} targetDragClass - The target column class for the new task
 */
function showDialog(targetDragClass) {

  if (isSwapOpen) return;
  syncforDialog()

  const OVERLAY = document.getElementById("addTaskOverlay");
  const DIALOG = document.getElementById("addTaskDialog");
  DIALOG.dataset.dragclass = targetDragClass;

  OVERLAY.classList.toggle("dnone");

  setTimeout(() => {
    DIALOG.classList.add("show");
  }, 10);
}

/**
 * Closes the add task dialog and clears input fields
 */
function closeDialog() {
  const OVERLAY = document.getElementById("addTaskOverlay");
  const DIALOG = document.getElementById("addTaskDialog");

  DIALOG.classList.toggle("show");
  OVERLAY.classList.toggle("dnone");

  clearInput();
}

/**
 * Handles touch start event for mobile drag and drop
 * @param {TouchEvent} e - The touch start event
 * @param {string} id - The ID of the task being touched
 */
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

/**
 * Creates a visual clone of the card for mobile dragging
 * @param {HTMLElement} card - The card element to clone
 */
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

/**
 * Handles touch move event to update clone position and show placeholder
 * @param {TouchEvent} e - The touch move event
 * @param {string} id - The ID of the task being moved
 */
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

/**
 * Handles touch end event to complete mobile drag operation
 * @param {TouchEvent} e - The touch end event
 * @param {string} id - The ID of the task being dropped
 */
function handleTouchEnd(e, id) {
  clearTimeout(longPressTimer);
  longPressTimer = null;
  if (!clonedCard) return;
  e.preventDefault();
  
  const touch = e.changedTouches[0];
  const elements = document.elementsFromPoint(touch.clientX, touch.clientY);
  const container = elements.find(el => el.classList.contains('singleDragContainer'));
  if (container && container.id) {
    moveTo(container.id);}

  cleanupMobileDrag();
  stopDrag(id);
};

/**
 * Cleans up mobile drag state and removes clone element
 */
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

/**
 * Toggles the category swap dropdown for a task card
 * @param {Event} event - The click event
 * @param {string} taskId - The ID of the task
 */
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

/**
 * Creates and displays the swap dropdown menu for a task card
 * @param {HTMLElement} card - The card element
 * @param {string} taskId - The ID of the task
 */
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

/**
 * Sets up click outside handler to close dropdown
 * @param {HTMLElement} dropdown - The dropdown element
 * @param {HTMLElement} button - The button that opened the dropdown
 */
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

/**
 * Closes all open swap dropdown menus
 */
function closeAllSwapDropdowns() {
  document.querySelectorAll('.swap-dropdown').forEach(dropdown => dropdown.remove());
  isSwapOpen = false;
}

/**
 * Swaps a task to a different column
 * @param {Event} event - The click event
 * @param {string} taskId - The ID of the task to move
 * @param {string} newDragClass - The target column class
 */
async function swapToColumn(event, taskId, newDragClass) {
  event.stopPropagation();
  dragElementId = taskId;
  await moveTo(newDragClass);
  closeAllSwapDropdowns();
}

/**
 * Handles dropdown clicks within dialog to prevent event propagation
 * @param {Event} event - The click event
 */
function handleDropdownClickInDialog(event) {
  const dropdown = document.querySelector('.custom-category-dropdown.open');
  if (!dropdown || dropdown.contains(event.target)) {
    event.stopPropagation();
  }
}