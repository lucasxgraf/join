window.addEventListener("DOMContentLoaded", contactClick);
window.addEventListener('DOMContentLoaded', initBodyClickClose);


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

function addXOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('add-Form');
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-in");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-x-scroll');
    document.body.classList.remove('disable-x-scroll');
    form.classList.remove('slide-in');}
);
}

function editXOverflowHidden() {
    let popupBody = document.getElementById('popupBackground');
    let form = document.getElementById('edit-Form');
    document.documentElement.classList.add('disable-x-scroll');
    document.body.classList.add('disable-x-scroll');
    void document.body.offsetWidth;
    form.classList.add("slide-in");
    form.addEventListener('animationend', () => {
    document.documentElement.classList.remove('disable-x-scroll');
    document.body.classList.remove('disable-x-scroll');
    form.classList.remove('slide-in');}
);
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
    void document.body.offsetWidth;
    alert.classList.add('slide-rtl');
    alert.addEventListener('animationend', () => {
        document.documentElement.classList.remove('disable-x-scroll');
        document.body.classList.remove('disable-x-scroll');
        alert.remove();
    })
}


function bodyClickHandler(event) {
  const content        = document.getElementById('contact-side');
  const popupBlack     = document.getElementById('popupBackground');
  const contactContent = document.getElementById('contact_content');

  if (popupBlack.classList.contains('popup-overlay')) return;
  if (event.target.closest('.contact')) return;
  if (content.contains(event.target) || !document.getElementById('edit')) return;

  contactContent.innerHTML = '';
  contacts.forEach(contact => {
    const cont = document.getElementById(contact.id);
    if (cont) { cont.style.backgroundColor = ''; cont.style.color = ''; }
  });
}

function initBodyClickClose() {
  document.addEventListener('click', bodyClickHandler);
}
