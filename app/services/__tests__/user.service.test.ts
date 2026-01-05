import { UserService } from '../user.service';
import api from '../../lib/axios';

jest.mock('../../lib/axios');
const mockedApi = api as jest.Mocked<typeof api>;

describe('UserService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return list of users successfully', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@test.com', role: 'aluno' },
        { id: '2', name: 'User 2', email: 'user2@test.com', role: 'professor' }
      ];

      mockedApi.get.mockResolvedValueOnce({ 
        data: mockUsers 
      });

      const result = await UserService.getAll();

      expect(result).toEqual(mockUsers);
      expect(mockedApi.get).toHaveBeenCalledWith('/api/users', { params: {} });
    });

    it('should filter by active users when activeOnly is true', async () => {
      const mockUsers = [
        { id: '1', name: 'User 1', email: 'user1@test.com', role: 'aluno' }
      ];

      mockedApi.get.mockResolvedValueOnce({ 
        data: mockUsers 
      });

      await UserService.getAll(true);

      expect(mockedApi.get).toHaveBeenCalledWith('/api/users', { params: { isActive: 'true' } });
    });

    it('should throw error when API call fails', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Network error'));

      await expect(UserService.getAll()).rejects.toThrow('Não foi possível carregar usuários');
    });
  });

  describe('getById', () => {
    it('should return user by id', async () => {
      const mockUser = { id: '1', name: 'User 1', email: 'user1@test.com', role: 'aluno' };

      mockedApi.get.mockResolvedValueOnce({ data: [mockUser] });

      const result = await UserService.getById('1');

      expect(result).toEqual(mockUser);
      expect(mockedApi.get).toHaveBeenCalledWith('/api/users/1');
    });

    it('should throw error when user not found', async () => {
      mockedApi.get.mockRejectedValueOnce(new Error('Not found'));

      await expect(UserService.getById('999')).rejects.toThrow('Usuário não encontrado');
    });
  });

  describe('create', () => {
    it('should create user successfully', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@test.com',
        password: '123456',
        role: 'aluno' as const
      };

      const createdUser = { id: '3', name: 'New User', email: 'new@test.com', role: 'aluno' as const };
      mockedApi.post.mockResolvedValueOnce({ data: { userCreated: createdUser } });

      const result = await UserService.create(newUser);

      expect(result).toEqual(createdUser);
      expect(mockedApi.post).toHaveBeenCalledWith('/api/users', newUser);
    });

    it('should throw error when creation fails', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@test.com',
        password: '123456',
        role: 'aluno' as const
      };

      mockedApi.post.mockRejectedValueOnce(new Error('Email already exists'));

      await expect(UserService.create(newUser)).rejects.toThrow('Não foi possível criar usuário');
    });
  });

  describe('update', () => {
    it('should update user successfully', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@test.com',
        role: 'professor' as const
      };

      const updatedUser = { id: '1', name: 'Updated Name', email: 'updated@test.com', role: 'professor' as const };
      mockedApi.put.mockResolvedValueOnce({ data: { user: updatedUser } });

      const result = await UserService.update('1', updateData);

      expect(result).toEqual(updatedUser);
      expect(mockedApi.put).toHaveBeenCalledWith('/api/users/1', updateData);
    });

    it('should throw error when update fails', async () => {
      const updateData = { name: 'Updated' };
      mockedApi.put.mockRejectedValueOnce(new Error('Update failed'));

      await expect(UserService.update('1', updateData)).rejects.toThrow('Não foi possível atualizar usuário');
    });
  });

  describe('delete', () => {
    it('should delete user successfully', async () => {
      mockedApi.delete.mockResolvedValueOnce({ data: { message: 'Deleted' } });

      await UserService.delete('1');

      expect(mockedApi.delete).toHaveBeenCalledWith('/api/users/1');
    });

    it('should throw error when deletion fails', async () => {
      mockedApi.delete.mockRejectedValueOnce(new Error('Delete failed'));

      await expect(UserService.delete('1')).rejects.toThrow('Não foi possível excluir usuário');
    });
  });
});
