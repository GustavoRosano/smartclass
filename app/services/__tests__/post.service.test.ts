import { PostService } from '../post.service'
import axios from 'axios'

jest.mock('axios')
const mockedAxios = axios as jest.Mocked<typeof axios>

describe('PostService', () => {
  const mockPosts = [
    {
      id: '1',
      title: 'Test Post 1',
      content: 'Content 1',
      userId: 'professor1@teste.com',
      urlImage: 'image1.jpg',
      posted: true,
      excluded: false,
    },
    {
      id: '2',
      title: 'Test Post 2',
      content: 'Content 2',
      userId: 'professor2@teste.com',
      urlImage: 'image2.jpg',
      posted: true,
      excluded: false,
    },
  ]

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getAll', () => {
    it('should fetch all posts successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: { posts: mockPosts } })

      const result = await PostService.getAll()

      expect(result).toEqual(mockPosts)
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/posts'))
    })

    it('should return empty array on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Network error'))

      const result = await PostService.getAll()

      expect(result).toEqual([])
    })
  })

  describe('getById', () => {
    it('should fetch post by id successfully', async () => {
      mockedAxios.get.mockResolvedValue({ data: { post: mockPosts[0] } })

      const result = await PostService.getById('1')

      expect(result).toEqual(mockPosts[0])
      expect(mockedAxios.get).toHaveBeenCalledWith(expect.stringContaining('/api/posts/1'))
    })

    it('should return null on error', async () => {
      mockedAxios.get.mockRejectedValue(new Error('Not found'))

      const result = await PostService.getById('999')

      expect(result).toBeNull()
    })
  })

  describe('create', () => {
    it('should create post successfully', async () => {
      const newPost = {
        title: 'New Post',
        content: 'New Content',
        userId: 'professor1@teste.com',
        urlImage: 'new.jpg',
      }
      const createdPost = { ...newPost, id: '3', posted: true, excluded: false }

      mockedAxios.post.mockResolvedValue({ data: { post: createdPost } })

      const result = await PostService.create(newPost)

      expect(result).toEqual(createdPost)
      expect(mockedAxios.post).toHaveBeenCalledWith(
        expect.stringContaining('/api/posts'),
        newPost
      )
    })

    it('should return null on error', async () => {
      mockedAxios.post.mockRejectedValue(new Error('Create failed'))

      const result = await PostService.create({
        title: 'Test',
        content: 'Test',
        userId: 'test',
        urlImage: 'test.jpg',
      })

      expect(result).toBeNull()
    })
  })

  describe('update', () => {
    it('should update post successfully', async () => {
      const updates = { title: 'Updated Title' }
      const updatedPost = { ...mockPosts[0], ...updates }

      mockedAxios.put.mockResolvedValue({ data: { post: updatedPost } })

      const result = await PostService.update('1', updates)

      expect(result).toEqual(updatedPost)
      expect(mockedAxios.put).toHaveBeenCalledWith(
        expect.stringContaining('/api/posts/1'),
        updates
      )
    })

    it('should return null on error', async () => {
      mockedAxios.put.mockRejectedValue(new Error('Update failed'))

      const result = await PostService.update('1', { title: 'Test' })

      expect(result).toBeNull()
    })
  })

  describe('delete', () => {
    it('should delete post successfully', async () => {
      mockedAxios.delete.mockResolvedValue({ data: { success: true } })

      const result = await PostService.delete('1')

      expect(result).toBe(true)
      expect(mockedAxios.delete).toHaveBeenCalledWith(
        expect.stringContaining('/api/posts/1')
      )
    })

    it('should return false on error', async () => {
      mockedAxios.delete.mockRejectedValue(new Error('Delete failed'))

      const result = await PostService.delete('999')

      expect(result).toBe(false)
    })
  })
})
