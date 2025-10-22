window.addEventListener("DOMContentLoaded", closeDropDown);
let dropDownOpen = false;

function dropDown(event) {
event.stopPropagation();
let profilePic = document.getElementById('profilePicture');
let header = document.getElementById('dropDownMenu');
profilePic.style.backgroundColor = "#E1E6EC";
header.style.display = "flex";
dropDownOpen = true;
}


function closeDropDown() {
let profilePic = document.getElementById('profilePicture');
let menu = document.getElementById('dropDownMenu');    
document.body.addEventListener('click', function () {
   if (dropDownOpen) {
      menu.style.display = "none";
      profilePic.style.backgroundColor = "";
      } 
   }); 
}