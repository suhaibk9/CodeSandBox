// ============================================
// MAIN SERVER ENTRY POINT
// ============================================
// This is the main server file that sets up:
// 1. Express HTTP server for REST APIs
// 2. Socket.IO for real-time editor collaboration
// 3. Raw WebSocket for terminal connections to Docker containers

// ============================================
// IMPORTS
// ============================================
import express from "express"; // Web framework for handling HTTP requests
import cors from "cors"; // Cross-Origin Resource Sharing - allows frontend to call backend
import { createServer } from "node:http"; // Node's HTTP module to create raw HTTP server
import { Server } from "socket.io"; // Socket.IO for real-time bidirectional communication
import { PORT } from "./config/serverConfig.js"; // Server port from environment variables
import apiRouter from "../routes/index.js"; // REST API routes
import chokidar from "chokidar"; // File system watcher - monitors file/folder changes in real-time
import path from "node:path"; // Node's path module for file path operations
import queryString from "query-string"; // Parse query strings from URLs
import { handleTerminalSocketEvents } from "../socketHandlers/terminalHandler.js"; // Terminal socket event handlers
import { handleEditorSocketEvents } from "../socketHandlers/editorHandler.js"; // Editor socket event handlers
import { handleContainerCreate } from "./containers/handleContainerCreate.js"; // Docker container creation logic
import { WebSocketServer } from "ws"; // Raw WebSocket server for terminal connections
import { handleTerminalConnection } from "./containers/handleTerminalConnection.js"; // Terminal connection handler

// ============================================
// EXPRESS APP SETUP
// ============================================
// Create Express application instance
const app = express();

// ============================================
// HTTP SERVER SETUP
// ============================================
// Create HTTP server wrapping Express app
// This is required for Socket.IO and WebSocket to work alongside Express on the same port
// Instead of app.listen(), we use server.listen() so all protocols share port 3000
const server = createServer(app);

// ============================================
// WEBSOCKET TERMINAL SERVER SETUP
// ============================================
// Create a raw WebSocket server for terminal connections
// noServer: true means we handle the HTTP upgrade manually (not automatically)
// This allows us to decide which upgrade requests go to WebSocket vs Socket.IO
const WebSocketTerminal = new WebSocketServer({
  noServer: true, // We'll manually handle the HTTP->WebSocket upgrade
});

// ============================================
// HTTP UPGRADE HANDLER
// ============================================
// When a client wants to upgrade HTTP to WebSocket, this event fires
// We intercept it to route /terminal requests to our WebSocket server
// and let Socket.IO handle /socket.io requests
server.on("upgrade", (req, tcp, head) => {
  // req: The HTTP request object with URL, headers, etc.
  // tcp: The raw TCP socket connection that will be upgraded
  // head: First packet of the upgraded stream (usually empty for WebSocket)

  console.log("REQ URL", req.url);

  // Check if this is a terminal connection request
  const isTerminal = req.url.includes("/terminal");
  console.log("IS TERMINAL: ", isTerminal);

  if (isTerminal) {
    console.log("Request URL: ", req.url);

    // Extract projectId from URL: /terminal?projectId=abc123
    // split("=")[1] gets "abc123" from "projectId=abc123"
    const projectId = req.url.split("=")[1];

    // Create Docker container and upgrade connection to WebSocket
    handleContainerCreate(projectId, WebSocketTerminal, req, tcp, head);
  }
  // If not terminal, Socket.IO will handle the upgrade automatically
});

// ============================================
// WEBSOCKET TERMINAL CONNECTION HANDLER
// ============================================
// When a WebSocket terminal connection is successfully established
// This fires after handleContainerCreate calls wss.emit("connection", ...)
WebSocketTerminal.on("connection", (webSocket, req, container) => {
  // ============================================
  // RAW WEBSOCKET MESSAGE HANDLER
  // ============================================
  // Raw WebSocket doesn't have named events like Socket.IO!
  // All data comes through the "message" event as raw strings/buffers
  // We need to parse the message to determine what action to take
  webSocket.on("message", (data) => {
    const message = data.toString(); // Convert Buffer to string

    if (message === "getPort") {
      console.log("GET PORT ON BACKEND");
      // container.inspect() returns full container details including network info
      container.inspect((err, containerInfo) => {
        if (err) {
          console.error("Error inspecting container:", err);
          return;
        }
        // NetworkSettings.Ports contains port mappings
        // Example: { "5173/tcp": [{ HostIp: "0.0.0.0", HostPort: "32768" }] }
        const ports = containerInfo.NetworkSettings.Ports;
        console.log("PORT ON CONTAINER", ports);
        // webSocket.send(JSON.stringify({ type: "port", ports }));
      });
      return; // Don't forward this command to the container
    }

    // Other messages are terminal input - handled by handleTerminalConnection
  });

  // Set up bidirectional communication between WebSocket and Docker container
  handleTerminalConnection(container, webSocket);

  // Clean up when WebSocket connection closes
  webSocket.on("close", () => {
    // Force remove the Docker container to free up resources
    container.remove({ force: true }, (err, data) => {
      if (err) console.error("Unable to close container", err);
      console.log("Connection Removed: ", data);
    });
  });
});

// ============================================
// CORS CONFIGURATION
// ============================================
// Define which frontend origins are allowed to make requests to this server
// Without CORS, browsers block cross-origin requests for security
const corsOptions = {
  origin: [
    "http://localhost:5173", // Vite dev server (default port)
    "https://code-sand-box-one.vercel.app", // Production frontend on Vercel
    "http://localhost:5174", // Alternative Vite port
  ],
};

// ============================================
// EXPRESS MIDDLEWARE SETUP
// ============================================
app.use(cors(corsOptions)); // Enable CORS with specified origins
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// ============================================
// REST API ROUTES
// ============================================
// Mount all API routes under /api prefix
// e.g., /api/v1/projects, /api/v1/ping
app.use("/api", apiRouter);

// ============================================
// SOCKET.IO SETUP
// ============================================
// Socket.IO enables real-time, bidirectional communication between client and server
// Unlike REST APIs (request-response), sockets maintain persistent connections
// Use cases: live updates, chat, collaborative editing, file sync

const io = new Server(server, {
  cors: {
    origin: "*", // Allow all origins for socket connections
    methods: ["GET", "POST"], // Allowed HTTP methods
  },
});

// ============================================
// DEFAULT NAMESPACE ("/")
// ============================================
// Handles general socket connections
// This fires when a client connects to: io("http://localhost:3000")
io.on("connection", (socket) => {
  console.log("A user connected");
});

// ============================================
// EDITOR NAMESPACE ("/editor")
// ============================================
// Namespaces allow you to split socket logic into separate channels
// Client connects to: io("http://localhost:3000/editor")
// Useful for separating concerns (e.g., /editor, /chat, /notifications)
// Each namespace has its own event handlers and rooms

const editorNamespace = io.of("/editor");
editorNamespace.on("connection", (socket) => {
  console.log("Editor namespace connected");

  // ============================================
  // EXTRACT PROJECT ID FROM CONNECTION
  // ============================================
  // The frontend passes projectId as a query parameter when connecting:
  // io("http://localhost:3000/editor", { query: { projectId: "abc123" } })
  let projectId = socket.handshake.query.projectId;
  console.log("Project ID for this socket:", projectId);

  if (projectId) {
    // ============================================
    // JOIN PROJECT ROOM
    // ============================================
    // Rooms allow broadcasting to specific groups of sockets
    // All users editing the same project join the same room
    // This enables collaborative editing - changes broadcast only to same project
    socket.join(projectId);
    console.log(`Socket ${socket.id} joined room: ${projectId}`);

    // Notify others in the room that someone joined
    socket
      .to(projectId) // Send to everyone in room EXCEPT sender
      .emit("userJoined", `User ${socket.id} joined the project`);

    // ============================================
    // CHOKIDAR FILE WATCHER
    // ============================================
    // Chokidar watches file system for changes (add, change, delete, etc.)
    // When files change, we can notify connected clients via socket
    // This enables real-time file sync - when files change on disk, UI updates

    var watcher = chokidar.watch("./Projects/" + projectId, {
      // Ignore node_modules to avoid watching thousands of files
      // This improves performance significantly
      ignored: (filePath) => filePath.includes("node_modules"),

      // persistent: true keeps the watcher running as long as the app runs
      // If false, watcher would stop after initial scan
      persistent: true,

      // awaitWriteFinish: Wait for file writes to complete before triggering events
      // Prevents multiple events firing while a file is being written
      awaitWriteFinish: {
        stabilityThreshold: 2000, // Wait 2 seconds after last change before firing event
        pollInterval: 1000, // Check every 1 second if file is still being written
      },

      // ignoreInitial: true prevents "add" events from firing for existing files
      // during initial scan. Without this, all existing files trigger "add" on startup
      ignoreInitial: true,
    });

    // ============================================
    // FILE SYSTEM EVENT LISTENER
    // ============================================
    // Listen to ALL file system events
    // evt: "add" | "addDir" | "change" | "unlink" | "unlinkDir"
    // - add: file created
    // - addDir: directory created
    // - change: file content modified
    // - unlink: file deleted
    // - unlinkDir: directory deleted
    watcher.on("all", (evt, filePath) => {
      console.log("File event:", evt);
      console.log("File path:", filePath);
      // TODO: Emit events to clients to update their file tree
    });

    // ============================================
    // CLEANUP ON DISCONNECT
    // ============================================
    // Clean up watcher when client disconnects to prevent memory leaks
    // Each connected client has its own watcher, so we must close it
    socket.on("disconnect", () => {
      watcher.close();
      console.log("Editor client disconnected, watcher closed");
    });
  }

  // ============================================
  // REGISTER EDITOR EVENT HANDLERS
  // ============================================
  // Set up handlers for editor-specific socket events
  // (readFile, writeFile, createFile, deleteFile, etc.)
  handleEditorSocketEvents(socket, projectId);
});

// ============================================
// START SERVER
// ============================================
// Start listening on the configured port
// This makes the server accessible at http://localhost:PORT
server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
