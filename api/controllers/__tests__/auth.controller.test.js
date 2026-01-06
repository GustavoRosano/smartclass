const authController = require('../auth.controller');
const userService = require('../../services/user.service');
const passwordResetService = require('../../services/password-reset.service');

jest.mock('../../services/user.service');
jest.mock('../../services/password-reset.service');

describe('Auth Controller', () => {
  let req, res;

  beforeEach(() => {
    req = { body: {} };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('should login successfully with valid credentials', async () => {
      req.body = { email: 'user@test.com', password: '123456' };
      const mockUser = { id: '1', email: 'user@test.com', name: 'User', role: 'aluno' };

      userService.validateCredentials = jest.fn().mockResolvedValue({
        valid: true,
        user: mockUser
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          user: mockUser,
          message: 'Login realizado com sucesso'
        })
      );
    });

    it('should return 400 when email is missing', async () => {
      req.body = { password: '123456' };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Dados incompletos',
          message: 'Email e senha são obrigatórios'
        })
      );
    });

    it('should return 400 when password is missing', async () => {
      req.body = { email: 'user@test.com' };

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 401 with invalid credentials', async () => {
      req.body = { email: 'user@test.com', password: 'wrong' };

      userService.validateCredentials = jest.fn().mockResolvedValue({
        valid: false,
        error: 'Credenciais inválidas'
      });

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Credenciais inválidas'
        })
      );
    });

    it('should return 500 on service error', async () => {
      req.body = { email: 'user@test.com', password: '123456' };

      userService.validateCredentials = jest.fn().mockRejectedValue(new Error('Database error'));

      await authController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Erro interno',
          message: 'Erro ao processar login'
        })
      );
    });
  });

  describe('forgotPassword', () => {
    it('should generate reset token successfully', async () => {
      req.body = { email: 'user@test.com' };
      const mockToken = 'abc123';

      passwordResetService.generateResetToken = jest.fn().mockResolvedValue({
        success: true,
        token: mockToken
      });

      await authController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          token: mockToken
        })
      );
    });

    it('should return 400 when email is missing', async () => {
      req.body = {};

      await authController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Dados incompletos',
          message: 'Email é obrigatório'
        })
      );
    });

    it('should return 400 with invalid email format', async () => {
      req.body = { email: 'invalid-email' };

      await authController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Email inválido',
          message: 'Formato de email inválido'
        })
      );
    });

    it('should handle service errors', async () => {
      req.body = { email: 'user@test.com' };

      passwordResetService.generateResetToken = jest.fn().mockRejectedValue(new Error('Service error'));

      await authController.forgotPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      req.body = { token: 'abc123' };

      passwordResetService.validateResetToken = jest.fn().mockResolvedValue({
        valid: true,
        email: 'user@test.com'
      });

      await authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          valid: true
        })
      );
    });

    it('should return 400 when token is missing', async () => {
      req.body = {};

      await authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 with invalid token', async () => {
      req.body = { token: 'invalid' };

      passwordResetService.validateResetToken = jest.fn().mockResolvedValue({
        valid: false,
        error: 'Token inválido'
      });

      await authController.validateToken(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      req.body = { token: 'abc123', newPassword: 'newpass123' };

      passwordResetService.resetPassword = jest.fn().mockResolvedValue({
        success: true,
        message: 'Senha redefinida com sucesso'
      });

      await authController.resetPasswordHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Senha redefinida com sucesso'
        })
      );
    });

    it('should return 400 when data is incomplete', async () => {
      req.body = { token: 'abc123' };

      await authController.resetPasswordHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });

    it('should return 400 with short password', async () => {
      req.body = { token: 'abc123', newPassword: '123' };

      await authController.resetPasswordHandler(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Senha inválida',
          message: 'Senha deve ter no mínimo 6 caracteres'
        })
      );
    });
  });
});
