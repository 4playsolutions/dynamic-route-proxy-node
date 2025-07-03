
export interface Route {
  id: string;
  path: string;
  targets: string[];
  current: number;
  name?: string;
  description?: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
