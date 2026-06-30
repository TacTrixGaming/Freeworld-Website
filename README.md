# FreeWorld RP Community Website

A production-oriented FiveM community portal built with Next.js, Discord OAuth, PostgreSQL, Prisma, and Vercel.

## Features

- Discord sign-in
- Configurable owner Discord IDs
- Permanent Website Developer full-access bypass for configured owners
- Configurable application forms
- Player application history and withdrawal
- Application review workflow and staff notes
- Public categorized rules
- Admin dashboard
- Application open/close controls
- Rule management
- User roles and permission overrides
- Audit log
- Database health endpoint
- Vercel-ready install, migration, seed, and build workflow

## Begin setup

Read [`START-HERE.md`](./START-HERE.md).

Edit starter applications and rules in:

```text
config/portal-content.ts
```

Copy environment variable names from:

```text
VERCEL-ENVIRONMENT-VARIABLES.txt
```

## Main commands

```bash
npm ci
npm run dev
npm run check
npm run build
npm run db:deploy
npm run db:seed
npm run db:studio
```

## Production behavior

`npm run build` validates required configuration, generates Prisma Client, applies committed migrations, safely seeds starter content, and builds Next.js.

## Security

Never commit `.env`, `.env.local`, Discord client secrets, database URLs, or authentication secrets. Configured owner IDs are protected from dashboard changes.
