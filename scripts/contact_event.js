window.addEventListener("DOMContentLoaded", contactClick);


function contactClick() {
    let contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => {
        contact.addEventListener('click', function () {
            contacts.forEach(c => c.classList.remove('contact-selected'));
            if (window.innerWidth >= 980){this.classList.add('contact-selected')};
        });
    });
}

function addXOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('add-Form');
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-in-dialog");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-x-scroll');
    document.body.classList.remove('disable-x-scroll');
    form.classList.remove('slide-in-dialog');}
);
}

function editXOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('edit-Form');
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-in-dialog");
    form.addEventListener('animationend', () => {
        document.documentElement.classList.remove('disable-x-scroll');
        document.body.classList.remove('disable-x-scroll');
        form.classList.remove('slide-in-dialog');
    }, { once: true });
}

function showContentXOverflowHidden(index) {
    let info = document.getElementById('showContent'+ index)
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    info.classList.add("slide-in");
    info.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-x-scroll');
    document.body.classList.remove('disable-x-scroll');
    info.classList.remove('slide-in');}
    );
}

function alertxOverflowHidden() {
    let alert = document.getElementById('create-contact-alert');
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    document.getElementById('contactlist').classList.add('disable-x-scroll');
    void alert.offsetWidth;
    if (window.matchMedia("(max-width: 950px)").matches) {alert.classList.add("slide-up-hold-down");} else {
    alert.classList.add("slide-rtl");}
    alert.addEventListener('animationend', () => {
        document.getElementById('contactlist').classList.remove('disable-x-scroll');
        document.documentElement.classList.remove('disable-x-scroll');
        document.body.classList.remove('disable-x-scroll');
        alert.remove();
    }, { once: true });
}

function bodyClickClose() {
    let content = document.getElementById('contact-side');
    let popupBlack = document.getElementById('popupBackground');
    let contactContent = document.getElementById('contact_content');
    function handler(event) {
        if (window.matchMedia("(max-width: 950px)").matches) return;
        if (popupBlack.classList.contains('popup-overlay') || event.target.closest('.contact')) return;
        if (!content.contains(event.target)) {
            clearContacts();
            document.removeEventListener('click', handler);
        }
    }
    document.addEventListener('click', handler);
}
window.bodyClickClose = bodyClickClose;

function addContactEvent(event) {
    event.stopPropagation();
    let index = undefined;
    let form = document.getElementById('main');
    let popupBlack = document.getElementById('popupBackground');
    popupBlack.classList.toggle("popup-overlay")
    form.innerHTML += addFormTemplate(index);
    addXOverflowHidden();
}

function closeForm(event) {
    event?.stopPropagation();
    let popupBlack = document.getElementById('popupBackground');
    let addForm = document.getElementById('add-Form');
    let editForm = document.getElementById('edit-Form');
    if (addForm) {
        addForm.remove();
        popupBlack.classList.toggle("popup-overlay");
    }
    if (editForm) {
        editForm.remove();
        popupBlack.classList.toggle("popup-overlay");
    }
    contactClick();
    bodyClickClose();
}