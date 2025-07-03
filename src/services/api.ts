
import { Route } from '@/types/api';

const API_BASE_URL = window.location.hostname === 'localhost'
  ? process.meta.env.API_URL
  : 'https://lozaf2.u5prime.xyz'; // Ajuste conforme necessário

class ApiService {
  private token: string | null = null;

  constructor() {
    this.token = localStorage.getItem('proxy_token');
  }

  private getHeaders() {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  async login(credentials: { username: string; password: string }) {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Credenciais inválidas');
      }

      const data = await response.json();
      this.token = data.token;
      localStorage.setItem('proxy_token', data.token);
      
      return data;
    } catch (error) {
      console.error('Erro no login:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('proxy_token');
  }

  async getRoutes() {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar rotas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar rotas:', error);
      throw error;
    }
  }

  async createRoute(route: Omit<Route, 'id' | 'current'>) {
    try {
      const response = await fetch(`${API_BASE_URL}/routes`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify({
          ...route,
          id: Date.now().toString(),
          current: 0,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar rota');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao criar rota:', error);
      throw error;
    }
  }

  async deleteRoute(id: string) {
    try {
      const response = await fetch(`${API_BASE_URL}/routes/${id}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao deletar rota');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao deletar rota:', error);
      throw error;
    }
  }

  // Novas funcionalidades baseadas na API robusta
  async getMetrics() {
    try {
      const response = await fetch(`${API_BASE_URL}/metrics`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar métricas');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar métricas:', error);
      throw error;
    }
  }

  async getManagedProxies() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/proxies`, {
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao buscar proxies gerenciados');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao buscar proxies gerenciados:', error);
      throw error;
    }
  }

  async addManagedProxy(proxy: {
    ip: string;
    port: number;
    username: string;
    password?: string;
    privateKey?: string;
  }) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/proxies`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(proxy),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Erro ao adicionar proxy');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao adicionar proxy:', error);
      throw error;
    }
  }

  async removeManagedProxy(ip: string, port: number) {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/proxies/${ip}/${port}`, {
        method: 'DELETE',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao remover proxy');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao remover proxy:', error);
      throw error;
    }
  }

  async reloadNginx() {
    try {
      const response = await fetch(`${API_BASE_URL}/admin/nginx/reload`, {
        method: 'POST',
        headers: this.getHeaders(),
      });

      if (!response.ok) {
        throw new Error('Erro ao recarregar Nginx');
      }

      return await response.json();
    } catch (error) {
      console.error('Erro ao recarregar Nginx:', error);
      throw error;
    }
  }

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();
