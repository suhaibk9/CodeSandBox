import express from "express";
import cors from "cors";
import { createServer } from "node:http";
import { Server } from "socket.io";
import { PORT } from "./config/serverConfig.js";
import apiRouter from "../routes/index.js";
import chokidar from "chokidar"; // File system watcher - monitors file/folder changes in real-time
import path from "node:path";
const app = express();

// Create HTTP server wrapping Express app
// Required for Socket.IO to work alongside Express on the same port
const server = createServer(app);

const corsOptions = {
  origin: [
    "http://localhost:5173",
    "https://code-sand-box-one.vercel.app",
    "http://localhost:5174",
  ],
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
    methods: ["GET", "POST"],
  },
});

// Default namespace ("/") - handles general socket connections
// This fires when a client connects to: io("http://localhost:3000")
io.on("connection", (socket) => {
  console.log("A user connected");
});

// ============================================
// EDITOR NAMESPACE
// ============================================
// Namespaces allow you to split socket logic into separate channels
// Client connects to: io("http://localhost:3000/editor")
// Useful for separating concerns (e.g., /editor, /chat, /notifications)

const editorNamespace = io.of("/editor");
editorNamespace.on("connection", (socket) => {
  console.log("Editor namespace connected");

  // Example: const projectId = socket.handshake.query.projectId;
  let projectId = "9ed3d636-abc8-4b88-b63b-4dadffcb312c";
  if (projectId) {
    // ============================================
    // CHOKIDAR FILE WATCHER
    // ============================================
    // Chokidar watches file system for changes (add, change, delete, etc.)
    // When files change, we can notify connected clients via socket
    // This enables real-time file sync - when files change on disk, UI updates

    const watcher = chokidar.watch("./Projects/" + projectId, {
      // Ignore node_modules to avoid watching thousands of files
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

      // TODO: Emit event to client to refresh file tree or file content
      // socket.emit("fileChange", { event: evt, path: filePath });
    });

    // Clean up watcher when client disconnects to prevent memory leaks
    socket.on("disconnect", () => {
      watcher.close();
      console.log("Editor client disconnected, watcher closed");
    });
  }
  // Listen for messages from client
  // Client sends: socket.emit("message", { content: "hello" })
  socket.on("message", (data) => {
    console.log("Received message event:", data);
  });
});

server.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
