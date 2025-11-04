const BASE_URL = "https://join-ee4e0-default-rtdb.europe-west1.firebasedatabase.app/";

async function postData(path="addTask.json", data={task}) {
  let response = await fetch(BASE_URL + path,{
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify(data)
  });
   return response.json();
}


async function addTask() {
  let titel = document.getElementById("title");
  let discription = document.getElementById("discription");
  let date = document.getElementById("duedate");
  let category = document.getElementById("selectedCategory")

  const newTask = {
    "titel": titel.value,
    "discription": discription.value,
    "date": date.value || date.innerText,
    "subtask": subtaskArray,
    "priority": selectedPriority,
    "contact": contactList,
    "category": category.value,
    "dragclass": "todo"

  };
  task.push(newTask);
  clearInput()
  enableSubmit()
  console.log(newTask);
  
   return postData("addTask.json", newTask);
}
// #####################################################################################