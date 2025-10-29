function init() {
    renderContactOnHTML();
    renderCategoryOnHTML();
    fetchSVGs();
    addTaskButton();
    addSubtask();
    enterSubtask();

    
}

function renderContactOnHTML() {
    const contactRef = document.getElementById("labelContact");
    
    for (let i = 0; i < contact.length; i++) {
        contactRef.innerHTML +=  renderContact(i);
        applyContactColors(i);
    }
}

function renderCategoryOnHTML() {
    const categoryRef = document.getElementById("labelCategory");
    
    for (let i = 0; i < category.length; i++) {
        categoryRef.innerHTML +=  renderCategory(i);      
    }
}

function addTaskButton() {
  const input = document.getElementById("subtaskReadOut");
  input.addEventListener("input", renderSubtaskButtons);
}
