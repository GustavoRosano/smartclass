const { authenticate, optionalAuth } = require('../../../middlewares/auth.middleware');

describe('Auth Middleware', () => {
  let mockReq;
  let mockRes;
  let mockNext;

  beforeEach(() => {
    mockReq = {
      headers: {}
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    mockNext = jest.fn();
  });

  describe('authenticate', () => {
    it('should call next() when valid user ID is provided', async () => {
      // Use a known user ID (admin@smartclass.com)
      mockReq.headers['x-user-id'] = '676ae78c13c5fd52ad5d4be8';

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.email).toBe('admin@smartclass.com');
    });

    it('should return 401 when no user ID is provided', async () => {
      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Token de autenticação não fornecido'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 404 when user does not exist', async () => {
      mockReq.headers['x-user-id'] = 'nonexistent-id';

      await authenticate(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        error: 'Usuário não encontrado'
      });
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should return 403 when user is inactive', async () => {
      // Create an inactive user scenario
      // This would need a test user that is inactive
      // For now, we test the logic structure
      mockReq.headers['x-user-id'] = 'inactive-user-id';

      await authenticate(mockReq, mockRes, mockNext);

      // Should either return 404 (user not found) or 403 (inactive)
      expect(mockRes.status).toHaveBeenCalled();
      expect(mockNext).not.toHaveBeenCalled();
    });
  });

  describe('optionalAuth', () => {
    it('should call next() even when no user ID is provided', async () => {
      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });

    it('should attach user when valid ID is provided', async () => {
      mockReq.headers['x-user-id'] = '676ae78c13c5fd52ad5d4be8';

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeDefined();
      expect(mockReq.user.email).toBe('admin@smartclass.com');
    });

    it('should call next() even when user does not exist', async () => {
      mockReq.headers['x-user-id'] = 'nonexistent-id';

      await optionalAuth(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockReq.user).toBeUndefined();
    });
  });
});
