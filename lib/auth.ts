import type { NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import {
  effectiveRole,
  resolvePermissions,
  type Permission,
  hasPermission
} from "@/lib/permissions";

function discordAvatarUrl(discordId: string, avatar?: string | null) {
  if (!avatar) {
    return null;
  }

  const extension = avatar.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.${extension}?size=256`;
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60
  },
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID || "",
      clientSecret: process.env.DISCORD_CLIENT_SECRET || "",
      authorization: { params: { scope: "identify" } }
    })
  ],
  pages: {
    signIn: "/login"
  },
  callbacks: {
    async signIn({ profile }) {
      const discordProfile = profile as
        | {
            id?: string;
            username?: string;
            global_name?: string | null;
            avatar?: string | null;
          }
        | undefined;

      if (!discordProfile || typeof discordProfile.id !== "string") {
        return false;
      }

      await prisma.user.upsert({
        where: { discordId: discordProfile.id },
        update: {
          username: discordProfile.username || "Discord User",
          displayName:
            discordProfile.global_name || discordProfile.username || "Discord User",
          avatarUrl: discordAvatarUrl(discordProfile.id, discordProfile.avatar),
          lastLoginAt: new Date()
        },
        create: {
          discordId: discordProfile.id,
          username: discordProfile.username || "Discord User",
          displayName:
            discordProfile.global_name || discordProfile.username || "Discord User",
          avatarUrl: discordAvatarUrl(discordProfile.id, discordProfile.avatar)
        }
      });

      return true;
    },
    async jwt({ token, profile }) {
      const discordProfile = profile as { id?: string } | undefined;
      if (discordProfile && typeof discordProfile.id === "string") {
        token.discordId = discordProfile.id;
      }

      if (typeof token.discordId === "string") {
        const user = await prisma.user.findUnique({
          where: { discordId: token.discordId }
        });

        if (user) {
          const role = effectiveRole(user.role, user.discordId);
          token.userId = user.id;
          token.role = role;
          token.permissions = resolvePermissions(
            role,
            user.discordId,
            user.permissionOverrides
          );
          token.name = user.displayName || user.username;
          token.picture = user.avatarUrl;
        }
      }

      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = typeof token.userId === "string" ? token.userId : "";
        session.user.discordId =
          typeof token.discordId === "string" ? token.discordId : "";
        session.user.role = token.role;
        session.user.permissions = Array.isArray(token.permissions)
          ? token.permissions
          : [];
      }

      return session;
    }
  }
};

export function getCurrentSession() {
  return getServerSession(authOptions);
}

export async function requireUser() {
  const session = await getCurrentSession();
  if (!session?.user?.id) {
    redirect("/login");
  }
  return session;
}

export async function requirePermission(permission: Permission) {
  const session = await requireUser();

  if (!hasPermission(session.user.permissions, permission)) {
    redirect("/unauthorized");
  }

  return session;
}
