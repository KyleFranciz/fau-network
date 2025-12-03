// this file has all the functions for the user

import { supabase } from "@/lib/supabaseClient";
import type { UserProfileDisplay } from "@/schemas/profile.interface";

// Database schema interface (matches actual Supabase table)
interface UserRow {
  id: string;
  full_name: string | null;
  email: string;
  profile_image: string | null;
  bio: string | null;
  attended: number | null;
  admin?: boolean;
  created_at?: string;
}

// Accept user as an argument instead of reading from useAuth() directly.
// This makes the function usable outside of React components/hooks context.
export const getUserProfile = async (
  userId: string | null
): Promise<UserProfileDisplay | null> => {
  if (!userId) {
    return null;
  }

  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, full_name, email, profile_image, bio, attended, admin")
      .eq("id", userId)
      .maybeSingle();

    console.log("Data:", data);

    if (error) {
      console.error("Error fetching user profile:", error);
      return null;
    }

    if (!data) {
      // No user profile record found for this user.
      console.warn("No user profile found for user ID:", userId);
      return null;
    }

    // Map database columns to interface fields
    const userRow = data as UserRow;
    const profile: UserProfileDisplay = {
      id: userRow.id,
      name: userRow.full_name ?? "",
      email: userRow.email,
      profileImage: userRow.profile_image ?? "",
      headline: "", // Not in database schema yet
      website: "", // Not in database schema yet
      bio: userRow.bio ?? "",
      attended: userRow.attended ?? 0,
      admin: userRow.admin ?? false,
    };

    return profile;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
};

// function to get the host information to pass to the needed components

// function to tell if the user is registered to an event
