"use client";
import { DocumentNode, gql } from "@apollo/client";

export const CREATE_CURRICULUM: DocumentNode = gql`
  mutation createOrUpdateCurriculum($curriculumDto: CurriculumDto!) {
    createOrUpdateCurriculum(
      curriculumDto: $curriculumDto
    ) {
        message
    }
  }
`;
