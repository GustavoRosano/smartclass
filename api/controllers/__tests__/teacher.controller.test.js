const teacherController = require('../teacher.controller');
const userService = require('../../services/user.service');

jest.mock('../../services/user.service');

describe('Teacher Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('listTeachers', () => {
    it('should return list of professors successfully', async () => {
      const mockProfessors = [
        { id: '1', name: 'Prof 1', email: 'prof1@test.com', role: 'professor' },
        { id: '2', name: 'Prof 2', email: 'prof2@test.com', role: 'professor' }
      ];

      userService.getAllUsers = jest.fn().mockResolvedValue(mockProfessors.map(p => ({ ...p, role: 'professor' })));

      await teacherController.listTeachers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          professors: expect.arrayContaining([
            expect.objectContaining({ role: 'professor' })
          ])
        })
      );
    });

    it('should handle errors and return 500', async () => {
      userService.getAllUsers = jest.fn().mockRejectedValue(new Error('Database error'));

      await teacherController.listTeachers(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Erro ao buscar professores')
        })
      );
    });

    it('should return empty array when no professors found', async () => {
      userService.getAllUsers = jest.fn().mockResolvedValue([
        { id: '1', name: 'Student', email: 'student@test.com', role: 'aluno' }
      ]);

      await teacherController.listTeachers(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          professors: []
        })
      );
    });
  });

  describe('getTeacherById', () => {
    beforeEach(() => {
      req.params = { id: '1' };
    });

    it('should return teacher by id successfully', async () => {
      const mockTeacher = { id: '1', name: 'Prof 1', email: 'prof1@test.com', role: 'professor' };

      userService.getUserById = jest.fn().mockResolvedValue(mockTeacher);

      await teacherController.getTeacherById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          professor: expect.objectContaining({ role: 'professor' })
        })
      );
    });

    it('should return 404 when teacher not found', async () => {
      userService.getUserById = jest.fn().mockResolvedValue(null);

      await teacherController.getTeacherById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Professor não encontrado')
        })
      );
    });

    it('should return 400 when user is not a professor', async () => {
      const mockStudent = { id: '1', name: 'Student', email: 'student@test.com', role: 'aluno' };

      userService.getUserById = jest.fn().mockResolvedValue(mockStudent);

      await teacherController.getTeacherById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('não é um professor')
        })
      );
    });

    it('should handle errors and return 500', async () => {
      userService.getUserById = jest.fn().mockRejectedValue(new Error('Database error'));

      await teacherController.getTeacherById(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: expect.stringContaining('Erro ao buscar professor')
        })
      );
    });
  });
});
