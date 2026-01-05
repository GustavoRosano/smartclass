/**
 * Student Controller
 * 
 * Gerenciamento de alunos
 * Professores e Admins podem cadastrar novos alunos
 */

const { createUser, getAllUsers, getUserById, updateUser, deleteUser } = require('../services/user.service');

/**
 * POST /api/students
 * Criar novo aluno
 * 
 * Requer autenticação: professor ou admin
 */
async function createStudent(req, res) {
  try {
    const { name, email, password, mobilePhone } = req.body;

    // Validar entrada
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Dados incompletos',
        message: 'Nome, email e senha são obrigatórios'
      });
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        error: 'Email inválido',
        message: 'Formato de email inválido'
      });
    }

    // Validar senha
    if (password.length < 6) {
      return res.status(400).json({
        error: 'Senha inválida',
        message: 'Senha deve ter no mínimo 6 caracteres'
      });
    }

    // Criar aluno
    const studentData = {
      name,
      email,
      password,
      mobilePhone,
      role: 'aluno' // Forçar role como aluno
    };

    const student = await createUser(studentData);

    // Log da ação
    console.log(`[StudentController] Aluno criado por ${req.user.role} (${req.user.email}):`, student.email);

    return res.status(201).json({
      success: true,
      student,
      message: 'Aluno cadastrado com sucesso'
    });

  } catch (error) {
    console.error('[StudentController] Erro ao criar aluno:', error);
    
    if (error.message === 'Email já cadastrado') {
      return res.status(409).json({
        error: 'Email já cadastrado',
        message: error.message
      });
    }

    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao cadastrar aluno'
    });
  }
}

/**
 * GET /api/students
 * Listar todos os alunos
 * 
 * Requer autenticação: professor ou admin
 */
async function listStudents(req, res) {
  try {
    // Filtrar apenas alunos
    const users = await getAllUsers({ role: 'aluno' });
    
    const students = users.filter(u => u.role === 'aluno' && u.isActive);

    // Remover senhas
    const studentsWithoutPassword = students.map(({ password, ...student }) => student);

    return res.status(200).json({
      success: true,
      students: studentsWithoutPassword,
      total: studentsWithoutPassword.length
    });

  } catch (error) {
    console.error('[StudentController] Erro ao listar alunos:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao listar alunos'
    });
  }
}

/**
 * GET /api/students/:id
 * Buscar aluno por ID
 * 
 * Requer autenticação: professor ou admin
 */
async function getStudent(req, res) {
  try {
    const { id } = req.params;

    const student = await getUserById(id);

    if (!student) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Aluno não encontrado'
      });
    }

    if (student.role !== 'aluno') {
      return res.status(400).json({
        error: 'Tipo inválido',
        message: 'Usuário não é um aluno'
      });
    }

    // Remover senha
    const { password, ...studentWithoutPassword } = student;

    return res.status(200).json({
      success: true,
      student: studentWithoutPassword
    });

  } catch (error) {
    console.error('[StudentController] Erro ao buscar aluno:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao buscar aluno'
    });
  }
}

/**
 * PUT /api/students/:id
 * Atualizar aluno
 * 
 * Requer autenticação: admin
 */
async function updateStudent(req, res) {
  try {
    const { id } = req.params;
    const { name, email, mobilePhone, isActive } = req.body;

    // Verificar se aluno existe
    const student = await getUserById(id);
    
    if (!student) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Aluno não encontrado'
      });
    }

    if (student.role !== 'aluno') {
      return res.status(400).json({
        error: 'Tipo inválido',
        message: 'Usuário não é um aluno'
      });
    }

    // Preparar dados para atualização (não permitir mudança de role)
    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (mobilePhone !== undefined) updateData.mobilePhone = mobilePhone;
    if (isActive !== undefined) updateData.isActive = isActive;

    const updatedStudent = await updateUser(id, updateData);

    console.log(`[StudentController] Aluno atualizado por ${req.user.role} (${req.user.email}):`, updatedStudent.email);

    return res.status(200).json({
      success: true,
      student: updatedStudent,
      message: 'Aluno atualizado com sucesso'
    });

  } catch (error) {
    console.error('[StudentController] Erro ao atualizar aluno:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao atualizar aluno'
    });
  }
}

/**
 * DELETE /api/students/:id
 * Desativar aluno (soft delete)
 * 
 * Requer autenticação: admin
 */
async function deleteStudentHandler(req, res) {
  try {
    const { id } = req.params;

    // Verificar se aluno existe
    const student = await getUserById(id);
    
    if (!student) {
      return res.status(404).json({
        error: 'Não encontrado',
        message: 'Aluno não encontrado'
      });
    }

    if (student.role !== 'aluno') {
      return res.status(400).json({
        error: 'Tipo inválido',
        message: 'Usuário não é um aluno'
      });
    }

    // Desativar aluno
    await deleteUser(id);

    console.log(`[StudentController] Aluno desativado por ${req.user.role} (${req.user.email}):`, student.email);

    return res.status(200).json({
      success: true,
      message: 'Aluno desativado com sucesso'
    });

  } catch (error) {
    console.error('[StudentController] Erro ao desativar aluno:', error);
    return res.status(500).json({
      error: 'Erro interno',
      message: 'Erro ao desativar aluno'
    });
  }
}

module.exports = {
  createStudent,
  listStudents,
  getStudent,
  updateStudent,
  deleteStudentHandler
};
