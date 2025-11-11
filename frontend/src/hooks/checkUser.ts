"use client";
// NOTE: You can delete the notes after you see them, only put them there to highlight the changes

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import type { User } from "@supabase/supabase-js"; //NOTE: added User type to handle all the different User data that well get back from supabase

// hook to check if the user is currently logged in, use this when routing to the dashboard for example
export default function checkUser() {
  const [user, setUser] = useState<User | null>(null); //NOTE: changed the type to include User or null for ts

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
    };

    getSession(); // get the session when the component mounts

    // listen for state changes and update the user state
    //NOTE: changed function name to onAuthStateChange from the previous function name
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event: any, session: any) => {
        setUser(session?.user ?? null);
      },
    );

    // unsubscribe from the listener when the component unmounts

    return () => listener.subscription.unsubscribe();
  }, []);

  return user;
}

/*
==========================================
HOOK EXAMPLE:
==========================================

import useUser from '@/hooks/checkUser'

const user = useUser()

// if the user is logged in, show the dashboard
if (user) return <Dashboard />

return <AuthForm />

*/

