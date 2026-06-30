# FreeWorld RP Website

A Vercel-ready community portal for a FiveM server.

## Included

- Discord OAuth login
- Configured owner Discord IDs become **Website Developer**
- Website Developers bypass every permission check
- Public rules organized by category
- Configurable application types and dynamic form fields
- Staff, law enforcement, EMS, and business starter applications
- Member application history and status tracking
- Admin review queue with statuses and public review notes
- Open/close application forms
- Rule management
- User roles and exact permission overrides
- Administrative audit log
- Responsive dark-blue FreeWorld-style design
- PostgreSQL + Prisma
- Vercel and GitHub-ready project structure

## Requirements

- Node.js 20.9 or newer
- PostgreSQL database
- Discord application
- Vercel account for production hosting

## 1. Install

```bash
npm install
cp .env.example .env.local
```

Fill in every required value in `.env.local`.

## 2. Create the Discord OAuth application

1. Open the Discord Developer Portal.
2. Create an application.
3. Open **OAuth2**.
4. Add this local redirect:

```text
http://localhost:3000/api/auth/callback/discord
```

5. Add the production redirect after the Vercel domain is known:

```text
https://YOUR-DOMAIN.vercel.app/api/auth/callback/discord
```

6. Copy the Client ID and Client Secret into:

```env
DISCORD_CLIENT_ID=""
DISCORD_CLIENT_SECRET=""
```

Only the `identify` scope is requested.

## 3. Configure website developers

Add owner Discord IDs as a comma-separated list:

```env
OWNER_DISCORD_IDS="123456789012345678,987654321098765432"
```

Any matching account is always shown as **Website Developer** and receives all permissions. Database roles and permission overrides cannot remove this access.

To copy a Discord ID, enable Developer Mode in Discord, right-click the user, and select **Copy User ID**.

## 4. Create the database

Create PostgreSQL through Prisma Postgres, Neon, Supabase, or another hosted provider. Add its connection string:

```env
DATABASE_URL="postgresql://..."
```

Then run:

```bash
npm run db:push
npm run db:seed
```

## 5. Start locally

```bash
npm run dev
```

Open `http://localhost:3000`.

## 6. Push to GitHub

```bash
git init
git add .
git commit -m "Initial FreeWorld website"
git branch -M main
git remote add origin https://github.com/YOUR-NAME/YOUR-REPO.git
git push -u origin main
```

## 7. Deploy to Vercel

1. Import the GitHub repository into Vercel.
2. Add all variables from `.env.example` under Project Settings → Environment Variables.
3. Use a hosted PostgreSQL integration or add `DATABASE_URL` manually.
4. Deploy.
5. Add the Vercel production callback URL to the Discord Developer Portal.
6. Set `NEXTAUTH_URL` to the final production URL.
7. Redeploy after changing environment variables.

The build command is already configured:

```text
npm run build
```

For future schema migrations in production, use:

```bash
npm run db:deploy
```

## Application field configuration

Application forms are stored in `ApplicationType.fields` as JSON. The seed file contains working examples:

```ts
{
  id: "experience",
  label: "Previous experience",
  type: "textarea",
  required: true,
  minLength: 100,
  maxLength: 2000
}
```

Supported field types:

- `text`
- `textarea`
- `number`
- `select`
- `checkbox`

A `select` field uses:

```ts
options: ["Option One", "Option Two"]
```

Edit `prisma/seed.ts` before the first seed, or add an application-form editor to the admin panel later.

## Permission system

Available permissions:

- `dashboard.view`
- `applications.view`
- `applications.review`
- `applications.manage`
- `rules.manage`
- `users.view`
- `users.manage`
- `settings.manage`
- `audit.view`

Roles provide a default permission set. User-level force-allow and force-deny overrides are managed from the admin user page. Website Developers always receive all permissions.

## Important production notes

- Never commit `.env` or `.env.local`.
- Use Vercel environment variables for secrets.
- Set a strong `NEXTAUTH_SECRET`.
- Run the database seed once, not on every deployment.
- Add the correct Discord callback URL for every domain used.
- Changing Vercel environment variables requires a new deployment.
