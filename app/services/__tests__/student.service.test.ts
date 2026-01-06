import StudentService from '../student.service';
import api from '../../lib/axios';

jest.mock('../../lib/axios');

describe('StudentService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    it('should create a student successfully', async () => {
      const mockStudent = {
        _id: 'student123',
        nome: 'Test Student',
        email: 'student@test.com',
        role: 'aluno'
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          student: mockStudent,
          message: 'Aluno criado com sucesso'
        }
      });

      const result = await StudentService.createStudent({
        nome: 'Test Student',
        email: 'student@test.com',
        senha: 'password123'
      });

      expect(result.success).toBe(true);
      expect(result.student).toEqual(mockStudent);
      expect(api.post).toHaveBeenCalledWith('/students', expect.any(Object));
    });

    it('should handle errors when creating student', async () => {
      (api.post as jest.Mock).mockRejectedValue({
        response: {
          data: {
            error: 'Email já existe'
          }
        }
      });

      const result = await StudentService.createStudent({
        nome: 'Test Student',
        email: 'existing@test.com',
        senha: 'password123'
      });

      expect(result.success).toBe(false);
      expect(result.error).toBe('Email já existe');
    });
  });

  describe('listStudents', () => {
    it('should list students successfully', async () => {
      const mockStudents = [
        { _id: '1', nome: 'Student 1', email: 'student1@test.com' },
        { _id: '2', nome: 'Student 2', email: 'student2@test.com' }
      ];

      (api.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          students: mockStudents,
          total: 2
        }
      });

      const result = await StudentService.listStudents();

      expect(result.success).toBe(true);
      expect(result.students).toEqual(mockStudents);
      expect(result.total).toBe(2);
      expect(api.get).toHaveBeenCalledWith('/students');
    });
  });

  describe('validateStudentData', () => {
    it('should validate correct student data', () => {
      const studentData = {
        nome: 'Test Student',
        email: 'student@test.com',
        senha: 'password123',
        telefone: '(11) 98765-4321'
      };

      const result = StudentService.validateStudentData(studentData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short name', () => {
      const studentData = {
        nome: 'AB',
        email: 'student@test.com',
        senha: 'password123'
      };

      const result = StudentService.validateStudentData(studentData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Nome deve ter no mínimo 3 caracteres');
    });

    it('should reject invalid email', () => {
      const studentData = {
        nome: 'Test Student',
        email: 'invalid-email',
        senha: 'password123'
      };

      const result = StudentService.validateStudentData(studentData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Email inválido');
    });

    it('should reject short password', () => {
      const studentData = {
        nome: 'Test Student',
        email: 'student@test.com',
        senha: '12345' // Too short
      };

      const result = StudentService.validateStudentData(studentData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Senha deve ter no mínimo 6 caracteres');
    });

    it('should reject invalid phone', () => {
      const studentData = {
        nome: 'Test Student',
        email: 'student@test.com',
        senha: 'password123',
        telefone: '123' // Invalid format
      };

      const result = StudentService.validateStudentData(studentData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Telefone inválido');
    });
  });

  describe('deleteStudent', () => {
    it('should delete student successfully', async () => {
      (api.delete as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          message: 'Aluno removido com sucesso'
        }
      });

      const result = await StudentService.deleteStudent('student123');

      expect(result.success).toBe(true);
      expect(api.delete).toHaveBeenCalledWith('/students/student123');
    });
  });
});
