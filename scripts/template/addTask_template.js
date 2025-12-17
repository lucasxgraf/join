
function renderaddTask() {
  return `
    <main>
        <div class="scroll_layout">
            <h1 class="content_header content_header_addTask_responsiv">Add Task</h1>
            <form id="taskForm">
            <section>
                <div class="add-task-container">
                    <div class="task-input-container">
                        <div class="input_field">
                          <div>
                            <label for="title" aria-label="title">Title<span class="req">*</span></label>
                          </div>
                            <input type="text" id="title" class="task-input inputBorderColor mg-t4" placeholder="Enter a title" onblur="validateInput('titleError', 'title', 'title')" oninput="enableSubmit()">
                            <div id="titleError" class="error_message mg-b2"></div>
                        </div>
                        <div class="input_field">
                          <div>
                            <label for="description" aria-label="Title">Description</label>
                          </div>
                            <textarea id="description" class="task-input inputBorderColor mg-t4 mg-b16" placeholder="Enter a description"></textarea>
                        </div>
                        <div class="input_field p_realtive">
                          <div>
                            <label for="duedate" aria-label="Date">Due date<span class="req">*</span></label>
                          </div>
                            <div id="date" class="task-input dpf sp_between inputBackground inputWrapper mg-t4">
                                <input type="text" class="fontColor cleanInputforDate" id="duedate" placeholder="dd/mm/yyyy" maxlength="10" onblur="validateInput('dateError', 'duedate', 'date')" oninput="this.value = this.value.replace(/[^0-9\/]/g, ''); enableSubmit()">
                                </input>
                                <button type="button" onmousedown="keepFocusOnDate(event)" onclick="toggleCalender('calender', 'duedate')" class="iconButtonsForImg dpf_cc"><img src="../assets/svg/calender.svg" alt="calender icon"></button>
                            </div>
                            <div id="dateError" class="error_message mg-b2"></div>
                            <div class="calender" id="calender"></div>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>
               
                <div class="add-task-container-right">
                    <div class="task-input-container">
                        <div class="input_field">
                          <div>
                            <label for="urgentBtnAddTask" aria-label="Priority">Priority</label>
                          </div>
                            <div class="priority-buttons mg-t4 mg-b16">
                                <button type="button" id="urgentBtnAddTask" class="urgent_btn priority-btn dpf_cc" onclick="changePriority('urgent','AddTask')">Urgent<span class="urgent_icon"></span></button> 
                                <button type="button" id="mediumBtnAddTask" class="medium-btn priority-btn dpf_cc" onclick="changePriority('medium','AddTask')">Medium <span class="medium_icon"></span></button>
                                <button type="button" id="lowBtnAddTask" class="low_btn priority-btn dpf_cc" onclick="changePriority('low','AddTask')">Low <span class="low_icon"></span></button>
                            </div>
                        </div>

                        <div class="input_field p_realtive">
                            <div>
                              <label for="selectedAssigned" aria-label="Assigned_to">Assigned to</label>
                            </div>
                            <div class="custom-category-dropdown mg-t4 mg-b16" id="contactDropdown">
                                <div class="dropdown-header inputWrapper" onclick="toggleDropdown('contactDropdown', 'iconContact')">
                                    <input class="fontColor stylingInput cleanInputforDate" type="text" readonly id="selectedAssigned" placeholder="Select contacts to assign">
                                    <button type="button" class="dropdown-arrow" id="dropdownArrow"> 
                                      <img src="../assets/img/arrow_drop_down.png" alt="arrow down icon">
                                    </button>
                                </div>
                                <div class="dropdown-list" id="categoryDropdownList">
                                    <div id="labelContact"></div>
                                </div>
                                <div id="iconContact" class="dpf gap8"></div>
                            </div>
                        </div>

                        <div class="input_field p_realtive">
                          <div>
                            <label for="selectedCategory" aria-label="Category">Category<span class="req">*</span></label>
                          </div>
                                <div class="custom-category-dropdown mg-t4 mg-b2" id="categoryDropdown">
                                    <div class="dropdown-header inputWrapper" id="categoryDropdownInput" onclick="toggleDropdown('categoryDropdown')">
                                        <input class="fontColor stylingInput cleanInputforDate" type="text" readonly id="selectedCategory" placeholder="Select task category">
                                        <button type="button" class="dropdown-arrow" id="dropdownArrow">
                                            <img src="../assets/img/arrow_drop_down.png" alt="arrow down icon">
                                        </button>
                                    </div>
                                    <div class="dropdown-list" id="categoryDropdownList">
                                        <div id="labelCategory"></div>
                                    </div>
                                </div>
                            <div id="categoryError" class="error_message"></div>
                        </div>

                        <div class="input_field">
                          <div>
                            <label for="subtaskReadOut" aria-label="Subtasks">Subtasks</label>
                          </div>
                                <div class="input-wrapper mg-t4">
                                    <input type="text" maxlength="35" class="task-input inputBorderColor" id="subtaskReadOut" placeholder="Add new subtask">
                                    <div id="inputButtons"></div>
                                </div>
                            <div class="subtask" id="addSubtask"></div>
                        </div>
                    </div>
                </div>
            </section>

           <div class="reqContainer dpf">              
                <span class="req">*</span>This field is required</span>             
           </div>
                    

            <div class="footer_Add_Task">
                <div class="buttons_Add_Task dpf gap8">
                    <button type="button" class="btn btn_clear dpf_cc" onclick="clearInput()">Clear
                        <img class="closeSvg" src="../assets/svg/close.svg" alt="close icon">
                    </button>
                    <button type="button" disabled id="submit" class="btn btn_create dpf_cc" onclick="initTaskFormEvents()">Create Task
                        <img class="checkSvg" src="../assets/svg/check.svg" alt="check icon">
                    </button>
                </div>
            </div>
            </form>
        </div>
    </main>
    <div class="feedbackAddTaskContainer dnone" id="feedback">
        <div class="feedbackAddTask">
            <span>Task added to board</span>
            <img class="feedbackIcon" src="../assets/svg/icons_page/board.svg" alt="board icon">
        </div>
    </div>`;
}


function renderContact(i, contacFromFirebase) {
  return `
    <label for="categoryCheckbox${i}" class="dropdown-item sp_between">
      <div class="dpf_cc gap8">
        <div id="contactDropdownList_${i}" class="iconConact dpf_cc" style="background-color: ${contacFromFirebase[i].color}">${contacFromFirebase[i].name.firstname.slice(0, 1)}${contacFromFirebase[i].name.secondname.slice(0, 1)}  </div>
        <span id="contactName">${contacFromFirebase[i].name.firstname} ${contacFromFirebase[i].name.secondname}</span>
      </div>
        <input class="checkbox" type="checkbox" id="categoryCheckbox${i}" onchange="selectContacts(${i}, this)">
    </label>`;
}

function renderCategory(i) {
  return `
       <div class="dropdown-item" onclick="changeCategory(this)">
            <span>${category[i]}</span>
        </div>`;
}


function subtask(addSubtask, subtaskArray) {
    addSubtask.innerHTML = "";
  
    for (let i = 0; i < subtaskArray.length; i++) {
      const subtaskTitle = typeof subtaskArray[i] === 'object' ? subtaskArray[i].title : subtaskArray[i];
     
      addSubtask.innerHTML += `
  
        <div class="taskOutput dpf_cc sp_between" id="taskOutput-${i}" ondblclick="editSubtask(${i})">・ ${subtaskTitle}
          <div class="editdeleteBtn">
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="editSubtask(${i})"><img src="../assets/svg/edit.svg" alt="pencil, edit icon"></button>
            <div class="sepraratorSubtask"></div>
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="deleteTask(${i})"><img src="../assets/svg/delete.svg" alt="trash, delete icon"></button>
          </div>
        </div>
  
        <div class="dnone dpf_cc sp_between containerEditSubtask" id="containerEditSubtask-${i}">
          <input id="editInputSubtask-${i}" class="stylingInput" value="${subtaskTitle}">
          <div class="dpf_cc">
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="clearEditSubtask(${i})"><img src="../assets/svg/delete.svg" alt="trash, delete icon"></button>
            <div class="sepraratorSubtask"></div>
            <button type="button" class="iconButtonsForImg dpf_cc" onclick="addEditSubtask(${i})"><img src="../assets/svg/check.svg" alt="check icon"></button>
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
        <img src="../assets/svg/close.svg" alt="close icon">
      </button>
      <div class="sepraratorSubtask"></div>
      <button type="button" class="iconButtonsForImg dpf_cc hover" onclick="addSubtask()" id="cancelBtn">
        <img src="../assets/svg/check.svg" alt="check icon">
      </button>`;
  }
}


function renderCalender(currentid, displayid) {
  let calenderOpen = document.getElementById(currentid)
  calenderOpen.innerHTML += 
    `<div class="datePicker datePickerZ">
            <div class="datepickerTop">
                <div class="btnGroup">
                    <button type="button" class="tag" onclick="pickDate(0, '${displayid}', '${currentid}')">Today</button>
                    <button type="button" class="tag" onclick="pickDate(1, '${displayid}', '${currentid}')">Tomorrow</button>
                    <button type="button" class="tag" onclick="pickDate(2, '${displayid}', '${currentid}')">in 2 days</button>
                </div>
                <div class="monthSelector">
                    <button type="button" id="reverse" class="arrow dpf_cc" onclick="changeMonth(-1, '${currentid}', '${displayid}')"><img class="change180" src="../assets/svg/chevron_arrow.svg" alt="chevron left"></button>
                    <div>
                        <span class="monthName" id="month">Oktober</span>
                        <span class="monthName" id="year">2025</span>
                      </div>
                    <button type="button" id="forward" class="arrow dpf_cc" onclick="changeMonth(1, '${currentid}', '${displayid}')"><img src="../assets/svg/chevron_arrow.svg" alt="chevron right"></button>
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
  renderCalendarDays(currentMonth, currentYear, currentid, displayid);  
}


