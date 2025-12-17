/**
 * @fileoverview Search functionality for filtering and displaying task cards.
 * @module search
 */

/**
 * Flag indicating if search is currently active.
 * @type {boolean}
 */
let isSearchActive = false;

/**
 * Initializes search functionality by attaching event listeners.
 */
function initSearch() {
    const SEARCH_INPUT = document.getElementById('searchInput')
    const SEARCH_INPUT_RES = document.getElementById('searchInputResp');
    SEARCH_INPUT.addEventListener('input', handleSearch);
    SEARCH_INPUT_RES.addEventListener('input', handleSearch);
}

/**
 * Handles search input events and triggers filtering.
 * @param {Event} event - The input event.
 */
function handleSearch(event) {
    const SEARCH_TERM = event.target.value.trim().toLowerCase();
    
    if (SEARCH_TERM.length >= 3) {
      isSearchActive = true;
        filterCards(SEARCH_TERM);
    } else {
      isSearchActive = false;
       document.getElementById("content_col").classList.remove("dnone")      
        resetSearch();
    }
}

/**
 * Filters cards based on search term.
 * @param {string} SEARCH_TERM - The search term to filter by.
 */
function filterCards(SEARCH_TERM) {
    const FILTERED_CARDS = cardFromFirebase.filter(card => {
        const CARD_TITLE = String(card.title || card.titel || '').toLowerCase();
        const CARD_DESCRIPTION = String(card.description || card.discription || '').toLowerCase();
        
        return CARD_TITLE.includes(SEARCH_TERM) || CARD_DESCRIPTION.includes(SEARCH_TERM);
    });
    
    renderFilteredCards(FILTERED_CARDS);
}

/**
 * Renders filtered cards to their respective containers.
 * @param {Array} FILTERED_CARDS - Array of filtered card objects.
 */
function renderFilteredCards(FILTERED_CARDS) {
    document.getElementById("content_col").classList.remove("dnone")    
    clearAllContainers();
    
    if (FILTERED_CARDS.length === 0) {  
        handleNoResults();
        return;
    }
    
    hideNoResultsMessage();
    renderCardsToContainers(FILTERED_CARDS);
}

/**
 * Handles the display when no search results are found.
 */
function handleNoResults() {
    showNoResultsMessage();
    responsivResultmassage();
}

/**
 * Renders cards to their respective containers.
 * @param {Array} cards - Array of card objects to render.
 */
function renderCardsToContainers(cards) {
    cards.forEach(card => {
        const CONTAINER_ID = getContainerId(card.dragclass);
        const CONTAINER = document.getElementById(CONTAINER_ID);
        
        if (CONTAINER) {
            CONTAINER.innerHTML += renderCard(card);
        }
    });
}

/**
 * Adjusts result message display for responsive design.
 */
function responsivResultmassage() {
    if (window.innerWidth <= 1050) {
        document.getElementById("content_col").classList.add("dnone")    
    }
    else
        document.getElementById("content_col").classList.remove("dnone")    
}

/**
 * Displays a "no results found" message.
 */
function showNoResultsMessage() {
    hideNoResultsMessage();
    
    const message = document.createElement('div');
    message.className = 'no-results-message';
    message.innerHTML = `
        <div class="no-results-content">
            <span>No tasks found</span>
            <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.6 21L13.3 14.7C12.8 15.1 12.225 15.4167 11.575 15.65C10.925 15.8833 10.2333 16 9.5 16C7.68333 16 6.146 15.3707 4.888 14.112C3.63 12.8533 3.00067 11.316 3 9.5C3 7.68333 3.62933 6.146 4.888 4.888C6.14667 3.63 7.684 3.00067 9.5 3C11.3167 3 12.854 3.62933 14.112 4.888C15.37 6.14667 15.9993 7.684 16 9.5C16 10.2333 15.8833 10.925 15.65 11.575C15.4167 12.225 15.1 12.8 14.7 13.3L21 19.6L19.6 21ZM9.5 14C10.75 14 11.8127 13.5623 12.688 12.687C13.5633 11.8117 14.0007 10.7493 14 9.5C14 8.25 13.5623 7.18733 12.687 6.312C11.8117 5.43667 10.7493 4.99933 9.5 5C8.25 5 7.18733 5.43767 6.312 6.313C5.43667 7.18833 4.99933 8.25067 5 9.5C5 10.75 5.43767 11.8127 6.313 12.688C7.18833 13.5633 8.25067 14.0007 9.5 14Z" fill="white"/>
            </svg>
        </div>
    `;
    document.body.appendChild(message);
}

/**
 * Hides the "no results found" message.
 */
function hideNoResultsMessage() {
    const message = document.querySelector('.no-results-message');
    if (message) {
        message.remove();
    }
}

/**
 * Resets search and displays all cards.
 */
function resetSearch() {
    hideNoResultsMessage();
    loadDetails(cardFromFirebase);
}

/**
 * Clears all task container contents.
 */
function clearAllContainers() {
    document.getElementById('todo').innerHTML = '';
    document.getElementById('inprogress').innerHTML = '';
    document.getElementById('awaitfeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}

/**
 * Maps drag class to container ID.
 * @param {string} dragclass - The drag class of the card.
 * @returns {string} The container ID.
 */
function getContainerId(dragclass) {
    const CONTAINER_MAP = {
        'todo': 'todo',
        'inprogress': 'inprogress',
        'awaitfeedback': 'awaitfeedback',
        'done': 'done'
    };
    return CONTAINER_MAP[dragclass] || 'todo';
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}