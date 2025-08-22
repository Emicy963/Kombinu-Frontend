/**
 * Custom Error Classes
 * 
 * Define custom error types for better error handling and logging
 */

/**
 * ValidationError class for expected user input validation failures
 * These should be logged as warnings, not errors
 */
export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
    
    // Maintains proper stack trace for where our error was thrown (only available on V8)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, ValidationError);
    }
  }
}