import crypto from "crypto";

/**
 * Enterprise Password Security Utilities
 * Uses Node.js native crypto module (scrypt + random salt + timingSafeEqual + HMAC tokens).
 */

const KEY_LENGTH = 64;

/**
 * Hash a plain text password with a cryptographic random salt
 */
export function hashPassword(password: string): string {
  if (!password || typeof password !== "string") {
    throw new Error("Password must be a non-empty string");
  }
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = crypto.scryptSync(password, salt, KEY_LENGTH);
  return `${salt}:${derivedKey.toString("hex")}`;
}

/**
 * Verify a plain text password against a salted scrypt hash.
 */
export function verifyPassword(password: string, storedHash: string): boolean {
  if (!password || !storedHash) {
    return false;
  }

  // Handle scrypt formatted hash: salt:hash
  if (storedHash.includes(":")) {
    const [salt, keyHex] = storedHash.split(":");
    if (!salt || !keyHex) return false;

    try {
      const keyBuffer = Buffer.from(keyHex, "hex");
      const derivedKey = crypto.scryptSync(password, salt, keyBuffer.length);
      return crypto.timingSafeEqual(keyBuffer, derivedKey);
    } catch {
      return false;
    }
  }

  return false;
}
