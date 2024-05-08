"use client";
import { DocumentNode, gql } from "@apollo/client";

export const CREATE_PROJECT: DocumentNode = gql`
  mutation createOrUpdateProject($projectDto: ProjectDto!) {
    createOrUpdateProject(
      projectDto: $projectDto
    ) {
        message
    }
  }
`;
