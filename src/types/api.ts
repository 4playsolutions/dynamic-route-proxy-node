
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

export interface ManagedProxy {
  id: string;
  ip: string;
  port: number;
  status: 'active' | 'inactive' | 'deploying' | 'error';
  lastSeen?: string;
  createdAt: string;
}

export interface Metrics {
  [routePath: string]: {
    bytesIn: number;
    bytesOut: number;
  };
}

export interface ProxyCreateRequest {
  ip: string;
  port: number;
  username: string;
  password?: string;
  privateKey?: string;
}
