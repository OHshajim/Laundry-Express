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
  sendOtp: (email: string, purpose: "change_password" | "reset_password" | "register_email") => Promise<{ success: boolean; message?: string; error?: string }>;
  changePasswordWithOtp: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  resetPasswordWithOtp: (email: string, otp: string, newPass: string) => Promise<{ success: boolean; error?: string }>;
  updateAvatar: (avatarUrl: string) => void;
  updateUserProfile: (updates: Partial<Pick<User, "full_name" | "phone" | "address">>) => void;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);
const PROFILE_CHECK_INTERVAL_MS = 60_000;
const PROFILE_CHECK_TIMEOUT_MS = 10_000;

function AuthStateBridge({ children }: { children: React.ReactNode }) {
  const { data: session, status, update: updateSession } = useSession();
  const [verifiedProfile, setVerifiedProfile] = React.useState<{
    user: User;
    sessionId: string;
    expires: string;
  } | null>(null);
  const [profileFailure, setProfileFailure] = React.useState<{
    sessionId: string;
    expires: string;
    message: string;
  } | null>(null);
  const [profileRetry, setProfileRetry] = React.useState(0);

  React.useEffect(() => {
    if (status !== "authenticated") return;

    let disposed = false;
    let checking = false;
    const sessionId = session?.user?.id ?? "";
    const expires = session?.expires ?? "";
    if (!sessionId || !expires) return;
    const validateProfile = async () => {
      if (checking || disposed) return;
      checking = true;
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), PROFILE_CHECK_TIMEOUT_MS);
      try {
        const response = await fetch("/api/user/profile", {
          cache: "no-store",
          signal: controller.signal,
        });
        if (response.status === 401) {
          setVerifiedProfile(null);
          setProfileFailure(null);
          await signOut({ callbackUrl: "/login" });
          return;
        }
        if (!response.ok) {
          throw new Error("Unable to verify account.");
        }
        const result = await response.json();
        if (!result?.success || !result.user || disposed) {
          throw new Error("Unable to verify account.");
        }
        const dbUser = result.user as User;
        if (!dbUser.is_active) {
          throw new Error("Account is no longer active.");
        }
        setVerifiedProfile((previous) => {
          const unchanged = previous &&
            previous.sessionId === sessionId &&
            previous.expires === expires &&
            previous.user.id === dbUser.id &&
            previous.user.email === dbUser.email &&
            previous.user.full_name === dbUser.full_name &&
            previous.user.avatar_url === dbUser.avatar_url &&
            previous.user.phone === dbUser.phone &&
            previous.user.address === dbUser.address &&
            previous.user.role === dbUser.role &&
            previous.user.is_active === dbUser.is_active &&
            previous.user.updated_at === dbUser.updated_at;
          return unchanged ? previous : { user: dbUser, sessionId, expires };
        });
        setProfileFailure(null);
      } catch {
        if (disposed) return;
        setProfileFailure({
          sessionId,
          expires,
          message: "We couldn't verify your account right now. Please retry or sign out.",
        });
      } finally {
        window.clearTimeout(timeout);
        checking = false;
      }
    };

    void validateProfile();
    const timer = window.setInterval(validateProfile, PROFILE_CHECK_INTERVAL_MS);
    window.addEventListener("focus", validateProfile);
    return () => {
      disposed = true;
      window.clearInterval(timer);
      window.removeEventListener("focus", validateProfile);
    };
  }, [session?.user?.id, session?.expires, status, profileRetry]);

  const login = React.useCallback(async (email: string, password: string) => {
    try {
      const res = await signIn("credentials", {
        redirect: false,
        email: email.trim().toLowerCase(),
        password,
      });

      if (!res || res.error) {
        return { success: false, error: res?.error || "Invalid email or password." };
      }

      const refreshedSession = await updateSession();
      if (!refreshedSession?.user?.id || !refreshedSession.expires) {
        return {
          success: false,
          error: "Sign-in completed, but we couldn't establish your session. Please try again.",
        };
      }

      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Authentication failed." };
    }
  }, [updateSession]);

  const loginWithGoogle = React.useCallback(async (callbackUrl: string = "/dashboard") => {
    try {
      await signIn("google", { callbackUrl });
      return { success: true };
    } catch {
      return { success: false, error: "Google authentication failed. Please try again." };
    }
  }, []);

  const register = React.useCallback(async (data: RegisterPayload) => {
    const res = await authService.register(data);
    if (!res.success) return { success: false, error: res.error || "Registration failed." };

    return login(data.email, data.password);
  }, [login]);

  const sendOtp = React.useCallback(
    (email: string, purpose: "change_password" | "reset_password" | "register_email") =>
      authService.sendOtp(email, purpose),
    []
  );

  const changePasswordWithOtp = React.useCallback(
    (email: string, otp: string, newPass: string) =>
      authService.changePasswordWithOtp(email, otp, newPass),
    []
  );

  const resetPasswordWithOtp = React.useCallback(
    (email: string, otp: string, newPass: string) =>
      authService.resetPasswordWithOtp(email, otp, newPass),
    []
  );

  const updateAvatar = React.useCallback((avatarUrl: string) => {
    setVerifiedProfile((prev) => prev ? {
      ...prev,
      user: { ...prev.user, avatar_url: avatarUrl },
    } : null);
    if (updateSession) {
      updateSession({ image: avatarUrl, avatar_url: avatarUrl });
    }
  }, [updateSession]);

  const updateUserProfile = React.useCallback((updates: Partial<Pick<User, "full_name" | "phone" | "address">>) => {
    setVerifiedProfile((prev) => prev ? {
      ...prev,
      user: { ...prev.user, ...updates },
    } : null);
    if (updateSession && updates.full_name) {
      updateSession({ name: updates.full_name });
    }
  }, [updateSession]);

  const logout = React.useCallback(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  const sessionId = session?.user?.id;
  const sessionExpires = session?.expires;
  const activeUser = status === "authenticated" &&
    verifiedProfile !== null &&
    verifiedProfile.sessionId === sessionId &&
    verifiedProfile.expires === sessionExpires
    ? verifiedProfile.user
    : null;
  const profileError = profileFailure !== null &&
    profileFailure.sessionId === (sessionId ?? "") &&
    profileFailure.expires === (sessionExpires ?? "")
    ? profileFailure.message
    : status === "authenticated" && (!sessionId || !sessionExpires)
      ? "We couldn't establish your sign-in session. Please retry or sign out."
      : null;
  const contextValue = React.useMemo<AuthContextType>(() => ({
    user: activeUser,
    isAuthenticated: !!activeUser,
    isAdmin: activeUser?.role === "admin",
    isCustomer: activeUser?.role === "customer",
    isLoading: status === "loading" || (status === "authenticated" && !activeUser && !profileError),
    login,
    loginWithGoogle,
    register,
    sendOtp,
    changePasswordWithOtp,
    resetPasswordWithOtp,
    updateAvatar,
    updateUserProfile,
    logout,
  }), [
    activeUser, status, profileError, login, loginWithGoogle, register, sendOtp,
    changePasswordWithOtp, resetPasswordWithOtp, updateAvatar, updateUserProfile, logout,
  ]);

  return (
    <AuthContext.Provider value={contextValue}>
      {status === "authenticated" && profileError ? (
        <main className="flex min-h-screen items-center justify-center bg-slate-50 px-5">
          <section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
            <h1 className="text-lg font-semibold text-slate-900">Account verification unavailable</h1>
            <p className="mt-2 text-sm text-slate-600">{profileError}</p>
            <div className="mt-5 flex flex-wrap gap-3">
              <button
                className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white"
                onClick={() => setProfileRetry((retry) => retry + 1)}
                type="button"
              >
                Retry
              </button>
              <button
                className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700"
                onClick={logout}
                type="button"
              >
                Sign out
              </button>
            </div>
          </section>
        </main>
      ) : children}
    </AuthContext.Provider>
  );
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider refetchInterval={0} refetchOnWindowFocus={true}>
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
