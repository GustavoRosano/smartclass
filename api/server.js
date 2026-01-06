const express = require('express');
const cors = require('cors'); 
const routes = require('./routes');

const api = express();
const PORT = process.env.PORT || 3002;
const _URL = process.env.HOST || 'http://localhost';

api.use(express.json());
api.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

 
api.use("/api/", routes); 

api.listen(PORT, () => {
  console.log(`Servidor Express rodando em ${_URL}:${PORT}`);
});
 module.exports = { api };