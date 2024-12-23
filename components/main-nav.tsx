"use client";
import {cn} from "@/lib/utils";
import { PenLine } from 'lucide-react';

import Link from "next/link";
import {usePathname} from "next/navigation"
import { useCallback } from 'react';

export const MainNav = ({className, ...props}: React.HTMLAttributes<HTMLElement>) => {
    const pathname = usePathname();

    const routes = useCallback(() => [
        {
            href: "/",
            label: (
                <span className="text-white text-2xl font-bold">
                    FutureFit <PenLine className="inline-block ml-2" />
                </span>
            ),
            active: pathname === "/"
        },
        // Add other routes as needed
    ], [pathname]);

    console.log("pathname", pathname);

    return (
        <div className="flex">
            {routes().map((route) => (
                <Link key={route.href} href={route.href} className={cn("flex items-center", className)}>
                    {route.label}
                </Link>
            ))}
        </div>
    );
}
