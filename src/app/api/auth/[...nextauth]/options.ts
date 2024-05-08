import { login } from "@/actions/get-user";
import { LoginSchema } from "@/schemas";
import bcrypt from "bcryptjs";
import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { cookies } from "next/headers";

export default {
  providers: [
    // GoogleProvider({
    //   clientId: process.env.GOOGLE_CLIENT_ID || "",
    //   clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    // }),
    Credentials({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
          const validatedFields = LoginSchema.safeParse(credentials);

          if (validatedFields.success) {
              const { email, password } = validatedFields.data;
              const response = await login(email, password);
              const user = response?.user;
              if (!user || !user.password) return null;

              const passwordsMatch = await bcrypt.compare(password, user.password);

              if (passwordsMatch) {
                cookies().set('access_token', response.accessToken);
                cookies().set('refresh_token', response.refreshToken);
                return user;
              };
          }

          return null;
      },
  }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
} satisfies NextAuthConfig;
