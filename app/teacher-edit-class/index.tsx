'use client';

import { useEffect, useState } from "react";
import { ClassContent } from "../types/ClassContent";
import dynamic from "next/dynamic";
import styles from './styles.module.scss';
import TextField from '@mui/material/TextField';
import "react-quill-new/dist/quill.snow.css";

const ReactQuill = dynamic(() => import("react-quill-new"), {
  ssr: false,
});

type Props = {
  classData: ClassContent;
};

function classContentToHtml(content: ClassContent["content"]) {
  return content
    .map(block => {
      switch (block.type) {
        case "title":
          return `<h1>${block.value}</h1>`;
        case "subtitle":
          return `<h2>${block.value}</h2>`;
        case "text":
          return `<p>${block.value}</p>`;
        case "link":
          return `<p><a href="${block.value}" target="_blank">${block.value}</a></p>`;
        default:
          return "";
      }
    })
    .join("");
}

export default function TeacherEditClass({ classData }: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(classData.image);
  const [title, setTitle] = useState(classData.title);
  const [author, setAuthor] = useState(classData.teacher);
  const [tag, setTag] = useState(classData.classNumber);
  const [content, setContent] = useState("");

  useEffect(() => {
    setContent(classContentToHtml(classData.content));
  }, [classData]);

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  }

  const modules = {
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
              <TextField
                label="Título da aula"
                fullWidth
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className={styles.author}>
              <div className={styles.tagInput}>
                <TextField
                  label="Tag"
                  fullWidth
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>
              <div className={styles.authorInput}>
                <TextField
                  label="Autor"
                  fullWidth
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
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
        </div>

      </div>
    </div>
  );
}