# Supabase Database Setup

## How to Run Migrations

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Run each migration file in order:
   - `001_create_tables.sql` - Creates all 6 database tables
   - `002_rls_policies.sql` - Enables Row Level Security and creates policies
   - `003_standings_trigger.sql` - Creates the standings auto-update trigger
   - `004_storage_buckets.sql` - Creates storage buckets for images

## Important Notes

- Run migrations in numerical order
- The `storage_buckets.sql` can also be set up manually via the Supabase Dashboard UI
- After running migrations, create an admin user manually via Supabase Auth UI with `user_metadata: { role: 'admin' }`

## Creating an Admin User

1. Go to **Authentication** > **Users** in Supabase Dashboard
2. Click **Add User**
3. Enter email and password
4. After creation, click on the user and edit their metadata:
   ```json
   {
     "role": "admin"
   }
   ```

## Environment Variables

Update your Angular environment files with:
- `supabaseUrl`: Your Supabase project URL
- `supabaseAnonKey`: Your Supabase anon/public key

Find these in **Project Settings** > **API** in your Supabase Dashboard.
