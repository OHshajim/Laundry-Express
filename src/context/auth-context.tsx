"use client";

import * as React from "react";
import {
  SessionProvider,
  useSession,
  signIn,
  signOut,
} from "next-auth/react";
import type { User } from "@/types";
import { authService, type RegisterPayload } from "@/lib/services/auth-service";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  resetPassword: (token: string, newPass: string) => Promise<{ success: boolean; message?: string; error?: string }>;
  updateAvatar: (avatarUrl: string) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

const LOCAL_STORAGE_USER_KEY = "lx_auth_session_user";

/**
 * Internal Auth Consumer synchronizing NextAuth session state
 */
function AuthStateBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [localUser, setLocalUser] = React.useState<User | null>(null);

  // Sync session from NextAuth into local user state
  React.useEffect(() => {
    if (session?.user) {
      const activeUser: User = {
        id: session.user.id || `u-${Date.now()}`,
        email: session.user.email || "",
        full_name: session.user.name || "Customer",
        avatar_url: session.user.image || undefined,
        phone: (session.user as any).phone || "815-575-9536",
        role: ((session.user as any).role as "admin" | "customer") || "customer",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalUser(activeUser);
      try {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(activeUser));
      } catch {
        // Fallback for private mode
      }
    } else if (status === "unauthenticated") {
      try {
        const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
        if (stored) {
          setLocalUser(JSON.parse(stored));
        } else {
          setLocalUser(null);
        }
      } catch {
        setLocalUser(null);
      }
    }
  }, [session, status]);

  const login = async (
    email: string,
    password: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res || res.error) {
        return { success: false, error: res?.error || "Invalid email or password." };
      }

      const isAdmin = email.trim().toLowerCase().includes("admin");
      const immediateUser: User = {
        id: `u-${Date.now()}`,
        email: email.trim().toLowerCase(),
        full_name: isAdmin ? "Operations Admin" : "Verified Customer",
        phone: "815-575-9536",
        role: isAdmin ? "admin" : "customer",
        is_active: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      setLocalUser(immediateUser);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(immediateUser));

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Authentication failed." };
    }
  };

  const loginWithGoogle = async (): Promise<{ success: boolean; error?: string }> => {
    try {
      await signIn("google", { callbackUrl: "/dashboard" });
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Google sign-in failed." };
    }
  };

  const register = async (
    data: RegisterPayload
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const res = await authService.register(data);
      if (!res.success) {
        return { success: false, error: res.error || "Registration failed." };
      }

      await signIn("credentials", {
        redirect: false,
        email: data.email.trim().toLowerCase(),
        password: data.password,
      });

      if (res.user) {
        setLocalUser(res.user);
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(res.user));
      }

      return { success: true };
    } catch (err: any) {
      return { success: false, error: err?.message || "Account registration failed." };
    }
  };

  const forgotPassword = async (
    email: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    return authService.forgotPassword(email);
  };

  const resetPassword = async (
    token: string,
    newPass: string
  ): Promise<{ success: boolean; message?: string; error?: string }> => {
    return authService.resetPassword(token, newPass);
  };

  const updateAvatar = (avatarUrl: string) => {
    setLocalUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, avatar_url: avatarUrl };
      try {
        localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated));
      } catch {
        // Storage fallback
      }
      return updated;
    });
  };

  const logout = () => {
    setLocalUser(null);
    try {
      localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
    } catch {
      // Storage access fallback
    }
    signOut({ callbackUrl: "/login" });
  };

  const activeUser = localUser || null;

  const value: AuthContextType = {
    user: activeUser,
    isAuthenticated: !!activeUser,
    isAdmin: activeUser?.role === "admin",
    isCustomer: activeUser?.role === "customer",
    isLoading: status === "loading",
    login,
    loginWithGoogle,
    register,
    forgotPassword,
    resetPassword,
    updateAvatar,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <AuthStateBridge>{children}</AuthStateBridge>
    </SessionProvider>
  );
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
