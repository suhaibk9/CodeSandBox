import fs from "fs/promises";
export const handleTerminalSocketEvents = (socket, projectId) => {
  socket.on("shell-ipt", (data) => {
    console.log("Shell IPT", data);
    socket.emit("shell-opt", (data) =>
      console.log("Shell Output Data: ", data),
    );
  });
};
