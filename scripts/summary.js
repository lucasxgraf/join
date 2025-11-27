import { getUserData, onAuthChange } from './firebase_auth.js';

async function inittest() {
    setupGreetingListener()
    loadTasks("summary")
    greetingTime();
}

function setupGreetingListener() {
    // onAuthChange liefert user (oder null) bei jeder Änderung
    onAuthChange(async (user) => {
      const userGreetingElement = document.getElementById('userGreeting');
      if (!user) {
        userGreetingElement.textContent = '';
        return;
      }
      // hole zusätzliche Daten aus DB (falls vorhanden)
      const userData = await getUserData(user.uid);
      userGreetingElement.textContent = userData?.name ?? user.displayName ?? (user.isAnonymous ? 'Guest' : 'User');
    });
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

document.addEventListener('DOMContentLoaded', () => {
    inittest();
  });