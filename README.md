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

A comprehensive Stack Overflow-like platform built with React, TypeScript, Node.js, and modern web technologies.

## 🚀 Features Implemented

### ✅ Core Infrastructure
- **Authentication System**: Login/Register with JWT tokens, password validation, social login ready
- **Routing**: React Router setup with protected routes and role-based access
- **State Management**: Context API for auth and notifications
- **UI Framework**: TailwindCSS with dark mode support
- **Form Handling**: React Hook Form with Zod validation
- **TypeScript**: Full type safety throughout the application

### ✅ Current Components
- **Layout System**: Header, Sidebar, responsive design
- **Authentication**: Login/Register modals, protected routes
- **Navigation**: Search bar, notification dropdown, user menu
- **Question System**: Basic question display, voting system ready
- **Notification System**: Real-time notifications context

## 🛠 Development Roadmap

### Phase 1: Core Features (In Progress)
- [ ] Rich Text Editor (Quill.js integration)
- [ ] Question Management (CRUD operations)
- [ ] Answer System with voting
- [ ] Tag System with autocomplete
- [ ] Advanced Search & Filtering

### Phase 2: Enhanced Features
- [ ] User Profile & Reputation System
- [ ] Real-time Notifications (WebSocket)
- [ ] File Upload (Images, attachments)
- [ ] Comment System
- [ ] Bookmarking & Favorites

### Phase 3: Advanced Features
- [ ] Admin Dashboard
- [ ] Content Moderation
- [ ] Analytics & Reporting
- [ ] API Rate Limiting
- [ ] Email Notifications

### Phase 4: Polish & Optimization
- [ ] Performance Optimization
- [ ] SEO Optimization
- [ ] PWA Features
- [ ] Mobile App (React Native)

## 📁 Project Structure

```
Client/
├── src/
│   ├── components/
│   │   ├── admin/           # Admin dashboard components
│   │   ├── answers/         # Answer-related components
│   │   ├── auth/           # Authentication components
│   │   ├── common/         # Shared components
│   │   ├── editor/         # Rich text editor components
│   │   ├── notifications/  # Notification components
│   │   ├── profile/        # User profile components
│   │   ├── questions/      # Question-related components
│   │   ├── tags/           # Tag management components
│   │   └── voting/         # Voting system components
│   ├── context/            # React contexts
│   ├── hooks/              # Custom React hooks
│   ├── pages/              # Page components
│   ├── services/           # API services
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
└── Server/                 # Backend API (Node.js/Express)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 20+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/ParthPawar10/StackIt.git
   cd StackIt
   ```

2. **Install Client Dependencies**
   ```bash
   cd Client
   npm install
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

4. **Environment Setup** (Optional)
   ```bash
   # Client/.env
   VITE_API_URL=http://localhost:3001/api
   ```

## 🎯 Current Status

- ✅ **Basic UI Framework**: Responsive layout with TailwindCSS
- ✅ **Authentication System**: Login/Register modals with validation
- ✅ **Navigation**: Header with search, notifications, user menu
- ✅ **Routing**: Protected routes and role-based access
- ✅ **Type Safety**: Full TypeScript implementation
- 🚧 **Rich Text Editor**: In progress
- 🚧 **Question System**: Basic structure implemented
- ⏳ **Backend API**: Not yet implemented

## 🛠 Technical Stack

### Frontend
- **React 19** with TypeScript
- **Vite** for fast development
- **TailwindCSS** for styling
- **React Router** for navigation
- **React Hook Form** + Zod for forms
- **Axios** for API calls
- **React Hot Toast** for notifications
- **Lucide React** for icons

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

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

---

##  Project Overview
> 

