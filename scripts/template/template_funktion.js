function init() { 
    fetchContact();
    renderInHtml();
    fetchSVGs();
    addTaskButton();
    addSubtask();
    enterSubtask();
    enableSubmit();
}

function renderInHtml() {
    renderaddTaskOnHtml();
    renderCategoryOnHTML();
    initTaskFormEvents();

}

function renderaddTaskOnHtml() {
    const addTaskRef = document.getElementById("addTaskTemplate")
    const boardAddTaskRef = document.getElementById("addTaskAtBoardPage")

    if (boardAddTaskRef) {
    boardAddTaskRef.innerHTML += renderaddTask()
    }
    else{
    addTaskRef.innerHTML += renderaddTask()
    }
    
}


function renderContactOnHTML(contacFromFirebase) {
    const contactRef = document.getElementById("labelContact");
    
    for (let i = 0; i < contacFromFirebase.length; i++) {
        contactRef.innerHTML +=  renderContact(i ,contacFromFirebase);
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





