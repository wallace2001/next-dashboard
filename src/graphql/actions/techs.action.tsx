"use client";
import { DocumentNode, gql } from "@apollo/client";

export const FETCH_TECHS: DocumentNode = gql`
query {
    getAllTechs {
      id
      name
      icon
    }
  }
`;
