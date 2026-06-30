import Link from "next/link";
import { getCurrentSession } from "@/lib/auth";
import { siteConfig } from "@/config/site";
import { hasPermission, PERMISSIONS, roleLabel } from "@/lib/permissions";
import { LoginButton, LogoutButton } from "@/components/auth-button";
import { ShieldIcon } from "@/components/icons";

export async function Header() {
  const session = await getCurrentSession();
  const canViewAdmin = hasPermission(
    session?.user?.permissions,
    PERMISSIONS.DASHBOARD_VIEW
  );

  return (
    <header className="site-header">
      <div className="container header-inner">
        <Link href="/" className="brand" aria-label={`${siteConfig.name} home`}>
          <span className="brand-mark">
            <ShieldIcon />
          </span>
          <span>
            <strong>{siteConfig.name}</strong>
            <small>Community Portal</small>
          </span>
        </Link>

        <nav className="main-nav" aria-label="Main navigation">
          <Link href="/rules">Rules</Link>
          <Link href="/applications">Applications</Link>
          {session?.user && <Link href="/my-applications">My Applications</Link>}
          {canViewAdmin && <Link href="/admin">Admin</Link>}
        </nav>

        <div className="header-actions">
          {session?.user ? (
            <>
              <div className="user-chip">
                <span>{session.user.name || "Member"}</span>
                <small>{session.user.role ? roleLabel(session.user.role) : "Member"}</small>
              </div>
              <LogoutButton />
            </>
          ) : (
            <LoginButton compact />
          )}
        </div>
      </div>
    </header>
  );
}
