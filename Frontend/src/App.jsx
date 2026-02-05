import AppRouter from "./router";
import { io } from "socket.io-client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// const SOCKET_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  // const socket = io(SOCKET_URL);

  return (
    <>
      <AppRouter />
      <ToastContainer />
    </>
  );
}

export default App;
