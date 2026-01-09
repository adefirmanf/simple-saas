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
```

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

## Architecture & Documentation

📐 **[View Complete Architecture Documentation](./ARCHITECTURE.md)**  
📊 **[View Visual Diagrams](./docs/DIAGRAMS.md)**

Comprehensive architecture diagrams and design documentation including:
- System architecture overview
- Database schema (ERD)
- Authentication & authorization flows
- URL shortening flow with click tracking
- Component architecture
- Technology stack visualization
- Deployment architecture
- Security layers

Perfect for understanding the system design or portfolio presentations.

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
├── docs/                  # Architecture documentation
│   ├── README.md          # Documentation guide
│   └── DIAGRAMS.md        # Visual diagrams
├── auth.ts                # NextAuth configuration
├── middleware.ts          # Route protection
└── ARCHITECTURE.md        # Complete architecture docs
```

## Building for Production

```bash
npm run build
npm start
```

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
