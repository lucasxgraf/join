function addFormTemplate(index) {
    return `
    <div class="add-contact-form" id="add-Form">
            <div class="text-form">
                <img class="add_contact_logo" src="../assets/img/logo/join_logo_vector.svg">
                <h1> Add Contact </h1>
                <span> Tasks are better with a team! </span>
                <div class="divider-small"></div>
            </div>
            <div class="inner-form">
            <img class="inner-form-picture" src="../assets/svg/default_contact_profilepicture.svg">
            <div class="add-form">
                <img src="../assets/svg/close.svg" id="x-button-form" onclick="closeForm(event)">
                <div id="group-name" class="inputWrapper">
                    <input type="text" placeholder="Name" id="input-name" onblur="validateInputContact('errorName', 'input-name', 'group-name')">
                    <img src="../assets/svg/person_input.svg">
                </div>
                <div id="errorName" class="error_message"></div>

                <div id="group-mail" class="inputWrapper">
                    <input type="text" placeholder="E-Mail" id="input-mail" onblur="validateInputContact('errorMail', 'input-mail', 'group-mail')">
                    <img src="../assets/svg/email.svg">
                </div>
                <div id="errorMail" class="error_message"></div>

                <div id="group-phone" class="inputWrapper">
                    <input type="text" placeholder="Phone" id="input-phone" onblur="validateInputContact('errorPhone', 'input-phone', 'group-phone')">
                    <img src="../assets/svg/call.svg">
                </div>
                <div id="errorPhone" class="error_message"></div>

                <div class="add-contacts-btn">
                    <button id="cancel-contact" onclick="closeForm(event)">
                        Cancel
                        <img src="../assets/svg/close.svg" id="cancel-contact-img">
                    </button>
                    <button id="create-contact" onclick="formCheck(${index}, event)">
                        Create contact
                        <img src="../assets/svg/check_white.svg">
                    </button>
                </div>
            </div>
        </div>
    </div>
    `
}

function editContactTemplate(index) {
    return `
    <div class="add-contact-form" id="edit-Form">
        <div class="text-form" style="background-color: #2A3647; width: 40%;">
            <img src="../assets/img/logo/join_logo_vector.svg" class="edit_contact_logo">
            <h1> Edit Contact </h1>
            <div class="divider-small"></div>
        </div>
            <div style="display: flex; width: 60%; align-items: center;">
                <button class="big-contact-picture" style ="background-color: ${contacts[index]["color"]}; margin-left: 72px;">${contactPictureLetters(index)}</button>
                <div class="add-form">
                <img src="../assets/svg/close.svg" id="x-button-form" onclick="closeForm(event)">
            <div class="add-form">
                <img src="../assets/svg/close.svg" id="x-button-form" onclick="closeForm(event)">
                <div id="group-name" class="inputWrapper">
                    <input type="text" placeholder="Name" id="input-name" onblur="validateInputContact('errorName', 'input-name', 'group-name')">
                    <img src="../assets/svg/person_input.svg">
                </div>
                <div id="errorName" class="error_message"></div>

                <div id="group-mail" class="inputWrapper">
                    <input type="text" placeholder="E-Mail" id="input-mail" onblur="validateInputContact('errorMail', 'input-mail', 'group-mail')">
                    <img src="../assets/svg/email.svg">
                </div>
                <div id="errorMail" class="error_message"></div>

                <div id="group-phone" class="inputWrapper">
                    <input type="text" placeholder="Phone" id="input-phone" onblur="validateInputContact('errorPhone', 'input-phone', 'group-phone')">
                    <img src="../assets/svg/call.svg">
                </div>
                <div id="errorPhone" class="error_message"></div>
                
                <div style="display: flex; gap: 16px;">
                    <button style="width: 80px" id="cancel-contact" onclick="deleteContact(${index})">Delete<img src="../assets/svg/close.svg" id="cancel-contact-img"></button>
                    <button style="width: 160px" id="create-contact" onclick="formCheck(${index}, event)">Save<img src="../assets/svg/check_white.svg"></button>
                </div>
            </div>
        </div>
    </div>
    `
}

function showContactTemplate(index) {
    return `
    <div class="info-content" id="showContent${index}">
        <div class="info-content-container">
            <div class="big-contact-picture" style="background-color:${contacts[index]["color"]};">
                ${contactPictureLetters(index)}
            </div>
            <div class="info_contact_name">
                <h2 class="fullname">${contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"]}</h2>
                <div class="contact-icons">
                    <button id="edit" onclick="editContactEvent(${index})">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                        <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_75592_9969)">
                        <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
                        </g>
                        </svg>
                        Edit
                    </button>
                    <button id="delete" onclick="deleteContact(${index})">
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
                </div>
            </div>
        </div>
        <div class="informations">
            <h2>Contact Information</h2>

            <p><strong>Email</strong></p>
            <span>
                <a href="mailto:${contacts[index]["mail"]}" class="information_contact_email"> ${contacts[index]["mail"]}
                </a>
            </span>

            <p><strong>Phone</strong></p>
            <span>    
                <a href="tel:${contacts[index]["tel"]}" class="information_contact_phone"> ${contacts[index]["tel"]}
                </a>
            </span>
        </div>
    </div>
    `
}

function showContactAfterEditTemplate(index) {
    return `
    <div class="info-content" id="showContent${index}">
        <div class="info-content-container">
            <div class="big-contact-picture" style="background-color:${contacts[index]["color"]};">
                ${contactPictureLetters(index)}
            </div>
            <div class="info_contact_name">
                <h2 class="fullname">${contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"]}</h2>
                <div class="contact-icons">
                    <button id="edit" onclick="editContactEvent(${index})">
                        <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <mask id="mask0_75592_9969" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="25" height="24">
                        <rect x="0.144531" width="24" height="24" fill="#D9D9D9"/>
                        </mask>
                        <g mask="url(#mask0_75592_9969)">
                        <path d="M5.14453 19H6.54453L15.1695 10.375L13.7695 8.975L5.14453 17.6V19ZM19.4445 8.925L15.1945 4.725L16.5945 3.325C16.9779 2.94167 17.4487 2.75 18.007 2.75C18.5654 2.75 19.0362 2.94167 19.4195 3.325L20.8195 4.725C21.2029 5.10833 21.4029 5.57083 21.4195 6.1125C21.4362 6.65417 21.2529 7.11667 20.8695 7.5L19.4445 8.925ZM17.9945 10.4L7.39453 21H3.14453V16.75L13.7445 6.15L17.9945 10.4Z" fill="#2A3647"/>
                        </g>
                        </svg>
                        Edit
                    </button>
                    <button id="delete" onclick="deleteContact(${index})">
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
                </div>
            </div>
        </div>
        <div class="informations">
            <h2>Contact Information</h2>

            <p><strong>Email</strong></p>
            <span>
                <a href="mailto:${contacts[index]["mail"]}" class="information_contact_email"> ${contacts[index]["mail"]}
                </a>
            </span>

            <p><strong>Phone</strong></p>
            <span>    
                <a href="tel:${contacts[index]["tel"]}" class="information_contact_phone"> ${contacts[index]["tel"]}
                </a>
            </span>
        </div>
    </div>
    `
}

function getFeedbackContact(contactText) {
    return `<div class="alert" id="create-contact-alert"><p>${contactText}</p></div>`
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
                <div id="group-name"><input type="text" placeholder="halloName" id="input-name"><img style="margin-left: -36px; margin-bottom: -6px;;" src="../assets/svg/person_input.svg"></div>
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