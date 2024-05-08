"use client";

import { Card } from "@/components/ui/card";
import { ROUTES } from "@/constants";
import { cn } from "@/lib/utils";
import { ArrowRight, Folders, Home, User } from "lucide-react";
import Link from "next/link";

const DashboardPage = () => {
    return (
        <div className="mt-12">
            <h2 className="text-3xl mt-2 font-bold text-foreground/80">Dashboard</h2>

            {ROUTES.map(tool => (
                <Link href={tool.href} className="p-4" key={tool.label}>
                    <Card
                        key={tool.href}
                        className="border-black/5 flex items-center justify-between hover:shadow-md transition cursor-pointer"
                    >
                        <div className="flex items-center gap-x-4">
                            <div className={cn("p-2 w-fit rounded-md", tool.bgColor)}>
                                <tool.icon className={cn("w-8 h-12", tool.color)} />
                            </div>
                            <div className="font-semibold">
                                {tool.label}
                            </div>
                        </div>
                        <ArrowRight className="w-5 h-5 mr-2" />
                    </Card>
                </Link>
            ))}
        </div>
    );
}

export default DashboardPage;