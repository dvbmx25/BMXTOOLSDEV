// supabase-client.js
// Shared Supabase client. Safe to expose — the anon key is designed to be public.
// Security comes from Row Level Security policies on your tables.

const supabaseUrl = 'https://cusunwsfipmfcbptpznb.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN1c3Vud3NmaXBtZmNicHRwem5iIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTAxMjg2MTEsImV4cCI6MjEwNTcwNDYxMX0.1mqTjRFLqmdu-Ku3duPHnnlZqs4bb7Qy0LyAtiFoCkU';

const sb = window.supabase.createClient(supabaseUrl, supabaseKey);

window.BMX = window.BMX || {};
window.BMX.sb = sb;
