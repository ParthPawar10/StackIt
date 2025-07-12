# Development Guide

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Start development server**:
   ```bash
   npm run dev
   ```

3. **Open your browser**: Navigate to `http://localhost:5173`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Current Features

### ✅ Implemented
- **Authentication UI**: Login/Register modals with validation
- **Responsive Layout**: Header, sidebar, main content area
- **Navigation**: Search bar, user menu, notifications dropdown
- **Home Page**: Question listing with mock data
- **Ask Question**: Form with title, content, and tags
- **Routing**: Protected routes and navigation
- **TypeScript**: Full type safety

### 🚧 In Progress
- Rich text editor integration
- Question management system
- User profile pages
- Tag system

### ⏳ Planned
- Backend API integration
- Real-time notifications
- Admin dashboard
- Advanced search and filtering

## Development Notes

### Mock Data
The application currently uses mock data for demonstration. All API calls are stubbed and will need backend implementation.

### Authentication
- Login/register forms are functional but don't connect to a real backend
- JWT token handling is implemented in the frontend
- Protected routes work based on mock authentication state

### Styling
- Uses TailwindCSS for styling
- Dark mode support is built-in
- Responsive design for mobile and desktop

### Type Safety
- Full TypeScript implementation
- Comprehensive type definitions in `src/types/`
- Strict type checking enabled

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication components
│   ├── common/         # Layout and shared components
│   └── notifications/  # Notification system
├── context/            # React context providers
├── pages/              # Page components
├── services/           # API service functions
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## Next Steps

1. **Backend API**: Implement Node.js/Express backend
2. **Rich Text Editor**: Complete Quill.js integration
3. **Real Data**: Replace mock data with API calls
4. **User System**: Complete profile and reputation features
5. **Admin Panel**: Build moderation and management tools

## Contributing

1. Create a feature branch
2. Make your changes
3. Test thoroughly
4. Submit a pull request

## Deployment

The application is ready for deployment to platforms like:
- Vercel (recommended for Vite apps)
- Netlify
- GitHub Pages
- Any static hosting service

Build command: `npm run build`
Output directory: `dist`
