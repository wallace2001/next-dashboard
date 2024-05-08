"use client";
import { DocumentNode, gql } from "@apollo/client";

export const UNLINK_LINK_PROFILE: DocumentNode = gql`
  mutation unlinkLinkProfile($unlinkLinkProfileDto: UnlinkLinkProfileDto!) {
    unlinkLinkProfile(
        unlinkLinkProfileDto: $unlinkLinkProfileDto
    ) {
        message
    }
  }
`;
