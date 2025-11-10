import { supabase } from "./supabaseClient";

// auth functions or supabase
// TODO: add username param to also send the username to the profile page for when the user is logged in
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        first_name: firstName,
        last_name: lastName,
      },
      emailRedirectTo: `${window.location.origin}/auth/callback`, // added window.location.origin to make it work in production or if our dev team has a differnet local host url
    },
  });
  // TODO: add the data to profiles table in supabase (have the username sent to the backend)
  if (error) throw error;

  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

