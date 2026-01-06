/**
 * Class Service
 * 
 * Gerenciamento de aulas/turmas
 * Relaciona professores e alunos através de classes
 */

const jsonServer = require('../api.externa');

/**
 * Modelo de dados da classe (armazenado no MongoDB via API externa)
 * {
 *   _id: string
 *   name: string
 *   description: string
 *   teacherId: string (ref User._id)
 *   teacherName: string
 *   students: [{
 *     userId: string
 *     userName: string
 *     userEmail: string
 *     enrolledAt: Date
 *     status: 'pending' | 'approved' | 'rejected'
 *   }]
 *   maxStudents: number
 *   startDate: Date
 *   endDate: Date
 *   isActive: boolean
 *   createdAt: Date
 *   updatedAt: Date
 * }
 */

/**
 * Criar nova classe
 */
async function createClass(classData, teacherUser) {
  try {
    const newClass = {
      name: classData.name,
      description: classData.description || '',
      teacherId: teacherUser._id || teacherUser.id,
      teacherName: teacherUser.name,
      students: [],
      maxStudents: classData.maxStudents || 30,
      startDate: classData.startDate || new Date().toISOString(),
      endDate: classData.endDate || null,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const response = await jsonServer.post('/classes', newClass);
    return response.data;

  } catch (error) {
    console.error('[ClassService] Erro ao criar classe:', error);
    throw new Error('Erro ao criar classe');
  }
}

/**
 * Buscar todas as classes
 */
async function getAllClasses(filters = {}) {
  try {
    const params = {};
    
    if (filters.teacherId) {
      params.teacherId = filters.teacherId;
    }
    
    if (filters.isActive !== undefined) {
      params.isActive = filters.isActive;
    }

    const response = await jsonServer.get('/classes', { params });
    return response.data || [];

  } catch (error) {
    console.error('[ClassService] Erro ao buscar classes:', error);
    throw new Error('Erro ao buscar classes');
  }
}

/**
 * Buscar classe por ID
 */
async function getClassById(classId) {
  try {
    const response = await jsonServer.get(`/classes/${classId}`);
    return response.data;
  } catch (error) {
    if (error.response?.status === 404) {
      return null;
    }
    console.error('[ClassService] Erro ao buscar classe:', error);
    throw new Error('Erro ao buscar classe');
  }
}

/**
 * Atualizar classe
 */
async function updateClass(classId, updateData) {
  try {
    updateData.updatedAt = new Date().toISOString();
    
    const response = await jsonServer.put(`/classes/${classId}`, updateData);
    return response.data;

  } catch (error) {
    console.error('[ClassService] Erro ao atualizar classe:', error);
    throw new Error('Erro ao atualizar classe');
  }
}

/**
 * Deletar classe (soft delete)
 */
async function deleteClass(classId) {
  try {
    await jsonServer.put(`/classes/${classId}`, {
      isActive: false,
      updatedAt: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error('[ClassService] Erro ao deletar classe:', error);
    throw new Error('Erro ao deletar classe');
  }
}

/**
 * Aluno solicita matrícula
 */
async function enrollStudent(classId, studentUser) {
  try {
    const classData = await getClassById(classId);
    
    if (!classData) {
      throw new Error('Classe não encontrada');
    }

    if (!classData.isActive) {
      throw new Error('Classe inativa');
    }

    // Verificar se já está matriculado
    const existingEnrollment = classData.students.find(
      s => s.userId === (studentUser._id || studentUser.id)
    );

    if (existingEnrollment) {
      if (existingEnrollment.status === 'approved') {
        throw new Error('Aluno já matriculado nesta classe');
      }
      if (existingEnrollment.status === 'pending') {
        throw new Error('Já existe uma solicitação pendente');
      }
      if (existingEnrollment.status === 'rejected') {
        // Permitir nova solicitação
        existingEnrollment.status = 'pending';
        existingEnrollment.enrolledAt = new Date().toISOString();
      }
    } else {
      // Verificar limite de alunos
      const approvedCount = classData.students.filter(s => s.status === 'approved').length;
      if (approvedCount >= classData.maxStudents) {
        throw new Error('Classe atingiu o limite de alunos');
      }

      // Adicionar nova solicitação
      classData.students.push({
        userId: studentUser._id || studentUser.id,
        userName: studentUser.name,
        userEmail: studentUser.email,
        enrolledAt: new Date().toISOString(),
        status: 'pending'
      });
    }

    const updated = await updateClass(classId, classData);
    return updated;

  } catch (error) {
    console.error('[ClassService] Erro ao matricular aluno:', error);
    throw error;
  }
}

/**
 * Professor aprova matrícula
 */
async function approveEnrollment(classId, studentUserId) {
  try {
    const classData = await getClassById(classId);
    
    if (!classData) {
      throw new Error('Classe não encontrada');
    }

    const student = classData.students.find(s => s.userId === studentUserId);
    
    if (!student) {
      throw new Error('Solicitação não encontrada');
    }

    if (student.status === 'approved') {
      throw new Error('Aluno já está aprovado');
    }

    // Verificar limite
    const approvedCount = classData.students.filter(s => s.status === 'approved').length;
    if (approvedCount >= classData.maxStudents) {
      throw new Error('Classe atingiu o limite de alunos');
    }

    student.status = 'approved';
    student.approvedAt = new Date().toISOString();

    const updated = await updateClass(classId, classData);
    return updated;

  } catch (error) {
    console.error('[ClassService] Erro ao aprovar matrícula:', error);
    throw error;
  }
}

/**
 * Professor rejeita matrícula
 */
async function rejectEnrollment(classId, studentUserId, reason = '') {
  try {
    const classData = await getClassById(classId);
    
    if (!classData) {
      throw new Error('Classe não encontrada');
    }

    const student = classData.students.find(s => s.userId === studentUserId);
    
    if (!student) {
      throw new Error('Solicitação não encontrada');
    }

    student.status = 'rejected';
    student.rejectedAt = new Date().toISOString();
    student.rejectionReason = reason;

    const updated = await updateClass(classId, classData);
    return updated;

  } catch (error) {
    console.error('[ClassService] Erro ao rejeitar matrícula:', error);
    throw error;
  }
}

/**
 * Remover aluno da classe
 */
async function removeStudent(classId, studentUserId) {
  try {
    const classData = await getClassById(classId);
    
    if (!classData) {
      throw new Error('Classe não encontrada');
    }

    classData.students = classData.students.filter(s => s.userId !== studentUserId);

    const updated = await updateClass(classId, classData);
    return updated;

  } catch (error) {
    console.error('[ClassService] Erro ao remover aluno:', error);
    throw error;
  }
}

/**
 * Buscar solicitações pendentes de uma classe
 */
async function getPendingEnrollments(classId) {
  try {
    const classData = await getClassById(classId);
    
    if (!classData) {
      throw new Error('Classe não encontrada');
    }

    return classData.students.filter(s => s.status === 'pending');

  } catch (error) {
    console.error('[ClassService] Erro ao buscar solicitações:', error);
    throw error;
  }
}

/**
 * Buscar classes de um aluno
 */
async function getStudentClasses(studentUserId) {
  try {
    const allClasses = await getAllClasses({ isActive: true });
    
    // Filtrar classes onde o aluno está matriculado (approved)
    return allClasses.filter(classData => 
      classData.students.some(
        s => s.userId === studentUserId && s.status === 'approved'
      )
    );

  } catch (error) {
    console.error('[ClassService] Erro ao buscar classes do aluno:', error);
    throw error;
  }
}

/**
 * Verificar se professor é dono da classe
 */
function isClassOwner(classData, userId) {
  return classData.teacherId === userId;
}

/**
 * Obter estatísticas da classe
 */
function getClassStats(classData) {
  const totalStudents = classData.students.length;
  const approved = classData.students.filter(s => s.status === 'approved').length;
  const pending = classData.students.filter(s => s.status === 'pending').length;
  const rejected = classData.students.filter(s => s.status === 'rejected').length;
  
  return {
    totalStudents,
    approved,
    pending,
    rejected,
    availableSlots: classData.maxStudents - approved,
    isFull: approved >= classData.maxStudents
  };
}

module.exports = {
  createClass,
  getAllClasses,
  getClassById,
  updateClass,
  deleteClass,
  enrollStudent,
  approveEnrollment,
  rejectEnrollment,
  removeStudent,
  getPendingEnrollments,
  getStudentClasses,
  isClassOwner,
  getClassStats
};
