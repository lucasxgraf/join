let cardFromFirebase = [];
let dragElementId = "";
let contacts_from_firebase = {};
let currentPlaceholder = null;

async function initBoard() {
    await loadContacts();
    await loadTasks();
    renderInHtml();
}

function renderCard(element) {
  const SUBTASKS = getSubtasksArray(element.subtask);
  const TOTAL = SUBTASKS.length;
  const DONE = calcCompleted(SUBTASKS);
  const PROGRESS = calcProgress(SUBTASKS);
  const CONTACTS = renderContactBadges(element.contact || []);

  return `
    <div class="card" draggable="true" ondragstart="startDrag('${element.id}')" ondragend="stopDrag('${element.id}')" onclick="openOverlay('${element.id}')">
      <div class="cardBorder"> 
        <div class="card_category ${element.category.toLowerCase().replace(/\s+/g,'_')}" id="cardCategrory">${element.category}</div>
        <div class="card_content">
          <div class="card_title" id="cardTitle">${element.title}</div>
          <div class="card_description" id="cardDescription">${element.description}</div>
        </div>
        ${TOTAL > 0 ? `
        <div class="subtask_container">
          <div class="subtaskProgressBar">
            <div class="subtaskProgressBarCalc" style="width:${PROGRESS}%"></div>
          </div>
          <div class="subtask">${DONE}/${TOTAL} Subtasks</div>
        </div>
        ` : ''}
        <div class="cardFooter">
          <div class="contact_badges" id="cardContact">
            ${CONTACTS}
          </div>
          <div class="overlay_card_priority_img overlay_card_priority_img_${(element.priority||'').toLowerCase()}"></div>
      </div>
      </div>
    </div>
  `;
}

async function loadTasks() {
  try {
    const RESPONSE = await fetch(`${BASE_URL}addTask.json`); // .json für Firebase-Endpunkt
    const DATA = await RESPONSE.json();
    
    // Firebase gibt Objekte zurück → in Array umwandeln
    if (DATA) {
      cardFromFirebase = Object.entries(DATA).map(([id, task]) => ({
    id: id,
    ...task
  }));
      console.log("Task geladen:", cardFromFirebase);
    } else {
      console.warn("Keine Task gefunden.");
    }
  } catch (error) {
    console.error("Fehler beim Laden der Task:", error);
  }
 loadDetails(cardFromFirebase)
}

function loadDetails(cardFromFirebase) {
     updateHTMLToDo(cardFromFirebase)
     updateHTMLInProgress(cardFromFirebase)
     updateHTMLDone(cardFromFirebase)
     updateHTMLawaitFeedback(cardFromFirebase) 
}

async function loadContacts() {
  try {
    const RESPONSE = await fetch(`${BASE_URL}contacts/contactlist.json`);
    const DATA = await RESPONSE.json();
    if (DATA) {
      contacts_from_firebase = DATA;
    }
  } catch (error) {
    console.error('fehler beim laden der kontakte:', error);
  }
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
    const INPROGRESS_REF = document.getElementById("inProgress");
    forLoopCards(INPROGRESS_REF, inprogressArray, "No tasks In Progress")
}

function updateHTMLawaitFeedback(cardFromFirebase) {
    let awaitFeedbackArray = cardFromFirebase.filter(d => d['dragclass'] === "awaitfeedback");
    const AWAIT_FEEDBACK_REF = document.getElementById("awaitFeedback");
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

async function moveTo(newdragclass) {
  const task = cardFromFirebase.find(t => t.id === dragElementId);
  if (!task) return;
  
  task.dragclass = newdragclass;
  
  try {
      await fetch(`${BASE_URL}addTask/${dragElementId}/dragclass.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: `"${newdragclass}"`
      });
      loadDetails(cardFromFirebase);
  } catch (error) {
      console.error('Fehler beim Verschieben der Karte:', error);
  }
}

function showDialog(targetDragClass) {
    fetchSVGs("AddTask");
    addTaskButton();
    addSubtask();
    enterSubtask();
    enableSubmit();
    fetchContact();

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