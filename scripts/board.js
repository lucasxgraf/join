let cardFromFirebase = [];
let dragElementId = "";
const BASE_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/";

function initBoard() {
    loadTasks()
}

// function renderCardinBoard() {
//     const TodoRef = document.getElementById("todo");
    
//     for (let i = 0; i < cardFromFirebase.length; i++) {
//         TodoRef.innerHTML +=  renderCard(i);      
//     }
// }

function renderCard (element) {
  return`
    <div class="card" draggable="true" ondragstart="startDrag('${element.id}')" onclick="openOverlay('${element.id}')">
      <div class="cardBorder"> 
        <div class="card_category ${element.category.toLowerCase().replace(/\s+/g,'_')}" id="cardCategrory">${element.category}
        </div>
        <div class="card_content">
            <div class="card_title" id="cardTitle">${element.title}?
            </div>
        <div class="card_description" id="cardDescription">${element.description}
        </div>
      </div>
      <div class="subtask_container">
        <div class="subtaskProgressBar">
          <div class="subtaskProgressBarCalc">
          </div>
        </div>
        <div class="subtask">1/${element.subtask.length} Subtastk
        </div>
      </div>
      <div class="cardFooter">
        <div class="contact" id="cardContact"><img src="../assets/img/profile_badges/anja_schulze.png" alt="">
        </div>
        <div class="priorität" id="cardPriorität"><img src="../assets/svg/priority_symblos/low.svg" alt="">
        </div>
      </div>
    </div>
  `
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
     updateHTML(cardFromFirebase)
     updateHTMLInProgress(cardFromFirebase)
     updateHTMLDone(cardFromFirebase)
     updateHTMLawaitFeedback(cardFromFirebase) 

}
// function für die todo in Progress
function updateHTML(cardFromFirebase) {
    let todoArray = cardFromFirebase.filter(d => d['dragclass'] === "todo");
    const todoRef = document.getElementById("todo");

    todoRef.innerHTML = '';
    for (let index = 0; index < todoArray.length; index++) {
        const element = todoArray[index]
        todoRef.innerHTML += renderCard(element);
    }
    if (todoArray.length <= 0) {
    todoRef.innerHTML = '<div class="placeholderDragContainer">No tasks To Do</div>'} 
    
}
// function für die Category in Progress
function updateHTMLInProgress(cardFromFirebase) {
    let inprogressArray = cardFromFirebase.filter(d => d['dragclass'] === "inprogress");
    const inprogressRef = document.getElementById("inProgress");

    inprogressRef.innerHTML = '';
    for (let index = 0; index < inprogressArray.length; index++) {
        const element = inprogressArray[index]
        inprogressRef.innerHTML += renderCard(element);
   } 
    if (inprogressArray.length <= 0) {
    inprogressRef.innerHTML = '<div class="placeholderDragContainer">No tasks In Progress</div>'} 
}

function updateHTMLawaitFeedback(cardFromFirebase) {
    let awaitFeedbackArray = cardFromFirebase.filter(d => d['dragclass'] === "awaitfeedback");
    const awaitFeedbackArrayRef = document.getElementById("awaitFeedback");

    awaitFeedbackArrayRef.innerHTML = '';
    for (let index = 0; index < awaitFeedbackArray.length; index++) {
        const element = awaitFeedbackArray[index]
        awaitFeedback.innerHTML += renderCard(element);}
    if (awaitFeedbackArray.length <= 0) {
    awaitFeedback.innerHTML = '<div class="placeholderDragContainer">No tasks Await Feedback</div>'}
}

// function für die Category in Progress
function updateHTMLDone(cardFromFirebase) {
    let doneArray = cardFromFirebase.filter(d => d['dragclass'] === "done");
    const donesRef = document.getElementById("done");

    donesRef.innerHTML = '';
    for (let index = 0; index < doneArray.length; index++) {
        const element = doneArray[index]
        donesRef.innerHTML += renderCard(element);
   }  
   if (doneArray.length <= 0) {
    donesRef.innerHTML = '<div class="placeholderDragContainer">No tasks To Do</div>'
   }
}

function dragoverHandler(ev) {
  ev.preventDefault();
}

function startDrag(id) {
    dragElementId = id;  
}

function moveTo(newdragclass) {
    const task = cardFromFirebase.find(t => t.id === dragElementId);
  
    task.dragclass = newdragclass;
    loadDetails(cardFromFirebase)
}