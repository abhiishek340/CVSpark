"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useGlobalContext } from '@/context/global-context';

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
    const router = useRouter();
    const { user } = useGlobalContext();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            if (user === null) {
                router.push('/login');
            } else {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [user, router]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return <>{children}</>;
};

export default RouteGuard;
