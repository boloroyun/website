/**
 * Constant-time string comparison to prevent timing attacks
 *
 * This function compares two strings in constant time, regardless of where
 * the first difference occurs. This is important for comparing secrets like
 * webhook tokens, API keys, or passwords to prevent timing-based attacks.
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns true if strings are equal, false otherwise
 */
export function secureEquals(a: string, b: string): boolean {
  // If lengths differ, still perform comparison to maintain constant time
  const aLength = a.length;
  const bLength = b.length;

  // Use the longer length for comparison to avoid early termination
  const maxLength = Math.max(aLength, bLength);

  let result = aLength === bLength ? 0 : 1;

  // Compare each character position
  for (let i = 0; i < maxLength; i++) {
    const aChar = i < aLength ? a.charCodeAt(i) : 0;
    const bChar = i < bLength ? b.charCodeAt(i) : 0;

    // XOR the characters and OR with result
    // This ensures we always perform the same number of operations
    result |= aChar ^ bChar;
  }

  // Return true only if result is 0 (all characters matched and lengths equal)
  return result === 0;
}

/**
 * Alternative implementation using Node.js crypto.timingSafeEqual
 * This is more secure but requires both strings to be the same length
 *
 * @param a - First string to compare
 * @param b - Second string to compare
 * @returns true if strings are equal, false otherwise
 */
export function cryptoSecureEquals(a: string, b: string): boolean {
  try {
    // Only available in Node.js environment
    if (typeof require !== 'undefined') {
      const crypto = require('crypto');

      // timingSafeEqual requires buffers of equal length
      if (a.length !== b.length) {
        return false;
      }

      const bufferA = Buffer.from(a, 'utf8');
      const bufferB = Buffer.from(b, 'utf8');

      return crypto.timingSafeEqual(bufferA, bufferB);
    }
  } catch (error) {
    console.warn(
      'crypto.timingSafeEqual not available, falling back to custom implementation'
    );
  }

  // Fallback to custom implementation
  return secureEquals(a, b);
}

// Export the crypto version as default for better security when available
export default cryptoSecureEquals;
