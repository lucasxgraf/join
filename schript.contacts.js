async function postData(path="contacts/contactlist.json", data={task}) {
  let response = await fetch(BASE_URL + path,{
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify(data)
  });
   return response.json();
}

async function addTaskContact() {

  const newTask = {
    "Name": "Benedikt Ziegler",
    "E-Mail": "ziegler@join.com",
    "Telefon": "+49 1111 1111 11 3",
  };
  task.push(newTask);
   return postData("contacts/contactlist.json", newTask);
}