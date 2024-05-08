import { redirect } from "next/navigation";
import AuthPage from "./client";
import { currentUser } from "@/lib/auth";

const AuthClient = async () => {

    const user = await currentUser();

    if (user?.id) return redirect('/dashboard');

    return (
        <>
            <AuthPage />
        </>
    );
}
 
export default AuthClient;