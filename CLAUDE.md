# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a MERN (MongoDB, Express, React, Node.js) stack real-time chat application with Socket.io for websocket communication. The project consists of two main parts:
- **Backend**: Express.js server with MongoDB database, JWT authentication, and Socket.io
- **Frontend**: React application with Redux Toolkit for state management, Tailwind CSS for styling, and Socket.io-client

## Architecture

### Backend Architecture
- **Express Server**: REST API with JWT authentication (`backend/index.js`)
- **Database**: MongoDB with Mongoose ODM
- **Real-time**: Socket.io for websocket connections
- **Authentication**: JWT tokens with bcrypt password hashing
- **Models**: User, Chat, Message (`backend/models/`)
- **Controllers**: Handle business logic for users, chats, messages (`backend/controllers/`)
- **Middleware**: Auth verification (`backend/middleware/authMiddleware.js`)

### Frontend Architecture
- **React + Vite**: Development environment with HMR
- **State Management**: Redux Toolkit with normalized state (`frontend/src/store/`)
- **Routing**: React Router v6 with protected routes
- **Styling**: Tailwind CSS with dark mode support
- **Custom Hooks**: Encapsulated business logic (`frontend/src/hooks/`)
- **Real-time**: Socket.io-client for message updates

## Key Files and Patterns

### State Management
- Redux store with optimized caching and performance tracking (`frontend/src/store/slice.js`)
- Normalized user profiles and message caching to prevent redundant API calls
- Timestamp-based cache invalidation (5-minute TTL for profiles)

### Performance Optimizations
- React.memo for preventing unnecessary re-renders
- useCallback and useMemo for expensive operations
- Smart API call prevention using Redux cache tracking
- Request deduplication with in-flight tracking
- See `PERFORMANCE-OPTIMIZATIONS.md` for detailed strategies

### Socket.io Integration
- User joins personal room on connection
- Real-time message delivery and typing indicators
- Online/offline status tracking
- Notification system with sound alerts

## Development Commands

### Backend
```bash
cd backend
npm install          # Install dependencies
npm start           # Start with nodemon (hot reload)
```

### Frontend
```bash
cd frontend
npm install          # Install dependencies
npm run dev         # Start Vite dev server
npm run build       # Build for production
npm run lint        # Run ESLint
```

## Environment Variables

### Backend (.env)
```
PORT=8000
MONGO_URI=<mongodb_connection_string>
JWT_SECRET=<jwt_secret_key>
```

### Frontend
- Uses Vite proxy configuration for API calls during development
- Production API URL should be configured in `axiosInstance.js`

## API Endpoints

### User Routes (`/api/user`)
- POST `/register` - User registration
- POST `/login` - User authentication
- GET `/` - Search users (protected)

### Chat Routes (`/api/chat`)
- POST `/` - Create/access one-on-one chat (protected)
- GET `/` - Fetch all chats for user (protected)
- POST `/group` - Create group chat (protected)
- PUT `/rename` - Rename group (protected)
- PUT `/groupadd` - Add user to group (protected)
- PUT `/groupremove` - Remove user from group (protected)

### Message Routes (`/api/messages`)
- POST `/` - Send message (protected)
- GET `/:chatId` - Get all messages for chat (protected)

## Code Style Guidelines

### Frontend (React/JavaScript)
- Functional components with hooks
- Custom hooks for business logic
- Memoization for performance-critical components
- Tailwind utility classes for styling
- Redux Toolkit for state management

### Backend (Node.js/Express)
- Express async handlers for error handling
- Mongoose models with validation
- JWT middleware for protected routes
- Centralized error handling

## Testing Approach
Currently no test suite is implemented. When adding tests:
- Frontend: Use Jest + React Testing Library
- Backend: Use Jest for unit/integration tests
- Check package.json for any test scripts before running

## Important Considerations

1. **Authentication**: All chat and message routes require JWT token in Authorization header
2. **Real-time Features**: Socket.io connection required for live messages and notifications
3. **Performance**: Review `PERFORMANCE-OPTIMIZATIONS.md` before modifying core components
4. **State Updates**: Follow Redux patterns for cache invalidation and request tracking
5. **Error Handling**: Use try-catch blocks and proper error responses
6. **CORS**: Configured for localhost:3000 and localhost:5173 in development