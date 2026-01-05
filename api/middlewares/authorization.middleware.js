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
      console.log('[RBAC] ❌ Tentativa de acesso sem autenticação');
      return res.status(401).json({
        success: false,
        error: 'Não autenticado',
        message: 'Autenticação necessária para acessar este recurso'
      });
    }

    const userRole = req.user.role;

    // Verificar se o role do usuário está na lista de permitidos
    if (!allowedRoles.includes(userRole)) {
      console.log(`[RBAC] ❌ Acesso negado: ${req.user.email} (${userRole}) tentou acessar recurso que requer ${allowedRoles.join(' ou ')}`);
      
      return res.status(403).json({
        success: false,
        error: 'Acesso negado',
        message: `Permissão insuficiente. Role necessário: ${allowedRoles.join(' ou ')}. Seu role: ${userRole}`
      });
    }

    console.log(`[RBAC] ✅ Acesso permitido: ${req.user.email} (${userRole})`);
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
 * Middleware para Aluno apenas
 */
function authorizeStudent(req, res, next) {
  return authorize(['aluno'])(req, res, next);
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
        success: false,
        error: 'Não autenticado',
        message: 'Autenticação necessária'
      });
    }

    // Admin sempre tem permissão
    if (req.user.role === 'admin') {
      console.log(`[RBAC] ✅ Admin bypass: ${req.user.email}`);
      return next();
    }

    // Verificar se é o dono do recurso
    // O recurso pode vir do body (POST/PUT) ou de params (GET/DELETE)
    const resourceUserId = req.body[resourceUserIdField] || 
                          req.params[resourceUserIdField] ||
                          req.query[resourceUserIdField];

    const userId = req.user._id || req.user.id;

    if (resourceUserId && resourceUserId === userId) {
      console.log(`[RBAC] ✅ Owner access: ${req.user.email}`);
      return next();
    }

    console.log(`[RBAC] ❌ Acesso negado: ${req.user.email} tentou acessar recurso de outro usuário`);

    return res.status(403).json({
      success: false,
      error: 'Acesso negado',
      message: 'Você só pode acessar seus próprios recursos'
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
  authorizeStudent,
  authorizeOwnerOrAdmin,
  authorizeTeacherClass
};
