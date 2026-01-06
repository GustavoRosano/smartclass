import api from '../lib/axios';

export interface ClassStudent {
  userId: string;
  userName: string;
  userEmail: string;
  enrolledAt: string;
  status: 'pending' | 'approved' | 'rejected';
  approvedAt?: string;
  rejectedAt?: string;
}

export interface Class {
  _id: string;
  name: string;
  description: string;
  teacherId: string;
  teacherName: string;
  students: ClassStudent[];
  maxStudents: number;
  startDate?: string;
  endDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClassDto {
  name: string;
  description: string;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
}

export interface UpdateClassDto {
  name?: string;
  description?: string;
  maxStudents?: number;
  startDate?: string;
  endDate?: string;
  isActive?: boolean;
}

export interface CreateClassResponse {
  success: boolean;
  class?: Class;
  message?: string;
  error?: string;
}

export interface ListClassesResponse {
  success: boolean;
  classes?: Class[];
  total?: number;
  message?: string;
  error?: string;
}

export interface ClassDetailsResponse {
  success: boolean;
  class?: Class;
  message?: string;
  error?: string;
}

export interface UpdateClassResponse {
  success: boolean;
  class?: Class;
  message?: string;
  error?: string;
}

export interface DeleteClassResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface EnrollResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface ApproveRejectResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export interface PendingEnrollmentsResponse {
  success: boolean;
  enrollments?: ClassStudent[];
  total?: number;
  message?: string;
  error?: string;
}

class ClassService {
  /**
   * Create a new class (Professor/Admin only)
   */
  async createClass(data: CreateClassDto): Promise<CreateClassResponse> {
    try {
      const response = await api.post('/classes', data);
      return {
        success: true,
        class: response.data.class,
        message: response.data.message || 'Aula criada com sucesso'
      };
    } catch (error: any) {
      console.error('Error creating class:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar aula'
      };
    }
  }

  /**
   * List classes (optionally filter by "my=true" for teacher's own classes)
   */
  async listClasses(myClassesOnly: boolean = false): Promise<ListClassesResponse> {
    try {
      const params = myClassesOnly ? { my: 'true' } : {};
            
      console.log('[ClassService] 📞 Chamando GET /classes');
      console.log('[ClassService] 🔗 baseURL:', api.defaults.baseURL);
      console.log('[ClassService] 📋 params:', params);
      
      const response = await api.get('/classes', { params });
      
      console.log('[ClassService] ✅ Resposta:', {
        status: response.status,
        total: response.data.total,
        classes: response.data.classes?.length
      });

      return {
        success: true,
        classes: response.data.classes || [],
        total: response.data.total || 0,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('[ClassService] ❌ Erro:', error);
      console.error('[ClassService] ❌ URL tentada:', error.config?.url);
      console.error('[ClassService] ❌ baseURL:', error.config?.baseURL);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao listar aulas'
      };
    }
  }

  /**
   * Get class details by ID
   */
  async getClass(id: string): Promise<ClassDetailsResponse> {
    try {
      const response = await api.get(`/classes/${id}`);
      return {
        success: true,
        class: response.data.class,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error getting class:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar aula'
      };
    }
  }

  /**
   * Update class (Owner/Admin only)
   */
  async updateClass(id: string, data: UpdateClassDto): Promise<UpdateClassResponse> {
    try {
      const response = await api.put(`/classes/${id}`, data);
      return {
        success: true,
        class: response.data.class,
        message: response.data.message || 'Aula atualizada com sucesso'
      };
    } catch (error: any) {
      console.error('Error updating class:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar aula'
      };
    }
  }

  /**
   * Delete class (Owner/Admin only)
   */
  async deleteClass(id: string): Promise<DeleteClassResponse> {
    try {
      const response = await api.delete(`/classes/${id}`);
      return {
        success: true,
        message: response.data.message || 'Aula removida com sucesso'
      };
    } catch (error: any) {
      console.error('Error deleting class:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao remover aula'
      };
    }
  }

  /**
   * Enroll in a class (Student only)
   */
  async enrollInClass(classId: string): Promise<EnrollResponse> {
    try {
      const response = await api.post(`/classes/${classId}/enroll`);
      return {
        success: true,
        message: response.data.message || 'Matrícula solicitada com sucesso'
      };
    } catch (error: any) {
      console.error('Error enrolling in class:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao solicitar matrícula'
      };
    }
  }

  /**
   * Get pending enrollments for a class (Teacher only)
   */
  async getPendingEnrollments(classId: string): Promise<PendingEnrollmentsResponse> {
    try {
      const response = await api.get(`/classes/${classId}/pending`);
      return {
        success: true,
        enrollments: response.data.enrollments,
        total: response.data.total,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error getting pending enrollments:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar matrículas pendentes'
      };
    }
  }

  /**
   * Approve enrollment (Teacher/Owner only)
   */
  async approveEnrollment(classId: string, studentId: string): Promise<ApproveRejectResponse> {
    try {
      const response = await api.put(`/classes/${classId}/approve/${studentId}`);
      return {
        success: true,
        message: response.data.message || 'Matrícula aprovada'
      };
    } catch (error: any) {
      console.error('Error approving enrollment:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao aprovar matrícula'
      };
    }
  }

  /**
   * Reject enrollment (Teacher/Owner only)
   */
  async rejectEnrollment(classId: string, studentId: string): Promise<ApproveRejectResponse> {
    try {
      const response = await api.put(`/classes/${classId}/reject/${studentId}`);
      return {
        success: true,
        message: response.data.message || 'Matrícula rejeitada'
      };
    } catch (error: any) {
      console.error('Error rejecting enrollment:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao rejeitar matrícula'
      };
    }
  }

  /**
   * Remove student from class (Teacher/Owner only)
   */
  async removeStudent(classId: string, studentId: string): Promise<ApproveRejectResponse> {
    try {
      const response = await api.delete(`/classes/${classId}/students/${studentId}`);
      return {
        success: true,
        message: response.data.message || 'Aluno removido da aula'
      };
    } catch (error: any) {
      console.error('Error removing student:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao remover aluno'
      };
    }
  }

  /**
   * Validate class data before submission
   */
  validateClassData(data: CreateClassDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Name validation
    if (!data.name || data.name.trim().length < 3) {
      errors.push('Nome da aula deve ter no mínimo 3 caracteres');
    }

    // Description validation
    if (!data.description || data.description.trim().length < 10) {
      errors.push('Descrição deve ter no mínimo 10 caracteres');
    }

    // Max students validation
    if (data.maxStudents && (data.maxStudents < 1 || data.maxStudents > 100)) {
      errors.push('Máximo de alunos deve estar entre 1 e 100');
    }

    // Date validation
    if (data.startDate && data.endDate) {
      const start = new Date(data.startDate);
      const end = new Date(data.endDate);
      if (end <= start) {
        errors.push('Data de término deve ser posterior à data de início');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  /**
   * Get class statistics
   */
  getClassStats(classData: Class) {
    const approved = classData.students.filter(s => s.status === 'approved').length;
    const pending = classData.students.filter(s => s.status === 'pending').length;
    const rejected = classData.students.filter(s => s.status === 'rejected').length;

    return {
      approved,
      pending,
      rejected,
      total: classData.students.length,
      availableSlots: classData.maxStudents - approved
    };
  }
}

export default new ClassService();
