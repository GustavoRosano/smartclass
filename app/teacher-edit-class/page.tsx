'use client';

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PostService, Post } from "../services/post.service";
import Loading from "../components/UI/Loading";
import ErrorMessage from "../components/UI/ErrorMessage";
import TeacherEditClass from "./index";
import { ClassContent } from "../types/ClassContent";

export default function TeacherEditClassPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const postId = searchParams.get('id');
  
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) {
      setError("ID do post não fornecido");
      setLoading(false);
      return;
    }

    loadPost();
  }, [postId]);

  const loadPost = async () => {
    if (!postId) return;

    try {
      setLoading(true);
      const data = await PostService.getById(postId);
      setPost(data);
    } catch (err) {
      console.error('Erro ao carregar post:', err);
      setError('Erro ao carregar post. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loading message="Carregando post..." />;
  if (error) return (
    <ErrorMessage 
      message={error} 
      onRetry={postId ? loadPost : undefined}
    />
  );
  if (!post) return <ErrorMessage message="Post não encontrado" />;

  // Converte Post para ClassContent
  const classData: ClassContent = {
    id: post.id,
    matter: "Geral",
    classNumber: "Aula",
    title: post.title,
    teacher: post.userId,
    image: post.urlImage,
    content: [
      {
        type: "text",
        value: post.content
      }
    ]
  };

  return <TeacherEditClass classData={classData} />;
}
