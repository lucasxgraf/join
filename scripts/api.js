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


async function addTask() {
  let titel = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("duedate");
  let category = document.getElementById("selectedCategory")

  const newTask = helpForComposition (titel, description, date, category) 

  task.push(newTask);
  clearInput()
  enableSubmit()
  sendFeedback()
  
  return postData("addTask.json", newTask);
}

function helpForComposition(titel, description, date, category) {
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
  return newTask
}

async function saveEditedCardToFirebase() {
  if (!validateEditedForm()) {
    return;
  }
  const cardId = SingleCARD[0];
  const title = document.getElementById("overlayEditTitle").value;
  const description = document.getElementById("overlayEditDescription").value;
  const date = document.getElementById("duedateOverlayEdit").value;
  const selectedContacts = getSelectedContactsFromOverlay();

  
  const updatedCard = helpForCompositionEdit(cardId, title, description, date, selectedContacts)
    const url = `${BASE_URL}addTask/${cardId.id}.json`;
    await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedCard)
    });

    toggleOverlay();
    location.reload();
}


function helpForCompositionEdit(cardId, title, description, date, selectedContacts){
    const updatedCard = {
    title: title,
    description: description,
    date: date,
    priority: selectedPriority,
    contact: selectedContacts,
    subtask: cardId.subtask,
    category: cardId.category,
    dragclass: cardId.dragclass
  };
return updatedCard
}


function dragclass() {
  const dragclassRef = document.getElementById("addTaskDialog")?.dataset.dragclass; 

  if (dragclassRef) {
    return dragclassRef
  }else {
   return "todo"
  } 
}


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

async function fetchContacts() {
    let response = await fetch(BASE_URL + "contacts.json");
    let responseToJSON = await response.json();
    let contactObj = responseToJSON.contactlist || responseToJSON;
    for (let id in contactObj) {
        let contactData = contactObj[id];
        contactData.id = id;   // ID INS OBJEKT EINTRAGEN
        contacts.push(contactData);
    }
}


async function addContact(event) {
    event.stopPropagation();
    let iName = document.getElementById('input-name').value;
    let iMail = document.getElementById('input-mail').value;
    let iPhone = document.getElementById('input-phone').value;
    let [firstname, ...rest] = iName.trim().split(" ");
    let secondname = rest.join(" ");
    const data = returnJSONDATANEW(iName, iMail, iPhone, firstname, secondname);
    try {
    let response = await fetch(BASE_URL + "contacts/contactlist.json", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    closeForm(event);
    contacts = [];
    await init();
    contactToast("Contact successfully create")

    } catch(error) {
        console.error("Fehler beim Speichern:", error);
    }
}

async function editContact(index) {
    let iName = document.getElementById('input-name').value;
    let iMail = document.getElementById('input-mail').value;
    let iPhone = document.getElementById('input-phone').value;
    let contactColor = contacts[index]["color"];
    
    let originalName = contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"];
    let originalMail = contacts[index]["mail"];
    let originalPhone = contacts[index]["tel"];
    
    if (iName === originalName && iMail === originalMail && iPhone === originalPhone) {
        closeForm();
        return;
    }
    
    let url = BASE_URL + `contacts/contactlist/${contacts[index].id}.json`;
    let [firstname, ...rest] = iName.trim().split(" ");
    let secondname = rest.join(" ");
    const data = returnJSONDATA(contactColor, iName, iMail, iPhone, firstname, secondname);
    console.log(data)
    try {
        let response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    console.log("Kontakt bearbeitet:", response);
    closeForm();
    contacts = [];
    await init();
    let existingContent = document.getElementById('showContent' + index);
    if (existingContent) {
        let content = document.getElementById('contact_content');
        content.innerHTML = showContactTemplate(index);
    }
    contactToast("Contact successfully edit")
} catch (err) {
    console.error('Failed to edit contact:', err);
    alert('Could not save contact. See console for details.');
}
}

async function deleteContact(index) {
    let url = BASE_URL + `contacts/contactlist/${contacts[index].id}.json`;
    try {
        let response = await fetch(url, {
        method: 'DELETE'
    });
    contactToast("Contact successfully delete")
    await new Promise(resolve => setTimeout(resolve, 2000));
    closeForm();
    contacts = [];
    await init();
    if (!window.matchMedia("(max-width: 950px)").matches) {showNoContact()} else {goBackToContactList()}
} catch (err) {
    console.error('Failed to delete contact:', err);
}
}