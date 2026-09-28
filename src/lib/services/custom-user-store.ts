import type { User, UserRole } from "@/types";
import { hashPassword, verifyPassword } from "@/lib/security/password";

/**
 * Custom User Store & Authentication Registry
 * In-memory fallback and identity registry for server processes.
 * Adheres to dynamic database roles (admin can be any email configured in database).
 * Strictly complies with the < 250 lines architectural rule.
 */

export interface StoredUser extends User {
  passwordHash: string;
}

// In-memory runtime identity registry (populated dynamically from DB & registration)
const USER_REGISTRY = new Map<string, StoredUser>();

export class CustomUserStore {
  /**
   * Find user by email address
   */
  static findByEmail(email: string): StoredUser | null {
    if (!email) return null;
    const normalized = email.trim().toLowerCase();
    return USER_REGISTRY.get(normalized) || null;
  }

  /**
   * Find user by unique ID
   */
  static findById(id: string): StoredUser | null {
    if (!id) return null;
    for (const user of USER_REGISTRY.values()) {
      if (user.id === id) return user;
    }
    return null;
  }

  /**
   * Dynamically assign or update a user's role
   */
  static setUserRole(email: string, role: UserRole): boolean {
    if (!email) return false;
    const existing = this.findByEmail(email);
    if (!existing) return false;
    existing.role = role;
    existing.updated_at = new Date().toISOString();
    return true;
  }

  /**
   * Create or register a new user in the custom store with hashed password
   */
  static createCustomer(params: {
    email: string;
    fullName: string;
    phone?: string;
    password?: string;
    role?: UserRole;
  }): StoredUser {
    const normalized = params.email.trim().toLowerCase();
    const existing = USER_REGISTRY.get(normalized);
    if (existing) {
      if (params.password) {
        existing.passwordHash = hashPassword(params.password);
      }
      if (params.role) {
        existing.role = params.role;
      }
      return existing;
    }

    const assignedRole = params.role || "customer";

    const newUser: StoredUser = {
      id: `u-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      email: normalized,
      passwordHash: hashPassword(params.password || "customer123"),
      full_name: params.fullName.trim() || "Valued Customer",
      phone: params.phone?.trim() || "815-575-9536",
      role: assignedRole,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    USER_REGISTRY.set(normalized, newUser);
    return newUser;
  }

  /**
   * Strictly verify email and password credentials
   */
  static verifyCredentials(email: string, password: string): User | null {
    if (!email || !password || password.length < 6) {
      return null;
    }

    const normalized = email.trim().toLowerCase();
    const existing = USER_REGISTRY.get(normalized);

    if (!existing) {
      return null;
    }

    const isValid = verifyPassword(password, existing.passwordHash);
    if (!isValid) {
      return null;
    }

    // Upgrade legacy plaintext hash to scrypt if needed
    if (!existing.passwordHash.includes(":")) {
      existing.passwordHash = hashPassword(password);
    }

    return {
      id: existing.id,
      email: existing.email,
      full_name: existing.full_name,
      phone: existing.phone,
      address: existing.address,
      role: existing.role,
      avatar_url: existing.avatar_url,
      is_active: existing.is_active,
      created_at: existing.created_at,
      updated_at: existing.updated_at,
    };
  }

  /**
   * Update user password directly by email
   */
  static updatePassword(email: string, newPassword: string): boolean {
    if (!email || !newPassword || newPassword.length < 6) {
      return false;
    }

    const normalized = email.trim().toLowerCase();
    const existing = USER_REGISTRY.get(normalized);
    if (!existing) {
      return false;
    }

    existing.passwordHash = hashPassword(newPassword);
    existing.updated_at = new Date().toISOString();
    return true;
  }

  /**
   * Change password requiring verification of current password
   */
  static verifyAndUpdatePassword(
    email: string,
    currentPassword: string,
    newPassword: string
  ): { success: boolean; error?: string } {
    if (!email || !currentPassword || !newPassword) {
      return { success: false, error: "Missing required password fields." };
    }
    if (newPassword.length < 6) {
      return { success: false, error: "New password must be at least 6 characters long." };
    }

    const normalized = email.trim().toLowerCase();
    const existing = USER_REGISTRY.get(normalized);
    if (!existing) {
      return { success: false, error: "User account not found." };
    }

    if (!verifyPassword(currentPassword, existing.passwordHash)) {
      return { success: false, error: "Current password does not match our records." };
    }

    existing.passwordHash = hashPassword(newPassword);
    existing.updated_at = new Date().toISOString();
    return { success: true };
  }

  /**
   * Provision or locate user from Google OAuth callback
   */
  static handleGoogleProfile(googleUser: {
    id?: string;
    email: string;
    name?: string;
    avatar_url?: string;
    role?: UserRole;
  }): User {
    const normalized = googleUser.email.trim().toLowerCase();
    const existing = USER_REGISTRY.get(normalized);
    if (existing) {
      if (googleUser.avatar_url && !existing.avatar_url) existing.avatar_url = googleUser.avatar_url;
      if (googleUser.role) existing.role = googleUser.role;
      return existing;
    }

    const assignedRole = googleUser.role || "customer";

    const newUser: StoredUser = {
      id: `u-google-${Date.now()}`,
      email: normalized,
      passwordHash: hashPassword(Math.random().toString(36)),
      full_name: googleUser.name || "Google Customer",
      avatar_url: googleUser.avatar_url,
      phone: "815-575-9536",
      role: assignedRole,
      is_active: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    USER_REGISTRY.set(normalized, newUser);
    return newUser;
  }

  /**
   * Retrieves all users currently registered in memory
   */
  static getAllUsers(): StoredUser[] {
    return Array.from(USER_REGISTRY.values());
  }
}
