const studentController = require('../student.controller');
const userService = require('../../services/user.service');

jest.mock('../../services/user.service');

describe('Student Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {},
      user: { id: 'prof1', email: 'prof@test.com', role: 'professor' }
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    jest.clearAllMocks();
  });

  describe('createStudent', () => {
    it('should create student successfully', async () => {
      req.body = {
        name: 'Student Name',
        email: 'student@test.com',
        password: '123456',
        mobilePhone: '11999999999'
      };

      const mockStudent = {
        id: 'student1',
        name: 'Student Name',
        email: 'student@test.com',
        role: 'aluno'
      };

      userService.createUser = jest.fn().mockResolvedValue(mockStudent);

      await studentController.createStudent(req, res);

      expect(userService.createUser).toHaveBeenCalledWith(
        expect.objectContaining({
          role: 'aluno'
        })
      );
      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          student: mockStudent
        })
      );
    });

    it('should return 400 when name is missing', async () => {
      req.body = { email: 'student@test.com', password: '123456' };

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Dados incompletos',
          message: 'Nome, email e senha são obrigatórios'
        })
      );
    });

    it('should return 400 with invalid email', async () => {
      req.body = {
        name: 'Student',
        email: 'invalid-email',
        password: '123456'
      };

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Email inválido'
        })
      );
    });

    it('should return 400 with short password', async () => {
      req.body = {
        name: 'Student',
        email: 'student@test.com',
        password: '123'
      };

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Senha inválida',
          message: 'Senha deve ter no mínimo 6 caracteres'
        })
      );
    });

    it('should return 409 when email already exists', async () => {
      req.body = {
        name: 'Student',
        email: 'student@test.com',
        password: '123456'
      };

      userService.createUser = jest.fn().mockRejectedValue(new Error('Email já cadastrado'));

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(409);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          error: 'Email já cadastrado'
        })
      );
    });

    it('should return 500 on service error', async () => {
      req.body = {
        name: 'Student',
        email: 'student@test.com',
        password: '123456'
      };

      userService.createUser = jest.fn().mockRejectedValue(new Error('Database error'));

      await studentController.createStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('listStudents', () => {
    it('should return all students for admin', async () => {
      req.user.role = 'admin';

      const mockStudents = [
        { id: '1', name: 'Student 1', email: 's1@test.com', role: 'aluno' },
        { id: '2', name: 'Student 2', email: 's2@test.com', role: 'aluno' }
      ];

      userService.getAllUsers = jest.fn().mockResolvedValue(mockStudents);

      await studentController.listStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          students: expect.arrayContaining([
            expect.objectContaining({ role: 'aluno' })
          ])
        })
      );
    });

    it('should handle errors', async () => {
      userService.getAllUsers = jest.fn().mockRejectedValue(new Error('Database error'));

      await studentController.listStudents(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });

  describe('getStudentById', () => {
    it('should return student by id', async () => {
      req.params = { id: 'student1' };
      const mockStudent = { id: 'student1', name: 'Student', role: 'aluno' };

      userService.getUserById = jest.fn().mockResolvedValue(mockStudent);

      await studentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          student: mockStudent
        })
      );
    });

    it('should return 404 when student not found', async () => {
      req.params = { id: 'nonexistent' };

      userService.getUserById = jest.fn().mockResolvedValue(null);

      await studentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
    });

    it('should return 400 when user is not a student', async () => {
      req.params = { id: 'prof1' };
      const mockProfessor = { id: 'prof1', name: 'Professor', role: 'professor' };

      userService.getUserById = jest.fn().mockResolvedValue(mockProfessor);

      await studentController.getStudentById(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('updateStudent', () => {
    it('should update student successfully', async () => {
      req.params = { id: 'student1' };
      req.body = { name: 'Updated Name' };

      const mockUpdatedStudent = {
        id: 'student1',
        name: 'Updated Name',
        role: 'aluno'
      };

      userService.updateUser = jest.fn().mockResolvedValue(mockUpdatedStudent);

      await studentController.updateStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          student: mockUpdatedStudent
        })
      );
    });

    it('should prevent role change', async () => {
      req.params = { id: 'student1' };
      req.body = { name: 'Name', role: 'admin' };

      await studentController.updateStudent(req, res);

      expect(userService.updateUser).toHaveBeenCalledWith(
        'student1',
        expect.objectContaining({ role: 'aluno' })
      );
    });
  });

  describe('deleteStudent', () => {
    it('should delete student successfully', async () => {
      req.params = { id: 'student1' };

      userService.deleteUser = jest.fn().mockResolvedValue(true);

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: true,
          message: 'Aluno excluído com sucesso'
        })
      );
    });

    it('should handle errors', async () => {
      req.params = { id: 'student1' };

      userService.deleteUser = jest.fn().mockRejectedValue(new Error('Database error'));

      await studentController.deleteStudent(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
