let isSearchActive = false;

function initSearch() {
    const SEARCH_INPUT = document.getElementById('searchInput');
    SEARCH_INPUT.addEventListener('input', handleSearch);
}

function handleSearch(event) {
    const SEARCH_TERM = event.target.value.trim().toLowerCase();
    
    if (SEARCH_TERM.length >= 3) {
      isSearchActive = true;
        filterCards(SEARCH_TERM);
    } else {
      isSearchActive = false;
        resetSearch();
    }
}

function filterCards(SEARCH_TERM) {
    const FILTERED_CARDS = cardFromFirebase.filter(card => {
        const CARD_TITLE = String(card.title || card.titel || '').toLowerCase();
        const CARD_DESCRIPTION = String(card.description || card.discription || '').toLowerCase();
        
        return CARD_TITLE.includes(SEARCH_TERM) || CARD_DESCRIPTION.includes(SEARCH_TERM);
    });
    
    renderFilteredCards(FILTERED_CARDS);
}

function renderFilteredCards(FILTERED_CARDS) {
    clearAllContainers();
    
    FILTERED_CARDS.forEach(card => {
        const CONTAINER_ID = getContainerId(card.dragclass);
        const CONTAINER = document.getElementById(CONTAINER_ID);
        
        if (CONTAINER) {
          CONTAINER.innerHTML += renderCard(card);
        }
    });
}

function clearAllContainers() {
    document.getElementById('todo').innerHTML = '';
    document.getElementById('inProgress').innerHTML = '';
    document.getElementById('awaitFeedback').innerHTML = '';
    document.getElementById('done').innerHTML = '';
}

function getContainerId(dragclass) {
    const CONTAINER_MAP = {
        'todo': 'todo',
        'inprogress': 'inProgress',
        'awaitfeedback': 'awaitFeedback',
        'done': 'done'
    };
    
    return CONTAINER_MAP[dragclass] || 'todo';
}

function resetSearch() {
    loadDetails(cardFromFirebase);
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSearch);
} else {
    initSearch();
}