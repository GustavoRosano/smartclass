import { AuthService } from '../auth.service'

describe('AuthService', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    jest.clearAllMocks()
  })

  describe('login', () => {
    it('should return user on valid credentials', async () => {
      const result = await AuthService.login('aluno@teste.com', '123456')
      
      expect(result.success).toBe(true)
      expect(result.user).toBeDefined()
      expect(result.user?.email).toBe('aluno@teste.com')
      expect(result.user?.role).toBe('student')
    })

    it('should return error on invalid credentials', async () => {
      const result = await AuthService.login('invalid@email.com', 'wrong')
      
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
      expect(result.user).toBeUndefined()
    })

    it('should handle professor login', async () => {
      const result = await AuthService.login('professor1@teste.com', '123456')
      
      expect(result.success).toBe(true)
      expect(result.user?.role).toBe('teacher')
    })
  })

  describe('logout', () => {
    it('should clear localStorage on logout', () => {
      AuthService.logout()
      
      expect(localStorage.removeItem).toHaveBeenCalledWith('user')
    })
  })

  describe('getCurrentUser', () => {
    it('should return null when no user is stored', () => {
      localStorage.getItem.mockReturnValue(null)
      
      const user = AuthService.getCurrentUser()
      
      expect(user).toBeNull()
    })

    it('should return user from localStorage', () => {
      const mockUser = { email: 'test@test.com', role: 'student', name: 'Test' }
      localStorage.getItem.mockReturnValue(JSON.stringify(mockUser))
      
      const user = AuthService.getCurrentUser()
      
      expect(user).toEqual(mockUser)
    })

    it('should handle invalid JSON in localStorage', () => {
      localStorage.getItem.mockReturnValue('invalid-json')
      
      const user = AuthService.getCurrentUser()
      
      expect(user).toBeNull()
    })
  })

  describe('saveUser', () => {
    it('should save user to localStorage', () => {
      const mockUser = { email: 'test@test.com', role: 'student', name: 'Test' }
      
      AuthService.saveUser(mockUser)
      
      expect(localStorage.setItem).toHaveBeenCalledWith('user', JSON.stringify(mockUser))
    })
  })
})
