import api from '../lib/axios';

export type ForgotPasswordResponse = {
  success: boolean;
  token?: string;
  expiresAt?: string;
  message?: string;
  error?: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  message?: string;
  error?: string;
};

export type ValidateTokenResponse = {
  valid: boolean;
  email?: string;
  error?: string;
};

export const PasswordResetService = {
  /**
   * Solicitar recuperação de senha
   */
  async requestReset(email: string): Promise<ForgotPasswordResponse> {
    try {
      const response = await api.post<ForgotPasswordResponse>(
        '/api/auth/forgot-password',
        { email }
      );
      return response.data;
    } catch (error: any) {
      console.error('[PasswordResetService] Erro ao solicitar reset:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao solicitar recuperação de senha'
      };
    }
  },

  /**
   * Validar token de recuperação
   */
  async validateToken(token: string): Promise<ValidateTokenResponse> {
    try {
      const response = await api.post<ValidateTokenResponse>(
        '/api/auth/validate-reset-token',
        { token }
      );
      return response.data;
    } catch (error: any) {
      console.error('[PasswordResetService] Erro ao validar token:', error);
      return {
        valid: false,
        error: error.response?.data?.message || 'Token inválido ou expirado'
      };
    }
  },

  /**
   * Redefinir senha com token
   */
  async resetPassword(token: string, newPassword: string): Promise<ResetPasswordResponse> {
    try {
      const response = await api.post<ResetPasswordResponse>(
        '/api/auth/reset-password',
        { token, newPassword }
      );
      return response.data;
    } catch (error: any) {
      console.error('[PasswordResetService] Erro ao redefinir senha:', error);
      return {
        success: false,
        error: error.response?.data?.message || 'Erro ao redefinir senha'
      };
    }
  }
};
