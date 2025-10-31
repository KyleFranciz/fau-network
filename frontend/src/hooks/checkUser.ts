'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'


// hook to check if the user is currently logged in, use this when routing to the dashboard for example
export default function checkUser() {
    const [user, setUser] = useState<any>(null)

    useEffect(() => {

        const getSession = async () => {
            const { data } = await supabase.auth.getSession()
            setUser(data.session?.user ?? null)
        }

        getSession() // get the session when the component mounts

        // listen for state changes and update the user state
        const { data: listener } = supabase.auth.authOnStateChange((_event: any, session: any) => {
            setUser(session?.user ?? null)
        })

        // unsubscribe from the listener when the component unmounts

        return () => listener.subscription.unsubscribe()

    }, [])

    return user
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