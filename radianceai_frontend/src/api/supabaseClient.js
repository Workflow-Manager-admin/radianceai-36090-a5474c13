import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
/**
 * Exports the configured Supabase client instance.
 * Reads configuration from environment variables for security.
 */
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
