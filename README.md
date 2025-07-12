# StackIt - Stack Overflow Clone

A full-stack Q&A platform built with React and Node.js.

## 🚀 Features

- User authentication and authorization
- Ask and answer questions
- Tag system for categorizing questions
- Rich text editor for writing questions and answers
- User profiles and dashboards
- Real-time notifications
- File upload support
- Admin dashboard

## 🛠️ Tech Stack

### Frontend (Client)
- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **Radix UI** for components
- **React Router** for navigation
- **Axios** for API calls
- **React Hook Form** with Zod validation
- **React Quill** for rich text editing

### Backend (Server)
- **Node.js** with Express
- **MongoDB** with Mongoose
- **JWT** for authentication
- **Bcrypt** for password hashing
- **Cloudinary** for image uploads
- **Socket.io** for real-time features
- **Nodemailer** for email notifications

## 📋 Prerequisites

- Node.js (v20.19.0 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## 🏃‍♂️ Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd StackIt
```

### 2. Install all dependencies
```bash
npm run install:all
```

### 3. Configure environment variables
Copy `.env.example` to `.env` in the Server directory and update the values:
```bash
cd Server
cp .env.example .env
```

Update the following variables in `Server/.env`:
- `MONGODB_URI`: Your MongoDB connection string
- `JWT_SECRET`: A secure random string
- `CLOUDINARY_*`: Your Cloudinary credentials (for image uploads)
- `EMAIL_*`: Email service credentials (for notifications)

### 4. Start the development servers
```bash
# Run both client and server concurrently
npm run dev

# Or run them separately:
npm run server:dev  # Server on http://localhost:5000
npm run client:dev  # Client on http://localhost:5173
```

## 📁 Project Structure

```
StackIt/
├── Client/                 # React frontend
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── context/       # React context
│   │   ├── types/         # TypeScript types
│   │   └── utils/         # Utility functions
│   └── public/
├── Server/                # Node.js backend
│   ├── controllers/       # Business logic
│   ├── middleware/        # Custom middleware
│   ├── models/           # Database models
│   ├── routes/           # API routes
│   └── utils/            # Server utilities
└── package.json          # Root package for running both
```

## 🔌 API Endpoints

The server provides the following API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/questions` - Get questions
- `POST /api/questions` - Create a question
- `GET /api/tags` - Get tags
- `POST /api/answers` - Post an answer
- `GET /api/users/profile` - Get user profile
- And more...

## 🌐 Development

### Client Development
The React app runs on `http://localhost:5173` and is configured to proxy API requests to the backend during development.

### Server Development
The Express server runs on `http://localhost:5000` with auto-restart enabled via nodemon.

### Database
Make sure MongoDB is running locally or configure MongoDB Atlas connection in the `.env` file.

## 🚀 Production Deployment

### Client Build
```bash
cd Client
npm run build
```

### Server Start
```bash
cd Server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License. - Full-Featured Q&A Platform
Solution for **Problem Statement 2** – Odoo Hackathon 2025

Document Version	Last Updated
1.0.0	            July 12, 2025

1. Introduction
   1.1. Project Overview
      This document outlines the frontend architecture for StackIt, a modern question-and-answer platform. It details the project structure, core design principles, state         management strategy, API integration, and development toolchain.
   1.2. Purpose
      The primary goal of this documentation is to serve as a central source of truth for all developers working on the project. It is designed to:
      •	Facilitate a smooth onboarding process for new team members.
      •	Ensure consistency and maintainability across the codebase.
      •	Provide a clear architectural blueprint for future development and scaling.
   1.3. Architectural Principles
      The architecture is founded on the principles of modularity, scalability, and maintainability.
      We utilize a component-based architecture with a clear separation of concerns. Business logic, UI rendering, and state management are decoupled to promote code reuse        and simplify testing.
   
3. Project Structure
   The project follows a feature-based folder structure to group related files and enhance discoverability.
   stackit-frontend/
   ```
   ├── public/                     # Static assets processed by the bundler
   │   ├── index.html              # Main HTML entry point
   │   ├── favicon.ico             # Application favicon
   │   └── manifest.json           # PWA manifest
   ├── src/                        # Application source code
   │   ├── assets/                 # Static assets (images, fonts, etc.)
   │   │   ├── fonts/
   │   │   └── images/
   │   ├── components/             # Reusable, self-contained UI components
   │   │   ├── admin/              # Components for the admin dashboard
   │   │   ├── auth/               # User authentication components (modals, forms)
   │   │   ├── common/             # Globally shared components (Header, Spinner, etc.)
   │   │   ├── editor/             # Rich text editor and related tooling
   │   │   ├── notifications/      # Notification UI elements
   │   │   ├── profile/            # User profile sections
   │   │   ├── questions/          # Components for displaying and managing questions
   │   │   ├── answers/            # Components for displaying and managing answers
   │   │   ├── tags/               # Tag-related UI (selectors, clouds)
   │   │   └── voting/             # Voting controls
   │   ├── context/                # React Context providers for global state
   │   ├── hooks/                  # Custom React hooks for shared logic
   │   ├── pages/                  # Top-level page components, mapped to application routes
   │   ├── services/               # Modules for handling external API communication
   │   ├── styles/                 # Global styles, variables, and theme definitions
   │   ├── utils/                  # Utility functions and constants
   │   ├── App.jsx                 # Root application component and router setup
   │   ├── index.js                # Application entry point
   │   └── index.css               # Root-level CSS entry
   ├── .env                        # Environment variables (untracked)
   ├── .gitignore                  # Git ignore configuration
   ├── package.json                # Project dependencies and scripts
   ├── tailwind.config.js          # Tailwind CSS theme and plugin configuration
   ├── postcss.config.js           # PostCSS plugin configuration
   └── README.md                   # High-level project overview
   
5. Core Feature Implementation
   The following table maps core application features to their primary components and services.
   Feature	Key Components	Primary Service(s)
   Authentication	LoginModal.jsx, RegisterModal.jsx, ProtectedRoute.jsx	authService.js
   Question Management	QuestionList.jsx, QuestionDetail.jsx, AskQuestionModal.jsx	questionService.js
   Answer System	AnswerList.jsx, AnswerCard.jsx, AnswerForm.jsx	answerService.js
   Rich Text Editor	RichTextEditor.jsx, EditorToolbar.jsx, ImageUpload.jsx	uploadService.js
   Notification System	NotificationBell.jsx, NotificationDropdown.jsx	notificationService.js
   User Profiles	UserProfile.jsx, ProfileSettings.jsx, UserActivity.jsx	userService.js
   Admin Dashboard	AdminDashboard.jsx, UserManagement.jsx	adminService.js

6. State Management
   We utilize React's Context API for managing global and cross-cutting state. This approach avoids introducing heavy external libraries for state that is not highly           complex or frequently changing.
   4.1. AuthContext
      •	Purpose: Manages the authentication state of the user.
      •	State: { user: Object | null, isLoading: boolean, error: string | null }
      •	Functions: login(credentials), logout(), register(userData)
      •	Consumer Hook: useAuth() in src/hooks/useAuth.js
   4.2. ThemeContext
      •	Purpose: Manages the application's UI theme (e.g., 'light' or 'dark').
      •	State: { theme: string }
      •	Functions: toggleTheme()
      •	Consumer Hook: useTheme() in src/hooks/useTheme.js
   4.3. NotificationContext
      •	Purpose: Manages real-time notifications for the user.
      •	State: { notifications: Array, unreadCount: number }
      •	Functions: addNotification(notification), markAsRead(id)
      •	Consumer Hook: useNotifications() in src/hooks/useNotifications.js
7. API Layer
   All communication with the backend API is abstracted into the src/services/ directory. This isolates data-fetching logic from the UI components.
   •	api.js: Contains the configured Axios instance, including the base URL, interceptors for handling authentication tokens, and standardized error handling.
   •	Service Modules (authService.js, questionService.js, etc.): Each module exports functions that correspond to specific API endpoints. These functions encapsulate the      logic for making the request and returning formatted data or errors.

6. Styling & Design System
   The project employs Tailwind CSS for a utility-first styling approach, ensuring rapid development and a consistent design language. The core design system is defined in     tailwind.config.js.
   ```
   6.1. Color Palette
      Role	      ColorName	   Hex Code	   Tailwind Class
      Primary	   Blue	         #3B82F6	   blue-500
      Secondary	Gray	         #6B7280	   gray-500
      Success	   Green	         #10B981	   green-500
      Warning	   Orange	      #F59E0B	   amber-500
      Error	      Red	         #EF4444	   red-500
      Neutral	   Gray           varies	   gray-100 to gray-900
   ```
   6.2. Typography
   ```
      •	Headers: Inter font family (font-sans).
      •	Body: System font stack (font-sans).
      •	Code: Fira Code or other monospace font (font-mono).
   ```
   6.3. Responsive Breakpoints
   ```
      A mobile-first approach is used. Breakpoints are defined in tailwind.config.js.
      •	sm: 640px
      •	md: 768px
      •	lg: 1024px
      •	xl: 1280px
      •	2xl: 1536px
   

8. Development Tooling & Scripts
   7.1. Prerequisites
      •	Node.js (v18.x or later)
      •	npm
   7.2. Setup
      1.	Clone the repository: git clone https://github.com/ParthPawar10/StackIt
      2.	Install dependencies: npm install 
      3.	Create a .env file from .env.example and populate it with the required environment variables.
   7.3. Common Scripts
```
      Script	         Description
      npm run dev	      Starts the development server with hot-reloading.
      npm run build	   Compiles and bundles the application for production.
      npm run test	   Runs the unit and integration test suite using Jest.
      npm run lint	   Lints the codebase using ESLint to check for code quality issues.
      npm run format	   Formats the entire codebase using Prettier.
```

8. Testing Strategy
   Quality assurance is maintained through a multi-layered testing strategy.
   •	Unit Tests: Located alongside the source files (*.test.js). Focus on testing individual functions and components in isolation using Jest and React Testing Library.
   •	Integration Tests: Test the interaction between multiple components (e.g., a form and its state). Also written with React Testing Library.
   •	End-to-End (E2E) Tests: Stored in a separate cypress/ directory. Simulate full user workflows in a browser environment using Cypress.

9. Contribution Guidelines
   To maintain code quality and a streamlined workflow, all contributors must adhere to the following guidelines:
   1.	Branching: All new work must be done on a feature branch created from main. Branch names should be descriptive (e.g., feature/user-profile-page or fix/login-modal-          bug).
   2.	Commits: Follow the Conventional Commits specification (e.g., feat:, fix:, docs:, style:, refactor:, test:).
   3.	Pull Requests (PRs):
      o	Ensure all tests pass (npm run test).
      o	Ensure the code is linted and formatted (npm run lint and npm run format).
      o	Provide a clear description of the changes in the PR.
      o	Link the PR to the relevant issue or ticket.
      o	Require at least one code review from another team member before merging.



##  Team Details
**Team Name:** Enroll-X - Minimal Q&A Platform  
Solution for **Problem Statement 2** – Odoo Hackathon 2025  

##  Problem Statement
StackIt is a minimal question-and-answer platform that supports **collaborative learning** and **structured knowledge sharing**.  
It’s designed to be **simple**, **user-friendly**, and focused on the core experience of **asking** and **answering** questions within a community.

##  Team Details
**Team Name:** Enroll-X  

| Member Name       | Role/Contribution        |
|-------------------|--------------------------|
| Parth Pawar       |                          |
| Bhavesh Chauhan   |                          |
| Krishna Chamarthy |                          |

