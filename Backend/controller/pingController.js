// ============================================
// PING CONTROLLER MODULE
// ============================================
// This module provides a simple health check endpoint.
// Used to verify that the server is running and responsive.
//
// Endpoint: GET /api/v1/ping
// Response: { "msg": "Pong" }
//
// Use Cases:
// - Load balancer health checks
// - Docker/Kubernetes readiness probes
// - Frontend connection verification
// - Simple uptime monitoring

// ============================================
// PING HANDLER
// ============================================
/**
 * Simple health check endpoint handler.
 *
 * Returns a "Pong" response to verify the server is alive.
 * This is the simplest possible endpoint - no database calls,
 * no authentication, just an immediate response.
 *
 * @param {Request} req - Express request object (unused)
 * @param {Response} res - Express response object
 * @returns {Response} - JSON response with "Pong" message
 */
const pingController = async (req, res) => {
  // Return a simple JSON response indicating the server is alive
  // Status 200 = OK (success)
  return res.status(200).json({
    msg: "Pong", // Classic ping-pong response
  });
};

// ============================================
// EXPORT CONTROLLER
// ============================================
// Export as default for import in routes
export default pingController;
