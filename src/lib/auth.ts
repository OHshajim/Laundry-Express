import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { UserDbService } from "@/lib/services/user-db-service";

/**
 * NextAuth Configuration & Authentication Options
 * Primary enterprise authentication architecture for Laundry Express:
 * - Dynamic credentials verification against Supabase public.users
 * - Google OAuth authentication with database role synchronization
 * - Dynamic role retrieval (admin can be any email configured in database)
 * - JWT session strategy with role extraction ('admin' | 'customer')
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
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
    error: "/login",
  },
  providers: [
    // Credentials Provider verified against database
    CredentialsProvider({
      id: "credentials",
      name: "Laundry Express Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please enter both email and password.");
        }

        const result = await UserDbService.verifyCredentialsWithStatus(
          credentials.email,
          credentials.password
        );

        if (!result.success || !result.user) {
          throw new Error(result.error || "Invalid email or password.");
        }

        const verifiedUser = result.user;

        return {
          id: verifiedUser.id,
          name: verifiedUser.full_name,
          email: verifiedUser.email,
          image: verifiedUser.avatar_url || null,
          role: verifiedUser.role,
          phone: verifiedUser.phone,
        };
      },
    }),

    // Google OAuth Provider with dynamic role synchronization
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: false,
      async profile(profile) {
        const normalizedEmail = profile.email?.trim().toLowerCase() || "";

        // Dynamically query user from database to preserve admin privileges
        const existing = await UserDbService.getUserByEmail(normalizedEmail);
        const role = existing?.role || "customer";

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
          image: profile.picture || dbUser.avatar_url || null,
          role: dbUser.role,
          phone: dbUser.phone,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user }) {
      if (user?.email) {
        const synchronized = await UserDbService.syncUser({
          id: user.id,
          email: user.email,
          name: user.name,
          phone: user.phone,
          avatar_url: user.image || undefined,
        });
        user.id = synchronized.id;
        user.role = synchronized.role;
        user.phone = synchronized.phone;
      }
      return true;
    },
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role || "customer";
        token.phone = user.phone;
        token.picture = user.image || token.picture;
      }
      if (token.id) {
        const activeUser = await UserDbService.getActiveUserById(token.id);
        if (!activeUser) {
          token.id = "";
          token.role = "customer";
          token.email = undefined;
        } else {
          token.id = activeUser.id;
          token.role = activeUser.role;
          token.email = activeUser.email;
          token.name = activeUser.full_name;
          token.phone = activeUser.phone;
          token.picture = activeUser.avatar_url || token.picture;
        }
      }
      if (trigger === "update" && session) {
        if (session.image) token.picture = session.image;
        if (session.avatar_url) token.picture = session.avatar_url;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = (token.role as "admin" | "customer") || "customer";
        session.user.phone = token.phone;
        session.user.image = (token.picture as string) || session.user.image || null;
      }
      return session;
    },
  },
};
