import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section auth-section">
      <div className="container narrow">
        <div className="auth-card">
          <span className="eyebrow plain">404</span>
          <h1>Page not found</h1>
          <p>The page you requested does not exist or has been moved.</p>
          <Link className="button" href="/">Return home</Link>
        </div>
      </div>
    </section>
  );
}
