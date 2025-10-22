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