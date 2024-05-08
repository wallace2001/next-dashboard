"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_PROJECT_PAGE: DocumentNode = gql`
query {
  getProjectPage {
    id
    title
    description
  }
}
  
`;
