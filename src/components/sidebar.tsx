/* eslint-disable @next/next/no-async-client-component */
"use client";

import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { CircleUserRound, Contact, Home, LayoutDashboard, MessageSquare, Newspaper, Settings } from "lucide-react";
import { Montserrat } from "next/font/google";
import Link from "next/link";
import { usePathname } from "next/navigation";

const montserrat = Montserrat({ weight: "600", subsets: ["latin"] });



const Sidebar = () => {

    const pathname = usePathname();
    console.log(pathname.includes());

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-backgroundSidebar">
            <div className="px-3 py-2 flex-1">
                <Link href='#' className="flex items-center pl-3 mb-14">
                    <LayoutDashboard className="mr-4" />
                    <h1 className={cn("text-2xl font-bold text-foreground", montserrat.className)}>
                        Dashboard
                    </h1>
                </Link>
                <div className="space-y-1">
                    {ROUTES.map((route) => (
                        <Link
                            href={route.href}
                            key={route.href}
                            className={
                                cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-foreground hover:bg-foreground/10 rounded-lg transition",
                                    pathname.includes(route.href) ? "text-foregroundLink bg-white/10" : "text-zinc-400")
                            }
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
            {/* <FreeCounter
                isPro={isPro}
                apiLimitCount={data?.count | apiLimitCount}
            /> */}
        </div>
    );
}

export default Sidebar;