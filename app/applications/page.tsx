import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ApplicationIcon, ArrowIcon, ClipboardIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Applications"
};

export const dynamic = "force-dynamic";

export default async function ApplicationsPage({
  searchParams
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const applications = await prisma.applicationType.findMany({
    orderBy: { order: "asc" }
  });

  return (
    <section className="section">
      <div className="container">
        <div className="page-hero compact">
          <span className="page-icon"><ClipboardIcon /></span>
          <span className="eyebrow plain">Join the team</span>
          <h1>Applications</h1>
          <p>
            Choose an open application below. You will need to sign in with
            Discord before submitting.
          </p>
        </div>

        {params.error === "closed" && (
          <div className="alert alert-error">
            That application is no longer accepting submissions.
          </div>
        )}

        <div className="application-grid">
          {applications.map((application: (typeof applications)[number]) => (
              <article className="application-card" key={application.id}>
                <div className="application-card-top">
                  <span className="feature-icon"><ApplicationIcon name={application.icon} /></span>
                  <span className={application.isOpen ? "availability open" : "availability closed"}>
                    {application.isOpen ? "Open" : "Closed"}
                  </span>
                </div>
                <h2>{application.name}</h2>
                <p>{application.description}</p>
                {application.isOpen ? (
                  <Link className="card-link" href={`/applications/${application.slug}`}>
                    Start application <ArrowIcon />
                  </Link>
                ) : (
                  <span className="card-link muted">Not accepting submissions</span>
                )}
              </article>
          ))}
        </div>
      </div>
    </section>
  );
}
