// Type definitions for bcryptjs 2.x
// Project: https://github.com/dcodeIO/bcrypt.js
// Definitions by: Custom

/**
 * bcryptjs v2 type definitions
 * This explicitly declares the bcryptjs module for TypeScript version 2.x compatibility
 */

declare module 'bcryptjs' {
  /**
   * Generate a salt synchronously
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   * @returns Resulting salt
   */
  export function genSaltSync(rounds?: number): string;

  /**
   * Generate a salt asynchronously
   * @param rounds Number of rounds to use, defaults to 10 if omitted
   * @param callback Callback receiving the error, if any, and the resulting salt
   */
  export function genSalt(
    rounds?: number,
    callback?: (err: Error | null, salt: string) => void
  ): Promise<string>;

  /**
   * Hash a string synchronously
   * @param s String to hash
   * @param salt Salt length to generate or salt to use
   * @returns Resulting hash
   */
  export function hashSync(s: string, salt: string | number): string;

  /**
   * Hash a string asynchronously
   * @param s String to hash
   * @param salt Salt length to generate or salt to use
   * @param callback Callback receiving the error, if any, and the resulting hash
   * @returns Promise if callback has been omitted
   */
  export function hash(
    s: string,
    salt: string | number,
    callback?: (err: Error | null, hash: string) => void
  ): Promise<string>;

  /**
   * Compare a string to a hash synchronously
   * @param s String to compare
   * @param hash Hash to compare to
   * @returns true if matching, otherwise false
   */
  export function compareSync(s: string, hash: string): boolean;

  /**
   * Compare a string to a hash asynchronously
   * @param s String to compare
   * @param hash Hash to compare to
   * @param callback Callback receiving the error, if any, and the result
   * @returns Promise if callback has been omitted
   */
  export function compare(
    s: string,
    hash: string,
    callback?: (err: Error | null, result: boolean) => void
  ): Promise<boolean>;

  /**
   * Gets the number of rounds used to encrypt a hash
   * @param hash Hash to extract the number of rounds from
   * @returns Number of rounds used to encrypt the specified hash
   */
  export function getRounds(hash: string): number;

  /**
   * Gets the salt portion from a hash
   * @param hash Hash to extract the salt from
   * @returns Salt portion of the specified hash
   */
  export function getSalt(hash: string): string;
}
