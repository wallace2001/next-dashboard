"use client";
import { DocumentNode, gql } from "@apollo/client";

export const FETCH_PROFILE: DocumentNode = gql`
query {
  fetchProfile {
    id
    title
    description
    about
    techs {
      id
      name
      icon
    }
    links {
      id
      name
      icon
    }
    linkProfiles {
      id
      link {
        id
        name
        icon
      }
      linkUrl
      linkId
    }
  }
}
  
`;
