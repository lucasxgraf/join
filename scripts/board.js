let cardFromFirebase = [];
let dragElementId = "";
let contacts_from_firebase = {};

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
  const contacts_html = renderContactBadges(element.contact || []);


  return `
    <div class="card" draggable="true" ondragstart="startDrag('${element.id}')" ondragend="stopDrag('${element.id}')" onclick="openOverlay('${element.id}')">
      <div class="cardBorder"> 
        <div class="card_category ${element.category.toLowerCase().replace(/\s+/g,'_')}" id="cardCategrory">${element.category}</div>
        <div class="card_content">
          <div class="card_title" id="cardTitle">${element.title}</div>
          <div class="card_description" id="cardDescription">${element.description}</div>
        </div>
        <div class="subtask_container">
          <div class="subtaskProgressBar">
            <div class="subtaskProgressBarCalc" style="width:${PROGRESS}%"></div>
          </div>
          <div class="subtask">${DONE}/${TOTAL} Subtasks</div>
        </div>
        <div class="cardFooter">
          <div class="contact_badges" id="cardContact">
            ${contacts_html}
          </div>
          <div class="overlay_card_priority_img overlay_card_priority_img_${(element.priority||'').toLowerCase()}"></div>
      </div>
      </div>
    </div>
  `;
}

async function loadTasks() {
  try {
    const response = await fetch(`${BASE_URL}addTask.json`); // .json für Firebase-Endpunkt
    const data = await response.json();
    
    // Firebase gibt Objekte zurück → in Array umwandeln
    if (data) {
      cardFromFirebase = Object.entries(data).map(([id, task]) => ({
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
    const response = await fetch(`${BASE_URL}contacts/contactlist.json`);
    const data = await response.json();
    if (data) {
      contacts_from_firebase = data;
    }
  } catch (error) {
    console.error('fehler beim laden der kontakte:', error);
  }
}

function forLoopCards(ref, array , placeholdertext) {

      ref.innerHTML = '';
    for (let index = 0; index < array.length; index++) {
        const element = array[index]
        ref.innerHTML += renderCard(element);
    }
    if (array.length <= 0) {
    ref.innerHTML = `<div class="placeholderDragContainer">${placeholdertext}</div>`} 
}

function updateHTMLToDo(cardFromFirebase) {
    let todoArray = cardFromFirebase.filter(d => d['dragclass'] === "todo");
    const todoRef = document.getElementById("todo");
    forLoopCards(todoRef, todoArray, "No tasks To Do") 
}

function updateHTMLInProgress(cardFromFirebase) {
    let inprogressArray = cardFromFirebase.filter(d => d['dragclass'] === "inprogress");
    const inprogressRef = document.getElementById("inProgress");
    forLoopCards(inprogressRef, inprogressArray, "No tasks In Progress")
}

function updateHTMLawaitFeedback(cardFromFirebase) {
    let awaitFeedbackArray = cardFromFirebase.filter(d => d['dragclass'] === "awaitfeedback");
    const awaitFeedbackArrayRef = document.getElementById("awaitFeedback");
    forLoopCards(awaitFeedbackArrayRef, awaitFeedbackArray, "No tasks Await Feedback")

}

function updateHTMLDone(cardFromFirebase) {
    let doneArray = cardFromFirebase.filter(d => d['dragclass'] === "done");
    const donesRef = document.getElementById("done");
    forLoopCards(donesRef, doneArray, "No tasks To Do")
}

function dragoverHandler(ev) {
  ev.preventDefault();
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
}

function moveTo(newdragclass) {
    const task = cardFromFirebase.find(t => t.id === dragElementId);
  
    task.dragclass = newdragclass;
    loadDetails(cardFromFirebase)
}

function showDialog(targetDragClass) {
    fetchSVGs();
    addTaskButton();
    addSubtask();
    enterSubtask();
    enableSubmit();
    fetchContact();

const overlay = document.getElementById("addTaskOverlay");
const dialog = document.getElementById("addTaskDialog");
dialog.dataset.dragclass = targetDragClass;

overlay.classList.toggle("dnone");

  setTimeout(() => {
    dialog.classList.add("show");
  }, 10);
}

function closeDialog() {
  const overlay = document.getElementById("addTaskOverlay");
  const dialog = document.getElementById("addTaskDialog");

  dialog.classList.toggle("show");
  overlay.classList.toggle("dnone");


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
  const first = name_obj.firstname || '';
  const second = name_obj.secondname || '';
  if (!first && !second) return '??';
  return `${first[0] || ''}${second[0] || ''}`.toUpperCase();
}

function renderContactBadges(contact_array) {
  if (!contact_array || contact_array.length === 0) {
    return '<div class="no_contacts">No contacts assigned</div>';
  }

  const max_visible = 3;
  let html = '';

  for (let i = 0; i < Math.min(contact_array.length, max_visible); i++) {
    const contact_entry = contact_array[i];
    const contact_id = contact_entry.id;
    const contact_data = contacts_from_firebase[contact_id];

    if (!contact_data) continue;

    const initials = getInitials(contact_data.name);
    const color = contact_data.color || '#2a3647';

    html += `
      <div class="contact_badge" style="background-color:${color}">
        ${initials}
      </div>
    `;
  }

  if (contact_array.length > max_visible) {
    const remaining = contact_array.length - max_visible;
    html += `
      <div class="contact_badge contact_badge_more">
        +${remaining}
      </div>
    `;
  }

  return html;
}