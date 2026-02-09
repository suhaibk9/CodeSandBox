# CodeSandBox Backend

## Overview
This is the backend server for the CodeSandBox application. It provides:
- REST APIs for project management
- Socket.IO for real-time collaborative editing
- WebSocket for terminal connections to Docker containers

---

## Running the Dev Server in Docker Container

When running `npm run dev` inside the Docker terminal (sandbox container), you need to follow these steps to access the dev server from your browser:

### Step 1: Start the Dev Server with Host Flag
In the terminal (inside the Docker container), run:

```bash
npm run dev -- --host 0.0.0.0
```

> ⚠️ **Important:** The `--host 0.0.0.0` flag is required to expose the dev server outside the container. Without it, the server only listens on `localhost` inside the container and won't be accessible.

### Step 2: Find the Mapped Port
The container's internal port (e.g., 5173) is mapped to a random host port by Docker.

**To find the mapped port:**
1. Look at the **Backend console/logs** in your terminal
2. Find the port mapping info that shows something like:
   ```
   PORT ON CONTAINER { '5173/tcp': [{ HostIp: '0.0.0.0', HostPort: '32768' }] }
   ```
3. The `HostPort` value (e.g., `32768`) is the port you need

### Step 3: Access in Browser
Open your browser and go to:

```
http://localhost:<HostPort>
```

For example, if `HostPort` is `32768`:
```
http://localhost:32768
```

---

## Docker Port Mapping Explained

When we create the Docker container, we use dynamic port mapping:

```javascript
ExposedPorts: { "5173/tcp": {} },
HostConfig: {
  PortBindings: { "5173/tcp": [{ HostPort: "" }] }  // Empty = random port
}
```

- **Container port:** `5173` (Vite's default dev server port)
- **Host port:** Randomly assigned by Docker (e.g., `32768`, `32769`, etc.)

This avoids port conflicts when running multiple containers simultaneously.

---

## Quick Reference

| Step | Action |
|------|--------|
| 1 | Run `npm run dev -- --host 0.0.0.0` in Docker terminal |
| 2 | Check backend console for `HostPort` value |
| 3 | Open `http://localhost:<HostPort>` in browser |

---

## Environment Variables

Create a `.env` file with:

```env
PORT=3000
REACT_PROJECT_COMMAND_JS=npm create vite@latest
REACT_PROJECT_COMMAND_TS=npm create vite@latest
```

---

## Scripts

```bash
# Start the server
npm start

# Start with nodemon (dev)
npm run dev
```
