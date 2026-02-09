# CodeSandBox Clone

A browser-based React playground that feels like VS Code. You can create a fresh React project (JS/TS), browse and edit files in a VS Code–style explorer, and sync changes in real time over sockets.

## Highlights

- Create React projects with Vite (JavaScript or TypeScript)
- VS Code–inspired UI with file explorer and tabs
- Monaco editor with debounced file writes
- File/folder operations over Socket.IO (create, delete, rename, read/write)
- Real-time file tree updates backed by server-side watchers
- Docker-based sandbox container per project (mounted to the project folder)

## Project Layout

- `Frontend/` React + Vite client
- `Backend/` Node + Express API and Socket.IO server
- `Backend/Projects/` Local workspace where new projects are generated
- `Backend/Dockerfile` Sandbox image definition (used by Docker)

## How It Works (Quick Overview)

1. Frontend creates a project with `POST /api/v1/projects` (name + language).
2. Backend creates a new folder in `Backend/Projects/<projectId>` and runs Vite.
3. Editor connects to Socket.IO namespace `/editor` with the `projectId`.
4. File operations are sent over sockets; server writes to disk and broadcasts updates.
5. Backend can start a Docker container that mounts the project folder for isolation.

## Local Development

### Prerequisites

- Node.js (LTS recommended)
- Docker (running locally)

### Backend Setup

```bash
cd Backend
npm install
```

The backend uses `Backend/.env`. The key values:

- `PORT` (default `3000`)
- `REACT_PROJECT_COMMAND_JS` (default `npm create vite@latest`)
- `REACT_PROJECT_COMMAND_TS` (default `npm create vite@latest`)
- `SANDBOX_IMAGE` (should be `sandbox:latest`)

Build the sandbox image (required for container creation):

```bash
cd Backend
docker build -t sandbox:latest -f Dockerfile .
```

Start the backend:

```bash
cd Backend
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
```

Frontend reads `Frontend/.env`:

- `VITE_API_BASE_URL` (default `http://localhost:3000`)

Start the frontend:

```bash
cd Frontend
npm run dev
```

Open the app at the Vite dev URL (usually `http://localhost:5173`).

## API

- `POST /api/v1/projects`
  - Body: `{ "language": "js" | "ts", "projectName": "my-app" }`
  - Response: `{ projectId, language, projectName }`
- `GET /api/v1/projects/:projectId/tree`
  - Returns a directory tree for the project

## Real-time Events (Editor)

Socket.IO namespace: `/editor`

Incoming/outgoing events:

- `readFile` → `fileData`
- `writeFile` → `fileWritten`
- `createFile` → `fileCreated`
- `deleteFile` → `fileDeleted`
- `createFolder` → `folderCreated`
- `deleteFolder` → `folderDeleted`
- `rename` → `renamed`

## Notes

- The terminal UI uses a WebSocket connection and is wired to `ws://localhost:3000/terminal`.
- Project folders are created under `Backend/Projects/` and mounted into containers.
- The Docker image name must match `SANDBOX_IMAGE` in the backend `.env`.

---

## Running the Dev Server Inside Docker Container

When you run `npm run dev` inside the Docker terminal (sandbox container), follow these steps to access the dev server from your browser:

### Step 1: Start the Dev Server with Host Flag
In the Docker terminal, run:

```bash
npm run dev -- --host 0.0.0.0
```

> ⚠️ **Important:** The `--host 0.0.0.0` flag is required! Without it, the server only listens on `localhost` inside the container and won't be accessible from your browser.

### Step 2: Find the Mapped Port
Check the **Backend console/logs** for the port mapping. Look for:

```
PORT ON CONTAINER { '5173/tcp': [{ HostIp: '0.0.0.0', HostPort: '32768' }] }
```

The `HostPort` value (e.g., `32768`) is the port you need.

### Step 3: Access in Browser
Open your browser and go to:

```
http://localhost:<HostPort>
```

For example: `http://localhost:32768`

### Quick Reference

| Step | Action |
|------|--------|
| 1 | Run `npm run dev -- --host 0.0.0.0` in Docker terminal |
| 2 | Check backend console for `HostPort` value |
| 3 | Open `http://localhost:<HostPort>` in browser |
