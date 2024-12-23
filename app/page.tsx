"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useGlobalContext } from "@/context/global-context";
import Home from "./(dashboard)/(routes)/page";

export default function RootPage() {
  const router = useRouter();
  const { user, defaultData } = useGlobalContext();

  useEffect(() => {
    if (user) {
      // If user is logged in, check if they have completed onboarding
      const hasDefaultData = localStorage.getItem('defaultData') || defaultData;
      if (hasDefaultData) {
        router.push('/dashboard/generate');
      } else {
        router.push('/onboarding');
      }
    }
  }, [user, router, defaultData]);

  // Show landing page for non-authenticated users
  return <Home />;
}
