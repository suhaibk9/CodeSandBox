// ============================================
// PROJECTS ROUTER MODULE
// ============================================
// This router defines all project-related REST API endpoints.
// Projects are React applications created via Vite.
//
// Available Endpoints:
// POST / - Create a new React project (JS or TS template)
// GET /:projectId/tree - Get the file tree structure of a project
//
// Full Paths (with mounting):
// POST /api/v1/projects
// GET  /api/v1/projects/:projectId/tree

// ============================================
// IMPORT DEPENDENCIES
// ============================================
// Express framework for creating routers
import express from "express";

// Import controller functions that handle the request/response logic
import {
  projectController, // Handles project creation
  getProjectTree, // Handles fetching project file tree
} from "../../controller/projectController.js";

// ============================================
// CREATE ROUTER INSTANCE
// ============================================
// This router handles all /api/v1/projects/* routes
const router = express.Router();

// ============================================
// CREATE PROJECT ENDPOINT
// ============================================
// POST /api/v1/projects
// Purpose: Create a new React project using Vite
//
// Request Body:
// {
//   "language": "js" | "ts",     // Template language (default: "js")
//   "projectName": "my-app"      // Project name (default: "react-playground")
// }
//
// Response (200):
// {
//   "msg": "New React JS Project Created",
//   "projectId": "uuid-here",
//   "language": "js",
//   "projectName": "my-app"
// }
router.post("/", projectController);

// ============================================
// GET PROJECT TREE ENDPOINT
// ============================================
// GET /api/v1/projects/:projectId/tree
// Purpose: Get the hierarchical file structure of a project
//
// URL Parameters:
// - projectId: The unique UUID of the project
//
// Response (200):
// {
//   "data": { /* directory-tree structure */ },
//   "success": true,
//   "msg": "Fetched Tree"
// }
router.get("/:projectId/tree", getProjectTree);

// ============================================
// EXPORT ROUTER
// ============================================
export default router;
