import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { siteConfig } from "@/config/site";
import {
  ArrowIcon,
  BookIcon,
  ClipboardIcon,
  DiscordIcon,
  ShieldIcon,
  UsersIcon
} from "@/components/icons";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [openApplications, ruleCount] = await Promise.all([
    prisma.applicationType.count({ where: { isOpen: true } }).catch(() => 0),
    prisma.rule.count({ where: { enabled: true } }).catch(() => 0)
  ]);

  return (
    <>
      <section className="hero">
        <div className="hero-grid-overlay" />
        <div className="container hero-content">
          <div className="eyebrow">
            <span className="live-dot" />
            Serious roleplay. Player-driven stories.
          </div>
          <h1>
            Your story starts in <span>FreeWorld.</span>
          </h1>
          <p>
            A detailed FiveM community built around meaningful progression,
            realistic systems, and roleplay that gives every player room to
            create something memorable.
          </p>
          <div className="hero-actions">
            <a className="button" href={siteConfig.connectUrl}>
              Join the server <ArrowIcon className="button-icon" />
            </a>
            <a
              className="button button-secondary"
              href={siteConfig.discordInvite}
              target="_blank"
              rel="noreferrer"
            >
              <DiscordIcon className="button-icon" />
              Join Discord
            </a>
          </div>

          <div className="hero-metrics">
            <div>
              <strong>{openApplications}</strong>
              <span>Open applications</span>
            </div>
            <div>
              <strong>{ruleCount}</strong>
              <span>Published rules</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Community access</span>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow plain">Community portal</span>
              <h2>Everything you need in one place.</h2>
            </div>
            <p>
              Read the standards, submit an application, and track your
              progress through one Discord-connected account.
            </p>
          </div>

          <div className="feature-grid">
            <Link href="/rules" className="feature-card">
              <span className="feature-icon"><BookIcon /></span>
              <h3>Server Rules</h3>
              <p>Clear, organized rules that are easy to browse and search.</p>
              <span className="card-link">Read the rules <ArrowIcon /></span>
            </Link>
            <Link href="/applications" className="feature-card">
              <span className="feature-icon"><ClipboardIcon /></span>
              <h3>Applications</h3>
              <p>Apply for departments, staff, businesses, and other roles.</p>
              <span className="card-link">View applications <ArrowIcon /></span>
            </Link>
            <Link href="/my-applications" className="feature-card">
              <span className="feature-icon"><UsersIcon /></span>
              <h3>Application Status</h3>
              <p>See review progress, decisions, and staff notes in one place.</p>
              <span className="card-link">Check status <ArrowIcon /></span>
            </Link>
          </div>
        </div>
      </section>

      <section className="section section-dark">
        <div className="container split-panel">
          <div>
            <span className="eyebrow plain">Built for serious RP</span>
            <h2>A city shaped by its players.</h2>
            <p>
              FreeWorld focuses on detailed systems without losing sight of the
              people using them. Every job, department, business, and storyline
              should create opportunities for others.
            </p>
            <Link className="button button-secondary" href="/applications">
              Find your place <ArrowIcon className="button-icon" />
            </Link>
          </div>
          <div className="principles">
            <div>
              <ShieldIcon />
              <span>
                <strong>Fair systems</strong>
                Consistent rules, staff accountability, and transparent reviews.
              </span>
            </div>
            <div>
              <UsersIcon />
              <span>
                <strong>Community first</strong>
                Player feedback and roleplay value guide development.
              </span>
            </div>
            <div>
              <ClipboardIcon />
              <span>
                <strong>Clear progression</strong>
                Applications and decisions are tracked from submission to outcome.
              </span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
