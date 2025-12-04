const express = require('express');
const cors = require('cors'); 
const routes = require('./routes');

const api = express();
const PORT = 3002;
const _URL = 'http://localhost';

api.use(express.json());
api.use(cors());

 
api.use("/api/", routes); 

api.listen(PORT, () => {
  console.log(`Servidor Express rodando em ${_URL}:${PORT}`);
});
 module.exports = { api };