// ============================================
// DOCKER CONTAINER CREATION MODULE
// ============================================
// This module handles creating isolated Docker containers for each user's project.
// Each container runs a sandboxed Linux environment with Node.js installed.
// The user's project files are mounted into the container for editing/running.

import Docker from "dockerode"; // Docker API client for Node.js
import WebSocket, { WebSocketServer } from "ws"; // WebSocket for terminal communication

// ============================================
// CONFIGURATION
// ============================================
// Docker image name - should match what you built with: docker build -t sandbox .
// Falls back to "sandbox" if not specified in environment
const SANDBOX_IMAGE = process.env.SANDBOX_IMAGE || "sandbox";

// Create Docker client instance
// Automatically connects to Docker daemon via Unix socket (/var/run/docker.sock)
const docker = new Docker();

// ============================================
// CONTAINER CREATION FUNCTION
// ============================================
/**
 * Creates a Docker container for the given project and sets up WebSocket connection.
 *
 * @param {string} projectId - Unique identifier for the project (UUID)
 * @param {WebSocketServer} wss - WebSocket server instance to handle upgrade
 * @param {IncomingMessage} req - HTTP request object from upgrade event
 * @param {Socket} tcpSocket - Raw TCP socket to upgrade to WebSocket
 * @param {Buffer} head - First packet of upgraded stream
 */
export const handleContainerCreate = async (
  projectId,
  wss,
  req,
  tcpSocket,
  head,
) => {
  try {
    // ============================================
    // CREATE DOCKER CONTAINER
    // ============================================
    const container = await docker.createContainer({
      // The Docker image to use (built from Dockerfile)
      Image: SANDBOX_IMAGE,

      // ============================================
      // TTY AND STDIN CONFIGURATION
      // ============================================
      // Tty: Allocate a pseudo-TTY (terminal)
      // This makes the container behave like an interactive terminal
      // Without this, you can't use programs that expect terminal input
      Tty: true,

      // OpenStdin: Keep STDIN open even if not attached
      // Required for sending input to the container
      OpenStdin: true,

      // AttachStdin/Stdout/Stderr: Connect container's I/O to our streams
      // This allows us to send commands and receive output
      AttachStdin: true,
      AttachStdout: true,
      AttachStderr: true,

      // ============================================
      // COMMAND TO RUN
      // ============================================
      // Start bash shell when container starts
      // User will interact with this shell via the terminal
      Cmd: ["/bin/bash"],

      // ============================================
      // WORKING DIRECTORY
      // ============================================
      // Set the initial directory when bash starts
      // This is where the project files will be located
      WorkingDir: `/home/sandbox/project`,

      // ============================================
      // ENVIRONMENT VARIABLES
      // ============================================
      // HOST=0.0.0.0 allows Vite dev server to be accessible from outside container
      // By default, Vite only listens on localhost which isn't accessible from host
      Env: ["HOST=0.0.0.0"],

      // ============================================
      // EXPOSED PORTS
      // ============================================
      // Declare that this container uses port 5173 (Vite's default port)
      // This is metadata only - actual port mapping is in HostConfig
      ExposedPorts: {
        "5173/tcp": {},
      },

      // ============================================
      // HOST CONFIGURATION
      // ============================================
      HostConfig: {
        // ============================================
        // VOLUME BINDS (Mount project files)
        // ============================================
        // Mount the project folder from host into container
        // Format: "host_path:container_path"
        // This allows the container to access and modify project files
        // Changes made in container are reflected on host and vice versa
        Binds: [`${process.cwd()}/Projects/${projectId}:/home/sandbox/project`],

        // ============================================
        // PORT BINDINGS
        // ============================================
        // Map container's port 5173 to a random available port on host
        // HostPort: "0" means Docker assigns a random available port
        // This prevents port conflicts when multiple containers run
        PortBindings: {
          "5173/tcp": [{ HostPort: "0" }],
        },
      },
    });

    // ============================================
    // START THE CONTAINER
    // ============================================
    // Container is created but not running yet
    // start() boots it up and runs the Cmd (/bin/bash)
    await container.start();
    console.log(`Container sandbox-${projectId} started`);

    // ============================================
    // UPGRADE HTTP TO WEBSOCKET
    // ============================================
    // handleUpgrade: Completes the HTTP -> WebSocket protocol upgrade
    // This transforms the TCP connection into a WebSocket connection
    // The callback receives the established WebSocket (ws)
    wss.handleUpgrade(req, tcpSocket, head, (ws) => {
      console.log("Emitting");

      // Emit "connection" event on the WebSocketServer
      // This triggers the WebSocketTerminal.on("connection", ...) handler in index.js
      // We pass the WebSocket, request, and container so the handler can use them
      wss.emit("connection", ws, req, container);
    });

    // ============================================
    // EXECUTE BASH IN CONTAINER (Legacy code - not used)
    // ============================================
    // This block creates an exec instance but doesn't connect it to anything
    // The actual terminal handling is done in handleTerminalConnection
    // TODO: This code can be removed as it's redundant
    try {
      container.exec(
        {
          AttachStdin: true,
          AttachStdout: true,
          AttachStderr: true,
          Cmd: ["/bin/bash"],
          User: "sandbox", // Run as non-root user for security
          Tty: true,
        },
        (err, exec) => {
          exec.start({ hijack: true }, (err, stream) => {
            if (err) {
              console.log("exec didnt start", err);
              return;
            }
          });
        },
      );
    } catch (err) {
      console.log("err while exec: ", err);
    }
  } catch (error) {
    // Log error and re-throw for upstream handling
    console.error("Error creating container:", error);
    throw error;
  }
};
