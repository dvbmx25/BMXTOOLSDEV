// supabase-client.js
// Shared Supabase client. Safe to expose — the anon key is designed to be public.
// Security comes from Row Level Security policies on your tables.

const supabaseUrl = '__SUPABASE_URL__';
const supabaseKey = '__SUPABASE_ANON_KEY__';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose helpers other scripts can use
window.BMX = window.BMX || {};
window.BMX.sb = sb;
