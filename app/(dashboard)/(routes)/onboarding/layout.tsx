"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useGlobalContext } from "@/context/global-context";
import { db, getFirestoreFunctions } from '@/lib/firebase';

export default function OnboardingLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const router = useRouter();
    const { user } = useGlobalContext();

    useEffect(() => {
        const checkDefaultData = async () => {
            const isInitialAuth = localStorage.getItem('isInitialAuth');
            
            if (user && isInitialAuth === 'true') {
                localStorage.removeItem('isInitialAuth'); // Clear the flag
                try {
                    const { doc, getDoc } = await getFirestoreFunctions();
                    const docRef = doc(db, 'users', user.uid, 'resumes', 'default');
                    const docSnap = await getDoc(docRef);
                    
                    if (docSnap.exists()) {
                        router.push('/generate');
                    }
                } catch (error) {
                    console.error('Error checking default data:', error);
                }
            }
        };

        checkDefaultData();
    }, [user, router]);

    return (
        <div className="min-h-screen bg-[#f5f8fc] dark:bg-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {children}
            </div>
        </div>
    );
} 