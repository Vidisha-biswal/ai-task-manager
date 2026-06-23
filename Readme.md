# AI Task Management Assistant - Full-Stack AI Productivity Platform

AI Task Management Assistant is a full-stack productivity application that helps users organize, prioritize, and manage their daily work using Artificial Intelligence. The platform combines traditional task management capabilities with AI-powered task prioritization, intelligent daily planning, productivity analytics, and personalized insights.

🌐 **Live Demo:** [Live](https://ai-task-manager-lemon-five.vercel.app/)

🔗 **Backend API:** [URL](https://ai-task-manager-ekay.onrender.com/)

---

## 🚀 Key Features

### 🔐 Secure Authentication

JWT-based authentication system with protected routes, secure password hashing using bcrypt.js, and user-specific task management.

### ✅ Complete Task Management

Create, view, update, and delete tasks with support for descriptions, due dates, priority levels, and status tracking.

### 🤖 AI-Powered Priority Generation

Integrated Google Gemini API to automatically analyze task descriptions and classify them into High, Medium, or Low priority levels.

### 📅 AI Daily Planner

Generate optimized daily schedules from existing tasks using AI-generated time-block recommendations and productivity-focused planning.

### 📊 Productivity Analytics Dashboard

Track task completion statistics, productivity scores, completed task percentages, and overall performance metrics.

### 💡 AI Productivity Insights

Leverages Gemini AI to analyze task patterns and provide personalized productivity recommendations and workflow improvements.

### 🔒 Protected Application Routes

Authenticated users can securely access dashboards, planners, and analytics while preventing unauthorized access.

---

## 🛠️ Technology Stack

### Frontend (Client)

* React.js (Component-Based Architecture)
* React Router DOM (Client-Side Routing)
* Context API (Authentication State Management)
* Axios (HTTP Requests)
* Tailwind CSS (Modern Responsive UI)
* Recharts (Analytics & Data Visualization)

### Backend (Server)

* Node.js
* Express.js
* RESTful API Architecture
* JWT Authentication
* bcrypt.js Password Encryption
* Express Middleware
* Express Validator

### Database

* MongoDB Atlas
* Mongoose ODM

### Artificial Intelligence

* Google Gemini API
* AI Task Prioritization
* AI Daily Planning
* AI Productivity Insights

### Deployment

* Vercel (Frontend Hosting)
* Render (Backend Hosting)
* MongoDB Atlas (Cloud Database)

---

## 🏗️ System Architecture

```text
User
 │
 ▼
React Frontend (Vercel)
 │
 ▼
Express.js REST API (Render)
 │
 ├── MongoDB Atlas
 │
 └── Google Gemini API
```

---

## 📂 Project Structure

```text
AI-Task-Manager
│
├── backend
│   ├── config
│   ├── controllers
│   ├── middleware
│   ├── models
│   ├── routes
│   ├── services
│   ├── .env
│   └── server.js
│
├── frontend
│   ├── src
│   │   ├── api
│   │   ├── components
│   │   ├── context
│   │   ├── pages
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── public
│
└── README.md
```

---

## 🔗 API Endpoints

### Authentication

```http
POST /api/auth/register
POST /api/auth/login
```

### Tasks

```http
POST   /api/tasks
GET    /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

### AI Services

```http
POST /api/ai/priority
POST /api/ai/daily-plan
POST /api/ai/insights
```

---

## 💻 Local Installation & Setup

Follow these steps to configure and run the full-stack development environment locally.

### 1. Clone the Repository

```bash
git clone https://github.com/Vidisha-biswal/ai-task-manager.git

cd ai-task-manager
```

### 2. Install Backend Dependencies

```bash
cd backend

npm install
```

### 3. Configure Backend Environment Variables

Create a `.env` file inside the backend directory:

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_ATLAS_URI

JWT_SECRET=YOUR_SECRET_KEY

GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

### 4. Install Frontend Dependencies

```bash
cd ../frontend

npm install
```

### 5. Run Backend Server

```bash
cd backend

npm start
```

### 6. Run Frontend Application

```bash
cd frontend

npm run dev
```

### 7. Open Application

Frontend:

```text
http://localhost:5173
```

Backend:

```text
http://localhost:5000
```

---

## 🤖 AI Workflow

### Task Prioritization

```text
User Creates Task
        │
        ▼
 Gemini AI Analysis
        │
        ▼
Priority Assignment
(High / Medium / Low)
        │
        ▼
Task Stored in MongoDB
```

### Daily Planner Generation

```text
User Tasks
      │
      ▼
 Gemini AI
      │
      ▼
 Optimized Daily Schedule
      │
      ▼
 Planner Dashboard
```

### Productivity Insights

```text
Task Completion Data
         │
         ▼
 Gemini AI Analysis
         │
         ▼
 Productivity Recommendations
```

---

## 🌐 Production Deployment

This application is optimized for cloud deployment using modern serverless and cloud-hosted infrastructure.

### Frontend Deployment

Hosted on Vercel with automatic deployments from GitHub.

### Backend Deployment

Hosted on Render with environment variable configuration and automatic CI/CD deployment.

### Database

MongoDB Atlas cloud cluster for scalable NoSQL storage.

### Environment Variables

Configure the following variables within the Render dashboard:

```env
PORT=5000

MONGO_URI=YOUR_MONGODB_URI

JWT_SECRET=YOUR_SECRET

GEMINI_API_KEY=YOUR_API_KEY
```

---

## 🎯 Learning Outcomes

This project demonstrates practical experience in:

* Full-Stack Development
* REST API Design
* Authentication & Authorization
* React State Management
* MongoDB Database Design
* AI Integration using Gemini API
* Cloud Deployment
* Frontend-Backend Communication
* Secure Application Development
* Analytics & Visualization
* Software Architecture Design

---

## 🚀 Future Enhancements

* Email Reminder System
* Push Notifications
* Calendar Integration
* Team Collaboration Features
* Drag & Drop Task Board
* AI Time Estimation
* Dark Mode
* Mobile Application
* Advanced Analytics Dashboard

---

## 👩‍💻 Author

**Vidisha Biswal**

Software Engineer | Full Stack Developer | AI Enthusiast

## 📄 License

This project is developed for educational purposes, portfolio showcasing, and practical learning of Full-Stack Development and AI Integration.