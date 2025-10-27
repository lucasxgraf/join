function init() {
    renderContactOnHTML();
    renderCategoryOnHTML();
    addSubtask();
    fetchSVGs();
    // renderIcon();
    addTaskButton();
    
}

// let contact = ["Alex", "Lisa", "Tim", "Max"]; // Soll später aus DB kommen
const contact = [
  "Alex", "Lisa", "Tim", "Max", "Sophie", "Jonas", "Lea", "Paul", "Marie", "Lukas",
  "Nina", "Felix", "Emma", "Ben", "Laura", "Tom", "Mia", "Noah", "Anna", "Leon",
  "Julia", "Finn", "Lena", "Elias", "Clara", "Luis", "Sarah", "Jan", "Hannah", "David"
];

let category = ["Option1", "Option2", "Option3", "Option4"]; // category soll später hier gesetzt werden

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
