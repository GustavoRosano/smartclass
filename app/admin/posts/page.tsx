'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/app/auth/AuthContext'
import { PostService, Post } from '@/app/services/post.service'
import Loading from '@/app/components/UI/Loading'
import ErrorMessage from '@/app/components/UI/ErrorMessage'
import EmptyState from '@/app/components/UI/EmptyState'
import styles from './styles.module.scss'
import AddIcon from '@mui/icons-material/Add'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'

export default function AdminPostsPage() {
  const { user } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    if (!user || (user.role !== 'professor' && user.role !== 'admin')) {
      router.push('/')
      return
    }
    loadPosts()
  }, [user])

  const loadPosts = async () => {
    try {
      setLoading(true)
      setError(null)
      // Admin vê todos os posts, professor vê apenas os seus
      const userId = user?.role === 'professor' ? user.id : undefined
      const data = await PostService.getAll(false, userId)
      setPosts(data)
    } catch (err) {
      console.error('Erro ao carregar posts:', err)
      setError('Erro ao carregar posts. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Deseja realmente excluir "${title}"?`)) return

    try {
      await PostService.delete(id)
      alert('Post excluído com sucesso!')
      loadPosts()
    } catch (err) {
      console.error('Erro ao excluir post:', err)
      alert('Erro ao excluir post. Tente novamente.')
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/teacher-edit-class?id=${id}`)
  }

  const handleNewPost = () => {
    router.push('/new-class')
  }

  if (loading) return <Loading />
  if (error) return <ErrorMessage message={error} onRetry={loadPosts} />
  if (posts.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState 
          title="Nenhum Post Encontrado"
          message="Nenhum post cadastrado ainda." 
          actionLabel="Criar Novo Post"
          onAction={handleNewPost}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Gerenciar Posts</h1>
        <button className={styles.addButton} onClick={handleNewPost}>
          <AddIcon />
          Nova Aula
        </button>
      </div>

      <div className={styles.postsGrid}>
        {posts.map((post) => (
          <div key={post.id} className={styles.postCard}>
            <div className={styles.imageContainer}>
              <img 
                src={post.urlImage || '/placeholder.jpg'} 
                alt={post.title}
                className={styles.postImage}
              />
            </div>
            
            <div className={styles.postContent}>
              <h3 className={styles.postTitle}>{post.title}</h3>
              <p className={styles.postExcerpt}>
                {post.content.substring(0, 150)}
                {post.content.length > 150 ? '...' : ''}
              </p>
              {post.createdAt && (
                <p className={styles.postDate}>
                  Criado em: {new Date(post.createdAt).toLocaleDateString('pt-BR')}
                </p>
              )}
            </div>

            <div className={styles.actions}>
              <button 
                className={styles.editButton}
                onClick={() => handleEdit(post.id)}
                title="Editar"
              >
                <EditIcon />
                Editar
              </button>
              <button 
                className={styles.deleteButton}
                onClick={() => handleDelete(post.id, post.title)}
                title="Excluir"
              >
                <DeleteIcon />
                Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
