
# SmartClass – Tech Challenge Fase 03

O **SmartClass** é um projeto desenvolvido como parte do **Tech Challenge – Fase 03** da Pós-Tech FIAP (Full Stack Development).  
Seu objetivo é entregar uma interface gráfica moderna, responsiva e eficiente para uma aplicação educacional, permitindo que **professores** e **alunos** acessem e interajam com conteúdos através de páginas diferenciadas e personalizadas.

O sistema foi construído com **Next.js**, utilizando **TypeScript**, **Material UI**, **SCSS Modules** e arquitetura baseada em componentes funcionais. O projeto fornece um front-end organizado, modular e pronto para integração total com os endpoints REST do backend.

A aplicação foi publicada na Vercel com o objetivo de otimizar a entrega e proporcionar um ambiente de testes mais acessível: [https://smartclass-fase-3.vercel.app/](SmartClass)

---

## 📘 1. Visão Geral do Projeto

Segundo o documento do Tech Challenge Fase 3:

> “Desenvolver uma interface gráfica robusta, intuitiva e eficiente para uma aplicação de blogging, oferecendo uma excelente experiência para professores(as) e estudantes.”

O SmartClass fornece:

- Tela de login com autenticação  
- Perfis distintos para **professores** e **alunos**  
- Interface responsiva  
- Layout moderno com MUI e SCSS  
- Controle de acesso com Context API  
- Página inicial personalizada por perfil  
- Componentização organizada para evolução futura  

---

## ⚙️ 2. Tecnologias Utilizadas

| Tecnologia | Descrição |
|-----------|-----------|
| **Next.js 16 (App Router)** | Framework principal |
| **React 19** | Biblioteca de UI |
| **TypeScript** | Tipagem estática |
| **Material UI (MUI)** | Componentes estilizados |
| **SCSS Modules** | Estilos modularizados |
| **Context API** | Autenticação e estado global |
| **LocalStorage** | Persistência de sessão |

---

## 🏗️ 3. Arquitetura do Projeto

A aplicação segue estrutura baseada no App Router do Next.js:

```
app/
 ├─ auth/
 │   └─ AuthContext.tsx
 ├─ Login/
 │   └─ index.tsx
 ├─ professor/
 │   └─ page.tsx
 ├─ aluno/
 │   └─ page.tsx
 ├─ ClassCard/
 │   └─ component.tsx
 ├─ ClientLayout.tsx
 ├─ layout.tsx
 ├─ page.tsx
 └─ globals.css
```

---

## 🧪 4. Funcionalidades Implementadas

### ✔ Login
- Estilização com MUI
- Campos personalizados via SCSS e MUI
- Persistência da sessão
- Tratamento de erros

### ✔ Perfis Separados
Cada tipo de usuário possui sua própria interface:

- **Professor:** Acesso a gerenciamento de conteúdos  
- **Aluno:** Acesso à visualização de aulas  

### ✔ Interface de Aulas
- Cards de aula
- Botão para criar nova aula

### ✔ Responsividade
- Layout fluido para telas pequenas e grandes

---

## 🚀 5. Como Rodar o Projeto

### ⬇️ Instale as dependências

```bash
npm install
```

### ▶️ Rode o servidor de desenvolvimento

```bash
npm run dev
```

Acesse no navegador:

👉 http://localhost:3000

---

## 📝 6. Usuários para testar

Lista de usuários para que seja possível testar o sistema:

> Usuário 1 (Aluno):
- **Email:** aluno@teste.com
- **Senha:** 123456

> Usuário 2 (Professor):
- **Email:** professor@teste.com
- **Senha:** 123456

## 📝 6. Considerações Finais

O SmartClass fornece uma base robusta para o Tech Challenge Fase 03, combinando:

- arquitetura organizada  
- autenticação confiável  
- responsividade  
- perfis personalizados  
- estrutura pronta para integração total com backend  

Um projeto escalável, moderno e alinhado às necessidades da Fiap.