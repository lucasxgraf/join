let cardFromFirebase = [];
let dragElementId = "";
// const BASE_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/";

function initBoard() {
    loadTasks()
    renderInHtml();

}

// function renderCardinBoard() {
//     const TodoRef = document.getElementById("todo");
    
//     for (let i = 0; i < cardFromFirebase.length; i++) {
//         TodoRef.innerHTML +=  renderCard(i);      
//     }
// }

function renderCard(element) {
  const SUBTASKS = getSubtasksArray(element.subtask);
  const TOTAL = SUBTASKS.length;
  const DONE = calcCompleted(SUBTASKS);
  const PROGRESS = calcProgress(SUBTASKS);

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
          <div class="subtask">${DONE}/${TOTAL} Subtask</div>
        </div>
        <div class="cardFooter">
          <div class="contact" id="cardContact"><img src="../assets/img/profile_badges/anja_schulze.png" alt=""></div>
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

function forLoopCards(ref, array , placeholdertext) {

      ref.innerHTML = '';
    for (let index = 0; index < array.length; index++) {
        const element = array[index]
        ref.innerHTML += renderCard(element);
    }
    if (array.length <= 0) {
    ref.innerHTML = `<div class="placeholderDragContainer">${placeholdertext}</div>`} 
}


// function für die todo in Progress
function updateHTMLToDo(cardFromFirebase) {
    let todoArray = cardFromFirebase.filter(d => d['dragclass'] === "todo");
    const todoRef = document.getElementById("todo");

    // todoRef.innerHTML = '';
    // for (let index = 0; index < todoArray.length; index++) {
    //     const element = todoArray[index]
    //     todoRef.innerHTML += renderCard(element);
    // }
    forLoopCards(todoRef, todoArray, "No tasks To Do")
    // if (todoArray.length <= 0) {
    // todoRef.innerHTML = '<div class="placeholderDragContainer">No tasks To Do</div>'} 
    
}
// function für die Category in Progress
function updateHTMLInProgress(cardFromFirebase) {
    let inprogressArray = cardFromFirebase.filter(d => d['dragclass'] === "inprogress");
    const inprogressRef = document.getElementById("inProgress");

  //   inprogressRef.innerHTML = '';
  //   for (let index = 0; index < inprogressArray.length; index++) {
  //       const element = inprogressArray[index]
  //       inprogressRef.innerHTML += renderCard(element);
  //  } 

    forLoopCards(inprogressRef, inprogressArray, "No tasks In Progress")
    // if (inprogressArray.length <= 0) {
    // inprogressRef.innerHTML = '<div class="placeholderDragContainer">No tasks In Progress</div>'} 
}

function updateHTMLawaitFeedback(cardFromFirebase) {
    let awaitFeedbackArray = cardFromFirebase.filter(d => d['dragclass'] === "awaitfeedback");
    const awaitFeedbackArrayRef = document.getElementById("awaitFeedback");
    forLoopCards(awaitFeedbackArrayRef, awaitFeedbackArray, "No tasks Await Feedback")

    // awaitFeedbackArrayRef.innerHTML = '';
    // for (let index = 0; index < awaitFeedbackArray.length; index++) {
    //     const element = awaitFeedbackArray[index]
    //     awaitFeedback.innerHTML += renderCard(element);}
    // if (awaitFeedbackArray.length <= 0) {
      
    // awaitFeedback.innerHTML = '<div class="placeholderDragContainer">No tasks Await Feedback</div>'}
}

// function für die Category in Progress
function updateHTMLDone(cardFromFirebase) {
    let doneArray = cardFromFirebase.filter(d => d['dragclass'] === "done");
    const donesRef = document.getElementById("done");
    forLoopCards(donesRef, doneArray, "No tasks To Do")

  //   donesRef.innerHTML = '';
  //   for (let index = 0; index < doneArray.length; index++) {
  //       const element = doneArray[index]
  //       donesRef.innerHTML += renderCard(element);
  // //  }  
  //  if (doneArray.length <= 0) {
  //   donesRef.innerHTML = '<div class="placeholderDragContainer">No tasks To Do</div>'
  //  }
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

      const dialog = document.getElementById("addTaskDialog");
      dialog.showModal();
  //   document.getElementById("addTaskDialog").showModal();
  //     dialog.addEventListener("click", e => {
  //   if (e.target === dialog) 
  //   dialog.close();


  dialog.dataset.dragclass = targetDragClass;
  // });
}

function  closeDialog(){
    const dialog = document.getElementById("addTaskDialog");
    clearInput()
    dialog.close();
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