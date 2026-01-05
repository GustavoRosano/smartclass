import ClassService from '../class.service';
import api from '../../lib/axios';

jest.mock('../../lib/axios');

describe('ClassService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('createClass', () => {
    it('should create a class successfully', async () => {
      const mockClass = {
        _id: 'class123',
        name: 'Test Class',
        description: 'Test Description',
        teacherId: 'teacher123',
        maxStudents: 30
      };

      (api.post as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          class: mockClass,
          message: 'Aula criada com sucesso'
        }
      });

      const result = await ClassService.createClass({
        name: 'Test Class',
        description: 'Test Description',
        maxStudents: 30
      });

      expect(result.success).toBe(true);
      expect(result.class).toEqual(mockClass);
      expect(api.post).toHaveBeenCalledWith('/classes', expect.any(Object));
    });
  });

  describe('listClasses', () => {
    it('should list all classes', async () => {
      const mockClasses = [
        { _id: '1', name: 'Class 1' },
        { _id: '2', name: 'Class 2' }
      ];

      (api.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          classes: mockClasses,
          total: 2
        }
      });

      const result = await ClassService.listClasses(false);

      expect(result.success).toBe(true);
      expect(result.classes).toEqual(mockClasses);
      expect(api.get).toHaveBeenCalledWith('/classes', { params: {} });
    });

    it('should filter by my classes', async () => {
      (api.get as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          classes: [],
          total: 0
        }
      });

      await ClassService.listClasses(true);

      expect(api.get).toHaveBeenCalledWith('/classes', { params: { my: 'true' } });
    });
  });

  describe('validateClassData', () => {
    it('should validate correct class data', () => {
      const classData = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 30
      };

      const result = ClassService.validateClassData(classData);

      expect(result.valid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should reject short name', () => {
      const classData = {
        name: 'AB',
        description: 'This is a test class description',
        maxStudents: 30
      };

      const result = ClassService.validateClassData(classData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Nome da aula deve ter no mínimo 3 caracteres');
    });

    it('should reject short description', () => {
      const classData = {
        name: 'Test Class',
        description: 'Short',
        maxStudents: 30
      };

      const result = ClassService.validateClassData(classData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Descrição deve ter no mínimo 10 caracteres');
    });

    it('should reject invalid maxStudents', () => {
      const classData1 = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 0
      };

      const result1 = ClassService.validateClassData(classData1);
      expect(result1.errors).toContain('Máximo de alunos deve estar entre 1 e 100');

      const classData2 = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 101
      };

      const result2 = ClassService.validateClassData(classData2);
      expect(result2.errors).toContain('Máximo de alunos deve estar entre 1 e 100');
    });

    it('should reject invalid date range', () => {
      const classData = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 30,
        startDate: '2024-12-31',
        endDate: '2024-01-01'
      };

      const result = ClassService.validateClassData(classData);

      expect(result.valid).toBe(false);
      expect(result.errors).toContain('Data de término deve ser posterior à data de início');
    });
  });

  describe('getClassStats', () => {
    it('should calculate correct statistics', () => {
      const classData = {
        _id: 'class123',
        name: 'Test Class',
        description: 'Test',
        teacherId: 'teacher123',
        teacherName: 'Teacher',
        students: [
          { userId: '1', userName: 'Student 1', userEmail: 'student1@test.com', enrolledAt: '2024-01-01', status: 'approved' as const },
          { userId: '2', userName: 'Student 2', userEmail: 'student2@test.com', enrolledAt: '2024-01-01', status: 'approved' as const },
          { userId: '3', userName: 'Student 3', userEmail: 'student3@test.com', enrolledAt: '2024-01-01', status: 'pending' as const },
          { userId: '4', userName: 'Student 4', userEmail: 'student4@test.com', enrolledAt: '2024-01-01', status: 'rejected' as const }
        ],
        maxStudents: 30,
        isActive: true,
        createdAt: '2024-01-01',
        updatedAt: '2024-01-01'
      };

      const stats = ClassService.getClassStats(classData);

      expect(stats.approved).toBe(2);
      expect(stats.pending).toBe(1);
      expect(stats.rejected).toBe(1);
      expect(stats.total).toBe(4);
      expect(stats.availableSlots).toBe(28);
    });
  });

  describe('enrollInClass', () => {
    it('should enroll in class successfully', async () => {
      (api.post as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          message: 'Matrícula solicitada com sucesso'
        }
      });

      const result = await ClassService.enrollInClass('class123');

      expect(result.success).toBe(true);
      expect(api.post).toHaveBeenCalledWith('/classes/class123/enroll');
    });
  });

  describe('approveEnrollment', () => {
    it('should approve enrollment successfully', async () => {
      (api.put as jest.Mock).mockResolvedValue({
        data: {
          success: true,
          message: 'Matrícula aprovada'
        }
      });

      const result = await ClassService.approveEnrollment('class123', 'student123');

      expect(result.success).toBe(true);
      expect(api.put).toHaveBeenCalledWith('/classes/class123/approve/student123');
    });
  });
});
