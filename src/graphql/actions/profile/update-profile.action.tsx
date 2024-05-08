"use client";
import { DocumentNode, gql } from "@apollo/client";

export const UPDATE_ABOUT_PROFILE: DocumentNode = gql`
  mutation updateAboutProfile($updateAboutDto: UpdateAboutDto!) {
    updateAboutProfile(
        updateAboutDto: $updateAboutDto
    ) {
        message
    }
  }
`;
