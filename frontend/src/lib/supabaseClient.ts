import { createClient } from "@supabase/supabase-js";

// import environment variables for supabase, look at the example.env for the variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;

// create the supbase client instance
export const supabase = createClient(supabaseUrl, supabaseAnonKey)
