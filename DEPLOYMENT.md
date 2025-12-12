# Vercel Deployment Guide

This guide explains how to deploy the SYNTHETICA Coming Soon page to Vercel with proper environment configuration.

## Quick Start

### 1. Connect Repository to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Add New..." → "Project"
3. Import your Git repository
4. Vercel will auto-detect Next.js settings

### 2. Configure Environment Variables

In Vercel Project Settings → Environment Variables, add:

| Variable | Production | Preview | Development |
|----------|------------|---------|-------------|
| `NEXT_PUBLIC_SITE_URL` | `https://synthetica.ai` | `https://preview.synthetica.ai` | (optional) |
| `NEXT_PUBLIC_SUBSCRIBE_API_URL` | `https://api.synthetica.ai/subscribe` | `https://staging-api.synthetica.ai/subscribe` | (leave empty for fake) |

### 3. Deploy

Push to your repository and Vercel will automatically deploy.

---

## Branch Strategy

### Recommended Setup

```
main branch    →  Production deployment  (synthetica.ai)
dev branch     →  Preview deployment     (dev.synthetica.ai)
feature/*      →  Preview deployment     (feature-*.synthetica.ai)
```

### Configure in Vercel

1. **Go to**: Project Settings → Git
2. **Production Branch**: Set to `main`
3. **Preview Branches**: All other branches automatically get preview deployments
4. **Ignored Build Step**: (optional) Skip builds for certain branches

---

## Environment-Specific Configuration

### How Vercel Environments Work

Vercel has three environment types:

| Environment | When Used | `VERCEL_ENV` Value |
|-------------|-----------|-------------------|
| **Production** | Deploys from `main` branch | `production` |
| **Preview** | Deploys from any other branch | `preview` |
| **Development** | Local with `vercel dev` | `development` |

### Setting Different Values Per Environment

1. Go to **Project Settings** → **Environment Variables**
2. Add your variable (e.g., `NEXT_PUBLIC_SUBSCRIBE_API_URL`)
3. Enter the value for **Production**
4. Click "Add Another" for a **different Preview value**
5. Select the appropriate checkboxes:
   - ☑️ Production
   - ☑️ Preview  
   - ☐ Development

Example:
```
NEXT_PUBLIC_SUBSCRIBE_API_URL
├── Production: https://api.synthetica.ai/subscribe
├── Preview:    https://staging-api.synthetica.ai/subscribe
└── Development: (not set - uses fake implementation)
```

---

## Pre-Deployment Checklist

### Before Pushing to `dev` (Preview)

- [ ] Run `npm run build` locally - should complete without errors
- [ ] Test all pages work correctly
- [ ] Check responsive design on mobile
- [ ] Verify animations are smooth
- [ ] Test subscribe form (fake implementation OK)

### Before Merging to `main` (Production)

- [ ] All preview tests passed
- [ ] Environment variables configured in Vercel:
  - [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
  - [ ] `NEXT_PUBLIC_SUBSCRIBE_API_URL` set (if using real API)
- [ ] Custom domain configured (if applicable)
- [ ] SSL certificate active
- [ ] Open Graph image displays correctly (test with [opengraph.xyz](https://opengraph.xyz))
- [ ] Favicon appears in browser tab

---

## Domain Configuration

### Add Custom Domain

1. Go to **Project Settings** → **Domains**
2. Add your domain: `synthetica.ai`
3. Configure DNS at your registrar:
   - **A Record**: `76.76.21.21`
   - **CNAME**: `cname.vercel-dns.com`
4. Vercel will auto-provision SSL certificate

### Preview Domain Pattern

Preview deployments get URLs like:
- `your-project-git-branch-name-username.vercel.app`
- `your-project-abc123.vercel.app` (unique per commit)

---

## Deployment Commands

### Manual Deployment (Optional)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy to preview
vercel

# Deploy to production
vercel --prod
```

---

## Monitoring & Analytics

### Vercel Analytics (Recommended)

1. Go to **Project** → **Analytics**
2. Enable Web Analytics
3. Add to your app (optional - can use dashboard only)

### Speed Insights

1. Go to **Project** → **Speed Insights**
2. Enable to monitor Core Web Vitals

---

## Troubleshooting

### Build Fails

```bash
# Check build locally first
npm run build

# Common issues:
# - TypeScript errors
# - Missing environment variables
# - Import path issues
```

### Environment Variables Not Working

1. Ensure variable names start with `NEXT_PUBLIC_` for client-side access
2. Redeploy after adding/changing variables
3. Check the correct environment is selected (Production/Preview)

### Open Graph Image Not Showing

1. Image must be accessible at the deployed URL
2. Use absolute URLs in metadata
3. Test with: [opengraph.xyz](https://opengraph.xyz) or [metatags.io](https://metatags.io)

---

## File Structure Summary

```
coming-soon/
├── app/
│   ├── layout.tsx        # SEO metadata, fonts, icons
│   ├── page.tsx          # Main page composition
│   └── globals.css       # Global styles
├── components/           # React components
├── lib/
│   └── subscribe.ts      # Subscribe API logic
├── public/
│   ├── icon.svg          # Favicon (SVG)
│   ├── og-image.svg      # Open Graph image (1200x630)
│   └── manifest.json     # PWA manifest
├── env.example           # Environment variable template
└── DEPLOYMENT.md         # This file
```

---

## Quick Reference

| Task | Command / Location |
|------|-------------------|
| Local dev | `npm run dev` |
| Build | `npm run build` |
| Lint | `npm run lint` |
| Vercel Dashboard | [vercel.com/dashboard](https://vercel.com/dashboard) |
| Project Settings | Dashboard → Project → Settings |
| Environment Variables | Settings → Environment Variables |
| Domains | Settings → Domains |
| Deploy Hooks | Settings → Git → Deploy Hooks |

---

**Ready to deploy!** 🚀

Push to `dev` for preview testing, then merge to `main` for production.
