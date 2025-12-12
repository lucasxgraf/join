let searchTimeout;
let currentSearchTerm = '';

/**
 * Initializes search functionality
 * Sets up event listener for search input field
 */
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }
}

/**
 * Handles search input changes and filters tasks
 * Debounces input to avoid excessive filtering
 * 
 * @param {Event} event - Input event from search field
 */
function handleSearchInput(event) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(() => {
        performSearch(event.target.value);
    }, 300);
}

/**
 * Performs the actual search and updates task display
 * 
 * @param {string} searchTerm - Search term to filter tasks
 */
function performSearch(searchTerm) {
    const trimmedSearch = searchTerm.trim().toLowerCase();
    
    if (trimmedSearch === '') {
        resetSearch();
    } else {
        filterAndDisplayTasks(trimmedSearch);
    }
}

/**
 * Resets search and displays all tasks
 */
function resetSearch() {
    currentSearchTerm = '';
    renderAllTasks();
}

/**
 * Filters tasks by search term and updates display
 * 
 * @param {string} searchTerm - Lowercase search term
 */
function filterAndDisplayTasks(searchTerm) {
    currentSearchTerm = searchTerm;
    const filteredTasks = filterTasksBySearchTerm(searchTerm);
    renderFilteredTasks(filteredTasks);
}

/**
 * Filters tasks array by search term
 * Searches in title and description fields
 * 
 * @param {string} searchTerm - Lowercase search term
 * @returns {Array} Filtered array of tasks matching search term
 */
function filterTasksBySearchTerm(searchTerm) {
    return tasks.filter(task => 
        matchesSearchTerm(task, searchTerm)
    );
}

/**
 * Checks if task matches search term
 * 
 * @param {Object} task - Task object to check
 * @param {string} searchTerm - Lowercase search term
 * @returns {boolean} True if task matches search term
 */
function matchesSearchTerm(task, searchTerm) {
    const title = task.title.toLowerCase();
    const description = task.description.toLowerCase();
    return title.includes(searchTerm) || description.includes(searchTerm);
}

/**
 * Renders all tasks without filtering
 */
function renderAllTasks() {
    renderBoard();
}

/**
 * Renders filtered tasks on the board
 * 
 * @param {Array} filteredTasks - Array of tasks to display
 */
function renderFilteredTasks(filteredTasks) {
    clearAllColumns();
    filteredTasks.forEach(task => renderTaskInColumn(task));
    updateEmptyStates();
}

/**
 * Clears all task columns on the board
 */
function clearAllColumns() {
    const columns = ['todo', 'inProgress', 'awaitFeedback', 'done'];
    columns.forEach(column => clearColumn(column));
}

/**
 * Clears a specific column
 * 
 * @param {string} columnId - ID of the column to clear
 */
function clearColumn(columnId) {
    const column = document.getElementById(columnId);
    if (column) {
        column.innerHTML = '';
    }
}

/**
 * Renders a single task in its appropriate column
 * 
 * @param {Object} task - Task object to render
 */
function renderTaskInColumn(task) {
    const column = document.getElementById(task.status);
    if (column) {
        column.innerHTML += generateTaskHTML(task);
    }
}

/**
 * Updates empty state messages for all columns
 */
function updateEmptyStates() {
    const columns = ['todo', 'inProgress', 'awaitFeedback', 'done'];
    columns.forEach(column => updateColumnEmptyState(column));
}

/**
 * Updates empty state message for a specific column
 * 
 * @param {string} columnId - ID of the column to update
 */
function updateColumnEmptyState(columnId) {
    const column = document.getElementById(columnId);
    if (column && column.children.length === 0) {
        column.innerHTML = getEmptyStateHTML(columnId);
    }
}

/**
 * Gets empty state HTML for a column
 * 
 * @param {string} columnId - ID of the column
 * @returns {string} HTML string for empty state message
 */
function getEmptyStateHTML(columnId) {
    return `<div class="empty-state">No tasks found</div>`;
}

/**
 * Gets current search term
 * 
 * @returns {string} Current search term
 */
function getCurrentSearchTerm() {
    return currentSearchTerm;
}

initSearch();