"use client";

import * as React from "react";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react";
import type { User } from "@/types";
import { authService, type RegisterPayload } from "@/lib/services/auth-service";

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isCustomer: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: (callbackUrl?: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  sendOtp: (email: string, purpose: "change_password" | "reset_password") => Promise<{ success: boolean; message?: string; error?: string }>;
  changePasswordWithOtp: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithOtp: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (avatarUrl: string) => void;
  updateUserProfile: (updates: Partial<Pick<User, "full_name" | "phone" | "address">>) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
const LOCAL_STORAGE_USER_KEY = "lx_auth_session_user";

function AuthStateBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateSession } = useSession();
  const [localUser, setLocalUser] = React.useState<User | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  // Dynamically sync complete profile from database (source of truth)
  React.useEffect(() => {
    if (session?.user?.email) {
      fetch("/api/user/profile")
        .then((res) => res.json())
        .then((data) => {
          if (data?.success && data?.user) {
            const db = data.user;
            setLocalUser((prev) => {
              const updated: User = {
                id: db.id || prev?.id || session.user.id || `u-${Date.now()}`,
                email: db.email || session.user.email || "",
                full_name: db.full_name || prev?.full_name || session.user.name || "Customer",
                avatar_url: db.avatar_url || prev?.avatar_url || session.user.image,
                phone: db.phone || prev?.phone,
                address: db.address || prev?.address,
                role: db.role || prev?.role || (session.user as { role?: "admin" | "customer" }).role || "customer",
                is_active: db.is_active ?? true,
                created_at: db.created_at || prev?.created_at,
                updated_at: db.updated_at || new Date().toISOString(),
              };
              try { localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated)); } catch {}
              return updated;
            });
          }
        })
        .catch(() => {});
    }
  }, [session?.user?.email]);

  React.useEffect(() => {
    if (session?.user) {
      const userEmail = session.user.email || "";
      const sessionRole = (session.user as { role?: "admin" | "customer" }).role;
      const role = sessionRole || "customer";

      setLocalUser((prev) => {
        const resolvedName = prev?.full_name || session.user.name || "Customer";
        const resolvedAvatar = prev?.avatar_url || session.user.image || (session.user as { avatar_url?: string }).avatar_url || undefined;
        const activeUser: User = {
          id: session.user.id || prev?.id || `u-${Date.now()}`,
          email: userEmail,
          full_name: resolvedName,
          avatar_url: resolvedAvatar,
          phone: prev?.phone || (session.user as { phone?: string }).phone,
          address: prev?.address,
          role,
          is_active: true,
          created_at: prev?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };

        if (
          prev?.id === activeUser.id &&
          prev?.email === activeUser.email &&
          prev?.role === activeUser.role &&
          prev?.avatar_url === activeUser.avatar_url &&
          prev?.full_name === activeUser.full_name &&
          prev?.phone === activeUser.phone
        ) {
          return prev;
        }
        try { localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(activeUser)); } catch {}
        return activeUser;
      });
    } else if (status === "unauthenticated") {
      setLocalUser((prev) => {
        if (!prev) return null;
        try { localStorage.removeItem(LOCAL_STORAGE_USER_KEY); } catch {}
        return null;
      });
    }
  }, [session, status]);

  const login = async (email: string, password: string) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res || res.error) {
        return { success: false, error: res?.error || "Invalid email or password." };
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Authentication failed." };
    }
  };

  const loginWithGoogle = async (callbackUrl: string = "/dashboard") => {
    try {
      await signIn("google", { callbackUrl });
      return { success: true };
    } catch {
      return { success: false, error: "Google authentication failed. Please try again." };
    }
  };

  const register = async (data: RegisterPayload) => {
    const res = await authService.register(data);
    if (!res.success) return { success: false, error: res.error || "Registration failed." };

    return login(data.email, data.password);
  };

  const sendOtp = (email: string, purpose: "change_password" | "reset_password") =>
    authService.sendOtp(email, purpose);

  const changePasswordWithOtp = (email: string, otp: string, newPass: string) =>
    authService.changePasswordWithOtp(email, otp, newPass);

  const resetPasswordWithOtp = (email: string, otp: string, newPass: string) =>
    authService.resetPasswordWithOtp(email, otp, newPass);

  const updateAvatar = (avatarUrl: string) => {
    setLocalUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, avatar_url: avatarUrl };
      try { localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
    if (updateSession) {
      updateSession({ image: avatarUrl, avatar_url: avatarUrl });
    }
  };

  const updateUserProfile = (updates: Partial<Pick<User, "full_name" | "phone" | "address">>) => {
    setLocalUser((prev) => {
      if (!prev) return null;
      const updated = { ...prev, ...updates };
      try { localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(updated)); } catch {}
      return updated;
    });
    if (updateSession && updates.full_name) {
      updateSession({ name: updates.full_name });
    }
  };

  const logout = () => {
    setLocalUser(null);
    try { localStorage.removeItem(LOCAL_STORAGE_USER_KEY); } catch {}
    signOut({ callbackUrl: "/login" });
  };

  const activeUser = localUser || null;

  return (
    <AuthContext.Provider
      value={{
        user: activeUser,
        isAuthenticated: !!activeUser,
        isAdmin: activeUser?.role === "admin",
        isCustomer: activeUser?.role === "customer",
        isLoading: status === "loading",
        login,
        loginWithGoogle,
        register,
        sendOtp,
        changePasswordWithOtp,
        resetPasswordWithOtp,
        updateAvatar,
        updateUserProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={5 * 60} refetchOnWindowFocus={true}>
      <AuthStateBridge>{children}</AuthStateBridge>
    </SessionProvider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
