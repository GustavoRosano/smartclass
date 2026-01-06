/**
 * Script para FORÇAR criação de Admin (sem verificação)
 */

const axios = require('axios');

// Usar API local ao invés do middle.axios (que pode apontar para Render)
const api = axios.create({
  baseURL: 'http://localhost:3002/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

async function forceCreateAdmin() {
  console.log('🚀 Forçando criação do Administrador...\n');
  
  const adminData = {
    name: 'Administrador',
    username: 'admin',
    email: 'admin@smartclass.com',
    password: 'admin123',  // Senha sem hash - deixar backend fazer
    role: 'admin',
    isActive: true
  };

  console.log('📤 Dados que serão enviados:');
  console.log(JSON.stringify(adminData, null, 2));
  console.log('\n📡 Fazendo POST para /users...\n');

  try {
    const response = await api.post('/users', adminData);
    
    console.log('\n✅ Administrador criado com sucesso!');
    console.log('='.repeat(60));
    console.log('\n📧 Email: admin@smartclass.com');
    console.log('🔒 Senha: admin123');
    console.log('👑 Role: admin');
    console.log('\n='.repeat(60));
    console.log('\n🌐 Faça login em: http://localhost:3000/Login\n');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Dados:', error.response.data);
    }
    process.exit(1);
  }
}

forceCreateAdmin();
