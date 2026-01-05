const {
  authorize,
  authorizeAdmin,
  authorizeTeacher
} = require('../../../middlewares/authorization.middleware');

describe('Authorization Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      user: {
        _id: 'user123',
        email: 'test@example.com',
        role: 'aluno'
      }
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('authorize', () => {
    it('should call next() when user has allowed role', () => {
      mockReq.user.role = 'admin';
      const middleware = authorize(['admin', 'professor']);

      middleware(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should return 403 when user role is not allowed', () => {
      mockReq.user.role = 'aluno';
      const middleware = authorize(['admin', 'professor']);

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Acesso negado. Permissão insuficiente.'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 401 when no user is attached', () => {
      mockReq.user = null;
      const middleware = authorize(['admin']);

      middleware(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Autenticação necessária'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorizeAdmin', () => {
    it('should allow admin users', () => {
      mockReq.user.role = 'admin';

      authorizeAdmin(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny non-admin users', () => {
      mockReq.user.role = 'professor';

      authorizeAdmin(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('authorizeTeacher', () => {
    it('should allow admin users', () => {
      mockReq.user.role = 'admin';

      authorizeTeacher(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should allow professor users', () => {
      mockReq.user.role = 'professor';

      authorizeTeacher(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
    });

    it('should deny student users', () => {
      mockReq.user.role = 'aluno';

      authorizeTeacher(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(403);
      expect(mockNext).not.toHaveBeenCalled();
    });
  });
});
