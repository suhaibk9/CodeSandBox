// ============================================
// PROJECT CONTROLLER MODULE
// ============================================
// This module contains Express route handlers (controllers) for project-related
// REST API endpoints. Controllers are responsible for:
// 1. Extracting data from HTTP requests (req.body, req.params, etc.)
// 2. Calling the appropriate service functions to perform business logic
// 3. Formatting and sending HTTP responses back to the client
//
// Available Endpoints:
// - POST /api/v1/projects - Create a new project
// - GET /api/v1/projects/:projectId/tree - Get project file tree

// ============================================
// IMPORT DEPENDENCIES
// ============================================
// Import service functions that contain the actual business logic
// Controllers should be thin - they delegate to services
import {
  createProjectService,
  getProjectTreeService,
} from "../services/projectService.js";

// ============================================
// CREATE PROJECT CONTROLLER
// ============================================
/**
 * HTTP POST handler for creating a new project.
 *
 * This controller:
 * 1. Extracts language and project name from request body
 * 2. Calls the service to create the project (runs Vite create command)
 * 3. Returns the project details including the generated projectId
 *
 * Request Body:
 * @param {string} language - "js" or "ts" for JavaScript or TypeScript template
 * @param {string} projectName - Name for the Vite project
 *
 * Response (200 OK):
 * @returns {Object} - Project creation confirmation with projectId
 *
 * Response (500 Error):
 * @returns {Object} - Error message if project creation fails
 */
export const projectController = async (req, res) => {
  try {
    // Extract language and projectName from request body
    // Default to "js" (JavaScript) and "react-playground" if not provided
    const { language = "js", projectName = "react-playground" } = req.body;

    // Call the service function to create the project
    // This runs the Vite create command and generates a unique project ID
    const result = await createProjectService(language, projectName);

    // Return success response with project details
    // The projectId is used by the frontend to connect to the editor/terminal
    return res.status(200).json({
      msg: `New React ${language.toUpperCase()} Project Created`,
      projectId: result.projectId, // Unique UUID for the project
      language: result.language, // "js" or "ts"
      projectName: result.projectName, // The project name
    });
  } catch (error) {
    // Log the error server-side for debugging
    console.error("Error creating project:", error);

    // Return generic error response (don't expose internal details to client)
    return res.status(500).json({ msg: "Error creating project" });
  }
};

// ============================================
// GET PROJECT TREE CONTROLLER
// ============================================
/**
 * HTTP GET handler for retrieving a project's file tree structure.
 *
 * This controller:
 * 1. Extracts projectId from URL parameters
 * 2. Calls the service to scan the project directory
 * 3. Returns the hierarchical file tree structure
 *
 * URL Parameters:
 * @param {string} projectId - The unique project identifier (UUID)
 *
 * Response (200 OK):
 * @returns {Object} - File tree structure with success flag
 *
 * Response (500 Error):
 * @returns {Object} - Error message if tree fetch fails
 */
export const getProjectTree = async (req, res) => {
  try {
    // Call the service to get the directory tree structure
    // req.params.projectId comes from the URL: /projects/:projectId/tree
    const tree = await getProjectTreeService(req.params.projectId);

    // Return success response with the file tree data
    return res.status(200).json({
      data: tree, // Hierarchical tree structure from directory-tree package
      success: true, // Flag for frontend to check
      msg: "Fetched Tree", // Human-readable message
    });
  } catch (error) {
    // Log the error server-side for debugging
    console.error("Error fetching project tree:", error);

    // Return generic error response
    return res.status(500).json({ msg: "Error fetching project tree" });
  }
};
