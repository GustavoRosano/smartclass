/**
 * Admin Controller
 * Funcionalidades administrativas
 */

const { getAllUsers } = require('../services/user.service');

/**
 * GET /api/admin/health
 * Verificar se admin existe no sistema
 */
async function checkAdminExists(req, res) {
  try {
    const users = await getAllUsers();
    const admins = users.filter(u => u.role === 'admin' && u.isActive);

    const response = {
      success: true,
      adminExists: admins.length > 0,
      adminCount: admins.length,
      message: admins.length > 0 
        ? `✅ ${admins.length} administrador(es) encontrado(s)` 
        : '⚠️ Nenhum admin cadastrado. Execute: npm run create-admin',
      timestamp: new Date().toISOString()
    };

    // Se não há admin, retornar informações de como criar
    if (admins.length === 0) {
      response.howToCreate = {
        command: 'npm run create-admin',
        location: 'Executar na raiz do projeto',
        credentials: {
          email: 'admin@smartclass.com',
          password: 'admin123'
        }
      };
    }

    return res.status(200).json(response);

  } catch (error) {
    console.error('[AdminController] Erro ao verificar admin:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao verificar admin'
    });
  }
}

/**
 * GET /api/admin/stats
 * Estatísticas do sistema (Admin only)
 */
async function getSystemStats(req, res) {
  try {
    console.log(`[AdminController] Admin ${req.user.email} solicitou estatísticas`);
    
    const users = await getAllUsers();
    
    const stats = {
      totalUsers: users.length,
      admins: users.filter(u => u.role === 'admin').length,
      professors: users.filter(u => u.role === 'professor').length,
      students: users.filter(u => u.role === 'aluno').length,
      activeUsers: users.filter(u => u.isActive).length,
      inactiveUsers: users.filter(u => !u.isActive).length
    };

    return res.status(200).json({
      success: true,
      stats,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('[AdminController] Erro ao buscar estatísticas:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro ao buscar estatísticas'
    });
  }
}

module.exports = {
  checkAdminExists,
  getSystemStats
};
