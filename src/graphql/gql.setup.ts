import {
  ApolloClient,
  ApolloLink,
  InMemoryCache,
  createHttpLink,
} from "@apollo/client";
import cookie from "cookiejs";
  
    const httpLink = createHttpLink({
      uri: process.env.NEXT_PUBLIC_SERVER_URI,
    });
  
    const authMiddleware = new ApolloLink((oparetion, forward) => {
      oparetion.setContext({
        headers: {
          access_token: cookie.get('access_token'),
          refresh_token: cookie.get('refresh_token'),
        },
      });
      return forward(oparetion);
    });
  
    export const graphqlClient = new ApolloClient({
      link: authMiddleware.concat(httpLink),
      cache: new InMemoryCache(),
    });
  