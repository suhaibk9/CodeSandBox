import AppRouter from "./router";
import { io } from "socket.io-client";

// const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  // const socket = io(SOCKET_URL);

  return <AppRouter />;
}

export default App;
