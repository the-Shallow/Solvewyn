# Solvewyn

**Solvewyn** is a full-stack platform designed to enhance the coding problem-solving experience for LeetCode users. It combines a Chrome Extension, a backend API, and a web application to track submissions and provide AI-powered code suggestions.

---

## 🚀 How the App Works

1. Users **solve LeetCode problems** as usual.  
2. The **Chrome Extension** captures each submission, extracts relevant details, and stores them securely in a **MongoDB database**.  
3. Users can **log in to the Solvewyn web app** to view all their solved problems in one place.  
4. Clicking on any problem opens a **detailed view**, where AI-powered suggestions and improvements are provided for the submitted code.  

---

## 🌟 Key Features

- **Automatic Submission Tracking:** Chrome Extension captures LeetCode submissions automatically  
- **User Dashboard:** View all solved problems in a clean, organized interface  
- **Detailed Problem View:** Access problem details, submission history, and AI-generated improvements  
- **AI Code Suggestions:** Get recommendations to improve your solutions  
- **Secure Authentication:** Users log in safely using JWT-based authentication  
- **Responsive Design:** Smooth navigation on web application built with React and Vite  

---

## 🛠️ Technologies Used

- **Frontend:** React, Vite  
- **Backend:** FastAPI, Python  
- **Database:** MongoDB  
- **Containerization:** Docker (backend)  
- **Deployment:** Vercel (frontend), EC2 (backend)  
- **Chrome Extension:** Captures LeetCode submissions and interacts with backend  

---

## 📂 Project Structure

/frontend - React + Vite web application
/backend - FastAPI backend API


> ⚠️ The Chrome Extension is maintained in a separate repository and connects to this project.  

---

## 🎯 Goal

Solvewyn makes it easy for users to **track their LeetCode progress** and **improve their coding skills** with AI-powered feedback, all in one centralized platform.
