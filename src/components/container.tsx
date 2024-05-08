import Navbar from "./navbar";
import Sidebar from "./sidebar";
import { currentUser } from "@/lib/auth";

const Container = async ({ children }: { children: React.ReactNode }) => {

    const user = await currentUser();
    return (
        user?.name ? (
            <div className="h-full relative">
                <div
                    className="
                hidden 
                h-full 
                md:flex 
                md:w-72 
                md:flex-col 
                md:fixed 
                md:inset-y-0 
            "
                >
                    <Sidebar />
                </div>
                <main className="md:pl-72 bg-background h-[100vh] w-full">
                    <div className="p-8">
                        <Navbar />
                        {children}
                    </div>
                </main>
            </div>
        ) :
            children
    );
}

export default Container;