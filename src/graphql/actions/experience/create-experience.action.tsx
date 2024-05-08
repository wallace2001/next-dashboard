"use client";
import { DocumentNode, gql } from "@apollo/client";

export const CREATE_EXPERIENCE: DocumentNode = gql`
  mutation createExperience($createExperienceDto: [CreateExperienceDto!]!) {
    createExperience(
      createExperienceDto: $createExperienceDto
    ) {
        message
    }
  }
`;
