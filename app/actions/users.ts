"use server";

import { UserRole } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ALL_PERMISSIONS,
  isConfiguredOwner,
  PERMISSIONS
} from "@/lib/permissions";
import { writeAuditLog } from "@/lib/audit";

export async function updateUserAccess(formData: FormData) {
  const session = await requirePermission(PERMISSIONS.USERS_MANAGE);
  const userId = String(formData.get("userId") || "");
  const role = String(formData.get("role") || "") as UserRole;

  if (!Object.values(UserRole).includes(role) || role === UserRole.WEBSITE_DEVELOPER) {
    redirect(`/admin/users?error=invalid-role`);
  }

  const currentTarget = await prisma.user.findUnique({ where: { id: userId } });
  if (!currentTarget || isConfiguredOwner(currentTarget.discordId)) {
    redirect(`/admin/users?error=protected-owner`);
  }

  const allow = ALL_PERMISSIONS.filter(
    (permission) => formData.get(`allow:${permission}`) === "on"
  );
  const deny = ALL_PERMISSIONS.filter(
    (permission) => formData.get(`deny:${permission}`) === "on"
  );

  const target = await prisma.user.update({
    where: { id: userId },
    data: {
      role,
      permissionOverrides: { allow, deny }
    }
  });

  await writeAuditLog({
    actorId: session.user.id,
    action: "user.access_updated",
    targetType: "User",
    targetId: userId,
    metadata: { discordId: target.discordId, role, allow, deny }
  });

  revalidatePath("/admin/users");
  redirect(`/admin/users?updated=1`);
}
