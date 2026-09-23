// supabase-client.js
// Shared Supabase client. Safe to expose — the anon key is designed to be public.
// Security comes from Row Level Security policies on your tables.

const SUPABASE_URL = 'https://cusunwsfipmfcbptpznb.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1c3Vud3NmaXBtZmNicHRwem5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMjg2MTEsImV4cCI6MjEwNTcwNDYxMX0.1mqTjRFLqmdu-Ku3duPHnnlZqs4bb7Qy0LyAtiFoCkU';

const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Expose helpers other scripts can use
window.BMX = window.BMX || {};
window.BMX.sb = sb;
