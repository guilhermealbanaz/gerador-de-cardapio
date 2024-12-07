import { api } from './api';

interface SignUpData {
  name: string;
  email: string;
  password: string;
}

interface SignInData {
  email: string;
  password: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

export const AuthService = {
  async signUp(data: SignUpData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/register', data);
    return response.data;
  },

  async signIn(data: SignInData): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>('/auth/login', data);
    return response.data;
  },

  async getProfile(): Promise<AuthResponse['user']> {
    const response = await api.get<AuthResponse['user']>('/auth/profile');
    return response.data;
  },
};
