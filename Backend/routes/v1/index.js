// ============================================
// VERSION 1 API ROUTER MODULE
// ============================================
// This router defines all version 1 API endpoints.
// It groups related routes into sub-routers for organization.
//
// Available Endpoints:
// GET  /api/v1/ping                    - Health check endpoint
// POST /api/v1/projects                - Create new project
// GET  /api/v1/projects/:projectId/tree - Get project file tree

// ============================================
// IMPORT DEPENDENCIES
// ============================================
// Express framework for creating routers
import express from "express";

// Ping controller for health check endpoint
import pingController from "../../controller/pingController.js";

// Projects router containing project-related endpoints
import projectRouter from "./projects.js";

// ============================================
// CREATE ROUTER INSTANCE
// ============================================
// This router handles all /api/v1/* routes
const router = express.Router();

// ============================================
// HEALTH CHECK ENDPOINT
// ============================================
// GET /api/v1/ping
// Purpose: Simple health check to verify the server is running
// Returns: Usually "pong" or server status
router.get("/ping", pingController);

// ============================================
// PROJECT ROUTES
// ============================================
// Mount the projects router at /projects
// This handles:
// - POST /api/v1/projects - Create new project
// - GET /api/v1/projects/:projectId/tree - Get file tree
router.use("/projects", projectRouter);

// ============================================
// EXPORT ROUTER
// ============================================
export default router;
