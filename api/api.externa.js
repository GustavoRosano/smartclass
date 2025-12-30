//import axios from 'axios';
const axios = require('axios');

const api = axios.create({
    baseURL: 'https:smartclass-backend-4dra.onrender.com' //'http://localhost:3002'
});

module.exports = api;