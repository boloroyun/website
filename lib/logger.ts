/**
 * Silent logger utility - completely disables all console output
 *
 * Usage:
 * import { dlog } from '@/lib/logger';
 *
 * dlog('Debug message', someVariable); // Does nothing in production, only shows in dev with DEBUG_LOGS=1
 */

// Determine if debug logs are enabled - default to false
export const DEBUG = process.env.DEBUG_LOGS === '1';

// Completely silent version when debug is disabled
export function dlog(...args: any[]) {
  // Do nothing unless DEBUG is enabled
  if (DEBUG) console.log(...args);
}

// Standard logging functions with reduced verbosity
export function log(...args: any[]) {
  // Only log in development or if debug is enabled
  if (process.env.NODE_ENV === 'development' && DEBUG) {
    console.log(...args);
  }
}

export function warn(...args: any[]) {
  // Only show warnings in development
  if (process.env.NODE_ENV === 'development') {
    console.warn(...args);
  }
}

export function error(...args: any[]) {
  // Always show errors, but no stack traces in production
  if (process.env.NODE_ENV === 'development') {
    console.error(...args);
  } else {
    // In production, only log the error message, not the full stack trace
    const simplified = args.map((arg) =>
      arg instanceof Error ? arg.message : arg
    );
    console.error(...simplified);
  }
}

// Instead of monkey-patching console, we'll create safe versions
// that minimize logging but don't break functionality

// Original console methods are preserved
// We just provide wrapper functions that filter logs
export const safeLog = (...args: any[]) => {
  if (DEBUG || process.env.NODE_ENV === 'production') {
    console.log(...args);
  }
};

export const safeInfo = (...args: any[]) => {
  if (DEBUG || process.env.NODE_ENV === 'production') {
    console.info(...args);
  }
};

export const safeDebug = (...args: any[]) => {
  if (DEBUG) {
    console.debug(...args);
  }
};
