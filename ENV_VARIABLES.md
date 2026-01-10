# Environment Variables Reference

This document describes all environment variables used in the LinkShort application.

## Required Variables

### NEXTAUTH_URL
- **Description**: The canonical URL of your site
- **Local Development**: `http://localhost:3000`
- **Production**: `https://your-app-name.vercel.app` or your custom domain
- **Important**: Must match the actual URL where your app is deployed

### NEXTAUTH_SECRET
- **Description**: Secret key used to encrypt JWT tokens and session data
- **Generate**: `openssl rand -base64 32`
- **Local Development**: Any random string (for testing)
- **Production**: Must be a cryptographically secure random string
- **Security**: Never commit this to version control
- **Important**: Keep this value consistent - changing it will invalidate all sessions

### NEXT_PUBLIC_APP_URL
- **Description**: The public URL of your application (used in client-side code)
- **Local Development**: `http://localhost:3000`
- **Production**: `https://your-app-name.vercel.app` or your custom domain
- **Note**: Must start with `NEXT_PUBLIC_` to be available in the browser

### DATABASE_URL
- **Description**: PostgreSQL database connection string
- **Format**: `postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public`
- **Local Development**: Your local PostgreSQL connection string
- **Production**: Connection string from your database provider
- **Examples**:
  - Vercel Postgres: `postgres://default:xxx@xxx-pooler.xxx.vercel-storage.com:5432/verceldb?pgbouncer=true&connect_timeout=15`
  - Neon: `postgresql://user:password@ep-xxx.region.aws.neon.tech/dbname?sslmode=require`
  - Supabase: `postgresql://postgres:password@db.xxx.supabase.co:5432/postgres`

## Environment Variable Setup

### Local Development

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` and fill in your values:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-local-secret-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   DATABASE_URL=postgresql://user:password@localhost:5432/linkshort?schema=public
   ```

### Vercel Deployment

1. Go to your Vercel project settings
2. Navigate to "Settings" > "Environment Variables"
3. Add each variable:
   - Name: `NEXTAUTH_URL`
   - Value: `https://your-app-name.vercel.app`
   - Environments: Select all (Production, Preview, Development)
4. Repeat for all variables

### Using Vercel CLI

You can also set environment variables using the Vercel CLI:

```bash
# Set a variable
vercel env add NEXTAUTH_URL

# Pull variables to local .env file
vercel env pull .env.production

# List all variables
vercel env ls
```

## Security Best Practices

1. **Never commit `.env` files to version control**
   - The `.env` file is already in `.gitignore`
   - Only commit `.env.example` with placeholder values

2. **Use strong secrets in production**
   - Generate `NEXTAUTH_SECRET` using `openssl rand -base64 32`
   - Never reuse secrets across environments

3. **Rotate secrets regularly**
   - Change `NEXTAUTH_SECRET` periodically in production
   - Note: This will invalidate all active sessions

4. **Use different values for different environments**
   - Development, Preview, and Production should have different values
   - Especially important for `NEXTAUTH_SECRET` and `DATABASE_URL`

## Troubleshooting

### "NEXTAUTH_SECRET is not set"
- Ensure the variable is set in your environment
- In production, check Vercel environment variables
- Make sure there are no typos in the variable name

### "Can't reach database server"
- Verify `DATABASE_URL` is correct
- Check database is running and accessible
- Ensure firewall/security groups allow connections from Vercel

### "Invalid redirect URL"
- Check that `NEXTAUTH_URL` matches your deployment URL
- Ensure no trailing slashes
- Verify the protocol (http vs https)

### Client-side variables not working
- Client-side variables must start with `NEXT_PUBLIC_`
- Restart the dev server after adding new variables
- Redeploy on Vercel after adding new variables
