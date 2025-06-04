**Demo Dashboard Documentation v0.1.0**

***

# Demo Dashboard

This is a dashboard application built with [Next.js](https://nextjs.org/) to monitor and display data from sensor devices. The application allows users to view real-time data and historical data in an intuitive way.

## Key Features

- **Device Selection**: Allows users to select a specific device to view its data.
- **Latest Data Display**: Shows the most recent update from the selected device, including the data capture time.
- **Historical Data Chart**: Presents historical data (Temperature, Humidity, Resistance) as a line chart, making it easy to track trends.
- **Historical Data Table**: Provides a detailed table listing the recorded data history.
- **Responsive User Interface**: Designed to work well on various screen sizes.

## Folder Structure
```plaintext
/demo-dashboard/
├── .gitignore               # Specifies intentionally untracked files that Git should ignore
├── README.md                # This file, providing an overview of the project
├── capacitor.config.ts      # Configuration for Capacitor (if used for native mobile apps)
├── components.json          # Configuration for UI components (e.g., shadcn/ui)
├── eslint.config.mjs        # ESLint configuration for code linting
├── next.config.ts           # Next.js configuration file
├── ormconfig.ts             # Configuration for TypeORM (if used)
├── package-lock.json        # Records the exact versions of dependencies
├── package.json             # Lists project dependencies and scripts
├── patches/                 # Directory for patch files (e.g., for patch-package )
│   └── lodash+3.10.1.patch
├── postcss.config.mjs       # PostCSS configuration for CSS transformations
├── public/                  # Static assets that are served directly
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   ├── window.svg
│   └── workers/             # Directory for web workers
│       └── autoUpdateWorker.js
├── src/                     # Main source code directory
│   ├── app/                 # Next.js App Router directory
│   │   ├── api/             # API route handlers
│   │   ├── favicon.ico      # Favicon for the application
│   │   ├── globals.css      # Global CSS styles
│   │   ├── layout.tsx       # Root layout component
│   │   └── page.tsx         # Main page component for the root route
│   ├── components/          # Reusable UI components
│   │   └── ui/              # Sub-directory for UI-specific components (e.g., from a library)
│   ├── entity/              # Database entity definitions (e.g., for TypeORM)
│   │   └── Corrosion.ts
│   ├── lib/                 # Utility functions and libraries
│   │   └── utils.ts
│   ├── types/               # TypeScript type definitions
│   │   └── type.ts
│   └── utils/               # General utility functions
│       └── utils.ts
└── tsconfig.json            # TypeScript configuration file
```

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
To build the project for production:
```bash
npm run build
# or
yarn build
# or
pnpm build
# or
bun build
```

## Environment Variables
To run this application, you need to set up the following environment variables in a .env file at the root of your project:

```plaintext
DB_HOST=your_database_host
DB_USER=your_database_user
DB_PASSWORD=your_database_password
DB_NAME=your_database_name
```
These variables are crucial for the application to connect to the database and function correctly.
