"use client";
import { DocumentNode, gql } from "@apollo/client";

export const CREATE_PROJECT_PAGE: DocumentNode = gql`
  mutation createOrUpdateProjectPage($projectPageDto: ProjectPageDto!) {
    createOrUpdateProjectPage(
      projectPageDto: $projectPageDto
    ) {
        message
    }
  }
`;
