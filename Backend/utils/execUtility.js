// ============================================
// EXEC UTILITY MODULE
// ============================================
// This module provides a promisified version of child_process.exec
// for running shell commands with async/await syntax.
//
// Why Promisify exec?
// - child_process.exec uses callbacks by default
// - Callbacks lead to nested, hard-to-read code
// - Promisified version allows clean async/await usage
//
// Usage Example:
// const { stdout, stderr } = await execPromisified("ls -la");
// console.log(stdout);

// ============================================
// IMPORT DEPENDENCIES
// ============================================
// child_process - Node.js module for spawning child processes
// exec() runs a shell command and buffers the output
import child_process from "child_process";

// util - Node.js utility module
// promisify() converts callback-based functions to Promise-based
import util from "util";

// ============================================
// PROMISIFIED EXEC FUNCTION
// ============================================
/**
 * Promisified version of child_process.exec.
 *
 * Runs a shell command and returns a Promise that resolves with
 * the stdout and stderr output, or rejects on error.
 *
 * @param {string} command - The shell command to execute
 * @param {Object} options - Options object (cwd, env, timeout, etc.)
 * @returns {Promise<{stdout: string, stderr: string}>} - Command output
 *
 * Options (commonly used):
 * - cwd: Current working directory for the command
 * - env: Environment variables
 * - timeout: Max time in ms before killing
 * - maxBuffer: Max stdout/stderr buffer size (default 1MB)
 *
 * Example:
 *   const { stdout } = await execPromisified("npm --version");
 *   console.log(stdout); // "10.2.0\n"
 *
 * Example with options:
 *   await execPromisified("npm install", { cwd: "/path/to/project" });
 */
export const execPromisified = util.promisify(child_process.exec);
