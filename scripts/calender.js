const monthNames = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"];
let currentDate = new Date();
let currentMonth = currentDate.getMonth();
let currentYear = currentDate.getFullYear();


function checkDate(duedateInput) {
  if (!isValidFutureDate(duedateInput.value)) {
    duedateInput.focus();
      return false;
  }
  return true;
}


function pickDate(offsetDays = 0, displayid, currentid) {
  
  const today = new Date();
  today.setDate(today.getDate() + offsetDays);

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  selectedDate = `${day}/${month}/${year}`;

  const inputDate = document.getElementById(displayid);
  if (inputDate) {
    inputDate.value = selectedDate;
  }
  const calender = document.getElementById(currentid);
  if (calender) {
    closeCalender(currentid)
  }
  enableSubmit()
  inputDate.focus()
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


function toggleCalender(currentid, displayid) {
  let caldenerOpen = document.getElementById(currentid)

if (caldenerOpen.innerHTML.trim() === ""){
  renderCalender(currentid, displayid) 
}else{
    closeCalender(currentid, displayid)
  }
}

function closeCalender (currentid, displayid) {
 let calenderCloseRef = document.getElementById(currentid)
 calenderCloseRef.innerHTML = ""

if (currentid === "calenderOverlayEdit") {
  validateInput('titleErrorEditOverlay', 'overlayEditTitle', 'overlayEditTitle')
}
else
 validateInput('dateError', 'duedate', 'date')
}


function initMonthDisplay() {
  document.getElementById("month").textContent = monthNames[currentMonth];
  document.getElementById("year").textContent = currentYear;
}


function changeMonth(direction, currentid, displayid) {
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
  renderCalendarDays(currentMonth, currentYear, currentid, displayid);
}


function renderCalendarDays(month, year, currentid, displayid) {
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
    handleDayButton(btn, date, today, d, month, year, currentid, displayid);
    grid.appendChild(btn);
  }
}


function handleDayButton(btn, date, today, d, month, year, currentid, displayid) {
  const isPast = date < today;
  const isToday = date.toDateString() === today.toDateString();

  btn.className = isPast ? "dateFaded" : "date";
  if (isToday) btn.classList.add("currentDate");
  if (isPast) return (btn.disabled = true);

  btn.onclick = () => {
    const val = `${String(d).padStart(2,"0")}/${String(month+1).padStart(2,"0")}/${year}`;
    document.getElementById(displayid).value = val;
    closeCalender(currentid)
    enableSubmit() 
  };
}

/**
 * Validates the due date input field
 * @param {string} [inputId="duedate"] - The ID of the date input element
 * @param {string} [errorId="dateError"] - The ID of the error message element
 * @param {string|null} [wrapperId=null] - The ID of the wrapper element for error styling
 * @returns {boolean} True if date is valid, false otherwise
 */
function validateDueDate(inputId = "duedate", errorId = "dateError", wrapperId = null) {
  const dateRegex = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  const duedateInput = document.getElementById(inputId);
  const value = duedateInput.value.trim();
  duedateInput.classList.remove("error");

  if (wrapperId) {
    const wrapper = document.getElementById(wrapperId);
    if (wrapper) wrapper.classList.remove("errorBorder");
  }

  const isValid = duedateError(dateRegex, value, duedateInput, wrapperId, errorId);
  return isValid;
}

/**
 * Validates date format and checks if date is today or in the future
 * @param {RegExp} dateRegex - Regular expression for date format validation
 * @param {string} value - The date value to validate
 * @param {HTMLInputElement} duedateInput - The date input element
 * @param {string|null} wrapperId - The ID of the wrapper element for error styling
 * @param {string} errorId - The ID of the error message element
 * @returns {boolean} True if date is valid, false otherwise
 */
function duedateError(dateRegex, value, duedateInput, wrapperId, errorId) {
  const addErrorBorder = () => {
    if (wrapperId) {
      document.getElementById(wrapperId)?.classList.add('errorBorder');
    }};

  if (!dateRegex.test(value)) {
    showError(errorId, "Please select a valid date format DD/MM/YYYY.");
    addErrorBorder();
    return false;
  }

  if (!checkDate(duedateInput)) {
    showError(errorId, "The date must be today or in the future.");
    addErrorBorder();
    return false;
  }
  return true;
}