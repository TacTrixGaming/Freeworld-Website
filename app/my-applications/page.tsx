import type { Metadata } from "next";
import { requireUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { StatusBadge } from "@/components/status-badge";
import { withdrawApplication } from "@/app/actions/applications";
import { ClipboardIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "My Applications"
};

export const dynamic = "force-dynamic";

export default async function MyApplicationsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const session = await requireUser();
  const params = await searchParams;
  const submissions = await prisma.applicationSubmission.findMany({
    where: { userId: session.user.id },
    orderBy: { submittedAt: "desc" },
    include: {
      applicationType: true,
      reviewedBy: {
        select: { displayName: true, username: true }
      }
    }
  });

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero compact">
          <span className="page-icon"><ClipboardIcon /></span>
          <span className="eyebrow plain">Member portal</span>
          <h1>My Applications</h1>
          <p>Track every application submitted from your Discord account.</p>
        </div>

        {params.submitted === "1" && (
          <div className="alert alert-success">
            Your application was submitted successfully.
          </div>
        )}
        {params.error === "already-open" && (
          <div className="alert alert-error">
            You already have an active application of that type.
          </div>
        )}

        {submissions.length === 0 ? (
          <div className="empty-state">
            <h2>No applications yet.</h2>
            <p>Your submitted applications will appear here.</p>
          </div>
        ) : (
          <div className="submission-list">
            {submissions.map((submission: (typeof submissions)[number]) => {
              const canWithdraw = ["SUBMITTED", "UNDER_REVIEW", "INTERVIEW"].includes(
                submission.status
              );

              return (
                <article className="submission-card" key={submission.id}>
                  <div className="submission-main">
                    <div>
                      <span className="muted-label">Application</span>
                      <h2>{submission.applicationType.name}</h2>
                    </div>
                    <StatusBadge status={submission.status} />
                  </div>
                  <div className="submission-meta">
                    <span>Submitted {submission.submittedAt.toLocaleDateString()}</span>
                    <span>Updated {submission.updatedAt.toLocaleDateString()}</span>
                  </div>
                  {submission.reviewNotes && (
                    <div className="review-note">
                      <strong>Staff note</strong>
                      <p>{submission.reviewNotes}</p>
                    </div>
                  )}
                  {canWithdraw && (
                    <form action={withdrawApplication}>
                      <input type="hidden" name="id" value={submission.id} />
                      <button className="text-button danger" type="submit">
                        Withdraw application
                      </button>
                    </form>
                  )}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
