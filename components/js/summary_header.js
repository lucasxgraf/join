/**
 * Saved user name from localStorage used for header initials
 * @type {string|null}
 */
const savedName = localStorage.getItem("headerName");

/**
 * Initializes the header logic
 */
function headerinit() {
   getInitialsFromUser()
}

/**
 * Registers the click listener to close the dropdown
 */
window.addEventListener("DOMContentLoaded", closeDropDownEvent);

/**
 * Tracks if the dropdown menu is currently open
 * @type {boolean}
 */
let dropDownOpen = false;

/**
 * Toggles the profile dropdown menu
 * @param {Event} event - Click event from profile picture
 */
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

/**
 * Adds a click listener to close the dropdown when clicking outside
 */
function closeDropDownEvent() { 
document.body.addEventListener('click', closeDropDown); 
}

/**
 * Closes the profile dropdown menu
 */
function closeDropDown() {
let profilePic = document.getElementById('profilePicture');
let menu = document.getElementById('dropDownMenu');   
   if (dropDownOpen) {
      menu.style.display = "none";
      profilePic.style.backgroundColor = "";
      dropDownOpen = false;
      }
}

/**
 * Creates and displays user initials in the profile picture
 */
function getInitialsFromUser() {

    const words = savedName.trim().split(/\s+/);
    const iconHeaderInitials = document.getElementById("profilePicture");
    
    const initials = words
      .filter(word => word.length > 0)
      .map(word => word[0].toUpperCase())
      .join('');
    iconHeaderInitials.innerHTML = initials;
}
