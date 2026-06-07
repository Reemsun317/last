# Deployment Guide

## 1. Create Supabase Project

1. Go to [Supabase](https://supabase.com) and create a new project.
2. Save the database password securely.
3. Wait for the project to finish provisioning.

## 2. Get Supabase Keys

In Supabase, open **Project Settings > API**:

- Project URL: use as `NEXT_PUBLIC_SUPABASE_URL`
- Anon public key: use as `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- Service role key: use as `SUPABASE_SERVICE_ROLE_KEY`

Keep the service role key secret. Add it only to local `.env.local` and Vercel environment variables.

## 3. Apply Database Schema

Open **SQL Editor** in Supabase and run:

1. `supabase/001_initial_schema.sql`
2. `supabase/seed.sql`

The schema creates:

- `profiles`
- `user_roles`
- `businesses`
- `products`
- `business_metrics`
- indexes
- RLS policies
- storage buckets and storage policies
- metric and timestamp functions

## 4. Configure Auth

In **Authentication > Providers**, enable Email.

In **Authentication > URL Configuration**, add:

```text
http://localhost:3000/auth/callback
https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback
```

After signing in once, copy your auth user ID from **Authentication > Users** and run:

```sql
insert into public.user_roles (user_id, role)
values ('YOUR_AUTH_USER_ID', 'admin');
```

## 5. Configure Mapbox

1. Create a Mapbox account.
2. Create or copy a public access token.
3. Use it as `NEXT_PUBLIC_MAPBOX_TOKEN`.

## 6. Push to GitHub

The `.gitignore` file must exist before installing dependencies or committing. It already excludes `node_modules`, `.next`, and build artifacts.

```bash
git init
git branch -M main
git add .
git commit -m "Initial Reemsun Commerce Map MVP"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## 7. Deploy on Vercel

1. Go to [Vercel](https://vercel.com).
2. Choose **Add New Project**.
3. Import the GitHub repository.
4. Keep framework preset as **Next.js**.
5. Add environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_SITE_URL=https://YOUR-VERCEL-DOMAIN.vercel.app
```

6. Click **Deploy**.
7. After deployment, add the final Vercel callback URL in Supabase Auth settings.

## 8. Production Checks

- Confirm buyer search returns approved businesses.
- Confirm Mapbox renders with markers.
- Confirm vendor can sign in, register a business, upload images, add products, and edit products.
- Confirm admin user can approve, reject, and verify businesses.
- Confirm `.gitignore` excludes generated folders before pushing.
