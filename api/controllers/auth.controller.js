/**
 * Auth Controller
 * 
 * Gerencia autenticação e recuperação de senha
 * Camada de controle entre rotas e services
 */

const { validateCredentials } = require('../services/user.service');
const {
  generateResetToken,
  validateResetToken,
  resetPassword
} = require('../services/password-reset.service');

/**
 * POST /api/auth/login
 * Login de usuário
 */
async function login(req, res) {
  try {
    const { email, password } = req.body;

    // Validar entrada
    if (!email || !password) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Email e senha são obrigatórios'
      });
    }

    // Validar credenciais
    const result = await validateCredentials(email, password);

    if (!result.valid) {
      return res.status(401).json({
        error: 'Credenciais inválidas',
        message: result.error
      });
    }

    // Retornar usuário (sem senha)
    return res.status(200).json({
      success: true,
      user: result.user,
      message: 'Login realizado com sucesso'
    });

  } catch (error) {
    console.error('[AuthController] Erro no login:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao processar login'
    });
  }
}

/**
 * POST /api/auth/forgot-password
 * Solicitar recuperação de senha
 * 
 * Body: { email: string }
 */
async function forgotPassword(req, res) {
  try {
    const { email } = req.body;

    // Validar entrada
    if (!email) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Email é obrigatório'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Formato de email inválido'
      });
    }

    // Gerar token
    const result = await generateResetToken(email);

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao gerar token',
        message: result.error
      });
    }

    // Retornar sucesso
    // Em produção, não retornar o token - ele deve ser enviado por email
    return res.status(200).json({
      success: true,
      message: 'Se o email existir, um token de recuperação foi enviado',
      // Remover em produção:
      token: result.token,
      expiresAt: result.expiresAt
    });

  } catch (error) {
    console.error('[AuthController] Erro em forgot-password:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao processar solicitação'
    });
  }
}

/**
 * POST /api/auth/validate-reset-token
 * Validar se token de reset é válido
 * 
 * Body: { token: string }
 */
async function validateToken(req, res) {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Token é obrigatório'
      });
    }

    const result = await validateResetToken(token);

    if (!result.valid) {
      return res.status(400).json({
        valid: false,
        error: result.error
      });
    }

    return res.status(200).json({
      valid: true,
      email: result.email
    });

  } catch (error) {
    console.error('[AuthController] Erro ao validar token:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao validar token'
    });
  }
}

/**
 * POST /api/auth/reset-password
 * Redefinir senha usando token
 * 
 * Body: { token: string, newPassword: string }
 */
async function resetPasswordHandler(req, res) {
  try {
    const { token, newPassword } = req.body;

    // Validar entrada
    if (!token || !newPassword) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Token e nova senha são obrigatórios'
      });
    }

    // Validar senha
    if (newPassword.length < 6) {
      return res.status(400).json({
        error: 'Senha inválida',
        message: 'Senha deve ter no mínimo 6 caracteres'
      });
    }

    // Redefinir senha
    const result = await resetPassword(token, newPassword);

    if (!result.success) {
      return res.status(400).json({
        error: 'Erro ao redefinir senha',
        message: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: result.message
    });

  } catch (error) {
    console.error('[AuthController] Erro ao redefinir senha:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao redefinir senha'
    });
  }
}

/**
 * POST /api/auth/logout
 * Logout (placeholder - implementar conforme necessário)
 */
function logout(req, res) {
  // Em um sistema com JWT, adicionaria o token a uma blacklist
  // Em um sistema com sessões, destruiria a sessão
  
  return res.status(200).json({
    success: true,
    message: 'Logout realizado com sucesso'
  });
}

module.exports = {
  login,
  forgotPassword,
  validateToken,
  resetPasswordHandler,
  logout
};
