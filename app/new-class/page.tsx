'use client';

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import styles from './styles.module.scss';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Alert from '@mui/material/Alert';
import "react-quill-new/dist/quill.snow.css";
import { PostService } from "../services/post.service";
import { useAuth } from "../auth/AuthContext";
import Loading from "../components/UI/Loading";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

export default function NewClass() {
  const { user } = useAuth();
  const router = useRouter();
  
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState(user?.name || "");
  const [tag, setTag] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [selectedImageName, setSelectedImageName] = useState<string>("");

  // ✅ CORREÇÃO: Cleanup de blob URLs ao desmontar
  useEffect(() => {
    return () => {
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  // Validações
  const isTitleValid = title.trim().length >= 3;
  const isAuthorValid = author.trim().length >= 3;
  const isTagValid = tag.trim().length >= 2;
  const isContentValid = content.trim().length >= 10;
  const isFormValid = isTitleValid && isAuthorValid && isTagValid && isContentValid;

  async function uploadImage(file: File): Promise<string> {
    try {
      console.log('[NewClass] 📤 Iniciando upload da imagem...');
      
      const formData = new FormData();
      formData.append('image', file);
      
      const api = (await import('../lib/axios')).default;
      const response = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      console.log('[NewClass] ✅ Upload concluído:', response.data.url);
      return response.data.url;
      
    } catch (err: any) {
      console.error('[NewClass] ❌ Erro no upload:', err);
      throw new Error(err.response?.data?.message || 'Erro ao fazer upload da imagem');
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      setError("Selecione apenas arquivos de imagem");
      return;
    }

    // Validar tamanho (5MB)
    if (file.size > 5 * 1024 * 1024) {
      setError("Imagem muito grande. Máximo: 5MB");
      return;
    }

    setImageFile(file);
    setSelectedImageName(file.name);

    // ✅ CORREÇÃO: Criar preview apenas no browser
    if (typeof window !== 'undefined') {
      // Revogar blob anterior
      if (imagePreview && imagePreview.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview);
      }
      
      const preview = URL.createObjectURL(file);
      setImagePreview(preview);
    }
  }

  async function handleSave() {
    if (!isFormValid) {
      setError("Preencha todos os campos corretamente");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // ✅ CORREÇÃO: Upload real da imagem
      let finalImageUrl = "/classes/banner-aula-1.png";
      
      if (imageFile) {
        console.log('[NewClass] 📤 Fazendo upload da imagem antes de salvar...');
        finalImageUrl = await uploadImage(imageFile);
      }

      await PostService.create({
        title,
        author,
        content,
        userId: user?.id || user?.email || "unknown",
        urlImage: finalImageUrl,
        posted: true,
        excluded: false
      });

      setSuccess(true);
      setTimeout(() => {
        router.push('/admin');
      }, 2000);

    } catch (err: any) {
      setError(err.message || "Erro ao salvar post");
    } finally {
      setLoading(false);
    }
  }

  const modules: Record<string, unknown> = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link"],
      [{ align: [] }],
      ["clean"],
    ],
  };

  if (loading) return <Loading message="Salvando post..." />;

  return (
    <div className={styles.newClassPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Nova Aula</h1>

        {error && <Alert severity="error" sx={{ marginBottom: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ marginBottom: 2 }}>Post criado com sucesso! Redirecionando...</Alert>}
        {selectedImageName && (
          <Alert severity="info" sx={{ marginBottom: 2 }}>
            Arquivo selecionado: {selectedImageName}
          </Alert>
        )}

        <div className={styles.imageContainer}>
          <label htmlFor="imageUpload" className={styles.imageSelector}>
            {imagePreview ? (
              <img src={imagePreview} alt="Preview da aula" />
            ) : (
              <span>Clique para selecionar a imagem</span>
            )}
          </label>

          <input
            id="imageUpload"
            type="file"
            accept="image/*"
            hidden
            onChange={handleImageChange}
          />

          <div className={styles.titleInputsContainer}>
            <div className={styles.titleInput}>
              <TextField 
                label="Título da aula" 
                fullWidth 
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                error={title.length > 0 && !isTitleValid}
                helperText={title.length > 0 && !isTitleValid ? "Mínimo 3 caracteres" : ""}
              />
            </div>

            <div className={styles.author}>
              <div className={styles.tagInput}>
                <TextField 
                  label="Tag" 
                  fullWidth 
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  error={tag.length > 0 && !isTagValid}
                  helperText={tag.length > 0 && !isTagValid ? "Mínimo 2 caracteres" : ""}
                />
              </div>
              <div className={styles.authorInput}>
                <TextField 
                  label="Autor" 
                  fullWidth 
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  error={author.length > 0 && !isAuthorValid}
                  helperText={author.length > 0 && !isAuthorValid ? "Mínimo 3 caracteres" : ""}
                />
              </div>
            </div>
          </div>
        </div>

        <div className={styles.editorContainer}>
          <label className={styles.editorLabel}>Conteúdo da aula</label>

          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            placeholder="Escreva o conteúdo completo da aula aqui..."
          />
          
          {content.length > 0 && !isContentValid && (
            <p className={styles.editorError}>Conteúdo muito curto (mínimo 10 caracteres)</p>
          )}
        </div>

        <div className={styles.actions}>
          <Button 
            variant="outlined" 
            onClick={() => router.back()}
            className={styles.cancelButton}
          >
            Cancelar
          </Button>
          <Button 
            variant="contained" 
            onClick={handleSave}
            disabled={!isFormValid || loading}
            className={styles.saveButton}
          >
            Salvar Post
          </Button>
        </div>
      </div>
    </div>
  );
}