## PetSoft

Welcome to PetSoft! This application is a comprehensive virtual pet daycare management service, designed to provide pet caretakers with robust management tools. Whether you're running your own pet daycare or just starting out, a PetSoft lifetime membership grants you access to an array of powerful features:

- **List Pets Under Your Care**: Easily manage and organize all pets currently in your daycare.
- **Check-In New Pets**: Seamlessly check in new arrivals and update their status.
- **Check-Out Picked-Up Pets**: Quickly check out pets when they are picked up by their owners.
- **Individual Pet Details and Notes**: Maintain detailed records and notes for each pet, ensuring personalized care.

Join PetSoft today and elevate your pet daycare management experience!

## Tech Stack

- **Next.js**: The React framework used for building the frontend and server-side rendering.
- **Tailwind CSS**: CSS framework for rapidly building user interfaces.
- **Stripe**: Integrated for secure payment processing and managing purchases (Test Mode).
- **Prisma/Postgres**: Prisma as the ORM for interacting with the PostgreSQL database, used for storing event data and other related information.
- **Vercel**: The platform used for deploying the web application.

## Getting Started

Before you begin, ensure you have the latest version of Node.js installed. This project uses Node.js 20.x or later.

### Documentation

For more detailed information about this application, please review the following documents:

- [Components Structure](/docs/components.md): An overview of the structure and organization of application components.
- [Stripe Payments](/docs/payment.md): Detailed information on how Stripe is integrated for payment processing and managing subscriptions.
- [Local Database](/docs/prisma-sqlite.md): Instructions and guidelines for setting up and managing the local database using Prisma with SQLite.
- [Production Database](/docs/prisma-postgres.md): Instructions and guidelines for deploying using Prisma with Postgres.

### Installation

1. Clone the repository

   ```sh
   git clone git@github.com:vmalchik/petsoft.git
   cd petsoft
   ```

2. Install dependencies

   ```sh
   npm install
   # or
   yarn install
   ```

3. Setup with [Postgres or SQLite](/docs/prisma-sqlite.md)

### Running the Application

To start the development server, run:

```sh
npm run dev
# or
yarn dev
```

Open your browser and navigate to http://localhost:3000/ to see the application in action.

### Building for Production

```sh
npm run build
# or
yarn build
```
