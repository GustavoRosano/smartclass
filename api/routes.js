//import express from 'express';
const express = require('express');  
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

const routes = express.Router()

//ROTAS PARA  USER
routes.get('/users/login', getUserLogin);
routes.post('/users', postUser);
routes.get('/users', getUser);
routes.get('/users/:id', getUserId);
routes.put('/users/:id', putUser);
routes.delete('/users/:id', deleteUser);


//ROTA POST
routes.get('/posts', getPosts);
routes.get('/posts/:id', getPostId);
routes.post('/posts', postPosts);
routes.put('/posts/:id', putPost);
routes.delete('/posts/:id', deletePost);


module.exports = routes;