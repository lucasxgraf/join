
let task = [];
const contact = ["Alex", "Lisa", "Tim"];
let subtaskArray = [];
let contactList = [];
let contactBadge = [];
let category = ["Technical Task", "User Story"];
let contactColors = [  
"#FF5EB3",
"#FF7A00",
"#6E52FF",
"#9327FF",
"#00BEE8",
"#1FD7C1",
"#FF745E",
"#FFA35E",
"#FC71FF",
"#FFC701",
"#0038FF",
"#C3FF2B",
"#FFE62B",
"#FF4646",
"#FFBB2B"
 ];

function clearInput() {
  document.getElementById("title").value = "";
  document.getElementById("discription").value = "";
  document.getElementById("duedate").value = "";
  task = [];

  const categoryInput = document.getElementById("selectedCategory");
  categoryInput.value = "Select task category";

  selectedPriority = "";
  document.querySelectorAll('.priority-btn').forEach(btn => btn.classList.remove('active'));

clearSubtask()
clearContact()
}


function clearSubtask() {

  subtaskArray = [];
  const addSubtaskContainer = document.getElementById("addSubtask");
  if (addSubtaskContainer) addSubtask(addSubtaskContainer, subtaskArray);
 
  addSubtaskContainer.innerHTML = ""
}


function clearContact() {
  contactList = [];
  contactBadge = [];
  const iconConact = document.getElementById("iconConact");
  if (iconConact) iconConact.innerHTML = "";

    document.querySelectorAll('#contactDropdown input[type="checkbox"]').forEach(checkbox => {
    checkbox.checked = false;
  });
}

function toggleDropdown(selector) {
  const dropdown = document.getElementById(selector);
  const isOpen = dropdown.classList.toggle("open");

  if (selector === "contact") {
    renderIcon();
  }

  if (isOpen) {
    function handleClickOutside(e) {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove("open");
        document.removeEventListener("click", handleClickOutside);
      }
    }
    document.addEventListener("click", handleClickOutside);
  }
}


function changeCategory(selection) {
  let text = "";
  const input = document.getElementById("selectedCategory");

  if (typeof selection === "string") {
    text = selection;
  } else if (selection instanceof Element) {
    const span = selection.querySelector("span");
    text = span ? span.innerText.trim() : selection.innerText.trim();
  }

  if (input && text) {
    input.value = text;
  }
  toggleDropdown('selectedCategory');
}


function addSubtask() {
  const readout = document.getElementById("subtaskReadOut");
  const addSubtaskContainer = document.getElementById("addSubtask");
  const value = readout.value.trim();
  if (value === "" || subtaskArray.length >= 5) return;

  subtaskArray.push(value);
  subtask(addSubtaskContainer, subtaskArray);
  readout.value = "";
}

function enterSubtask() {
  document.getElementById("subtaskReadOut").addEventListener("keypress", (event) => {  
  if (event.key === "Enter"){
    event.preventDefault();
    addSubtask();
  }}); 
}

// ######################################################################
const buttons = document.querySelectorAll('.priority-btn');
let selectedPriority = '';

buttons.forEach(button => {
  button.addEventListener('click', () => {
    // Wenn dieser Button bereits aktiv ist → deaktivieren
    if (button.classList.contains('active')) {
      button.classList.remove('active');
      selectedPriority = '';
      return;
    }

// Sonst: alle anderen deaktivieren
    buttons.forEach(btn => btn.classList.remove('active'));

// Aktuellen aktivieren
    button.classList.add('active');

// speichern
    selectedPriority = button.textContent.trim().split(' ')[0];
  });
});
// ######################################################################

function fetchSVGs() {
  const svgs = [
    { path: './assets/Urgent.svg', selector: '#urgentBtn .urgent_icon' },
    { path: './assets/Medium.svg', selector: '#mediumBtn .medium_icon' },
    { path: './assets/Low.svg', selector: '#low_btn .low_icon' }
  ];

  svgs.forEach(svg => {
    fetch(svg.path)
      .then(response => response.text())
      .then(svgContent => {
        document.querySelector(svg.selector).innerHTML = svgContent;
      })
      .catch(error => console.error('Error fetching SVG:', error));
  });
}


function applyContactColors(i) {
  
  const badge = document.getElementById(`contactDropdownList_${i}`);
  const color = contactColors[i % contactColors.length];
  badge.style.backgroundColor = color;
}


function selectContacts(i, checkbox) {
  let badgeName = contactName[i].innerText // besseren Namen raussuchen
  let badgeEl = document.getElementById(`contactDropdownList_${i}`);

  const alreadyIn = contactBadge.some(b => b.id === badgeEl.id);
    if (!alreadyIn) {

    contactBadge.push(badgeEl)
    
    contactList.push(badgeName);

  }
  else {
    contactList = contactList.filter(name => name !== badgeName);
    contactBadge = contactBadge.filter(name => name !== badgeEl);
  }
}


function iconConactHTML() {
  const iconConact = document.getElementById("iconConact");
  const visibleBadges = contactBadge.slice(0, 9);
  iconConact.innerHTML = ""; 


  visibleBadges.forEach(badge => {
    iconConact.appendChild(badge.cloneNode(true));
  });
// Hier noch mal den kontakt anpassen mit css
  if (contactBadge.length > 9) { 
    const moreBadge = document.createElement("div");
    moreBadge.classList.add("iconConact", "dpf_cc");
    moreBadge.style.backgroundColor = "#ffffff";
    moreBadge.innerHTML = `<span>+${contactBadge.length - 9}</span>`;
    iconConact.appendChild(moreBadge);
  }
}


function toggleContactDropdown() {
  const dropdown = document.getElementById("contactDropdown");
  dropdown.classList.toggle("open");

  if (!dropdown.classList.contains("open")) {
    iconConactHTML();
  }
}

function deleteTask(i){


  const addSubtask = document.getElementById("addSubtask");
  subtaskArray.splice(i, 1);
  subtask(addSubtask, subtaskArray);
}


function cleanInput() {
  let input = document.getElementById("subtaskReadOut")
  input.value = "";  
}


function editSubtask(i) {
  const taskOutput = document.getElementById(`taskOutput-${i}`);
  const editInputSubtask = document.getElementById(`editInputSubtask-${i}`);
  const containerEditSubtask = document.getElementById(`containerEditSubtask-${i}`)


    taskOutput.classList.toggle("dnone");
    containerEditSubtask.classList.toggle("dnone")
    editInputSubtask.value = subtaskArray[i];
    editInputSubtask.focus();   
      editInputSubtask.onblur = (e) => {

    // wenn Fokus auf einen Button im Container geht → nicht abbrechen
    if (e.relatedTarget && containerEditSubtask.contains(e.relatedTarget)) {
      return;
    }
    cancelEditSubtask(i);
  }

  };

function cancelEditSubtask(i) {
  const taskOutput = document.getElementById(`taskOutput-${i}`);
  const container = document.getElementById(`containerEditSubtask-${i}`);

  container.classList.add("dnone");
  taskOutput.classList.remove("dnone");
}
  
function addEditSubtask(i) {
  const editInputSubtask = document.getElementById(`editInputSubtask-${i}`);
  const newValue = editInputSubtask.value;
  

  if (newValue !== null && newValue.trim() !== "") {
    subtaskArray[i] = newValue.trim();
    subtask(document.getElementById("addSubtask"), subtaskArray);
  }

  else{ (editInputSubtask.value === "") 
  subtaskArray.splice(i, 1);
  subtask(document.getElementById("addSubtask"), subtaskArray) 
  }
}

function clearEditSubtask(i) {
  const editInputSubtask = document.getElementById(`editInputSubtask-${i}`);

  if (editInputSubtask.value === "") {
  subtaskArray.splice(i, 1);
  subtask(document.getElementById("addSubtask"), subtaskArray) 
  }
  else{
  editInputSubtask.value = "";
  editInputSubtask.focus();
  }
}


// Hilfsfunktionen für die Überprüfung von inputs
function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error_message').forEach(e => e.textContent = '');
}

document.getElementById("taskForm").addEventListener("submit", function (e) {
  e.preventDefault();
  clearErrors();

  let isValid = true;

  const titleInput = document.getElementById("title");
  if (titleInput.value.trim() === "") {
    showError("titleError", "Bitte einen Titel eingeben."); // zeigt im titleError-div
    isValid = false;
  }
  
    if (!validateDueDate()) {
    isValid = false;
  }

  const categorySelect = document.getElementById("selectedCategory");
  if (categorySelect.value.trim() === "") {
    showError("categoryError", "Wähle eine Category aus"); // zeigt im titleError-div
    isValid = false;
  }

  if (isValid) {
    addTask()
  }
});


function validateDueDate() {
  const duedateInput = document.getElementById("duedate");
  const value = duedateInput.value.trim();

  if (value === "") {
    showError("dateError", "Bitte ein Datum eingeben.");
    return false;
  }

  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (!dateRegex.test(value)) {
    showError("dateError", "Bitte ein gültiges Datum Format TT/MM/JJJJ wählen.");
    return false;
  }

  if (!checkDate(duedateInput)) {
    showError("dateError", "Das Datum muss in der Zukunft liegen.");
    return false;
  }
  return true;
}


function checkDate(duedateInput) {
  if (!isValidFutureDate(duedateInput.value)) {
    duedateInput.focus();
      return false;
  }
  return true;
}


function pickDate() {
  const today = new Date(); // aktuelles Datum holen
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat (0–11) → +1 und mit führender Null
  const day = String(today.getDate()).padStart(2, '0'); // Tag mit führender Null
  let inputDate = document.getElementById("duedate")
  const dateString = `${day}/${month}/${year}`;
  
  inputDate.value = ""
  inputDate.value = dateString;

}


function isValidFutureDate(value) {
  // Format dd/mm/yyyy zerlegen
  const parts = value.split("/");
  if (parts.length !== 3) return false;

  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);

  const inputDate = new Date(year, month, day);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return inputDate >= today;
}