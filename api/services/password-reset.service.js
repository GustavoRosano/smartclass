/**
 * Password Reset Service
 * 
 * Gerencia tokens de recuperação de senha
 * Em produção, os tokens devem ser armazenados em banco de dados com expiração
 * 
 * Fluxo:
 * 1. Usuário solicita reset (fornece email)
 * 2. Sistema gera token único e temporário
 * 3. Token é "enviado" ao usuário (em produção, via email)
 * 4. Usuário usa token para redefinir senha
 * 5. Token é invalidado após uso
 */

const crypto = require('crypto');
const bcrypt = require('bcrypt');
const { getUserByEmail, updateUser } = require('./user.service');

// Armazenamento em memória (substituir por banco de dados em produção)
// Estrutura: { email: { token, expires, userId } }
const resetTokens = new Map();

const TOKEN_EXPIRATION_MINUTES = 60; // 1 hora

/**
 * Gerar token de recuperação de senha
 * 
 * @param {string} email - Email do usuário
 * @returns {Promise<{success: boolean, token?: string, error?: string}>}
 */
async function generateResetToken(email) {
  try {
    // Verificar se usuário existe
    const user = await getUserByEmail(email);
    
    if (!user) {
      // Por segurança, não revelar se o email existe ou não
      return {
        success: true,
        message: 'Se o email existir, um token de recuperação foi gerado'
      };
    }

    if (!user.isActive) {
      return {
        success: false,
        error: 'Conta desativada'
      };
    }

    // Gerar token único
    const token = crypto.randomBytes(32).toString('hex');
    
    // Calcular expiração
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + TOKEN_EXPIRATION_MINUTES);

    // Armazenar token
    resetTokens.set(email, {
      token,
      expiresAt: expiresAt.getTime(),
      userId: user._id || user.id
    });

    // Limpar tokens expirados periodicamente
    cleanExpiredTokens();

    console.log(`[PasswordReset] Token gerado para ${email}, expira em ${TOKEN_EXPIRATION_MINUTES} minutos`);
    
    // Em produção, enviar email aqui
    // await sendResetEmail(email, token);

    return {
      success: true,
      token, // Remover em produção - token deve ir apenas por email
      expiresAt: expiresAt.toISOString(),
      message: 'Token de recuperação gerado com sucesso'
    };

  } catch (error) {
    console.error('[PasswordReset] Erro ao gerar token:', error);
    return {
      success: false,
      error: 'Erro ao gerar token de recuperação'
    };
  }
}

/**
 * Validar token de recuperação
 * 
 * @param {string} token - Token fornecido pelo usuário
 * @returns {Promise<{valid: boolean, email?: string, error?: string}>}
 */
async function validateResetToken(token) {
  try {
    // Buscar token em todos os emails
    for (const [email, data] of resetTokens.entries()) {
      if (data.token === token) {
        // Verificar se não expirou
        if (Date.now() > data.expiresAt) {
          resetTokens.delete(email);
          return {
            valid: false,
            error: 'Token expirado'
          };
        }

        return {
          valid: true,
          email,
          userId: data.userId
        };
      }
    }

    return {
      valid: false,
      error: 'Token inválido'
    };

  } catch (error) {
    console.error('[PasswordReset] Erro ao validar token:', error);
    return {
      valid: false,
      error: 'Erro ao validar token'
    };
  }
}

/**
 * Redefinir senha usando token
 * 
 * @param {string} token - Token de recuperação
 * @param {string} newPassword - Nova senha
 * @returns {Promise<{success: boolean, error?: string}>}
 */
async function resetPassword(token, newPassword) {
  try {
    // Validar token
    const validation = await validateResetToken(token);
    
    if (!validation.valid) {
      return {
        success: false,
        error: validation.error
      };
    }

    // Validar senha
    if (!newPassword || newPassword.length < 6) {
      return {
        success: false,
        error: 'Senha deve ter no mínimo 6 caracteres'
      };
    }

    // Atualizar senha do usuário
    await updateUser(validation.userId, {
      password: newPassword // O service fará o hash
    });

    // Invalidar token após uso
    resetTokens.delete(validation.email);

    console.log(`[PasswordReset] Senha redefinida com sucesso para ${validation.email}`);

    return {
      success: true,
      message: 'Senha redefinida com sucesso'
    };

  } catch (error) {
    console.error('[PasswordReset] Erro ao redefinir senha:', error);
    return {
      success: false,
      error: 'Erro ao redefinir senha'
    };
  }
}

/**
 * Limpar tokens expirados da memória
 */
function cleanExpiredTokens() {
  const now = Date.now();
  for (const [email, data] of resetTokens.entries()) {
    if (now > data.expiresAt) {
      resetTokens.delete(email);
      console.log(`[PasswordReset] Token expirado removido: ${email}`);
    }
  }
}

/**
 * Invalidar token manualmente
 * 
 * @param {string} email - Email do usuário
 */
function invalidateToken(email) {
  if (resetTokens.has(email)) {
    resetTokens.delete(email);
    console.log(`[PasswordReset] Token invalidado: ${email}`);
    return true;
  }
  return false;
}

/**
 * Obter estatísticas de tokens ativos (apenas para debug/admin)
 */
function getTokenStats() {
  const now = Date.now();
  const active = Array.from(resetTokens.entries())
    .filter(([_, data]) => now <= data.expiresAt)
    .length;
  
  return {
    total: resetTokens.size,
    active,
    expired: resetTokens.size - active
  };
}

module.exports = {
  generateResetToken,
  validateResetToken,
  resetPassword,
  invalidateToken,
  getTokenStats,
  TOKEN_EXPIRATION_MINUTES
};
