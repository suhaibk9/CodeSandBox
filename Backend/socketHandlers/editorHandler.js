import fs from "fs/promises";
export const handleEditorSocketEvents = (socket) => {
  //Write File Event Handler
  socket.on("writeFile", async (data, filePath) => {
    try {
      console.log("Write To", filePath);
      const res = await fs.writeFile(filePath, data);
      console.log("res->", res);
      socket.emit("fileWritten", { success: true, filePath });
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
      const isFileExisting = await fs.stat(filePath);
      if (isFileExisting) {
        throw new Error("File already exists");
      }
      const res = await fs.writeFile(filePath, "");
      socket.emit("fileCreated", res);
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
      //First check if file exists
      const isFileExisting = await fs.stat(filePath);
      if (!isFileExisting) {
        throw new Error("File does not exist");
      }
      const res = await fs.unlink(filePath);
      socket.emit("fileDeleted", res);
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
      const isFolderExisting = await fs.stat(folderPath);
      if (isFolderExisting) {
        throw new Error("Folder already exists");
      }
      const res = await fs.mkdir(folderPath);
      socket.emit("folderCreated", res);
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
      //First check if folder exists
      const isFolderExisting = await fs.stat(folderPath);
      if (!isFolderExisting) {
        throw new Error("Folder does not exist");
      }
      const res = await fs.rmdir(folderPath, { recursive: true });
      socket.emit("folderDeleted", res);
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
      const res = await fs.rename(oldPath, newPath);
      socket.emit("renamed", res);
    } catch (err) {
      console.error("Error renaming file/folder:", err);
      socket.emit("error", {
        message: "Failed to rename file/folder",
        details: err.message,
      });
    }
  });
};
