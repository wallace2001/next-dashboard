"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_ARTICLES: DocumentNode = gql`
query {
  getArticles {
    id
    title
    description
    content
    createdAt
    updatedAt
  }
}
  
`;
