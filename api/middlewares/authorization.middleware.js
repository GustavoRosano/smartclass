/**
 * Middleware de Autorização (RBAC - Role-Based Access Control)
 * 
 * Verifica se o usuário tem as permissões necessárias
 * baseadas em seu role (admin, professor, aluno)
 */

/**
 * Middleware para verificar roles específicos
 * 
 * @param {string[]} allowedRoles - Array de roles permitidos ['admin', 'professor']
 * @returns {Function} Middleware function
 * 
 * Uso:
 * router.post('/api/students', authorize(['admin', 'professor']), createStudent);
 */
function authorize(allowedRoles) {
  return (req, res, next) => {
    // Verificar se usuário está autenticado
    if (!req.user) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Autenticação necessária para acessar este recurso'
      });
    }

    const userRole = req.user.role;

    // Verificar se o role do usuário está na lista de permitidos
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: `Permissão insuficiente. Roles permitidos: ${allowedRoles.join(', ')}`
      });
    }

    next();
  };
}

/**
 * Middleware específico para Admin
 */
function authorizeAdmin(req, res, next) {
  return authorize(['admin'])(req, res, next);
}

/**
 * Middleware para Professor ou Admin
 */
function authorizeTeacher(req, res, next) {
  return authorize(['admin', 'professor'])(req, res, next);
}

/**
 * Middleware para verificar se o usuário é o dono do recurso
 * ou é admin
 * 
 * @param {string} resourceUserIdField - Campo que contém o userId do recurso
 * 
 * Exemplo: Verificar se o usuário pode editar um post
 * router.put('/api/posts/:id', authenticate, authorizeOwnerOrAdmin('userId'), updatePost);
 */
function authorizeOwnerOrAdmin(resourceUserIdField = 'userId') {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        error: 'Não autenticado',
        message: 'Autenticação necessária'
      });
    }

    // Admin sempre tem permissão
    if (req.user.role === 'admin') {
      return next();
    }

    // Verificar se é o dono do recurso
    // O recurso pode vir do body (POST/PUT) ou de params (GET/DELETE)
    const resourceUserId = req.body[resourceUserIdField] || 
                          req.params[resourceUserIdField] ||
                          req.query[resourceUserIdField];

    if (resourceUserId && resourceUserId === req.user._id) {
      return next();
    }

    return res.status(403).json({
      error: 'Acesso negado',
      message: 'Você não tem permissão para acessar este recurso'
    });
  };
}

/**
 * Verificar se professor pode acessar aula
 * Professor só pode acessar aulas que ele criou
 */
function authorizeTeacherClass(req, res, next) {
  if (!req.user) {
    return res.status(401).json({
      error: 'Não autenticado'
    });
  }

  // Admin pode acessar qualquer aula
  if (req.user.role === 'admin') {
    return next();
  }

  // Professor precisa ser o criador da aula
  // Esta verificação será feita no controller
  // Este middleware apenas garante que é professor ou admin
  if (req.user.role === 'professor' || req.user.role === 'admin') {
    return next();
  }

  return res.status(403).json({
    error: 'Acesso negado',
    message: 'Apenas professores e administradores podem gerenciar aulas'
  });
}

module.exports = {
  authorize,
  authorizeAdmin,
  authorizeTeacher,
  authorizeOwnerOrAdmin,
  authorizeTeacherClass
};
