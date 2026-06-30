import type { DefaultSession } from "next-auth";
import type { UserRole } from "@prisma/client";
import type { Permission } from "@/lib/permissions";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      discordId: string;
      role?: UserRole;
      permissions: Permission[];
    } & DefaultSession["user"];
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    userId?: string;
    discordId?: string;
    role?: UserRole;
    permissions?: Permission[];
  }
}
