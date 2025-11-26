const BASE_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/";
let contactFromFirebase = [];

async function postData(path="addTask.json", data={task}) {
  let response = await fetch(BASE_URL + path,{
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify(data)
  });
   return response.json();
}

async function fetchContact(path = "contacts/contactlist.json") {
  const fetchRes = await fetch(BASE_URL + path);
  const data = await fetchRes.json();

  if (data) {
    contactFromFirebase = Object.entries(data).map(([id, contact]) => ({
      userid: id,
      ...contact
      
    }));

  }
  renderContactOnHTML(contactFromFirebase, "labelContact")
}
// Add Task
async function addTask() {
  let titel = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("duedate");
  let category = document.getElementById("selectedCategory")

  const newTask = {
    "title": titel.value,
    "description": description.value,
    "date": date.value || date.innerText,
    "subtask": subtaskArray,
    "priority": selectedPriority,
    "contact": contactList,
    "category": category.value,
    "dragclass": dragclass()
    
  };  
  task.push(newTask);
  clearInput()
  enableSubmit()
  sendFeedback()
  
   return postData("addTask.json", newTask);
}
// #####################################################################################

function dragclass() {
  const dragclassRef = document.getElementById("addTaskDialog")?.dataset.dragclass; 

  if (dragclassRef) {
    return dragclassRef
  }else {
   return "todo"
  }

  
}
// Overlay
async function saveSubtasksToFirebase(cardId, subtasks) {
    const url = `${BASE_URL}addTask/${cardId}/subtask.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(subtasks) 
    });
}

async function deleteTaskFromFirebase(taskId) {
    const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
      method: 'DELETE'
    });
  } 

async function saveEditedCardToFirebase() {
  if (!validateEditedForm()) {
    return;
  }
  const cardId = SingleCARD[0].id;
  const title = document.getElementById("overlayEditTitle").value;
  const description = document.getElementById("overlayEditDescription").value;
  const date = document.getElementById("duedateOverlayEdit").value;

  const selectedContacts = getSelectedContactsFromOverlay();

  const updatedCard = {
    title: title,
    description: description,
    date: date,
    priority: selectedPriority,
    contact: selectedContacts,
    subtask: SingleCARD[0].subtask,
    category: SingleCARD[0].category,
    dragclass: SingleCARD[0].dragclass
  };
    const url = `${BASE_URL}addTask/${cardId}.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard)
    });

    toggleOverlay();
    location.reload();
}

async function moveTo(newdragclass) {
  const task = cardFromFirebase.find(t => t.id === dragElementId);
  if (!task) return;

  task.dragclass = newdragclass;
      await fetch(`${BASE_URL}addTask/${dragElementId}/dragclass.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: `"${newdragclass}"`
      });
      loadDetails(cardFromFirebase);
}

async function loadContacts() {
  
    const RESPONSE = await fetch(`${BASE_URL}contacts/contactlist.json`);
    const DATA = await RESPONSE.json();
    if (DATA) {
      contacts_from_firebase = DATA;
    } 
}

async function loadTasks(ref) {
    const RESPONSE = await fetch(`${BASE_URL}addTask.json`);
    const DATA = await RESPONSE.json();
    

    if (DATA) {
      cardFromFirebase = Object.entries(DATA).map(([id, task]) => ({
    id: id,
    ...task
  }));
}
if (ref === "board"){
 loadDetails(cardFromFirebase)
}
else{
  splitCardsByStatus(cardFromFirebase)
  countUrgentPriority(cardFromFirebase)
}
};