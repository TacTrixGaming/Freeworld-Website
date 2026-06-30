import type { UserRole } from "@prisma/client";
import { siteConfig } from "@/config/site";

export const PERMISSIONS = {
  DASHBOARD_VIEW: "dashboard.view",
  APPLICATIONS_VIEW: "applications.view",
  APPLICATIONS_REVIEW: "applications.review",
  APPLICATIONS_MANAGE: "applications.manage",
  RULES_MANAGE: "rules.manage",
  USERS_VIEW: "users.view",
  USERS_MANAGE: "users.manage",
  SETTINGS_MANAGE: "settings.manage",
  AUDIT_VIEW: "audit.view"
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

export const ALL_PERMISSIONS = Object.values(PERMISSIONS);

const rolePermissions: Record<UserRole, Permission[]> = {
  USER: [],
  REVIEWER: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.APPLICATIONS_VIEW,
    PERMISSIONS.APPLICATIONS_REVIEW
  ],
  ADMIN: [
    PERMISSIONS.DASHBOARD_VIEW,
    PERMISSIONS.APPLICATIONS_VIEW,
    PERMISSIONS.APPLICATIONS_REVIEW,
    PERMISSIONS.APPLICATIONS_MANAGE,
    PERMISSIONS.RULES_MANAGE,
    PERMISSIONS.USERS_VIEW,
    PERMISSIONS.AUDIT_VIEW
  ],
  WEBSITE_DEVELOPER: ALL_PERMISSIONS
};

type PermissionOverrides = {
  allow?: string[];
  deny?: string[];
};

export function isConfiguredOwner(discordId?: string | null) {
  return Boolean(discordId && siteConfig.ownerDiscordIds.includes(discordId));
}

export function effectiveRole(role: UserRole, discordId?: string | null): UserRole {
  return isConfiguredOwner(discordId) ? "WEBSITE_DEVELOPER" : role;
}

export function resolvePermissions(
  role: UserRole,
  discordId?: string | null,
  overrides?: unknown
): Permission[] {
  if (isConfiguredOwner(discordId) || role === "WEBSITE_DEVELOPER") {
    return [...ALL_PERMISSIONS];
  }

  const base = new Set(rolePermissions[role] ?? []);
  const parsed = (overrides || {}) as PermissionOverrides;

  for (const permission of parsed.allow ?? []) {
    if (ALL_PERMISSIONS.includes(permission as Permission)) {
      base.add(permission as Permission);
    }
  }

  for (const permission of parsed.deny ?? []) {
    base.delete(permission as Permission);
  }

  return [...base];
}

export function hasPermission(
  permissions: readonly string[] | undefined,
  permission: Permission
) {
  return Boolean(permissions?.includes(permission));
}

export function roleLabel(role: UserRole) {
  const labels: Record<UserRole, string> = {
    USER: "Member",
    REVIEWER: "Application Reviewer",
    ADMIN: "Website Administrator",
    WEBSITE_DEVELOPER: "Website Developer"
  };

  return labels[role];
}
