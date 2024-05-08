"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_CONTACT: DocumentNode = gql`
query {
  getContact {
    id
    title
    description
  }
}
  
`;
