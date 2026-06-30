import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getCurrentSession } from "@/lib/auth";
import { parseApplicationFields } from "@/lib/application-fields";
import { ApplicationForm } from "@/components/application-form";
import { LoginButton } from "@/components/auth-button";
import { ApplicationIcon } from "@/components/icons";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const type = await prisma.applicationType.findUnique({ where: { slug } });
  return { title: type?.name || "Application" };
}

export default async function ApplicationPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const { slug } = await params;
  const query = await searchParams;
  const [type, session] = await Promise.all([
    prisma.applicationType.findUnique({ where: { slug } }),
    getCurrentSession()
  ]);

  if (!type) {
    notFound();
  }

  const fields = parseApplicationFields(type.fields);

  return (
    <section className="section">
      <div className="container narrow-wide">
        <div className="page-hero application-heading">
          <span className="page-icon"><ApplicationIcon name={type.icon} /></span>
          <span className={type.isOpen ? "availability open" : "availability closed"}>
            {type.isOpen ? "Applications open" : "Applications closed"}
          </span>
          <h1>{type.name}</h1>
          <p>{type.description}</p>
        </div>

        {typeof query.error === "string" && (
          <div className="alert alert-error">{query.error}</div>
        )}

        {!type.isOpen ? (
          <div className="empty-state">
            <h2>This application is currently closed.</h2>
            <p>Watch Discord for announcements when it reopens.</p>
          </div>
        ) : !session?.user ? (
          <div className="auth-card inline-auth">
            <h2>Discord sign-in required</h2>
            <p>
              Sign in before completing the form so your submission is linked
              to the correct account.
            </p>
            <LoginButton />
          </div>
        ) : fields.length === 0 ? (
          <div className="empty-state">
            <h2>This form has not been configured yet.</h2>
          </div>
        ) : (
          <div className="content-card">
            <div className="form-intro">
              <span>Signed in as</span>
              <strong>{session.user.name}</strong>
            </div>
            <ApplicationForm
              applicationTypeId={type.id}
              slug={type.slug}
              fields={fields}
            />
          </div>
        )}
      </div>
    </section>
  );
}
