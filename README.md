# Kombinu Frontend (MVP)

This directory contains the React-based frontend for the Kombinu platform, built with Vite and TypeScript.

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm (Node Package Manager)

### Installation

1. Navigate to this directory:

   ```bash
   cd project
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

### Development

Start the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The app will be available at `http://localhost:5173`.

### Production Build

To create a production-ready build:

```bash
npm run build
```

Preview the build locally:

```bash
npm run preview
```

## 🏗 Project Structure

- `src/components`: Reusable UI components (Card, Button, Header).
- `src/pages`: Main application pages (Dashboard, Marketplace, Quiz, etc.).
- `src/services`: API Integration services using Axios (Auth, Content, Ranking, Quiz).
- `src/contexts`: React Context definitions (AuthContext, ThemeContext).
- `src/routes`: Router configuration.

## 🔌 API Integration

The frontend assumes the Django backend is running at `http://localhost:8000`.
Configuration is handled in `vite.config.ts` (proxy) and `src/services/api.ts`.
