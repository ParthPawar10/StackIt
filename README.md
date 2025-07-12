StackIt - A Full-Featured Q&A Platform
Solution for Problem Statement 2 – Odoo Hackathon 2025

Problem Statement
StackIt is a minimal question-and-answer platform that supports collaborative learning and structured knowledge sharing. It’s designed to be simple, user-friendly, and focused on the core experience of asking and answering questions within a community.

Core Features
The platform's core features are mapped to their primary components and services:

Feature

Key Components

Primary Service(s)

Authentication

LoginModal.jsx, RegisterModal.jsx, ProtectedRoute.jsx

authService.js

Question Management

QuestionList.jsx, QuestionDetail.jsx, AskQuestionModal.jsx

questionService.js

Answer System

AnswerList.jsx, AnswerCard.jsx, AnswerForm.jsx

answerService.js

Rich Text Editor

RichTextEditor.jsx, EditorToolbar.jsx, ImageUpload.jsx

uploadService.js

Notification System

NotificationBell.jsx, NotificationDropdown.jsx

notificationService.js

User Profiles

UserProfile.jsx, ProfileSettings.jsx, UserActivity.jsx

userService.js

Admin Dashboard

AdminDashboard.jsx, UserManagement.jsx

adminService.js


Tech Stack & Architecture
The architecture is founded on the principles of modularity, scalability, and maintainability. We utilize a component-based architecture with a clear separation of concerns. Business logic, UI rendering, and state management are decoupled to promote code reuse and simplify testing.

Styling: Tailwind CSS for a utility-first styling approach.

State Management: React Context API for managing global state like authentication, theme, and notifications.

API Layer: Axios is used for all communication with the backend API, abstracting data-fetching logic from UI components.

Project Structure
The project follows a feature-based folder structure to group related files and enhance discoverability.

stackit-frontend/
├── public/                 # Static assets
├── src/
│   ├── assets/             # Images, fonts, etc.
│   ├── components/         # Reusable UI components
│   ├── context/            # React Context providers for global state
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Top-level page components
│   ├── services/           # API communication modules
│   ├── styles/             # Global styles and themes
│   ├── utils/              # Utility functions
│   ├── App.jsx             # Root component and router
│   └── index.js            # Application entry point
├── .env                    # Environment variables
├── package.json            # Dependencies and scripts
└── tailwind.config.js      # Tailwind CSS configuration
Getting Started
Prerequisites
Node.js (v18.x or later)

npm

Setup
Clone the repository:


git clone https://github.com/ParthPawar10/StackIt
Install dependencies:


npm install
Create a .env file from .env.example and populate it with the required environment variables.

Available Scripts
Script

Description

npm run dev

Starts the development server with hot-reloading.

npm run build

Bundles the application for production.

npm run test

Runs the unit and integration test suite.

npm run lint

Lints the codebase for quality issues.

npm run format

Formats the codebase using Prettier.

Testing Strategy
Quality is maintained through a multi-layered testing strategy:

Unit Tests: Individual functions and components are tested in isolation using Jest and React Testing Library.

Integration Tests: Interactions between multiple components are tested.

End-to-End (E2E) Tests: Full user workflows are simulated in a browser environment using Cypress.

Contribution Guidelines
Branching: Create new feature branches from main (e.g., feature/user-profile).

Commits: Follow the Conventional Commits specification.

Pull Requests (PRs):

Ensure all tests and linting checks pass.

Provide a clear description of changes.

Require at least one code review before merging.

Team Details
Team Name: Enroll-X

Member Name

Role/Contribution

Parth Pawar

Bhavesh Chauhan

Krishna Chamarthy

