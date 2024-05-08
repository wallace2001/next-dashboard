"use client";
import { DocumentNode, gql } from "@apollo/client";

export const LINK_PROFILE: DocumentNode = gql`
  mutation linkProfile($linkProfileDto: LinkProfileDto!) {
    linkProfile(
        linkProfileDto: $linkProfileDto
    ) {
        message
    }
  }
`;
