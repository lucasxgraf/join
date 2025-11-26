
let task = [];
let subtaskArray = [];
let contactList = [];
let contactBadge = [];
let selectedPriority = '';
let category = ["Technical Task", "User Story",];

function clearInput() {
  document.getElementById("title").value = "";
  document.getElementById("description").value = "";
  document.getElementById("duedate").value = "";
  task = [];

  const categoryInput = document.getElementById("selectedCategory");
  categoryInput.value = "";

  changePriority("medium", "AddTask")
  document.getElementById("submit").disabled = true
clearSubtask()
clearContact()
updateAssignedInput()
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
    iconContactHTML("iconContact")
  });
}

function toggleDropdown(selector, currentId) {
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

        if (currentId) iconContactHTML(currentId);
      }
    }
    document.addEventListener("click", handleClickOutside);
  }

  if (!isOpen) {
    // Nur wenn currentId existiert!!
    if (currentId) iconContactHTML(currentId);
  }
}

function changeCategory(selection) {
  let text = "";
  const input = document.getElementById("selectedCategory");

  if (typeof selection === "string") {
    text = selection;
  } 
   if (selection instanceof Element) {
    const span = selection.querySelector("span");
    text = span ? span.innerText.trim() : selection.innerText.trim();
  }
  if (input && text) {
    input.value = text;
    enableSubmit()
  }
  toggleDropdown('categoryDropdown');
}

function addSubtask() {
  const readout = document.getElementById("subtaskReadOut");
  const addSubtaskContainer = document.getElementById("addSubtask");
  const value = readout.value.trim().toLowerCase();
  if (value === "" || subtaskArray.length >= 5) 
    return;

  subtaskArray.push({ title: value, completed: false });  
  subtask(addSubtaskContainer, subtaskArray);
  document.getElementById("inputButtons").innerHTML = ""
  readout.value = "";
}

function enterSubtask() {
  document.getElementById("subtaskReadOut").addEventListener("keypress", (event) => {  
  if (event.key === "Enter"){
    event.preventDefault();
    addSubtask();
  }}); 
}

function changePriority(priority, currentId) {
  const buttons = document.querySelectorAll('.priority-btn');
  const button = document.getElementById(`${priority}Btn${currentId}`);

  buttons.forEach(btn => btn.classList.remove('active'));
  button.classList.add('active');

  selectedPriority = priority;
}

function fetchSVGs(currentId) {
  const svgs = [
    { path: '../assets/svg/priority_symblos/urgent.svg', selector: `#urgentBtn${currentId} .urgent_icon` },
    { path: '../assets/svg/priority_symblos/Medium.svg', selector: `#mediumBtn${currentId}  .medium_icon`},
    { path: '../assets/svg/priority_symblos/Low.svg', selector: `#lowBtn${currentId}  .low_icon` }
  ];
  svgs.forEach(svg => {
    fetch(svg.path)
      .then(response => response.text())
      .then(svgContent => {
        document.querySelector(svg.selector).innerHTML = svgContent;
      })
      .catch(error => console.error('Error fetching SVG:', error));
  })};

function selectContacts(i, checkbox) {
  let badgeName = contactName[i].innerText
  let badgeEl = document.getElementById(`contactDropdownList_${i}`);
  let userId = contactFromFirebase[i].userid;

  const exists = contactList.some(c => c.id === userId);

  if (!exists) {
    contactBadge.push(badgeEl);
    contactList.push({
      name: badgeName,
      id: userId
    });
  } else {
    contactList = contactList.filter(c => c.id !== userId);
    contactBadge = contactBadge.filter(b => b.id !== badgeEl.id);
  }
  updateAssignedInput();
}

function updateAssignedInput() {
  const input = document.getElementById("selectedAssigned");
  
  if (contactList.length === 0) {
    input.value = "";
  } else 
    input.value = "Select contacts to assign";   
}

function iconContactHTML(currentId) {
  const iconConact = document.getElementById(currentId);
  const visibleBadges = contactBadge.slice(0, 9);
  iconConact.innerHTML = ""; 

  visibleBadges.forEach(badge => {
    iconConact.appendChild(badge.cloneNode(true));
  });
  if (contactBadge.length > 9) { 
   iconConact.innerHTML += `<div class="iconConact dpf_cc morethan9"><span>+${contactBadge.length - 9}</span></div>`
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
  editInputSubtask.value = subtaskArray[i].title;
  editInputSubtask.focus();   
  editInputSubtask.onblur = (e) => {
  if (e.relatedTarget && containerEditSubtask.contains(e.relatedTarget)) {
    return;
  }
  cancelEditSubtask(i);
  }};

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
    subtaskArray[i] = { title: newValue.trim(), completed: false };
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

function showError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = message;
}

function clearErrors() {
  document.querySelectorAll('.error_message').forEach(e => e.textContent = '');
}

function validateDueDate() {
  const duedateInput = document.getElementById("duedate");
  const value = duedateInput.value.trim();
  duedateInput.classList.remove("error");
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;

  if (!dateRegex.test(value)) {
    showError("dateError", "Please select a valid date format DD/MM/YYYY.");
    return false;
  }

  if (!checkDate(duedateInput)) {
    showError("dateError", "The date must be today or in the future.");
    return false;
  }
  return true;
}

function enableSubmit() {
  const duedateInput = document.getElementById("duedate").value.trim();
  const categorySelect = document.getElementById("selectedCategory").value.trim();
  const titleInput = document.getElementById("title").value.trim();
  const allFilled = categorySelect && titleInput && duedateInput

  if (allFilled) {
    document.getElementById("submit").disabled = false
  }
  else{
    document.getElementById("submit").disabled = true
  }
}

function initTaskFormEvents() {
  const form = document.getElementById("taskForm");
  const title = document.getElementById("title");
  const duedate = document.getElementById("duedate");

  if (!form || !title || !duedate.value) return;

  form.onsubmit = e => { 
    e.preventDefault(); clearErrors(); if (validateForm()) addTask(); 
  };
}

function keepFocusOnDate(e) {
  e.preventDefault(); 
}

function validateForm() {
  let ok = true;
  if (!title.value.trim()) { showError("titleError", "This field is required."); ok = false; }
  if (!validateDueDate()) ok = false;
  if (!selectedCategory.value.trim()) { showError("categoryError", "This field is required."); ok = false; }
  return ok;
}


function sendFeedback() {
  const feedbackRef = document.getElementById("feedback")
  feedbackRef.classList.remove("dnone");
  setTimeout(() => {
  feedbackRef.classList.add("dnone");
}, 2000);
}

function validateInput(displayid, currentId, inputFrame) {
  const input = document.getElementById(currentId);
  const output = document.getElementById(displayid)
  const borderError = document.getElementById(inputFrame)

  if (input.value.trim() === "") {
    output.innerHTML = "This field is required."
    borderError.classList.add('errorBorder');
  }
  else{
    output.innerHTML = ""
    borderError.classList.remove('errorBorder');
  }
}
