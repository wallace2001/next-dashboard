export interface Project {
    id: string;
    title: string;
    description: string;
    content: string;
    images: Image[];
  };
  
  export interface Image {
    id: string;
    url: string;
  }

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  phone_number: string;
  password: string;
  avatar: {
    url: string;
  }
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}