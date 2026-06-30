function required(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `[configuration] Missing required environment variable: ${name}. ` +
        "Copy .env.example to .env.local for local development or add it in Vercel Project Settings."
    );
  }

  return value;
}

export const authEnv = {
  secret: required("NEXTAUTH_SECRET"),
  url: required("NEXTAUTH_URL"),
  discordClientId: required("DISCORD_CLIENT_ID"),
  discordClientSecret: required("DISCORD_CLIENT_SECRET")
};
