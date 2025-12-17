/**
 * Base URL for the Firebase Realtime Database API
 * @type {string}
 */
const BASE_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/";

/**
 * Array to store contacts fetched from Firebase
 * @type {Array<Object>}
 */
let contactFromFirebase = [];

/**
 * Posts data to the specified path in Firebase
 * @param {string} [path="addTask.json"] - The path to post data to
 * @param {Object} [data={task}] - The data to post
 * @returns {Promise<Object>} The response from Firebase
 */
async function postData(path="addTask.json", data={task}) {
  try{
  let response = await fetch(BASE_URL + path,{
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify(data)
  })
  return response.json();
  } catch (error) {handleApiError(error, "postData");}
}

/**
 * Fetches contacts from the specified path in Firebase and renders them
 * @param {string} [path="contacts/contactlist.json"] - The path to fetch contacts from
 */
async function fetchContact(path = "contacts/contactlist.json") {
  try{
  const fetchRes = await fetch(BASE_URL + path);
  const data = await fetchRes.json();
  if (data) {
    contactFromFirebase = Object.entries(data).map(([id, contact]) => ({
      userid: id,
      ...contact
    }));}
  renderContactOnHTML(contactFromFirebase, "labelContact")
  } catch (error) {handleApiError(error, "fetchContact");}
}

/**
 * Adds a new task to Firebase
 * @returns {Promise<Object>} The response from Firebase
 */
async function addTask() {
  try{
  let titel = document.getElementById("title");
  let description = document.getElementById("description");
  let date = document.getElementById("duedate");
  let category = document.getElementById("selectedCategory")
  const newTask = helpForComposition (titel, description, date, category) 

  task.push(newTask);
  clearInput();
  enableSubmit();
  sendFeedback();
  return postData("addTask.json", newTask);
  } catch (error) {handleApiError(error, "addTask");}
}

/**
 * Helper function to compose a new task object
 * @param {HTMLElement} titel - The title input element
 * @param {HTMLElement} description - The description input element
 * @param {HTMLElement} date - The date input element
 * @param {HTMLElement} category - The category input element
 * @returns {Object} The composed task object
 */
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

/**
 * Saves the edited card to Firebase
 */
async function saveEditedCardToFirebase() {
  if (!validateEditedForm()) return;
  const cardId = SingleCARD[0];
  const updatedCard = getUpdatedCardData(cardId);
  
  await updateCardInFirebase(cardId.id, updatedCard);
  toggleOverlay();
  loadTasks("board");
}

/**
 * Gets updated card data from form inputs
 * @param {Object} cardId - The card ID object
 * @returns {Object} The updated card data
 */
function getUpdatedCardData(cardId) {
  const title = document.getElementById("overlayEditTitle").value;
  const description = document.getElementById("overlayEditDescription").value;
  const date = document.getElementById("duedateOverlayEdit").value;
  const selectedContacts = getSelectedContactsFromOverlay();
  return helpForCompositionEdit(cardId, title, description, date, selectedContacts);
}

/**
 * Updates card data in Firebase
 * @param {string} cardId - The card ID
 * @param {Object} updatedCard - The updated card data
 */
async function updateCardInFirebase(cardId, updatedCard) {
  try{
  await fetch(`${BASE_URL}addTask/${cardId}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updatedCard)
  });
  } catch (error) { handleApiError(error, "updateCardInFirebase");}
}

/**
 * Helper function to compose an edited card object
 * @param {Object} cardId - The card ID object
 * @param {string} title - The title of the card
 * @param {string} description - The description of the card
 * @param {string} date - The date of the card
 * @param {Array} selectedContacts - The selected contacts for the card
 * @returns {Object} The composed updated card object
 */
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

/**
 * Determines the drag class for a task
 * @returns {string} The drag class
 */
function dragclass() {
  const dragclassRef = document.getElementById("addTaskDialog")?.dataset.dragclass; 

  if (dragclassRef) {
    return dragclassRef
  }else {
   return "todo"} 
}

/**
 * Saves subtasks to Firebase for a specific card
 * @param {string} cardId - The ID of the card
 * @param {Array} subtasks - The subtasks to save
 */
async function saveSubtasksToFirebase(cardId, subtasks) {
  const url = `${BASE_URL}addTask/${cardId}/subtask.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(subtasks) 
  });
}

/**
 * Deletes a task from Firebase
 * @param {string} taskId - The ID of the task to delete
 */
async function deleteTaskFromFirebase(taskId) {
  try{
    const response = await fetch(`${BASE_URL}addTask/${taskId}.json`, {
      method: 'DELETE'
    });
  } catch (error) {handleApiError(error, "deleteTaskFromFirebase");} 
}

/**
 * Moves a task to a new drag class in Firebase
 * @param {string} newdragclass - The new drag class
 */
async function moveTo(newdragclass) {
  try{
  const task = cardFromFirebase.find(t => t.id === dragElementId);
  if (!task) return;

  task.dragclass = newdragclass;
      await fetch(`${BASE_URL}addTask/${dragElementId}/dragclass.json`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json'},
          body: `"${newdragclass}"`
      });
      loadDetails(cardFromFirebase);
  } catch (error) {handleApiError(error, "moveTo");}
}

/**
 * Loads contacts from Firebase
 */
async function loadContacts() {
  
  const RESPONSE = await fetch(`${BASE_URL}contacts/contactlist.json`);
  const DATA = await RESPONSE.json();
  if (DATA) {
    contacts_from_firebase = DATA;
  } 
}

/**
 * Loads tasks from Firebase and processes them based on reference
 * @param {string} ref - The reference to determine processing method
 */
async function loadTasks(ref) {
  try {
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
  } else {
    splitCardsByStatus(cardFromFirebase)
    countUrgentPriority(cardFromFirebase)}
  } catch (error) {handleApiError(error, "loadTasks");}
}

/**
 * Fetches contacts from Firebase and populates the contacts array
 */
async function fetchContacts() {
  try {  let response = await fetch(BASE_URL + "contacts.json");
  let responseToJSON = await response.json();
  let contactObj = responseToJSON.contactlist || responseToJSON;
  for (let id in contactObj) {
      let contactData = contactObj[id];
      contactData.id = id;
      contacts.push(contactData); 
  }
  }
  
  catch (error){
     console.error("Failed to load contacts:", error);
  }
}

/**
 * Adds a new contact to Firebase
 * @param {Event} event - The submit event
 */
async function addContact(event) {
  event.stopPropagation();
  const data = getContactData();
  await saveContactToFirebase(data);
  closeForm(event);
  await refreshContacts();
  contactToast("Contact successfully create");
  buttonTimeOut()
}

/**
 * Gets contact data from form inputs
 * @returns {Object} The contact data
 */
function getContactData() {
  let iName = document.getElementById('input-name').value;
  let iMail = document.getElementById('input-mail').value;
  let iPhone = document.getElementById('input-phone').value;
  let [firstname, ...rest] = iName.trim().split(" ");
  let secondname = rest.join(" ");
  return returnJSONDATANEW(iMail, iPhone, firstname, secondname);
}

/**
 * Saves contact data to Firebase
 * @param {Object} data - The contact data to save
 */
async function saveContactToFirebase(data) {
  try{
  await fetch(BASE_URL + "contacts/contactlist.json", {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)})
  } catch (error) {handleApiError(error, "saveContactToFirebase");}
}

/**
 * Edits an existing contact in Firebase
 * @param {number} index - The index of the contact to edit
 */
async function editContact(index) {
  if (isContactUnchanged(index)) return;
  const data = getEditedContactData(index);
  await updateContactInFirebase(index, data);
  closeForm();
  await refreshContacts();
  updateContactContentAfterEdit(index);
  contactToast("Contact successfully edit");
  buttonTimeOut()
}

/**
 * Checks if contact data has changed
 * @param {number} index - The index of the contact to check
 * @returns {boolean} True if contact is unchanged
 */
function isContactUnchanged(index) {
  const { name, mail, tel } = contacts[index];
  const iName = document.getElementById('input-name').value;
  const iMail = document.getElementById('input-mail').value;
  const iPhone = document.getElementById('input-phone').value;
  const originalName = `${name.firstname} ${name.secondname}`;
  const cleanedPhone = iPhone === "<i> Please update your phone number <i>" ? "" : iPhone;
  return (iName === originalName && iMail === mail && (iPhone === tel)) ||
         (iName === originalName && iMail === mail && cleanedPhone === tel);
}

/**
 * Gets edited contact data from form inputs
 * @param {number} index - The index of the contact being edited
 * @returns {Object} The edited contact data
 */
function getEditedContactData(index) {
  const { color } = contacts[index];
  const iName = document.getElementById('input-name').value;
  const iMail = document.getElementById('input-mail').value;
  const iPhone = document.getElementById('input-phone').value;
  const [firstname, ...rest] = iName.trim().split(" ");
  
  return returnJSONDATA(color, iMail, iPhone, firstname, rest.join(" "));
}

/**
 * Updates contact data in Firebase
 * @param {number} index - The index of the contact to update
 * @param {Object} data - The updated contact data
 */
async function updateContactInFirebase(index, data) {
  try{
  const url = BASE_URL + `contacts/contactlist/${contacts[index].id}.json`;
  await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)});
  } catch (error) {handleApiError(error, "updateContactInFirebase");}
}

/**
 * Deletes a contact from Firebase
 * @param {number} index - The index of the contact to delete
 */
async function deleteContact(index) {
  let url = BASE_URL + `contacts/contactlist/${contacts[index].id}.json`;
  await fetch(url, { method: 'DELETE' });
  closeForm();
  if (window.innerWidth >= 981){showNoContact()}
  else {showNoContact(); mobileBack()};
  contacts = [];
  contactToast("Contact successfully delete");
  await init();
  buttonTimeOut()
}

/**
 * Timeout function to disable add contact buttons temporarily
 * * @param {string} error -  The error message
 * * @param {string} source - The source of the error
 */
function handleApiError(error, source = "unknown") {
  console.error(`API-Fehler [${source}]:`, error.message);
}