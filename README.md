# LinkShort - SaaS URL Shortener

A modern, production-ready URL shortener built with Next.js 14, TypeScript, and Tailwind CSS. Features authentication, a beautiful dashboard, click tracking, and analytics.

## Features

- 🔐 **Authentication** - Secure signup/login with NextAuth.js
- 📊 **Dashboard** - Clean SaaS UI with sidebar navigation
- 🔗 **URL Shortening** - Create short, memorable links instantly
- 📋 **Copy to Clipboard** - One-click URL copying
- 📈 **Click Tracking** - Real-time analytics for every link
- 🗑️ **URL Management** - Easy deletion and organization
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui
- ⚡ **Server Actions** - Fast, type-safe mutations
- 🛡️ **Type Safety** - Full TypeScript coverage with Zod validation

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** NextAuth.js v5
- **Database:** SQLite with Prisma ORM
- **Validation:** Zod
- **Icons:** Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/adefirmanf/simple-saas.git
cd simple-saas
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

Edit `.env` and update the following:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-change-this-in-production
NEXT_PUBLIC_APP_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/linkshort?schema=public
```

For local development, you can use PostgreSQL or modify the Prisma schema to use SQLite.

4. Set up the database:
```bash
npx prisma migrate dev
npx prisma generate
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Database Schema

The application uses three main models:

- **User** - Stores user accounts with hashed passwords
- **Url** - Stores shortened URLs with short codes
- **Click** - Tracks individual clicks with metadata

## Project Structure

```
├── app/
│   ├── (auth)/
│   │   ├── login/         # Login page
│   │   └── signup/        # Signup page
│   ├── dashboard/         # Protected dashboard
│   │   ├── urls/          # URL management
│   │   └── page.tsx       # Dashboard home
│   ├── [shortCode]/       # Dynamic redirect route
│   └── api/auth/          # NextAuth API routes
├── lib/
│   ├── prisma.ts          # Prisma client
│   └── utils.ts           # Utility functions
├── prisma/
│   └── schema.prisma      # Database schema
├── auth.ts                # NextAuth configuration
└── middleware.ts          # Route protection
```

## Building for Production

```bash
npm run build
npm start
```

## Deploying to Vercel

### Prerequisites
- A Vercel account (sign up at [vercel.com](https://vercel.com))
- A PostgreSQL database (recommended: [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) or [Neon](https://neon.tech))

### Deployment Steps

1. **Push your code to GitHub** (if not already done)

2. **Import the project in Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Vercel will auto-detect the Next.js framework

3. **Configure Environment Variables:**
   Add the following environment variables in Vercel project settings:
   ```
   NEXTAUTH_URL=https://your-app.vercel.app
   NEXTAUTH_SECRET=generate-a-secure-random-string
   NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
   DATABASE_URL=your-postgresql-connection-string
   ```

4. **Generate a secure NEXTAUTH_SECRET:**
   ```bash
   openssl rand -base64 32
   ```

5. **Set up your PostgreSQL database:**
   - If using Vercel Postgres, create a database in your Vercel project
   - Copy the connection string to `DATABASE_URL`
   - The format should be: `postgresql://user:password@host:5432/database?schema=public`

6. **Deploy:**
   - Click "Deploy" in Vercel
   - Vercel will build and deploy your app
   - The build process will run migrations automatically

### Post-Deployment

After deployment, you may need to run migrations manually if they didn't run during build:

```bash
# Install Vercel CLI
npm i -g vercel

# Pull environment variables
vercel env pull

# Run migrations
npx prisma migrate deploy
```

### Troubleshooting

- If the build fails, check the Vercel build logs
- Ensure all environment variables are set correctly
- Verify your PostgreSQL connection string is correct
- Check that your database is accessible from Vercel's servers

## Features in Detail

### Authentication
- Secure credential-based authentication
- Password hashing with bcrypt
- Protected routes with middleware
- Session management with NextAuth.js

### URL Shortening
- Generates 8-character short codes using nanoid
- Validates URLs with Zod
- Server-side mutations with Server Actions
- Automatic click tracking

### Dashboard
- Overview with total URLs and clicks
- Recent URLs list
- Full URL management interface
- Responsive sidebar navigation

### Click Tracking
- Captures user agent and referrer
- Real-time click counting
- Stored with timestamps for analytics

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
