"use client";
import { DocumentNode, gql } from "@apollo/client";

export const UPDATE_USER: DocumentNode = gql`
  mutation updateUser($userDto: UserDto!) {
    updateUser(
        userDto: $userDto
    ) {
        message
    }
  }
`;
