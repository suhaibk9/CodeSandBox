// ============================================
// TERMINAL CONNECTION HANDLER MODULE
// ============================================
// This module handles bidirectional communication between:
// - Frontend xterm.js terminal (via WebSocket)
// - Docker container's bash shell (via exec stream)
//
// Data Flow:
// User types in browser terminal
//   -> WebSocket message to server
//   -> Write to Docker exec stream
//   -> Container processes command
//   -> Output from container
//   -> Read from Docker exec stream
//   -> WebSocket message to browser
//   -> xterm.js displays output

// ============================================
// MAIN TERMINAL CONNECTION HANDLER
// ============================================
/**
 * Sets up bidirectional communication between WebSocket and Docker container.
 *
 * @param {Container} container - Dockerode container instance
 * @param {WebSocket} ws - WebSocket connection to frontend terminal
 */
export const handleTerminalConnection = (container, ws) => {
  // ============================================
  // CREATE EXEC INSTANCE IN CONTAINER
  // ============================================
  // exec() creates a new process inside the running container
  // We're starting a bash shell that the user can interact with
  container.exec(
    {
      // ============================================
      // EXEC CONFIGURATION
      // ============================================
      // Tty: Allocate pseudo-terminal for proper terminal behavior
      // (line editing, colors, cursor movement, etc.)
      Tty: true,

      // OpenStdin: Allow sending input to the exec process
      OpenStdin: true,

      // Attach streams to capture I/O from the exec process
      AttachStdin: true, // We can write to the process
      AttachStdout: true, // We can read stdout
      AttachStderr: true, // We can read stderr

      // Command to execute - start an interactive bash shell
      Cmd: ["/bin/bash"],

      // Run as the sandbox user (not root) for security
      // The sandbox user was created in the Dockerfile
      user: "sandbox",
    },
    (err, exec) => {
      // ============================================
      // HANDLE EXEC CREATION ERROR
      // ============================================
      if (err) {
        console.error("error in exec", err);
        return;
      }

      // ============================================
      // START THE EXEC PROCESS
      // ============================================
      // exec.start() actually runs the command and returns a stream
      // hijack: true gives us raw access to the stream (not multiplexed)
      exec.start({ hijack: true }, (err, stream) => {
        if (err) {
          console.log("error in exec start: ", err);
          return;
        }

        // ============================================
        // CONTAINER OUTPUT -> WEBSOCKET -> FRONTEND
        // ============================================
        // When Docker container produces output, process it and send to browser

        processStreamOutput(stream, ws);

        // ============================================
        // FRONTEND -> WEBSOCKET -> CONTAINER INPUT
        // ============================================
        // When user types in the browser terminal, send keystrokes to container
        // ws.on("message") fires when WebSocket receives data from frontend
        // stream.write() sends that data to the container's stdin
        ws.on("message", (data) => {
          stream.write(data);
        });
      });
    },
  );
};

// ============================================
// DOCKER MULTIPLEXED STREAM FORMAT DOCUMENTATION
// ============================================
/**
 * When Tty is FALSE, Docker sends stdout/stderr in a multiplexed format.
 * Each message has an 8-byte header followed by the payload:
 *
 * Header format (8 bytes):
 *   - Byte 0: Stream type
 *       - 0: stdin (not used in output)
 *       - 1: stdout
 *       - 2: stderr
 *   - Bytes 1-3: Reserved (zeros)
 *   - Bytes 4-7: Payload length (big-endian 32-bit unsigned integer)
 *
 * Example: Receiving "Hello\n" (6 bytes) on stdout:
 *   [0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x06, H, e, l, l, o, \n]
 *    ^-- type=stdout          ^-- length=6         ^-- payload
 *
 * NOTE: When Tty is TRUE (which we use), output is NOT multiplexed.
 * It's sent as raw bytes without headers. This function handles both cases.
 */

// ============================================
// PROCESS STREAM OUTPUT FUNCTION
// ============================================
/**
 * Processes Docker exec stream output and sends it to WebSocket.
 *
 * This function handles Docker's multiplexed stream format:
 * - Reads 8-byte headers to determine message type and length
 * - Extracts payloads based on the length from header
 * - Sends extracted text to the frontend via WebSocket
 *
 * @param {Duplex} stream - Docker exec stream (stdin/stdout/stderr combined)
 * @param {WebSocket} ws - WebSocket connection to send output to
 */
const processStreamOutput = (stream, ws) => {
  // ============================================
  // STATE VARIABLES
  // ============================================
  // Track the type of the next message (1=stdout, 2=stderr)
  // null means we haven't read the header yet
  let nextDataType = null;

  // Track the expected length of the next message payload
  // This is read from bytes 4-7 of the header
  let nextDataLength = null;

  // Accumulator buffer to hold incomplete data between chunks
  // Stream data may arrive in arbitrary chunks, not aligned to message boundaries
  // This buffer accumulates data until we have complete headers/payloads
  let buffer = Buffer.from("");

  // ============================================
  // PROCESS STREAM DATA FUNCTION
  // ============================================
  /**
   * Process incoming stream data chunk by chunk.
   * Handles the Docker multiplexed protocol by parsing headers
   * and extracting payloads, then sending them to the WebSocket.
   *
   * This function is recursive - it keeps processing until the buffer
   * doesn't have enough data for the next header or payload.
   *
   * @param {Buffer} data - New chunk of data from the stream (optional)
   */
  function processStreamData(data) {
    // ============================================
    // APPEND NEW DATA TO BUFFER
    // ============================================
    // If we received new data, append it to our accumulator buffer
    // When called recursively (without data), we just process existing buffer
    if (data) {
      buffer = Buffer.concat([buffer, data]);
    }

    // ============================================
    // STATE MACHINE: READING HEADER
    // ============================================
    // If we don't know the next message type, we need to read the header
    if (!nextDataType) {
      // We need at least 8 bytes to read a complete header
      if (buffer.length >= 8) {
        // Extract the 8-byte header from the beginning of buffer
        const header = bufferSlicer(8);

        // ============================================
        // PARSE HEADER
        // ============================================
        // Byte 0: Stream type (1=stdout, 2=stderr)
        nextDataType = header.readUInt8(0);

        // Bytes 4-7: Payload length as big-endian 32-bit unsigned integer
        nextDataLength = header.readUInt32BE(4);

        // Recursively process in case we have more data in the buffer
        // This handles the case where multiple messages arrived in one chunk
        processStreamData();
      }
      // If buffer has less than 8 bytes, wait for more data
    }
    // ============================================
    // STATE MACHINE: READING PAYLOAD
    // ============================================
    else {
      // We know the message type and length, now extract the payload
      if (buffer.length >= nextDataLength) {
        // Extract the payload of the specified length
        const content = bufferSlicer(nextDataLength);

        // ============================================
        // SEND TO FRONTEND
        // ============================================
        // Convert buffer to string and send via WebSocket
        // The frontend's xterm.js will display this text
        ws.send(content.toString());

        // ============================================
        // RESET STATE FOR NEXT MESSAGE
        // ============================================
        nextDataType = null;
        nextDataLength = null;

        // Recursively process remaining data in the buffer
        // There might be more complete messages waiting
        processStreamData();
      }
      // If buffer doesn't have enough data for the payload, wait for more
    }
  }

  // ============================================
  // BUFFER SLICER HELPER FUNCTION
  // ============================================
  /**
   * Slice `end` bytes from the beginning of the buffer.
   * Returns the sliced portion and removes it from the buffer.
   *
   * Example:
   *   buffer = [A, B, C, D, E]
   *   bufferSlicer(2) returns [A, B]
   *   buffer is now [C, D, E]
   *
   * @param {number} end - Number of bytes to slice from the start
   * @returns {Buffer} - The sliced bytes
   */
  function bufferSlicer(end) {
    // Extract bytes from index 0 to `end` (exclusive)
    const output = buffer.slice(0, end);

    // Remove the extracted bytes from the buffer
    // slice(end) gets everything from `end` to the end of buffer
    // Buffer.from() creates a new buffer (slice returns a view, not a copy)
    buffer = Buffer.from(buffer.slice(end));

    return output;
  }

  // ============================================
  // REGISTER STREAM DATA LISTENER
  // ============================================
  // Listen for "data" events on the Docker stream
  // Each event contains a chunk of output from the container
  // processStreamData will parse and forward it to the WebSocket
  stream.on("data", processStreamData);
};
