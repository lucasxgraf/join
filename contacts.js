/**
 * Array zum Speichern der vorhandenen Kontakte.
 * @type {Array<{name: string, email: string, tel: string, bg: string, selected: boolean}>}
 */
let oldContacts = [];

/**
 * Enthält Anfangsbuchstaben zur Sortierung oder weiteren Verarbeitung.
 * @type {Array<string>}
 */
let letters = [];

/**
 * Speichert den aktuell ausgewählten Kontakt.
 * @type {string}
 */
let selectedName;

/**
 * Kennzeichnet, ob die Detailansicht geöffnet ist.
 * @type {boolean}
 */
let openContact = false;

/**
 * Index des aktuell ausgewählten Kontakts innerhalb von oldContacts.
 * @type {number}
 */
let selectedContactIndex;

/**
 * Initialisiert die Kontakte, indem sie geladen und anschließend gerendert werden.
 * @async
 */
async function initContacts() {
    const storedContacts = (await getItem("oldContacts")) || "[]";
    oldContacts = JSON.parse(storedContacts);
    renderOldContacts();
}

/**
 * Fügt nach dem Laden des DOM eine Eingabeformatierung für das Telefonfeld hinzu.
 */
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("contact-tel").addEventListener("input", function () {
        if (this.value.startsWith("+")) this.value = "+" + this.value.slice(1).replace(/[^0-9]/g, "");
        else this.value = this.value.replace(/[^0-9]/g, "");
    });
});

/**
 * Rendert die gespeicherten Kontakte in der Liste.
 */
function renderOldContacts() {
    let renderContact = document.getElementById("contactName");
    let currentLetter = null;
    renderContact.innerHTML = "";
    oldContacts.sort((a, b) => a.name.localeCompare(b.name));
    getVariablesToRender(renderContact, currentLetter);
}

/**
 * Durchläuft oldContacts und rendert jeden Eintrag.
 * @param {HTMLElement} renderContact - Das Container-Element für die Ausgabe.
 * @param {string|null} currentLetter - Aktueller Buchstabe für die Gruppierung.
 */
function getVariablesToRender(renderContact, currentLetter) {
    for (let i = 0; i < oldContacts.length; i++) {
        const oldContact = oldContacts[i];
        let name = oldContact["name"];
        let mail = oldContact["email"];
        let bg = oldContact["bg"];
        name = name.charAt(0).toUpperCase() + name.slice(1);
        let initials = name
            .split(" ")
            .map((n) => n[0])
            .join("");
        let sortedByLetter = name.charAt(0);

        if (sortedByLetter !== currentLetter) {
            currentLetter = sortedByLetter;
            renderContact.innerHTML += generateRegisterHTML(sortedByLetter);
        }
        renderContact.innerHTML += renderContactToRegister(i, bg, initials, name, mail);
    }
}

/**
 * Zeigt die Detailansicht eines Kontakts.
 * @param {number} i - Index des Kontakts im Array oldContacts.
 */
function showContact(i) {
    document.querySelectorAll(".contact-item").forEach((item) => {
        item.classList.remove("setUserproperty");
    });
    document.getElementById("contact" + i).classList.add("setUserproperty");
    const resizeContact = document.getElementById("resize-contact");
    resizeContact.classList.remove("d-none");
    resizeContact.classList.remove("d-none-1300");
    selectedName = oldContacts[i];
    let name = selectedName["name"];
    let mail = selectedName["email"];
    let number = selectedName["tel"];
    let bg = selectedName["bg"];
    let initials = name
        .split(" ")
        .map((n) => n[0])
        .join("");
    let letter = name.charAt(0);
    letters.push(letter);
    let contact = document.getElementById("open-contact");
    contact.classList.remove("d-none");
    contact.innerHTML = "";
    contact.innerHTML += generateHTMLshowContact(name, mail, number, bg, initials, i);
}

/**
 * Wechselt die Anzeige der Kontakt-Details.
 * @param {number} i - Index des anzuzeigenden Kontakts.
 */
function toggleContact(i) {
    if (window.innerWidth >= 1350) {
        if (openContact && selectedContactIndex === i) {
            document.getElementById("open-contact").classList.add("d-none");
            openContact = false;
            document.querySelectorAll(".contact-item").forEach((item) => {
                item.classList.remove("setUserproperty");
            });
        } else {
            showContact(i);
            openContact = true;
            selectedContactIndex = i;
        }
    } else {
        document.querySelectorAll(".contact-item").forEach((item) => {
            item.classList.remove("setUserproperty");
        });
        showContact(i);
        openContact = true;
        selectedContactIndex = i;
    }
}

/**
 * Erstellt einen neuen Kontakt und fügt ihn der Liste hinzu.
 * @async
 */
async function createContact() {
    let name = document.getElementById("contact-name").value;
    let mail = document.getElementById("contact-email").value;
    let tel = document.getElementById("contact-tel").value;
    let selected = false;
    let x = Math.floor(Math.random() * 255);
    let y = Math.floor(Math.random() * 255);
    let z = Math.floor(Math.random() * 255);

    let newContact = {
        name: name,
        email: mail,
        tel: tel,
        bg: `rgb(${x},${y},${z})`,
        selected,
    };

    oldContacts = oldContacts.concat(newContact);
    await setItem("oldContacts", JSON.stringify(oldContacts));
    renderOldContacts();
    closePopUp();
}

/**
 * Speichert Änderungen an einem bestehenden Kontakt.
 * @param {number} i - Index des zu aktualisierenden Kontakts.
 */
async function saveContact(i) {
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");

    let newName = document.getElementById("old-name").value;
    let newMail = document.getElementById("old-email").value;
    let newTel = document.getElementById("old-tel").value;

    oldContacts[i]["name"] = newName;
    oldContacts[i]["email"] = newMail;
    oldContacts[i]["tel"] = newTel;

    showContact(i);
    renderOldContacts();
    await setItem("oldContacts", JSON.stringify(oldContacts));
}

/**
 * Öffnet das Bearbeitungs-Modal für einen Kontakt.
 * @param {string} name - Name des Kontakts.
 * @param {string} mail - E-Mail-Adresse des Kontakts.
 * @param {string} number - Telefonnummer des Kontakts.
 * @param {string} bg - Hintergrundfarbe für die Anzeige.
 * @param {string} initials - Initialen des Kontakts.
 * @param {number} i - Index des Kontakts in oldContacts.
 */
function editContact(name, mail, number, bg, initials, i) {
    document.getElementById("edit-pop-up").classList.remove("d-none");
    document.getElementById("edit-pop-up").classList.add("d-flex");

    let edit = document.getElementById("edit-pop-up");
    edit.innerHTML = "";
    edit.innerHTML += generateEditContactHTML(bg, initials, name, mail, number, i);
}

/**
 * Löscht einen Kontakt aus der Liste.
 * @param {number} i - Index des zu löschenden Kontakts.
 */
async function deleteContact(i) {
    oldContacts.splice(i, 1);
    letters.splice(i, 1);
    document.getElementById("open-contact").classList.add("d-none");
    renderOldContacts();
    await setItem("oldContacts", JSON.stringify(oldContacts));
}

/**
 * Öffnet das Popup zum Anlegen eines Kontakts.
 */
function openPopUp() {
    document.getElementById("pop-up").classList.remove("d-none");
    document.getElementById("pop-up").classList.add("d-flex");
}

/**
 * Schließt das Popup zum Hinzufügen oder Bearbeiten eines Kontakts.
 */
function closePopUp() {
    document.getElementById("pop-up").classList.add("d-none");
    document.getElementById("pop-up").classList.remove("d-flex");
    document.getElementById("edit-pop-up").classList.add("d-none");
    document.getElementById("edit-pop-up").classList.remove("d-flex");
    document.getElementById("contact-name").value = "";
    document.getElementById("contact-email").value = "";
    document.getElementById("contact-tel").value = "";
}

/**
 * Öffnet die mobile Ansicht für die Kontaktanzeige.
 */
function openMobileName() {
    document.getElementById("resize-contact").classList.remove("d-none-1300");
}

/**
 * Schließt die Kontaktansicht auf mobilen Geräten.
 */
function closeContact() {
    document.getElementById("resize-contact").classList.add("d-none-1300");
}
