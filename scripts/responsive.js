
function windowMobile() {
    if (window.matchMedia("(max-width: 950px)").matches) {
    replaceOnClickContacts();
}
}

function replaceOnClickContacts() {
    contacts.forEach((c, index) => {
        let contact = document.getElementById(c.id)
        contact.onclick = () => mobileContactClick(index)
    });
   
}

function mobileContactClick(index) {
    let content = document.getElementById('contact_content');
    let contactList = document.getElementById('contactlist');
    let upperHeaderContent = document.getElementById('contact-headline');
    contactList.style.display = "none";
    document.querySelector('.contact-informations').style.display = "flex";
    upperHeaderContent.innerHTML += mobileBackButtonTemplate();
    content.innerHTML = showContactTemplate(index);
    document.getElementById('upperContainer').onclick = () => closeClickMobileMenu();
}

function goBackToContactList() {
    let content = document.getElementById('contact_content');
    let contactList = document.getElementById('contactlist');
    let upperHeaderArrow = document.getElementById('goback-arrow');
    contactList.style = "";
    document.querySelector('.contact-informations').style.display = "none";
    upperHeaderArrow.remove();
    content.innerHTML = "";
    document.getElementById('upperContainer').onclick = null;
}

function addContactEventMobile(event) {
    event.stopPropagation();
    let index = undefined;
    let form = document.getElementById('main');
    let popupBlack = document.getElementById('popupBackground');
    popupBlack.classList.toggle("popup-overlay")
    form.innerHTML += addMobileFormTemplate(index);
    addYOverflowHidden();
}

function toggleMenu(event) {
    event?.stopPropagation();
    let menuPopup = document.getElementById('mobilePopupMenu');
    menuPopup.style.display = 'flex';
    menuPopup.classList.remove('slide-out');
    void menuPopup.offsetWidth;
    menuPopup.classList.add('slide-in-mobile-right');
}

function closeClickMobileMenu(event) {
    let menuPopup = document.getElementById('mobilePopupMenu');
    event?.stopPropagation();
    if (!menuPopup) {return}
    if (getComputedStyle(menuPopup).display === 'none') return;
    menuPopup.classList.remove('slide-in-mobile-right');
    menuPopup.classList.add('slide-out');
    menuPopup.onanimationend = function () {
        menuPopup.style.display = 'none';
        menuPopup.classList.remove('slide-out');
        menuPopup.onanimationend = null;
    };
    if (document.getElementById('mobile-edit').src.endsWith("/assets/svg/edit_contact_icon_hover.svg")) {document.getElementById('mobile-edit').src = "/assets/svg/edit_contact_icon_default.svg"}
    if (document.getElementById('mobile-delete').src.endsWith("/assets/svg/delete_contact_icon_hover.svg")) {document.getElementById('mobile-delete').src = "/assets/svg/delete_contact_icon_default.svg"}
}

//function checkWindowImg() {
//    if (window.matchMedia("(max-width: 930px)").matches) {
//        return "/assets/icons/close_icon_white.svg";
//  } else {
//      return "/assets/icons/close_icon_default.svg";
//  }
//}

function mobileContactEdit(index, event) {
    event.stopPropagation();
    document.getElementById('mobile-edit').src = "/assets/svg/edit_contact_icon_hover.svg";
    editContactEventMobile(index);
}

function mobileContactDelete(index) {
    document.getElementById('mobile-delete').src = "/assets/svg/delete_contact_icon_hover.svg";
    deleteContact(index);
}

function showContactAfterEditMobile(index) {
    let content = document.getElementById('contact_content');
    content.innerHTML = showContactAfterEditMobile(index);
}

function editContactEventMobile(index) {
    let form = document.getElementById('main');
    let popupBlack = document.getElementById('popupBackground');
    popupBlack.classList.toggle("popup-overlay")
    form.innerHTML += mobileEditContactTemplate(index);
    editYOverflowHiddenMobile();
    let inputName = document.getElementById('input-name');
    let inputMail = document.getElementById('input-mail');
    let inputPhone = document.getElementById('input-phone');
    inputName.value = contacts[index]["name"]["firstname"] + " " + contacts[index]["name"]["secondname"];
    inputMail.value = contacts[index]["mail"];
    inputPhone.value = contacts[index]["tel"];
}

function closeFormMobile(event) {
    event?.stopPropagation();
    let popupBlack = document.getElementById('popupBackground');
    let addForm = document.getElementById('add-Form');
    let editForm = document.getElementById('edit-Form');
    if (addForm) {
        addCloseYOverflowHiddenMobile();
        popupBlack.classList.toggle("popup-overlay");
    }
    if (editForm) {
        editCloseYOverflowHiddenMobile();
        popupBlack.classList.toggle("popup-overlay");
    }
    windowMobile();
}

function editYOverflowHiddenMobile() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('edit-Form');
    document.documentElement.classList.add('disable-y-scroll');
    document.body.classList.add('disable-y-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-up");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-y-scroll');
    document.body.classList.remove('disable-y-scroll');
    form.classList.remove('slide-up');}
);
}

function editCloseYOverflowHiddenMobile() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('edit-Form');
    document.documentElement.classList.add('disable-y-scroll');
    document.body.classList.add('disable-y-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-down");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-y-scroll');
    document.body.classList.remove('disable-y-scroll');
    form.classList.remove('slide-down')
    form.remove()});
}


function addYOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('add-Form');
    document.documentElement.classList.add('disable-y-scroll');
    document.body.classList.add('disable-y-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-up");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-y-scroll');
    document.body.classList.remove('disable-y-scroll');
    form.classList.remove('slide-up');}
);
}

function addCloseYOverflowHiddenMobile() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('add-Form');
    document.documentElement.classList.add('disable-y-scroll');
    document.body.classList.add('disable-y-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-down");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-y-scroll');
    document.body.classList.remove('disable-y-scroll');
    form.classList.remove('slide-down');
    form.remove()});
}