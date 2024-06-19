## Architecture

<image src="docs/component-snapshot-1.png" width="800px" height="auto"/>
<image src="docs/payment.png" width="800px" height="auto"/>

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Prisma + SQLite

### Initialize Prisma with SQLite database (for local development)

```sh
npx prisma init --datasource-provider sqlite
```

### Development: Forcefully update database (for rapid prototyping)

```sh
npx prisma db push
```

### Production: Migrate database (safe updates for production to retain all database changes)

```sh
npx prisma db migrate
```

### Seed Database

```sh
npx prisma db seed
```

Note: Depends on `package.json` having `prisma.seed` script.

### Prisma Studio

```sh
npx prisma studio
```

**Studio**: http://localhost:5555

### NextJS + Prisma Client

Follow NextJS documentation best practice on how to use Prisma client in NextJS to avoid creation of many connections to database

**Ref**: [NextJS Docs](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)

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

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
