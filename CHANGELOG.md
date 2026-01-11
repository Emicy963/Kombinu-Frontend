# Changelog (Frontend)

All notable changes to the Kombinu Frontend will be documented in this file.

## [Unreleased] - MVP Candidate

### Added

- **Framework**: Migrated legacy HTML codebase to React 18 + TypeScript + Vite.
- **Service Layer**: Implemented structured API services (`authService`, `dashboardService`, `contentService`, `rankingService`, `quizService`).
- **Authentication**: Full integration with backend Auth endpoints.
- **Features**:
  - **Dark Mode**: System-wide theme toggle.
  - **Dashboards**: Role-based views for 'Criador' and 'Aprendiz'.
  - **Ranking**: Global leaderboard consuming real API data.
  - **Quiz**: Interactive quiz engine with real integration for generation and submission.
  - **Marketplace**: Course listing grid with filters.
- **UI Architecture**: Component-based design using Tailwind CSS.

### Fixed

- **Routing**: Fixed all broken navigation links and 404 errors.
- **Stability**: Resolved all Typescript compilation errors and runtime crashes.
- **API**: Configured reliable Axios interceptors and Proxy settings.
