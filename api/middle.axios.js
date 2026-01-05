const axios = require('axios');

const BASE_URL = process.env.JSON_SERVER_URL || 'https://smartclass-backend-4dra.onrender.com';

const api = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

module.exports = api;