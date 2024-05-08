"use client";
import { DocumentNode, gql } from "@apollo/client";

export const CREATE_CONTACT: DocumentNode = gql`
  mutation createOrUpdateContact($contactDto: ContactDto!) {
    createOrUpdateContact(
      contactDto: $contactDto
    ) {
        message
    }
  }
`;
