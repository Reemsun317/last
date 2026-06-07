# Reemsun Commerce Map

Production-ready MVP for a location-based Nigerian business discovery and commerce platform. Buyers can search verified physical stores, browse product catalogs, compare nearby options on a Mapbox map, and contact vendors directly. Vendors can register businesses, upload images/products, edit catalog entries, and view basic metrics. Admins can approve, reject, and verify listings.

## Stack

- Next.js 14 App Router
- TypeScript
- Tailwind CSS
- Supabase Database, Auth, Storage, RLS
- Mapbox
- Vercel

## Project Structure

```text
package.json
src/
  app/
components/
lib/
public/
supabase/
README.md
```

## Environment Variables

Copy `.env.example` to `.env.local` for local development and add the values from Supabase and Mapbox:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_MAPBOX_TOKEN=
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

`SUPABASE_SERVICE_ROLE_KEY` is only used by protected admin API routes after checking the signed-in user has the `admin` role. Never expose it in client-side code.

## Local Development

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Supabase Setup

1. Create a project at [Supabase](https://supabase.com).
2. Open SQL Editor and run `supabase/001_initial_schema.sql`.
3. Run `supabase/seed.sql` to load sample Nigerian businesses and products.
4. In Authentication settings, enable email magic links.
5. Add these redirect URLs:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-VERCEL-DOMAIN.vercel.app/auth/callback`
6. Create the first admin:

```sql
insert into public.user_roles (user_id, role)
values ('YOUR_AUTH_USER_ID', 'admin');
```

## Storage

The migration creates public buckets:

- `business-images`
- `product-images`

Authenticated users can upload images. Public users can read images.

## GitHub Push Instructions

The `.gitignore` file already exists at the project root and excludes dependencies and build output. Use this order:

```bash
git init
git branch -M main
git add .
git commit -m "Initial Reemsun Commerce Map MVP"
git remote add origin https://github.com/USERNAME/REPOSITORY.git
git push -u origin main
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for Supabase, GitHub, Vercel, and environment variable setup.
