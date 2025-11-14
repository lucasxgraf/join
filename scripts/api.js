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
  renderContactOnHTML(contactFromFirebase)
}

async function addTask() {
  let titel = document.getElementById("title");
  let discription = document.getElementById("discription");
  let date = document.getElementById("duedate");
  let category = document.getElementById("selectedCategory")

  const newTask = {
    "title": titel.value,
    "description": discription.value,
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