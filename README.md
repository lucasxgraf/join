# JOIN - Kanban Task Management System

![Join Logo](./assets/img/logo/join_logo_vector.svg)

## Overview
**JOIN** is a professional task management application inspired by the Kanban system. It allows developers and teams to organize tasks efficiently, manage contacts, and track project progress through an intuitive drag-and-drop interface.

## 🚀 Key Features
- **Kanban Board**: Drag and drop tasks between columns (To Do, In Progress, Await Feedback, Done).
- **Task Management**: Create detailed tasks with titles, descriptions, categories, assignees, due dates, and priorities.
- **Contact Management**: Maintain a central contact list for task assignment.
- **Summary Dashboard**: Get a quick overview of task statistics and upcoming deadlines.
- **Authentication**: Secure sign-up, login, and guest login (for quick testing the app) functionality.
- **Responsive Design**: Optimized for both desktop and mobile devices.

## 🛠️ Tech Stack
- **Frontend**: HTML5, CSS3, Vanilla JavaScript (ES6+)
- **Backend/Database**: Firebase Realtime Database
- **Authentication**: Firebase Auth

## 📂 Project Structure
```text
join/
├── assets/             # Images, SVGs, and brand assets
├── components/         # HTML components (templates)
├── pages/              # Main application pages (Board, Summary, etc.)
├── scripts/            # Core JavaScript logic
│   ├── api.js          # Firebase Database interactions
│   ├── board.js        # Kanban board functionality
│   ├── login.js        # Login page logic
│   └── ...
├── styles/             # Modular CSS files
├── index.html          # Login/Splash screen (Entry point)
└── sign_up.html        # User registration page
```

## 🏁 Getting Started

### Prerequisites
To run this project locally, you need:
- A modern web browser.
- A local web server (e.g., Live Server extension for VS Code).
- A Firebase project.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/lucasxgraf/join.git
   cd join
   ```
2. Open the project in your preferred editor.
3. Start your local web server (e.g., right-click `index.html` -> "Open with Live Server").

### Configuration (Firebase)
Since this project uses Firebase, you must provide your own configuration files (which are gitignored for security).

1. Create a `scripts/firebase_config.js` with your Firebase credentials:
   ```javascript
   // Import the functions you need from the SDKs you need
   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
   
   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     databaseURL: "YOUR_DATABASE_URL",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   // Initialize Firebase
   const app = initializeApp(firebaseConfig);
   export { app };
   ```
2. Create `scripts/firebase_auth.js` to handle authentication logic using the Firebase SDK.

## 🤝 Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License and Context
This project is licensed under the MIT License. 

This app was developed collaboratively by a student team to apply and showcase learned concepts in modern web development.

## 👤 Author
**Lucas Graf** <br>
GitHub: [@lucasxgraf](https://github.com/lucasxgraf) <br> <br>
**Maik Groth** <br>
GitHub: [@croser93](https://github.com/croser93) <br> <br>
**Leon Georg Leuning** <br>
GitHub: [@213Leon213](https://github.com/213Leon213)
