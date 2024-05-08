"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_PROJECT_BY_ID: DocumentNode = gql`
  query getProjectById($getProjectDto: GetProjectDto!) {
    getProjectById(
      getProjectDto: $getProjectDto
    ) {
      id
      title
      description
      content
      image {
        id
        url
      }
      createdAt
      updatedAt
    }
  }
`;
