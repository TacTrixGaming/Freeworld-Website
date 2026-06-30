import Link from "next/link";
import { siteConfig } from "@/config/site";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <strong>{siteConfig.name}</strong>
          <p>{siteConfig.description}</p>
        </div>
        <div>
          <strong>Portal</strong>
          <Link href="/rules">Rules</Link>
          <Link href="/applications">Applications</Link>
          <Link href="/my-applications">My Applications</Link>
        </div>
        <div>
          <strong>Community</strong>
          <a href={siteConfig.discordInvite} target="_blank" rel="noreferrer">
            Discord
          </a>
          <a href={`mailto:${siteConfig.supportEmail}`}>Support</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© {new Date().getFullYear()} {siteConfig.name}</span>
        <span>Built for the community.</span>
      </div>
    </footer>
  );
}
