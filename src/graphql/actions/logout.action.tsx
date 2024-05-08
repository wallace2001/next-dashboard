"use client";
import { DocumentNode, gql } from "@apollo/client";

export const LOGOUT_USER: DocumentNode = gql`
  query {
    logOutUser {
      message
    }
  }
`;
