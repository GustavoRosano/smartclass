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

console.log('[Server] ✅ Montando rotas em /api');
api.use("/api/", routes); 

api.listen(PORT, () => {
  console.log(`✅ API disponível em ${_URL}:${PORT}/api`);
  console.log(`[Server] Rotas disponíveis:`);
  console.log(`  - POST ${_URL}:${PORT}/api/students`);
  console.log(`  - GET  ${_URL}:${PORT}/api/students`);
  console.log(`  - POST ${_URL}:${PORT}/api/classes`);
  console.log(`  - GET  ${_URL}:${PORT}/api/classes`);
});
 module.exports = { api };