## Prisma + SQLite (Local Development)

This guide will walk you through setting up Prisma (Object-Relational Mapping) with an SQLite database for local development, along with the necessary commands for development, production, and seeding.

### Initialize Prisma with SQLite Database

To initialize a new Prisma project with SQLite as the data source, run:

```sh
npx prisma init --datasource-provider sqlite
```

This command sets up the initial Prisma configuration for using an SQLite database.

### Forcefully Update Database (for Rapid Prototyping)

During development, you might need to apply changes to the database schema quickly. Use the following command to push your schema changes to the database forcefully:

```sh
npx prisma db push
```

_Note: This command is useful for rapid prototyping, but it should be used with caution as it may result in data loss._

### Production: Migrate Database (Safe Updates for Production)

For production environments, it is crucial to migrate the database safely, ensuring all changes are preserved. Use the following command to generate and apply migration scripts:

```sh
npx prisma db migrate
```

This command creates migration files based on your schema changes and applies them to the database, ensuring a safe and controlled update process.

### Seed Database

To seed your database with initial data, run:

```sh
npx prisma db seed
```

_Note: This depends on having a prisma.seed script defined in your package.json._

### Prisma Studio

Prisma Studio provides a graphical interface to interact with your database. To launch Prisma Studio, run:

```sh
npx prisma studio
```

**Studio URL**: http://localhost:5555

### NextJS + Prisma Client

When using Prisma Client in a Next.js project, it is important to follow best practices to avoid creating multiple database connections. Follow the guidelines provided in the Next.js documentation:

**Reference**: [Next.js Docs - Prisma Client Best Practices](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/nextjs-prisma-client-dev-practices)

By adhering to these practices, you can ensure efficient and effective database management within your Next.js applications.
