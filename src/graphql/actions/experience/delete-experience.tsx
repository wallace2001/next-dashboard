"use client";
import { DocumentNode, gql } from "@apollo/client";

export const DELETE_EXPERIENCE: DocumentNode = gql`
  mutation deleteExperience($deleteExperienceDto: DeleteExperienceDto!) {
    deleteExperience(
      deleteExperienceDto: $deleteExperienceDto
    ) {
        message
    }
  }
`;
