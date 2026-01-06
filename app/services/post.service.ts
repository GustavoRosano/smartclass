import api from '../lib/axios';

export type Post = {
  id: string;
  title: string;
  author: string;
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
      // Validações
      const errors: string[] = [];
      
      if (!post.title || post.title.trim().length < 3) {
        errors.push('Título deve ter no mínimo 3 caracteres');
      }
      
      if (!post.author || post.author.trim().length < 3) {
        errors.push('Autor deve ter no mínimo 3 caracteres');
      }
      
      if (!post.content || post.content.trim().length < 10) {
        errors.push('Conteúdo deve ter no mínimo 10 caracteres');
      }
      
      if (errors.length > 0) {
        throw new Error(errors.join(', '));
      }

      console.log('[PostService] 📞 POST /posts com dados:', {
        title: post.title,
        author: post.author,
        userId: post.userId,
        hasImage: !!post.urlImage
      });

      const response = await api.post<{ postCreated: Post }>('/api/posts', post);
      
      console.log('[PostService] ✅ Post criado com sucesso:', response.data.postCreated.id);
      
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
