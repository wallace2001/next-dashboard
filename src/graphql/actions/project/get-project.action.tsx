"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_PROJECTS: DocumentNode = gql`
query {
  getProjects {
    id
    title
    description
    content
    images {
      id
      url
    }
    createdAt
    updatedAt
  }
}
  
`;
