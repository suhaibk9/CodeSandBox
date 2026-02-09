// ============================================
// MAIN ROUTER MODULE
// ============================================
// This is the top-level router that organizes all API routes.
// It groups routes by version (v1, v2, etc.) for API versioning.
//
// Route Hierarchy:
// /api (this router)
//   └── /v1 (v1Router)
//       ├── /ping (health check)
//       └── /projects (project operations)
//
// API Versioning Strategy:
// - All routes are prefixed with version number (e.g., /api/v1/...)
// - When breaking changes are needed, create v2Router
// - Old clients can continue using v1 while new clients use v2

// ============================================
// IMPORT DEPENDENCIES
// ============================================
// Express framework for creating routers
import express from "express";

// Version 1 router containing all v1 endpoints
import v1Router from "./v1/index.js";

// ============================================
// CREATE ROUTER INSTANCE
// ============================================
// express.Router() creates a modular, mountable route handler
// This router will be mounted at /api in the main server (index.js)
const router = express.Router();

// ============================================
// MOUNT VERSION ROUTERS
// ============================================
// Mount the v1 router at /v1
// Combined with the /api prefix from index.js, full path is /api/v1/...
router.use("/v1", v1Router);

// ============================================
// EXPORT ROUTER
// ============================================
// Export as default for use in the main server file
export default router;
