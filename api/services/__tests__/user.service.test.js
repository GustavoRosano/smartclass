const userService = require('../../../services/user.service');

describe('User Service', () => {
  describe('validateCredentials', () => {
    it('should return user when credentials are valid', async () => {
      const result = await userService.validateCredentials(
        'admin@smartclass.com',
        'admin123'
      );
      
      expect(result).toBeDefined();
      expect(result.email).toBe('admin@smartclass.com');
      expect(result.senha).toBeUndefined(); // Password should be removed
    });

    it('should return null when email does not exist', async () => {
      const result = await userService.validateCredentials(
        'nonexistent@example.com',
        'password'
      );
      
      expect(result).toBeNull();
    });

    it('should return null when password is incorrect', async () => {
      const result = await userService.validateCredentials(
        'admin@smartclass.com',
        'wrongpassword'
      );
      
      expect(result).toBeNull();
    });
  });

  describe('getUserByEmail', () => {
    it('should return user when email exists', async () => {
      const user = await userService.getUserByEmail('admin@smartclass.com');
      
      expect(user).toBeDefined();
      expect(user.email).toBe('admin@smartclass.com');
      expect(user.role).toBe('admin');
    });

    it('should return null when email does not exist', async () => {
      const user = await userService.getUserByEmail('nonexistent@example.com');
      
      expect(user).toBeNull();
    });
  });

  describe('createUser', () => {
    it('should create a new user with hashed password', async () => {
      const userData = {
        nome: 'Test User',
        email: `test${Date.now()}@example.com`,
        senha: 'password123',
        role: 'aluno'
      };

      const user = await userService.createUser(userData);
      
      expect(user).toBeDefined();
      expect(user.nome).toBe(userData.nome);
      expect(user.email).toBe(userData.email);
      expect(user.role).toBe(userData.role);
      expect(user.senha).toBeUndefined(); // Password should not be returned
    });

    it('should throw error when email already exists', async () => {
      const userData = {
        nome: 'Test User',
        email: 'admin@smartclass.com', // Existing email
        senha: 'password123',
        role: 'aluno'
      };

      await expect(userService.createUser(userData)).rejects.toThrow();
    });
  });
});
