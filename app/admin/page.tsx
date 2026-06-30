import { ApplicationStatus } from "@prisma/client";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PERMISSIONS, roleLabel } from "@/lib/permissions";
import { StatusBadge } from "@/components/status-badge";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const session = await requirePermission(PERMISSIONS.DASHBOARD_VIEW);

  const [totalApplications, pendingApplications, users, openTypes, recent] =
    await Promise.all([
      prisma.applicationSubmission.count(),
      prisma.applicationSubmission.count({
        where: {
          status: {
            in: [
              ApplicationStatus.SUBMITTED,
              ApplicationStatus.UNDER_REVIEW,
              ApplicationStatus.INTERVIEW
            ]
          }
        }
      }),
      prisma.user.count(),
      prisma.applicationType.count({ where: { isOpen: true } }),
      prisma.applicationSubmission.findMany({
        take: 6,
        orderBy: { submittedAt: "desc" },
        include: {
          user: true,
          applicationType: true
        }
      })
    ]);

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow plain">Overview</span>
          <h1>Welcome back, {session.user.name}</h1>
          <p>{session.user.role ? roleLabel(session.user.role) : "Member"}</p>
        </div>
      </div>

      <div className="stat-grid">
        <div className="stat-card"><span>Total applications</span><strong>{totalApplications}</strong></div>
        <div className="stat-card"><span>Awaiting action</span><strong>{pendingApplications}</strong></div>
        <div className="stat-card"><span>Portal users</span><strong>{users}</strong></div>
        <div className="stat-card"><span>Open forms</span><strong>{openTypes}</strong></div>
      </div>

      <div className="admin-panel">
        <div className="panel-heading">
          <div>
            <h2>Recent applications</h2>
            <p>Latest submissions across every application type.</p>
          </div>
        </div>
        {recent.length === 0 ? (
          <p className="empty-copy">No applications have been submitted.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Applicant</th><th>Type</th><th>Status</th><th>Submitted</th></tr>
              </thead>
              <tbody>
                {recent.map((submission: (typeof recent)[number]) => (
                  <tr key={submission.id}>
                    <td>{submission.user.displayName || submission.user.username}</td>
                    <td>{submission.applicationType.name}</td>
                    <td><StatusBadge status={submission.status} /></td>
                    <td>{submission.submittedAt.toLocaleDateString()}</td>
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
