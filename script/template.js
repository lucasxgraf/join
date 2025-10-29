

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