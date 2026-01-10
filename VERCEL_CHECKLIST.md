# Vercel Deployment Checklist

Use this checklist to ensure you have everything ready for deploying to Vercel.

## Pre-Deployment Checklist

### Code Repository
- [ ] Code is pushed to GitHub repository
- [ ] All recent changes are committed
- [ ] `.env` file is NOT committed (check `.gitignore`)
- [ ] Build passes locally (if tested with PostgreSQL)

### Database Setup
- [ ] PostgreSQL database created (Vercel Postgres, Neon, or Supabase)
- [ ] Database connection string obtained
- [ ] Database is empty or ready for migrations

### Environment Variables Prepared
- [ ] `NEXTAUTH_URL` prepared with your Vercel app URL
- [ ] `NEXTAUTH_SECRET` generated using `openssl rand -base64 32`
- [ ] `NEXT_PUBLIC_APP_URL` prepared with your Vercel app URL
- [ ] `DATABASE_URL` obtained from your database provider

## Deployment Steps

### 1. Import to Vercel
- [ ] Logged in to Vercel dashboard
- [ ] Clicked "Add New Project"
- [ ] Selected GitHub repository
- [ ] Vercel detected Next.js framework

### 2. Configure Environment Variables
- [ ] Added `NEXTAUTH_URL` to Vercel environment variables
- [ ] Added `NEXTAUTH_SECRET` to Vercel environment variables
- [ ] Added `NEXT_PUBLIC_APP_URL` to Vercel environment variables
- [ ] Added `DATABASE_URL` to Vercel environment variables
- [ ] Selected all environments (Production, Preview, Development) for each variable

### 3. Deploy
- [ ] Clicked "Deploy" button
- [ ] Monitored deployment logs
- [ ] Deployment completed successfully
- [ ] No errors in build logs

## Post-Deployment Verification

### Functionality Tests
- [ ] Homepage loads without errors
- [ ] Can access signup page
- [ ] Can create a new account
- [ ] Can log in with created account
- [ ] Can access dashboard after login
- [ ] Can create a shortened URL
- [ ] Shortened URL redirects correctly
- [ ] Click tracking is working
- [ ] Can view URL list in dashboard
- [ ] Can delete URLs

### Technical Verification
- [ ] Database migrations ran successfully
- [ ] No errors in Vercel function logs
- [ ] SSL certificate is active (should be automatic)
- [ ] Environment variables are properly set

### Security Checks
- [ ] `NEXTAUTH_SECRET` is a strong random value
- [ ] No sensitive data in logs or error messages
- [ ] Authentication redirects working correctly
- [ ] Protected routes are actually protected

## Optional Post-Deployment Steps

### Custom Domain (if applicable)
- [ ] Custom domain added in Vercel
- [ ] DNS records configured
- [ ] Domain SSL certificate provisioned
- [ ] Updated `NEXTAUTH_URL` with custom domain
- [ ] Updated `NEXT_PUBLIC_APP_URL` with custom domain
- [ ] Redeployed application

### Monitoring & Analytics
- [ ] Vercel Analytics enabled (optional)
- [ ] Error tracking configured (optional)
- [ ] Database monitoring set up (optional)

## Troubleshooting Reference

If deployment fails, check:
1. Build logs in Vercel dashboard
2. Environment variables are all set correctly
3. Database connection string is valid
4. Database is accessible from Vercel
5. Migrations ran without errors

For detailed troubleshooting, see `DEPLOYMENT.md`.

## Quick Links

- Vercel Dashboard: https://vercel.com/dashboard
- Vercel Documentation: https://vercel.com/docs
- Prisma Vercel Guide: https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel
- Next.js Deployment: https://nextjs.org/docs/deployment

## Support Documents

- Full deployment guide: `DEPLOYMENT.md`
- Environment variables reference: `ENV_VARIABLES.md`
- Main README: `README.md`

---

**Note**: Keep this checklist handy for future deployments or when helping team members deploy.
