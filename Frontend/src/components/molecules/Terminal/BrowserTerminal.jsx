import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import { AttachAddon } from "@xterm/addon-attach";
import "@xterm/xterm/css/xterm.css";
import { useEffect, useRef } from "react";

import { useParams } from "react-router-dom";
import useTreeStructureStore from "../../../store/treeStructureStore";
const BrowserTerminal = () => {
  const terminalRef = useRef(null);
  const socket = useRef(null);
  const { projectId: projectIdFromURL } = useParams();
  const { setTreeStructure } = useTreeStructureStore();
  const term = new Terminal({
    cursorBlink: true,
    cursorStyle: "bar",
    fontSize: 13,
    fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
    theme: {
      background: "#1e1e1e",
      foreground: "#d4d4d4",
      cursor: "#aeafad",
      cursorAccent: "#1e1e1e",
      selectionBackground: "#264f78",
      selectionForeground: "#ffffff",
      black: "#1e1e1e",
      red: "#f44747",
      green: "#6a9955",
      yellow: "#dcdcaa",
      blue: "#569cd6",
      magenta: "#c586c0",
      cyan: "#4ec9b0",
      white: "#d4d4d4",
      brightBlack: "#808080",
      brightRed: "#f44747",
      brightGreen: "#6a9955",
      brightYellow: "#dcdcaa",
      brightBlue: "#569cd6",
      brightMagenta: "#c586c0",
      brightCyan: "#4ec9b0",
      brightWhite: "#ffffff",
    },
    convertEol: true,
  });

  useEffect(() => {
    const fitAddon = new FitAddon();
    term.loadAddon(fitAddon);

    if (terminalRef.current) {
      term.open(terminalRef.current);
      fitAddon.fit();
    }
    socket.current = new WebSocket(
      `ws://localhost:3000/terminal?projectId=${projectIdFromURL}`,
    );
    socket.current.onopen = () => {
      const attachAddon = new AttachAddon(socket.current);
      term.loadAddon(attachAddon);
      // ✅ Now we can send - the connection is OPEN
      socket.current.send("getPort");
    };
    socket.current.onerror = (err) => {
      console.error("WebSocket error:", err);
    };
    const handleResize = () => fitAddon.fit();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      term.dispose();
    };
  }, []);

  return (
    <div
      ref={terminalRef}
      style={{ width: "100%", height: "100%", overflow: "hidden" }}
    ></div>
  );
};

export default BrowserTerminal;

// import { Terminal } from "@xterm/xterm";
// import { FitAddon } from "@xterm/addon-fit";
// import "@xterm/xterm/css/xterm.css";
// import { useEffect, useRef } from "react";
// import { useParams } from "react-router-dom";
// import useTreeStructureStore from "../../../store/treeStructureStore";

// const BrowserTerminal = () => {
//   const terminalRef = useRef(null);
//   const socketRef = useRef(null);
//   const { projectId: projectIdFromURL } = useParams();
//   const { setTreeStructure } = useTreeStructureStore();

//   useEffect(() => {
//     const term = new Terminal({
//       cursorBlink: true,
//       cursorStyle: "bar",
//       fontSize: 13,
//       fontFamily: "'Fira Code', 'Consolas', 'Courier New', monospace",
//       theme: {
//         background: "#1e1e1e",
//         foreground: "#d4d4d4",
//         cursor: "#aeafad",
//         cursorAccent: "#1e1e1e",
//         selectionBackground: "#264f78",
//         selectionForeground: "#ffffff",
//         black: "#1e1e1e",
//         red: "#f44747",
//         green: "#6a9955",
//         yellow: "#dcdcaa",
//         blue: "#569cd6",
//         magenta: "#c586c0",
//         cyan: "#4ec9b0",
//         white: "#d4d4d4",
//         brightBlack: "#808080",
//         brightRed: "#f44747",
//         brightGreen: "#6a9955",
//         brightYellow: "#dcdcaa",
//         brightBlue: "#569cd6",
//         brightMagenta: "#c586c0",
//         brightCyan: "#4ec9b0",
//         brightWhite: "#ffffff",
//       },
//       convertEol: true,
//     });

//     const fitAddon = new FitAddon();
//     term.loadAddon(fitAddon);

//     if (terminalRef.current) {
//       term.open(terminalRef.current);
//       fitAddon.fit();
//     }

//     // 🔌 Connect WebSocket
//     const protocol = window.location.protocol === "https:" ? "wss" : "ws";
//     socketRef.current = new WebSocket(
//       `ws://localhost:3000/terminal?projectId=${projectIdFromURL}`,
//     );

//     socketRef.current.onopen = () => {
//       console.log("🟢 Terminal socket connected");
//     };

//     socketRef.current.onmessage = (event) => {
//       try {
//         const message = JSON.parse(event.data);

//         if (message.type === "shell-opt") {
//           term.write(message.data);
//           setTreeStructure();
//         }
//       } catch (err) {
//         console.error("Invalid WS message:", err);
//       }
//     };

//     socketRef.current.onerror = (err) => {
//       console.error("WebSocket error:", err);
//     };

//     socketRef.current.onclose = () => {
//       console.log("🔴 Terminal socket closed");
//     };

//     // ⌨️ Send terminal keystrokes to backend
//     term.onData((data) => {
//       if (socketRef.current?.readyState === WebSocket.OPEN) {
//         socketRef.current.send(
//           JSON.stringify({
//             type: "shell-ipt",
//             data,
//           }),
//         );
//       }
//     });

//     // 📏 Handle resize
//     const handleResize = () => fitAddon.fit();
//     window.addEventListener("resize", handleResize);

//     return () => {
//       window.removeEventListener("resize", handleResize);
//       term.dispose();
//       socketRef.current?.close();
//     };
//   }, [projectIdFromURL, setTreeStructure]);

//   return (
//     <div
//       ref={terminalRef}
//       style={{ width: "100%", height: "100%", overflow: "hidden" }}
//     />
//   );
// };

// export default BrowserTerminal;
