# Vercel Deployment Guide

This guide will walk you through deploying the LinkShort SaaS application to Vercel.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. A PostgreSQL database (recommended options below)
3. Your code pushed to a GitHub repository

## Step 1: Set Up a PostgreSQL Database

You have several options for PostgreSQL hosting:

### Option A: Vercel Postgres (Recommended)
1. Go to your Vercel dashboard
2. Navigate to the Storage tab
3. Click "Create Database"
4. Select "Postgres"
5. Follow the prompts to create your database
6. Copy the connection string (you'll need this for environment variables)

### Option B: Neon (Free Tier Available)
1. Go to [Neon.tech](https://neon.tech) and sign up
2. Create a new project
3. Copy the connection string from the dashboard

### Option C: Supabase (Free Tier Available)
1. Go to [Supabase.com](https://supabase.com) and sign up
2. Create a new project
3. Go to Settings > Database
4. Copy the connection string (use the "Direct Connection" string)

## Step 2: Import Your Project to Vercel

1. Log in to your [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New..." > "Project"
3. Import your GitHub repository
4. Vercel will automatically detect it's a Next.js project

## Step 3: Configure Environment Variables

Before deploying, add the following environment variables in the Vercel project settings:

### Required Environment Variables:

```bash
# NextAuth Configuration
NEXTAUTH_URL=https://your-app-name.vercel.app
NEXTAUTH_SECRET=<generate-a-secure-random-string>

# App URL
NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app

# Database
DATABASE_URL=<your-postgresql-connection-string>
```

### How to Set Environment Variables in Vercel:

1. In your Vercel project settings, go to "Settings" > "Environment Variables"
2. Add each variable with its value
3. Make sure to select all environments (Production, Preview, Development)

### Generate NEXTAUTH_SECRET:

Run this command in your terminal to generate a secure secret:

```bash
openssl rand -base64 32
```

Copy the output and use it as your `NEXTAUTH_SECRET`.

## Step 4: Deploy

1. After configuring environment variables, click "Deploy"
2. Vercel will:
   - Install dependencies
   - Run `prisma generate` (via postinstall script)
   - Run `prisma migrate deploy` (via build script)
   - Build your Next.js application
   - Deploy it to production

## Step 5: Verify Deployment

1. Once deployed, click on the deployment URL
2. Test the following:
   - Homepage loads correctly
   - Sign up functionality works
   - Login functionality works
   - URL shortening works
   - Short URLs redirect properly
   - Click tracking is working

## Troubleshooting

### Build Fails

**Error: "Can't reach database server"**
- Verify your `DATABASE_URL` is correct
- Ensure your database allows connections from Vercel's IP addresses
- For Vercel Postgres, make sure you're using the connection string for Prisma (not the direct connection)

**Error: "Migration failed"**
- Check that your database is empty or has the correct schema
- Ensure the database user has permission to create tables
- Try running migrations manually (see below)

### Running Migrations Manually

If migrations didn't run during build:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Pull environment variables
vercel env pull .env.production

# Run migrations
npx prisma migrate deploy --schema=./prisma/schema.prisma
```

### Environment Variables Not Working

- Make sure you've added variables to all environments (Production, Preview, Development)
- Redeploy after adding new environment variables
- Check for typos in variable names

### Database Connection Issues

- Verify the connection string format:
  ```
  postgresql://user:password@host:5432/database?schema=public
  ```
- For Vercel Postgres, use the connection pooler URL with `?pgbouncer=true`
- Ensure your database allows external connections

### NEXTAUTH_URL Issues

- Make sure `NEXTAUTH_URL` matches your actual deployment URL
- Don't include trailing slashes
- Update this value if you add a custom domain

## Custom Domain (Optional)

1. Go to your Vercel project settings
2. Navigate to "Domains"
3. Add your custom domain
4. Update your DNS records as instructed
5. Update `NEXTAUTH_URL` and `NEXT_PUBLIC_APP_URL` to use your custom domain
6. Redeploy the application

## Monitoring and Logs

- View deployment logs in the Vercel dashboard under "Deployments"
- Check runtime logs in the "Logs" tab
- Monitor performance in the "Analytics" tab (if enabled)

## Production Checklist

Before going live, ensure:

- [ ] All environment variables are set correctly
- [ ] `NEXTAUTH_SECRET` is a strong, random value
- [ ] Database migrations have run successfully
- [ ] Sign up and login work
- [ ] URL shortening and redirection work
- [ ] Click tracking is functioning
- [ ] No sensitive data is exposed in logs or errors
- [ ] Custom domain is configured (if applicable)
- [ ] SSL certificate is active (automatic with Vercel)

## Updating Your Application

To deploy updates:

1. Push changes to your GitHub repository
2. Vercel will automatically deploy the changes
3. Monitor the deployment in the Vercel dashboard
4. If you add new migrations, they'll run automatically during build

## Support

If you encounter issues:

1. Check the [Vercel Documentation](https://vercel.com/docs)
2. Review [Prisma's Vercel Deployment Guide](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
3. Check the [Next.js Deployment Documentation](https://nextjs.org/docs/deployment)

## Cost Considerations

- Vercel: Free tier available, paid plans for production apps
- Vercel Postgres: Free tier with limitations, paid plans for more storage/connections
- Neon: Free tier with 3GB storage, paid plans for more resources
- Supabase: Free tier with 500MB database, paid plans for more resources

Choose the option that best fits your expected usage and budget.
