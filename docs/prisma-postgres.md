## Prisma + Postgres (Production)

- `prod` branch contains code for production deployment into Vercel with Postgres storage
- `main` branch contains code for local deployment

## Vercel Storage: Postgres

### Setup

1. Create Vercel Storage with Postgres following [these instructions](https://www.prisma.io/docs/orm/more/development-environment/environment-variables/managing-env-files-and-setting-variables#manage-env-files-manually) with Postgres

2. Environment Variables:
   - Place sensitive content into .env.local
   - Prisma uses .env
3. Use [dotenv-cli](https://www.npmjs.com/package/dotenv-cli) to work with .env.local ([documentation](https://www.prisma.io/docs/orm/more/development-environment/environment-variables/managing-env-files-and-setting-variables#manage-env-files-manually))
   - Add Postgres secrets into Vercel linked project _Settings > Environment Variables_

## Add model

```prisma
// Example model:
model User {
  id             String   @id @default(cuid())
  email          String   @unique
  hashedPassword String
  hasAccess      Boolean  @default(false)
  pets           Pet[]
  createdAt      DateTime @default(now())
  updatedAt      DateTime @updatedAt
}
```

## Pushing Model to Database

Push the current Prisma schema to your database. It applies any changes made to your Prisma schema to the database schema, essentially syncing them.

- _Not safe. Not recommended in production._

```sh
dotenv -e .env.local -- npx prisma db push
```

## Viewing Data in Database

```sh
dotenv -e .env.local -- npx prisma studio
```

- This opens Prisma Studio: http://localhost:5555/

## Seed data into Database

1. Create `seed.ts` file with data to seed and a `main()` function perform the seeding.
2. Install `ts-node` package:

```sh
npm i ts-node
```

3. Update `package.json`

```json
"prisma": {
    "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
},
```

4. Seed the database

```sh
dotenv -e .env.local -- npx prisma db seed
```

### Production: Migrate Database (Safe Updates for Production)

For production environments, it is crucial to migrate the database safely, ensuring all changes are preserved. Use the following command to generate and apply migration scripts:

```sh
dotenv -e .env.local -- npx prisma migrate dev --name table-changes-description
dotenv -e .env.local -- npx prisma db migrate deploy
```

## Vercel Caching and Prisma

- Vercel caches dependencies until they change to enable faster builds but causes Prisma Client to become out of sync with database schema.
- Solution: Update package.json with [postinstall script](https://www.prisma.io/docs/orm/more/help-and-troubleshooting/help-articles/vercel-caching-issue)

## Usage of PrismaClient

- Use `db.ts` to create single instance of PrismaClient
- Use global PrismaClient to interact with database
