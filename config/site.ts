export const siteConfig = {
  name: process.env.NEXT_PUBLIC_SITE_NAME || "FreeWorld RP",
  description:
    "A serious roleplay community built around player-driven stories, detailed systems, and meaningful progression.",
  discordInvite:
    process.env.NEXT_PUBLIC_DISCORD_INVITE || "https://discord.gg/yourinvite",
  connectUrl:
    process.env.NEXT_PUBLIC_SERVER_CONNECT || "cfx.re/join/replace",
  supportEmail:
    process.env.NEXT_PUBLIC_SUPPORT_EMAIL || "support@example.com",
  ownerDiscordIds: (process.env.OWNER_DISCORD_IDS || "")
    .split(",")
    .map((id) => id.trim())
    .filter(Boolean)
} as const;
