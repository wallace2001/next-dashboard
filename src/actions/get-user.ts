import { LoginResponse } from '../../types';
import request, { gql } from 'graphql-request';

export const login = async (email: string, password: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_SERVER_URI!;
    const mutation = gql`
      mutation Login($email: String!, $password: String!) {
        Login(email: $email, password: $password) {
          user {
            id
            name
            email
            password
            address
            role
            phone_number
          }
          accessToken
          refreshToken
          error {
            message
          }
        }
      }
    `;
    const response = await request(endpoint, mutation, { email, password });

    return response?.Login as LoginResponse;
  } catch (error) {
    throw new Error('Erro durante o login');
  }
};

export const getUserLogged = async (accessToken: string, refreshToken: string) => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_SERVER_URI!;
    const mutation = gql`
      query {
        getLoggedInUser {
          user {
            id
            name
            email
            avatar {
              url
            }
            address
            password
          }
          accessToken
          refreshToken
        }
      }
    `;

    const headers = {
      "access_token": accessToken,
      "refresh_token": refreshToken,
    };

    const response = await request(endpoint, mutation, { }, headers);

    return response?.getLoggedInUser as LoginResponse;
  } catch (err) {
    console.log("getUserLogged ERROR DURING FETCH REQUEST", err);
  }
};

export const getUserById = async (userId: string | undefined) => {
    try {
    if (!userId) {
      return;
    }
    const endpoint = process.env.NEXT_PUBLIC_SERVER_URI!;
    const mutation = gql`
      query getUserById($userId: String!) {
        getUserById(userId: $userId) {
          user {
            id
            name
            email
            address
            avatar {
              id
              url
            }
            role
            password
          }
        }
      }
    `;
    
    const response = await request(endpoint, mutation, { userId });

    return response?.getUserById.user;
  } catch (err) {
    console.log("getUserById ERROR DURING FETCH REQUEST", err);
  }
};

export const getUserByEmail = async (email: string) => {
    try {
    if (!email) {
      return;
    }

    const endpoint = process.env.NEXT_PUBLIC_SERVER_URI!;
    const mutation = gql`
      query getUserByEmail($email: String!) {
        getUserByEmail(email: $email) {
          user {
            id
            name
            email
            address
            avatar {
              id
              url
            }
            role
            password
          }
        }
      }
    `;

    const response = await request(endpoint, mutation, { email });

    return response?.getUserByEmail.user;
  } catch (err) {
    console.log("getUserByEmail ERROR DURING FETCH REQUEST", err);
  }
};
