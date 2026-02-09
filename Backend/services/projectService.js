// ============================================
// PROJECT SERVICE MODULE
// ============================================
// This module contains the business logic for project operations.
// Services handle the actual work - controllers just orchestrate.
//
// Responsibilities:
// - Creating new React projects using Vite
// - Generating unique project identifiers
// - Building file tree structures for the frontend
//
// Directory Structure:
// ./Projects/
//   └── {uuid}/           <- Each project gets a unique folder
//       └── {projectName}/ <- Vite creates the project here
//           ├── src/
//           ├── public/
//           ├── package.json
//           └── ...

// ============================================
// IMPORT DEPENDENCIES
// ============================================
// util module - Provides utility functions, including promisify
import util from "util";

// uuid - Generate unique identifiers for projects
// v4 generates random UUIDs (xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx)
import { v4 as uuidv4 } from "uuid";

// path - Node.js path utilities for file path manipulation
import path from "path";

// fs/promises - Promise-based file system operations
import fs from "fs/promises";

// execPromisified - Wrapper around child_process.exec for running shell commands
// Allows us to use async/await with shell commands
import { execPromisified } from "../utils/execUtility.js";

// directory-tree - Library to build a JSON tree structure from a directory
// Returns nested objects representing files and folders
import directoryTree from "directory-tree";

// ============================================
// CREATE PROJECT SERVICE
// ============================================
/**
 * Creates a new React project using Vite.
 *
 * This service:
 * 1. Generates a unique project ID (UUID)
 * 2. Creates a directory for the project
 * 3. Runs the Vite create command to scaffold the project
 * 4. Returns project metadata
 *
 * @param {string} language - "js" for JavaScript or "ts" for TypeScript
 * @param {string} projectName - The name for the Vite project
 * @returns {Object} - Project metadata including projectId, language, path, and name
 *
 * Example:
 *   const project = await createProjectService("ts", "my-app");
 *   // project.projectId = "a1b2c3d4-..."
 *   // Project created at ./Projects/a1b2c3d4-.../my-app/
 */
export const createProjectService = async (
  language = "js",
  projectName = "react-playground",
) => {
  // ============================================
  // SELECT VITE COMMAND BASED ON LANGUAGE
  // ============================================
  // The Vite commands are stored in environment variables (.env file)
  // REACT_PROJECT_COMMAND_TS = "npm create vite@latest"
  // REACT_PROJECT_COMMAND_JS = "npm create vite@latest"
  // We select based on whether the user wants TypeScript or JavaScript
  const command =
    language === "ts"
      ? process.env.REACT_PROJECT_COMMAND_TS
      : process.env.REACT_PROJECT_COMMAND_JS;

  // ============================================
  // GENERATE UNIQUE PROJECT ID
  // ============================================
  // UUID v4 generates a random 36-character unique identifier
  // Example: "550e8400-e29b-41d4-a716-446655440000"
  // This prevents project name collisions and allows unique URLs
  const unique_project_id = uuidv4();

  // ============================================
  // CREATE PROJECT DIRECTORY
  // ============================================
  // Projects are stored in ./Projects/{uuid}/
  // Each project gets its own isolated directory
  const projectPath = `./Projects/${unique_project_id}`;

  // Create the directory (recursive: true creates parent dirs if needed)
  await fs.mkdir(projectPath, { recursive: true });

  // ============================================
  // BUILD AND RUN VITE CREATE COMMAND
  // ============================================
  // Construct the full Vite command with project name and template
  // Template options:
  //   - react: JavaScript React template
  //   - react-ts: TypeScript React template
  // The "--" is needed to pass arguments through npm to vite
  const fullCommand = `${command} ${projectName} -- --template react${language === "ts" ? "-ts" : ""}`;

  // Execute the command in the project directory
  // cwd (current working directory) ensures Vite creates project in the right place
  await execPromisified(fullCommand, { cwd: projectPath });

  // ============================================
  // RETURN PROJECT METADATA
  // ============================================
  // Return information that the controller will send to the client
  return {
    projectId: unique_project_id, // Used to access the project later
    language, // "js" or "ts"
    projectPath, // Server-side path to the project
    projectName, // The Vite project name
  };
};

// ============================================
// GET PROJECT TREE SERVICE
// ============================================
/**
 * Builds a hierarchical file tree structure for a project.
 *
 * Uses the directory-tree library to scan the project folder
 * and return a JSON representation of all files and folders.
 *
 * @param {string} projectId - The unique project identifier (UUID)
 * @returns {Object} - Nested tree structure with name, path, type, children
 *
 * Return structure example:
 * {
 *   name: "a1b2c3d4-...",
 *   path: "/absolute/path/to/Projects/a1b2c3d4-...",
 *   type: "directory",
 *   children: [
 *     { name: "my-app", type: "directory", children: [...] },
 *     ...
 *   ]
 * }
 */
export const getProjectTreeService = async (projectId) => {
  // Resolve the absolute path to the project directory
  // path.resolve converts relative path to absolute
  // This ensures consistent paths regardless of where the server is started
  const projectPath = path.resolve("./Projects/" + projectId);

  // Use directory-tree to scan and build the tree structure
  // This recursively walks the directory and creates nested objects
  return directoryTree(projectPath);
};
