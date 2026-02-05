import fs from "fs/promises";
export const handleEditorSocketEvents = (socket, projectId) => {
  // Get the projectId (room) from the socket's handshake


  //Write File Event Handler
  socket.on("writeFile", async (data, filePath) => {
    try {
      console.log("Write To", filePath);
      await fs.writeFile(filePath, data);
      // Broadcast to all clients in the SAME ROOM (project) except sender
      socket.to(projectId).emit("fileWritten", { filePath, content: data });
    } catch (err) {
      console.error("Error writing file:", err);
      socket.emit("error", {
        message: "Failed to write file",
        details: err.message,
      });
    }
  });
  //Create File Event Handler
  socket.on("createFile", async (filePath) => {
    try {
      const isFileExisting = await fs.stat(filePath).catch(() => null);
      if (isFileExisting) {
        throw new Error("File already exists");
      }
      await fs.writeFile(filePath, "");
      socket.emit("fileCreated", { filePath });
      // Broadcast to others in the room
      socket.to(projectId).emit("fileCreated", { filePath });
    } catch (err) {
      console.error("Error creating file:", err);
      socket.emit("error", {
        message: "Failed to create file",
        details: err.message,
      });
    }
  });
  //Delete File Event Handler
  socket.on("deleteFile", async (filePath) => {
    try {
      await fs.unlink(filePath);
      socket.emit("fileDeleted", { filePath });
      // Broadcast to others in the room
      socket.to(projectId).emit("fileDeleted", { filePath });
    } catch (err) {
      console.error("Error deleting file:", err);
      socket.emit("error", {
        message: "Failed to delete file",
        details: err.message,
      });
    }
  });
  //Read File Event Handler
  socket.on("readFile", async (filePath) => {
    try {
      console.log("Reading file at path:", filePath);
      const data = await fs.readFile(filePath, "utf-8");
      console.log("File data read:", data);
      socket.emit("fileData", {
        data: data.toString(),
        filePath: filePath,
      });
    } catch (err) {
      console.error("Error reading file:", err);
      socket.emit("error", {
        message: "Failed to read file",
        details: err.message,
      });
    }
  });
  //Create Folder Event Handler
  socket.on("createFolder", async (folderPath) => {
    try {
      const isFolderExisting = await fs.stat(folderPath).catch(() => null);
      if (isFolderExisting) {
        throw new Error("Folder already exists");
      }
      await fs.mkdir(folderPath);
      socket.emit("folderCreated", { folderPath });
      // Broadcast to others in the room
      socket.to(projectId).emit("folderCreated", { folderPath });
    } catch (err) {
      console.error("Error creating folder:", err);
      socket.emit("error", {
        message: "Failed to create folder",
        details: err.message,
      });
    }
  });
  //Delete Folder Event Handler
  socket.on("deleteFolder", async (folderPath) => {
    try {
      await fs.rm(folderPath, { recursive: true });
      socket.emit("folderDeleted", { folderPath });
      // Broadcast to others in the room
      socket.to(projectId).emit("folderDeleted", { folderPath });
    } catch (err) {
      console.error("Error deleting folder:", err);
      socket.emit("error", {
        message: "Failed to delete folder",
        details: err.message,
      });
    }
  });
  //Rename File/Folder Event Handler
  socket.on("rename", async (oldPath, newPath) => {
    try {
      await fs.rename(oldPath, newPath);
      socket.emit("renamed", { oldPath, newPath });
      // Broadcast to others in the room
      socket.to(projectId).emit("renamed", { oldPath, newPath });
    } catch (err) {
      console.error("Error renaming file/folder:", err);
      socket.emit("error", {
        message: "Failed to rename file/folder",
        details: err.message,
      });
    }
  });
};
 