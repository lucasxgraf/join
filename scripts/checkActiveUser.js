import { getCurrentUser, logoutUser } from '../scripts/firebase_auth.js';


async function checkUser() {
  const user = await getCurrentUser();
  
  if (!user) {
    window.location.replace("../../index.html");
  }
}

logoutUser();

checkUser();

window.logout = logout;