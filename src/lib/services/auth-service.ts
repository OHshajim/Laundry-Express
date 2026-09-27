import type { User } from "@/types";

/**
 * Authentication Service
 * Production-ready authentication service managing:
 * - Credentials login and registration via /api/auth
 * - Google OAuth authentication flow
 * - Email OTP dispatch and verification for password changes and resets
 * - Zero static admin whitelists (dynamic roles from PostgreSQL database)
 * - Strict adherence to the 100-250 lines architectural rule
 */

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
  error?: string;
  token?: string;
}

export interface RegisterPayload {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
}

class AuthService {
  private readonly baseUrl = "/api/auth";

  /**
   * Log in with email and password
   */
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Invalid email or password.",
        };
      }

      return data;
    } catch {
      return {
        success: false,
        error: "Unable to connect to authentication server. Please check your network.",
      };
    }
  }

  /**
   * Register a new customer account
   */
  async register(payload: RegisterPayload): Promise<AuthResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Registration could not be completed.",
        };
      }

      return data;
    } catch {
      return {
        success: false,
        error: "Unable to submit registration. Please verify your connection.",
      };
    }
  }

  /**
   * Continue with Google OAuth
   */
  async loginWithGoogle(): Promise<AuthResponse> {
    try {
      const res = await fetch(`${this.baseUrl}/google`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        return {
          success: false,
          error: data.error || "Google authentication failed.",
        };
      }

      return data;
    } catch {
      return {
        success: false,
        error: "Google authentication service temporarily unreachable.",
      };
    }
  }

  /**
   * Request 6-digit email OTP for password change or reset
   */
  async sendOtp(
    email: string,
    purpose: "change_password" | "reset_password"
  ): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), purpose }),
      });

      const data = await res.json();
      return {
        success: !!data.success,
        message: data.message,
        error: data.error,
      };
    } catch {
      return {
        success: false,
        error: "Unable to dispatch verification code. Please check your connection.",
      };
    }
  }

  /**
   * Change password via verified email OTP
   */
  async changePasswordWithOtp(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/change-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim(), newPassword }),
      });

      const data = await res.json();
      return { success: !!data.success, error: data.error };
    } catch {
      return { success: false, error: "Password update failed. Please retry." };
    }
  }

  /**
   * Reset forgotten password via verified email OTP
   */
  async resetPasswordWithOtp(
    email: string,
    otp: string,
    newPassword: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const res = await fetch(`${this.baseUrl}/reset-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim().toLowerCase(), otp: otp.trim(), newPassword }),
      });

      const data = await res.json();
      return { success: !!data.success, error: data.error };
    } catch {
      return { success: false, error: "Password reset service temporarily unavailable." };
    }
  }
}

export const authService = new AuthService();
