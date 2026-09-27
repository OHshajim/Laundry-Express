import crypto from "crypto";

/**
 * Enterprise Password Security Utilities
 * Uses Node.js native crypto module (scrypt + random salt + timingSafeEqual + HMAC tokens).
 * Adheres strictly to the < 250 lines rule and zero unnecessary dependencies.
 */

const KEY_LENGTH = 64;
const TOKEN_SECRET = process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod";
const TOKEN_TTL_MS = 15 * 60 * 1000; // 15 minutes

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
 * Verify a plain text password against a stored hash
 * Supports legacy plain hashes gracefully for existing seeded accounts
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

  // Fallback for legacy seeded development credentials
  return password === storedHash;
}

/**
 * Generate a cryptographically signed, stateless password reset token
 */
export function createPasswordResetToken(email: string): string {
  const normalized = email.trim().toLowerCase();
  const expiresAt = Date.now() + TOKEN_TTL_MS;
  const payload = `${normalized}:${expiresAt}`;
  const signature = crypto
    .createHmac("sha256", TOKEN_SECRET)
    .update(payload)
    .digest("hex");
  return Buffer.from(`${payload}:${signature}`).toString("base64url");
}

/**
 * Verify a password reset token and extract the associated email
 */
export function verifyPasswordResetToken(token: string): { valid: boolean; email?: string } {
  if (!token) return { valid: false };

  try {
    const decoded = Buffer.from(token, "base64url").toString("utf8");
    const parts = decoded.split(":");
    if (parts.length !== 3) return { valid: false };

    const [email, expiresAtStr, signature] = parts;
    const expiresAt = parseInt(expiresAtStr, 10);

    if (Number.isNaN(expiresAt) || Date.now() > expiresAt) {
      return { valid: false }; // Token expired
    }

    const expectedSignature = crypto
      .createHmac("sha256", TOKEN_SECRET)
      .update(`${email}:${expiresAtStr}`)
      .digest("hex");

    const sigBuffer = Buffer.from(signature);
    const expectedBuffer = Buffer.from(expectedSignature);

    if (sigBuffer.length !== expectedBuffer.length) {
      return { valid: false };
    }

    const match = crypto.timingSafeEqual(sigBuffer, expectedBuffer);
    return match ? { valid: true, email } : { valid: false };
  } catch {
    return { valid: false };
  }
}
