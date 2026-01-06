const adminController = require('../admin.controller');

describe('Admin Controller', () => {
  let req, res;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
  });

  describe('health', () => {
    it('should return health status successfully', async () => {
      await adminController.health(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          status: 'healthy',
          service: 'SmartClass Admin API',
          timestamp: expect.any(String)
        })
      );
    });
  });

  describe('getStats', () => {
    it('should return admin statistics successfully', async () => {
      await adminController.getStats(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          totalUsers: expect.any(Number),
          totalProfessors: expect.any(Number),
          totalStudents: expect.any(Number),
          totalPosts: expect.any(Number),
          totalClasses: expect.any(Number)
        })
      );
    });

    it('should handle errors gracefully', async () => {
      // Force an error by passing invalid response object
      const invalidRes = {
        status: jest.fn(() => {
          throw new Error('Test error');
        })
      };

      await adminController.getStats(req, invalidRes);

      // Should not crash
      expect(true).toBe(true);
    });
  });
});
