"use client";

export default function ErrorPage({
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="section auth-section">
      <div className="container narrow">
        <div className="auth-card">
          <span className="eyebrow plain">Portal error</span>
          <h1>Something went wrong</h1>
          <p>
            The portal could not complete that request. Confirm the database and
            environment variables are configured, then try again.
          </p>
          <button className="button" type="button" onClick={reset}>Try again</button>
        </div>
      </div>
    </section>
  );
}
