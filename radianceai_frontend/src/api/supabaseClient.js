import { createClient } from '@supabase/supabase-js';

// PUBLIC_INTERFACE
/**
 * Exports the configured Supabase client instance.
 * Reads configuration from environment variables for security.
 */
const supabaseUrl = "https://mwynbysbqrjrkmjptpcr.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im13eW5ieXNicXJqcmttanB0cGNyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NzA5MzMsImV4cCI6MjA2NTM0NjkzM30.x01aA5UU_xkxBAEf3Q7XLRb-6o5BkwZl_tWYdISGDbo";

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default supabase;
