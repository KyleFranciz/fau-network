import { supabase } from "./supabaseClient";
import checkUser from "@/hooks/checkUser";

// auth functions or supabase
// TODO: add username param to also send the username to the profile page for when the user is logged in
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string,
) {
  const { data: existingUser, error: fetchError } = await supabase
    .from("users")
    .select("id")
    .eq("email", email)
    .maybeSingle(); // NOTE: made a change so that form doesn't give new users and error

  if (fetchError) throw fetchError;

  if (existingUser) {
    throw new Error(
      "An account with this email already exists. Please sign in instead.",
    );
  }

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

  if (error) throw error;

  if (data?.user?.id) {
    const { error: profileError } = await supabase.from("users").upsert({
      id: data.user.id,
      email: data.user.email,
      full_name: `${firstName} ${lastName}`,
    });

    if (profileError) throw profileError;
  }

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
