# ScryAndTrack

ScryAndTrack is a companion application for **Magic: The Gathering™ Commander** players who want to capture, analyze, and share their pod's game statistics. The project couples a modern React client with a secure Node.js/Express API so that playgroups can log decks, track match outcomes, and surface trends over time while keeping gameplay data safe and organized.

## Table of Contents
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Initial Setup](#initial-setup)
- [Environment Variables](#environment-variables)
- [Running the Apps](#running-the-apps)
- [Building for Production](#building-for-production)
- [Testing and Quality Checks](#testing-and-quality-checks)
- [Contributing](#contributing)
- [Coding Standards](#coding-standards)
- [License](#license)

## Project Structure
The repository is split into two primary workspaces:

```
ScryAndTrack/
├── client/   # Vite + React SPA for the Commander stats dashboard
└── server/   # Express REST API, authentication, and data services
```

- **client/** – A Vite-powered React 19 frontend that visualizes player statistics, handles user interaction, and consumes the server API. Tailwind CSS (via `@tailwindcss/vite`) is available for styling and lucide icons for UI polish.
- **server/** – A Node.js/Express backend connected to MongoDB via Mongoose. Handles authentication, scheduled jobs with `node-cron`, and validation via `validator`. The app is organized around configuration, controllers, models, routes, middlewares, and utility helpers.

## Prerequisites
Before working with the project make sure you have the following installed:

- [Node.js](https://nodejs.org/) **18.x or later** (ensures compatibility with both workspaces).
- [npm](https://www.npmjs.com/) (ships with Node.js).
- A running [MongoDB](https://www.mongodb.com/) instance or cloud URI for the server API.

## Initial Setup
1. **Clone the repository** and move into the project directory:
   ```bash
   git clone <your-fork-or-origin-url>
   cd ScryAndTrack
   ```

2. **Install dependencies for each workspace**:
   ```bash
   # Client dependencies
   cd client
   npm install

   # Server dependencies
   cd ../server
   npm install
   ```

   > Tip: If you use `npm` workspaces or a mono-repo manager you can install from the root, but the project is currently managed as two independent packages.

## Environment Variables
The server expects its secrets to be provided via environment variables. Create a `server/.env` file (never commit secrets to source control) with the following keys:

| Variable | Description |
| --- | --- |
| `PORT` | Port the Express API should listen on (e.g., `4000`). |
| `NODE_ENV` | `development`, `test`, or `production`. Controls database selection. |
| `LOCAL_MONGO` | MongoDB connection string for local development. |
| `TEST_MONGO` | MongoDB connection string used when `NODE_ENV=test`. |
| `MONGO` | Production MongoDB connection string. |
| `JWT_SECRET` and other auth-related secrets | Required by authentication controllers (see `server/controllers`). |

> Never hardcode secrets in the codebase—rely on `.env` files, secret stores, or your CI/CD provider's secure variables.

## Running the Apps
1. **Start the backend (Express API)**:
   ```bash
   cd server
   npm run dev
   ```
   The command runs `nodemon` with `NODE_ENV=development`. Once it connects to MongoDB you can access the API at `http://localhost:<PORT>`.

2. **Start the frontend (React client)** in a separate terminal:
   ```bash
   cd client
   npm run dev
   ```
   Vite serves the UI on a local development port (typically `5173`). Configure API URLs via environment files (e.g., `client/.env`) to ensure the client targets the correct server host.

## Building for Production
- **Client build**:
  ```bash
  cd client
  npm run build
  npm run preview   # optional: serve the production build locally
  ```
- **Server production start**:
  ```bash
  cd server
  npm run start
  ```
  Ensure `NODE_ENV=production` and production secrets are set before deploying. Consider process managers like PM2 or container orchestration platforms for scalability and monitoring.

## Testing and Quality Checks
- **Frontend linting**:
  ```bash
  cd client
  npm run lint
  ```
- **Frontend end-to-end tests** (requires Playwright browsers installed):
  ```bash
  cd client
  npm run test
  ```

Back-end automated tests are not yet implemented. When adding server-side features, accompany them with unit or integration tests to maintain reliability and protect against regressions.

## Contributing
We welcome contributions that improve gameplay analytics, user experience, and platform stability.

1. Fork the repository and create a feature branch (`git checkout -b feature/amazing-idea`).
2. Follow the coding standards outlined below and document any new endpoints or UI flows.
3. Run linting/tests where applicable.
4. Open a pull request summarizing your changes, verification steps, and any required follow-up.

Please keep user data privacy, security, and accessibility in mind with every change.

## Coding Standards
- Follow the existing module structure (`controllers`, `models`, `routes`, `middlewares`, `utils`) when working in the server.
- Use TypeScript-style JSDoc or inline documentation comments to explain complex logic.
- Apply ESLint rules defined in `client/eslint.config.js` and watch for warnings in your editor.
- Prefer modular, reusable components/hooks on the frontend and maintain a clear separation of concerns on the backend.
- Validate all external input and handle errors gracefully—never assume a happy path.

## License
This project is distributed under the **[TBD]** license. Replace this section with the appropriate license text when finalized.
