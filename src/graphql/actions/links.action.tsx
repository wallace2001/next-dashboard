"use client";
import { DocumentNode, gql } from "@apollo/client";

export const FETCH_LINKS: DocumentNode = gql`
query {
    getAllLinks {
      id
      name
      icon
    }
  }
`;
