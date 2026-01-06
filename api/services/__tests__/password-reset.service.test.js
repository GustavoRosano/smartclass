const passwordResetService = require('../../../services/password-reset.service');

describe('Password Reset Service', () => {
  const testEmail = 'test@example.com';
  const testUserId = 'test-user-id';

  beforeEach(() => {
    // Clean up any existing tokens before each test
    passwordResetService.cleanExpiredTokens();
  });

  describe('generateResetToken', () => {
    it('should generate a valid reset token', async () => {
      const result = await passwordResetService.generateResetToken(testEmail, testUserId);
      
      expect(result).toBeDefined();
      expect(result.token).toBeDefined();
      expect(result.token).toHaveLength(64); // 32 bytes in hex = 64 characters
      expect(result.expiresAt).toBeDefined();
      
      const expiresDate = new Date(result.expiresAt);
      const now = new Date();
      const diffMinutes = (expiresDate - now) / 1000 / 60;
      
      // Token should expire in approximately 60 minutes
      expect(diffMinutes).toBeGreaterThan(59);
      expect(diffMinutes).toBeLessThan(61);
    });

    it('should invalidate previous token when generating new one', async () => {
      const firstToken = await passwordResetService.generateResetToken(testEmail, testUserId);
      const secondToken = await passwordResetService.generateResetToken(testEmail, testUserId);
      
      // First token should now be invalid
      const firstValidation = await passwordResetService.validateResetToken(firstToken.token);
      expect(firstValidation).toBeNull();
      
      // Second token should be valid
      const secondValidation = await passwordResetService.validateResetToken(secondToken.token);
      expect(secondValidation).toBeDefined();
      expect(secondValidation.email).toBe(testEmail);
    });
  });

  describe('validateResetToken', () => {
    it('should return user data for valid token', async () => {
      const { token } = await passwordResetService.generateResetToken(testEmail, testUserId);
      
      const result = await passwordResetService.validateResetToken(token);
      
      expect(result).toBeDefined();
      expect(result.email).toBe(testEmail);
      expect(result.userId).toBe(testUserId);
    });

    it('should return null for invalid token', async () => {
      const result = await passwordResetService.validateResetToken('invalid-token');
      
      expect(result).toBeNull();
    });

    it('should return null for expired token', async () => {
      const { token } = await passwordResetService.generateResetToken(testEmail, testUserId);
      
      // Manually expire the token
      const tokenData = passwordResetService.resetTokens.get(testEmail);
      tokenData.expiresAt = new Date(Date.now() - 1000); // 1 second in the past
      
      const result = await passwordResetService.validateResetToken(token);
      
      expect(result).toBeNull();
    });
  });

  describe('invalidateToken', () => {
    it('should invalidate a valid token', async () => {
      const { token } = await passwordResetService.generateResetToken(testEmail, testUserId);
      
      // Token should be valid before invalidation
      let result = await passwordResetService.validateResetToken(token);
      expect(result).toBeDefined();
      
      // Invalidate the token
      await passwordResetService.invalidateToken(testEmail);
      
      // Token should now be invalid
      result = await passwordResetService.validateResetToken(token);
      expect(result).toBeNull();
    });
  });

  describe('cleanExpiredTokens', () => {
    it('should remove expired tokens', async () => {
      // Generate multiple tokens
      await passwordResetService.generateResetToken('user1@example.com', 'user1');
      await passwordResetService.generateResetToken('user2@example.com', 'user2');
      await passwordResetService.generateResetToken('user3@example.com', 'user3');
      
      // Manually expire some tokens
      const token1Data = passwordResetService.resetTokens.get('user1@example.com');
      token1Data.expiresAt = new Date(Date.now() - 1000);
      
      const token2Data = passwordResetService.resetTokens.get('user2@example.com');
      token2Data.expiresAt = new Date(Date.now() - 1000);
      
      // Clean expired tokens
      await passwordResetService.cleanExpiredTokens();
      
      // Expired tokens should be removed
      expect(passwordResetService.resetTokens.has('user1@example.com')).toBe(false);
      expect(passwordResetService.resetTokens.has('user2@example.com')).toBe(false);
      
      // Valid token should remain
      expect(passwordResetService.resetTokens.has('user3@example.com')).toBe(true);
    });
  });
});
