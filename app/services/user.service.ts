import api from '../lib/axios';

export type UserInput = {
  name: string;
  username?: string;
  email: string;
  password: string;
  role: 'professor' | 'aluno';
  matter?: string;
};

export type UserProfile = {
  id: string;
  name: string;
  email: string;
  role: 'professor' | 'aluno';
  matter?: string;
};

export const UserService = {
  async getAll(activeOnly: boolean = false): Promise<UserProfile[]> {
    try {
      const params = activeOnly ? { isActive: 'true' } : {};
      const response = await api.get<UserProfile[]>('/api/users', { params });
      return response.data;
    } catch (error) {
      console.error('[UserService] Erro ao buscar usuários:', error);
      throw new Error('Não foi possível carregar usuários');
    }
  },

  async getById(id: string): Promise<UserProfile> {
    try {
      const response = await api.get<UserProfile[]>(`/api/users/${id}`);
      return response.data[0];
    } catch (error) {
      console.error('[UserService] Erro ao buscar usuário:', error);
      throw new Error('Usuário não encontrado');
    }
  },

  async create(user: UserInput): Promise<UserProfile> {
    try {
      const response = await api.post<{ userCreated: UserProfile }>('/api/users', user);
      return response.data.userCreated;
    } catch (error) {
      console.error('[UserService] Erro ao criar usuário:', error);
      throw new Error('Não foi possível criar usuário');
    }
  },

  async update(id: string, user: Partial<UserInput>): Promise<UserProfile> {
    try {
      const response = await api.put<{ user: UserProfile }>(`/api/users/${id}`, user);
      return response.data.user;
    } catch (error) {
      console.error('[UserService] Erro ao atualizar usuário:', error);
      throw new Error('Não foi possível atualizar usuário');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/users/${id}`);
    } catch (error) {
      console.error('[UserService] Erro ao excluir usuário:', error);
      throw new Error('Não foi possível excluir usuário');
    }
  }
};
