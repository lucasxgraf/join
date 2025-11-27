
function inittest() {
    loadTasks("summary")
    greetingTime();
}

const today = new Date();
  const todo = [];
  const done = [];
  const inProgress = [];
  const awaitFeedback = [];
  let counter = 0;
  const urgentCards = [];
  let nearest = null;


function greetingTime() {
    let greeting = document.getElementById('timeGreeting');
    const hour = today.getHours();
    switch (true) {
        case (hour < 11):
        greeting.textContent = "Good Morning,"        
            break;
        case (hour < 18):
        greeting.textContent = "Good Afternoon,"        
            break;
        case (hour < 21):
        greeting.textContent = "Good Evening,"        
            break;
        case (hour < 4):
        greeting.textContent = "Good Night,"        
            break;
        default:
            greeting.textContent = "Good Morning,"
            break;
    }
}
function splitCardsByStatus(cards) {
  const statusMap = {
    todo: todo,
    done: done,
    inprogress: inProgress,
    awaitfeedback: awaitFeedback
  };
  cards.forEach(card => statusMap[card.dragclass]?.push(card));
  updateSummary(todo, done, inProgress, awaitFeedback);
}
function countUrgentPriority(cards) {
 const urgentRef = document.getElementById("urgentNumber")

  for (let card of cards) {          
    if (card.priority === "urgent") { 
      counter++;
      urgentCards.push(card);
    }}
    urgentRef.innerHTML = counter
    upcomingDeadline(urgentCards)
}

function upcomingDeadline(urgentCards) {
  const dateRef = document.getElementById("dateText");

 if (!urgentCards || urgentCards.length === 0) {
    dateRef.innerHTML = "No urgent tasks";
    return;
  }
  dateRef.innerHTML = calculationUpComingDeadline(urgentCards);
}

function calculationUpComingDeadline(urgentCards) {
  today.setHours(0,0,0,0);
  for (let card of urgentCards) {
    if (!card.date) continue;

    let parts = card.date.split("/");
    let dateObj = new Date(parts[2], parts[1] - 1, parts[0]);
    dateObj.setHours(0,0,0,0);

    if (nearest === null || dateObj.getTime() < nearest.getTime()) {
      nearest = dateObj;
    }}
   return howNearest(nearest, today)
}

function howNearest(nearest, today) {
    if (!nearest) return null;

  let day = nearest.getDate();
  let month = monthNames[nearest.getMonth()];
  let year = nearest.getFullYear();
  const dateString = `${month} ${day}, ${year}`
  const isPast = nearest.getTime() < today.getTime();

  if (isPast) {
    return `<span class="expired">${dateString}</span>`;
  } else {
    return `${dateString}`;
  }
}

function updateSummary(todo, done, inProgress, awaitFeedback) {
   const todoRef = document.getElementById("todoNumber")
   const doneRef = document.getElementById("doneNumber")
   const taskProgressNumberRef = document.getElementById("taskProgressNumber")
   const feedbackNumberRef = document.getElementById("feedbackNumber")
   const taskBoardNumberRef = document.getElementById("taskBoardNumber")
   
    todoRef.innerHTML = todo.length;
    doneRef.innerHTML = done.length;
    taskProgressNumberRef.innerHTML = inProgress.length;
    feedbackNumberRef.innerHTML = awaitFeedback.length;

    taskBoardNumberRef.innerHTML = awaitFeedback.length + inProgress.length + done.length + todo.length;
}

window.addEventListener("DOMContentLoaded", hoverTwoCardsEvent);
window.addEventListener("DOMContentLoaded", hoverlongCard);
window.addEventListener("DOMContentLoaded", resetlongCard);
window.addEventListener("DOMContentLoaded", hoverThreeCards);

function hoverTwoCardsEvent() {
let todoCard = document.getElementById('todoCard');
let doneCard = document.getElementById('doneCard');
    todoCard.addEventListener("mouseover", hoverCardsToDo)
    todoCard.addEventListener("mouseout", resetHoverToDo)
    doneCard.addEventListener("mouseover", hoverCardsDone)
    doneCard.addEventListener("mouseout", resetHoverDone)
}


function hoverCardsToDo() {
let info = document.getElementById('todoNumber');
let taskToDo = document.getElementById('taskToDo');
let icon = document.getElementById('iconToDo');

icon.src = "./assets/svg/pencil_hover.svg";
taskToDo.style.color = "white";
info.style.color = "white";
}

function hoverCardsDone() {
let number = document.getElementById('doneNumber');
let task = document.getElementById('taskDone');
let icon = document.getElementById('iconDone');

task.style.color = "white";
number.style.color = "white";
icon.src = "./assets/svg/check_hover.svg";
}

function resetHoverToDo() {
let info = document.getElementById('todoNumber');
let taskToDo = document.getElementById('taskToDo');
let icon = document.getElementById('iconToDo');

taskToDo.style.color = "#2A3647";
info.style.color = "#2A3647";
icon.src = "./assets/svg/pencil_default.svg";
}

function resetHoverDone() {
let task = document.getElementById('doneNumber');
let taskDone = document.getElementById('taskDone');
let icon = document.getElementById('iconDone');

taskDone.style.color = "#2A3647";
task.style.color = "#2A3647";
icon.src = "./assets/svg/check_default.svg";
}

function hoverlongCard() {
let longCard = document.getElementById('longCard');
let date = document.getElementById('dateText');
let subline = document.getElementById('dateSubline');
let number = document.getElementById('urgentNumber');
let task = document.getElementById('taskUrgent');
longCard.addEventListener('mouseover', function () {
    date.style.color = "white";
    subline.style.color = "white";
    number.style.color = "white";
    task.style.color = "white";
})
}

function resetlongCard() {
let longCard = document.getElementById('longCard');
let date = document.getElementById('dateText');
let subline = document.getElementById('dateSubline');
let number = document.getElementById('urgentNumber');
let task = document.getElementById('taskUrgent');
longCard.addEventListener('mouseout', function () {
    date.style.color = "#2A3647";
    subline.style.color = "#2A3647";
    number.style.color = "#2A3647";
    task.style.color = "#2A3647";
})
}

function hoverThreeCards() {
    let board = document.getElementById('taskBoard');
    let progress = document.getElementById('taskProgress');
    let feedbackAwait = document.getElementById('feedback');

    board.addEventListener("mouseover", boardHover);
    progress.addEventListener("mouseover", progressHover);
    feedbackAwait.addEventListener("mouseover", feedbackAwaitHover);
    board.addEventListener("mouseout", resetBoard);
    progress.addEventListener("mouseout", resetProgress);
    feedbackAwait.addEventListener("mouseout", resetfeedback);

}

function boardHover() {
    let number = document.getElementById('taskBoardNumber');
    let text = document.getElementById('taskBoardText');

    number.style.color = "white";
    text.style.color = "white";
}

function progressHover() {
    let number = document.getElementById('taskProgressNumber');
    let text = document.getElementById('taskProgressText');

    number.style.color = "white";
    text.style.color = "white";
}

function feedbackAwaitHover() {
    let number = document.getElementById('feedbackNumber');
    let text = document.getElementById('feedbackText');

    number.style.color = "white";
    text.style.color = "white";
}

function resetBoard() {
    let number = document.getElementById('taskBoardNumber');
    let text = document.getElementById('taskBoardText');

    number.style.color = "#2A3647";
    text.style.color = "#2A3647";
}

function resetProgress() {
    let number = document.getElementById('taskProgressNumber');
    let text = document.getElementById('taskProgressText');

    number.style.color = "#2A3647";
    text.style.color = "#2A3647";
}

function resetfeedback() {
    let number = document.getElementById('feedbackNumber');
    let text = document.getElementById('feedbackText');

    number.style.color = "#2A3647";
    text.style.color = "#2A3647";
}
window.addEventListener("DOMContentLoaded", hoverTwoCardsEvent);
window.addEventListener("DOMContentLoaded", hoverlongCard);
window.addEventListener("DOMContentLoaded", resetlongCard);
window.addEventListener("DOMContentLoaded", hoverThreeCards);

function hoverTwoCardsEvent() {
let todoCard = document.getElementById('todoCard');
let doneCard = document.getElementById('doneCard');
    todoCard.addEventListener("mouseover", hoverCardsToDo)
    todoCard.addEventListener("mouseout", resetHoverToDo)
    doneCard.addEventListener("mouseover", hoverCardsDone)
    doneCard.addEventListener("mouseout", resetHoverDone)
}


function hoverCardsToDo() {
let info = document.getElementById('todoNumber');
let taskToDo = document.getElementById('taskToDo');
let icon = document.getElementById('iconToDo');

icon.src = "./assets/svg/pencil_hover.svg";
taskToDo.style.color = "white";
info.style.color = "white";
}

function hoverCardsDone() {
let number = document.getElementById('doneNumber');
let task = document.getElementById('taskDone');
let icon = document.getElementById('iconDone');

task.style.color = "white";
number.style.color = "white";
icon.src = "./assets/svg/check_hover.svg";
}

function resetHoverToDo() {
let info = document.getElementById('todoNumber');
let taskToDo = document.getElementById('taskToDo');
let icon = document.getElementById('iconToDo');

taskToDo.style.color = "#2A3647";
info.style.color = "#2A3647";
icon.src = "./assets/svg/pencil_default.svg";
}

function resetHoverDone() {
let task = document.getElementById('doneNumber');
let taskDone = document.getElementById('taskDone');
let icon = document.getElementById('iconDone');

taskDone.style.color = "#2A3647";
task.style.color = "#2A3647";
icon.src = "./assets/svg/check_default.svg";
}

function hoverlongCard() {
let longCard = document.getElementById('longCard');
let date = document.getElementById('dateText');
let subline = document.getElementById('dateSubline');
let number = document.getElementById('urgentNumber');
let task = document.getElementById('taskUrgent');
longCard.addEventListener('mouseover', function () {
    date.style.color = "white";
    subline.style.color = "white";
    number.style.color = "white";
    task.style.color = "white";
})
}

function resetlongCard() {
let longCard = document.getElementById('longCard');
let date = document.getElementById('dateText');
let subline = document.getElementById('dateSubline');
let number = document.getElementById('urgentNumber');
let task = document.getElementById('taskUrgent');
longCard.addEventListener('mouseout', function () {
    date.style.color = "#2A3647";
    subline.style.color = "#2A3647";
    number.style.color = "#2A3647";
    task.style.color = "#2A3647";
})
}

function hoverThreeCards() {
    let board = document.getElementById('taskBoard');
    let progress = document.getElementById('taskProgress');
    let feedbackAwait = document.getElementById('feedback');

    board.addEventListener("mouseover", boardHover);
    progress.addEventListener("mouseover", progressHover);
    feedbackAwait.addEventListener("mouseover", feedbackAwaitHover);
    board.addEventListener("mouseout", resetBoard);
    progress.addEventListener("mouseout", resetProgress);
    feedbackAwait.addEventListener("mouseout", resetfeedback);

}

function boardHover() {
    let number = document.getElementById('taskBoardNumber');
    let text = document.getElementById('taskBoardText');

    number.style.color = "white";
    text.style.color = "white";
}

function progressHover() {
    let number = document.getElementById('taskProgressNumber');
    let text = document.getElementById('taskProgressText');

    number.style.color = "white";
    text.style.color = "white";
}

function feedbackAwaitHover() {
    let number = document.getElementById('feedbackNumber');
    let text = document.getElementById('feedbackText');

    number.style.color = "white";
    text.style.color = "white";
}

function resetBoard() {
    let number = document.getElementById('taskBoardNumber');
    let text = document.getElementById('taskBoardText');

    number.style.color = "#2A3647";
    text.style.color = "#2A3647";
}

function resetProgress() {
    let number = document.getElementById('taskProgressNumber');
    let text = document.getElementById('taskProgressText');

    number.style.color = "#2A3647";
    text.style.color = "#2A3647";
}

function resetfeedback() {
    let number = document.getElementById('feedbackNumber');
    let text = document.getElementById('feedbackText');

    number.style.color = "#2A3647";
    text.style.color = "#2A3647";
}

