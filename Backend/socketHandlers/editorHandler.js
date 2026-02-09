// ============================================
// EDITOR SOCKET EVENTS HANDLER MODULE
// ============================================
// This module handles all file and folder operations through Socket.IO.
// It provides real-time collaborative editing by broadcasting changes
// to all clients in the same project room.
//
// Architecture Overview:
// - Each project has its own Socket.IO room (room name = projectId)
// - When a client makes a file change, it's:
//   1. Persisted to disk using Node.js fs module
//   2. Confirmed back to the sender via socket.emit()
//   3. Broadcast to other clients in the room via socket.to(room).emit()
//
// Available Events:
// - writeFile: Update file contents (save)
// - createFile: Create a new empty file
// - deleteFile: Delete a file
// - readFile: Read file contents
// - createFolder: Create a new directory
// - deleteFolder: Delete a directory (recursive)
// - rename: Rename a file or folder

// ============================================
// IMPORT DEPENDENCIES
// ============================================
// Import the promise-based version of Node.js file system module
// This allows us to use async/await syntax for file operations
import fs from "fs/promises";

// ============================================
// MAIN HANDLER FUNCTION
// ============================================
/**
 * Sets up all Socket.IO event listeners for file/folder operations.
 *
 * This function is called when a client connects to the /editor namespace.
 * It registers event handlers on the socket for various file operations.
 * All operations are scoped to a specific project via the projectId (room).
 *
 * @param {Socket} socket - The Socket.IO socket instance for this connection
 * @param {string} projectId - The unique identifier for the project (also the room name)
 */
export const handleEditorSocketEvents = (socket, projectId) => {
  // ============================================
  // WRITE FILE EVENT HANDLER
  // ============================================
  // Event: "writeFile"
  // Purpose: Save/update file contents to disk
  // Triggered when: User saves a file in the editor
  // Broadcast: Notifies other clients so they can update their view
  socket.on("writeFile", async (data, filePath) => {
    try {
      // Log for debugging - shows which file is being written
      console.log("Write To", filePath);

      // Write the content to the file on disk
      // fs.writeFile creates the file if it doesn't exist, or overwrites if it does
      await fs.writeFile(filePath, data);

      // Broadcast to all clients in the SAME ROOM (project) except sender
      // socket.to(room) - targets all sockets in the room EXCEPT the sender
      // This allows other collaborators to see the file change in real-time
      socket.to(projectId).emit("fileWritten", { filePath, content: data });
    } catch (err) {
      // Log the error server-side for debugging
      console.error("Error writing file:", err);

      // Emit error back to the sender so they can handle it in the UI
      socket.emit("error", {
        message: "Failed to write file",
        details: err.message,
      });
    }
  });

  // ============================================
  // CREATE FILE EVENT HANDLER
  // ============================================
  // Event: "createFile"
  // Purpose: Create a new empty file at the specified path
  // Triggered when: User creates a new file via context menu or keyboard shortcut
  // Broadcast: Notifies all clients so they can add it to their file tree
  socket.on("createFile", async (filePath) => {
    try {
      // Check if the file already exists to prevent overwriting
      // fs.stat throws an error if the file doesn't exist, we catch it and return null
      const isFileExisting = await fs.stat(filePath).catch(() => null);

      // If the file exists, throw an error to prevent overwriting
      if (isFileExisting) {
        throw new Error("File already exists");
      }

      // Create an empty file at the specified path
      // Writing empty string "" creates the file without content
      await fs.writeFile(filePath, "");

      // Confirm to the sender that the file was created successfully
      socket.emit("fileCreated", { filePath });

      // Broadcast to others in the room so they can update their file tree
      // Uses socket.to() to exclude the sender (they already know from above emit)
      socket.to(projectId).emit("fileCreated", { filePath });
    } catch (err) {
      // Log the error server-side
      console.error("Error creating file:", err);

      // Send error back to the client
      socket.emit("error", {
        message: "Failed to create file",
        details: err.message,
      });
    }
  });

  // ============================================
  // DELETE FILE EVENT HANDLER
  // ============================================
  // Event: "deleteFile"
  // Purpose: Delete a file from disk
  // Triggered when: User deletes a file via context menu or keyboard shortcut
  // Broadcast: Notifies all clients so they can remove it from their file tree
  socket.on("deleteFile", async (filePath) => {
    try {
      // Delete the file from disk
      // fs.unlink removes the file (doesn't work on directories)
      await fs.unlink(filePath);

      // Confirm to the sender that the file was deleted
      socket.emit("fileDeleted", { filePath });

      // Broadcast to others in the room so they can update their file tree
      socket.to(projectId).emit("fileDeleted", { filePath });
    } catch (err) {
      // Log the error server-side
      console.error("Error deleting file:", err);

      // Send error back to the client
      socket.emit("error", {
        message: "Failed to delete file",
        details: err.message,
      });
    }
  });

  // ============================================
  // READ FILE EVENT HANDLER
  // ============================================
  // Event: "readFile"
  // Purpose: Read file contents from disk and send to client
  // Triggered when: User opens/clicks on a file in the file tree
  // No broadcast: Reading doesn't change anything, only sender needs the content
  socket.on("readFile", async (filePath) => {
    try {
      // Log for debugging - shows which file is being read
      console.log("Reading file at path:", filePath);

      // Read the file contents as UTF-8 encoded text
      // For binary files, you'd omit the encoding or use 'binary'
      const data = await fs.readFile(filePath, "utf-8");

      // Log the data read (useful for debugging, but be careful with large files)
      console.log("File data read:", data);

      // Send the file contents back to the requester
      // Include both the data and filePath so the client knows which file this is for
      // (client may have multiple read requests in flight)
      socket.emit("fileData", {
        data: data.toString(), // Ensure it's a string
        filePath: filePath, // Echo back the path for identification
      });
    } catch (err) {
      // Log the error server-side
      console.error("Error reading file:", err);

      // Send error back to the client
      socket.emit("error", {
        message: "Failed to read file",
        details: err.message,
      });
    }
  });

  // ============================================
  // CREATE FOLDER EVENT HANDLER
  // ============================================
  // Event: "createFolder"
  // Purpose: Create a new directory at the specified path
  // Triggered when: User creates a new folder via context menu
  // Broadcast: Notifies all clients so they can add it to their file tree
  socket.on("createFolder", async (folderPath) => {
    try {
      // Check if the folder already exists to prevent errors
      // fs.stat throws an error if path doesn't exist, we catch it and return null
      const isFolderExisting = await fs.stat(folderPath).catch(() => null);

      // If the folder exists, throw an error
      if (isFolderExisting) {
        throw new Error("Folder already exists");
      }

      // Create the directory
      // Note: This only creates the final directory, parent must exist
      // For nested paths, you'd use fs.mkdir(path, { recursive: true })
      await fs.mkdir(folderPath);

      // Confirm to the sender that the folder was created
      socket.emit("folderCreated", { folderPath });

      // Broadcast to others in the room so they can update their file tree
      socket.to(projectId).emit("folderCreated", { folderPath });
    } catch (err) {
      // Log the error server-side
      console.error("Error creating folder:", err);

      // Send error back to the client
      socket.emit("error", {
        message: "Failed to create folder",
        details: err.message,
      });
    }
  });

  // ============================================
  // DELETE FOLDER EVENT HANDLER
  // ============================================
  // Event: "deleteFolder"
  // Purpose: Delete a directory and all its contents recursively
  // Triggered when: User deletes a folder via context menu
  // Broadcast: Notifies all clients so they can remove it from their file tree
  // WARNING: This is destructive and removes all contents!
  socket.on("deleteFolder", async (folderPath) => {
    try {
      // Delete the directory and all its contents recursively
      // fs.rm with { recursive: true } removes the directory and everything inside
      // This is equivalent to 'rm -rf' in shell
      await fs.rm(folderPath, { recursive: true });

      // Confirm to the sender that the folder was deleted
      socket.emit("folderDeleted", { folderPath });

      // Broadcast to others in the room so they can update their file tree
      socket.to(projectId).emit("folderDeleted", { folderPath });
    } catch (err) {
      // Log the error server-side
      console.error("Error deleting folder:", err);

      // Send error back to the client
      socket.emit("error", {
        message: "Failed to delete folder",
        details: err.message,
      });
    }
  });

  // ============================================
  // RENAME FILE/FOLDER EVENT HANDLER
  // ============================================
  // Event: "rename"
  // Purpose: Rename a file or folder (also works for moving)
  // Triggered when: User renames via context menu or double-click
  // Broadcast: Notifies all clients so they can update their file tree
  // Note: fs.rename can also MOVE files if newPath has different directory
  socket.on("rename", async (oldPath, newPath) => {
    try {
      // Rename (or move) the file/folder
      // fs.rename works on both files and directories
      // It can also move items if the newPath has a different parent directory
      await fs.rename(oldPath, newPath);

      // Confirm to the sender that the rename was successful
      socket.emit("renamed", { oldPath, newPath });

      // Broadcast to others in the room so they can update their file tree
      socket.to(projectId).emit("renamed", { oldPath, newPath });
    } catch (err) {
      // Log the error server-side
      console.error("Error renaming file/folder:", err);

      // Send error back to the client
      socket.emit("error", {
        message: "Failed to rename file/folder",
        details: err.message,
      });
    }
  });
};
 