// import { useEffect, useState } from "react";
// import { socket } from "../config/socketConfig";

// export const useSocket = () => {
//   const [isConnected, setIsConnected] = useState(socket.connected);

//   useEffect(() => {
//     const onConnect = () => {
//       setIsConnected(true);
//       console.log("Socket connected");
//     };

//     const onDisconnect = () => {
//       setIsConnected(false);
//       console.log("Socket disconnected");
//     };

//     socket.on("connect", onConnect);
//     socket.on("disconnect", onDisconnect);

//     // Connect on mount
//     socket.connect();

//     return () => {
//       socket.off("connect", onConnect);
//       socket.off("disconnect", onDisconnect);
//     };
//   }, []);

//   return { socket, isConnected };
// };
