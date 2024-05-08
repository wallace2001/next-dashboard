"use client";
import { DocumentNode, gql } from "@apollo/client";

export const CREATE_PROFILE: DocumentNode = gql`
  mutation createProfile($createProfileDto: CreateProfileDto!) {
    createProfile(
        createProfileDto: $createProfileDto
    ) {
        message
    }
  }
`;
