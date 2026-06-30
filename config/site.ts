function normalizeUrl(value: string) {
  return value.replace(/\/$/, "");
}

export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "FreeWorld RP",
  tagline:
    process.env.NEXT_PUBLIC_SITE_TAGLINE ||
    "Serious roleplay. Player-driven stories.",
  description:
    process.env.NEXT_PUBLIC_SITE_DESCRIPTION ||
    "A serious FiveM roleplay community built around player-driven stories, detailed systems, and meaningful progression.",
  baseUrl: normalizeUrl(
    process.env.NEXT_PUBLIC_SITE_URL ||
      process.env.NEXTAUTH_URL ||
      "http://localhost:3000"
  ),
  discordInvite:
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/yourinvite",
  connectUrl:
    process.env.NEXT_PUBLIC_SERVER_CONNECT || "https://cfx.re/join/replace",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
  ownerDiscordIds: (process.env.OWNER_DISCORD_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
} as const;
