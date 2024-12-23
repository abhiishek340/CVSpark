"use client";
import { cn } from "@/lib/utils";
import { PenLine, User, LogOut } from 'lucide-react';
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback } from 'react';
import { useGlobalContext } from '@/context/global-context';
import { Button } from '@/components/ui/button';
import { getAuth } from 'firebase/auth';
import { auth } from '@/lib/firebase';
import { toast } from 'react-hot-toast';

export const MainNav = ({ className, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname();
    const { user } = useGlobalContext();

    const handleLogout = async () => {
        try {
            const { signOut } = await import('firebase/auth');
            await signOut(auth);
            toast.success('Logged out successfully');
        } catch (error) {
            console.error('Logout error:', error);
            toast.error('Failed to log out');
        }
    };

    const routes = useCallback(() => [
        {
            href: "/",
            label: (
                <span className="text-white text-2xl font-bold flex items-center">
                    FutureFit <PenLine className="ml-2" />
                </span>
            ),
            active: pathname === "/"
        },
        {
            href: "/resume",
            label: "Resume",
            active: pathname === "/resume"
        },
    ], [pathname]);

    return (
        <nav className="bg-gray-800 text-white p-4 shadow-md">
            <div className="container mx-auto flex justify-between items-center">
                <div className="flex space-x-4">
                    {routes().map((route) => (
                        <Link 
                            key={route.href} 
                            href={route.href} 
                            className={cn(
                                "transition-colors hover:text-gray-300",
                                route.active ? "text-white" : "text-gray-300"
                            )}
                        >
                            {route.label}
                        </Link>
                    ))}
                </div>
                <div className="flex items-center space-x-4">
                    {user ? (
                        <>
                            <span className="flex items-center">
                                <User className="mr-2" size={18} />
                                {user.email}
                            </span>
                            <Button 
                                onClick={handleLogout}
                                variant="ghost"
                                className="text-white hover:text-gray-300"
                            >
                                <LogOut className="mr-2" size={18} />
                                Logout
                            </Button>
                        </>
                    ) : (
                        <Link href="/login">
                            <Button variant="ghost" className="text-white hover:text-gray-300">
                                <User className="mr-2" size={18} />
                                Login
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
