

function renderContact(i) {
    return `<label class="dropdown-item sp_between">
            <div class="dpf_cc gap8">
                <div id="contactDropdownList_${i}" class="iconConact dpf_cc">${contact[i].slice(0, 2)}  </div>
                <span id="contactName">${contact[i]}</span>
            </div>
                <input type="checkbox" id="categoryCheckbox${i}" onchange="selectContacts(${i}, this)">
            </label>`;
}

function renderCategory(i) {
  return `
       <label class="dropdown-item" onclick="changeCategory(this)">
            <span>${category[i]}</span>
        </label>`;
}

function subtask(addSubtask, subtaskArray) {
  addSubtask.innerHTML = "";

  for (let i = 0; i < subtaskArray.length; i++) {
   
      addSubtask.innerHTML += `

        <div class="taskOutput dpf_cc sp_between" id="taskOutput-${i}">・ ${subtaskArray[i]}
          <div class="editdeleteBtn">
            <button type="button" class="iconButtonsForImg" onclick="editSubtask(${i})"><img src="./assets/svg/edit.svg" alt="pancel"></button>
            <div class="sepraratorSubtask"></div>
            <button type="button" class="iconButtonsForImg" onclick="deleteTask(${i})"><img src="./assets/svg/delete.svg" alt="arrow"></button>
          </div>
        </div>

        <div class="dnone dpf_cc sp_between containerEditSubtask" id="containerEditSubtask-${i}">
          <input id="editInputSubtask-${i}" class="stylingInput" >
          <div class="dpf_cc">
            <button type="button" class="iconButtonsForImg" onclick="clearEditSubtask(${i})"><img src="./assets/svg/delete.svg" alt="pancel"></button>
            <div class="sepraratorSubtask"></div>
            <button type="button" class="iconButtonsForImg" onclick="addEditSubtask(${i})"><img src="./assets/svg/check.svg" alt="arrow"></button>
          </div>
        </div>
`
    }
  }


function renderSubtaskButtons() {
  const input = document.getElementById("subtaskReadOut");
  const buttonContainer = document.getElementById("inputButtons");
  const value = input.value.trim();

  buttonContainer.innerHTML = "";

  if (value !== "") {
    buttonContainer.innerHTML = `

      <button type="button" class="iconButtonsForImg hover" onclick="cleanInput()" id="addBtn">
        <img src="./assets/svg/close.svg" alt="cancel">
      </button>
      <div class="sepraratorSubtask"></div>
      <button type="button" class="iconButtonsForImg hover" onclick="addSubtask()" id="cancelBtn">
        <img src="./assets/svg/check.svg" alt="check">
      </button>

    `;
  }
}

function renderCalender() {
  let caldenerOpen = document.getElementById("calender")

  caldenerOpen.innerHTML += 
    `<div class="datePicker">
            <div class="datepickerTop">
                <div class="btnGroup">
                    <button type="button" class="tag" onclick="pickDate(0)">Today</button>
                    <button type="button" class="tag" onclick="pickDate(1)">Tomorrow</button>
                    <button type="button" class="tag" onclick="pickDate(2)">in 2 days</button>
                </div>
                <div class="monthSelector">
                    <button type="button" id="reverse" class="arrow" onclick="changeMonth(-1)"><i class="icons change180">➜</i></button>
                    <span class="monthName" id="month">Oktober</span>
                    <span class="monthName" id="year">2025</span>
                    <button type="button" id="forward" class="arrow" onclick="changeMonth(1)"><i class="icons">➜</i></button>
                </div>
            </div> 
            <div class="datepickerCalender">
                <span class="day">Mo</span>
                <span class="day">Tu</span>
                <span class="day">We</span>
                <span class="day">Th</span>
                <span class="day">Fr</span>
                <span class="day">Sa</span>
                <span class="day">Su</span>
            </div>
            <div class="datepickerCalender mg-t8" id="calenderDays"></div>
        </div>`;
        
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();

  initMonthDisplay();
  renderCalendarDays(currentMonth, currentYear);  
}