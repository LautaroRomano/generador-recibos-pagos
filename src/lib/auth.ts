import * as crypto from 'crypto';

/**
 * Hashes a password using SHA-256 and a random salt
 * Note: In a production environment, consider using bcrypt or Argon2
 * @param password The plain text password to hash
 * @returns The hashed password string
 */
export function hashPassword(password: string): string {
  // Create a random salt
  const salt = crypto.randomBytes(16).toString('hex');
  
  // Hash the password with the salt
  const hash = crypto.pbkdf2Sync(
    password,
    salt,
    1000, // iterations
    64,   // key length
    'sha256'
  ).toString('hex');
  
  // Return the salt and hash combined
  return `${salt}:${hash}`;
}

/**
 * Verifies a password against a hash
 * @param password The plain text password to verify
 * @param hashedPassword The hashed password to compare against
 * @returns True if the password matches, false otherwise
 */
export function verifyPassword(password: string, hashedPassword: string): boolean {
  const [salt, hash] = hashedPassword.split(':');
  
  const verifyHash = crypto.pbkdf2Sync(
    password,
    salt,
    1000, // iterations
    64,   // key length
    'sha256'
  ).toString('hex');
  
  return hash === verifyHash;
}