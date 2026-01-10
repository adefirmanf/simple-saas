# LinkShort - SaaS URL Shortener

A modern, production-ready URL shortener built with Next.js 14, TypeScript, and Tailwind CSS. Features authentication, a beautiful dashboard, click tracking, analytics, and Stripe-powered subscriptions.

## Features

- 🔐 **Authentication** - Secure signup/login with NextAuth.js
- 📊 **Dashboard** - Clean SaaS UI with sidebar navigation
- 🔗 **URL Shortening** - Create short, memorable links instantly
- 📋 **Copy to Clipboard** - One-click URL copying
- 📈 **Click Tracking** - Real-time analytics for every link
- 🗑️ **URL Management** - Easy deletion and organization
- 💳 **Stripe Payments** - Subscription management with Stripe Checkout
- 💰 **Pricing Tiers** - Free, Pro, and Business plans
- 🎨 **Modern UI** - Built with Tailwind CSS and shadcn/ui
- ⚡ **Server Actions** - Fast, type-safe mutations
- 🛡️ **Type Safety** - Full TypeScript coverage with Zod validation

## Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Authentication:** NextAuth.js v5
- **Payments:** Stripe
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
│   │   ├── login/              # Login page
│   │   └── signup/             # Signup page
│   ├── dashboard/              # Protected dashboard
│   │   ├── urls/               # URL management
│   │   ├── pricing/            # Pricing & subscription page
│   │   └── page.tsx            # Dashboard home
│   ├── api/
│   │   ├── auth/               # NextAuth API routes
│   │   └── webhooks/stripe/    # Stripe webhook handler
│   └── [shortCode]/            # Dynamic redirect route
├── lib/
│   ├── prisma.ts               # Prisma client
│   ├── stripe.ts               # Stripe configuration
│   └── utils.ts                # Utility functions
├── prisma/
│   └── schema.prisma           # Database schema
├── docs/                       # Architecture documentation
│   ├── README.md               # Documentation guide
│   └── DIAGRAMS.md             # Visual diagrams
├── auth.ts                     # NextAuth configuration
├── middleware.ts               # Route protection
└── ARCHITECTURE.md             # Complete architecture docs
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

### Payments & Subscriptions (Stripe)
- Stripe Checkout integration for subscriptions
- Three pricing tiers: Free, Pro ($9.99/mo), and Business ($29.99/mo)
- Customer portal for managing subscriptions
- Webhook handlers for automated subscription updates
- Sandbox mode for testing with test cards

## Stripe Setup

This application uses Stripe for payment processing in sandbox/test mode.

### 1. Get your Stripe API keys

1. Create a [Stripe account](https://dashboard.stripe.com/register)
2. Go to [API Keys](https://dashboard.stripe.com/test/apikeys) in test mode
3. Copy your **Publishable key** and **Secret key**

### 2. Create Stripe Products and Prices

1. Go to [Products](https://dashboard.stripe.com/test/products) in the Stripe Dashboard
2. Create two products:
   - **Pro Plan**: Create a recurring price of $9.99/month
   - **Business Plan**: Create a recurring price of $29.99/month
3. Copy the Price IDs (they start with `price_`)

### 3. Configure Environment Variables

Update your `.env` file with your Stripe credentials:

```env
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_PRO_PRICE_ID=price_your_pro_price_id
STRIPE_BUSINESS_PRICE_ID=price_your_business_price_id
```

### 4. Set up Stripe Webhooks (for production)

1. Go to [Webhooks](https://dashboard.stripe.com/test/webhooks) in the Stripe Dashboard
2. Click "Add endpoint"
3. Enter your webhook URL: `https://yourdomain.com/api/webhooks/stripe`
4. Select the following events to listen to:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
5. Copy the webhook signing secret and add to `.env`:
   ```env
   STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
   ```

### 5. Testing Payments

Use Stripe's test card numbers in sandbox mode:
- Card number: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

More test cards: [Stripe Testing Documentation](https://stripe.com/docs/testing)

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
