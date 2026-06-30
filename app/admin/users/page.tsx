import { UserRole } from "@prisma/client";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import {
  ALL_PERMISSIONS,
  effectiveRole,
  isConfiguredOwner,
  PERMISSIONS,
  roleLabel
} from "@/lib/permissions";
import { updateUserAccess } from "@/app/actions/users";

export const dynamic = "force-dynamic";

type Overrides = {
  allow?: string[];
  deny?: string[];
};

export default async function AdminUsersPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requirePermission(PERMISSIONS.USERS_VIEW);
  const canManage = session.user.permissions.includes(PERMISSIONS.USERS_MANAGE);
  const params = await searchParams;
  const users = await prisma.user.findMany({
    orderBy: { lastLoginAt: "desc" }
  });

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow plain">Access control</span>
          <h1>Users & Permissions</h1>
          <p>Assign roles or add exact permission overrides.</p>
        </div>
      </div>

      {params.updated === "1" && (
        <div className="alert alert-success">User access updated.</div>
      )}
      {params.error === "invalid-role" && (
        <div className="alert alert-error">That role cannot be assigned from the dashboard.</div>
      )}
      {params.error === "protected-owner" && (
        <div className="alert alert-error">Configured owner accounts cannot be changed.</div>
      )}

      <div className="user-admin-list">
        {users.map((user: (typeof users)[number]) => {
          const owner = isConfiguredOwner(user.discordId);
          const role = effectiveRole(user.role, user.discordId);
          const overrides = (user.permissionOverrides || {}) as Overrides;

          return (
            <details className="admin-panel user-access-card" key={user.id}>
              <summary>
                <div>
                  <strong>{user.displayName || user.username}</strong>
                  <span>{user.discordId}</span>
                </div>
                <div className="summary-role">
                  {owner && <span className="owner-badge">Configured owner</span>}
                  <span>{roleLabel(role)}</span>
                </div>
              </summary>

              {owner ? (
                <div className="owner-notice">
                  This Discord ID is listed in OWNER_DISCORD_IDS. It is always
                  labeled Website Developer and automatically has every permission.
                </div>
              ) : !canManage ? (
                <div className="owner-notice">
                  You can view this account, but only a configured Website Developer
                  can change roles and permission overrides.
                </div>
              ) : (
                <form action={updateUserAccess} className="form-stack user-access-form">
                  <input type="hidden" name="userId" value={user.id} />
                  <div className="form-group">
                    <label htmlFor={`role-${user.id}`}>Base role</label>
                    <select id={`role-${user.id}`} name="role" defaultValue={user.role}>
                      {Object.values(UserRole)
                        .filter((option) => option !== UserRole.WEBSITE_DEVELOPER)
                        .map((option) => (
                          <option value={option} key={option}>{roleLabel(option)}</option>
                        ))}
                    </select>
                  </div>

                  <div className="permission-table">
                    <div className="permission-head">
                      <span>Permission</span><span>Force allow</span><span>Force deny</span>
                    </div>
                    {ALL_PERMISSIONS.map((permission) => (
                      <div className="permission-row" key={permission}>
                        <code>{permission}</code>
                        <input
                          aria-label={`Allow ${permission}`}
                          type="checkbox"
                          name={`allow:${permission}`}
                          defaultChecked={overrides.allow?.includes(permission)}
                        />
                        <input
                          aria-label={`Deny ${permission}`}
                          type="checkbox"
                          name={`deny:${permission}`}
                          defaultChecked={overrides.deny?.includes(permission)}
                        />
                      </div>
                    ))}
                  </div>

                  <button className="button button-small" type="submit">Save access</button>
                </form>
              )}
            </details>
          );
        })}
      </div>
    </>
  );
}
