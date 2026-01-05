import PasswordResetService from '../password-reset.service';
import api from '../../lib/axios';

jest.mock('../../lib/axios');

describe('PasswordResetService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('requestReset', () => {
    it('should request password reset successfully', async () => {
      const mockResponse = {
        success: true,
        token: 'test-token-123',
        expiresAt: new Date(Date.now() + 3600000).toISOString()
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: mockResponse
      });

      const result = await PasswordResetService.requestReset('test@example.com');

      expect(result.success).toBe(true);
      expect(result.token).toBe('test-token-123');
      expect(result.expiresAt).toBeDefined();
      expect(api.post).toHaveBeenCalledWith('/auth/forgot-password', {
        email: 'test@example.com'
      });
    });

    it('should handle errors when requesting reset', async () => {
      (api.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            error: 'Email não encontrado'
          }
        }
      });

      const result = await PasswordResetService.requestReset('nonexistent@example.com');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email não encontrado');
    });
  });

  describe('validateToken', () => {
    it('should validate token successfully', async () => {
      const mockResponse = {
        valid: true,
        email: 'test@example.com'
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: mockResponse
      });

      const result = await PasswordResetService.validateToken('test-token-123');

      expect(result.valid).toBe(true);
      expect(result.email).toBe('test@example.com');
      expect(api.post).toHaveBeenCalledWith('/auth/validate-reset-token', {
        token: 'test-token-123'
      });
    });

    it('should handle invalid token', async () => {
      (api.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            error: 'Token inválido ou expirado'
          }
        }
      });

      const result = await PasswordResetService.validateToken('invalid-token');

      expect(result.valid).toBe(false);
      expect(result.error).toBe('Token inválido ou expirado');
    });
  });

  describe('resetPassword', () => {
    it('should reset password successfully', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          message: 'Senha redefinida com sucesso'
        }
      });

      const result = await PasswordResetService.resetPassword('test-token-123', 'newPassword123');

      expect(result.success).toBe(true);
      expect(result.message).toBe('Senha redefinida com sucesso');
      expect(api.post).toHaveBeenCalledWith('/auth/reset-password', {
        token: 'test-token-123',
        newPassword: 'newPassword123'
      });
    });

    it('should handle errors when resetting password', async () => {
      (api.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            error: 'Token expirado'
          }
        }
      });

      const result = await PasswordResetService.resetPassword('expired-token', 'newPassword123');

      expect(result.success).toBe(false);
      expect(result.error).toBe('Token expirado');
    });
  });
});
