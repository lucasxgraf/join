const today = new Date();
const todo = [];
const done = [];
const inProgress = [];
const awaitFeedback = [];
let counter = 0;
const urgentCards = [];
let nearest = null;

/**
 * Initializes the summary page
 * Loads tasks, displays greeting, and renders summary statistics
 */
async function init() {
    await loadTasks();
    const userName = localStorage.getItem("headerName") || "Guest";
    greetUser(userName);
    renderTodoCount();
    renderDoneCount();
    renderInProgressCount();
    renderAwaitFeedbackCount();
    renderUrgentCount();
    renderTotalTasksCount();
    renderNearestDeadline();
}

/**
 * Displays personalized greeting message with user name
 * 
 * @param {string} userName - Name of the user to greet
 */
function greetUser(userName) {
    const greetingElement = document.getElementById('greeting');
    const userNameElement = document.getElementById('userName');
    
    if (greetingElement && userNameElement) {
        greetingElement.textContent = greetingTime();
        userNameElement.textContent = userName;
        setupGreetingListener();
    }
}

/**
 * Sets up event listener for greeting animation
 * Shows greeting overlay on mobile devices on first load
 */
function setupGreetingListener() {
    if (shouldShowGreetingOverlay()) {
        showGreetingOverlay();
    }
}

/**
 * Checks if greeting overlay should be shown
 * Only shows on mobile and if not previously shown
 * 
 * @returns {boolean} True if overlay should be shown
 */
function shouldShowGreetingOverlay() {
    return window.innerWidth <= 1000 && 
           !sessionStorage.getItem('greetingShown');
}

/**
 * Displays greeting overlay with animation
 * Marks greeting as shown in session storage
 */
function showGreetingOverlay() {
    const overlay = document.getElementById('greetingOverlay');
    if (overlay) {
        overlay.classList.add('show');
        sessionStorage.setItem('greetingShown', 'true');
        hideOverlayAfterDelay(overlay);
    }
}

/**
 * Hides greeting overlay after delay
 * 
 * @param {HTMLElement} overlay - Overlay element to hide
 */
function hideOverlayAfterDelay(overlay) {
    setTimeout(() => {
        overlay.classList.remove('show');
    }, 2000);
}

/**
 * Returns appropriate greeting based on current time
 * 
 * @returns {string} Time-based greeting message
 */
function greetingTime() {
    const hour = new Date().getHours();
    return getGreetingByHour(hour);
}

/**
 * Gets greeting message based on hour of day
 * 
 * @param {number} hour - Hour of the day (0-23)
 * @returns {string} Appropriate greeting message
 */
function getGreetingByHour(hour) {
    if (isMorning(hour)) return "Good morning,";
    if (isAfternoon(hour)) return "Good afternoon,";
    if (isEvening(hour)) return "Good evening,";
    return "Good night,";
}

/**
 * Checks if hour is in morning time range
 * 
 * @param {number} hour - Hour of the day (0-23)
 * @returns {boolean} True if morning (5-12)
 */
function isMorning(hour) {
    return hour >= 5 && hour < 12;
}

/**
 * Checks if hour is in afternoon time range
 * 
 * @param {number} hour - Hour of the day (0-23)
 * @returns {boolean} True if afternoon (12-18)
 */
function isAfternoon(hour) {
    return hour >= 12 && hour < 18;
}

/**
 * Checks if hour is in evening time range
 * 
 * @param {number} hour - Hour of the day (0-23)
 * @returns {boolean} True if evening (18-22)
 */
function isEvening(hour) {
    return hour >= 18 && hour < 22;
}

/**
 * Renders count of tasks in "To Do" status
 */
function renderTodoCount() {
    const todoCount = tasks.filter(task => task.status === 'todo').length;
    document.getElementById('todoCount').textContent = todoCount;
}

/**
 * Renders count of tasks in "Done" status
 */
function renderDoneCount() {
    const doneCount = tasks.filter(task => task.status === 'done').length;
    document.getElementById('doneCount').textContent = doneCount;
}

/**
 * Renders count of tasks in "In Progress" status
 */
function renderInProgressCount() {
    const inProgressCount = tasks.filter(task => task.status === 'inProgress').length;
    document.getElementById('inProgressCount').textContent = inProgressCount;
}

/**
 * Renders count of tasks in "Await Feedback" status
 */
function renderAwaitFeedbackCount() {
    const awaitFeedbackCount = tasks.filter(task => task.status === 'awaitFeedback').length;
    document.getElementById('awaitFeedbackCount').textContent = awaitFeedbackCount;
}

/**
 * Renders count of urgent priority tasks
 */
function renderUrgentCount() {
    const urgentCount = tasks.filter(task => task.priority === 'urgent').length;
    document.getElementById('urgentCount').textContent = urgentCount;
}

/**
 * Renders total count of all tasks
 */
function renderTotalTasksCount() {
    document.getElementById('totalTasksCount').textContent = tasks.length;
}

/**
 * Renders the nearest deadline date for urgent tasks
 * Displays formatted date or "No urgent tasks" message
 */
function renderNearestDeadline() {
    const urgentTasks = tasks.filter(task => task.priority === 'urgent' && task.dueDate);
    const deadlineElement = document.getElementById('nearestDeadline');
    
    if (urgentTasks.length === 0) {
        deadlineElement.textContent = 'No urgent tasks';
        return;
    }
    
    const nearestDate = findNearestDeadline(urgentTasks);
    deadlineElement.textContent = formatDeadlineDate(nearestDate);
}

/**
 * Finds the nearest deadline from urgent tasks
 * 
 * @param {Array} urgentTasks - Array of urgent tasks with due dates
 * @returns {Date} Nearest deadline date
 */
function findNearestDeadline(urgentTasks) {
    const dates = urgentTasks.map(task => new Date(task.dueDate));
    return new Date(Math.min(...dates));
}

/**
 * Formats deadline date to readable string
 * 
 * @param {Date} date - Date to format
 * @returns {string} Formatted date string (e.g., "January 1, 2024")
 */
function formatDeadlineDate(date) {
    return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
}

init();