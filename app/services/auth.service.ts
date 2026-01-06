import api from '../lib/axios';

export type User = {
  id: string;
  email: string;
  name: string;
  role: "professor" | "aluno" | "admin";
  matter?: string;
};

export type LoginResponse = {
  success: boolean;
  user?: User;
  error?: string;
};

export const AuthService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      const response = await api.get<User[]>('/api/users/login', {
        params: { email, password }
      });

      const users = response.data;

      if (users.length > 0 && users[0].email === email) {
        return {
          success: true,
          user: users[0]
        };
      }

      return {
        success: false,
        error: 'Email ou senha incorretos'
      };

    } catch (error) {
      console.error('[AuthService] Erro no login:', error);
      return {
        success: false,
        error: 'Erro ao conectar com servidor'
      };
    }
  },

  saveSession(user: User): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('smartclass_user', JSON.stringify(user));
    }
  },

  getSession(): User | null {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('smartclass_user');
      return saved ? JSON.parse(saved) : null;
    }
    return null;
  },

  clearSession(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('smartclass_user');
    }
  }
};
