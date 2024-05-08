"use client";
import { DocumentNode, gql } from "@apollo/client";

export const DELETE_PROJECT: DocumentNode = gql`
  mutation deleteProject($deleteProjectDto: DeleteProjectDto!) {
    deleteProject(
      deleteProjectDto: $deleteProjectDto
    ) {
        message
    }
  }
`;
