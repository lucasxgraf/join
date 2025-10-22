greetingTime();

function greetingTime() {
let greeting = document.getElementById('timeGreeting');
const now = new Date();
const hour = now.getHours();
    switch (true) {
        case (hour < 11):
        greeting.textContent = "Good Morning,"        
            break;
        case (hour < 18):
        greeting.textContent = "Good Afternoon,"        
            break;
        case (hour < 21):
        greeting.textContent = "Good Evening,"        
            break;
        case (hour < 4):
        greeting.textContent = "Good Night,"        
            break;
        default:
            greeting.textContent = "Good Morning,"
            break;
    }
}