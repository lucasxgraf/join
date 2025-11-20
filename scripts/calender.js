const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];
let currentDate = new Date();
let currentMonth = currentDate.getMonth(); // 0–11
let currentYear = currentDate.getFullYear();

function checkDate(duedateInput) {
  if (!isValidFutureDate(duedateInput.value)) {
    duedateInput.focus();
      return false;
  }
  return true;
}

// villeicht für den Responisv mode geeignet?
// function pickDateResponsiv() {
//   const today = new Date(); // aktuelles Datum holen
//   const year = today.getFullYear();
//   const month = String(today.getMonth() + 1).padStart(2, '0'); // Monat (0–11) → +1 und mit führender Null
//   const day = String(today.getDate()).padStart(2, '0'); // Tag mit führender Null
//   let inputDate = document.getElementById("duedate")
//   const dateString = `${day}/${month}/${year}`;
  
//   inputDate.value = ""
//   inputDate.value = dateString;

// }

function pickDate(offsetDays = 0) {
  const today = new Date();
  today.setDate(today.getDate() + offsetDays);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  selectedDate = `${day}/${month}/${year}`;

  const inputDate = document.getElementById("duedate");
  if (inputDate) {
    inputDate.value = selectedDate;
  }
  const calender = document.getElementById("calender");
  if (calender) {
    calender.innerHTML = "";
  }
  enableSubmit()
}


function isValidFutureDate(value) {
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

function toggleCalender(currentid) {
  let caldenerOpen = document.getElementById(currentid)

if (caldenerOpen.innerHTML.trim() === ""){
  renderCalender(currentid)
}else{
    caldenerOpen.innerHTML = ""

  } 
}
// Anzeige beim Laden initialisieren
function initMonthDisplay() {
  document.getElementById("month").textContent = monthNames[currentMonth];
  document.getElementById("year").textContent = currentYear;
}

function changeMonth(direction) {
  currentMonth += direction;

  if (currentMonth > 11) {
    currentMonth = 0;
    currentYear++;
  } else if (currentMonth < 0) {
    currentMonth = 11;
    currentYear--;
}

  document.getElementById("month").textContent = monthNames[currentMonth];
  document.getElementById("year").textContent = currentYear;

  renderCalendarDays(currentMonth, currentYear);

}

function renderCalendarDays(month, year) {
  const grid = document.getElementById("calenderDays");
  grid.innerHTML = "";
  const today = new Date(); today.setHours(0,0,0,0);

  const days = new Date(year, month + 1, 0).getDate();
  const offset = (new Date(year, month, 1).getDay() + 6) % 7;
  grid.innerHTML += "<span></span>".repeat(offset);

  for (let d = 1; d <= days; d++) {
    const date = new Date(year, month, d);
    const btn = document.createElement("button");
    btn.textContent = d; btn.type = "button";
    handleDayButton(btn, date, today, d, month, year);
    grid.appendChild(btn);
  }
}

function handleDayButton(btn, date, today, d, month, year) {
  const isPast = date < today;
  const isToday = date.toDateString() === today.toDateString();

  btn.className = isPast ? "dateFaded" : "date";
  if (isToday) btn.classList.add("currentDate");
  if (isPast) return (btn.disabled = true);

  btn.onclick = () => {
    const val = `${String(d).padStart(2,"0")}/${String(month+1).padStart(2,"0")}/${year}`;
    document.getElementById("duedate").value = val;
    document.getElementById("calender").innerHTML = "";
    enableSubmit() 
  };
}