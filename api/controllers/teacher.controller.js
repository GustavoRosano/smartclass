/**
 * Teacher Controller
 * Gerenciamento de professores (Admin only)
 */

const { getAllUsers, getUserById } = require('../services/user.service');

/**
 * GET /api/teachers
 * Listar APENAS professores (Admin only)
 */
async function listTeachers(req, res) {
  try {
    console.log(`[TeacherController] Admin ${req.user.email} solicitou lista de professores`);

    // Buscar todos os usuários
    const users = await getAllUsers();
    
    // Filtrar APENAS professores ativos
    const teachers = users.filter(u => 
      u.role === 'professor' && 
      u.isActive === true
    );

    // Remover senhas
    const teachersWithoutPassword = teachers.map(({ password, ...teacher }) => teacher);

    console.log(`[TeacherController] Retornando ${teachers.length} professores`);

    return res.status(200).json({
      success: true,
      teachers: teachersWithoutPassword,
      total: teachersWithoutPassword.length
    });

  } catch (error) {
    console.error('[TeacherController] Erro ao listar professores:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno',
      message: 'Erro ao listar professores'
    });
  }
}

/**
 * GET /api/teachers/:id
 * Buscar professor específico (Admin only)
 */
async function getTeacher(req, res) {
  try {
    const { id } = req.params;
    
    console.log(`[TeacherController] Buscando professor ${id}`);
    
    const teacher = await getUserById(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: 'Professor não encontrado'
      });
    }

    if (teacher.role !== 'professor') {
      return res.status(400).json({
        success: false,
        error: 'Usuário não é professor',
        message: `Usuário tem role: ${teacher.role}`
      });
    }

    // Remover senha
    const { password, ...teacherData } = teacher;

    return res.status(200).json({
      success: true,
      teacher: teacherData
    });

  } catch (error) {
    console.error('[TeacherController] Erro ao buscar professor:', error);
    return res.status(500).json({
      success: false,
      error: 'Erro interno'
    });
  }
}

module.exports = {
  listTeachers,
  getTeacher
};
