function addFormTemplate(index) {
    return `<div class="add-contact-form" id="add-Form">
            <div class="text-form" style="background-color: #2A3647; width: 40%;">
                <img class="margin-left36" src="../assets/img/logo/join_logo_vector.svg" style="height: 50px; width: 50px;">
                <h1 class="margin-left36 c-white">Add Contact</h1>
                <h3 class="margin-left36 c-white" style="font-weight: 400;">Tasks are better with a team!</h3>
                <div class="margin-left36 divider-small"></div>
            </div>
            <div style="display: flex; width: 60%; align-items: center;" class="inner-form">
            <img class="img-ppicture" style="margin-left: 72px;" src="../assets/svg/default_contact_profilepicture.svg">
            <div class="add-form">
                <img src="../assets/svg/close.svg" id="x-button-form" onclick="closeForm(event)">
                <div id="group-name"><input type="text" placeholder="Name" id="input-name"><img style="margin-left: -36px; margin-bottom: -6px;;" src="../assets/svg/person_input.svg"></div>
                <div id="group-mail"><input type="text" placeholder="E-Mail" id="input-mail"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/email.svg"></div>
                <div id="group-phone"><input type="text" placeholder="Phone" id="input-phone"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/call.svg"></div>
                <div style="display: flex; gap: 16px;">
                    <button style="width: 80px" id="cancel-contact" onclick="closeForm(event)">Cancel<img src="../assets/icons/icon_cancel.svg" id="cancel-contact-img"></button>
                    <button style="width: 160px" id="create-contact" onclick="formCheck(${index}, event)">Create contact<img src="/assets/icons/check_createcontact.svg"></button>
                </div>
            </div>
        </div>
    </div>`
}

function editContactTemplate(index) {
    return `<div class="add-contact-form" id="edit-Form">
            <div class="text-form" style="background-color: #2A3647; width: 40%;">
                <img class="margin-left36" src="../assets/img/logo/join_logo_vector.svg" style="height: 50px; width: 50px;">
                <h1 class="margin-left36 c-white">Edit Contact</h1>
                <div class="margin-left36 divider-small"></div>
            </div>
            <div style="display: flex; width: 60%; align-items: center;">
            <button class="big-contact-picture" style ="background-color: ${contacts[index]["color"]}; margin-left: 72px;">${contactPictureLetters(index)}</button>
            <div class="add-form">
                <img src="../assets/svg/close.svg" id="x-button-form" onclick="closeForm(event)">
                <div id="group-name"><input type="text" placeholder="Name" id="input-name"><img style="margin-left: -36px; margin-bottom: -6px;;" src="../assets/svg/person_input.svg"></div>
                <div id="group-mail"><input type="text" placeholder="E-Mail" id="input-mail"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/email.svg"></div>
                <div id="group-phone"><input type="text" placeholder="Phone" id="input-phone"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/call.svg"></div>
                <div style="display: flex; gap: 16px;">
                    <button style="width: 80px" id="cancel-contact" onclick="deleteContact(${index})">Delete<img img src="../assets/svg/close.svg" id="cancel-contact-img"></button>
                    <button style="width: 160px" id="create-contact" onclick="formCheck(${index}, event)">Save<img src="../assets/svg/check_white.svg"></button>
                </div>
            </div>
        </div>
    </div>`
}

function showContactTemplate(index) {
    return `<div class="info-content" id="showContent${index}">
    <div style="display: flex; gap: 48px">
    <button class="big-contact-picture" style ="background-color: ${contacts[index]["color"]};">${contactPictureLetters(index)}</button>
    <div style="display: flex; flex-direction: column;">
        <h2 class="fullname">${contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"]}</h2>
         <div class="contact-icons">
                <img id="edit" src="../assets/svg/edit.svg" onclick="editContactEvent(${index})">
                <img id="delete" src="../assets/svg/delete.svg" onclick="deleteContact(${index})">
         </div>
    </div>
    </div>
    <div class="informations">
        <h2>Contact Information</h2>
        <p style="font-weight: 700">Email</p>
        <p style="color: #007CEE">${contacts[index]["mail"]}</p>
        <p style="font-weight: 700">Phone</p>
        <p>${contacts[index]["tel"]}</p>
    </div>
    </div>
    `
}

function showContactAfterEditTemplate(index) {
    return `<div class="info-content" id="showContent${index}">
    <div style="display: flex; gap: 48px">
    <button class="big-contact-picture" style ="background-color: ${contacts[index]["color"]};">${contactPictureLetters(index)}</button>
    <div style="display: flex; flex-direction: column;">
        <h2 class="fullname">${contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"]}</h2>
         <div class="contact-icons">
                <img id="edit" src="../assets/svg/edit_contact_icon_default.svg" onclick="editContactEvent(${index})">
                <img id="delete" src="../assets/svg/delete_contact_icon_default.svg" onclick="deleteContact(${index})">
         </div>
    </div>
    </div>
    <div class="informations">
        <h2>Contact Information</h2>
        <p style="font-weight: 700">Email</p>
        <p style="color: #007CEE">${contacts[index]["mail"]}</p>
        <p style="font-weight: 700">Phone</p>
        <p>${contacts[index]["tel"]}</p>
    </div>
    </div>
    `
}

function contactAddedAlert() {
    return `<div class="alert" id="create-contact-alert"><p>Contact successfully created</p></div>`
}

function contactMobileAddedAlert() {
    return `<div class="alert" id="create-contact-alert"><p>Contact successfully created</p></div>`
}

function showMobileContactTemplate(index) {
    return `<div class="info-content" id="showContent${index}">
    <div style="display: flex; gap: 48px" class="m-gap">
    <button class="big-contact-picture" style ="background-color: ${contacts[index]["color"]};">${contactPictureLetters(index)}</button>
    <div style="display: flex; flex-direction: column;">
        <h2 class="fullname">${contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"]}</h2>
    </div>
    </div>
    <div class="informations">
        <h2>Contact Information</h2>
        <p style="font-weight: 700">Email</p>
        <p style="color: #007CEE">${contacts[index]["mail"]}</p>
        <p style="font-weight: 700">Phone</p>
        <p>${contacts[index]["tel"]}</p>
    </div>
    </div>
     <div class="mobile-popup-menu slide-out" id="mobilePopupMenu" style="display: none;">
                <img id="mobile-edit" src="../assets/svg/edit_contact_icon_default.svg" onclick="mobileContactEdit(${index}, event)">
                <img id="mobile-delete" src="../assets/svg/delete_contact_icon_default.svg" onclick="mobileContactDelete(${index})">
     </div>
     <div class="mobile-menu" onclick="toggleMenu(event)"><img src="../assets/svg/three_point_menu.svg"></div>
    `
}

function mobileBackButtonTemplate() {
    return `<div onclick="goBackToContactList()" id="goback-arrow"><img src="../assets/svg/arrow-left-line.svg"></div>`
}

function addMobileFormTemplate(index) {
    return `<div class="add-contact-form" id="add-Form">
            <div class="text-form" style="background-color: #2A3647; width: 40%;">
                <img class="margin-left36" src="../assets/img/logo/join_logo_vector.svg" style="height: 50px; width: 50px;">
                <h1 class="margin-left36 c-white">Add Contact</h1>
                <h3 class="margin-left36 c-white" style="font-weight: 400;">Tasks are better with a team!</h3>
                <div class="margin-left36 divider-small"></div>
            </div>
            <div style="display: flex; width: 60%; align-items: center;" class="add-form-innerform">
            <img style="" src="../assets/svg/default_contact_profilepicture.svg" class="img-ppicture">
            <div class="add-form">
                <img src="../assets/icons/close_icon_white.svg" id="x-button-form" onclick="closeFormMobile(event)">
                <div id="group-name"><input type="text" placeholder="Name" id="input-name"><img style="margin-left: -36px; margin-bottom: -6px;;" src="../assets/svg/person_input.svg"></div>
                <div id="group-mail"><input type="text" placeholder="E-Mail" id="input-mail"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/mail.svg"></div>
                <div id="group-phone"><input type="text" placeholder="Phone" id="input-phone"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/call.svg"></div>
                <div style="display: flex; gap: 16px;" class="buttons-addform">
                    <button style="width: 80px" id="cancel-contact" onclick="closeForm(event)">Cancel<img src="../assets/icons/icon_cancel.svg" id="cancel-contact-img"></button>
                    <button style="width: 160px" id="create-contact" onclick="formCheck(${index}, event)">Create contact<img src="../assets/icons/check_createcontact.svg"></button>
                </div>
            </div>
        </div>
    </div>`
}

function showContactAfterEditMobile(index) {
    return `<div class="info-content" id="showContent${index}">
    <div style="display: flex; gap: 48px" class="m-gap">
    <button class="big-contact-picture" style ="background-color: ${contacts[index]["color"]};">${contactPictureLetters(index)}</button>
    <div style="display: flex; flex-direction: column;">
        <h2 class="fullname">${contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"]}</h2>
    </div>
    </div>
    <div class="informations">
        <h2>Contact Information</h2>
        <p style="font-weight: 700">Email</p>
        <p style="color: #007CEE">${contacts[index]["mail"]}</p>
        <p style="font-weight: 700">Phone</p>
        <p>${contacts[index]["tel"]}</p>
    </div>
    </div>
     <div class="mobile-popup-menu slide-out" id="mobilePopupMenu" style="display: none;">
                <img id="mobile-edit" src="../assets/svg/edit_contact_icon_default.svg" onclick="mobileContactEdit(${index}, event)">
                <img id="mobile-delete" src="../assets/svg/delete_contact_icon_default.svg" onclick="mobileContactDelete(${index})">
     </div>
     <div class="mobile-menu" onclick="toggleMenu(event)"><img src="../assets/svg/three_point_menu.svg"></div>
    `
}

function mobileEditContactTemplate(index) {
    return `<div class="add-contact-form" id="edit-Form">
            <div class="text-form" style="background-color: #2A3647; width: 40%;">
                <img class="margin-left36" src="../assets/img/logo/join_logo_vector.svg" style="height: 50px; width: 50px;">
                <h1 class="margin-left36 c-white">Edit Contact</h1>
                <div class="margin-left36 divider-small"></div>
            </div>
            <div style="display: flex; width: 60%; align-items: center;" class="inner-form">
            <button class="edit-contact-picture" style ="background-color: ${contacts[index]["color"]}; margin-left: 72px;">${contactPictureLetters(index)}</button>
            <div class="add-form">
                <img src="../assets/icons/close_icon_white.svg" id="x-button-form" onclick="closeFormMobile(event)">
                <div id="group-name"><input type="text" placeholder="Name" id="input-name"><img style="margin-left: -36px; margin-bottom: -6px;;" src="../assets/svg/person_input.svg"></div>
                <div id="group-mail"><input type="text" placeholder="E-Mail" id="input-mail"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/mail.svg"></div>
                <div id="group-phone"><input type="text" placeholder="Phone" id="input-phone"><img style="margin-left: -36px; margin-bottom: -6px;" src="../assets/svg/call.svg"></div>
                <div style="display: flex; gap: 16px;" class="buttons-addform">
                    <button style="width: 80px" id="cancel-contact" onclick="deleteContact(${index})">Delete<img src="../assets/icons/close.svg" id="cancel-contact-img"></button>
                    <button style="width: 160px" id="create-contact" onclick="formCheck(${index}, event)">Save<img src="../assets/svg/check_white.svg"></button>
                </div>
            </div>
        </div>
    </div>`
}