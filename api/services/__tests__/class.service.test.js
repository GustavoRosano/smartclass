const classService = require('../../../services/class.service');

describe('Class Service', () => {
  let testClass;

  describe('validateClassData', () => {
    it('should validate correct class data', () => {
      const classData = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 30
      };

      const errors = classService.validateClassData(classData);
      expect(errors).toEqual([]);
    });

    it('should reject class with short name', () => {
      const classData = {
        name: 'AB', // Too short
        description: 'This is a test class description',
        maxStudents: 30
      };

      const errors = classService.validateClassData(classData);
      expect(errors).toContain('Nome da aula deve ter no mínimo 3 caracteres');
    });

    it('should reject class with short description', () => {
      const classData = {
        name: 'Test Class',
        description: 'Short', // Too short
        maxStudents: 30
      };

      const errors = classService.validateClassData(classData);
      expect(errors).toContain('Descrição deve ter no mínimo 10 caracteres');
    });

    it('should reject invalid maxStudents range', () => {
      const classData1 = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 0 // Too low
      };

      const errors1 = classService.validateClassData(classData1);
      expect(errors1).toContain('Máximo de alunos deve estar entre 1 e 100');

      const classData2 = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 101 // Too high
      };

      const errors2 = classService.validateClassData(classData2);
      expect(errors2).toContain('Máximo de alunos deve estar entre 1 e 100');
    });

    it('should reject when end date is before start date', () => {
      const classData = {
        name: 'Test Class',
        description: 'This is a test class description',
        maxStudents: 30,
        startDate: '2024-12-31',
        endDate: '2024-01-01' // Before start date
      };

      const errors = classService.validateClassData(classData);
      expect(errors).toContain('Data de término deve ser posterior à data de início');
    });
  });

  describe('getClassStats', () => {
    it('should calculate correct statistics', () => {
      const classData = {
        students: [
          { userId: '1', status: 'approved' },
          { userId: '2', status: 'approved' },
          { userId: '3', status: 'pending' },
          { userId: '4', status: 'pending' },
          { userId: '5', status: 'rejected' }
        ],
        maxStudents: 30
      };

      const stats = classService.getClassStats(classData);

      expect(stats.approved).toBe(2);
      expect(stats.pending).toBe(2);
      expect(stats.rejected).toBe(1);
      expect(stats.total).toBe(5);
      expect(stats.availableSlots).toBe(28); // 30 - 2 approved
    });

    it('should handle empty students array', () => {
      const classData = {
        students: [],
        maxStudents: 30
      };

      const stats = classService.getClassStats(classData);

      expect(stats.approved).toBe(0);
      expect(stats.pending).toBe(0);
      expect(stats.rejected).toBe(0);
      expect(stats.total).toBe(0);
      expect(stats.availableSlots).toBe(30);
    });
  });

  describe('isClassOwner', () => {
    it('should return true when user is the owner', () => {
      const classData = {
        teacherId: 'teacher123'
      };

      const isOwner = classService.isClassOwner(classData, 'teacher123');
      expect(isOwner).toBe(true);
    });

    it('should return false when user is not the owner', () => {
      const classData = {
        teacherId: 'teacher123'
      };

      const isOwner = classService.isClassOwner(classData, 'otherteacher');
      expect(isOwner).toBe(false);
    });
  });
});
