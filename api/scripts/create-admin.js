/**
 * Script para criar usuário Administrador no sistema SmartClass
 * 
 * Uso:
 * cd api
 * node scripts/create-admin.js
 * 
 * Cria um usuário admin diretamente no banco de dados MongoDB
 */

const bcrypt = require('bcrypt');
const api = require('../middle.axios');

async function createAdmin() {
  console.log('🔧 Iniciando criação do Administrador...\n');

  const adminData = {
    name: 'Administrador',
    email: 'admin@smartclass.com',
    password: await bcrypt.hash('admin123', 10),
    role: 'admin',
    mobilePhone: 11999999999,
    isActive: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  try {
    // Verificar se admin já existe
    console.log('🔍 Verificando se admin já existe...');
    const response = await api.get('/users', {
      params: { email: adminData.email }
    });
    
    if (response.data && response.data.length > 0) {
      console.log('❌ Usuário administrador já existe!');
      console.log('📧 Email:', response.data[0].email);
      console.log('👑 Role:', response.data[0].role);
      console.log('🆔 ID:', response.data[0]._id);
      console.log('\n💡 Use as credenciais existentes para fazer login.');
      return;
    }

    console.log('✅ Admin não existe, criando...');

    // Criar admin
    const createResponse = await api.post('/users', adminData);
    
    console.log('\n✅ Administrador criado com sucesso!');
    console.log('='.repeat(60));
    console.log('📧 Email: admin@smartclass.com');
    console.log('🔒 Senha: admin123');
    console.log('👑 Role: admin');
    console.log('🆔 ID:', createResponse.data._id || createResponse.data.id);
    console.log('='.repeat(60));
    console.log('\n💡 Faça login com essas credenciais para acessar o painel administrativo.');
    console.log('🌐 URL: http://localhost:3000/Login\n');

  } catch (error) {
    console.error('❌ Erro ao criar administrador:', error.message);
    
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Detalhes:', error.response.data);
    }

    console.log('\n💡 Dicas de troubleshooting:');
    console.log('  1. Verifique se o backend está rodando');
    console.log('  2. Verifique a URL da API externa em api/middle.axios.js');
    console.log('  3. Teste manualmente: curl https://smartclass-backend-4dra.onrender.com/users');
  }
}

// Executar
createAdmin()
  .then(() => {
    console.log('✅ Script finalizado.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Erro fatal:', err);
    process.exit(1);
  });
