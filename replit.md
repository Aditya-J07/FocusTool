# Replit.md

## Overview

This is a React-based productivity dashboard application with a client-server architecture. The app serves as a personal productivity tracker featuring LeetCode problem tracking, YouTube playlist progress, Pomodoro timer functionality, gamification elements, and music player capabilities. It's designed to help developers maintain consistent learning habits and track their daily coding progress through an engaging, focus-oriented interface.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for type safety and modern React features
- **Vite** as the build tool and development server for fast compilation and hot module replacement
- **Tailwind CSS** with shadcn/ui component library for consistent styling and responsive design
- **Wouter** for lightweight client-side routing instead of React Router
- **TanStack Query** for server state management, caching, and API data fetching
- **Radix UI** primitives for accessible, unstyled components as the foundation for the UI system

### Backend Architecture
- **Express.js** server with TypeScript for API endpoints and middleware
- **In-memory storage** implementation using Map data structures for development/demo purposes
- RESTful API design with routes for LeetCode data fetching and user progress tracking
- Middleware for request logging, JSON parsing, and error handling
- Custom storage interface allowing for future database integration

### Data Storage Solutions
- **PostgreSQL** configured via Drizzle ORM with connection pooling through Neon Database
- **Zod schemas** for runtime type validation and data consistency
- **Local storage** for client-side persistence of user preferences, progress data, and gamification stats
- Hybrid approach combining server-side APIs for external data (LeetCode) and client-side storage for user progress

### Authentication and Authorization
- Currently implements a simple user identification system without full authentication
- Uses hardcoded user IDs for demo purposes
- Session-based storage pattern prepared for future authentication integration

### External Service Integrations
- **LeetCode GraphQL API** integration for fetching user coding statistics and daily progress
- **YouTube Data API** capability for playlist tracking and video progress monitoring
- Custom API wrappers with error handling and rate limiting considerations
- Graceful fallback handling for API failures or network issues

### State Management
- **Local storage hooks** for persistent client-side data (useLocalStorage)
- **TanStack Query** for server state caching and synchronization
- **React Context** for theme management and global app state
- Component-level state for UI interactions and temporary data

### Development and Build System
- **ESBuild** for production server bundling with external package handling
- **TypeScript strict mode** with comprehensive type checking across client, server, and shared code
- **Path aliases** for clean imports (@/, @shared/, @assets/)
- **Hot module replacement** in development with Vite integration
- **PostCSS** with Tailwind CSS for style processing

### Gamification and User Experience
- **XP and leveling system** with configurable progression curves
- **Streak tracking** for daily consistency motivation
- **Achievement system** with milestone-based rewards
- **Progress visualization** through charts and progress bars
- **Motivational elements** including random quotes and visual feedback

### Performance Considerations
- **Component lazy loading** preparation for code splitting
- **Image optimization** through proper asset management
- **API response caching** via TanStack Query with configurable stale times
- **Efficient re-rendering** through proper React optimization patterns

## External Dependencies

### Core Framework Dependencies
- **React 18** with ReactDOM for the frontend framework
- **Express.js** for the backend server framework
- **TypeScript** for static type checking across the entire codebase
- **Vite** for development server and build tooling

### Database and ORM
- **Drizzle ORM** for type-safe database operations and schema management
- **@neondatabase/serverless** for PostgreSQL connection with edge compatibility
- **Drizzle Kit** for database migrations and schema synchronization

### UI and Styling
- **Tailwind CSS** for utility-first styling approach
- **Radix UI** component primitives for accessibility and behavior
- **shadcn/ui** component library built on Radix primitives
- **Lucide React** for consistent iconography
- **class-variance-authority** for component variant management

### State Management and Data Fetching
- **TanStack React Query** for server state management and caching
- **Zod** for runtime schema validation and type inference

### Development and Build Tools
- **ESBuild** for fast production builds
- **TSX** for TypeScript execution in development
- **PostCSS** with Autoprefixer for CSS processing

### Third-Party Integrations
- **LeetCode GraphQL API** (external service, no package dependency)
- **YouTube Data API** (external service, future integration planned)

### Utility Libraries
- **clsx** and **tailwind-merge** for conditional CSS class handling
- **date-fns** for date manipulation and formatting
- **nanoid** for unique ID generation

### Development Dependencies
- **@types packages** for TypeScript definitions
- **Replit-specific plugins** for development environment integration