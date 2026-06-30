import { ApplicationStatus } from "@prisma/client";
import { notFound } from "next/navigation";
import { requirePermission } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { parseApplicationFields } from "@/lib/application-fields";
import { PERMISSIONS } from "@/lib/permissions";
import { StatusBadge } from "@/components/status-badge";
import { reviewApplication } from "@/app/actions/applications";

export const dynamic = "force-dynamic";

export default async function ApplicationReviewPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  await requirePermission(PERMISSIONS.APPLICATIONS_REVIEW);
  const { id } = await params;
  const query = await searchParams;
  const submission = await prisma.applicationSubmission.findUnique({
    where: { id },
    include: {
      user: true,
      applicationType: true,
      reviewedBy: true
    }
  });

  if (!submission) {
    notFound();
  }

  const fields = parseApplicationFields(submission.applicationType.fields);
  const answers = (submission.answers || {}) as Record<string, unknown>;

  return (
    <>
      <div className="admin-heading">
        <div>
          <span className="eyebrow plain">Application review</span>
          <h1>{submission.applicationType.name}</h1>
          <p>
            {submission.user.displayName || submission.user.username} · Discord ID {submission.user.discordId}
          </p>
        </div>
        <StatusBadge status={submission.status} />
      </div>

      {query.saved === "1" && (
        <div className="alert alert-success">Review saved.</div>
      )}

      <div className="review-grid">
        <div className="admin-panel">
          <div className="panel-heading">
            <div><h2>Applicant responses</h2><p>Submitted {submission.submittedAt.toLocaleString()}</p></div>
          </div>
          <div className="answer-list">
            {fields.map((field) => (
              <div className="answer-item" key={field.id}>
                <span>{field.label}</span>
                <p>
                  {typeof answers[field.id] === "boolean"
                    ? answers[field.id] ? "Yes" : "No"
                    : String(answers[field.id] ?? "Not answered")}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-panel sticky-panel">
          <div className="panel-heading">
            <div><h2>Decision</h2><p>Update status and add a note visible to the applicant.</p></div>
          </div>
          <form action={reviewApplication} className="form-stack">
            <input type="hidden" name="submissionId" value={submission.id} />
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select id="status" name="status" defaultValue={submission.status}>
                {Object.values(ApplicationStatus).map((status) => (
                  <option value={status} key={status}>
                    {status.replaceAll("_", " ")}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="reviewNotes">Staff note</label>
              <textarea
                id="reviewNotes"
                name="reviewNotes"
                rows={8}
                defaultValue={submission.reviewNotes || ""}
                placeholder="Interview instructions, decision explanation, or next steps..."
              />
            </div>
            <button className="button" type="submit">Save review</button>
          </form>
        </div>
      </div>
    </>
  );
}
