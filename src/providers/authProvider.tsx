// app/providers.tsx
"use client";

import { ThemeProvider } from "@/providers/theme-provider";
import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import { graphqlClient } from "../graphql/gql.setup";

export function Providers({ children }: { children: React.ReactNode }) {
  
  return (
    <ApolloProvider client={graphqlClient}>
      <SessionProvider>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          {children}
        </ThemeProvider>
      </SessionProvider>
    </ApolloProvider>
  );
}
