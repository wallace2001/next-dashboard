"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_ARTICLE_BY_ID: DocumentNode = gql`
  query getArticleById($getArticleDto: GetArticleDto!) {
    getArticleById(
      getArticleDto: $getArticleDto
    ) {
      id
      title
      description
      content
      createdAt
      updatedAt
    }
  }
`;
