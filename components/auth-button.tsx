"use client";

import { signIn, signOut } from "next-auth/react";
import { DiscordIcon } from "@/components/icons";

export function LoginButton({ compact = false }: { compact?: boolean }) {
  return (
    <button
      type="button"
      className={compact ? "button button-small" : "button"}
      onClick={() => signIn("discord", { callbackUrl: "/applications" })}
    >
      <DiscordIcon className="button-icon" />
      Sign in with Discord
    </button>
  );
}

export function LogoutButton() {
  return (
    <button
      type="button"
      className="button button-ghost button-small"
      onClick={() => signOut({ callbackUrl: "/" })}
    >
      Sign out
    </button>
  );
}
