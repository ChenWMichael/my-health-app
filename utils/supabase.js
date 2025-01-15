import { createClient } from '@supabase/supabase-js';

// Environment variables should store these values
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;