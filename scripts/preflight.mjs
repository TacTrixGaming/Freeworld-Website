const required = [
  "DATABASE_URL",
  "NEXTAUTH_SECRET",
  "NEXTAUTH_URL",
  "DISCORD_CLIENT_ID",
  "DISCORD_CLIENT_SECRET",
  "OWNER_DISCORD_IDS",
  "NEXT_PUBLIC_SITE_NAME",
  "NEXT_PUBLIC_SITE_TAGLINE",
  "NEXT_PUBLIC_SITE_DESCRIPTION",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DISCORD_INVITE",
  "NEXT_PUBLIC_SERVER_CONNECT",
  "NEXT_PUBLIC_SUPPORT_EMAIL"
];

const placeholderPatterns = [
  /PASTE_/i,
  /replace/i,
  /yourinvite/i,
  /USER:PASSWORD/i,
  /example\.com/i
];

const problems = [];

for (const name of required) {
  const value = process.env[name]?.trim();
  if (!value) {
    problems.push(`${name} is missing`);
    continue;
  }

  if (placeholderPatterns.some((pattern) => pattern.test(value))) {
    problems.push(`${name} still contains a placeholder value`);
  }
}

for (const name of [
  "NEXTAUTH_URL",
  "NEXT_PUBLIC_SITE_URL",
  "NEXT_PUBLIC_DISCORD_INVITE",
  "NEXT_PUBLIC_SERVER_CONNECT"
]) {
  const value = process.env[name]?.trim();
  if (!value) continue;
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) {
      problems.push(`${name} must use http:// or https://`);
    }
  } catch {
    problems.push(`${name} is not a valid URL`);
  }
}


const authUrl = (process.env.NEXTAUTH_URL || "").replace(/\/$/, "");
const publicUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
if (authUrl && publicUrl && authUrl !== publicUrl) {
  problems.push("NEXTAUTH_URL and NEXT_PUBLIC_SITE_URL must use the same production origin");
}

const databaseUrl = process.env.DATABASE_URL?.trim() || "";
if (databaseUrl && !/^postgres(ql)?:\/\//i.test(databaseUrl)) {
  problems.push("DATABASE_URL must be a PostgreSQL connection string");
}

const supportEmail = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim() || "";
if (supportEmail && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(supportEmail)) {
  problems.push("NEXT_PUBLIC_SUPPORT_EMAIL must be a valid email address");
}

const secret = process.env.NEXTAUTH_SECRET?.trim() || "";
if (secret && secret.length < 32) {
  problems.push("NEXTAUTH_SECRET must be at least 32 characters");
}

const clientId = process.env.DISCORD_CLIENT_ID?.trim() || "";
if (clientId && !/^\d{15,25}$/.test(clientId)) {
  problems.push("DISCORD_CLIENT_ID must be a numeric Discord application ID");
}

const ownerIds = (process.env.OWNER_DISCORD_IDS || "")
  .split(",")
  .map((id) => id.trim())
  .filter(Boolean);

if (ownerIds.length === 0) {
  problems.push("OWNER_DISCORD_IDS must contain at least one Discord user ID");
}

for (const id of ownerIds) {
  if (!/^\d{15,25}$/.test(id)) {
    problems.push(`OWNER_DISCORD_IDS contains an invalid Discord user ID: ${id}`);
  }
}

if (problems.length > 0) {
  console.error("\nDeployment configuration is incomplete:\n");
  for (const problem of problems) {
    console.error(`  - ${problem}`);
  }
  console.error("\nSee START-HERE.md and .env.example.\n");
  process.exit(1);
}

console.log("Deployment configuration check passed.");
