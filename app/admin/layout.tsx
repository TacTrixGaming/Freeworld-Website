import Link from "next/link";
import { requirePermission } from "@/lib/auth";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";

export default async function AdminLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await requirePermission(PERMISSIONS.DASHBOARD_VIEW);
  const permissions = session.user.permissions;

  return (
    <section className="admin-shell">
      <div className="container admin-layout">
        <aside className="admin-sidebar">
          <div>
            <span className="eyebrow plain">Control panel</span>
            <h2>Website Admin</h2>
          </div>
          <nav>
            <Link href="/admin">Overview</Link>
            {hasPermission(permissions, PERMISSIONS.APPLICATIONS_VIEW) && (
              <Link href="/admin/applications">Applications</Link>
            )}
            {hasPermission(permissions, PERMISSIONS.RULES_MANAGE) && (
              <Link href="/admin/rules">Rules</Link>
            )}
            {hasPermission(permissions, PERMISSIONS.USERS_VIEW) && (
              <Link href="/admin/users">Users</Link>
            )}
            {hasPermission(permissions, PERMISSIONS.AUDIT_VIEW) && (
              <Link href="/admin/audit">Audit Log</Link>
            )}
          </nav>
        </aside>
        <div className="admin-content">{children}</div>
      </div>
    </section>
  );
}
