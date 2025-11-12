/**
 * Array zum Speichern der Aufgabenobjekte.
 * @type {Array}
 */
let tasks = [];

/**
 * Kennung des aktuell gezogenen Aufgaben-Elements.
 * @type {string|number}
 */
let currentDraggedElement;

/**
 * Speichert die Daten des aktuell geöffneten Task-Modals.
 * @type {Array}
 */
let currentTaskModal = [];

/**
 * Initialisiert das Board, indem Aufgaben geladen und die Oberfläche aktualisiert wird.
 * @async
 */
async function initBoard() {
    tasks = JSON.parse((await getItem("tasks")) || "[]");
    updateTasks();
}

/**
 * Richtet Event Listener ein, nachdem der DOM vollständig geladen wurde.
 */
document.addEventListener("DOMContentLoaded", function () {
    document.body.addEventListener("click", function (event) {
        if (event.target.id === "cardModal" || event.target.closest("#cardModal")) {
            let isClickOnOpenTask = event.target.classList.contains("openTask") || event.target.closest(".openTask") !== null;
            if (!isClickOnOpenTask) {
                closeCardModal("cardModal-container");
            }
        }
        if (event.target.id === "addTaskModal" || event.target.closest("#addTaskModal")) {
            let isClickInsideAddTaskTemplateContent = event.target.id === "addTaskTemplateContent" || event.target.closest("#addTaskTemplateContent") !== null;
            if (!isClickInsideAddTaskTemplateContent) {
                closeCardModal("addTaskModal");
            }
        }
        if (event.target.id === "card-modal-id" || event.target.closest("#card-modal-id")) {
            let isClickInsideInEditTaskModal = event.target.id === "card-modal-content" || event.target.closest("#card-modal-content") !== null;
            if (!isClickInsideInEditTaskModal) {
                closeEditCardModal(currentTaskModal.id);
            }
        }
    });
});

/**
 * Aktualisiert die auf dem Board dargestellten Aufgaben.
 * @async
 */
async function updateTasks() {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    document.getElementById("toDo").innerHTML = "";
    document.getElementById("inProgress").innerHTML = "";
    document.getElementById("feedback").innerHTML = "";
    document.getElementById("done").innerHTML = "";

    tasks.forEach((taskData) => {
        sections[taskData.progress].innerHTML += getCardModal(taskData);
    });
}

/**
 * Startet den Drag-Vorgang einer Aufgabenkarte.
 * @param {string|number} id - Die Kennung der gezogenen Aufgabe.
 */
function startDragging(id) {
    currentDraggedElement = id;
}

/**
 * Erlaubt einen Drop-Vorgang auf einem Ziel und verhindert das Standardverhalten.
 * @param {Event} event - Das Dragover-Event.
 */
function allowDrop(event) {
    event.preventDefault();
}

/**
 * Verschiebt eine Aufgabe in die angegebene Fortschritts-Spalte.
 * @param {string} category - Die Zielspalte der Aufgabe.
 * @async
 */
async function moveTo(category) {
    let foundIndex = tasks.findIndex((task) => task.id === currentDraggedElement);
    if (foundIndex !== -1) tasks[foundIndex].progress = category;
    else {
        console.error("Element nicht gefunden in tasks");
        return;
    }
    updateTasks();
    await setItem("tasks", JSON.stringify(tasks));
}

/**
 * Erzeugt den HTML-Inhalt für eine Aufgabenkarte.
 * @param {Object} task - Das Aufgabenobjekt, für das HTML erzeugt wird.
 * @returns {string} Der generierte HTML-String der Karte.
 */
function getCardModal(task) {
    let circleTemplate = getCircleTemplate(task);
    let prioSVG = getPrioSVG(task);
    let totalSubtasks = task.subtasks.length;
    let completedSubtasks = task.subtasks.filter((subtask) => subtask.completed).length;
    let progressValue = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
    let subTaskWrapperHTML = totalSubtasks > 0 ? generateTodoSubtask(progressValue, completedSubtasks, totalSubtasks) : "";
    return getTaskCardTemplate(task, subTaskWrapperHTML, circleTemplate, prioSVG);
}

/**
 * Gibt den HTML-String für die Kreise mit den Initialen der zugewiesenen Personen zurück.
 * @param {Object} task - Die Aufgabe mit den Daten in assignedTo.
 * @returns {string} HTML-String, der Kreise mit Initialen darstellt.
 */
function getCircleTemplate(task) {
    return task.assignedTo.map((person) => {
        let initials = person.name.split(" ").map((namePart) => namePart.charAt(0)).join("");
        let backgroundColor = person.bg ? ` style="background-color: ${person.bg};"` : "";
        return `<div class="profileBadge"${backgroundColor}>${initials}</div>`;
    }).join("");
}

/**
 * Gibt den SVG-HTML-String passend zur Priorität der Aufgabe zurück.
 * @param {Object} task - Das Aufgabenobjekt mit Priorität.
 * @returns {string} SVG-HTML für die Prioritätsanzeige.
 */
function getPrioSVG(task) {
    switch (task.priority) {
        case "Low":
            return getPrioLowSVG();
        case "Medium":
            return getPrioMediumSVG();
        case "Urgent":
            return getPrioUrgentSVG();
        default:
            return "";
    }
}

/**
 * Filtert Aufgaben anhand eines Suchbegriffs und zeigt nur passende Einträge an.
 * @param {string} searchText - Der Suchtext für die Filterung.
 */
function handleSearchChange(searchText) {
    if (searchText.trim() === "") {
        updateTasks();
    } else {
        let filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(searchText.toLowerCase()) || task.description.toLowerCase().includes(searchText.toLowerCase()));
        updateFilteredTasks(filteredTasks);
    }
}

/**
 * Aktualisiert das Board mit einer gefilterten Aufgabenliste.
 * @param {Array} filteredTasks - Die Aufgaben, die den Filterkriterien entsprechen.
 */
function updateFilteredTasks(filteredTasks) {
    let sections = {
        toDo: document.getElementById("toDo"),
        inProgress: document.getElementById("inProgress"),
        feedback: document.getElementById("feedback"),
        done: document.getElementById("done"),
    };

    Object.keys(sections).forEach((section) => {
        sections[section].innerHTML = "";
    });

    filteredTasks.forEach((task) => {
        let taskTemplate = getCardModal(task);
        if (sections[task.progress]) {
            sections[task.progress].innerHTML += taskTemplate;
        }
    });
}

/**
 * Hebt eine Aufgabenkarte durch Hinzufügen einer CSS-Klasse hervor.
 * @param {string} id - Die ID der hervorzuhebenden Karte.
 */
function highlight(id) {
    document.getElementById(id).classList.add("contentContainerHover");
}

/**
 * Entfernt die Hervorhebung einer Karte, indem die CSS-Klasse gelöscht wird.
 * @param {string} id - Die ID der Karte, deren Hervorhebung entfernt werden soll.
 */
function removeHighlight(id) {
    document.getElementById(id).classList.remove("contentContainerHover");
}

/**
 * Schließt ein Karten-Modal, indem eine CSS-Klasse zum Ausblenden gesetzt wird.
 * @param {string} id - Die ID des zu schließenden Modals.
 */
function closeCardModal(id) {
    document.getElementById(id).classList.add("d-none");
    document.getElementById('hidden-overflow').classList.remove('height100');
    document.body.style.overflow = "";
}

/**
 * Öffnet ein Karten-Modal, füllt es mit Aufgabendaten und deaktiviert das Seiten-Scrolling.
 * @param {string|number} taskId - Die Kennung der anzuzeigenden Aufgabe.
 */
function openCardModal(taskId) {
    let task = tasks.find((task) => task.id.toString() === taskId.toString());
    if (task) {
        document.getElementById("cardModalID").innerHTML = getTaskTemplate(task);
        document.getElementById('hidden-overflow').classList.add('height100');
    } 
}

/**
 * Erzeugt HTML zur Darstellung der zugewiesenen Personen im Aufgaben-Modal.
 * @param {Array} assignedTo - Die Liste der zugewiesenen Personen.
 * @returns {string} HTML-String für die Anzeige der Personen.
 */
function getAssignedToTemplate(assignedTo) {
    return assignedTo.map((person) => {
            let initials = person.name.split(" ").map((name) => name[0]).join("");
            return /*html*/ `
            <div class="assignedContact">
                <div class="nameCircleWrapper">
                    <div class="nameCircle" style="background-color: ${person.bg};">${initials}</div>
                    <p class="assignedName">${person.name}</p>
                </div>
            </div>`;}).join("");
}

/**
 * Erzeugt HTML zur Darstellung der Unteraufgaben im Modal.
 * @param {Array} subtasks - Die Unteraufgaben der Aufgabe.
 * @param {string|number} taskId - Die Kennung der Aufgabe.
 * @returns {string} HTML-String zur Anzeige der Unteraufgaben.
 */
function getSubtasksTemplate(subtasks, taskId) {
    return subtasks.map((subtask) => {
            const isChecked = subtask.completed ? "checked" : "";
            return /*html*/ `
            <div class="subtask">
                <input class="checkbox" type="checkbox" ${isChecked} onclick="toggleSubtaskCompleted(${taskId}, ${subtask.id})"/>
                <div class="checkboxDescription">${subtask.title}</div>
            </div>`;}).join("");
}

/**
 * Wechselt den Erledigt-Status einer Unteraufgabe und aktualisiert den Speicher.
 * @param {string|number} taskId - Die Kennung der übergeordneten Aufgabe.
 * @param {string|number} subtaskId - Die Kennung der Unteraufgabe.
 * @async
 */
async function toggleSubtaskCompleted(taskId, subtaskId) {
    let taskIndex = tasks.findIndex((task) => task.id === taskId);
    if (taskIndex !== -1) {
        let subtaskIndex = tasks[taskIndex].subtasks.findIndex((subtask) => subtask.id === subtaskId);
        if (subtaskIndex !== -1) {
            tasks[taskIndex].subtasks[subtaskIndex].completed = !tasks[taskIndex].subtasks[subtaskIndex].completed;
            await setItem("tasks", JSON.stringify(tasks));
            updateTasks();
        }
    }
}

/**
 * Erzeugt das HTML-Template für die Detailansicht einer Aufgabe im Modal.
 * @param {Object} task - Das darzustellende Aufgabenobjekt.
 * @returns {string} Das HTML-Template der Details.
 */
function getTaskTemplate(task) {
    let assignedToHtml = getAssignedToTemplate(task.assignedTo);
    let subtasksHtml = getSubtasksTemplate(task.subtasks, task.id);
    let prioSVG = getPrioSVG(task);
    currentTaskModal = task;
    return generateTaskTemplateHTML(task, assignedToHtml, subtasksHtml, prioSVG);
}

/**
 * Löscht eine Aufgabe vom Board und aktualisiert den Speicher.
 * @param {string|number} taskId - Die Kennung der zu löschenden Aufgabe.
 * @async
 */
async function deleteTask(taskId) {
    closeCardModal("cardModal-container");
    tasks = tasks.filter((task) => task.id !== taskId);
    await setItem("tasks", JSON.stringify(tasks));
    updateTasks();
}

/**
 * Bereitet das Add-Task-Template vor und zeigt es im Modal an.
 * @param {string} progress - Der anfängliche Fortschrittsstatus der neuen Aufgabe.
 * @async
 */
async function loadAddTaskTemplate(progress) {
    document.body.style.overflow = "hidden";
    document.getElementById("addTaskModalID").innerHTML = addTaskTemplate();
    await initTask(progress);
    createdFromBoard = true;
    document.getElementById("medium-button-id").classList.add("active");
    document.getElementById('hidden-overflow').classList.add('height100');
}

function closeEditCardModal(id) {
    document.body.style.overflow = "";
    openCardModal(id);
    document.getElementById('cardModal-container').classList.add("d-none");
}

/**
 * Bereitet das Bearbeitungs-Template vor und zeigt es im Modal an.
 * @async
 */
async function editTask() {
    await initTask("noProgress");
    document.getElementById("cardModal-container").innerHTML = editTaskTemplate();
    setEditValuesOfTaskModal();
    rotateIcon("nav-image-assigned");
}

/**
 * Gibt ein Array der ausgewählten (zugewiesenen) Personen aus der UI zurück.
 * @returns {Array<Object>} Liste der ausgewählten Personen mit Name und Hintergrundfarbe.
 */
function getSelectedAssigneds() {
    return assigneds.filter((assigned) => assigned.selected).map((assigned) => {
            return { name: assigned.name, bg: assigned.bg,
            };
        });
}
