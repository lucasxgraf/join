
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
                            <label for="title" aria-label="title">Title<span class="req">*</span></label>
                            <input type="text" id="title" class="task-input inputBorderColor" placeholder="Enter a title" onblur="validateInput('titleError', 'title', 'title')" oninput="enableSubmit()">
                            <div id="titleError" class="error_message"></div>
                        </div>
                        <div class="input_field">
                            <label for="description" aria-label="Title">Description</label>
                            <textarea id="description" class="task-input inputBorderColor" placeholder="Enter a description"></textarea>
                        </div>
                        <div class="input_field">
                            <label for="duedate" aria-label="Date">Due date<span class="req">*</span></label>
                            <div id="date" class="task-input dpf sp_between inputBackground inputWrapper">
                                <input type="text" class="fontColor cleanInputforDate" id="duedate" placeholder="dd/mm/yyyy" maxlength="10" onblur="validateInput('dateError', 'duedate', 'date')" oninput="this.value = this.value.replace(/[^0-9\/]/g, ''); enableSubmit()">
                                </input>
                                <button type="button" onmousedown="keepFocusOnDate(event)" onclick="toggleCalender('calender', 'duedate')" class="iconButtonsForImg dpf_cc"><img src="../assets/svg/calender.svg" alt="calender icon"></button>
                            </div>
                            <div id="dateError" class="error_message"></div>
                            <div class="calender" id="calender"></div>
                        </div>
                    </div>
                </div>

                <div class="separator"></div>
               
                <div class="add-task-container-right">
                    <div class="task-input-container">
                        <div class="input_field">
                            <label for="urgentBtnAddTask" aria-label="Priority">Priority</label>
                            <div class="priority-buttons">
                                <button type="button" id="urgentBtnAddTask" class="urgent_btn priority-btn dpf_cc" onclick="changePriority('urgent','AddTask')">Urgent<span class="urgent_icon"></span></button> 
                                <button type="button" id="mediumBtnAddTask" class="medium-btn priority-btn dpf_cc" onclick="changePriority('medium','AddTask')">Medium <span class="medium_icon"></span></button>
                                <button type="button" id="lowBtnAddTask" class="low_btn priority-btn dpf_cc" onclick="changePriority('low','AddTask')">Low <span class="low_icon"></span></button>
                            </div>
                        </div>

                        <div class="input_field">
                            <label for="selectedAssigned" aria-label="Assigned_to">Assigned to</label>
                            <div class="custom-category-dropdown" id="contactDropdown">
                                <div class="dropdown-header inputWrapper" onclick="toggleDropdown('contactDropdown', 'iconContact')">
                                     <input class="fontColor stylingInput cleanInputforDate" type="text" readonly id="selectedAssigned" placeholder="Select contacts to assign">
                                    <div class="dropdown-arrow" id="dropdownArrow"> <img src="../assets/img/arrow_drop_down.png" alt="arrow down icon"></div>
                                </div>
                                <div class="dropdown-list" id="categoryDropdownList">
                                    <div id="labelContact"></div>
                                </div>
                                <div id="iconContact" class="dpf gap8"></div>
                            </div>
                        </div>

                        <div class="input_field">
                            <label for="selectedCategory" aria-label="Category">Category<span class="req">*</span></label>
                                <div class="custom-category-dropdown" id="categoryDropdown">
                                    <div class="dropdown-header inputWrapper" id="categoryDropdownInput" onclick="toggleDropdown('categoryDropdown')">
                                        <input class="fontColor stylingInput cleanInputforDate" type="text" readonly id="selectedCategory" placeholder="Select task category">
                                        <div class="dropdown-arrow" id="dropdownArrow">
                                            <img src="../assets/img/arrow_drop_down.png" alt="arrow down icon">
                                        </div>
                                    </div>
                                    <div class="dropdown-list" id="categoryDropdownList">
                                        <div id="labelCategory"></div>
                                    </div>
                                </div>
                            <div id="categoryError" class="error_message"></div>
                        </div>

                        <div class="input_field">
                            <label for="subtaskReadOut" aria-label="Subtasks">Subtasks</label>
                                <div class="input-wrapper">
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
                    <button type="submit" disabled id="submit" class="btn btn_create dpf_cc" onclick="initTaskFormEvents()">Create Task
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
  return `<label for="categoryCheckbox${i}" class="dropdown-item sp_between">
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
  let caldenerOpen = document.getElementById(currentid)
  caldenerOpen.innerHTML += 
    `<div class="datePicker">
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


function renderCard(element) {
  const SUBTASKS = getSubtasksArray(element.subtask);
  const TOTAL = SUBTASKS.length;
  const DONE = calcCompleted(SUBTASKS);
  const PROGRESS = calcProgress(SUBTASKS);
  const CONTACTS = renderContactBadges(element.contact || []);

  return `
    <div class="card" draggable="true" ondragstart="startDrag('${element.id}')" ondragend="stopDrag('${element.id}')" onclick="openOverlay('${element.id}')" ontouchstart="handleTouchStart(event, '${element.id}')"
     ontouchmove="handleTouchMove(event)" ontouchend="handleTouchEnd(event, '${element.id}')">
      <div class="cardBorder"> 
        <div class="card_header_responsive">
          <div class="card_category ${element.category.toLowerCase().replace(/\s+/g,'_')}" id="cardCategrory">${element.category}</div>
          <button class="card_header_swap_icon" onclick="toggleSwapCategory(event, '${element.id}')">            
            <img src="../assets/svg/swap_mobile.svg" id="swapCategory" alt="swap icon">
          </button>
        </div>
        <div class="card_content">
          <div class="card_title" id="cardTitle">${element.title}</div>
          <div class="card_description" id="cardDescription">${element.description}</div>
        </div>
        ${TOTAL > 0 ? `
        <div class="subtask_container">
          <div class="subtaskProgressBar">
            <div class="subtaskProgressBarCalc" style="width:${PROGRESS}%"></div>
          </div>
          <div class="subtask">${DONE}/${TOTAL} Subtasks</div>
        </div>
        ` : ''}
        <div class="cardFooter">
          <div class="contact_badges" id="cardContact">
            ${CONTACTS}
          </div>
          <div class="overlay_card_priority_img overlay_card_priority_img_${(element.priority||'').toLowerCase()}"></div>
      </div>
      </div>
    </div>
  `;
}


function renderSwapDropDown(taskId, currentDragClass) {
  const columns = [
    { value: 'todo', label: 'To Do' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'awaitfeedback', label: 'Await Feedback' },
    { value: 'done', label: 'Done' }
  ];
  
  const filteredColumns = columns.filter(col => col.value !== currentDragClass);
  
  let columnSwapCategory = '<div class="dropdown-list_swap"><span class="dropdown-header-text">Move To</span>';
  
  filteredColumns.forEach(col => {
    columnSwapCategory += `
      <div class="dropdown-item-resp" onclick="swapToColumn(event, '${taskId}', '${col.value}')">
        <span>${col.label}</span>
      </div>
    `;
  });
  
  columnSwapCategory += '</div>';
  
  return columnSwapCategory;
}


function renderOverlayCard(CARD, OVERLAY_CARD) {
  OVERLAY_CARD.innerHTML = `
  <div class="overlay_card_header">
    <div class="${String(CARD.category||'').toLowerCase().replace(/\s+/g,'_')}">
      <div class="overlay_card_category">${CARD.category||''}</div>
    </div>
      <button class="overlay_close_btn" onclick="toggleOverlay()">×</button>
  </div>

    <h3 class="overlay_card_title">${CARD.title||''}</h3>

    <div class="overlay_card_description">${CARD.description||''}
    </div>

    <div class="overlay_card_due_date_container">
      <span>Due Date:</span>
      <div>${CARD.date||''}</div>
    </div>

    <div class="overlay_card_priority_container">
      <span>Priority:</span>
      <div class="overlay_card_priority_layout">${CARD.priority||''}
        <div class="overlay_card_priority_img overlay_card_priority_img_${(CARD.priority||'').toLowerCase()}"></div>
      </div>
    </div>

    <div class="overlay_card_assigned_to_container">
      <span>Assigned To:</span>
      <div id="overlayAssignToContact" class="overlay_card_assigned_to_layout">  
      </div>
    </div>

    <div class="overlay_card_subtasks_container">
      <span>Subtasks</span>
      <div id="overlaySubtask" class="overlay_card_subtask_layout"></div>
    </div>

    <div class="overlay_card_footer">
      <button onclick="overlayDeleteCard()">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_75592_9951" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
          <rect x="0.144531" width="24" height="24" fill="currentColor"/>
          </mask>
          <g mask="url(#mask0_75592_9951)">
          <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453ZM7.14453 6V19H17.1445V6H7.14453ZM9.14453 16C9.14453 16.2833 9.24036 16.5208 9.43203 16.7125C9.6237 16.9042 9.8612 17 10.1445 17C10.4279 17 10.6654 16.9042 10.857 16.7125C11.0487 16.5208 11.1445 16.2833 11.1445 16V9C11.1445 8.71667 11.0487 8.47917 10.857 8.2875C10.6654 8.09583 10.4279 8 10.1445 8C9.8612 8 9.6237 8.09583 9.43203 8.2875C9.24036 8.47917 9.14453 8.71667 9.14453 9V16ZM13.1445 16C13.1445 16.2833 13.2404 16.5208 13.432 16.7125C13.6237 16.9042 13.8612 17 14.1445 17C14.4279 17 14.6654 16.9042 14.857 16.7125C15.0487 16.5208 15.1445 16.2833 15.1445 16V9C15.1445 8.71667 15.0487 8.47917 14.857 8.2875C14.6654 8.09583 14.4279 8 14.1445 8C13.8612 8 13.6237 8.09583 13.432 8.2875C13.2404 8.47917 13.1445 8.71667 13.1445 9V16Z" fill="#2A3647"/>
          </g>
        </svg>
        Delete
      </button>
        <div class="overlay_card_footer_separator"></div>
      <button onclick="openOverlayEdit('${CARD.id}')">
        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
          <rect x="0.144531" width="24" height="24" fill="currentColor"/>
          </mask>
          <g mask="url(#mask0_75592_9969)">
          <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
          </g>
        </svg>
        Edit
      </button>
    </div>
  `;
}


function showDeleteToast() {
  toast = document.createElement('div');
  toast.innerHTML = `
    <div class="toast_animation">
      <span>Task deleted</span>
      <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <mask id="mask0_delete" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
          <rect x="0.144531" width="24" height="24" fill="white"/>
        </mask>
        <g mask="url(#mask0_delete)">
          <path d="M7.14453 21C6.59453 21 6.1237 20.8042 5.73203 20.4125C5.34036 20.0208 5.14453 19.55 5.14453 19V6C4.8612 6 4.6237 5.90417 4.43203 5.7125C4.24036 5.52083 4.14453 5.28333 4.14453 5C4.14453 4.71667 4.24036 4.47917 4.43203 4.2875C4.6237 4.09583 4.8612 4 5.14453 4H9.14453C9.14453 3.71667 9.24036 3.47917 9.43203 3.2875C9.6237 3.09583 9.8612 3 10.1445 3H14.1445C14.4279 3 14.6654 3.09583 14.857 3.2875C15.0487 3.47917 15.1445 3.71667 15.1445 4H19.1445C19.4279 4 19.6654 4.09583 19.857 4.2875C20.0487 4.47917 20.1445 4.71667 20.1445 5C20.1445 5.28333 20.0487 5.52083 19.857 5.7125C19.6654 5.90417 19.4279 6 19.1445 6V19C19.1445 19.55 18.9487 20.0208 18.557 20.4125C18.1654 20.8042 17.6945 21 17.1445 21H7.14453Z" fill="white"/>
        </g>
      </svg>
    </div>
  `;
  document.body.appendChild(toast);
  
  setTimeout(() => {
    toast.remove();
  }, 2000);
}


function renderOverlayEditCard(CARD, OVERLAY_CARD) {
  OVERLAY_CARD.innerHTML = `
  <div>
    <button class="overlay_close_btn" onclick="toggleOverlay()">×</button>

    <form>
      <div class="overlay_edit_form_layout">
        <label for="overlayEditTitle">
          <h3>Title</h3>
        </label> 
        <div>
          <label for="overlayEditTitle" aria-label="Enter the Task Title"></label>  
          <input id="overlayEditTitle" placeholder="Enter a title" class="inputBorderColor" type="text" name="title" onblur="validateInput('titleErrorEditOverlay', 'overlayEditTitle', 'overlayEditTitle')" oninput="checkEditOverlayInput()" value="${CARD.title||''}"/>
          <div id="titleErrorEditOverlay" class="error_message"></div>
        </div> 
      </div>
      <div class="overlay_edit_form_layout">
        <label for="overlayEditDescription">
          <h3>Description</h3>
        </label>
        <textarea class="inputBorderColor" placeholder="Enter a description" id="overlayEditDescription" type="text" name="description">${CARD.description||''}</textarea>
      </div>
      <div class="overlay_edit_form_layout">
        <label for="duedateOverlayEdit" aria-label="Date">
          <h3>Due date</h3>
        </label>
        <div> 
          <div id="dateOverlayEdit" class="task-input-editoverlay dpf sp_between inputWrapper">
            <input class="fontColor cleanInputforDate" id="duedateOverlayEdit" value="${CARD.date||''}" onblur="validateInput('dateErrorEditOverlay', 'duedateOverlayEdit', 'dateOverlayEdit')" oninput="this.value = this.value.replace(/[^0-9\/]/g, ''); checkEditOverlayInput()" placeholder="dd/mm/yyyy" 
              maxlength="10">
            </input>
            <button type="button" onmousedown="keepFocusOnDate(event)" onclick="toggleCalender('calenderOverlayEdit','duedateOverlayEdit')" class="iconButtonsForImg dpf_cc"><img src="../assets/svg/calender.svg" alt="calender icon">
            </button> 
            <div class="calender" id="calenderOverlayEdit"></div>
          </div>
            <div id="dateErrorEditOverlay" class="error_message"></div>
        </div> 
      </div>
    </form>

    <div class="OverlayEditContainer">
      <div class="overlay_edit_form_layout">
        <h3>Priority</h3>
          <div class="priority-buttons">
            <button type="button" id="urgentBtnOverlayEdit" class="urgent_btn priority-btn dpf_cc" onclick="changePriority('urgent', 'OverlayEdit')">Urgent<span class="urgent_icon"></span></button> 
            <button type="button" id="mediumBtnOverlayEdit" class="medium-btn priority-btn dpf_cc" onclick="changePriority('medium','OverlayEdit')">Medium <span class="medium_icon"></span></button>
            <button type="button" id="lowBtnOverlayEdit" class="low_btn priority-btn dpf_cc" onclick="changePriority('low','OverlayEdit')">Low <span class="low_icon"></span></button>
          </div>
      </div>

      <div class="overlay_edit_form_layout">
        <h3>Assigned to</h3>
          <div class="custom-category-dropdown witdh100" id="contactDropdownOverlayEdit">
              <div class="dropdown-header" onclick="toggleDropdown('contactDropdownOverlayEdit','iconContactOverlayEdit')">
                  <label for="selectedAssignedEditOverlay" aria-label="select contact to assign task"></label>
                  <input class="fontColor cleanInputforDate" type="text" readonly id="selectedAssignedEditOverlay" placeholder="Select contacts to assign">
                  <div class="dropdown-arrow" id="dropdownArrow"> <img src="../assets/img/arrow_drop_down.png" alt="arrow down icon"></div>
              </div>
              <div class="dropdown-list" id="categoryDropdownList">
                  <div id="labelContactOverlayEdit"></div>
              </div>
              <div id="iconContactOverlayEdit" class="dpf gap8"></div>
          </div>
        </div>

        <div class="overlay_edit_form_layout">
          <h3>Subtasks</h3>
            <div class="input-wrapper">
              <label for="subtaskReadOutEditOverlay" aria-label="add new subtask"></label>
              <input type="text" maxlength="35" class="task-input inputBorderColor witdh100" id="subtaskReadOutEditOverlay" placeholder="Add new subtask" oninput="renderSubtaskButtonsEditOverlay(event)" onkeypress="if(event.key==='Enter'){event.preventDefault();addSubtaskEditOverlay();}">
              <div id="inputButtonsEditOverlay"></div>      
            </div>
            <div class="subtask" id="overlayEditSubtask"></div>
          </div>

      <button type="button" disabled onclick="saveEditedCardToFirebase()" id="submitEditOverlay" class="btn btn_create dpf_cc align-self">Ok
        <img class="checkSvg" src="../assets/svg/check.svg" alt="check icon">
      </button>
  </div>
  `
}


function subtaskEditOverlay(addSubtask, subtaskArray) {
  addSubtask.innerHTML = "";
  
  for (let i = 0; i < subtaskArray.length; i++) {
    const subtaskTitle = typeof subtaskArray[i] === 'object' ? subtaskArray[i].title : subtaskArray[i];
   
    addSubtask.innerHTML += `
      <div class="taskOutput dpf_cc sp_between" id="taskOutputEditOverlay-${i}" ondblclick="editSubtaskEditOverlay(${i})">・ ${subtaskTitle}
        <div class="editdeleteBtn">
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="editSubtaskEditOverlay(${i})"><img src="../assets/svg/edit.svg" alt="pancil, edit icon"></button>
          <div class="sepraratorSubtask"></div>
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="deleteTaskEditOverlay(${i})"><img src="../assets/svg/delete.svg" alt="trash, delete icon"></button>
        </div>
      </div>

      <div class="dnone dpf_cc sp_between containerEditSubtask" id="containerEditSubtaskEditOverlay-${i}">
        <input id="editInputSubtaskEditOverlay-${i}" class="stylingInput" value="${subtaskTitle}">
        <div class="dpf_cc">
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="clearEditSubtaskEditOverlay(${i})"><img src="../assets/svg/delete.svg" alt="trash, delete icon"></button>
          <div class="sepraratorSubtask"></div>
          <button type="button" class="iconButtonsForImg dpf_cc" onclick="addEditSubtaskEditOverlay(${i})"><img src="../assets/svg/check.svg" alt="check icon"></button>
        </div>
      </div>`;
  }
}


function renderSubtaskButtonsEditOverlay(event) {
  const input = event ? event.target : document.getElementById("subtaskReadOutEditOverlay");
  const buttonContainer = document.getElementById("inputButtonsEditOverlay");

  if (!input || !buttonContainer) {
    return;
  }
  
  const value = input.value.trim();

  buttonContainer.innerHTML = "";

  if (value !== "") {
    buttonContainer.innerHTML = `
      <button type="button" class="iconButtonsForImg dpf_cc hover" onclick="cleanInputEditOverlay()" id="addBtn">
        <img src="../assets/svg/close.svg" alt="close icon">
      </button>
      <div class="sepraratorSubtask"></div>
      <button type="button" class="iconButtonsForImg dpf_cc hover" onclick="addSubtaskEditOverlay()" id="cancelBtn">
        <img src="../assets/svg/check.svg" alt="check icon">
      </button>`;
  }
}


function renderContactOnHTMLOverlayEdit(contactFromFirebase, currentId) {
  const contactRef = document.getElementById(currentId);
  contactRef.innerHTML = "";
  
  for (let i = 0; i < contactFromFirebase.length; i++) {
    contactRef.innerHTML += `
    <label class="dropdown-item sp_between">
      <div class="dpf_cc gap8">
        <div id="contactDropdownListEdit_${i}" class="iconConact dpf_cc" style="background-color: ${contactFromFirebase[i].color}">${contactFromFirebase[i].name.firstname.slice(0, 1)}${contactFromFirebase[i].name.secondname.slice(0, 1)}</div>
        <span>${contactFromFirebase[i].name.firstname} ${contactFromFirebase[i].name.secondname}</span>
      </div>
      <input class="checkbox" type="checkbox" onchange="selectContactsOverlayEdit(${i}, this)">
    </label>`;
  }
}