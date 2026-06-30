import Link from "next/link";
import { ShieldIcon } from "@/components/icons";

export default function UnauthorizedPage() {
  return (
    <section className="section auth-section">
      <div className="container narrow">
        <div className="auth-card">
          <span className="auth-icon"><ShieldIcon /></span>
          <h1>Access denied</h1>
          <p>Your account does not have permission to view that page.</p>
          <Link className="button" href="/">Return home</Link>
        </div>
      </div>
    </section>
  );
}
