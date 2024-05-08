"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_CURRICULUM: DocumentNode = gql`
query {
  getCurriculum {
    id
    url
  }
}
  
`;
