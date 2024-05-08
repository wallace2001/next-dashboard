import { getUserById, getUserLogged } from "@/actions/get-user";
import authOptions from "./options";
import NextAuth from "next-auth"
import { cookies } from "next/headers";
import { logoutUser } from "@/actions/logout";

export enum Role {
    Admin,
    User,
  }
  
export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
  } = NextAuth({
    pages: {
      signIn: '/',
      signOut: '/',
      error: '/'
    },
    events: {
      async signOut() {
        const accessToken = cookies().get('access_token')?.value || '';
        const refreshToken = cookies().get('refresh_token')?.value || '';
        await logoutUser(accessToken, refreshToken);
      },
    },
    callbacks: {
      async signIn({ user, account }) {
        if (account?.provider !== "credentials") return true;
        const existingUser = await getUserById(user.id);

        if (!existingUser) return false;
  
        return true;
      },
      async session({ token, session }) {
        if (token.sub && session.user) {
          session.user.id = token.sub;
        }
  
        if (token.role && session.user) {
          session.user.role = token.role as Role;
        }
  
        if (session.user) {
          session.user.name = token.name;
          session.user.image = token.picture;
        }
  
        return session;
      },
      async jwt({ token }) {
        if (!token.sub) return token;
  
        const accessToken = cookies().get('access_token')?.value || '';
        const refreshToken = cookies().get('refresh_token')?.value || '';
        const response = await getUserLogged(accessToken, refreshToken);

        const existingUser = response?.user;
  
        if (!existingUser) return null;
  
        token.name = existingUser.name;
        token.email = existingUser.email;
        token.role = existingUser.role;
        token.picture = existingUser?.avatar?.url || '';  
        return token;
      },
    },
    session: { strategy: "jwt" },
    ...authOptions,
  });

