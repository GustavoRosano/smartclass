/**
 * Middleware de Autenticação
 * 
 * Verifica se o usuário está autenticado através do token/sessão
 * Este é um middleware simplificado que verifica o userId nos headers
 * 
 * Em produção, recomenda-se usar JWT (JSON Web Tokens)
 */

const { getUserById } = require('../services/user.service');

/**
 * Middleware para verificar se usuário está autenticado
 * 
 * Espera receber o userId no header 'x-user-id'
 * Em produção, substituir por validação de JWT
 */
async function authenticate(req, res, next) {
  try {
    const userId = req.headers['x-user-id'];

    if (!userId) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Token de autenticação não fornecido'
      });
    }

    // Buscar usuário no banco
    const user = await getUserById(userId);

    if (!user) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Usuário não encontrado'
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        error: 'Conta inativa',
        message: 'Sua conta está desativada'
      });
    }

    // Adicionar usuário ao request para uso posterior
    req.user = user;
    next();

  } catch (error) {
    console.error('[Auth Middleware] Erro:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao verificar autenticação'
    });
  }
}

/**
 * Middleware opcional de autenticação
 * Se o token existir, valida. Se não, continua sem usuário.
 */
async function optionalAuth(req, res, next) {
  try {
    const userId = req.headers['x-user-id'];

    if (userId) {
      const user = await getUserById(userId);
      if (user && user.isActive) {
        req.user = user;
      }
    }

    next();
  } catch (error) {
    console.error('[Optional Auth Middleware] Erro:', error);
    next(); // Continua mesmo com erro
  }
}

module.exports = {
  authenticate,
  optionalAuth
};
