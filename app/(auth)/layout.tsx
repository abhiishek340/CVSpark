"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/global-context";

export default function AuthLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const router = useRouter();
    const { user, defaultData } = useGlobalContext();

    useEffect(() => {
        if (user) {
            // If user is logged in, redirect appropriately
            const hasDefaultData = localStorage.getItem('defaultData') || defaultData;
            if (hasDefaultData) {
                router.push('/dashboard/generate');
            } else {
                router.push('/onboarding');
            }
        }
    }, [user, router, defaultData]);

    return (
        <div className="min-h-screen">
            {children}
        </div>
    );
} 