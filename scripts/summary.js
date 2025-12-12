/**
 * @fileoverview Summary page functionality including task statistics and user greetings.
 * @module summary
 */

/**
 * Current date reference.
 * @type {Date}
 */
const today = new Date();

/**
 * Array of tasks with 'todo' status.
 * @type {Array}
 */
const todo = [];

/**
 * Array of tasks with 'done' status.
 * @type {Array}
 */
const done = [];

/**
 * Array of tasks with 'in progress' status.
 * @type {Array}
 */
const inProgress = [];

/**
 * Array of tasks with 'await feedback' status.
 * @type {Array}
 */
const awaitFeedback = [];

/**
 * Counter for urgent tasks.
 * @type {number}
 */
let counter = 0;

/**
 * Array of urgent priority tasks.
 * @type {Array}
 */
const urgentCards = [];

/**
 * Nearest upcoming deadline date.
 * @type {Date|null}
 */
let nearest = null;


/**
 * Initializes the summary page.
 * @async
 */
async function initSummary() {
  greetingTime();
    setupGreetingListener()
    loadTasks("summary")
}

/**
 * Sets up authentication change listener for user greeting.
 */
function setupGreetingListener() {
    window.onAuthChange(async (user) => {
      const userGreetingElement = document.getElementById('userGreeting');
      
      if (!user) {
        userGreetingElement.textContent = '';
        return;
      }
      
      const userName = await getUserName(user);
      updateGreetingDisplay(userName);
      
      if (window.innerWidth <= 575) {
        showMobileGreeting(userName);
      }
      
      getInitialsFromUser();
    });
}

/**
 * Retrieves the user's name from user data.
 * @async
 * @param {Object} user - The user object.
 * @returns {Promise<string>} The user's name.
 */
async function getUserName(user) {
  const userData = await window.getUserData(user.uid);
  return userData?.name ?? user.displayName ?? (user.isAnonymous ? 'Guest' : 'User');
}

/**
 * Updates the greeting display with the user's name.
 * @param {string} userName - The name of the user.
 */
function updateGreetingDisplay(userName) {
  const userGreetingElement = document.getElementById('userGreeting');
  
  if (userName === 'Guest') {
    userGreetingElement.textContent = "";
  } else {
    userGreetingElement.textContent = userName;
  }
}

/**
 * Displays mobile greeting overlay with animation.
 * @param {string} userName - The name of the user to greet.
 */
function showMobileGreeting(userName) {
  const overlayElement = document.getElementById('welcome_message');
  const timeGreetingOverlay = document.getElementById('timeGreeting_overlay');
  const userGreetingOverlay = document.getElementById('userGreeting_overlay');
  const greetingText = greetingTime();
  
  timeGreetingOverlay.textContent = greetingText;
  userGreetingOverlay.textContent = userName;
  overlayElement.classList.remove('dnone');
  
  setTimeout(() => {
    overlayElement.classList.add('dnone');
  }, 3000);
}

/**
 * Determines and displays the appropriate greeting based on current time.
 * @returns {string} The greeting text.
 */
function greetingTime() {
    let greeting = document.getElementById('timeGreeting');
    const hour = new Date().getHours();
    const greetingText = getGreetingByHour(hour);
    
    greeting.textContent = greetingText;
    return greetingText;
}

/**
 * Returns the appropriate greeting text based on the hour.
 * @param {number} hour - The current hour (0-23).
 * @returns {string} The greeting text.
 */
function getGreetingByHour(hour) {
    switch (true) {
        case (hour >= 4 && hour < 11):
            return "Good Morning,";
        case (hour >= 11 && hour < 18):
            return "Good Afternoon,";
        case (hour >= 18 && hour < 21):
            return "Good Evening,";
        case (hour >= 21 || hour < 4):
            return "Good Night,";
        default:
            return "Good Morning,";
    }
}

/**
 * Splits cards into status-specific arrays and updates summary.
 * @param {Array} cards - Array of task cards to split.
 */
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

/**
 * Counts tasks with urgent priority and updates display.
 * @param {Array} cards - Array of task cards to check.
 */
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

/**
 * Displays the upcoming deadline for urgent tasks.
 * @param {Array} urgentCards - Array of urgent task cards.
 */
function upcomingDeadline(urgentCards) {
  const dateRef = document.getElementById("dateText");

  if (!urgentCards || urgentCards.length === 0) {
    dateRef.innerHTML = "No urgent tasks";
    return;
  }
  dateRef.innerHTML = calculationUpComingDeadline(urgentCards);
}

/**
 * Calculates the nearest upcoming deadline from urgent cards.
 * @param {Array} urgentCards - Array of urgent task cards.
 * @returns {string} Formatted deadline date string.
 */
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

/**
 * Formats the nearest deadline date and marks if expired.
 * @param {Date} nearest - The nearest deadline date.
 * @param {Date} today - The current date.
 * @returns {string|null} Formatted date string or null.
 */
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

/**
 * Updates the summary display with task counts.
 * @param {Array} todo - Array of todo tasks.
 * @param {Array} done - Array of done tasks.
 * @param {Array} inProgress - Array of in progress tasks.
 * @param {Array} awaitFeedback - Array of await feedback tasks.
 */
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
    initSummary();
  });