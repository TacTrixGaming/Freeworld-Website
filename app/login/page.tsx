import type { Metadata } from "next";
import { LoginButton } from "@/components/auth-button";
import { DiscordIcon, ShieldIcon } from "@/components/icons";

export const metadata: Metadata = {
  title: "Sign In"
};

export default function LoginPage() {
  return (
    <section className="section auth-section">
      <div className="container narrow">
        <div className="auth-card">
          <span className="auth-icon"><DiscordIcon /></span>
          <span className="eyebrow plain">Secure member access</span>
          <h1>Sign in with Discord</h1>
          <p>
            Your Discord account connects applications to the correct player
            and lets staff contact you about decisions or interviews.
          </p>
          <LoginButton />
          <div className="security-note">
            <ShieldIcon />
            <span>We request only your basic Discord identity.</span>
          </div>
        </div>
      </div>
    </section>
  );
}
