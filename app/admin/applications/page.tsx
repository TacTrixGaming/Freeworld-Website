import Link from "next/link";
import { ApplicationStatus } from "@prisma/client";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { hasPermission, PERMISSIONS } from "@/lib/permissions";
import { StatusBadge } from "@/components/status-badge";
import { toggleApplicationType } from "@/app/actions/applications";

export const dynamic = "force-dynamic";

export default async function AdminApplicationsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requirePermission(PERMISSIONS.APPLICATIONS_VIEW);
  const params = await searchParams;
  const selectedStatus =
    typeof params.status === "string" &&
    Object.values(ApplicationStatus).includes(params.status as ApplicationStatus)
      ? (params.status as ApplicationStatus)
      : undefined;

  const [submissions, types] = await Promise.all([
    prisma.applicationSubmission.findMany({
      where: selectedStatus ? { status: selectedStatus } : undefined,
      orderBy: { submittedAt: "desc" },
      include: {
        user: true,
        applicationType: true
      }
    }),
    prisma.applicationType.findMany({ orderBy: { order: "asc" } })
  ]);

  const canManage = hasPermission(
    session.user.permissions,
    PERMISSIONS.APPLICATIONS_MANAGE
  );

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow plain">Review queue</span>
          <h1>Applications</h1>
          <p>Review submissions and control which forms are open.</p>
        </div>
      </div>

      {canManage && (
        <div className="admin-panel">
          <div className="panel-heading">
            <div><h2>Application availability</h2><p>Open or close forms without deleting them.</p></div>
          </div>
          <div className="toggle-list">
            {types.map((type: (typeof types)[number]) => (
              <div className="toggle-row" key={type.id}>
                <div><strong>{type.name}</strong><span>{type.description}</span></div>
                <form action={toggleApplicationType}>
                  <input type="hidden" name="id" value={type.id} />
                  <input type="hidden" name="isOpen" value={String(!type.isOpen)} />
                  <button className={type.isOpen ? "button button-danger button-small" : "button button-small"} type="submit">
                    {type.isOpen ? "Close" : "Open"}
                  </button>
                </form>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="admin-panel">
        <div className="panel-heading wrap">
          <div><h2>Submissions</h2><p>{submissions.length} result{submissions.length === 1 ? "" : "s"}</p></div>
          <div className="filter-row">
            <Link href="/admin/applications">All</Link>
            {Object.values(ApplicationStatus).map((status) => (
              <Link href={`/admin/applications?status=${status}`} key={status}>
                {status.replaceAll("_", " ")}
              </Link>
            ))}
          </div>
        </div>
        {submissions.length === 0 ? (
          <p className="empty-copy">No applications match this filter.</p>
        ) : (
          <div className="table-wrap">
            <table>
              <thead>
                <tr><th>Applicant</th><th>Type</th><th>Status</th><th>Submitted</th><th /></tr>
              </thead>
              <tbody>
                {submissions.map((submission: (typeof submissions)[number]) => (
                  <tr key={submission.id}>
                    <td>
                      <strong>{submission.user.displayName || submission.user.username}</strong>
                      <small>{submission.user.discordId}</small>
                    </td>
                    <td>{submission.applicationType.name}</td>
                    <td><StatusBadge status={submission.status} /></td>
                    <td>{submission.submittedAt.toLocaleDateString()}</td>
                    <td><Link className="text-button" href={`/admin/applications/${submission.id}`}>Review</Link></td>
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
