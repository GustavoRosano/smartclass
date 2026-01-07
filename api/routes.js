//import express from 'express';
const express = require('express');  

// Resource imports (legacy - manter para compatibilidade)
const  { getUserLogin,
         postUser,
         getUser,
         getUserId,
         putUser,
         deleteUser
        } = require('./resource/user.resource');

const { postPosts,
        getPostsIsActive,
        getPosts,
        getPostId,
        putPost,
        deletePost 
       } = require('./resource/post.resource'); 

// Controller imports (novo padrão MVC)
const authController = require('./controllers/auth.controller');
const studentController = require('./controllers/student.controller');
const classController = require('./controllers/class.controller');
const teacherController = require('./controllers/teacher.controller');
const adminController = require('./controllers/admin.controller');
const uploadController = require('./controllers/upload.controller');

// Middleware imports
const { authenticate, optionalAuth } = require('./middlewares/auth.middleware');
const { 
  authorizeAdmin, 
  authorizeTeacher,
  authorize 
} = require('./middlewares/authorization.middleware');

const routes = express.Router()

// ============================================================================
// UPLOAD ROUTES (Upload de Imagens)
// ============================================================================
console.log('[Routes] ✅ Registrando rota de Upload:');
console.log('[Routes]    POST   /api/upload');

routes.post('/upload', 
  authenticate, 
  authorizeTeacher, 
  uploadController.upload.single('image'), 
  uploadController.uploadImage
);

// ============================================================================
// AUTH ROUTES (Autenticação e Recuperação de Senha)
// ============================================================================
routes.post('/auth/login', authController.login);
routes.post('/auth/forgot-password', authController.forgotPassword);
routes.post('/auth/validate-reset-token', authController.validateToken);
routes.post('/auth/reset-password', authController.resetPasswordHandler);
routes.post('/auth/logout', authenticate, authController.logout);

// ============================================================================
// STUDENT ROUTES (Gerenciamento de Alunos)
// ============================================================================
console.log('[Routes] ✅ Registrando rotas de Students:');
console.log('[Routes]    POST   /api/students');
console.log('[Routes]    GET    /api/students');

// Professor e Admin podem criar/listar alunos
routes.post('/students', authenticate, authorizeTeacher, studentController.createStudent);
routes.get('/students', authenticate, authorizeTeacher, studentController.listStudents);
routes.get('/students/:id', authenticate, authorizeTeacher, studentController.getStudent);

// Apenas Admin pode atualizar/deletar
routes.put('/students/:id', authenticate, authorizeAdmin, studentController.updateStudent);
routes.delete('/students/:id', authenticate, authorizeAdmin, studentController.deleteStudentHandler);

// ============================================================================
// CLASS ROUTES (Gerenciamento de Aulas/Turmas)
// ============================================================================
console.log('[Routes] ✅ Registrando rotas de Classes:');
console.log('[Routes]    POST   /api/classes');
console.log('[Routes]    GET    /api/classes');

// Criar aula - Professor ou Admin
routes.post('/classes', authenticate, authorizeTeacher, classController.createClass);

// Listar e buscar classes - Qualquer usuário autenticado
routes.get('/classes', optionalAuth, classController.listClasses);
routes.get('/classes/:id', optionalAuth, classController.getClass);

// Atualizar/Deletar - Dono ou Admin (verificação no controller)
routes.put('/classes/:id', authenticate, classController.updateClassHandler);
routes.delete('/classes/:id', authenticate, classController.deleteClassHandler);

// ============================================================================
// ENROLLMENT ROUTES (Sistema de Matrículas)
// ============================================================================
// Aluno solicita matrícula
routes.post('/classes/:id/enroll', authenticate, authorize(['aluno']), classController.enrollInClass);

// Professor visualiza solicitações pendentes (verificação de dono no controller)
routes.get('/classes/:id/pending', authenticate, authorizeTeacher, classController.getPendingEnrollments);

// Professor aprova/rejeita matrícula (verificação de dono no controller)
routes.put('/classes/:id/approve/:studentId', authenticate, authorizeTeacher, classController.approveEnrollment);
routes.put('/classes/:id/reject/:studentId', authenticate, authorizeTeacher, classController.rejectEnrollment);

// Remover aluno da classe
routes.delete('/classes/:id/students/:studentId', authenticate, authorizeTeacher, classController.removeStudent);

// ============================================================================
// TEACHER ROUTES (Gerenciamento de Professores - Admin only)
// ============================================================================
routes.get('/teachers', authenticate, authorizeAdmin, teacherController.listTeachers);
routes.get('/teachers/:id', authenticate, authorizeAdmin, teacherController.getTeacher);

// ============================================================================
// ADMIN ROUTES (Utilitários Administrativos)
// ============================================================================
// Health check - público (não requer autenticação)
routes.get('/admin/health', adminController.checkAdminExists);

// Estatísticas do sistema - Admin only
routes.get('/admin/stats', authenticate, authorizeAdmin, adminController.getSystemStats);

// ============================================================================
// LEGACY USER ROUTES (Manter para compatibilidade com frontend existente)
// ============================================================================
routes.get('/users/login', getUserLogin);
routes.post('/users', postUser);
routes.get('/users', getUser);
routes.get('/users/:id', getUserId);
routes.put('/users/:id', putUser);
routes.delete('/users/:id', deleteUser);

// ============================================================================
// LEGACY POST ROUTES (Manter para compatibilidade com frontend existente)
// ============================================================================
routes.get('/posts', getPosts);
routes.get('/posts/:id', getPostId);
routes.post('/posts', postPosts);
routes.put('/posts/:id', putPost);
routes.delete('/posts/:id', deletePost);


module.exports = routes;