import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { CustomUserStore } from "@/lib/services/custom-user-store";
import { UserDbService } from "@/lib/services/user-db-service";

/**
 * NextAuth Configuration & Authentication Options
 *
 * Primary enterprise authentication architecture for Laundry Express:
 * - NextAuth.js custom credentials verification via CustomUserStore
 * - Seamless Google OAuth authentication integration
 * - Automatic database persistence into Supabase PostgreSQL (public.users)
 * - JWT session strategy with role extraction ('admin' | 'customer')
 * - Strictly complies with the 100-250 lines architectural rule
 */

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: "admin" | "customer";
      phone?: string;
    };
  }

  interface User {
    id: string;
    role: "admin" | "customer";
    phone?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "admin" | "customer";
    phone?: string;
  }
}

export const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET || "laundry-express-auth-secret-key-32-chars-minimum-prod",
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Custom Credentials Provider for Laundry Express
    CredentialsProvider({
      id: "credentials",
      name: "Laundry Express Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const verifiedUser = CustomUserStore.verifyCredentials(
          credentials.email,
          credentials.password
        );

        if (!verifiedUser) {
          return null;
        }

        // Synchronize authenticated user to database asynchronously
        try {
          await UserDbService.syncUser({
            id: verifiedUser.id,
            email: verifiedUser.email,
            name: verifiedUser.full_name,
            role: verifiedUser.role,
            phone: verifiedUser.phone,
          });
        } catch {
          // Fallback to memory user
        }

        return {
          id: verifiedUser.id,
          name: verifiedUser.full_name,
          email: verifiedUser.email,
          role: verifiedUser.role,
          phone: verifiedUser.phone,
        };
      },
    }),

    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "google-oauth-client-id-placeholder",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "google-oauth-client-secret-placeholder",
      allowDangerousEmailAccountLinking: true,
      async profile(profile) {
        const normalizedEmail = profile.email?.trim().toLowerCase() || "";
        const role = normalizedEmail.includes("admin") ? "admin" : "customer";

        // Persist Google authenticated user into Supabase database
        const dbUser = await UserDbService.syncUser({
          id: profile.sub,
          email: normalizedEmail,
          name: profile.name || "Google Customer",
          role,
          image: profile.picture,
        });

        return {
          id: dbUser.id,
          name: dbUser.full_name,
          email: dbUser.email,
          image: profile.picture,
          role: dbUser.role,
          phone: dbUser.phone,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (user?.email) {
        try {
          await UserDbService.syncUser({
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            phone: user.phone,
          });
        } catch {
          // Gracefully continue sign in
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || (user.email?.includes("admin") ? "admin" : "customer");
        token.phone = user.phone;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = (token.role as "admin" | "customer") || "customer";
        session.user.phone = token.phone as string | undefined;
      }
      return session;
    },
  },
};
