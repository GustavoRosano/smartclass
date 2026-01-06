const classController = require('../class.controller');
const classService = require('../../services/class.service');
const userService = require('../../services/user.service');

jest.mock('../../services/class.service');
jest.mock('../../services/user.service');

describe('Class Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      query: {},
      params: {},
      user: { id: 'prof1', email: 'prof@test.com', role: 'professor' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createClass', () => {
    it('should create class successfully', async () => {
      req.body = {
        name: 'Math Class',
        description: 'Advanced Math',
        maxStudents: 30,
        startDate: '2024-01-01',
        endDate: '2024-06-30'
      };

      const mockClass = {
        id: 'class1',
        name: 'Math Class',
        teacherId: 'prof1'
      };

      classService.createClass = jest.fn().mockResolvedValue(mockClass);

      await classController.createClass(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          class: mockClass
        })
      );
    });

    it('should return 400 when name is missing', async () => {
      req.body = { description: 'Test' };

      await classController.createClass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Dados incompletos',
          message: 'Nome da classe é obrigatório'
        })
      );
    });

    it('should return 400 with invalid maxStudents', async () => {
      req.body = { name: 'Class', maxStudents: 150 };

      await classController.createClass(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Valor inválido',
          message: 'Máximo de alunos deve estar entre 1 e 100'
        })
      );
    });

    it('should handle service errors', async () => {
      req.body = { name: 'Class' };

      classService.createClass = jest.fn().mockRejectedValue(new Error('Database error'));

      await classController.createClass(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('listClasses', () => {
    it('should list all classes for admin', async () => {
      req.user.role = 'admin';

      const mockClasses = [
        { id: '1', name: 'Class 1', teacherId: 'prof1' },
        { id: '2', name: 'Class 2', teacherId: 'prof2' }
      ];

      classService.listClasses = jest.fn().mockResolvedValue(mockClasses);

      await classController.listClasses(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          classes: mockClasses
        })
      );
    });

    it('should list only own classes for professor', async () => {
      req.query = { my: 'true' };
      req.user.role = 'professor';
      req.user.id = 'prof1';

      const mockClasses = [
        { id: '1', name: 'Class 1', teacherId: 'prof1' }
      ];

      classService.listClasses = jest.fn().mockResolvedValue(mockClasses);

      await classController.listClasses(req, res);

      expect(classService.listClasses).toHaveBeenCalledWith(
        expect.objectContaining({
          teacherId: 'prof1'
        })
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should handle errors', async () => {
      classService.listClasses = jest.fn().mockRejectedValue(new Error('Database error'));

      await classController.listClasses(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getClassById', () => {
    it('should return class by id', async () => {
      req.params = { id: 'class1' };
      const mockClass = { id: 'class1', name: 'Math Class' };

      classService.getClassById = jest.fn().mockResolvedValue(mockClass);

      await classController.getClassById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          class: mockClass
        })
      );
    });

    it('should return 404 when class not found', async () => {
      req.params = { id: 'nonexistent' };

      classService.getClassById = jest.fn().mockResolvedValue(null);

      await classController.getClassById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });
  });

  describe('updateClass', () => {
    it('should update class successfully', async () => {
      req.params = { id: 'class1' };
      req.body = { name: 'Updated Class' };

      const mockUpdatedClass = { id: 'class1', name: 'Updated Class' };

      classService.updateClass = jest.fn().mockResolvedValue(mockUpdatedClass);

      await classController.updateClass(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          class: mockUpdatedClass
        })
      );
    });

    it('should handle errors', async () => {
      req.params = { id: 'class1' };
      req.body = { name: 'Updated' };

      classService.updateClass = jest.fn().mockRejectedValue(new Error('Database error'));

      await classController.updateClass(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('deleteClass', () => {
    it('should delete class successfully', async () => {
      req.params = { id: 'class1' };

      classService.deleteClass = jest.fn().mockResolvedValue(true);

      await classController.deleteClass(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Classe excluída com sucesso'
        })
      );
    });

    it('should handle errors', async () => {
      req.params = { id: 'class1' };

      classService.deleteClass = jest.fn().mockRejectedValue(new Error('Database error'));

      await classController.deleteClass(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('enrollStudent', () => {
    it('should enroll student successfully', async () => {
      req.params = { classId: 'class1' };
      req.body = { studentId: 'student1' };

      const mockEnrollment = {
        id: 'enroll1',
        classId: 'class1',
        studentId: 'student1',
        status: 'pending'
      };

      classService.enrollStudent = jest.fn().mockResolvedValue(mockEnrollment);

      await classController.enrollStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          enrollment: mockEnrollment
        })
      );
    });

    it('should return 400 when studentId is missing', async () => {
      req.params = { classId: 'class1' };
      req.body = {};

      await classController.enrollStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('listEnrollments', () => {
    it('should list enrollments for class', async () => {
      req.params = { classId: 'class1' };

      const mockEnrollments = [
        { id: 'e1', classId: 'class1', studentId: 's1', status: 'approved' },
        { id: 'e2', classId: 'class1', studentId: 's2', status: 'pending' }
      ];

      classService.listEnrollments = jest.fn().mockResolvedValue(mockEnrollments);

      await classController.listEnrollments(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          enrollments: mockEnrollments
        })
      );
    });
  });

  describe('approveEnrollment', () => {
    it('should approve enrollment successfully', async () => {
      req.params = { classId: 'class1', enrollmentId: 'enroll1' };

      const mockApprovedEnrollment = {
        id: 'enroll1',
        status: 'approved'
      };

      classService.updateEnrollmentStatus = jest.fn().mockResolvedValue(mockApprovedEnrollment);

      await classController.approveEnrollment(req, res);

      expect(classService.updateEnrollmentStatus).toHaveBeenCalledWith(
        'enroll1',
        'approved'
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });

  describe('rejectEnrollment', () => {
    it('should reject enrollment successfully', async () => {
      req.params = { classId: 'class1', enrollmentId: 'enroll1' };

      const mockRejectedEnrollment = {
        id: 'enroll1',
        status: 'rejected'
      };

      classService.updateEnrollmentStatus = jest.fn().mockResolvedValue(mockRejectedEnrollment);

      await classController.rejectEnrollment(req, res);

      expect(classService.updateEnrollmentStatus).toHaveBeenCalledWith(
        'enroll1',
        'rejected'
      );
      expect(res.status).toHaveBeenCalledWith(200);
    });
  });
});
