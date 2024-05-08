"use client";
import { DocumentNode, gql } from "@apollo/client";

export const CREATE_ARTICLE: DocumentNode = gql`
  mutation createOrUpdateArticle($articleDto: ArticleDto!) {
    createOrUpdateArticle(
      articleDto: $articleDto
    ) {
        message
    }
  }
`;
