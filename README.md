This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

This project deploys on [Vercel](https://vercel.com) (no credit card required) connected to **Neon** for PostgreSQL:

1. Push your repository to GitHub.
2. Import the project into [Vercel](https://vercel.com).
3. Set your environment variables (`DATABASE_URL` pointing to your Neon branch, `AUTH_SECRET`, etc.).
4. Both Next.js and PHP serverless functions deploy with zero infrastructure bloat. Vercel can also be managed directly by AI agents using Composio's **Vercel MCP toolkit**.

---

## MWD site: notes on the latest changes

**Database update required (new columns and tables for photos, Telegram and timeline):**

```bash
npm run db:generate   # creates the migration from src/db/schema.ts
npm run db:migrate    # applies it to your DATABASE_URL
```

**Adding photos to the public portfolio:** sign in at `/admin`, open *Portfolio & photos*, click *Add project*,
upload the main photo and gallery photos, tick *Published*, save.

**Emails:** set `GMAIL_USER`, `GMAIL_APP_PASSWORD` and `ADMIN_NOTIFY_EMAIL`. Customer photos from the quote form are attached to both emails.

**Contact details** (email, phone, WhatsApp, Telegram, reply time promised in emails) all live in `src/lib/site.ts`.

**Telegram bot editor:** sign in at `/admin` and open *Telegram bot* to edit every message the bot sends, with a live preview.
This adds a `bot_messages` table, so run `npm run db:generate` then `npm run db:migrate` once after pulling this change.
Until the table exists the bot keeps working with its built-in text.
