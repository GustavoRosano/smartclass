/**
 * Script para gerar hash bcrypt da senha do administrador
 * 
 * Uso:
 * node scripts/generate-admin-hash.js
 * 
 * O hash gerado deve ser inserido no MongoDB na collection 'users'
 */

const bcrypt = require('bcrypt');

async function generateAdminHash() {
  const password = 'admin123';
  const saltRounds = 10;
  
  try {
    const hash = await bcrypt.hash(password, saltRounds);
    
    console.log('='.repeat(60));
    console.log('HASH GERADO PARA SENHA DO ADMINISTRADOR');
    console.log('='.repeat(60));
    console.log('\nSenha:', password);
    console.log('Hash:', hash);
    console.log('\n');
    console.log('Documento MongoDB para inserir:');
    console.log('='.repeat(60));
    console.log(JSON.stringify({
      "_id": "admin-001",
      "name": "Administrador",
      "email": "admin@smartclass.com",
      "password": hash,
      "mobilePhone": 11999999999,
      "isActive": true,
      "role": "admin",
      "createdAt": new Date().toISOString(),
      "updatedAt": new Date().toISOString(),
      "__v": 0
    }, null, 2));
    console.log('='.repeat(60));
    console.log('\nInserir este documento na collection "users" do MongoDB');
    console.log('Backend: https://smartclass-backend-4dra.onrender.com');
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('Erro ao gerar hash:', error);
  }
}

generateAdminHash();
