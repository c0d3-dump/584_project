export interface User {
  email: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  email: string;
  role: string;
}

