
const task = [];
const BASE_URL = "https://add-task-2efc5-default-rtdb.europe-west1.firebasedatabase.app/";
let subtaskArray = [];
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

async function postData(path="addTask.json", data={task}) {
  let response = await fetch(BASE_URL + path,{
    method: "POST",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify(data)
  });
   return response.json();
}

async function addTask() {
   event.preventDefault();
  let titel = document.getElementById("title");
  let discription = document.getElementById("discription");
  let date = document.getElementById("duedate");
  let category = document.getElementById("selectedCategory")


  const newTask = {
    "titel": titel.value,
    "discription": discription.value,
    "date": date.innerText,
    "subtask": String(subtaskArray), // Create a copy of the subtaskArray
    "priority": selectedPriority,
    "contact": contactList,
    "category": category.innerText

  };
  task.push(newTask);
   return postData("addTask.json", newTask);
}

  document.getElementById("taskForm").addEventListener("submit", handleSubmit);
async function handleSubmit(event) {
  event.preventDefault(); // Stoppt den sofortigen Reload
  const form = event.target;

  // Browser prüft required → wenn ungültig, kommt diese Funktion gar nicht so weit.
  if (!form.checkValidity()) {
    // sorgt dafür, dass der Browser seine eigene Fehlermeldung anzeigt
    form.reportValidity();
    return;
  }

  try {
    await addTask();   // Task erzeugen + posten
    form.submit();     // jetzt den echten Submit auslösen
  } catch (err) {
    console.error("Fehler beim Speichern:", err);
  }
}


function toggleContactDropdown() {
  const dropdown = document.getElementById("contactDropdown");
  dropdown.classList.toggle("open");

  renderIcon()
}

function toggleCategoryDropdown() {
  const dropdown = document.getElementById("categoryDropdown");
  dropdown.classList.toggle("open");

}

function changeCategory(selection) {
  let text = "";
  if (typeof selection === "string") {
    text = selection;
  } else if (selection instanceof Element) {
    const span = selection.querySelector("span");
    text = span ? span.innerText.trim() : selection.innerText.trim();
  }
  const display = document.getElementById("selectedCategory");
  if (display && text) {
    display.textContent = text;
  }
  toggleCategoryDropdown();
}

function addSubtask() {
  const readout = document.getElementById("subtaskReadOut");
  const addSubtaskContainer = document.getElementById("addSubtask");

  const value = readout.value.trim();
  if (value === "") return; // nichts leeres speichern

  // Enter Sinvoll?
  // document.getElementById("subtaskReadOut").addEventListener("keypress", (event) => {  
  // if (event.key === "Enter") addSubtask();
  // });
  subtaskArray.push(value);
  subtask(addSubtaskContainer, subtaskArray);

  readout.value = "";
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
      console.log('Priorität zurückgesetzt');
      return;
    }

// Sonst: alle anderen deaktivieren
    buttons.forEach(btn => btn.classList.remove('active'));

// Aktuellen aktivieren
    button.classList.add('active');

// speichern
    selectedPriority = button.textContent.trim().split(' ')[0];
    console.log('Ausgewählte Priorität:', selectedPriority);
  });
});
// ######################################################################

function fetchSVGs() {
  const svgs = [
    { path: './assets/svg/priority_symblos/urgent.svg', selector: '#urgentBtn .urgent_icon' },
    { path: './assets/svg/priority_symblos/Medium.svg', selector: '#mediumBtn .medium_icon' },
    { path: './assets/svg/priority_symblos/Low.svg', selector: '#low_btn .low_icon' }
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

let contactList = [];
let contactBadge = [];

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
  iconConact.innerHTML = ""; // alte Anzeige leeren

  // max. 9 anzeigen
  const visibleBadges = contactBadge.slice(0, 9);

  // Badges einfügen
  visibleBadges.forEach(badge => {
    iconConact.appendChild(badge.cloneNode(true));
  });

  // Wenn mehr als 9 gespeichert sind → "+ Badge" anhängen
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

  // Wenn geschlossen (also "open" wurde entfernt)
  if (!dropdown.classList.contains("open")) {
    iconConactHTML(); // oder dein console.log("Dropdown geschlossen")
  }

  // Wenn geöffnet kannst du hier z. B. renderIcon() ausführen
  else {
    renderIcon();
  }

}

function deleteTask(i){

  const addSubtask = document.getElementById("addSubtask"); // dein Container-Element
  subtaskArray.splice(i, 1);
  subtask(addSubtask, subtaskArray);
}

function cleanInput() {
  let input = document.getElementById("subtaskReadOut")
  input.value = "";  
}

function editSubtask(i) {
  // aktuellen Wert aus dem Array holen
  const oldValue = subtaskArray[i];

  // neuen Wert abfragen (z. B. per Prompt)
  const newValue = prompt("Subtask ändern:", oldValue);

  // prüfen, ob der Nutzer was eingegeben hat
  if (newValue !== null && newValue.trim() !== "") {
    subtaskArray[i] = newValue.trim(); // neuen Wert speichern
    subtask(document.getElementById("addSubtask"), subtaskArray); // Liste neu rendern
  }
}

function pickDate() {
  const today = new Date(); // aktuelles Datum holen
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat (0–11) → +1 und mit führender Null
  const day = String(today.getDate()).padStart(2, '0'); // Tag mit führender Null
  let inputDate = document.getElementById("duedate")
  const dateString = `<div class="fontColorBl">${day}/${month}/${year}</div>`;
  
  inputDate.innerHTML = ""
  inputDate.innerHTML = dateString;

} 
  
//  mehr farben? 
                      // "#FF7A00",
                      // "#9327FF",
                      // "#6E52FF",
                      // "#FC71FF",
                      // "#FFBB2B",
                      // "#1FD7C1",
                      // "#FF3D00", // Rot-Orange
                      // "#FF6EC7", // Rosa
                      // "#C427FF", // Lila
                      // "#5A00FF", // Dunkles Violett
                      // "#00C2FF", // Hellblau
                      // "#00FFB3", // Türkisgrün
                      // "#FFD319", // Gelb
                      // "#FF5A5A", // Koralle
                      // "#B86BFF", // Flieder
                      // "#FF8DC7", // Hellrosa
                      // "#2AE8A8", // Minzgrün
                      // "#FF9F1C", // Warmes Orange
                      // "#F72585", // Magenta
                      // "#7209B7"