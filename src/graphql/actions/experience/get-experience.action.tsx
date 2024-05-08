"use client";
import { DocumentNode, gql } from "@apollo/client";

export const GET_EXPERIENCES: DocumentNode = gql`
query {
  getExperiences {
    id
    name
    function
    date {
      from
      to
    }
  }
}
  
`;
