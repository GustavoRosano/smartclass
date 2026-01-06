/**
 * Class Controller
 * 
 * Gerenciamento de aulas/turmas e matrículas
 */

const classService = require('../services/class.service');
const { getUserById } = require('../services/user.service');

/**
 * POST /api/classes
 * Criar nova classe
 * 
 * Requer: Professor ou Admin
 */
async function createClass(req, res) {
  try {
    const { name, description, maxStudents, startDate, endDate } = req.body;

    // Validar entrada
    if (!name) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Nome da classe é obrigatório'
      });
    }

    // Validar maxStudents
    if (maxStudents && (maxStudents < 1 || maxStudents > 100)) {
      return res.status(400).json({
        error: 'Valor inválido',
        message: 'Máximo de alunos deve estar entre 1 e 100'
      });
    }

    const classData = {
      name,
      description,
      maxStudents,
      startDate,
      endDate
    };

    const newClass = await classService.createClass(classData, req.user);

    console.log(`[ClassController] Classe criada por ${req.user.role} (${req.user.email}):`, newClass.name);

    return res.status(201).json({
      success: true,
      class: newClass,
      message: 'Classe criada com sucesso'
    });

  } catch (error) {
    console.error('[ClassController] Erro ao criar classe:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao criar classe'
    });
  }
}

/**
 * GET /api/classes
 * Listar classes
 * 
 * Query params:
 * - teacherId: Filtrar por professor
 * - my: true para listar apenas classes do usuário logado
 */
async function listClasses(req, res) {
  try {
    const { teacherId, my } = req.query;
    const filters = { isActive: true };

    // Se solicitou "minhas classes" e é professor
    if (my === 'true' && req.user && req.user.role === 'professor') {
      filters.teacherId = req.user._id || req.user.id;
    }
    // Se filtrou por teacherId específico
    else if (teacherId) {
      filters.teacherId = teacherId;
    }

    const classes = await classService.getAllClasses(filters);

    // Se é aluno, filtrar apenas classes onde está matriculado
    if (req.user && req.user.role === 'aluno') {
      const studentClasses = await classService.getStudentClasses(req.user._id || req.user.id);
      return res.status(200).json({
        success: true,
        classes: studentClasses,
        total: studentClasses.length
      });
    }

    return res.status(200).json({
      success: true,
      classes,
      total: classes.length
    });

  } catch (error) {
    console.error('[ClassController] Erro ao listar classes:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao listar classes'
    });
  }
}

/**
 * GET /api/classes/:id
 * Buscar classe por ID
 */
async function getClass(req, res) {
  try {
    const { id } = req.params;

    const classData = await classService.getClassById(id);

    if (!classData) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Classe não encontrada'
      });
    }

    // Adicionar estatísticas
    const stats = classService.getClassStats(classData);

    return res.status(200).json({
      success: true,
      class: classData,
      stats
    });

  } catch (error) {
    console.error('[ClassController] Erro ao buscar classe:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao buscar classe'
    });
  }
}

/**
 * PUT /api/classes/:id
 * Atualizar classe
 * 
 * Requer: Dono da classe ou Admin
 */
async function updateClassHandler(req, res) {
  try {
    const { id } = req.params;
    const { name, description, maxStudents, startDate, endDate, isActive } = req.body;

    const classData = await classService.getClassById(id);

    if (!classData) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Classe não encontrada'
      });
    }

    // Verificar se é dono ou admin
    const isOwner = classService.isClassOwner(classData, req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas o professor da classe ou admin podem editá-la'
      });
    }

    // Preparar dados para atualização
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (description !== undefined) updateData.description = description;
    if (maxStudents !== undefined) {
      if (maxStudents < 1 || maxStudents > 100) {
        return res.status(400).json({
          error: 'Valor inválido',
          message: 'Máximo de alunos deve estar entre 1 e 100'
        });
      }
      updateData.maxStudents = maxStudents;
    }
    if (startDate !== undefined) updateData.startDate = startDate;
    if (endDate !== undefined) updateData.endDate = endDate;
    if (isActive !== undefined && isAdmin) updateData.isActive = isActive;

    const updated = await classService.updateClass(id, updateData);

    console.log(`[ClassController] Classe atualizada por ${req.user.role} (${req.user.email}):`, updated.name);

    return res.status(200).json({
      success: true,
      class: updated,
      message: 'Classe atualizada com sucesso'
    });

  } catch (error) {
    console.error('[ClassController] Erro ao atualizar classe:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao atualizar classe'
    });
  }
}

/**
 * DELETE /api/classes/:id
 * Deletar classe (soft delete)
 * 
 * Requer: Dono da classe ou Admin
 */
async function deleteClassHandler(req, res) {
  try {
    const { id } = req.params;

    const classData = await classService.getClassById(id);

    if (!classData) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Classe não encontrada'
      });
    }

    // Verificar permissão
    const isOwner = classService.isClassOwner(classData, req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas o professor da classe ou admin podem deletá-la'
      });
    }

    await classService.deleteClass(id);

    console.log(`[ClassController] Classe deletada por ${req.user.role} (${req.user.email}):`, classData.name);

    return res.status(200).json({
      success: true,
      message: 'Classe deletada com sucesso'
    });

  } catch (error) {
    console.error('[ClassController] Erro ao deletar classe:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao deletar classe'
    });
  }
}

/**
 * POST /api/classes/:id/enroll
 * Aluno solicita matrícula
 * 
 * Requer: Aluno
 */
async function enrollInClass(req, res) {
  try {
    const { id } = req.params;

    // Apenas alunos podem se matricular
    if (req.user.role !== 'aluno') {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas alunos podem solicitar matrícula'
      });
    }

    const updated = await classService.enrollStudent(id, req.user);

    console.log(`[ClassController] Matrícula solicitada: ${req.user.email} -> classe ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Solicitação de matrícula enviada com sucesso',
      class: updated
    });

  } catch (error) {
    console.error('[ClassController] Erro ao solicitar matrícula:', error);
    
    if (error.message === 'Classe não encontrada' || 
        error.message === 'Classe inativa') {
      return res.status(404).json({
        error: 'Não encontrado',
        message: error.message
      });
    }

    if (error.message.includes('já matriculado') || 
        error.message.includes('pendente') ||
        error.message.includes('limite')) {
      return res.status(400).json({
        error: 'Não permitido',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao solicitar matrícula'
    });
  }
}

/**
 * GET /api/classes/:id/pending
 * Listar solicitações pendentes
 * 
 * Requer: Dono da classe ou Admin
 */
async function getPendingEnrollments(req, res) {
  try {
    const { id } = req.params;

    const classData = await classService.getClassById(id);

    if (!classData) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Classe não encontrada'
      });
    }

    // Verificar permissão
    const isOwner = classService.isClassOwner(classData, req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas o professor da classe ou admin podem ver solicitações'
      });
    }

    const pending = await classService.getPendingEnrollments(id);

    return res.status(200).json({
      success: true,
      pending,
      total: pending.length
    });

  } catch (error) {
    console.error('[ClassController] Erro ao buscar solicitações:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao buscar solicitações'
    });
  }
}

/**
 * PUT /api/classes/:id/approve/:studentId
 * Aprovar matrícula
 * 
 * Requer: Dono da classe ou Admin
 */
async function approveEnrollment(req, res) {
  try {
    const { id, studentId } = req.params;

    const classData = await classService.getClassById(id);

    if (!classData) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Classe não encontrada'
      });
    }

    // Verificar permissão
    const isOwner = classService.isClassOwner(classData, req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas o professor da classe ou admin podem aprovar matrículas'
      });
    }

    const updated = await classService.approveEnrollment(id, studentId);

    console.log(`[ClassController] Matrícula aprovada: ${studentId} -> classe ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Matrícula aprovada com sucesso',
      class: updated
    });

  } catch (error) {
    console.error('[ClassController] Erro ao aprovar matrícula:', error);
    
    if (error.message.includes('não encontrada') || 
        error.message.includes('já está aprovado')) {
      return res.status(400).json({
        error: 'Não permitido',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao aprovar matrícula'
    });
  }
}

/**
 * PUT /api/classes/:id/reject/:studentId
 * Rejeitar matrícula
 * 
 * Requer: Dono da classe ou Admin
 */
async function rejectEnrollment(req, res) {
  try {
    const { id, studentId } = req.params;
    const { reason } = req.body;

    const classData = await classService.getClassById(id);

    if (!classData) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Classe não encontrada'
      });
    }

    // Verificar permissão
    const isOwner = classService.isClassOwner(classData, req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas o professor da classe ou admin podem rejeitar matrículas'
      });
    }

    const updated = await classService.rejectEnrollment(id, studentId, reason);

    console.log(`[ClassController] Matrícula rejeitada: ${studentId} -> classe ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Matrícula rejeitada',
      class: updated
    });

  } catch (error) {
    console.error('[ClassController] Erro ao rejeitar matrícula:', error);
    
    if (error.message.includes('não encontrada')) {
      return res.status(400).json({
        error: 'Não encontido',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao rejeitar matrícula'
    });
  }
}

/**
 * DELETE /api/classes/:id/students/:studentId
 * Remover aluno da classe
 * 
 * Requer: Dono da classe ou Admin
 */
async function removeStudent(req, res) {
  try {
    const { id, studentId } = req.params;

    const classData = await classService.getClassById(id);

    if (!classData) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Classe não encontrada'
      });
    }

    // Verificar permissão
    const isOwner = classService.isClassOwner(classData, req.user._id || req.user.id);
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: 'Acesso negado',
        message: 'Apenas o professor da classe ou admin podem remover alunos'
      });
    }

    const updated = await classService.removeStudent(id, studentId);

    console.log(`[ClassController] Aluno removido: ${studentId} da classe ${id}`);

    return res.status(200).json({
      success: true,
      message: 'Aluno removido da classe',
      class: updated
    });

  } catch (error) {
    console.error('[ClassController] Erro ao remover aluno:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao remover aluno'
    });
  }
}

module.exports = {
  createClass,
  listClasses,
  getClass,
  updateClassHandler,
  deleteClassHandler,
  enrollInClass,
  getPendingEnrollments,
  approveEnrollment,
  rejectEnrollment,
  removeStudent
};
