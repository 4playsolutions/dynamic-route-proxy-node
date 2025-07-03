
const API_BASE_URL = 'http://localhost:3000'; // Ajuste conforme necessário

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

  isAuthenticated() {
    return !!this.token;
  }
}

export const apiService = new ApiService();
