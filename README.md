# Code Sandbox Clone

A powerful, browser-based development environment that lets you create and edit React projects instantly. This application mimics the look and feel of VS Code, giving you a full-featured code editor right in your browser.

## Features

- **Instant Project Creation**: Spin up React projects (JavaScript or TypeScript) with custom project names in seconds used Vite.
- **VS Code-like Interface**: familiar sidebar file explorer and tabbed editing experience.
- **Monaco Editor**: Built using the same editor engine as VS Code for syntax highlighting, intellisense, and a premium typing experience.
- **Real-time File Sync**: Uses **Socket.io** and **Chokidar** to watch for file changes on the server and sync them immediately to the frontend.
- **Terminal Access**: Integrated terminal support for running commands.

## Tech Stack

### Frontend

- **React**: For building the user interface.
- **Monaco Editor**: The code editor component.
- **Ant Design**: For polished UI components and layout.
- **Socket.io-client**: For real-time communication with the backend.

### Backend

- **Node.js & Express.js**: Handles API requests and project management.
- **Socket.io**: Enables bi-directional communication for file operations and terminal output.
- **Chokidar**: Robust file watching to detect and broadcast changes.
- **Vite**: Used under the hood to scaffold new projects rapidly.
