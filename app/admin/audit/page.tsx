import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS } from "@/lib/permissions";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  await requirePermission(PERMISSIONS.AUDIT_VIEW);
  const logs = await prisma.auditLog.findMany({
    take: 200,
    orderBy: { createdAt: "desc" },
    include: { actor: true }
  });

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow plain">Accountability</span>
          <h1>Audit Log</h1>
          <p>The latest 200 administrative and application events.</p>
        </div>
      </div>

      <div className="admin-panel">
        {logs.length === 0 ? (
          <p className="empty-copy">No audit events recorded yet.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead><tr><th>Time</th><th>Actor</th><th>Action</th><th>Target</th></tr></thead>
              <tbody>
                {logs.map((log: (typeof logs)[number]) => (
                  <tr key={log.id}>
                    <td>{log.createdAt.toLocaleString()}</td>
                    <td>{log.actor?.displayName || log.actor?.username || "System"}</td>
                    <td><code>{log.action}</code></td>
                    <td>{log.targetType}{log.targetId ? ` · ${log.targetId}` : ""}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
