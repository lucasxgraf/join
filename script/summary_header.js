window.addEventListener("DOMContentLoaded", closeDropDownEvent);
let dropDownOpen = false;

function dropDown(event) {
event.stopPropagation();
let profilePic = document.getElementById('profilePicture');
let header = document.getElementById('dropDownMenu');
if (dropDownOpen) {
   closeDropDown();
} else {
profilePic.style.backgroundColor = "#E1E6EC";
header.style.display = "flex";
dropDownOpen = true;
} 
}


function closeDropDownEvent() { 
document.body.addEventListener('click', closeDropDown); 
}

function closeDropDown() {
let profilePic = document.getElementById('profilePicture');
let menu = document.getElementById('dropDownMenu');   
   if (dropDownOpen) {
      menu.style.display = "none";
      profilePic.style.backgroundColor = "";
      dropDownOpen = false;
      }
}