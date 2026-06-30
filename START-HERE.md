# START HERE — FreeWorld RP Website

This package is prepared for GitHub + Vercel + PostgreSQL + Discord OAuth.

## What is already configured

- Next.js 16 application
- Node.js pinned to 22.x
- Public npm registry lockfile
- Vercel install and build commands
- PostgreSQL Prisma schema
- Committed initial database migration
- Automatic migration and starter-data seed during deployment
- Discord OAuth route
- Configured owner Discord IDs receive permanent **Website Developer** access
- Application submission, status tracking, review notes, rules, users, permissions, and audit logs

## What you must fill in

There are only two places to customize:

1. `.env.example` — deployment values, URLs, Discord details, and secrets
2. `config/portal-content.ts` — starter applications, questions, and starter rules

Do not put real secrets into source files or commit them to GitHub.

---

## 1. Customize applications and starter rules

Open:

```text
config/portal-content.ts
```

Edit the entries in:

```ts
starterApplications
starterRuleCategories
```

Every application needs a unique lowercase `slug`, for example:

```ts
slug: "police"
```

Supported question types:

```text
text
textarea
number
select
checkbox
```

The starter rulebook is inserted only when the database has no rule categories. After deployment, rules can be managed in the admin dashboard.

Application definitions are updated by slug on every deployment. Opening and closing an application from the admin dashboard is preserved.

---

## 2. Create a Discord application

In the Discord Developer Portal:

1. Create a new application.
2. Open **OAuth2**.
3. Copy the Client ID.
4. Reset and copy the Client Secret.
5. Add these Redirect URLs:

Local testing:

```text
http://localhost:3000/api/auth/callback/discord
```

Production:

```text
https://YOUR-VERCEL-DOMAIN.vercel.app/api/auth/callback/discord
```

Custom domain, when used:

```text
https://YOUR-DOMAIN.com/api/auth/callback/discord
```

The redirect must match exactly and must not end with an extra slash.

---

## 3. Create a PostgreSQL database

Recommended options:

- Prisma Postgres through the Vercel Marketplace
- Neon
- Supabase PostgreSQL

You need a connection string named:

```text
DATABASE_URL
```

Example format:

```text
postgresql://USERNAME:PASSWORD@HOST:5432/DATABASE?sslmode=require
```

Never post or commit the real value.

---

## 4. Generate the authentication secret

Run:

```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

Save the output as `NEXTAUTH_SECRET` in Vercel.

---

## 5. Get owner Discord user IDs

In Discord:

1. User Settings
2. Advanced
3. Enable Developer Mode
4. Right-click the owner account
5. Copy User ID

Use comma-separated IDs:

```text
123456789012345678,987654321098765432
```

Accounts listed in `OWNER_DISCORD_IDS` are always labeled **Website Developer**, receive every permission, and cannot be downgraded from the dashboard.

---

## 6. Upload this project to GitHub

Run inside the folder containing `package.json`:

```powershell
git init
git add .
git commit -m "Initial website deployment"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPOSITORY.git
git push -u origin main
```

The `.gitignore` already excludes `.env`, `.env.local`, `node_modules`, and Vercel files.

---

## 7. Create the Vercel project

1. Import the GitHub repository into Vercel.
2. Framework preset: **Next.js**.
3. Root Directory: the folder containing `package.json`.
4. Connect your PostgreSQL database.
5. Add all environment variables from `.env.example`.
6. Deploy.

The repository already tells Vercel to use:

```text
Node.js: 22.x
Install: npm ci --no-audit --no-fund
Build: npm run vercel-build
```

The production build automatically runs:

```text
configuration validation
Prisma client generation
prisma migrate deploy
prisma db seed
next build
```

---

## 8. Required Vercel environment variables

Add these in:

```text
Vercel Project → Settings → Environment Variables
```

```text
DATABASE_URL
NEXTAUTH_SECRET
NEXTAUTH_URL
DISCORD_CLIENT_ID
DISCORD_CLIENT_SECRET
OWNER_DISCORD_IDS
NEXT_PUBLIC_SITE_NAME
NEXT_PUBLIC_SITE_TAGLINE
NEXT_PUBLIC_SITE_DESCRIPTION
NEXT_PUBLIC_SITE_URL
NEXT_PUBLIC_DISCORD_INVITE
NEXT_PUBLIC_SERVER_CONNECT
NEXT_PUBLIC_SUPPORT_EMAIL
```

For production, both URL values should normally match:

```text
NEXTAUTH_URL=https://your-project.vercel.app
NEXT_PUBLIC_SITE_URL=https://your-project.vercel.app
```

Do not include surrounding quotation marks when entering values in the Vercel dashboard.

Select at least **Production** for every variable. Selecting Preview and Development as well makes preview deployments work.

---

## 9. Local testing

Copy `.env.example` to `.env`:

```powershell
Copy-Item .env.example .env
```

Fill in the values, then run:

```powershell
npm ci
npm run db:deploy
npm run db:seed
npm run dev
```

Open:

```text
http://localhost:3000
```

Test the health endpoint:

```text
http://localhost:3000/api/health
```

A successful response is:

```json
{"status":"ok","database":"connected"}
```

---

## 10. First owner login

After deployment:

1. Open the website.
2. Sign in with Discord using an ID listed in `OWNER_DISCORD_IDS`.
3. Open `/admin`.
4. Confirm the account is labeled **Website Developer**.

The first login creates the user record automatically.

---

## Common deployment errors

### `npm error Exit handler never called`

This package fixes the previous causes by using Node 22 and a public-registry lockfile. Do not replace the included `package-lock.json` with the old one.

### Missing environment variable

The build intentionally stops with a clear list. Add the missing value in Vercel and redeploy without the old build cache.

### Discord redirects to an error page

Verify that the exact production callback URL exists in Discord OAuth2 Redirects:

```text
https://YOUR-DOMAIN/api/auth/callback/discord
```

Also verify that `NEXTAUTH_URL` matches the same domain.

### Prisma cannot connect

Check `DATABASE_URL`, SSL requirements, and whether the database allows external/serverless connections.

### Website loads but owner cannot access `/admin`

Confirm that `OWNER_DISCORD_IDS` contains the Discord **user ID**, not a username, role ID, server ID, or application ID.
