
function renderaddTask() {
  return `
    <main>
        <div class="scroll_layout">
            <h1>Add Task</h1>
            <form id="taskForm">
            <section>
                <div class="add-task-container">
                    <div class="task-input-container">
                        <div class="input_field">
                            <label aria-label="title">Title<span class="req">*</span></label>
                            <input type="text" id="title" class="task-input inputBorderColor" placeholder="Enter a title">
                            <div id="titleError" class="error_message"></div>
                        </div>
                        <div class="input_field">
                            <label aria-label="Title">Description</label>
                            <textarea id="description" class="task-input inputBorderColor" placeholder="Enter a description"></textarea>
                        </div>
                        <div class="input_field">
                            <label aria-label="Date">Due date<span class="req">*</span></label>
                            <div id="date" class="task-input dpf sp_between inputBackground"  >
                                <input class="fontColor cleanInputforDate" id="duedate" placeholder="dd/mm/yyyy" maxlength="10">
                                </input>
                                <button type="button" onclick="toggleCalender()" class="iconButtonsForImg dpf_cc"><img src="../assets/svg/calender.svg" alt="event">
                                </button>
                            </div>
                            <div class="calender" id="calender"></div>
                            <div id="dateError" class="error_message"></div>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>
               
                <div class="add-task-container-right">
                    <div class="task-input-container">
                        <div class="input_field">
                            <label aria-label="Priority">Priority</label>
                            <div class="priority-buttons">
                                <button type="button" id="urgentBtn" class="urgent_btn priority-btn dpf_cc" onclick="changePriority('urgent')">Urgent<span class="urgent_icon"></span></button> 
                                <button type="button" id="mediumBtn" class="medium-btn priority-btn dpf_cc" onclick="changePriority('medium')">Medium <span class="medium_icon"></span></button>
                                <button type="button" id="lowBtn" class="low_btn priority-btn dpf_cc" onclick="changePriority('low')">Low <span class="low_icon"></span></button>
                            </div>
                        </div>

                        <div class="input_field">
                            <label aria-label="Assigned_to">Assigned to</label>
                            <div class="custom-category-dropdown" id="contactDropdown">
                                <div class="dropdown-header" onclick="toggleDropdown('contactDropdown')">
                                    <span>Select contacts to assign</span>
                                    <div class="dropdown-arrow" id="dropdownArrow"> <img src="../assets/img/arrow_drop_down.png" alt="arrow"></div>
                                </div>
                                <div class="dropdown-list" id="categoryDropdownList">
                                    <div id="labelContact"></div>
                                </div>
                                <div id="iconContact" class="dpf gap8"></div>
                            </div>
                        </div>

                        <div class="input_field">
                            <label aria-label="Category">Category<span class="req">*</span></label>
                                <div class="custom-category-dropdown" id="categoryDropdown">
                                    <div class="dropdown-header" onclick="toggleDropdown('categoryDropdown')">
                                        <input class="fontColor cleanInputforDate" id="selectedCategory" placeholder="Select task category">
                                        <div class="dropdown-arrow" id="dropdownArrow">
                                            <img src="../assets/img/arrow_drop_down.png" alt="arrow">
                                        </div>
                                    </div>
                                    <div class="dropdown-list" id="categoryDropdownList">
                                        <div id="labelCategory"></div>
                                    </div>
                                </div>
                            <div id="categoryError" class="error_message"></div>
                        </div>

                        <div class="input_field">
                            <label aria-label="Subtasks">Subtasks</label>
                                <div class="input-wrapper">
                                    <input type="text" class="task-input inputBorderColor" id="subtaskReadOut" placeholder="Add new subtask">
                                    <div id="inputButtons"></div>
                                </div>
                            <div class="subtask" id="addSubtask"></div>
                        </div>
                    </div>
                </div>
            </section>

            <div class="footer_Add_Task">
                <span><span class="req">*</span>This field is required</span>
                <div class="buttons_Add_Task dpf gap8">
                    <button type="button" class="btn btn_clear dpf_cc" onclick="clearInput()">Clear
                        <img class="closeSvg" src="../assets/svg/close.svg" alt="">
                    </button>
                    <button type="submit" disabled id="submit" class="btn btn_create dpf_cc">Create Task
                        <img class="checkSvg" src="../assets/svg/check.svg" alt="">
                    </button>
                </div>
            </div>
            </form>
        </div>
    </main>
    <div class="feedbackAddTask dnone" id="feedback">
        <span>Task added to board</span>
        <img src="../assets/svg/icons_page/board.svg" alt="">
    </div>`;
}

function renderContact(i, contacFromFirebase) {
    return `<label class="dropdown-item sp_between">
            <div class="dpf_cc gap8">
                <div id="contactDropdownList_${i}" class="iconConact dpf_cc" style="background-color: ${contacFromFirebase[i].color}">${contacFromFirebase[i].name.firstname.slice(0, 1)}${contacFromFirebase[i].name.secondname.slice(0, 1)}  </div>
                <span id="contactName">${contacFromFirebase[i].name.firstname} ${contacFromFirebase[i].name.secondname}</span>
            </div>
                <input class="checkbox" type="checkbox" id="categoryCheckbox${i}" onchange="selectContacts(${i}, this)">
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
      const subtaskTitle = typeof subtaskArray[i] === 'object' ? subtaskArray[i].title : subtaskArray[i];
     
      addSubtask.innerHTML += `
  
        <div class="taskOutput dpf_cc sp_between" id="taskOutput-${i}">・ ${subtaskTitle}
          <div class="editdeleteBtn">
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="editSubtask(${i})"><img src="../assets/svg/edit.svg" alt="pancel"></button>
            <div class="sepraratorSubtask"></div>
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="deleteTask(${i})"><img src="../assets/svg/delete.svg" alt="arrow"></button>
          </div>
        </div>
  
        <div class="dnone dpf_cc sp_between containerEditSubtask" id="containerEditSubtask-${i}">
          <input id="editInputSubtask-${i}" class="stylingInput" value="${subtaskTitle}">
          <div class="dpf_cc">
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="clearEditSubtask(${i})"><img src="../assets/svg/delete.svg" alt="pancel"></button>
            <div class="sepraratorSubtask"></div>
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="addEditSubtask(${i})"><img src="../assets/svg/check.svg" alt="arrow"></button>
          </div>
        </div>`;
    }
  }

function renderSubtaskButtons() {
  const input = document.getElementById("subtaskReadOut");
  
  const buttonContainer = document.getElementById("inputButtons");
  const value = input.value.trim();

  buttonContainer.innerHTML = "";

  if (value !== "") {
    buttonContainer.innerHTML = `

      <button type="button" class="iconButtonsForImg dpf_cc hover" onclick="cleanInput()" id="addBtn">
        <img src="../assets/svg/close.svg" alt="cancel">
      </button>
      <div class="sepraratorSubtask"></div>
      <button type="button" class="iconButtonsForImg dpf_cc hover" onclick="addSubtask()" id="cancelBtn">
        <img src="../assets/svg/check.svg" alt="check">
      </button>`;
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
                    <button type="button" id="reverse" class="arrow dpf_cc" onclick="changeMonth(-1)"><img class="change180" src="../assets/svg/chevron_arrow.svg" alt=""></button>
                    <span class="monthName" id="month">Oktober</span>
                    <span class="monthName" id="year">2025</span>
                    <button type="button" id="forward" class="arrow dpf_cc" onclick="changeMonth(1)"><img src="../assets/svg/chevron_arrow.svg" alt=""></button>
                </div>
            </div> 
            <div class="datepickerCalender">
                <span class="day dpf_cc">Mo</span>
                <span class="day dpf_cc">Tu</span>
                <span class="day dpf_cc">We</span>
                <span class="day dpf_cc">Th</span>
                <span class="day dpf_cc">Fr</span>
                <span class="day dpf_cc">Sa</span>
                <span class="day dpf_cc">Su</span>
            </div>
            <div class="datepickerCalender mg-t8" id="calenderDays"></div>
        </div>`;
        
  const today = new Date();
  currentMonth = today.getMonth();
  currentYear = today.getFullYear();

  initMonthDisplay();
  renderCalendarDays(currentMonth, currentYear);  
}