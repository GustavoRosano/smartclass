import api from '../lib/axios';

export type Post = {
  id: string;
  title: string;
  content: string;
  userId: string;
  urlImage: string;
  posted: boolean;
  excluded: boolean;
  createdAt?: string;
};

export type PostInput = Omit<Post, 'id'>;

export const PostService = {
  async getAll(excludedOnly: boolean = false, userId?: string): Promise<Post[]> {
    try {
      const params: any = excludedOnly ? { excluded: 'true' } : {};
      if (userId) {
        params.userId = userId;
      }
      const response = await api.get<{ posts: Post[] }>('/api/posts', { params });
      return response.data.posts || [];
    } catch (error) {
      console.error('[PostService] Erro ao buscar posts:', error);
      throw new Error('Não foi possível carregar os posts');
    }
  },

  async getById(id: string): Promise<Post> {
    try {
      const response = await api.get<Post>(`/api/posts/${id}`);
      return response.data;
    } catch (error) {
      console.error('[PostService] Erro ao buscar post:', error);
      throw new Error('Post não encontrado');
    }
  },

  async create(post: PostInput): Promise<Post> {
    try {
      const response = await api.post<{ postCreated: Post }>('/api/posts', post);
      return response.data.postCreated;
    } catch (error) {
      console.error('[PostService] Erro ao criar post:', error);
      throw new Error('Não foi possível criar o post');
    }
  },

  async update(id: string, post: Partial<PostInput>): Promise<Post> {
    try {
      const response = await api.put<{ post: Post }>(`/api/posts/${id}`, post);
      return response.data.post;
    } catch (error) {
      console.error('[PostService] Erro ao atualizar post:', error);
      throw new Error('Não foi possível atualizar o post');
    }
  },

  async delete(id: string): Promise<void> {
    try {
      await api.delete(`/api/posts/${id}`);
    } catch (error) {
      console.error('[PostService] Erro ao excluir post:', error);
      throw new Error('Não foi possível excluir o post');
    }
  }
};
