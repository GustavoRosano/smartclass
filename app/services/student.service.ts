import api from '../lib/axios';

export interface Student {
  _id: string;
  nome: string;
  email: string;
  telefone?: string;
  role: 'aluno';
  isActive: boolean;
  createdBy?: string;
}

export interface CreateStudentDto {
  nome: string;
  email: string;
  senha: string;
  telefone?: string;
}

export interface UpdateStudentDto {
  nome?: string;
  email?: string;
  telefone?: string;
  isActive?: boolean;
}

export interface CreateStudentResponse {
  success: boolean;
  student?: Student;
  message?: string;
  error?: string;
}

export interface ListStudentsResponse {
  success: boolean;
  students?: Student[];
  total?: number;
  message?: string;
  error?: string;
}

export interface StudentDetailsResponse {
  success: boolean;
  student?: Student;
  message?: string;
  error?: string;
}

export interface UpdateStudentResponse {
  success: boolean;
  student?: Student;
  message?: string;
  error?: string;
}

export interface DeleteStudentResponse {
  success: boolean;
  message?: string;
  error?: string;
}

class StudentService {
  /**
   * Create a new student (Professor/Admin only)
   */
  async createStudent(data: CreateStudentDto): Promise<CreateStudentResponse> {
    try {
      const response = await api.post('/students', data);
      return {
        success: true,
        student: response.data.student,
        message: response.data.message || 'Aluno criado com sucesso'
      };
    } catch (error: any) {
      console.error('Error creating student:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao criar aluno'
      };
    }
  }

  /**
   * List all students (Professor/Admin only)
   */
  async listStudents(): Promise<ListStudentsResponse> {
    try {
      console.log('[StudentService] 📞 Chamando GET /students');
      console.log('[StudentService] 🔗 baseURL:', api.defaults.baseURL);
      
      const response = await api.get('/students');
      
      console.log('[StudentService] ✅ Resposta:', {
        status: response.status,
        total: response.data.total,
        students: response.data.students?.length
      });

      return {
        success: true,
        students: response.data.students || [],
        total: response.data.total || 0,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('[StudentService] ❌ Erro:', error);
      console.error('[StudentService] ❌ URL tentada:', error.config?.url);
      console.error('[StudentService] ❌ baseURL:', error.config?.baseURL);
      
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao listar alunos'
      };
    }
  }

  /**
   * Get student details by ID (Professor/Admin only)
   */
  async getStudent(id: string): Promise<StudentDetailsResponse> {
    try {
      const response = await api.get(`/students/${id}`);
      return {
        success: true,
        student: response.data.student,
        message: response.data.message
      };
    } catch (error: any) {
      console.error('Error getting student:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao buscar aluno'
      };
    }
  }

  /**
   * Update student (Admin only)
   */
  async updateStudent(id: string, data: UpdateStudentDto): Promise<UpdateStudentResponse> {
    try {
      const response = await api.put(`/students/${id}`, data);
      return {
        success: true,
        student: response.data.student,
        message: response.data.message || 'Aluno atualizado com sucesso'
      };
    } catch (error: any) {
      console.error('Error updating student:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao atualizar aluno'
      };
    }
  }

  /**
   * Delete student (Admin only - soft delete)
   */
  async deleteStudent(id: string): Promise<DeleteStudentResponse> {
    try {
      const response = await api.delete(`/students/${id}`);
      return {
        success: true,
        message: response.data.message || 'Aluno removido com sucesso'
      };
    } catch (error: any) {
      console.error('Error deleting student:', error);
      return {
        success: false,
        error: error.response?.data?.error || 'Erro ao remover aluno'
      };
    }
  }

  /**
   * Validate student data before submission
   */
  validateStudentData(data: CreateStudentDto): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Nome validation
    if (!data.nome || data.nome.trim().length < 3) {
      errors.push('Nome deve ter no mínimo 3 caracteres');
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!data.email || !emailRegex.test(data.email)) {
      errors.push('Email inválido');
    }

    // Password validation
    if (!data.senha || data.senha.length < 6) {
      errors.push('Senha deve ter no mínimo 6 caracteres');
    }

    // Phone validation (optional)
    if (data.telefone && data.telefone.trim().length > 0) {
      const phoneRegex = /^\(?([0-9]{2})\)?[-. ]?([0-9]{4,5})[-. ]?([0-9]{4})$/;
      if (!phoneRegex.test(data.telefone.replace(/\s/g, ''))) {
        errors.push('Telefone inválido');
      }
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default new StudentService();
