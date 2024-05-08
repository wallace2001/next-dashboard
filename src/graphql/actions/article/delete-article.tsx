"use client";
import { DocumentNode, gql } from "@apollo/client";

export const DELETE_ARTICLE: DocumentNode = gql`
  mutation deleteArticle($deleteArticleDto: DeleteArticleDto!) {
    deleteArticle(
      deleteArticleDto: $deleteArticleDto
    ) {
        message
    }
  }
`;
