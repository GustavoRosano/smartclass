'use client';

import { useState } from "react";
import dynamic from "next/dynamic";
import styles from './styles.module.scss';
import TextField from '@mui/material/TextField';
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

export default function NewClass() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [content, setContent] = useState<string>("");

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
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

  return (
    <div className={styles.newClassPage}>
      <div className={styles.container}>

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
              <TextField label="Título da aula" fullWidth />
            </div>

            <div className={styles.author}>
              <div className={styles.tagInput}>
                <TextField label="Tag" fullWidth />
              </div>
              <div className={styles.authorInput}>
                <TextField label="Autor" fullWidth />
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
        </div>

      </div>
    </div>
  );
}