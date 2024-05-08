import MobileSidebar from "./mobile-sidebar";
import { currentUser } from "@/lib/auth";
import { Button } from "./ui/button";
import { User } from "lucide-react";
import Link from "next/link";

const Navbar = async () => {
    const user = await currentUser();

    if (!user?.id) return null;
    return (
        <div className="flex items-center">
            <div className="w-full">
                <MobileSidebar />
                <div className="w-full md:mt-0 mt-8">
                    <p className="text-sm text-foreground/80">Olá {user?.name}, Bem vindo de volta!</p>
                </div>
            </div>
            <div className="flex w-full justify-end items-center">
                <Link href="/profile">
                    <Button className="bg-foreground w-14 h-14 rounded-full mr-4">
                        <User />
                    </Button>
                </Link>
                {/* <ModeToggle /> */}
            </div>
        </div>
    );
}

export default Navbar;