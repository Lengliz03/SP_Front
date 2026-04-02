export interface User {
    id?: number;
    username: string;
    email: string;
    role: string;
  }
  
  export interface LoginRequest {
    username: string;
    password: string;
  }
  
  export interface JwtResponse {
    token: string;
    type: string;
    username: string;
    role: string;
  }