window.addEventListener("DOMContentLoaded", contactClick);

function contactClick() {
    let contacts = document.querySelectorAll('.contact');
    contacts.forEach(contact => {
        contact.addEventListener('click', function () {
            contacts.forEach(c => c.style.backgroundColor = "");
            contacts.forEach(c => c.style.color = "");
            this.style.backgroundColor = "#2A3647";
            this.style.color = "white";
        });
    });
}

function hoverEdit() {
    let edit = document.getElementById('edit');
    if (edit) {
        edit.addEventListener("mouseover", function () {
        edit.src = "/assets/svg/edit_contact_icon_hover.svg"
    });
    edit.addEventListener("mouseout", function () {
        edit.src = "/assets/svg/edit_contact_icon_default.svg";
    });
    }
}

function hoverDelete() {
    let del = document.getElementById('delete');
    if (del) {
        del.addEventListener("mouseover", function () {
        del.src = "/assets/svg/delete_contact_icon_hover.svg"
    });
    del.addEventListener("mouseout", function () {
        del.src = "/assets/svg/delete_contact_icon_default.svg"
    });
    }
}

function hoverCancel() {
    let cancel = document.getElementById('cancel-contact-img');
    let cancelButton = document.getElementById('cancel-contact');
    if (cancelButton) {
        cancelButton.addEventListener("mouseover", function () {
        cancel.src = "/assets/icons/icon_cancel_hover.svg"
    }); cancelButton.addEventListener("mouseout", function () {
        cancel.src = "/assets/icons/icon_cancel.svg"
    });
    }
}

function xOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('add-Form');

popupBody.addEventListener('animationstart', () => {
    document.body.classList.add('disable-x-scroll');
    popupBody.classList.add('disable-x-scroll');
    form.classList.add('disable-x-scroll');
});

popupBody.addEventListener('animationend', () => {
    document.body.classList.remove('disable-x-scroll');
    popupBody.classList.remove('disable-x-scroll');
    form.classList.remove('disable-x-scroll');
});
}



