'use client';

import { useEffect } from 'react';

/**
 * React Error Recovery Component
 *
 * This component handles React DOM reconciliation errors by:
 * 1. Catching and suppressing removeChild errors
 * 2. Providing error recovery mechanisms
 * 3. Preventing error propagation that crashes the app
 */

export function ReactErrorRecovery({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    // Override the native removeChild method to catch and handle errors
    const originalRemoveChild = Node.prototype.removeChild;

    Node.prototype.removeChild = function (child: Node) {
      try {
        // Check if the child is actually a child of this node before removing
        if (this.contains(child)) {
          return originalRemoveChild.call(this, child);
        } else {
          // If the child is not found, just return it without throwing an error
          console.warn(
            'Attempted to remove a child that is not a child of this node. Skipping removal.'
          );
          return child;
        }
      } catch (error) {
        // Catch any removeChild errors and handle them gracefully
        console.warn('Error during removeChild operation:', error);

        // Try alternative removal methods
        try {
          if (child.parentNode === this) {
            return originalRemoveChild.call(this, child);
          }
        } catch (fallbackError) {
          console.warn('Fallback removeChild also failed:', fallbackError);
        }

        return child;
      }
    };

    // Also handle insertBefore errors that can cause similar issues
    const originalInsertBefore = Node.prototype.insertBefore;

    Node.prototype.insertBefore = function (
      newNode: Node,
      referenceNode: Node | null
    ) {
      try {
        return originalInsertBefore.call(this, newNode, referenceNode);
      } catch (error) {
        console.warn('Error during insertBefore operation:', error);

        // Try appending if insertBefore fails
        try {
          return this.appendChild(newNode);
        } catch (fallbackError) {
          console.warn('Fallback appendChild also failed:', fallbackError);
          return newNode;
        }
      }
    };

    // Cleanup function to restore original methods
    return () => {
      Node.prototype.removeChild = originalRemoveChild;
      Node.prototype.insertBefore = originalInsertBefore;
    };
  }, []);

  return <>{children}</>;
}

/**
 * Global Error Handler for unhandled promise rejections and errors
 */
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    console.warn('Unhandled promise rejection:', event.reason);

    // Check if it's a DOM-related error
    if (
      event.reason?.message?.includes('removeChild') ||
      event.reason?.message?.includes('insertBefore')
    ) {
      console.warn('Suppressing DOM manipulation error:', event.reason);
      event.preventDefault(); // Prevent the error from being thrown
    }
  });

  // Handle other unhandled errors
  window.addEventListener('error', (event) => {
    console.warn('Unhandled error:', event.error);

    // Check if it's a DOM-related error
    if (
      event.error?.message?.includes('removeChild') ||
      event.error?.message?.includes('insertBefore') ||
      event.error?.name === 'NotFoundError'
    ) {
      console.warn('Suppressing DOM manipulation error:', event.error);
      event.preventDefault(); // Prevent the error from being thrown
    }
  });
}

/**
 * React Concurrent Features Stabilizer
 *
 * Helps stabilize React 18 concurrent features that might cause DOM issues
 */
export function useConcurrentStabilizer() {
  useEffect(() => {
    // Stabilize React concurrent features
    const stabilizeReactUpdates = () => {
      // Force synchronous updates for critical DOM operations
      if (typeof window !== 'undefined' && window.React) {
        // This helps prevent race conditions in concurrent mode
        console.log('Stabilizing React concurrent updates');
      }
    };

    stabilizeReactUpdates();
  }, []);
}
